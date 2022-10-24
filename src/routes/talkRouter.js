const express = require('express');
const readTalkerData = require('../utils/readTalkerData');

const router = express.Router();

router.get('/talker', async (_req, res) => {
  const result = await readTalkerData.readTalker();
  return res.status(200).json(result);
});

router.get('/talker/search', 
  readTalkerData.tokenAuthorization,
  async (req, res) => {
    const query = req.query.q;
    console.log(query);
    const talkerJson = await readTalkerData.readTalker();
      if (!query) {
        return res.status(200).json(talkerJson);
      }
    const filterQuery = talkerJson.filter((queryParam) => queryParam.name.includes(query));
      console.log(filterQuery);
    return res.status(200).json(filterQuery);
  });

router.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await readTalkerData.talkerId(Number(id));
    if (!result) {
      return res.status(404).json({ 
        message: 'Pessoa palestrante não encontrada',
      });
    }
  return res.status(200).json(result);
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
// valida email
  const validEmailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/; // ref: https://medium.com/shopify-hub/como-validar-cpf-e-cnpj-usando-express%C3%B5es-regulares-regex-com-javascript-60779229455d
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!email.match(validEmailFormat)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
}
// valida PassWord
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length <= 5) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  const result = readTalkerData.tokenLogin(email, password);
  return res.status(200).json({ token: result });
});

router.post('/talker', 
  readTalkerData.tokenAuthorization,
  readTalkerData.validPlaceName,
  readTalkerData.validPlaceAge,
  readTalkerData.validPlaceTalk,
  readTalkerData.validPlaceWatchedAt,
  readTalkerData.validPlaceRate,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const result = await readTalkerData.addNewTalkerData(name, age, talk);
  console.log(name, age, talk);

  return res.status(201).json(result);
});

router.put('/talker/:id', 
  readTalkerData.tokenAuthorization,
  readTalkerData.validPlaceName,
  readTalkerData.validPlaceAge,
  readTalkerData.validPlaceTalk,
  readTalkerData.validPlaceWatchedAt,
  readTalkerData.validPlaceRate,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const { id } = req.params;
  const result = await readTalkerData.editForId(id, name, age, talk);
  return res.status(200).json(result);
});

router.delete('/talker/:id', 
  readTalkerData.tokenAuthorization,
  async (req, res) => {
    const { id } = req.params;
    await readTalkerData.deletTalkerForId(id);
    res.status(204).json();
  });

module.exports = router;
