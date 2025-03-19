document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");

document.addEventListener("DOMContentLoaded", function () {
    const operarioSelect = document.getElementById("operario");

    // Lista de operarios
    const operarios = ["Diego Lopez"];

    // Generar opciones dinámicamente
    operarios.forEach(operario => {
        const option = document.createElement("option");
        option.value = operario;
        option.textContent = operario;
        operarioSelect.appendChild(option);
    });
});


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

      // Tabla de daños
document.addEventListener("DOMContentLoaded", function () {
    const tablaDaños = document.querySelector("#tabla-daños tbody"); // Seleccionar solo el tbody

    // Verificar si la tabla existe
    if (!tablaDaños) {
        console.error("No se encontró la tabla de daños.");
        return;
    }

    // Tipos de daño predefinidos
    const tiposDeDaño = ["Burbuja", "Roto", "Crudo", "Quemado", "Otro"];

    // Limpiar la tabla antes de agregar filas (por si acaso)
    tablaDaños.innerHTML = "";

    // Agregar dinámicamente las filas con input de cantidad
    tiposDeDaño.forEach(tipo => {
        const fila = document.createElement("tr");

        // Celda con el nombre del daño
        const celdaTipo = document.createElement("td");
        celdaTipo.textContent = tipo;

        // Celda con input para ingresar la cantidad
        const celdaCantidad = document.createElement("td");
        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = "0";
        inputCantidad.value = "0";
        inputCantidad.style.width = "60px"; // Ajuste de tamaño
        inputCantidad.classList.add("input-daños");

        // Agregar input a la celda
        celdaCantidad.appendChild(inputCantidad);

        // Agregar celdas a la fila
        fila.appendChild(celdaTipo);
        fila.appendChild(celdaCantidad);

        // Agregar fila a la tabla
        tablaDaños.appendChild(fila);
    });
});

    
    // Habilita o deshabilita la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = anomaliaSelect.value === "No";
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha").value;
        const operario = document.getElementById("operario").value;
        const empaquesDañados = document.getElementById("empaquesDañados").value;
        const motivoDaño = document.getElementById("motivoDaño").value;
        const anomalia = document.getElementById("anomalia").value;
        const descripcionAnomalia = document.getElementById("descripcionAnomalia").value;

        let referencias = [];
        let cantidades = [];

        referenciasContainer.querySelectorAll("select").forEach((select, index) => {
            referencias.push(select.value);
            cantidades.push(referenciasContainer.querySelectorAll("input")[index].value);
        });

        const data = {
            fecha,
            operario,
            referencias,
            cantidades,
            empaquesDañados,
            motivoDaño,
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
        })
        .catch(error => console.error("Error:", error));
    });
});
