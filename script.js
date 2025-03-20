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
            select.classList.add("referencia");
            referenciasLista.forEach(ref => {
                const option = document.createElement("option");
                option.value = ref;
                option.textContent = ref;
                select.appendChild(option);
            });

            const cantidadInput = document.createElement("input");
            cantidadInput.type = "number";
            cantidadInput.classList.add("cantidad");
            cantidadInput.min = "1";
            cantidadInput.placeholder = "Cantidad";

            div.appendChild(label);
            div.appendChild(select);
            div.appendChild(cantidadInput);
            referenciasContainer.appendChild(div);
        }
    });

    anomaliaSelect.addEventListener("change", function () {
        descripcionAnomalia.style.display = anomaliaSelect.value === "Si" ? "block" : "none";
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const operario = operarioSelect.value;
        const referenciasSeleccionadas = document.querySelectorAll(".referencia");
        const cantidadesIngresadas = document.querySelectorAll(".cantidad");

        if (referenciasSeleccionadas.length === 0) {
            alert("Debe seleccionar al menos una referencia.");
            return;
        }

        let referenciasData = [];
        referenciasSeleccionadas.forEach((select, index) => {
            const referencia = select.value;
            const cantidad = cantidadesIngresadas[index].value;

            if (!cantidad || cantidad <= 0) {
                alert(`La cantidad de la referencia ${referencia} debe ser mayor a 0.`);
                return;
            }

            referenciasData.push({
                referencia: referencia,
                cantidad: cantidad
            });
        });

        const fecha = document.getElementById("fecha").value;
        const anomalia = anomaliaSelect.value;
        const descripcion = anomalia === "Si" ? document.getElementById("detalleAnomalia").value : "N/A";

        const datos = {
            operario: operario,
            fecha: fecha,
            referencias: referenciasData,
            anomalia: anomalia,
            descripcion: descripcion
        };

        fetch("https://script.google.com/macros/s/AKfycbwOft80WR9nXMP0fR_rVdImlSud0ilj9MPQv0Zjh-EjqGI2tjQctfrCrm0OvtHZGmZN/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(() => {
            mensajeExito.textContent = "Registro exitoso.";
            mensajeExito.style.display = "block";
            setTimeout(() => {
                mensajeExito.style.display = "none";
            }, 3000);
            form.reset();
            referenciasContainer.innerHTML = "";
            descripcionAnomalia.style.display = "none";
        })
        .catch(error => {
            console.error("Error al enviar los datos:", error);
            alert("Hubo un problema al registrar los datos.");
        });
    });
});
