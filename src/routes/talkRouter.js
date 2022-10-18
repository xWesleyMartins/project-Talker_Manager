const express = require('express');
const readTalkerData = require('../utils/readTalkerData');

const router = express.Router();

router.get('/talker', async (_req, res) => {
  const result = await readTalkerData.readTalker();
  return res.status(200).json(result);
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
  const validEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
  return res.status(200).json({
    token: result,
  });
});

module.exports = router;
