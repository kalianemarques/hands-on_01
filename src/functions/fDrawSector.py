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
        
        
        
    #vtHex.append(dR * (np.cos((ie - 1) * np.pi / 3) + 1j * np.sin((ie - 1) * np.pi / 3)))
    
    # Adicionando o ponto central a cada coordenada
    #vtHex = np.array(vtHex) + dCenter
    
    # Adicionando o primeiro ponto novamente no final para fechar a figura
    #vtHexp = np.concatenate([vtHex, [vtHex[0]]])

    # Retornar os dados do hexágono para plotagem
    #return vtHexp.real, vtHexp.imag


