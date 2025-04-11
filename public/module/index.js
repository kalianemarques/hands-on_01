// +controle dos elementos html e eventos

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
btnAddMicro.addEventListener('click', function () {
    document.getElementById("delet-all-microcelula").style.display = "block";
});
// -criar função que gera os cards de microcelula

// -criar função que deleta todos os cards de microcelula

// -criar função que deleta um card de microcelula

// -criar função que requisita os dados de outage e gráficos.