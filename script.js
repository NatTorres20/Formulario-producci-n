document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");

    // Verificaciones iniciales
    if (!form || !numReferenciasInput || !referenciasContainer || !anomaliaSelect || !descripcionAnomalia || !mensajeExito) {
        console.error("Faltan elementos en el HTML.");
        return;
    }

    // Lista de operarios
    const operarios = ["Diego Lopez"];
    const operarioSelect = document.getElementById("operario");

    if (operarioSelect) {
        operarios.forEach(operario => {
            const option = document.createElement("option");
            option.value = operario;
            option.textContent = operario;
            operarioSelect.appendChild(option);
        });
    } else {
        console.error("Elemento 'operario' no encontrado.");
    }

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

    // Generar referencias dinámicamente
    numReferenciasInput.addEventListener("change", function () {
        referenciasContainer.innerHTML = "";
        const cantidad = parseInt(numReferenciasInput.value);

        if (isNaN(cantidad) || cantidad <= 0) {
            console.warn("Número de referencias no válido.");
            return;
        }

        for (let i = 0; i < cantidad; i++) {
            const div = document.createElement("div");
            div.classList.add("referencia-item");

            // Etiqueta
            const label = document.createElement("label");
            label.textContent = `Referencia ${i + 1}:`;

            // Select con la lista de referencias
            const select = document.createElement("select");
            select.required = true;

            referenciasLista.forEach(ref => {
                const option = document.createElement("option");
                option.value = ref;
                option.textContent = ref;
                select.appendChild(option);
            });

            // Campo para la cantidad producida
            const cantidadInput = document.createElement("input");
            cantidadInput.type = "number";
            cantidadInput.min = "1";
            cantidadInput.required = true;
            cantidadInput.placeholder = "Cantidad producida";

            div.appendChild(label);
            div.appendChild(select);
            div.appendChild(cantidadInput);
            referenciasContainer.appendChild(div);
        }
    });

    // Tabla de daños
    const tablaDaños = document.querySelector("#tabla-daños tbody");

    if (!tablaDaños) {
        console.error("No se encontró la tabla de daños.");
    } else {
        // No es necesario regenerar la tabla si ya está en el HTML
        // Solo nos aseguramos de que se capturen los datos luego
    }

    // Habilita o deshabilita la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = (this.value === "No");
        if (this.value === "No") descripcionAnomalia.value = "";
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha")?.value;
        const operario = document.getElementById("operario")?.value;

        // Capturar defectos de la tabla
        let defectos = {};
        const filasDefectos = document.querySelectorAll("#tabla-daños tbody tr");
        filasDefectos.forEach(row => {
            // La primera celda es el tipo de daño, la segunda celda es el input
            const tipo = row.cells[0].textContent.trim();
            const input = row.cells[1].querySelector("input");
            if (input) {
                // Convierte a número, si está vacío, será 0
                defectos[tipo] = parseInt(input.value) || 0;
            }
        });

        let referencias = [];
        let cantidades = [];

        // Capturar las referencias
        referenciasContainer.querySelectorAll(".referencia-item").forEach(item => {
            const select = item.querySelector("select");
            const input = item.querySelector("input");
            if (select && input) {
                referencias.push(select.value);
                cantidades.push(parseInt(input.value) || 0);
            }
        });

        // Capturar anomalía
        const anomalia = anomaliaSelect.value;
        const descripcion = descripcionAnomalia.value;

        // Construir objeto de datos
        const data = {
            fecha,
            operario,
            referencias,
            cantidades,
            defectos,
            anomalia,
            descripcionAnomalia: descripcion
        };

        console.log("Datos a enviar:", JSON.stringify(data, null, 2));

        fetch("https://script.google.com/macros/s/AKfycbwc3ATznfBbu9vEG3ikF2aY9MXhyn-uKs6jlU-lzyGcTs9hUZXgMHZTEj-TckttLV1h/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log("Datos enviados correctamente.");
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
        });
    });
});

