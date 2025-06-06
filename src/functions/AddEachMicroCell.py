import numpy as np
import sys

# Receber parâmetros da linha de comando
if len(sys.argv) < 4:
    print("Uso: python AddEachMicroCell.py <X> <Y> <Power>")
    sys.exit(1)

X = float(sys.argv[1])  # Coordenada X da microcélula
Y = float(sys.argv[2])  # Coordenada Y da microcélula
Power = float(sys.argv[3])  # Potência da microcélula

# Carregar o arquivo existente ou criar um novo
try:
    vtBsMicro = np.load('ListMicroCell.npy')
    # Garantir que o array tenha a estrutura correta
    if vtBsMicro.size == 0:
        vtBsMicro = np.empty((0, 3))
except FileNotFoundError:
    vtBsMicro = np.empty((0, 3))  # Matriz vazia com 3 colunas (x, y, power)

# Adicionar a nova microcélula
new_microcell = np.array([[X, Y, Power]])
vtBsMicro = np.vstack([vtBsMicro, new_microcell])

# Salvar o arquivo atualizado
np.save('ListMicroCell.npy', vtBsMicro)
