
exports.seed = function(knex) {
  return knex('library').insert(
    {
      key: '123abc',
      song_title: 'Mr. Brightside',
      song_author: 'The Killers',
      uploader: 'BennyDaBeast',
      disk_location: '/Users/ccarlson/Desktop/Beatsaber/Beatsaber_Data/CustomLevels/2144 (Shut Up and Dance - bennydabeast)',
      downloaded_at: '1/1/2021',
    }
  )
};
