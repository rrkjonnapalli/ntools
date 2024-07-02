const { ulid } = require('ulid');
if (require.main === module) {
  const id = ulid();
  console.log(id);
}