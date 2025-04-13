// +controle dos elementos html e eventos
import { powerAndOutage, powerAndOutageMicro, addMicrocell, deleteMicrocell, deleteAllMicrocells } from './requests.js';
import { plotGraphsFromJSON } from './generateGraphic.js';
let cont = 0;
const powerGraphic = document.getElementById("power-graphic");
const outageGraphic = document.getElementById("outage-graphic");

const btnAdd = document.getElementById("show-microcelula");
btnAdd.addEventListener("click", function () {
    document.getElementById("hidden").style.display = "block";
    //verifica se added-microcelula tem algum filho
    const addedMicrocelula = document.getElementById("added-microcelula");
    if (addedMicrocelula.children.length > 0) {
        document.getElementById("delet-all-microcelula").style.display = "block";
    } else {
        document.getElementById("delet-all-microcelula").style.display = "none";
    }

});

const btnClose = document.getElementById("close");
btnClose.addEventListener("click", function () {
    document.getElementById("hidden").style.display = "none";
});

const btnAddMicro = document.getElementById("add-microcelula");
btnAddMicro.addEventListener('click', async function () {
    cont++;
    document.getElementById("delet-all-microcelula").style.display = "block";

    // fazer um card para cada microcelula adicionada
    const x = document.getElementById("position-x").value;
    const y = document.getElementById("position-y").value;
    const power = document.getElementById("power-micro").value;
    
    if (!x || !y || !power) {   
        document.getElementById("error-micro").innerText = "Todos os campos são obrigatórios!";
        return;
    } else {
        document.getElementById("error-micro").innerText = "";
    }
    
    const card = generateCard(x, y, power, cont);
    const addedMicrocelula = document.getElementById("added-microcelula");
    addedMicrocelula.appendChild(card);

    // fazer a requisição para adicionar os pontos da microcelula
    const result = await addMicrocell(x, y, power);
    if (result) {
        const frequency = document.getElementById("frequency").value;
        const radius = document.getElementById("radius").value;
        const grid = document.getElementById("step").value;
        const EIRP = document.getElementById("power").value;
        const response = await powerAndOutageMicro(frequency, radius, grid, EIRP );
        if (response) {
            plotGraphsFromJSON(response);
            powerGraphic.style.display = "block";
            outageGraphic.style.display = "none";
        } else {
            console.log("Erro ao calcular potência e taxa de outage.");
        }
    } else {
        console.log("Erro ao adicionar microcélula.");
    }

});

const btnDeleteAll = document.getElementById("delet-all-microcelula");
btnDeleteAll.addEventListener("click", async function () {
    deleteAllCards();
    const result = await deleteAllMicrocells();
    if (result) {
        console.log("Todas as microcélulas foram deletadas com sucesso.");
        const frequency = document.getElementById("frequency").value;
        const radius = document.getElementById("radius").value;
        const grid = document.getElementById("step").value;
        const EIRP = document.getElementById("power").value;
        const response = await powerAndOutage(frequency, radius, grid, EIRP);
        if (response) {
            plotGraphsFromJSON(response);
            powerGraphic.style.display = "block";
            outageGraphic.style.display = "none";
        } else {
            console.log("Erro ao calcular potência e taxa de outage.");
        }
    } else {
        console.log("Erro ao deletar todas as microcélulas.");
    }
});

function generateCard(x, y, power, cont) {
    console.log(`Gerando card de microcelula com coordenadas (${x}, ${y}) e potência ${power} dBm`);
    
    const card = document.createElement("div");
    card.className = "card-microcelula";

    const name = document.createElement("p");
    name.innerText = `Microcélula ${cont}`;
    card.appendChild(name);

    const coordenadas = document.createElement("p");
    coordenadas.innerText = `Coordenadas: (${x}, ${y})`;
    card.appendChild(coordenadas);

    const powerdbm = document.createElement("p");
    powerdbm.innerText = `Potência: ${power} dBm`;
    card.appendChild(powerdbm);

    const btnDelete = document.createElement("button");
    btnDelete.innerText = "Deletar";
    card.appendChild(btnDelete);

    btnDelete.addEventListener("click",async function () {
        // Deletar o card        
        card.remove();
        // Chamar a requisição para deletar a microcélula
        const result = await deleteMicrocell(x, y);
        if (result) {
            console.log(`Microcélula (${x}, ${y}) deletada com sucesso.`);
            // Atualizar o gráfico
            const frequency = document.getElementById("frequency").value;
            const radius = document.getElementById("radius").value;
            const grid = document.getElementById("step").value;
            const EIRP = document.getElementById("power").value;
            // const response = await powerAndOutage(frequency, radius, grid, EIRP); //está gerando o gáfico de quando não tem nenhuma microcélula
            const response = await powerAndOutageMicro(frequency, radius, grid, EIRP ); //o problema é que mão sei o que passaria em potencia..., não pode ser zero...
            if (response) {
                plotGraphsFromJSON(response);
                powerGraphic.style.display = "block";
                outageGraphic.style.display = "none";
            } else {
                console.log("Erro ao calcular potência e taxa de outage.");
            }
        } else {
            console.log(`Erro ao deletar microcélula (${x}, ${y}).`);
        }

    });
    
    return card;
}

function deleteAllCards() {
    const addedMicrocelula = document.getElementById("added-microcelula");
    addedMicrocelula.innerHTML = "";
    document.getElementById("delet-all-microcelula").style.display = "none";
    cont = 0;
}

const btnShowOutageArea = document.getElementById("showOutageArea");
btnShowOutageArea.addEventListener("click", function () {
    document.getElementById("outage-graphic").style.display = "block";
});

const btnCalculateReceivedPower = document.getElementById("calculateReceivedPower");
btnCalculateReceivedPower.addEventListener("click", async function () {    
    const frequency = document.getElementById("frequency").value;
    const radius = document.getElementById("radius").value;
    const grid = document.getElementById("step").value;
    const EIRP = document.getElementById("power").value;

    const result = await powerAndOutage(frequency, radius, grid, EIRP);

    plotGraphsFromJSON(result);

    powerGraphic.style.display = "block";
    outageGraphic.style.display = "none";
    btnShowOutageArea.disabled = false;
    btnAdd.disabled = false;
    cont = 0;

    //deletar todas as microcelulas
    deleteAllCards()
    const result2 = await deleteAllMicrocells();
    if (result2) {
        console.log("Todas as microcélulas foram deletadas com sucesso.");
        const frequency = document.getElementById("frequency").value;
        const radius = document.getElementById("radius").value;
        const grid = document.getElementById("step").value;
        const EIRP = document.getElementById("power").value;
        const response = await powerAndOutage(frequency, radius, grid, EIRP);
        if (response) {
            plotGraphsFromJSON(response);
            powerGraphic.style.display = "block";
            outageGraphic.style.display = "none";
        } else {
            console.log("Erro ao calcular potência e taxa de outage.");
        }
    }
});