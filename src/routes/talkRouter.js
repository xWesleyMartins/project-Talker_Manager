const express = require('express');
const readTalkerData = require('../utils/readTalkerData');

const router = express.Router();

router.get('/talker', async (_req, res) => {
  const result = await readTalkerData.readTalker();
  return res.status(200).json(result);
});

module.exports = router;
