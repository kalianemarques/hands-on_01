# Função que calcula a porcentagem do campo Outage

import numpy as np

def OutageCalculate(maskAllPoints, mtPowerFinaldBm, dSensitivity):
    return (
        100*len(np.where(maskAllPoints & (mtPowerFinaldBm < dSensitivity))[0]) / np.sum(maskAllPoints)
    )