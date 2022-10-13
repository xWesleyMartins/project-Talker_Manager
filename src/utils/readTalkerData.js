const fs = require('fs').promises;
const path = require('path');
// midleware
async function readTalker() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const result = await JSON.parse(data);
    console.log(result);
    return result;
  } catch (err) {
    console.log(`Erro ao ler os dados ${err.message}`);
  }
}

module.exports = {
  readTalker,
};