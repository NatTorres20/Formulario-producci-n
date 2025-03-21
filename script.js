document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario");
    const referenciasContainer = document.getElementById("referencias-container");
    const agregarReferenciaBtn = document.getElementById("agregar-referencia");
    const mensajeExito = document.getElementById("mensajeExito");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");

    // Lista de referencias disponibles
    const referenciasDisponibles = ["Ref-A", "Ref-B", "Ref-C", "Ref-D"];

    // Agregar referencia y cantidad
    agregarReferenciaBtn.addEventListener("click", function () {
        const div = document.createElement("div");
        div.classList.add("referencia-item");

        const select = document.createElement("select");
        referenciasDisponibles.forEach(ref => {
            const option = document.createElement("option");
            option.value = ref;
            option.textContent = ref;
            select.appendChild(option);
        });

        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = "1";
        inputCantidad.placeholder = "Cantidad";

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "X";
        btnEliminar.type = "button";
        btnEliminar.addEventListener("click", function () {
            referenciasContainer.removeChild(div);
        });

        div.appendChild(select);
        div.appendChild(inputCantidad);
        div.appendChild(btnEliminar);
        referenciasContainer.appendChild(div);
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha").value;
        const operario = document.getElementById("operario").value;

        let referencias = [];
        let cantidades = [];

        referenciasContainer.querySelectorAll(".referencia-item").forEach(item => {
            const select = item.querySelector("select");
            const input = item.querySelector("input");
            if (select && input) {
                referencias.push(select.value);
                cantidades.push(input.value);
            }
        });

        let defectos = {
            Burbuja: 0,
            Roto: 0,
            Crudo: 0,
            Quemado: 0,
            Otro: 0
        };

        document.querySelectorAll(".input-daños").forEach(input => {
            const tipo = input.getAttribute("data-tipo");
            defectos[tipo] = input.value || 0;
        });

        // Construcción del objeto de datos
        const data = {
            Fecha: fecha,
            "Nombre del operario": operario,
            "Referencias fabricadas": referencias.join(", "),
            "Cantidad por referencia": cantidades.join(", "),
            Burbuja: defectos.Burbuja,
            Roto: defectos.Roto,
            Crudo: defectos.Crudo,
            Quemado: defectos.Quemado,
            Otro: defectos.Otro,
            Anomalia: anomaliaSelect.value,
            "Descripcion de la anomalia": descripcionAnomalia.value
        };

        console.log("Datos a enviar:", data);

        // Enviar a Google Sheets
        fetch("https://script.google.com/macros/s/AKfycbyQq9jnnhuXNhr0hpLLRYjYKwT0w52StxypAENJbcWUwgADoy2rwTz9dlFC6vez3dQU/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            mensajeExito.classList.remove("hidden");
            form.reset();
            
