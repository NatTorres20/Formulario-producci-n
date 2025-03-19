document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");
    const empaquesDañadosContainer = document.getElementById("empaquesDañadosContainer");

    // Lista de referencias disponibles
    const referenciasLista = [
        "Panex 2-3 Trans", "Panex 4-6 Trans", "Panex 4-6 Blanco", "Panex 8-10 Trans",
        "Panex 2-3 Azul", "Panex 4-6 Azul", "Panex 8-10 Azul", "Redondo 2-3 Trans",
        "Redondo 4-6 Trans", "Redondo 8-10 Trans", "Redondo 2-3 Azul", "Redondo 4-6 Azul",
        "Redondo 8-10 Azul", "India 2-3", "India 4-6", "India 8-10", "Mazal #18",
        "Mazal #20", "Mazal #22", "Mazal #24", "Mazal #26", "Mazal #28", "Mazal #30",
        "Imusa 3.5 Naranja", "Imusa 7.5 Naranja", "Imusa 4.5 Amarillo", "Imusa 7.0 Blanco",
        "Imusa 4.5 Blanco", "Imusa Safe Plus 7.0", "Imusa Safe Plus 4.5", "Imusa Española",
        "Nova 2-3", "Nova 4-6", "Unco 4-6 silicona", "Fusible plano pequeño",
        "Fusible plano grande", "Fusible PR pequeño suelto", "Fusible PR grande suelto",
        "Fusible Grande Caucho", "Fusible Pequeño Caucho", "Goma 2-3", "Goma 4-6",
        "Goma 8-10", "Panex 4-6 Caucho-Negro", "Redondo negro pequeño",
        "Empaque Cuadrado Challenger", "Empaque redondo Challenger"
    ];

    // Lista de tipos de daño
    const tiposDeDaño = ["Burbuja", "Roto", "Desformado", "Mal cortado"];

    // Genera la lista de referencias y cantidades según el número seleccionado
    numReferenciasInput.addEventListener("change", function () {
        referenciasContainer.innerHTML = ""; // Limpia el contenedor antes de agregar nuevos elementos

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

    // Generar campos para registrar empaques dañados por tipo de daño
    function generarCamposDaño() {
        empaquesDañadosContainer.innerHTML = ""; // Limpia los campos anteriores

        tiposDeDaño.forEach(tipo => {
            const label = document.createElement("label");
            label.textContent = `Cantidad de empaques dañados (${tipo}):`;

            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.value = "0";
            input.className = "dañoInput";
            input.dataset.tipo = tipo;

            empaquesDañadosContainer.appendChild(label);
            empaquesDañadosContainer.appendChild(input);
        });
    }

    // Generar los campos de daño al cargar la página
    generarCamposDaño();

    // Habilita o deshabilita la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = anomaliaSelect.value === "No";
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha").value;
        const operario = document.getElementById("operario").value;
        const anomalia = document.getElementById("anomalia").value;
        const descripcionAnomalia = document.getElementById("descripcionAnomalia").value;

        let referencias = [];
        let cantidades = [];

        referenciasContainer.querySelectorAll("select").forEach((select, index) => {
            referencias.push(select.value);
            cantidades.push(referenciasContainer.querySelectorAll("input")[index].value);
        });

        let empaquesDañados = {};
        document.querySelectorAll(".dañoInput").forEach(input => {
            empaquesDañados[input.dataset.tipo] = input.value;
        });

        const data = {
            fecha,
            operario,
            referencias,
            cantidades,
            empaquesDañados,
            anomalia,
            descripcionAnomalia
        };

        console.log("Datos a enviar:", data); // Debug para verificar los datos antes de enviar

        // Envío de datos a Google Apps Script
        fetch("https://script.google.com/macros/s/AKfycbw2h-sXURV2rben2YML_GKVCb_XhIzNYNOT9HmvCu8JezV9GIoLoqhE1K4xkfwS6yXE/exec", {
            method: "POST",
            mode: "no-cors",  // 🔹 Evita bloqueos CORS
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log("Enviado correctamente");
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
            generarCamposDaño(); // Reiniciar los campos de daños
        })
        .catch(error => console.error("Error:", error));
    });
});
