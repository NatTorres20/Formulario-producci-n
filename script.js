document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");

    if (!form || !numReferenciasInput || !referenciasContainer || !anomaliaSelect || !descripcionAnomalia || !mensajeExito) {
        console.error("Faltan elementos en el HTML.");
        return;
    }

    // Lista de referencias disponibles
    const referenciasLista = [
        "Panex 2-3 Trans", "Panex 4-6 Trans", "Panex 4-6 Blanco", "Panex 8-10 Trans",
        "Panex 2-3 Azul", "Panex 4-6 Azul", "Panex 8-10 Azul", "Redondo 2-3 Trans",
        "Redondo 4-6 Trans", "Redondo 8-10 Trans", "Redondo 2-3 Azul", "Redondo 4-6 Azul",
        "Redondo 8-10 Azul", "India 2-3", "India 4-6", "India 8-10", "Mazal #18",
        "Mazal #20", "Mazal #22", "Mazal #24", "Mazal #26", "Mazal #28", "Mazal #30"
    ];

    // Al cambiar la cantidad de referencias, generar campos dinámicos
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
        const tiposDeDaño = ["Burbuja", "Roto", "Crudo", "Quemado", "Otro"];
        tablaDaños.innerHTML = "";

        tiposDeDaño.forEach(tipo => {
            const fila = document.createElement("tr");

            const celdaTipo = document.createElement("td");
            celdaTipo.textContent = tipo;

            const celdaCantidad = document.createElement("td");
            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "0";
            inputCantidad.value = "0";
            inputCantidad.style.width = "60px";
            inputCantidad.classList.add("input-daños");
            inputCantidad.setAttribute("data-tipo", tipo);

            celdaCantidad.appendChild(inputCantidad);
            fila.appendChild(celdaTipo);
            fila.appendChild(celdaCantidad);
            tablaDaños.appendChild(fila);
        });
    }

    // Habilita o deshabilita la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = (anomaliaSelect.value === "No");
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha")?.value;
        const operario = document.getElementById("operario")?.value;

        let referencias = [];
        let cantidades = [];

        // Capturar referencias y cantidades
        referenciasContainer.querySelectorAll(".referencia-item").forEach(item => {
            const select = item.querySelector("select");
            const input = item.querySelector("input");
            if (select && input) {
                referencias.push(select.value);
                cantidades.push(parseInt(input.value, 10) || 0);
            }
        });

        // Captura de defectos asegurando la estructura correcta
        let defectos = {
            Burbuja: 0,
            Roto: 0,
            Crudo: 0,
            Quemado: 0,
            Otro: 0
        };

        document.querySelectorAll(".input-daños").forEach(input => {
            const tipo = input.getAttribute("data-tipo");
            defectos[tipo] = parseInt(input.value, 10) || 0;
        });

        console.log("Defectos capturados:", defectos);

        // Construimos el objeto de datos
        const data = {
            fecha,
            operario,
            referencias,
            cantidades,
            // En tu hoja de cálculo ya no se usan empaquesDañados ni motivoDaño,
            // así que no los incluimos si no son necesarios.
            defectos, // Se envía como objeto con las claves Burbuja, Roto, etc.
            anomalia: anomaliaSelect.value,
            descripcionAnomalia: descripcionAnomalia.value
        };

        console.log("Datos a enviar:", data);

        // Envía los datos a tu Apps Script
        fetch("https://script.google.com/macros/s/AKfycbwZGlJ2CZlc5wh9NKNM0-5_tZ_FGJKavhqxJY0j3sJApK6nRRDIFLzEbFCTSEHBaY8Y/exec", {
            method: "POST",
            // mode: "no-cors",  <-- Se quita para que se envíe el body correctamente
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(async response => {
            try {
                // Al quitar no-cors, puedes leer la respuesta
                const respData = await response.json();
                console.log("Respuesta del servidor:", respData);
            } catch (error) {
                // Si la respuesta no es JSON o hay algún error
                console.warn("No se pudo parsear la respuesta como JSON:", error);
            }
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
        })
        .catch(error => console.error("Error:", error));
    });
});

