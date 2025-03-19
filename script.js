document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");

    // Lista de referencias disponibles
    const referenciasLista = [
        "Panex 2-3 Trans", "Panex 4-6 Trans", "Panex 4-6 Blanco", "Panex 8-10 Trans",
        "Panex 2-3 Azul", "Panex 4-6 Azul", "Panex 8-10 Azul", "Redondo 2-3 Trans",
        "Redondo 4-6 Trans", "Redondo 8-10 Trans", "Redondo 2-3 Azul", "Redondo 4-6 Azul",
        "Redondo 8-10 Azul", "India 2-3", "India 4-6", "India 8-10", "Mazal #18",
        "Mazal #20", "Mazal #22", "Mazal #24", "Mazal #26", "Mazal #28", "Mazal #30"
    ];

    // Genera la lista de referencias y cantidades según el número seleccionado
    numReferenciasInput.addEventListener("change", function () {
        referenciasContainer.innerHTML = "";

        const cantidad = parseInt(numReferenciasInput.value);
        if (isNaN(cantidad) || cantidad <= 0) return;

        for (let i = 0; i < cantidad; i++) {
            const label = document.createElement("label");
            label.textContent = `Referencia ${i + 1}:`;

            const select = document.createElement("select");
            select.required = true;

            referenciasLista.forEach(ref => {
                const option = document.createElement("option");
                option.value = ref;
                option.textContent = ref;
                select.appendChild(option);
            });

            const cantidadInput = document.createElement("input");
            cantidadInput.type = "number";
            cantidadInput.min = "1";
            cantidadInput.required = true;
            cantidadInput.placeholder = "Cantidad producida";

            referenciasContainer.appendChild(label);
            referenciasContainer.appendChild(select);
            referenciasContainer.appendChild(cantidadInput);
        }
    });

    // Habilita o deshabilita la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = anomaliaSelect.value === "No";
    });

    // Mostrar/ocultar campo "Otro" en motivo de daño
    const motivoDañoSelect = document.getElementById("motivoDaño");
    const otroMotivoContainer = document.getElementById("otroMotivoContainer");
    const otroMotivoInput = document.getElementById("otroMotivo");

    motivoDañoSelect.addEventListener("change", function () {
        if (motivoDañoSelect.value === "Otro") {
            otroMotivoContainer.style.display = "block";
            otroMotivoInput.required = true;
        } else {
            otroMotivoContainer.style.display = "none";
            otroMotivoInput.required = false;
            otroMotivoInput.value = "";
        }
    });

    // Agregar sección para registrar cantidad de empaques dañados por tipo de daño
    const tiposDaño = ["Roto", "Quemado", "Crudo", "Burbuja", "Otro"];
    const dañosContainer = document.getElementById("dañosContainer");

    tiposDaño.forEach(tipo => {
        const label = document.createElement("label");
        label.textContent = `Cantidad de empaques dañados (${tipo}):`;

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.placeholder = `Cantidad de ${tipo}`;
        input.name = `cantidad_${tipo}`;

        dañosContainer.appendChild(label);
        dañosContainer.appendChild(input);
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha").value;
        const operario = document.getElementById("operario").value;
        const empaquesDañados = document.getElementById("empaquesDañados").value;
        const motivoDaño = motivoDañoSelect.value;
        const otroMotivo = otroMotivoInput.value;
        const motivoFinal = motivoDaño === "Otro" ? otroMotivo : motivoDaño;
        const anomalia = anomaliaSelect.value;
        const descripcionAnomaliaText = descripcionAnomalia.value;

        let referencias = [];
        let cantidades = [];

        referenciasContainer.querySelectorAll("select").forEach((select, index) => {
            referencias.push(select.value);
            cantidades.push(referenciasContainer.querySelectorAll("input")[index].value);
        });

        // Capturar cantidad de empaques dañados por tipo
        let daños = {};
        tiposDaño.forEach(tipo => {
            const cantidad = document.querySelector(`[name="cantidad_${tipo}"]`).value;
            daños[tipo] = cantidad ? parseInt(cantidad) : 0;
        });

        const data = {
            fecha,
            operario,
            referencias,
            cantidades,
            empaquesDañados,
            motivoDaño: motivoFinal,
            anomalia,
            descripcionAnomalia: descripcionAnomaliaText,
            daños
        };

        console.log("Datos a enviar:", data);

        // Envío de datos a Google Apps Script
        fetch("https://script.google.com/macros/s/AKfycbw2h-sXURV2rben2YML_GKVCb_XhIzNYNOT9HmvCu8JezV9GIoLoqhE1K4xkfwS6yXE/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log("Enviado correctamente");
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
            dañosContainer.innerHTML = "";
        })
        .catch(error => console.error("Error:", error));
    });
});
