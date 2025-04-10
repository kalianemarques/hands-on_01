# Função que gera os vértices dos hexágonos

import numpy as np
import plotly.graph_objects as go

def DrawSector(dR, dCenter):
    # Criando um array para armazenar os pontos do hexágono
    vtHex = []
    
    # Calculando os 6 pontos que formam o hexágono
    for ie in range(6):
        angle = (ie - 1) * np.pi / 3
        vertex = dCenter + dR * (np.cos(angle) + 1j * np.sin(angle))
        vtHex.append({"x": vertex.real, "y": vertex.imag})
    return vtHex


