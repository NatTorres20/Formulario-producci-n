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

    // Habilita o deshabilita la descripción de anomalía
    anomaliaSelect.addEventListener("change", function () {
        if (anomaliaSelect.value === "Si") {
            descripcionAnomalia.disabled = false;
            descripcionAnomalia.value = "";
        } else {
            descripcionAnomalia.disabled = true;
            descripcionAnomalia.value = "";
        }
    });

    // Lista de referencias disponibles
    const referenciasLista = ["Panex 2-3 Trans", "Panex 4-6 Trans", "Panex 4-6 Blanco", "Panex 8-10 Trans"];
    numReferenciasInput.addEventListener("change", function () {
        referenciasContainer.innerHTML = "";
        const cantidad = parseInt(numReferenciasInput.value);
        if (isNaN(cantidad) || cantidad <= 0) return;
        for (let i = 0; i < cantidad; i++) {
            const div = document.createElement("div");
            div.classList.add("referencia-item");
            
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
            
            div.appendChild(select);
            div.appendChild(cantidadInput);
            referenciasContainer.appendChild(div);
        }
    });
    
    // Tabla de daños
    const tablaDaños = document.querySelector("#tabla-daños tbody");
    if (tablaDaños) {
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
    
    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const fecha = document.getElementById("Fecha")?.value;
        const operario = document.getElementById("operario")?.value;
        const empaquesDañados = document.getElementById("empaquesDañados")?.value;
        const motivoDaño = document.getElementById("motivoDaño")?.value;

        let referencias = [];
        let cantidades = [];
        referenciasContainer.querySelectorAll(".referencia-item").forEach(item => {
            const select = item.querySelector("select");
            const input = item.querySelector("input");
            if (select && input) {
                referencias.push(select.value);
                cantidades.push(input.value);
            }
        });

        let defectos = {};
        document.querySelectorAll(".input-daños").forEach(input => {
            defectos[input.getAttribute("data-tipo")] = parseInt(input.value) || 0;
        });

        const data = {
            fecha,
            operario,
            referencias,
            cantidades,
            empaquesDañados,
            motivoDaño,
            defectos,
            anomalia: anomaliaSelect.value,
            descripcionAnomalia: descripcionAnomalia.disabled ? "" : descripcionAnomalia.value
        };

        console.log("Datos a enviar:", data);

        fetch("https://script.google.com/macros/s/AKfycbyQq9jnnhuXNhr0hpLLRYjYKwT0w52StxypAENJbcWUwgADoy2rwTz9dlFC6vez3dQU/exec", {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            mensajeExito.classList.remove("hidden");
            form.reset();
            referenciasContainer.innerHTML = "";
        }).catch(error => console.error("Error:", error));
    });
});
