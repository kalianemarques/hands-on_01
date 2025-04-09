import numpy as np
import sys


dFc = 800
dR = 500  # Raio do Hexágono
GridRes = 100 # Resolução do Grid
dPtdBm = 21 # EIRP em dBm (incluindo ganho e perdas)
dPtdBmMicro = 20 # Potência das Micro células


vtBsMicro = np.load('ListMicroCell.npy') # Acarrega 
vtBsMicro =[]
np.save('ListMicroCell.npy', vtBsMicro)
GenerateGraph(dFc, dR, dPtdBm, dPtdBmMicro, vtBsMicro,GridRes)