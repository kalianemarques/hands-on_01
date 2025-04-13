# Este script python adiciona uma microcélula (necessário executar MainTrigger para atualizar o gráfico)

import numpy as np
import sys

# Receber parâmetros da linha de comando
if len(sys.argv) < 3:
    print("Uso: python AddEachMicroCell.py <X> <Y> <Power>")
    sys.exit(1)

X = float(sys.argv[1])  # Coordenada X da microcélula
Y = float(sys.argv[2])  # Coordenada Y da microcélula
Power = float(sys.argv[3])  # Potência da Microcélula

# Carregar o arquivo existente ou criar um novo
try:
    vtBsMicro = np.load('ListMicroCell.npy')
    if vtBsMicro.size == 0:
        vtBsMicro = np.empty((0, 3))
except FileNotFoundError:
    vtBsMicro = np.empty((0, 3))  # Matriz vazia com 3 colunas (x, y, power)

# Adicionar a nova microcélula
new_microcell = np.array([[X, Y, Power]])
vtBsMicro = np.vstack([vtBsMicro, new_microcell])

np.save('ListMicroCell.npy', vtBsMicro)
