const files = {
  zipcodes: [
    `country_code`,
    `postal_code`,
    `place_name`,
    `admin_name1`,
    `admin_code1`,
    `admin_name2`,
    `admin_code2`,
    `admin_name3`,
    `admin_code3`,
    `latitude`,
    `longitude`,
    `accuracy`
  ],
  locations: [
    `geonameid`,
    `name`,
    `asciiname`,
    `alternatenames`,
    `latitude`,
    `longitude`,
    `feature_class`,
    `feature_code`,
    `country_code`,
    `admin_code1`,
    `admin_code2`,
    `admin_code3`,
    `admin_code4`,
    `population`,
    `elevation`,
    `dem`,
    `cc2`,
    `timezone`,
    `modification_date`,
  ]
}
const tables = {
  zipcodes: [
    `id`,
    ...files.zipcodes
  ],
  locations: [
    `id`,
      ...files.locations
  ]
}


module.exports = {
  files,
  tables
};