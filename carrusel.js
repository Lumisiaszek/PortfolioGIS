function inicializarCarrusel() {
    const imagenes = document.querySelectorAll('.capa-mapa');
    const contenedorPuntos = document.getElementById('indicadores-puntos');

    console.log("Imágenes encontradas:", imagenes.length);

    if (!contenedorPuntos || imagenes.length === 0) return;

    contenedorPuntos.innerHTML = '';

    imagenes.forEach((_, index) => {
        const punto = document.createElement('div');
        punto.classList.add('punto');
        if (index === 0) punto.classList.add('activo');
        
        punto.addEventListener('click', () => actualizarVista(index));
        
        contenedorPuntos.appendChild(punto);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarrusel);
} else {
    inicializarCarrusel();
}

function cambiarImagen(direccion) {
    const imagenes = document.querySelectorAll('.capa-mapa');
    let indiceActual = 0;


    imagenes.forEach((img, index) => {
        if (img.classList.contains('activa')) indiceActual = index;
    });


    let nuevoIndice = (indiceActual + direccion + imagenes.length) % imagenes.length;
    actualizarVista(nuevoIndice);
}

function actualizarVista(indice) {
    const imagenes = document.querySelectorAll('.capa-mapa');
    const puntos = document.querySelectorAll('.punto');


    imagenes.forEach(img => img.classList.remove('activa'));
    

    if (imagenes[indice]) {
        imagenes[indice].classList.add('activa');

        const esMapa = imagenes[indice].id === 'mapa-sit' || imagenes[indice].querySelector('#mapa-sit');
        
        if (esMapa && window.mapaSIT) {
            setTimeout(() => {
                window.mapaSIT.invalidateSize();
            }, 100);
        }

    }
    puntos.forEach(p => p.classList.remove('activo'));
    if (puntos[indice]) puntos[indice].classList.add('activo');
}