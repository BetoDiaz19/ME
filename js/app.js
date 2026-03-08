
let participantes = JSON.parse(localStorage.getItem("participantes")) || [];
let excepciones = JSON.parse(localStorage.getItem("excepciones")) || [];

let dadorTemp = "";
let receptorTemp = "";

function setCelebracion(valor) {
    document.getElementById("celebracion").value = valor;
}

function setPresupuesto(valor) {
    document.getElementById("presupuesto").value = valor;
}

function guardarEvento() {
    const organizador = document.getElementById("organizador").value;
    const participa = document.getElementById("participa").checked;
    
    if (!organizador) return alert("Por favor, ingresa el nombre del organizador");

    const evento = {
        organizador,
        participa,
        celebracion: document.getElementById("celebracion").value,
        presupuesto: document.getElementById("presupuesto").value,
        fecha: document.getElementById("fecha").value
    };

    localStorage.setItem("evento", JSON.stringify(evento));

    if (participa) {
        if (!participantes.includes(organizador)) {
            participantes.push(organizador);
            localStorage.setItem("participantes", JSON.stringify(participantes));
        }
    }

    window.location.href = "participantes.html";
}


function agregarParticipante() {
    const input = document.getElementById("nombreParticipante");
    const nombre = input.value.trim();
    
    if (nombre === "") return;
    if (participantes.includes(nombre)) return alert("Este nombre ya existe");

    participantes.push(nombre);
    localStorage.setItem("participantes", JSON.stringify(participantes));
    input.value = "";
    mostrarParticipantes();
}

function mostrarParticipantes() {
    const lista = document.getElementById("listaParticipantes");
    if (!lista) return;
    lista.innerHTML = "";
    participantes.forEach((p, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${p} <button onclick="eliminarParticipante(${index})" style="background:red; padding:2px 5px; font-size:10px;">X</button>`;
        lista.appendChild(li);
    });
}

function eliminarParticipante(index) {
    participantes.splice(index, 1);
    localStorage.setItem("participantes", JSON.stringify(participantes));
    mostrarParticipantes();
}

function guardarParticipantes() {
    if (participantes.length < 2) return alert("Necesitas al menos 2 personas");
    window.location.href = "excepciones.html";
}



function allowDrop(ev) {
    ev.preventDefault(); 
    ev.target.style.border = "2px solid #2ecc71";
}

function drag(ev) {
    ev.dataTransfer.setData("nombre", ev.target.innerText);
}

function drop(ev, tipo) {
    ev.preventDefault();
    ev.target.style.border = "2px dashed #95a5a6";
    
    const nombre = ev.dataTransfer.getData("nombre");
    
    if (tipo === 'dador') {
        dadorTemp = nombre;
        ev.target.innerText = "Dador: " + nombre;
    } else if (tipo === 'receptor') {
        receptorTemp = nombre;
        ev.target.innerText = "Receptor: " + nombre;
    }
}

function confirmarExcepcion() {
    if (!dadorTemp || !receptorTemp) return alert("Arrastra nombres a ambos cuadros");
    if (dadorTemp === receptorTemp) return alert("No puedes excluir a alguien de sí mismo");


    const yaExiste = excepciones.some(e => e.de === dadorTemp && e.a === receptorTemp);
    if (yaExiste) return alert("Esta regla ya existe");

    excepciones.push({ de: dadorTemp, a: receptorTemp });
    localStorage.setItem("excepciones", JSON.stringify(excepciones));
    

    dadorTemp = ""; receptorTemp = "";
    document.getElementById("dropDador").innerText = "Arrastra dador aquí";
    document.getElementById("dropReceptor").innerText = "Arrastra receptor aquí";
    
    mostrarExcepciones();
}

function mostrarExcepciones() {
    const lista = document.getElementById("listaExcepciones");
    if (!lista) return;
    lista.innerHTML = "";
    excepciones.forEach((e, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${e.de} ❌ no regala a ${e.a} <button onclick="eliminarExcepcion(${index})">Eliminar</button>`;
        lista.appendChild(li);
    });
}

function eliminarExcepcion(index) {
    excepciones.splice(index, 1);
    localStorage.setItem("excepciones", JSON.stringify(excepciones));
    mostrarExcepciones();
}



function realizarSorteo() {
    let intentos = 0;
    let exito = false;
    let asignaciones = [];


    while (!exito && intentos < 1000) {
        intentos++;
        let dadores = [...participantes];
        let receptores = [...participantes].sort(() => Math.random() - 0.5);
        
        asignaciones = [];
        exito = true;

        for (let i = 0; i < dadores.length; i++) {
            let d = dadores[i];
            let r = receptores[i];


            const esInvalido = d === r || excepciones.some(ex => ex.de === d && ex.a === r);
            
            if (esInvalido) {
                exito = false;
                break;
            }
            asignaciones.push({ dador: d, receptor: r });
        }
    }

    const tabla = document.getElementById("resultado");
    if (!tabla) return;
    tabla.innerHTML = "";

    if (exito) {
        asignaciones.forEach((par, i) => {
            tabla.innerHTML += `<tr><td>${i + 1}</td><td>${par.dador}</td><td>${par.receptor}</td></tr>`;
        });
    } else {
        alert("Imposible realizar sorteo con esas reglas. ¡Elimina algunas excepciones!");
    }
}

function irASorteo() { window.location.href = "sorteo.html"; }


window.onload = function() {
    if (document.getElementById("listaParticipantes")) mostrarParticipantes();
    
    if (document.getElementById("listaArrastrable")) {
        // Cargar chips arrastrables en la página de excepciones
        const cont = document.getElementById("listaArrastrable");
        cont.innerHTML = participantes.map(p => 
            `<div class="chip" draggable="true" ondragstart="drag(event)" 
             style="background:#3498db; color:white; padding:5px 10px; margin:5px; border-radius:15px; cursor:move; display:inline-block;">${p}</div>`
        ).join('');
        mostrarExcepciones();
    }
    
    if (document.getElementById("resultado")) {
    }

};
