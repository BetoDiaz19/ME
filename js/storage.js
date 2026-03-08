function guardarEnStorage(clave, datos){
    localStorage.setItem(clave, JSON.stringify(datos));
}

function obtenerDeStorage(clave){
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
}