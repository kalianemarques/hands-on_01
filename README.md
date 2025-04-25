# Hands-on 01 - Cálculos de Redes

Este projeto é uma aplicação web que realiza cálculos relacionados a redes de telecomunicações, como potência recebida e taxa de Outage a partir de dados de entrada utilizando o modelo Okumura-Hata.

---

## Pré-requisitos

Antes de começar, certifique-se de que sua máquina possui os seguintes softwares instalados:

1. **Node.js** (versão 14 ou superior)
   - [Download Node.js](https://nodejs.org/)
   - O Node.js é necessário para rodar o servidor da aplicação.

2. **Python** (versão 3.8 ou superior)
   - [Download Python](https://www.python.org/downloads/)
   - O Python é necessário para executar os cálculos matemáticos.

3. **Gerenciador de pacotes `pip`** (incluso no Python)
   - O `pip` será usado para instalar as bibliotecas Python necessárias.

4. **Bibliotecas Python necessárias**:
   - `numpy`
   - `matplotlib`
   - `plotly`

   Para instalar as bibliotecas, siga o passo 4 na seção "Como configurar o projeto".

---

## Como configurar o projeto

Siga os passos abaixo para configurar e iniciar a aplicação:

### Passo 1: Baixar o projeto

1. Faça o download do projeto clicando no botão "Code" no GitHub e selecionando "Download ZIP".
2. Extraia o conteúdo do arquivo ZIP para uma pasta de sua escolha.

**OU**

Se você tiver o Git instalado, clone o repositório:
```bash
git clone https://github.com/kalianemarques/hands-on_01.git
cd hands-on_01
```

---

### Passo 2: Instalar o Node.js

1. Acesse o site oficial do Node.js: [https://nodejs.org/](https://nodejs.org/).
2. Baixe e instale a versão LTS recomendada.
3. Após a instalação, verifique se o Node.js está funcionando:
   ```bash
   node -v
   ```
   O comando acima deve exibir a versão do Node.js instalada.

---

### Passo 3: Instalar o Python

1. Acesse o site oficial do Python: [https://www.python.org/downloads/](https://www.python.org/downloads/).
2. Baixe e instale a versão mais recente do Python 3.
3. Durante a instalação, marque a opção **"Add Python to PATH"**.
4. Após a instalação, verifique se o Python está funcionando:
   ```bash
   python --version
   ```
   O comando acima deve exibir a versão do Python instalada.

---

### Passo 4: Instalar as bibliotecas Python

1. Abra o terminal ou prompt de comando.
2. Instale as bibliotecas necessárias com o seguinte comando:
   ```bash
   pip install --user numpy matplotlib plotly
   ```
3. Verifique se as bibliotecas foram instaladas corretamente:
   ```bash
   pip show numpy matplotlib
   ```

---

### Passo 5: Configurar o projeto

1. Abra a pasta do projeto no terminal.
2. Instale as dependências do Node.js:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` com base no arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
4. Edite o arquivo `.env` e configure as variáveis de ambiente:
   ```properties
   PYTHON_PATH=C:\Users\SeuUsuario\AppData\Local\Programs\Python\Python39\python.exe
   PORT=3000
   ```
   Substitua o caminho acima pelo caminho do executável do Python na sua máquina.

---

### Passo 6: Iniciar a aplicação

1. No terminal, inicie o servidor Node.js:
   ```bash
   npm start
   ```
2. Abra o navegador e acesse:
   ```
   http://localhost:3000
   ```

---

## Como usar a aplicação

A aplicação possui três funcionalidades principais:

1. **Cálculo de Potência Recebida**:
   - Insira a resolução do grid, a frequência da portadora (MHz), o raio do hexagono (m) e a potência de transmissão (dBm).

2. **Cálculo de Outage**:
   - É calculado a partir dos parametros de entrada.

3. **Adição de microcélulas**:
   - Adicione a potência (dBm) e as coordenadas (X, Y) em que a microcélula deve ser posicionada.

---

## Estrutura do projeto

```
Hands-on_01/
├── public/                # Arquivos estáticos (frontend)
│   ├── index.html         # Página principal
│   ├── style.css          # Estilos CSS
│   ├── module             # scripts javaScript usados no frontend
│   │   ├── index.js           # Lógica do frontend
│   │   ├── requests.js        # Funções de requisição do frontend
│   │   ├── generateGraphic.js  # Funções de geração dos gráficos do frontend
├── src/
│   ├── functions/         # Scripts Python
│   │   ├── AddEachMicroCell.py    # Adiciona uma nova microcélula ao arquivo `ListMicroCell.npy` com as coordenadas (X, Y) e potência.
│   │   ├── ClearAllMicroCell.py   # Remove todas as microcélulas armazenadas no arquivo `ListMicroCell.npy`.
│   │   ├── fDrawSector.py         # Gera os vértices de um hexágono com base no raio e no centro fornecidos.
│   │   ├── fGenerateGraph.py      # Gera os dados para os gráficos de potência e taxa de outage com base nos parâmetros de entrada.
│   │   ├── fOutageCalculate.py    # Calcula a porcentagem de outage com base na potência recebida e na sensibilidade do receptor.
│   │   ├── ListMicroCell.npy      # Arquivo que armazena as microcélulas adicionadas (coordenadas e potência).
│   │   ├── MainTrigger.py         # Script principal que aciona a geração dos gráficos com base nos parâmetros fornecidos.
│   │   ├── RemoveEachMicroCell.py # Remove uma microcélula específica com base nas coordenadas (X, Y).
│   ├── routes/            # Rotas da API
│   │   ├── apiRoutes.js   # Rotas para comunicação com os scripts Python
│   ├── utils/             # Utilitários
│   │   ├── executePython.js # Função para executar scripts Python
├── server.js              # Configuração do servidor Node.js
├── .env                   # Configurações do ambiente
├── .env.example           # Exemplo de configuração do ambiente
├── package.json           # Dependências do Node.js
```

---

## Problemas comuns

1. **Erro: "PYTHON_PATH não configurado"**:
   - Certifique-se de que o caminho do Python está configurado corretamente no arquivo `.env`.

2. **Erro: "Bibliotecas Python não encontradas"**:
   - Certifique-se de que as bibliotecas `numpy` e `matplotlib` estão instaladas:
     ```bash
     pip install numpy matplotlib
     ```

3. **Porta em uso**:
   - Se a porta 3000 já estiver em uso, altere a variável `PORT` no arquivo `.env`:
     ```
     PORT=4000
     ```

