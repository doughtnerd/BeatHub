export function hasSetting(knex, settingKey) {
	return knex("user_settings").where("setting_key", settingKey).first().then(function(result) {
		return result !== undefined;
	});
}

export function getSetting(knex, settingKey) {
	return knex("user_settings").where("setting_key", settingKey).first().then(function(result) {
		return result?.setting_value ?? "";
	});
}

export function setSetting(knex, settingKey, settingValue) {
	return knex("user_settings").insert({setting_key: settingKey, setting_value: settingValue}).onConflict("setting_key").merge();
}

// module.exports = {
//   hasSetting,
//   getSetting,
//   setSetting
// }