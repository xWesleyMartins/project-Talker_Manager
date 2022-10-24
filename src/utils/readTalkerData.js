const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { join } = require('path');
// const talkerJson = require('../talker.json');

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
  }
}

async function writeTalkers(newPersonTalker) {
  try {
    await fs.writeFile(join(__dirname, '../talker.json'), JSON.stringify(newPersonTalker));
  } catch (error) {
    console.log('erro ao escrever arquivo', error.message);
    return null;
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
// - 5 
function tokenAuthorization(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) return res.status(401).json({ message: 'Token inválido' });
  next();
}
function validPlaceName(req, res, next) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length <= 2) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}
function validPlaceAge(req, res, next) {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
}
function validPlaceTalk(req, res, next) {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
}
function validPlaceWatchedAt(req, res, next) {
  const { watchedAt } = req.body.talk;
  const dateFormat = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/; // regex ref: https://stackoverflow.com/questions/5465375/javascript-date-regex-dd-mm-yyyy
  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  if (!watchedAt.match(dateFormat)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
}

function validPlaceRate(req, res, next) {
  const { rate } = req.body.talk;
  if (rate < 1 || rate > 5) { 
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (!rate) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  next();
}
// 5º vvv
  const addNewTalkerData = async (name, age, talk) => {
    const talkerJson = await readTalker();
    const id = talkerJson.length + 1;
    const result = { id, name, age, talk };
    await writeTalkers([...talkerJson, result]);
    return result;
};
// ^^^

// 6º vvv
const editForId = async (id, name, age, talk) => {
  const talkerJson = await readTalker();
  const filterId = talkerJson.filter((talker) => Number(talker.id) !== Number(id));
  const result = { id: Number(id), name, age, talk };
  await writeTalkers([...filterId, result]);
  return result;
};
// ^^^
const deletTalkerForId = async (id) => {
  const talkerJson = await readTalker();
  const filterId = talkerJson.filter((talker) => Number(talker.id) !== Number(id));
  await writeTalkers(filterId);
  return filterId;
};
module.exports = {
  readTalker,
  talkerId,
  tokenLogin,
  // 5º vvvv
  tokenAuthorization, 
  validPlaceName,
  validPlaceAge, 
  validPlaceTalk,
  validPlaceWatchedAt,
  validPlaceRate,
  writeTalkers,
  addNewTalkerData,
  // ^^^^^
  // 6º vvvv
  editForId,
  //   ^^^^
  // 7º vvvv
  deletTalkerForId,
  // ^^^^
  // validateEmail,
};