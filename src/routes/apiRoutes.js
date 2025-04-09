const express = require('express');
const router = express.Router();
const { executePython } = require('../utils/executePython');

// !rotas temporárias, ajusatar depois para os links corretos e os nomes corretos dos arquivos python

// rota para add microcelula - parametros { raio, coordenadas(objeto com x e y), potencia} 
router.post('/add_microcelula', (req, res) => {
    const { raio, coordenadas, potencia } = req.body;
    if (!raio || !coordenadas || !potencia) {
        return res.status(400).json({ error: 'Parâmetros "raio", "coordenadas" e "potencia" são obrigatórios.' });
    }
    executePython('', [raio, coordenadas, potencia], res);
});

// rota para deletar uma microcelula - parametro { coordenadas(objeto com x e y) }
router.delete('/delete_microcelula', (req, res) => {
    const { coordenadas } = req.body;
    if (!coordenadas) {
        return res.status(400).json({ error: 'Parâmetro "coordenadas" é obrigatório.' });
    }
    executePython('', [coordenadas], res);
});

// rota para deletar todas as microcelulas - parametro {coordenadas}?
router.delete('/delete_all_microcelulas', (req, res) => {
    executePython('', [], res);
});

// rota para calcular a potencia da macrocélula - parametros {raio, coordenadas, potencia, passo}
router.post('/calculo_potencia_macrocélula', (req, res) => {
    const { raio, coordenadas, potencia, passo } = req.body;
    if (!raio || !coordenadas || !potencia || !passo) {
        return res.status(400).json({ error: 'Parâmetros "raio", "coordenadas", "potencia" e "passo" são obrigatórios.' });
    }
    executePython('', [raio, coordenadas, potencia, passo], res);
});

// rota para calcular a potencia da microcelula - parametros {raio, coordenadas, potencia}
router.post('/calculo_potencia_microcelula', (req, res) => {
    const { raio, coordenadas, potencia } = req.body;
    if (!raio || !coordenadas || !potencia) {
        return res.status(400).json({ error: 'Parâmetros "raio", "coordenadas" e "potencia" são obrigatórios.' });
    }
    executePython('', [raio, coordenadas, potencia], res);
});

// rota para calcular taxa de outage macrocélula - parametros ?
router.post('/calculo_taxa_outage_macrocélula', (req, res) => {
    const { raio, coordenadas, potencia } = req.body;
    if (!raio || !coordenadas || !potencia) {
        return res.status(400).json({ error: 'Parâmetros "raio", "coordenadas" e "potencia" são obrigatórios.' });
    }
    executePython('', [raio, coordenadas, potencia], res);
});

// rota para calcular taxa de outage microcélula - parametros ?
router.post('/calculo_taxa_outage_microcelula', (req, res) => {
    const { raio, coordenadas, potencia } = req.body;
    if (!raio || !coordenadas || !potencia) {
        return res.status(400).json({ error: 'Parâmetros "raio", "coordenadas" e "potencia" são obrigatórios.' });
    }
    executePython('', [raio, coordenadas, potencia], res);
});

module.exports = router;