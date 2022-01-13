import { ipcMain } from "electron";
import { Knex } from "knex";
import { getAllInstalledMods, getInstalledModById, deleteInstalledMod, insertInstalledMod } from '../db/queries/installedMods';
import { rm } from 'fs/promises';
import { fork } from 'child_process';
import { downloadAsync, fetchHttps, getBeatSaberDirectory } from "../utils";
import { default as AdmZip } from 'adm-zip';
import { DepGraph } from 'dependency-graph';
import { ModAPIData, ModGraphData } from "./mod.type";

type Right<T> = T;
type Left = Error;
type Either<T> = Left | Right<T>;

class UninstallModException extends Error {
  constructor(message: string) {
    super(message)
  }
}

async function handleInstallMod(dbConnection: Knex, modToInstall: ModAPIData): Promise<boolean> {
  // Fetch mods and build dependency graph
  const allMods = await getMods("", "1.19.0");
  const graph = buildModDependencyGraph(allMods);

  // Get list of all mods that will need to be installed in order to install requested mod
  const modToInstallDeps = graph.dependenciesOf(modToInstall._id);
  const modsToInstall: ModGraphData[] = [
    (graph.getNodeData(modToInstall._id) as any), 
    ...modToInstallDeps.map(dep => (graph.getNodeData(dep) as any))
  ];

  // Check which mods are already installed
  const installedMods = await getAllInstalledMods(dbConnection);
  const filteredInstalls = modsToInstall.filter((mod: ModGraphData) => {
    return !installedMods.find(installedMod => installedMod.id === mod.id);
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
    const diskLocation = mod.name === 'BSIPA' ? beatSaberDir : `${beatSaberDir}/Beat Saber_Data/IPA/Pending`
    zip.extractAllTo(diskLocation, true);
    return [mod, diskLocation, zip.getEntries().filter(z => !z.isDirectory).map(entry => entry.entryName)];
  })

  // Insert all the mods into the database
  const dbInserts = modExtracts.map(([mod, diskLocation, files]) => {
    const dbEntry = {
      id: mod.id,
      name: mod.name,
      description: mod.description,
      category: mod.category,
      version: mod.version,
      game_version: mod.game_version,
      updated_date: mod.updated_date,
      disk_location: diskLocation,
      files,
      enabled: true,
    }

    return insertInstalledMod(dbConnection, dbEntry).onConflict('id').merge()
  })

  await Promise.all(dbInserts)

  return true;
}

async function handleUninstallMod(dbConnection, mod): Promise<boolean> {
  const allMods = await getMods("", "1.19.0");
  const graph = buildModDependencyGraph(allMods);

  const dependants = graph.dependantsOf(mod._id);

  if(dependants) {
    throw new UninstallModException(`Cannot uninstall mod ${mod.name} because it is depended on by ${dependants.map(dep => graph.getNodeData(dep).name).join(', ')}`)
  }

  const installedMod = await getInstalledModById(dbConnection, mod._id);
  if(installedMod) {
    const { disk_location } = installedMod;
    await rm(disk_location, { recursive: true, force: true });
    await deleteInstalledMod(dbConnection, mod._id);
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

function buildModDependencyGraph(mods: ModAPIData[]): DepGraph<ModGraphData> {
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
      graph.addDependency(mod._id, dep._id);
    })
  })

  return graph
}



export function register(dbConnection: Knex): void {
  // const childProcess = fork(`${__dirname}/mod_installer.js`);

  ipcMain.handle('getAllInstalledMods', () => getAllInstalledMods(dbConnection));

  ipcMain.handle('uninstallMod', (event, { mod }) => handleUninstallMod(dbConnection, mod))

  ipcMain.handle('installMod', (event, { mod }) => handleInstallMod(dbConnection, mod) )
}