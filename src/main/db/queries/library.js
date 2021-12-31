function getAllSongs(knex) {
  return knex('library').select().orderBy('song_title')  
}

function getSongByFolderHash(knex, hash) {
  return knex('library').select().where('folder_hash', hash).first()
}

function getSongsByHash(knex, hashes) {
  return knex('library').select('folder_hash').whereIn('hash', hashes)
}

function getSongsByKeys(knex, keys) {
  return knex('library').whereIn('key', keys)
}

function getAllDiskLocations(knex) {
  return knex('library').select('disk_location').distinct()
}

function getSongByHash(knex, hash) {
  return knex('library').where({folder_hash: hash}).first()
}

function getSongsPage(knex, pageNumber, pageSize) {
  const offset = (pageNumber - 1) * pageSize
  return knex('library').select().orderBy('added_at', 'desc').offset(offset).limit(pageSize)
}

function getSongsByUploader(knex, uploader) {
  return knex('library').select().where({uploader: uploader}).orderBy('song_title')
}

function getSongsByAuthor(knex, author) {
  return knex('library').select().where({song_author: author}).orderBy('song_title')
}

function getUploaders(knex) {
  return knex('library').select(knex.raw('lower(??) AS uploader', ['uploader'])).distinct().orderBy('uploader')
}

function getSongAuthors(knex) {
  return knex('library').select('song_author').distinct().orderBy('song_author')
}

function getSongByKey(knex, key) {
  return knex('library').where({key}).first()
}

function getSongByKeyAndName(knex, key, name) {
  return knex('library').where({key, song_title: name}).first()
}

function insertSong(knex, song) {
  return knex('library').insert(song)
}

function insertSongs(knex, songs) {
  return knex('library').insert(songs)
}

function deleteSongByKeyAndName(knex, key, name) {
  return knex('library').where({key, song_title: name}).del()
}

function deleteSongByFolderHash(knex, hash) {
  return knex('library').where({folder_hash: hash}).del()
}

function deleteSongsByFilesLocations(knex, locations) {
  return knex('library').whereIn('disk_location', locations).del()
}

function findSongByKeyAndName(knex, key, name) {
  return knex('library').where({key, song_title: name}).first()
}

function querySongByText(knex, text) {
  return knex('library')
    .where('song_title', 'like', `%${text}%`)
    .orWhere('song_author', 'like', `%${text}%`)
    .orWhere('uploader', 'like', `%${text}%`)
    .orWhere('key', 'like', `%${text}%`)
}

module.exports = {
  getAllSongs,
  getAllDiskLocations,
  getSongsPage,
  getSongByKey,
  getSongsByHash,
  getSongByFolderHash,
  getSongsByKeys,
  getSongByHash,
  getSongByKeyAndName,
  getSongsByUploader,
  getSongsByAuthor,
  getUploaders,
  getSongAuthors,
  insertSong,
  insertSongs,
  deleteSongByKeyAndName,
  deleteSongsByFilesLocations,
  deleteSongByFolderHash,
  findSongByKeyAndName,
  querySongByText,
}