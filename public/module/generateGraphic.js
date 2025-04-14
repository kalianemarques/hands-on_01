
// Função para desenhar hexágonos
function drawHexagon(vertices, xScale, yScale) {
    const points = vertices.map(v => [xScale(v.x), yScale(v.y)]);
    points.push(points[0]); // Fechar o hexágono
    return d3.line()(points);
}
/// Função para criar o gráfico
function createGraph(containerId, title, graphData, xScale, yScale, colorScale, dataKey, unit) {
    const margin = { top: 40, right: 140, bottom: 60, left: 60 }; // Aumentei right para a legenda
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Criar SVG principal
    const svg = d3.select(containerId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adicionar um grupo para o tooltip
    const tooltip = d3.select(containerId).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ddd")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)");

    // Adicionar título
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(title);

    // Adicionar hexágonos e centro de hexágonos
    graphData.slice(0, 7).forEach(data => {
        svg.append("path")
            .attr("d", drawHexagon(data.hexagon, xScale, yScale))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("fill", "none");
    
        // Adicionar o centro do hexágono
        const hexagonCenterX = d3.mean(data.hexagon, d => d.x);
        const hexagonCenterY = d3.mean(data.hexagon, d => d.y);
        svg.append("rect")
            .attr("x", xScale(hexagonCenterX) - 4) // Subtract half width to center
            .attr("y", yScale(hexagonCenterY) - 4) // Subtract half height to center
            .attr("width", 8) // Square width
            .attr("height", 8) // Square height
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("opacity", 0.8);

    });

    // Processar pontos - com tratamento para valores null
    const pointsData = graphData[7];
    const points = [];
    if (
        Array.isArray(pointsData.x) &&
        Array.isArray(pointsData.y) &&
        Array.isArray(pointsData[dataKey])
    ) {
        for (let i = 0; i < pointsData.x.length; i++) {
            if (
                Array.isArray(pointsData.x[i]) &&
                Array.isArray(pointsData.y[i]) &&
                Array.isArray(pointsData[dataKey][i])
            ) {
                for (let j = 0; j < pointsData.x[i].length; j++) {
                    // Verificar se os valores existem e não são null antes de adicionar
                    if (
                        pointsData.x[i][j] !== undefined &&
                        pointsData.y[i][j] !== undefined &&
                        pointsData[dataKey][i][j] !== undefined &&
                        pointsData.x[i][j] !== null &&
                        pointsData.y[i][j] !== null &&
                        pointsData[dataKey][i][j] !== null
                    ) {
                        points.push({
                            x: pointsData.x[i][j],
                            y: pointsData.y[i][j],
                            value: pointsData[dataKey][i][j],
                        });
                    }
                }
            }
        }
    } else {
        console.error("Dados de pointsData estão no formato incorreto:", pointsData);
    }

    // Configurar escala de cores para outage
    if (dataKey === "outage_points") {
        colorScale = d3.scaleOrdinal()
            .domain([0, 1])
            .range(["black", "#f74626"]); // Preto para 0, vermelho para 1
    }

    // Plotar pontos com tooltip
    svg.selectAll(".point")
        .data(points)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.value))
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 8);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Posição X: ${d.x.toFixed(2)} m<br>
                         Posição Y: ${d.y.toFixed(2)} m<br>
                         ${title}: ${d.value !== null ? d.value.toFixed(2) : 'N/A'} ${unit}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 5);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Adicionar eixos
    svg.append("g")
        .attr("transform", `translate(0,${height + 10})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Títulos dos eixos
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .attr("text-anchor", "middle")
        .text("Posição X (m)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Posição Y (m)");

    // LEGENDA VERTICAL (à direita do gráfico)
    const legendWidth = 20;
    const legendHeight = 150;
    const legendPadding = 10;
    
    // Grupo para a legenda
    const legend = svg.append("g")
        .attr("transform", `translate(${width + legendPadding + 50}, ${height/2 - legendHeight/2})`);
    
    // Título da legenda
    legend.append("text")
        .attr("x", legendWidth/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(unit);
    
    // Gradiente para a legenda
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", `gradient-${dataKey}`)
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "100%")
        .attr("y2", "0%");

    const domain = colorScale.domain();
    const ticks = colorScale.ticks(5);
    
    gradient.selectAll("stop")
        .data(ticks.map((t, i, n) => ({
            offset: `${100 * i / (n.length-1)}%`,
            color: colorScale(t)
        })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    // Retângulo com o gradiente
    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", `url(#gradient-${dataKey})`);
    
    // Eixo da legenda
    const legendScale = d3.scaleLinear()
        .domain(domain)
        .range([legendHeight, 0]);

    legend.append("g")
        .attr("transform", `translate(${legendWidth}, 0)`)
        .call(d3.axisRight(legendScale)
            .ticks(5)
            .tickSize(5));
}
/// Função principal para plotar os gráficos a partir do JSON
export async function plotGraphsFromJSON(graphData) {
    // Limpar elementos anteriores em power-graphic
    d3.select("#power-graphic").select("svg").remove();
    d3.select("#outage-graphic").select("svg").remove();
    
    // Verificar se power-graphic-static já foi plotado
    if (localStorage.getItem("generateNewGraphic") === "true") {
        // Limpar elementos anteriores em power-graphic-static
        d3.select("#power-graphic-static").select("svg").remove();

        // Configurações do SVG
        const margin = { top: 40, right: 120, bottom: 60, left: 60 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const allX = graphData[7].x.flat();
        const allY = graphData[7].y.flat();
        const allPower = graphData[7].power.flat();

        const xScale = d3.scaleLinear()
            .domain([d3.min(allX), d3.max(allX)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(allY), d3.max(allY)])
            .range([height, 0]);

        const powerColorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([d3.min(allPower), d3.max(allPower)]);

        // Criar o gráfico inicial em power-graphic-static
        createGraph("#power-graphic-static", "Potência (Sem Microcélulas)", graphData, xScale, yScale, powerColorScale, "power", "dBm");

    }

    // Atualizar o gráfico em power-graphic
    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const allX = graphData[7].x.flat();
    const allY = graphData[7].y.flat();
    const allPower = graphData[7].power.flat();
    const allOutage = graphData[7].outage_points.flat();

    const xScale = d3.scaleLinear()
        .domain([d3.min(allX), d3.max(allX)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(allY), d3.max(allY)])
        .range([height, 0]);

    const powerColorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([d3.min(allPower), d3.max(allPower)]);

    createGraph("#power-graphic", "Potência (Com Microcélulas)", graphData, xScale, yScale, powerColorScale, "power", "dBm");
    createGraph("#outage-graphic", "Outage", graphData, xScale, yScale, "", "outage_points", "");
}