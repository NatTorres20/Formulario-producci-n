document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const anomaliaSelect = document.getElementById("anomalia");
    const descripcionAnomalia = document.getElementById("descripcionAnomalia");
    
    // Habilitar o deshabilitar el campo de descripción según la selección
    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.disabled = this.value !== "Sí";
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        // Obtener valores del formulario
        const operario = document.getElementById("operario").value;
        const numReferencias = parseInt(document.getElementById("numReferencias").value);
        const referencias = [];
        const cantidades = [];

        for (let i = 0; i < numReferencias; i++) {
            const refInput = document.getElementById(`referencia${i}`);
            const cantInput = document.getElementById(`cantidad${i}`);
            if (refInput && cantInput) {
                referencias.push(refInput.value);
                cantidades.push(parseInt(cantInput.value) || 0);
            }
        }

        // 📌 ✅ Capturar correctamente los valores de los empaques dañados
        const tiposDaño = ["Burbuja", "Roto", "Crudo", "Quemado", "Otro"];
        const inputsDaño = document.querySelectorAll("#tabla-daños tbody input");
        const empaquesDañados = {};

        inputsDaño.forEach((input, index) => {
            empaquesDañados[tiposDaño[index]] = parseInt(input.value) || 0;
        });

        const anomalia = anomaliaSelect.value;
        const descripcionAnomaliaValue = descripcionAnomalia.disabled ? "" : descripcionAnomalia.value;

        // 📌 Crear objeto con los datos a enviar
        const data = {
            operario,
            referencias,
            cantidades,
            empaquesDañados, // ✅ Ahora los valores se capturan correctamente
            anomalia,
            descripcionAnomalia: descripcionAnomaliaValue
        };

        console.log("Datos enviados:", data); // 🔹 Verificar en consola

        // Enviar datos a Google Apps Script
        fetch("https://script.google.com/macros/s/AKfycbwOft80WR9nXMP0fR_rVdImlSud0ilj9MPQv0Zjh-EjqGI2tjQctfrCrm0OvtHZGmZN/exec", { // Reemplaza con tu URL de despliegue
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log("Respuesta del servidor:", result);
            if (result.status === "success") {
                document.getElementById("mensajeExito").classList.remove("hidden");
                form.reset();
            } else {
                alert("Error al enviar datos: " + result.message);
            }
        })
        .catch(error => console.error("Error en fetch:", error));
    });
});
