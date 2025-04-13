# Este Script Python aciona a função fGenerateGraph, que gera dados dos gráficos

import numpy as np
from fGenerateGraph import GenerateGraph
import sys
import os

# Receber parâmetros da linha de comando
if len(sys.argv) < 5:
    print("Uso: python MainTrigger.py <frequência> <raio> <resolução> <potência_macro>")
    sys.exit(1)

dFc = float(sys.argv[1])  # Frequência da portadora (MHz)
dR = float(sys.argv[2])  # Raio do hexágono (m)
dPasso = float(sys.argv[3]) # Resolução do Grid (m)
dPtdBm = float(sys.argv[4]) # EIRP em dBm (incluindo ganho e perdas)
dPtdBmMicro = 0 # EIRP em dBm (incluindo ganho e perdas) para microcélulas
# Carrega o arquivo com os pontos das microcélulas armazenadas
try:
    vtBsMicro = np.load(os.path.join(os.path.dirname(__file__), 'ListMicroCell.npy'))
except FileNotFoundError:
    vtBsMicro = np.empty((0, 3))  # Matriz vazia com 3 colunas (x, y, power)

# Separar posições e potências
if len(vtBsMicro) > 0:
    microcell_positions = vtBsMicro[:, :2]  # Colunas 0 e 1 (x, y)
    microcell_powers = vtBsMicro[:, 2]  # Coluna 2 (power)
else:
    microcell_positions = []
    microcell_powers = []

# Chamada da função que gera os pontos dos gráficos
GenerateGraph(dFc, dR, dPtdBm, dPtdBmMicro, vtBsMicro,dPasso) 