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
             label.textContent = Referencia ${i + 1}:;
 
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
 
     // Tabla de daños
     const tablaDaños = document.querySelector("#tabla-daños tbody");
 
     if (!tablaDaños) {
         console.error("No se encontró la tabla de daños.");
     } else {
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
 
     // Habilita o deshabilita la descripción de anomalía
     anomaliaSelect.addEventListener("change", function () {
         descripcionAnomalia.disabled = anomaliaSelect.value === "No";
     });
 
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
             defectos[input.getAttribute("data-tipo")] = input.value;
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
             descripcionAnomalia: descripcionAnomalia.value
         };
 
         console.log("Datos a enviar:", data);
 
         fetch("https://script.google.com/macros/s/AKfycbwOft80WR9nXMP0fR_rVdImlSud0ilj9MPQv0Zjh-EjqGI2tjQctfrCrm0OvtHZGmZN/exec", {
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
 });                                 mi codigo para index.html es el siguiente; <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Producción</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        
        <h2 class="titulo-formulario">REGISTRO DE PRODUCCIÓN CAUCHOS JTORRES</h2>

        
        <form id="registroForm">

            <label for="Fecha">Fecha:</label>
            <input type="date" id="Fecha" required>
            
            <label for="operario">Nombre del operario:</label>
            <select id="operario" required>
                <option value="" disabled selected>Seleccione un operario</option>
                <option value="Diego Lopez">Diego Lopez </option>

            </select>



            <label for="numReferencias">¿Cuántas referencias fabricó hoy?</label>
            <input type="number" id="numReferencias" min="1" required>

            <div id="referenciasContainer"></div>

    

            <h3>Registro de Empaques Dañados</h3>
<table id="tabla-daños">
    <thead>
        <tr>
            <th>Tipo de Daño</th>
            <th>Cantidad</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Burbuja</td>
            <td><input type="number" min="0" value="0"></td>
        </tr>
        <tr>
            <td>Roto</td>
            <td><input type="number" min="0" value="0"></td>
        </tr>
        <tr>
            <td>Crudo</td>
            <td><input type="number" min="0" value="0"></td>
        </tr>
        <tr>
            <td>Quemado</td>
            <td><input type="number" min="0" value="0"></td>
        </tr>
        <tr>
            <td>Otro</td>
            <td><input type="number" min="0" value="0"></td>
        </tr>
    </tbody>
</table>


            
            
            <label for="anomalia">¿Hubo alguna anomalía o novedad en la jornada?</label>
            <select id="anomalia">
                <option value="No">No</option>
                <option value="Sí">Sí</option>
            </select>

            <label for="descripcionAnomalia">Descripción de la anomalía o novedad:</label>
            <textarea id="descripcionAnomalia" disabled></textarea>

            <button type="submit">Enviar Registro</button>
        </form>

        <p id="mensajeExito" class="hidden">Gracias DIEGO! Registro enviado con éxito ✅</p>
    </div>

    <script src="script.js"></script>
</body>
</html>
