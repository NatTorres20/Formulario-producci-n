document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Capturar fecha y operario
        const fecha = document.getElementById("Fecha").value;
        const operario = document.getElementById("operario").value;

        // Capturar número de referencias fabricadas
        const numReferencias = parseInt(document.getElementById("numReferencias").value);
        const referenciasContainer = document.getElementById("referenciasContainer");
        const referencias = [];

        referenciasContainer.querySelectorAll(".referencia-item").forEach(item => {
            const referencia = item.querySelector("select").value;
            const cantidad = parseInt(item.querySelector("input").value);
            referencias.push({ referencia, cantidad });
        });

        // Capturar los daños correctamente
        const daños = {};
        document.querySelectorAll("#tabla-daños tbody tr").forEach(fila => {
            const tipo = fila.cells[0].textContent;
            const cantidad = parseInt(fila.cells[1].querySelector("input").value);
            daños[tipo] = cantidad; 
        });

        // Capturar anomalía
        const anomalia = document.getElementById("anomalia").value;
        const descripcionAnomalia = document.getElementById("descripcionAnomalia").value;

        // Datos a enviar
        const datos = {
            fecha,
            operario,
            referencias,
            daños,
            anomalia,
            descripcionAnomalia
        };

        console.log("Datos enviados:", datos); // Para verificar antes de enviar

        // Enviar a Google Sheets
        fetch("https://script.google.com/macros/s/AKfycbwOft80WR9nXMP0fR_rVdImlSud0ilj9MPQv0Zjh-EjqGI2tjQctfrCrm0OvtHZGmZN/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            alert("Registro enviado con éxito.");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un problema al enviar el registro.");
        });
    });
});

