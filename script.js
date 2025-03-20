document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("miFormulario");
    if (!form) {
        console.error("Formulario no encontrado");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombreInput = document.getElementById("nombre");
        const emailInput = document.getElementById("email");
        
        if (!nombreInput || !emailInput) {
            console.error("Uno o más elementos no encontrados en el formulario");
            return;
        }

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        
        if (nombre === "" || email === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }

        console.log("Nombre:", nombre);
        console.log("Email:", email);
        
        // Simulación de envío de datos a Google Apps Script
        fetch("https://script.google.com/macros/s/AKfycbwOft80WR9nXMP0fR_rVdImlSud0ilj9MPQv0Zjh-EjqGI2tjQctfrCrm0OvtHZGmZN/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);
            alert("Datos enviados correctamente");
            form.reset();
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
            alert("Hubo un problema al enviar los datos.");
        });
    });
});
