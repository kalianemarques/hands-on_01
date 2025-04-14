# Função que gera os dados dos gráficos de Potência e Outage

import numpy as np
import json
from fDrawSector import DrawSector
from fOutageCalculate import OutageCalculate
import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning)


def GenerateGraph(dFc, dR, dPtdBm, dPtdBmMicro, vtBsMicro, dPasso):

    # Parâmetros de entrada fixos
    dHMob = 1.5  # Altura do receptor (m)
    dHBs = 32  # Altura do transmissor em (m)
    dSensitivity = -90  # Sensibilidade do receptor (dBm)
    
    # Cálculos de outras variáveis que dependem dos parâmetros de entrada
    dRMin = dPasso  # Raio de segurança
    dDimX = 5 * dR  # Dimensão X do grid
    dDimY = 6 * np.sqrt(3 / 4) * dR  # Dimensão Y do grid
    
    # Dados para os gráficos
    graph_data = []
    
    # Modelo Okumura-Hata: Cálculo do Fator de Correção para grandes cidades considerando a frequência
    if dFc >= 400:
        dAhm = 3.2 * (np.log10(11.75 * dHMob))**2 - 4.97
    else:
        dAhm = 8.29 * (np.log10(11.54 * dHMob))**2 - 1.1

    # Vetor com posições das ERBs (grid Hexagonal com 7 células, uma célula central e uma camada de células ao redor)
    vtBs = [0]  # ERB 1 na posição 0,0
    dOffset = np.pi / 6  # Ângulo relativo entre as ERBs com relação ao centro
    for iBs in range(2, 8):
        vtBs.append(dR * np.sqrt(3) * np.exp(1j * ((iBs - 2) * np.pi / 3 + dOffset)))  # Acrescenta a outras ERBs ao redor da ERB 1 (0,0)
    vtBs = np.array(vtBs) + (dDimX / 2 + 1j * dDimY / 2)  # Ajuste de posição das bases (posição relativa ao canto inferior esquerdo)

    # Matriz de referência com posição de cada ponto do grid
    dDimY = dDimY + np.mod(dDimY, dPasso)  # Ajuste de dimensão
    dDimX = dDimX + np.mod(dDimX, dPasso)  # Ajuste de dimensão
    # O meshgrid gera uma matriz vetorizada e o arange retorna valores uniformemente espaçados (inicío, fim, step)
    mtPosx, mtPosy = np.meshgrid(np.arange(0, dDimX, dPasso), np.arange(0, dDimY, dPasso))  

    # Iniciação da Matriz de potência máxima recebida em cada ponto medido
    mtPowerFinaldBm = -np.inf * np.ones_like(mtPosy)

    # Matriz de máscara para pontos dentro dos clusters das ERBs
    maskAllPoints = np.zeros_like(mtPosx, dtype=bool)

    # Calcular O REM de cada ERB e acumular a maior potência em cada ponto de medição
    for iBsD in range(len(vtBs)):  # Loop nas 7 ERBs
        # Matriz 3D com os pontos de medição de cada ERB
        mtPosEachBS = (mtPosx + 1j * mtPosy) - vtBs[iBsD]  # Matriz com a diferença entre a posição da ERB em questão e os demais pontos
        mtDistEachBs = np.abs(mtPosEachBS)  # Distância entre cada ponto de medição e a ERB, ou seja, o valor absoluto da diferença anterior
        mtDistEachBs[mtDistEachBs < dRMin] = dRMin  # Implementação do raio de segurança

        # Verificando se os pontos estão dentro do raio (cluster) da ERB
        mask = mtDistEachBs <= dR  # Máscara para pontos dentro do raio de cobertura
        maskAllPoints = maskAllPoints | mask  # Acumulando a máscara (considerando todos os pontos dentro de qualquer ERB)

        # Aplicando a máscara nos pontos de medição dentro do raio
        mtPosEachBSFiltered = mtPosEachBS[mask]
        mtDistEachBsFiltered = mtDistEachBs[mask]
        
        # Okumura-Hata (cidade urbana) - dB
        mtPldB = 69.55 + 26.16 * np.log10(dFc) + (44.9 - 6.55 * np.log10(dHBs)) * np.log10(mtDistEachBsFiltered / 1e3) - 13.82 * np.log10(dHBs) - dAhm
        mtPowerEachBSdBm = dPtdBm - mtPldB  # Potências recebidas em cada ponto de medição
        
        # Cálulo da maior potência em cada ponto de medição
        mtPowerFinaldBm[mask] = np.maximum(mtPowerFinaldBm[mask], mtPowerEachBSdBm)
        
        # Dados para geração do gráfico com cluster dos hexágonos
        graph_data.append({
            "hexagon": DrawSector(dR, vtBs[iBsD])
        })

    if len(vtBsMicro) > 0:
        for iBsD in range(len(vtBsMicro)):
            x, y, power = vtBsMicro[iBsD]  # Extraindo posição (x, y) e potência da microcélula
            mtPosEachBSMicro = (mtPosx + 1j * mtPosy) - (x + 1j * y)  # Diferença entre posição da microcélula e os pontos do grid
            mtDistEachBsMicro = np.abs(mtPosEachBSMicro)  # Distância entre cada ponto e a microcélula
            mtDistEachBsMicro[mtDistEachBsMicro < dRMin] = dRMin  # Implementação do raio de segurança

            # Verificando se os pontos estão dentro do raio da microcélula
            maskMicro = mtDistEachBsMicro <= dR
            maskAllPoints = maskAllPoints | maskMicro  # Acumulando a máscara para todos os pontos dentro de qualquer microcélula

            # Aplicando a máscara nos pontos de medição dentro do raio
            mtPosEachBSMicroFiltered = mtPosEachBSMicro[maskMicro]
            mtDistEachBsMicroFiltered = mtDistEachBsMicro[maskMicro]

            # Okumura-Hata (cidade urbana) - dB
            mtPldBMicro = 55 + 38 * np.log10(mtDistEachBsMicroFiltered / 1e3) + (24.5 + (1.5 * dFc) / 925) * np.log10(dFc)
            mtPowerEachBSdBmMicro = power - mtPldBMicro  # Potências recebidas em cada ponto de medição

            # Cálculo da maior potência em cada ponto de medição
            mtPowerFinaldBm[maskMicro] = np.maximum(mtPowerFinaldBm[maskMicro], mtPowerEachBSdBmMicro)

    # Calculando a taxa de "outage" apenas para os pontos dentro do cluster de ERBs (onde a máscara é True)
    dOutRate = 100*len(np.where(maskAllPoints & (mtPowerFinaldBm < dSensitivity))[0]) / np.sum(maskAllPoints)
    dOutRatePoint = np.where(maskAllPoints, np.where(mtPowerFinaldBm < dSensitivity, 0, 1), np.nan)  # Considerando apenas pontos dentro do cluster

    # Adicionar dados do gráfico
    graph_data.append({
        "x": mtPosx.tolist(),
        "y": mtPosy.tolist(),
        "power": mtPowerFinaldBm.tolist(),
        "outage_points": dOutRatePoint.tolist(),
        "outage_taxa": dOutRate
    })
    
    # Função para converter os valores nulos (NaN,-,inf) gerados de modo que possam ser lidos no json
    def convert_nan_inf(obj):
        if isinstance(obj,float):
            if np.isnan(obj) or np.isinf(obj):
                return None
        elif isinstance(obj,list):
            return [convert_nan_inf(item) for item in obj]
        elif isinstance(obj, dict):
            return {k:convert_nan_inf(v) for k, v in obj.items()}
        return obj

    # Retornar os dados como JSON
    safe_graph_data = convert_nan_inf(graph_data)
    print(json.dumps(safe_graph_data))
    
