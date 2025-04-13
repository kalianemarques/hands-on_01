# Este script python adiciona uma microcélula

import numpy as np
import sys

# Receber parâmetros da linha de comando
if len(sys.argv) < 4:
    print("Uso: python AddEachMicroCell.py <X> <Y> <Potência>")
    sys.exit(1)

X = float(sys.argv[1])  # Coordenada X da microcélula
Y = float(sys.argv[2])  # Coordenada Y da microcélula
dPtdBmMicro = float(sys.argv[3]) # Potência da microcélula

# Carrega o arquivo com os pontos das microcélulas armazenadas

vtBsMicro = np.load('ListMicroCell.npy')
NewvtBsMicro = X + 1j*Y

if (not (NewvtBsMicro in vtBsMicro)):
    vtBsMicro = np.append (vtBsMicro, NewvtBsMicro)
vtBsMicro = np.array (vtBsMicro)
np.save('PowerMicroCell.npy', dPtdBmMicro)
np.save('ListMicroCell.npy', vtBsMicro)
