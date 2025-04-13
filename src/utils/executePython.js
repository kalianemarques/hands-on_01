// filepath: c:\Users\Administrador\Desktop\DCO1020\projeto01\src\utils\executePython.js
const { spawn } = require('child_process');
const path = require('path');

function executePython(script, params, res) {
    const pythonPath = process.env.PYTHON_PATH; // Caminho absoluto do Python configurado no .env
    const scriptPath = path.join(__dirname, '..', 'functions', script); // Caminho do script Python
    const scriptDir = path.dirname(scriptPath); // Diretório do script
    const pythonProcess = spawn(pythonPath, [scriptPath, ...params], { cwd: scriptDir });

    let output = ''; // Variável para armazenar a saída do script Python

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const result = output ? JSON.parse(output) : { status: 'success' }; // Tratar saída vazia
                res.json(result);
            } catch (err) {
                console.error(`Erro ao processar a saída do script Python: ${err}`);
                res.status(500).json({ error: 'Erro ao processar a saída do script Python.' });
            }
        } else {
            res.status(500).json({ error: 'Erro ao executar o script Python.' });
        }
    });
}

module.exports = { executePython };