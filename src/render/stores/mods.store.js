import { derived, writable, get } from 'svelte/store';
import {getMods} from '../services/beatmod-api'


function resolveMods() {
    return Promise.all([
        getMods(),
        window.api.invoke('getAllInstalledMods')
    ]).then(([allMods, installedMods]) => {
        const allModsMap = allMods.reduce((acc, curr) => {
            acc[curr.name] = curr;
            return acc;
        }, {})

        const installedModsMap = installedMods.reduce((acc, curr) => {
            acc[curr.name] = curr;
            return acc;
        }, {})

        return [allModsMap, installedModsMap]
    }).then(([allMods, installedMods]) => {
        for(let key in allMods) {
            if(installedMods[key]) {
                allMods[key].installed = true;
                allMods[key].installedVersion = installedMods[key].version;
                allMods[key].installedId = installedMods[key].id;
            }
        }
        return Object.values(allMods)
    })
}

function createModsStore() {

    const store = writable([])
    const { set, update, subscribe } = store;

    function installMod(mod) {
        return window.api.invoke("installMod", { mod })
            .then(() => resolveMods())
            .then(mods => {
                set(mods);
            })
    }

    function uninstallMod(mod) {
        return window.api.invoke("uninstallMod", { mod })
            .then(() => resolveMods())
            .then(mods => {
                set(mods);
            })
    }

    resolveMods()
        .then(mods => {
            set(mods);
        })

    return {
        installMod,
        uninstallMod,
        subscribe
    }

}


export const modsStore = createModsStore();