import { Knex } from "knex";


export function getAllInstalledMods(knex: Knex): Promise<any[]> {
  return knex('installed_mods').select('*');
}

export function getInstalledModById(knex: Knex, id: string): Promise<any> {
  return knex('installed_mods').where('id', id).first();
}

export function insertInstalledMod(knex: Knex, installedMod: any): Knex.QueryBuilder<any, any> {
  return knex('installed_mods').insert(installedMod);
}

export function updateInstalledMod(knex: Knex, id: string, installedMod: any): Promise<any> {
  return knex('installed_mods').where('id', id).update(installedMod);
}

export function deleteInstalledMod(knex: Knex, id: string): Promise<any> {
  return knex('installed_mods').where('id', id).del();
}