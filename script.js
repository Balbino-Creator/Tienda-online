// Sesiones
const usuarios = [];
const carrito = [];
let isUsuario = false;
// Configuración página
const limite = 8;
let paginaActual = 1;
let numeroProductos = 0;
let numeroPaginas = 1;
let categoriaGlobal = '';
let ascendiente = true;

// Variables para controlar el aspecto de los botones de paginación
let prevActivo = false;
let sigActivo = false;

/**
 * Se encarga de extraer los productos de la API llamandola y de crear las tarjetas de los productos e inmediatamente después, crea la paginación.
 */
function cargarPagina(){
    // Llama a la api y recoge todos los datos
    fetch(`https://fakestoreapi.com/products${categoriaGlobal !== '' ? `/category/${categoriaGlobal}` : ''}${ascendiente ? '?sort=asc' : '?sort=desc'}`)
    .then(res => res.json())
    .then(json => {
        const arrayJSON = json;

        // Cuenta cuantos productos existen
        numeroProductos = arrayJSON.length;

        // Cuenta cuantos productos hay que omitir
        const omitir = (paginaActual - 1) * limite;

        // Elige que elementos se van a mostrar segun la página en la que te encuentres
        const arrayProductos = arrayJSON.slice(omitir, limite + omitir);

        // Busca el contenedor "tarjetas"
        const tarjetas = document.getElementById('tarjetas');

        // Eliminamos su contenido para mantener la página actualizada
        tarjetas.innerHTML = '';

        // Recorre todos los productos capturados por el fetch
        arrayProductos.map(producto => {

            // Crea una tarjeta por cada producto con su informacion
            const productoHTML = `
                <article class="col">
                    <div class="card h-100" style="width: 300px; height: 600px;">
                        <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.title}</h5>
                            <p class="card-text">${producto.price} €</p>
                            <div class="d-flex justify-content-between">
                                <a href="#" class="btn btn-success" onclick="verDetalles('${producto.title}', '${producto.description}', '${producto.price}', '${producto.image}')">Ver más</a>
                                <a href="#" class="btn btn-primary">Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                            </svg></a>
                            </div>
                        </div>
                    </div>
                </article>`;

                // Añade las tarjetas al HTML
                tarjetas.innerHTML += productoHTML;
        });
        cargarPaginacion(limite);
    });
}

/**
 * Identifica cual es la ventana modal y la rellena con los datos de los productos
 * @param {string} title título del producto
 * @param {string} description descripcion del producto
 * @param {float} price precio del producto
 * @param {string} image imagen del producto
 */
function verDetalles(title, description, price, image) {
  const detalleProducto = document.getElementById('detalleProducto');
  const tituloModal = document.getElementById('tituloModal');

  // Llena la ventana modal con la información del producto
  detalleProducto.innerHTML = `
    <img src="${image}" class="w-50 mx-auto" alt="${title}">
    <p>${description}</p>
    <p class="fs-3">${price} €</p>
    <a href="#" class="btn btn-primary">Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg></a>
  `;
  tituloModal.innerHTML = title;

  // Asigna cual es la ventana modal
  const detalleModal = new bootstrap.Modal(document.getElementById('detalleModal'));
  // Muestra la ventana
  detalleModal.show();
}

/**
 * Generará la cantidad de botones necesarios para la página según la cantidad de productos en pantalla
 * @param {int} limite Numero máximo de productos que se pueden mostrar
 */
function cargarPaginacion(limite){

    // Calcula el numero de páginas que tendrá la página
    numeroPaginas = Math.ceil(numeroProductos/limite);

    const paginacion = document.getElementById('paginacion');

    const previousHTML = `
        <li class="page-item ${prevActivo ? 'active' : 'disabled'}" onclick="paginaAnterior()"><a class="page-link" href="#">Previous</a></li>
    `;
    const nextHTML = `
        <li class="page-item ${sigActivo ? 'active' : 'disabled'}" onclick="paginaSiguiente()"><a class="page-link" href="#">Next</a></li>
    `;
    let paginacionHTML = '';

    // Crea un boton por cada página de productos
    for(let i = 1; i <= numeroPaginas; i++){
        paginacionHTML += `<li class="page-item ${paginaActual == i ? 'active' : ''}" onclick="setPaginaActual(${i})"><a class="page-link" href="#">${i}</a></li>`;
    }

    // Añade al HTML los botones para cambiar de página
    paginacion.innerHTML = (paginaActual > 1 ? previousHTML : '') + paginacionHTML + (paginaActual < numeroPaginas ? nextHTML : '');
}

/**
 * Regresa a la página anterior y cambia los estilos para que se note que el boton ha sido pulsado
 */
function paginaAnterior(){
    if(paginaActual > 1){
        paginaActual--;
        prevActivo = true;
        sigActivo = false;
    }
    cargarPagina();
}

/**
 * Avanza a la página siguiente y cambia los estilos para que se note que el boton ha sido pulsado
 */
function paginaSiguiente(){
    if(paginaActual < numeroPaginas){
        paginaActual++;
        sigActivo = true;
        prevActivo = false;
    }
    cargarPagina();
}

/**
 * Actualiza el numero de página al numero proporcionado
 * @param {int} numero Numero de página
 */
function setPaginaActual(numero){
    paginaActual = numero;
    cargarPagina();
}

/**
 * Llama a la API y crea un desplegable con todas las categorias de productos de la FakeStoreAPI
 */
function cargarCategorias(){
    const categorias = document.getElementById('categorias');

    fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(json=> {

                const categoriasJSON = json;

                let categoriasHTML = categorias.innerHTML;

                // Genera todas las categorias
                categoriasJSON.map(categoria =>{
                    categoriasHTML += `<li onclick="seleccionarCategoria('${categoria}')"><a class="dropdown-item" href="#">${categoria}</a></li>`;
                })

                // Añade las categorías
                categorias.innerHTML = categoriasHTML;
            })
}

/**
 * Carga la página con la categoria que se ha seleccionado en el filtro
 * @param {string} categoria Nombre de la categoria
 */
function seleccionarCategoria(categoria){
    categoriaGlobal = categoria;
    cargarPagina();
}

/**
 * Añade el valor ascendente o descendente a la página según se indique en el parámetro
 * @param {boolean} isAsc ¿es ascendente?
 */
function setAscendiente(isAsc){
    isAsc ? ascendiente = true : ascendiente = false;
    cargarPagina();
}

/**
 * Abre la ventana modal del login siempre y cuando no hayas iniciado sesion como usuario
 */
function abrirModal(){
    if(!isUsuario){
        // Asigna cual es la ventana modal
        const Modal = new bootstrap.Modal(document.getElementById('loginModal'));
        // Muestra la ventana
        Modal.show();
    }
}

/**
 * Abre la ventana modal del registro
 */
function abrirModalRegistro(){
    // Asigna cual es la ventana modal
    const Modal = new bootstrap.Modal(document.getElementById('registroModal'));
    // Muestra la ventana
    Modal.show();
}

/**
 * Controla el registro de nuevos usuarios y el inicio de sesion de los mismos
 * @param {string} modo inicio: el usuario se esta registrando. registro: el usuario se está registrando
 */
function comprobarUsuario(modo){
    if(modo === 'inicio'){
        const usuario = document.getElementById('usuarioLogin').value;
        const password = document.getElementById('passwordLogin').value;
        // Busca al usuario y comprueba si corresponde la contraseña
        for(let i = 0; i < usuarios.length; i++){
            if(usuarios[i][0] === usuario){
                if(usuarios[i][1] === password){
                    isUsuario = true;
                    // Cierra el modal
                    const Modal = new bootstrap.Modal(document.getElementById('loginModal'));
                    Modal.hide();
                    break;
                }
            }
        }
        if(!isUsuario){
            console.log('El usuario o la contraseña son incorrectos');
        }
    } else if (modo === 'registro'){
        const usuario = document.getElementById('usuarioRegistro').value;
        const password = document.getElementById('passwordRegistro').value;
        if(usuarioExists(usuarios, usuario)){
            console.log('Este usuario ya existe, no se puede registrar con este nombre');
        } else {
            usuarios.push([usuario,password]);
            // Cierra el modal
            const Modal = new bootstrap.Modal(document.getElementById('registroModal'));
            Modal.hide();
        }
    }
}

/**
 * Comprueba si el usuario indicado existe en la lista indicada
 * @param {array} usuarios Lista de usuarios
 * @param {string} usuario Nombre de usuario
 * @returns si existe true y si no false
 */
function usuarioExists(usuarios, usuario){
    usuarios.map(u => {
        if(u[0] === usuario){
            return true;
        }
    });
    return false;
}

cargarPagina();
cargarCategorias();