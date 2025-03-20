document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");

    // Lista de referencias disponibles
    const listaReferencias = [
        "REF-001",
        "REF-002",
        "REF-003",
        "REF-004",
        "REF-005"
    ];

    // URL de Google Apps Script Web App (REEMPLAZAR con tu URL)
    const scriptURL = "https://script.google.com/macros/s/AKfycbyYJl-3-zMRsJLfA3KJngbPkJQUTDXlcq09pPnHMK6Zp2lXsEBcynRrSLujZFkirU_X/exec";

    // Mostrar campos de referencia cuando el usuario ingresa el número de referencias
    numReferenciasInput.addEventListener("input", function () {
        referenciasContainer.innerHTML = ""; // Limpiar contenido previo

        let numReferencias = parseInt(numReferenciasInput.value);
        if (numReferencias > 0) {
            for (let i = 0; i < numReferencias; i++) {
                let div = document.createElement("div");

                // Crear el selector de referencia
                let select = document.createElement("select");
                select.id = `referencia${i}`;
                select.required = true;

                let defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Seleccione una referencia";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                select.appendChild(defaultOption);

                listaReferencias.forEach(ref => {
                    let option = document.createElement("option");
                    option.value = ref;
                    option.textContent = ref;
                    select.appendChild(option);
                });

                // Crear el input de cantidad
                let inputCantidad = document.createElement("input");
                inputCantidad.type = "number";
                inputCantidad.id = `cantidad${i}`;
                inputCantidad.min = "1";
                inputCantidad.required = true;

                div.innerHTML = `<label>Referencia ${i + 1}:</label>`;
                div.appendChild(select);
                div.innerHTML += `<label>Cantidad:</label>`;
                div.appendChild(inputCantidad);
                
                referenciasContainer.appendChild(div);
            }
        }
    });

    // Habilitar o deshabilitar descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = anomaliaSelect.value === "No";
    });

    // Enviar datos a Google Sheets
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let fecha = document.getElementById("Fecha").value;
        let operario = document.getElementById("operario").value;
        let numReferencias = numReferenciasInput.value;
        let anomalia = anomaliaSelect.value;
        let descripcion = descripcionAnomalia.value;

        // Capturar datos de las referencias
        let referencias = [];
        for (let i = 0; i < numReferencias; i++) {
            let ref = document.getElementById(`referencia${i}`).value;
            let cant = document.getElementById(`cantidad${i}`).value;
            referencias.push({ referencia: ref, cantidad: cant });
        }

        // Capturar defectos
        let defectos = [];
        let defectosInputs = document.querySelectorAll(".defecto");
        defectosInputs.forEach((input) => {
            let tipoDefecto = input.closest("tr").children[0].textContent;
            let cantidad = input.value;
            defectos.push({ tipo: tipoDefecto, cantidad: cantidad });
        });

        // Crear objeto con los datos
        let data = {
            fecha: fecha,
            operario: operario,
            referencias: JSON.stringify(referencias),
            defectos: JSON.stringify(defectos),
            anomalia: anomalia,
            descripcion: descripcion
        };

        // Enviar datos a Google Sheets
        fetch(scriptURL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(response => {
            console.log("Registro exitoso:", response);
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = ""; // Limpiar referencias
        })
        .catch(error => {
            console.error("Error al enviar datos:", error);
        });
    });
});
