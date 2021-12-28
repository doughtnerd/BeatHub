
exports.seed = function(knex) {
  return knex('library').insert(
    {
      key: '2144',
      song_title: 'Shut Up and Dance',
      song_author: 'Walk the Moon',
      uploader: 'BennyDaBeast',
      disk_location: '/Users/ccarlson/Desktop/Beatsaber/Beat Saber_Data/CustomLevels/2144 (Shut Up and Dance - bennydabeast)',
      added_at: '12/24/2021',
    }
  )
};
