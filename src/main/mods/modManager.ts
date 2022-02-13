import { ipcMain } from "electron";
import { Knex } from "knex";
import { getAllInstalledMods, getInstalledModById, deleteInstalledMod, insertInstalledMod } from '../db/queries/installedMods';
import { rm } from 'fs/promises';
import { fork } from 'child_process';
import { downloadAsync, fetchHttps, getBeatSaberDirectory } from "../utils";
import { default as AdmZip } from 'adm-zip';
import { DepGraph } from 'dependency-graph';
import { ModAPIData, ModGraphData } from "./mod.type";
import * as semver from "semver";
import path from 'path'


type Right<T> = T;
type Left = Error;
type Either<T> = Left | Right<T>;

class UninstallModException extends Error {
  constructor(message: string) {
    super(message)
  }
}

/**
 * Handles the very obnoxious process of installing mods and resolving dependencies
 * 
 * @param dbConnection Connection to the DB used to store installed mod data
 * @param modToInstall The mod that is being requested for install
 * 
 * @returns Promise that resolves to true if the mod was installed.
 */
async function handleInstallMod(dbConnection: Knex, modToInstall: ModAPIData): Promise<boolean> {
  // Fetch mods and build dependency graph
  const allMods = await getMods("", "1.19.0");
  const graph = buildModDependencyGraph(allMods);

  if(graph instanceof Error) {
    throw graph;
  }

  // Get list of all mods that will need to be installed in order to install requested mod
  const modToInstallDeps = graph.dependenciesOf(modToInstall._id);
  const modsToInstall: ModGraphData[] = [
    (graph.getNodeData(modToInstall._id) as any), 
    ...modToInstallDeps.map(dep => (graph.getNodeData(dep) as any))
  ];

  // Remove mods that have either already been installed or are older versions of an already installed mod
  const installedMods = await getAllInstalledMods(dbConnection);
  const filteredInstalls = modsToInstall.filter((mod: ModGraphData) => {
    const modWithSameName = installedMods.find(m => m.name === mod.name);
    if(modWithSameName) {
      return semver.gt(mod.version, modWithSameName.version) 
    } else {
      return true
    }
  })

  // Download all the mods
  const modDownloads = await Promise.all(filteredInstalls.map(mod => {
    return new Promise((resolve, reject) => {
      downloadAsync('https://beatmods.com' + mod.downloadUrl).then(buffer =>{
        resolve([mod, buffer]);
      })
    })
  }))

  const beatSaberDir = await getBeatSaberDirectory(dbConnection);

  // Extract all the mods, return tuple of (mod, extracted_path, extracted_files)
  const modExtracts = modDownloads.map(([mod, buffer]) => {
    const zip = new AdmZip(buffer);
    const diskLocation = mod.name === 'BSIPA' ? beatSaberDir : `${beatSaberDir}/IPA/Pending`
    zip.extractAllTo(diskLocation, true);
    return [mod, diskLocation, zip.getEntries().filter(z => !z.isDirectory).map(entry => entry.entryName)];
  })

  // Insert all installed the mods into the database
  const dbInserts = modExtracts.map(([mod, diskLocation, extracted_files]) => {
    const dbEntry = {
      id: mod.id,
      name: mod.name,
      description: mod.description,
      category: mod.category,
      version: mod.version,
      game_version: mod.game_version,
      extracted_files
    }

    return insertInstalledMod(dbConnection, dbEntry).onConflict('id').merge().onConflict(['name']).merge();
  })

  await Promise.all(dbInserts)

  return true;
}


// TODO: Need to handle situation where the mod is installed but not activated. The mod will be in the IPA/Pending directory in this case, not where this function thinks.

/**
 * 
 * @param dbConnection 
 * @param mod 
 * @returns 
 */
async function handleUninstallMod(dbConnection, mod): Promise<boolean> {
  const allMods = await getMods("", "1.19.0");

  let graphResult = buildModDependencyGraph(allMods);
 
  if(graphResult instanceof Error) {
    throw graphResult;
  }

  const dependants = graphResult.dependantsOf(mod._id);
  
  const installedMods = await getAllInstalledMods(dbConnection);
  const installedDependants = dependants.map(modId => installedMods.find(installedMod => modId === installedMod.id)?.id).filter(i => i);

  if(installedDependants.length) {
    throw new UninstallModException(`Cannot uninstall mod ${mod.name} because it is depended on by ${installedDependants.map(dep => graphResult.getNodeData(dep).name).join(', ')}`)
  }

  const installedMod = await getInstalledModById(dbConnection, mod._id);
  const beatSaberDir = await getBeatSaberDirectory(dbConnection);
  if(installedMod) {
    const extractedFiles = (installedMod.extracted_files as string).split(',');

    for (const file of extractedFiles) {
      await rm(path.join(beatSaberDir, file), { recursive: true, force: true });
      await deleteInstalledMod(dbConnection, mod._id);
    }

    return true;
  }
  return false;
}

function allModDepsToList(mod): string[] {
  const modId = typeof mod === 'string' ? mod : mod._id;
  if(mod.dependencies) {
    const deps = (mod.dependencies as any[]).map((val, idx, arr) => {
      if(typeof val === 'string') {
        return val;
      } else {
        return allModDepsToList(val);
      }
    })
    return [modId, ...deps.flat()];
  } else {
    
    return [modId];
  }
}

function getMods(searchText = "", gameVersion = "1.19.0", sortOption = "category_lower"): Promise<ModAPIData[]> {
  const uri = `https://beatmods.com/api/v1/mod?search=${searchText}&status=&gameVersion=${gameVersion}&sort=${sortOption}&sortDirection=1`
  return fetchHttps(uri).then((res: string) => JSON.parse(res))
}

function buildModDependencyGraph(mods: ModAPIData[]): Either<DepGraph<ModGraphData>> {
  const graph = new DepGraph<ModGraphData>({circular: false})

  mods.forEach(mod => {
    graph.addNode(mod._id, {
      id: mod._id,
      name: mod.name,
      description: mod.description,
      category: mod.category,
      version: mod.version,
      game_version: mod.gameVersion,
      updated_date: mod.updatedDate,
      downloadUrl: mod.downloads[0]?.url || "",
    })
  });

  mods.forEach(mod => {
    mod.dependencies.forEach(dep => {
        try {
          graph.addDependency(mod._id, dep._id);
        } catch (err) {
          return new Error(`${mod.name} depends on ${dep.name} which does not have a version compatible with Beat Saber version: ${mod.gameVersion}`)
        }
      })
    })


  return graph
}



export function register(dbConnection: Knex): void {
  ipcMain.handle('getAllInstalledMods', () => getAllInstalledMods(dbConnection));

  ipcMain.handle('uninstallMod', (event, { mod }) => handleUninstallMod(dbConnection, mod))

  ipcMain.handle('installMod', (event, { mod }) => handleInstallMod(dbConnection, mod) )
}