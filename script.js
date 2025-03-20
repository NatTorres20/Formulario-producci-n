document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const numReferenciasInput = document.getElementById("numReferencias");
    const referenciasContainer = document.getElementById("referenciasContainer");
    const mensajeExito = document.getElementById("mensajeExito");

    const operarios = ["Diego Lopez"];
    const operarioSelect = document.getElementById("operario");

    if (operarioSelect) {
        operarios.forEach(operario => {
            const option = document.createElement("option");
            option.value = operario;
            option.textContent = operario;
            operarioSelect.appendChild(option);
        });
    }

    const referenciasLista = ["Panex 2-3 Trans", "Panex 4-6 Trans", "India 4-6", "Redondo 4-6 Trans"];

    numReferenciasInput.addEventListener("change", function () {
        referenciasContainer.innerHTML = "";
        const cantidad = parseInt(numReferenciasInput.value);

        if (isNaN(cantidad) || cantidad <= 0) {
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

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Función mejorada para obtener valores de input, select y textarea
        function obtenerValor(id) {
            const elemento = document.getElementById(id);
            if (!elemento) {
                console.warn(`⚠️ No se encontró el campo: ${id}`);
                return "Sin dato";
            }
            return elemento.value.trim() || "Sin dato";
        }

        // Capturar correctamente los datos
        const fecha = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
        const operario = obtenerValor("operario");
        const empaquesDañados = obtenerValor("empaquesDañados");
        const motivoDaño = obtenerValor("motivoDaño");
        const anomalia = obtenerValor("anomalia");
        const descripcionAnomalia = obtenerValor("descripcionAnomalia");

        let registros = [];

        referenciasContainer.querySelectorAll(".referencia-item").forEach(item => {
            const select = item.querySelector("select");
            const input = item.querySelector("input");

            if (select && input) {
                const referencia = select.value.trim() || "Sin dato";
                const cantidad = input.value.trim() || "0";

                registros.push({
                    fecha,
                    operario,
                    referencia,
                    cantidad,
                    empaquesDañados,
                    motivoDaño,
                    anomalia,
                    descripcionAnomalia
                });
            }
        });

        console.log("📌 Registros antes de enviar:");
        console.table(registros);

        // Enviar cada registro individualmente
        Promise.all(
            registros.map(registro =>
                fetch("https://script.google.com/macros/s/AKfycbwc3ATznfBbu9vEG3ikF2aY9MXhyn-uKs6jlU-lzyGcTs9hUZXgMHZTEj-TckttLV1h/exec", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(registro)
                }).catch(error => console.error("Error al enviar datos:", error))
            )
        ).then(() => {
            console.log("✅ Datos enviados correctamente.");
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
        }).catch(error => console.error("Error en la promesa:", error));
    });
});
