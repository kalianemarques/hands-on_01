# Este Script Python exclui todos os pontos de microcélulas (necessário executar MainTrigger para atualizar o gráfico)

import numpy as np

vtBsMicro = np.load('ListMicroCell.npy') # Carrega o arquivo com os pontos das microcélulas armazenadas
vtBsMicro =[] # Zera o array com os pontos das microcélulas
dPtdBmMicro =[] # Zera a potência da microcélula
np.save('ListMicroCell.npy', vtBsMicro) # Atualiza zerando o arquivo de pontos das microcélulas
np.save('PowerMicroCell.npy', dPtdBmMicro)