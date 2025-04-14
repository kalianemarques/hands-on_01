# Este script python remove uma microcélula com base nas coordenadas X e Y.

import numpy as np
import sys

# Receber parâmetros da linha de comando
if len(sys.argv) < 3:
    print("Uso: python RemoveEachMicroCell.py <X> <Y>")
    sys.exit(1)

X = float(sys.argv[1])  # Coordenada X da microcélula
Y = float(sys.argv[2])  # Coordenada Y da microcélula

# Carregar o arquivo existente ou criar um novo
try:
    vtBsMicro = np.load('ListMicroCell.npy')
    # Garantir que o array tenha a estrutura correta
    if vtBsMicro.size == 0:
        vtBsMicro = np.empty((0, 3))
except FileNotFoundError:
    sys.exit(1)

# Remover a microcélula correspondente
mask = ~((vtBsMicro[:, 0] == X) & (vtBsMicro[:, 1] == Y))
if mask.all():  # Verifica se nenhuma célula foi removida
    print(f"Microcélula com coordenadas ({X}, {Y}) não encontrada.")
else:
    vtBsMicro = vtBsMicro[mask]  # Aplica a máscara para remover a célula

# Salvar o arquivo atualizado
np.save('ListMicroCell.npy', vtBsMicro)