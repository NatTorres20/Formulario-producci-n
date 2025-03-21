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
    } else {
        console.error("No se encontró la tabla de daños.");
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let defectos = {};
        document.querySelectorAll(".input-daños").forEach(input => {
            defectos[input.getAttribute("data-tipo")] = parseInt(input.value) || 0;
        });

        const data = {
            fecha: document.getElementById("Fecha")?.value,
            operario: document.getElementById("operario")?.value,
            referencias: Array.from(document.querySelectorAll(".referencia-item select"), select => select.value),
            cantidades: Array.from(document.querySelectorAll(".referencia-item input"), input => input.value),
            empaquesDañados: document.getElementById("empaquesDañados")?.value,
            motivoDaño: document.getElementById("motivoDaño")?.value,
            defectos: defectos,
            anomalia: anomaliaSelect.value,
            descripcionAnomalia: descripcionAnomalia.value
        };

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
