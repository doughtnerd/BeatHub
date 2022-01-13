
export type ModGraphData = {
  id: string,
  name: string,
  description: string,
  category: string,
  version: string,
  game_version: string,
  updated_date: string,
  downloadUrl: string
}

export type ModAPIData = {
  _id: string,
  name: string,
  description: string,
  dependencies: ModAPIData[] | string[],
  category: string,
  version: string,
  gameVersion: string,
  updatedDate: string,
  downloads: {url: string}[]
}