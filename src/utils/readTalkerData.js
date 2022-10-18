const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// midleware
async function readTalker() {
  try {
    // const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const data = path.resolve(__dirname, '../talker.json');
    const fsData = await fs.readFile(data);
    const result = await JSON.parse(fsData);
    return result;
  } catch (error) {
    console.log(`Erro ao ler os dados ${error.message}`);
      // return null; // testando retornando null ao invez do console.log
  }
}
// 2
 async function talkerId(id) {
  const result = await readTalker();
  const findById = result.find((element) => element.id === parseInt(id, 10));
    return findById;
}
// 3
function tokenLogin(email, password) {
  const genToken = crypto.randomBytes(8).toString('hex');
   if (email && password) { 
    return genToken;
  }
}

// function validateEmail(email) {
//   const validEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   if (!email) {
//     message: 'o campo email é obrigatório'
//   }
  
//   if (!email.match(validEmailFormat)) message: 'o campo email deve ter um email válido';
// }

module.exports = {
  readTalker,
  talkerId,
  tokenLogin,
  // validateEmail,
};