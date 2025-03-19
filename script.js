document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    const mensajeExito = document.getElementById("mensajeExito");

    // Evento para activar/desactivar la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = this.value === "No";
        if (this.value === "No") {
            descripcionAnomalia.value = "";
        }
    });

    // Evento para generar referencias dinámicamente
    numReferenciasInput.addEventListener("change", function () {
        referenciasContainer.innerHTML = "";
        const cantidad = parseInt(numReferenciasInput.value);

        if (isNaN(cantidad) || cantidad <= 0) return;

        for (let i = 0; i < cantidad; i++) {
            const div = document.createElement("div");
            div.classList.add("referencia-item");

            const label = document.createElement("label");
            label.textContent = `Referencia ${i + 1}:`;

            const select = document.createElement("select");
            select.required = true;

            const referenciasLista = [
                "Panex 2-3 Trans", "Panex 4-6 Trans", "Panex 4-6 Blanco",
                "Panex 8-10 Trans", "Redondo 2-3 Azul", "India 2-3",
                "India 4-6", "Mazal #18", "Imusa 3.5 Naranja"
            ];

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

    // Evento para enviar formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const fecha = document.getElementById("Fecha").value;
        const operario = document.getElementById("operario").value;
        const referencias = [];
        document.querySelectorAll(".referencia-item").forEach(item => {
            const referencia = item.querySelector("select").value;
            const cantidad = item.querySelector("input").value;
            referencias.push({ referencia, cantidad });
        });

        // Obtener datos de los daños
        const daños = {};
        document.querySelectorAll("#tabla-daños tbody tr").forEach(row => {
            const tipo = row.cells[0].textContent;
            const cantidad = row.cells[1].querySelector("input").value;
            daños[tipo] = cantidad;
        });

        const anomalia = anomaliaSelect.value;
        const descripcion = descripcionAnomalia.value;

        const datos = {
            fecha,
            operario,
            referencias,
            daños,
            anomalia,
            descripcion
        };

        console.log("Datos a enviar:", datos); // Para depuración

        fetch("https://script.google.com/macros/s/AKfycbwOft80WR9nXMP0fR_rVdImlSud0ilj9MPQv0Zjh-EjqGI2tjQctfrCrm0OvtHZGmZN/exec", {
            method: "POST",
            body: JSON.stringify(datos),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al enviar los datos.");
        });
    });
});
