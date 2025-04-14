// +controle dos elementos html e eventos
import { powerAndOutage, addMicrocell, deleteMicrocell, deleteAllMicrocells } from './requests.js';
import { plotGraphsFromJSON } from './generateGraphic.js';
let cont = 0;
const powerGraphic = document.getElementById("power-graphic");
const outageGraphic = document.getElementById("outage-graphic");
const staticGraphic = document.getElementById("power-graphic-static");
const addedMicrocelula = document.getElementById("added-microcelula");

const btnAdd = document.getElementById("show-microcelula");
btnAdd.addEventListener("click", function () {
    document.getElementById("hidden").style.display = "block";
    //verifica se added-microcelula tem algum filho
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
    localStorage.setItem("generateNewGraphic", "false");
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
    addedMicrocelula.appendChild(card);

    // fazer a requisição para adicionar os pontos da microcelula
    const result = await addMicrocell(x, y, power);
    if (result) {
        const frequency = document.getElementById("frequency").value;
        const radius = document.getElementById("radius").value;
        const grid = document.getElementById("step").value;
        const EIRP = document.getElementById("power").value;
        const response = await powerAndOutage(frequency, radius, grid, EIRP );
        if (response) {
            plotGraphsFromJSON(response);
            powerGraphic.style.display = "block";
            outageGraphic.style.display = "block";
            staticGraphic.style.display = "none";
            document.getElementById("result-outage-microcelula").innerText = "";
            document.getElementById("result-outage-microcelula").innerText = response[7].outage_taxa.toFixed(2);
            document.getElementById("microcelula").style.display = "block";
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
        const frequency = document.getElementById("frequency").value;
        const radius = document.getElementById("radius").value;
        const grid = document.getElementById("step").value;
        const EIRP = document.getElementById("power").value;
        const response = await powerAndOutage(frequency, radius, grid, EIRP);
        if (response) {
            plotGraphsFromJSON(response);
            powerGraphic.style.display = "block";
            outageGraphic.style.display = "block";
            staticGraphic.style.display = "none";
        } else {
            console.log("Erro ao calcular potência e taxa de outage.");
        }
    } else {
        console.log("Erro ao deletar todas as microcélulas.");
    }
    document.getElementById("microcelula").style.display = "none";
});

function generateCard(x, y, power, cont) {    
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
            // Atualizar o gráfico
            const frequency = document.getElementById("frequency").value;
            const radius = document.getElementById("radius").value;
            const grid = document.getElementById("step").value;
            const EIRP = document.getElementById("power").value;
            const response = await powerAndOutage(frequency, radius, grid, EIRP); //está gerando o gáfico de quando não tem nenhuma microcélula
            if (response) {
                plotGraphsFromJSON(response);
                powerGraphic.style.display = "block";
                outageGraphic.style.display = "block";
                staticGraphic.style.display = "none";
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
    addedMicrocelula.innerHTML = "";
    document.getElementById("delet-all-microcelula").style.display = "none";
    cont = 0;
}

const viewReceivedPower = document.getElementById("viewReceivedPower");
viewReceivedPower.addEventListener("click", function () {
    if (addedMicrocelula.children.length > 0) {
        document.getElementById("power-graphic-static").style.display = "block";
    }
});
const btnCalculateReceivedPower = document.getElementById("calculateReceivedPower");
btnCalculateReceivedPower.addEventListener("click", async function () {    
    localStorage.setItem("generateNewGraphic", "true");

    
    if (addedMicrocelula.children.length > 0) {
        document.getElementById("delet-all-microcelula").style.display = "block";
        deleteAllCards()
        deleteAllMicrocells();
    }

    const frequency = document.getElementById("frequency").value;
    const radius = document.getElementById("radius").value;
    const grid = document.getElementById("step").value;
    const EIRP = document.getElementById("power").value;

    const result = await powerAndOutage(frequency, radius, grid, EIRP);

    plotGraphsFromJSON(result);

    powerGraphic.style.display = "block";
    outageGraphic.style.display = "block";
    staticGraphic.style.display = "none";
    viewReceivedPower.disabled = false;
    btnAdd.disabled = false;
    cont = 0;

    document.getElementById("macrocelula").style.display = "block";
    document.getElementById("result-outage-macrocelula").innerText = result[7].outage_taxa.toFixed(2);
    viewReceivedPower.style.display = "block";
});