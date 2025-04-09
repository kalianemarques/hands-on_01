# Este Script Python aciona a função fGenerateGraph, que gera dados dos gráficos

import numpy as np
from fGenerateGraph import GenerateGraph
import sys

# Receber parâmetros da linha de comando
if len(sys.argv) < 5:
    print("Uso: python MainTrigger.py <frequência> <raio> <resolução> <potência_macro>")
    sys.exit(1)

dFc = float(sys.argv[1])  # Frequência da portadora (MHz)
dR = float(sys.argv[2])  # Raio do hexágono (m)
dPasso = float(sys.argv[3]) # Resolução do Grid (m)
dPtdBm = float(sys.argv[4]) # EIRP em dBm (incluindo ganho e perdas)

# Carrega o arquivo com os pontos das microcélulas armazenadas
vtBsMicro = np.load('ListMicroCell.npy') 

# Chamada da função que gera os pontos dos gráficos
GenerateGraph(dFc, dR, dPtdBm, dPtdBmMicro, vtBsMicro,dPasso) 