# Este Script Python remove microcélula uma a uma (necessário executar MainTrigger para atualizar o gráfico)

import numpy as np
import sys

# Receber parâmetros da linha de comando
if len(sys.argv) < 3:
    print("Uso: python RemoveEachMicroCell.py <X> <Y>")
    sys.exit(1)

X = float(sys.argv[1])  # Coordenada X da Microcélula
Y = float(sys.argv[2])  # Coordenada Y da Microcélula

# Carrega o arquivo com os pontos das microcélulas armazenadas
vtBsMicro = np.load('ListMicroCell.npy')

RemoveMicro = X + 1j*Y
if (RemoveMicro in vtBsMicro):
    vtBsMicro = np.delete (vtBsMicro, RemoveMicro)
vtBsMicro = np.array (vtBsMicro)
np.save('ListMicroCell.npy', vtBsMicro)