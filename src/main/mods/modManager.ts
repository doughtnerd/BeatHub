import { ipcMain } from "electron";
import { Knex } from "knex";
import { getAllInstalledMods, getInstalledModById, deleteInstalledMod, insertInstalledMod } from '../db/queries/installedMods';
import {rm } from 'fs/promises';
import { fork } from 'child_process';
import { download, getBeatSaberDirectory } from "../utils";
import {default as AdmZip} from 'adm-zip';

async function handleUninstallMod(dbConnection, mod) {
  const installedMod = await getInstalledModById(dbConnection, mod._id);
  if(installedMod) {
    const { disk_location } = installedMod;
    await rm(disk_location, { recursive: true, force: true });
    await deleteInstalledMod(dbConnection, mod._id);
    return true;
  }
  return false;
}

function downloadAsync(url): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    download(
      url,
      (bytesReceived, totalBytes) => {},
      buffer => {
        resolve(buffer as Buffer)
      },
      error => {
        reject(error)
      }
    )
  });
}

function gatherAllDependencies(mod) {
  if(mod.dependencies) {
    const deps = mod.dependencies.map(dependency => gatherAllDependencies(dependency))
    return typeof mod === "string" ? [mod, ...deps] : [mod._id, ...deps]
  } else {
    return typeof mod === "string" ? [mod] : [mod._id]
  }
}

async function handleInstallMod(dbConnection, modToInstall) {
  const beatSaberDir = await getBeatSaberDirectory(dbConnection);
  const deps = gatherAllDependencies(modToInstall).filter((v, i, a) => a.indexOf(v) === i)
  console.log(deps.flat(2))
  // const { dependencies } = modToInstall;
  // dependencies.push(modToInstall);

  // const allInstalls = dependencies.map(mod => {
  //   return downloadAsync('https://beatmods.com' + mod.downloads[0].url).then(buffer => {
  //     console.log(mod)
  //     const zip = new AdmZip(buffer);
  //     const diskLocation = `${beatSaberDir}/Beat Saber_Data/Mods/${mod.name}`
  //     zip.extractAllTo(diskLocation, true);

  //     const dbEntry = {
  //       id: mod._id,
  //       name: mod.name,
  //       description: mod.description,
  //       category: mod.category,
  //       version: mod.version,
  //       game_version: mod.gameVersion,
  //       updated_date: mod.updatedDate,
  //       disk_location: diskLocation
  //     }

  //     return insertInstalledMod(dbConnection, dbEntry).onConflict('id').merge()
  //   })
  // })

  // await Promise.all(allInstalls)
  return true;
}

export function register(dbConnection: Knex) {
  // const childProcess = fork(`${__dirname}/mod_installer.js`);

  ipcMain.handle('getAllInstalledMods', () => getAllInstalledMods(dbConnection));

  ipcMain.handle('uninstallMod', (event, { mod }) => handleUninstallMod(dbConnection, mod))

  ipcMain.handle('installMod', (event, { mod }) => handleInstallMod(dbConnection, mod) )
}