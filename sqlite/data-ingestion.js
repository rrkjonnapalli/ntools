const fs = require('fs');
const readline = require('readline');
const { ulid } = require('ulid');
const Database = require('better-sqlite3');
const CONSTANTS = require('./constants');
const { tables } = require('./columns');

const startTime = new Date();
console.log(`Started at - ${startTime}`);
console.time('Time fo data ingestion');
// const db$ingestion = new Database(CONSTANTS.INGESTION_DB, { verbose: console.log });
const db$locations = new Database(CONSTANTS.LOCATIONS_DB, {
  // verbose: console.log 
});
db$locations.pragma('auto_vacuum = FULL');
db$locations.pragma('journal_mode = WAL');

const batchSize = 100000;
let insertCount = 0;

// const statement = db.prepare('SELECT * FROM locations');
// const locations = statement.all();
// console.log(locations);

console.log(`INSERT INTO locations (${tables.locations.join(', ')}) VALUES (${tables.locations.map(e => '?').join(', ')})`);
const statements = {
  ZIPCODE_INSERT: db$locations.prepare(`INSERT INTO zipcodes (${tables.zipcodes.join(', ')}) VALUES (${tables.zipcodes.map(e => '?').join(', ')})`),
  LOCATION_INSERT: db$locations.prepare(`INSERT INTO locations (${tables.locations.join(', ')}) VALUES (${tables.locations.map(e => '?').join(', ')})`)
}

/**
 * 
 * 
 * SET THIS BEFORE YOU RUN
 * 
 * 
 */
const filepath = CONSTANTS.LOCATIONS_PATH;
const statement = statements.LOCATION_INSERT;

console.log(`Starting with following values`);
console.log(`filepath - ${filepath}`);
console.log(`--- - ---`);


// Create a readable stream from the file
const fileStream = fs.createReadStream(filepath);

// Create an instance of readline
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity // To handle CR LF correctly (Windows line endings)
});

// Read file line by line
rl.on('line', (line) => {
  // console.log(`Line from file: ${line}`);
  const filedata = line.split('\t');
  const data = [ulid(), ...filedata];
  // console.log(data);
  statement.run(...data);
  insertCount += 1;
  if (insertCount % batchSize === 0) {
    console.log(`Inserted +${batchSize} records, total records - ${insertCount}`);
  }
  // console.log(result);
  // process.exit(0);
  // Process the line as needed
});

// Handle close and error events
rl.on('close', () => {
  console.log(`Total records - ${insertCount}`);
  console.log('File reading completed.');
  console.timeEnd('Time fo data ingestion');
  console.log(`Completed at - ${new Date()}`);
});

rl.on('error', (err) => {
  console.log(`Total records - ${insertCount}`);
  console.error(err);
  console.timeEnd('Time fo data ingestion');
  console.log(`Failed at - ${new Date()}`);
});

