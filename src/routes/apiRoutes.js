const express = require('express');
const router = express.Router();
const { executePython } = require('../utils/executePython');

router.post('/GenerateGraph', (req, res) => {
    const { frequency, radius, grid, EIRP } = req.body;
    if (!frequency || !radius || !grid || !EIRP) {
        return res.status(400).json({ error: 'Parâmetros "frequency", "radius", "grid", "EIRP" são obrigatórios.' });
    }
    executePython('MainTrigger.py', [frequency, radius, grid, EIRP], res);
});

router.post('/add_microcelula', (req, res) => {
    const { x, y, power } = req.body;
    if (!x || !y) {
        return res.status(400).json({ error: 'Parâmetros "x" e "y" são obrigatórios.' });
    }
    executePython('AddEachMicroCell.py', [x, y, power], res);
});

router.post('/delete_microcelula', (req, res) => {
    const { x, y } = req.body;
    if (!x || !y) {
        return res.status(400).json({ error: 'Parâmetros "x" e "y" são obrigatórios.' });
    }
    executePython('RemoveEachMicroCell.py', [x, y], res);
});

router.post('/delete_all_microcelula', (req, res) => {
    executePython('ClearAllMicroCell.py', [], res);
});

module.exports = router;