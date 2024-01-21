// Sesiones
const usuarios = [];
const carrito = [];
let isUsuario = false;
let nameUsuario = '';
// Configuración página
const limite = 8;
let paginaActual = 1;
let numeroProductos = 0;
let numeroPaginas = 1;
let categoriaGlobal = '';
let ascendiente = true;
let carritoAbierto = false;
// Variables para controlar el aspecto de los botones de paginación
let prevActivo = false;
let sigActivo = false;

/**
 * Se encarga de extraer los productos de la API llamandola y de crear las tarjetas de los productos e inmediatamente después, crea la paginación.
 */
function cargarPagina(){

    // Muestra el spinner mientras se cargan los productos
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';

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
                                <a href="#" class="btn btn-primary" onclick="comprar('${producto.title}', ${producto.price})">Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                            </svg></a>
                            </div>
                        </div>
                    </div>
                </article>`;

                // Añade las tarjetas al HTML
                tarjetas.innerHTML += productoHTML;
        });

        // Oculta el spinner después de cargar los productos
        spinner.classList = 'd-none';

        cargarPaginacion(limite);
    })
    .catch(error => {
        const contenedor = document.getElementById('erroresPagina');
        mostrarAlerta('Error al cargar los productos', 'alert-danger', contenedor);
        
        // Oculta el spinner
        spinner.classList = 'd-none';
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
    <a href="#" onclick="comprar('${title}', ${price})" class="btn btn-primary">Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
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
 * Abre la ventana modal del login siempre y cuando no hayas iniciado sesion como usuario o el carrito si la sesion está iniciada
 */
function abrirModal(){
    if(!isUsuario){
        // Asigna cual es la ventana modal
        const Modal = new bootstrap.Modal(document.getElementById('loginModal'));
        // Muestra la ventana
        Modal.show();
    } else {
        // Si es true al pulsar el icono del carrito se ocultará y si es false mostrará el carrito
        if(carritoAbierto){
            irInicio();
        }else{
            irCarrito();
        }
    }
}

/**
 * Cambia la visualización para ir a la página de inicio.
 * @description Oculta el carrito y muestra la página de inicio.
 */
function irInicio(){
    const inicio = document.getElementById('inicio');
    const carrito = document.getElementById('carrito');
    inicio.className = 'd-block';
    carrito.className = 'd-none'
    carritoAbierto = false;
}

/**
 * Cambia la visualización para ir a la página del carrito.
 * @description Oculta la página de inicio y muestra el carrito.
 */
function irCarrito(){
    const inicio = document.getElementById('inicio');
    const carrito = document.getElementById('carrito');
    inicio.className = 'd-none';
    carrito.className = 'd-block'
    carritoAbierto = true;
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
        const contenedor = document.getElementById('alertasLogin');

        // Busca al usuario y comprueba si corresponde la contraseña
        for(let i = 0; i < usuarios.length; i++){
            if(usuarios[i][0] === usuario){
                if(usuarios[i][1] === password){

                    isUsuario = true;
                    nameUsuario = usuario;

                    // Cierra el modal
                    const Modal = new bootstrap.Modal(document.getElementById('loginModal'));
                    Modal.hide();

                    // Habilita la opción: Cerrar Sesión
                    const navUtilidades = document.getElementById('navUtilidades');
                    const opcion = document.createElement('li');
                    opcion.id = 'cerrarSesion';
                    opcion.className = 'nav-item';
                    opcion.onclick = cerrarSesion;
                    opcion.innerHTML = '<a class="nav-link fs-5 text-center" aria-current="page" href="#">Cerrar Sesión</a>';
                    navUtilidades.appendChild(opcion);

                    mostrarAlerta('¡Inicio de sesión exitoso!', 'alert-success', contenedor);

                    break;
                }
            }
        }
        if(!isUsuario){
            mostrarAlerta('El usuario o la contraseña son incorrectos', 'alert-danger', contenedor);
        }
    } else if (modo === 'registro'){
        const usuario = document.getElementById('usuarioRegistro').value;
        const password = document.getElementById('passwordRegistro').value;
        const contenedor = document.getElementById('alertasRegistro');

        if(usuarioExists(usuarios, usuario)){
            mostrarAlerta('Este usuario ya existe. No se puede registrar con este nombre.', 'alert-danger', contenedor);
        } else {
            usuarios.push([usuario,password]);
            // Cierra el modal
            const Modal = new bootstrap.Modal(document.getElementById('registroModal'));
            Modal.hide();

            mostrarAlerta('¡Registro exitoso!', 'alert-success', contenedor);
        }
    }
}

/**
 * Muestra una alerta en un contenedor específico.
 * @param {string} mensaje - Mensaje de la alerta.
 * @param {string} tipo - Tipo de alerta (por ejemplo, 'alert-success' o 'alert-danger').
 * @param {HTMLElement} contenedor - Contenedor donde se mostrará la alerta.
 */
function mostrarAlerta(mensaje, tipo, contenedor) {
    // Elimina alertas anteriores
    const alertas = contenedor.querySelectorAll('.alert');
    alertas.forEach(alerta => alerta.remove());

    // Crea la nueva alerta
    const alerta = document.createElement('div');
    alerta.className = `alert ${tipo} mt-3`;
    alerta.innerHTML = mensaje;

    contenedor.appendChild(alerta);

    // Desaparece la alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
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

/**
 * Cierra la sesión del usuario.
 * @description Restablece valores de sesión y oculta elementos relacionados con la sesión.
 */
function cerrarSesion(){
    const inicio = document.getElementById('inicio');
    const carrito = document.getElementById('carrito');
    const liSesion = document.getElementById('cerrarSesion');
    // Desabilitamos el boton de cerrar sesion
    liSesion.className = 'd-none';
    // Resesteamos valores de sesion
    isUsuario = false;
    nameUsuario = '';
    inicio.className = 'd-block';
    carrito.className = 'd-none'
}

/**
 * Añade un producto al carrito.
 * @param {string} title - Título del producto.
 * @param {float} price - Precio del producto.
 */
function comprar(title, price){
    if(!isUsuario){
        // Asigna cual es la ventana modal
        const Modal = new bootstrap.Modal(document.getElementById('loginModal'));
        // Muestra la ventana
        Modal.show();
    } else {
        // Busca si el producto ya está en el carrito
        const yaExiste = carrito.findIndex(item => item[0] === nameUsuario && item[1][0] === title);

        if (yaExiste !== -1) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            carrito[yaExiste][1][2]++;
        } else {
            carrito.push([nameUsuario, [title, price, 1]]);
        }
        cargarCarrito();
    }
}


/**
 * Carga los productos en el carrito y muestra la información en la interfaz.
 */
function cargarCarrito(){
    const listaCompra = document.getElementById('listaCompra');

    const totalCompraHTML = document.getElementById('totalCompra');
    let totalCompra = 0;

    listaCompra.innerHTML = '';

    for(let i = 0; i < carrito.length; i++){
        if(carrito[i][0] === nameUsuario){

            const subtotal = carrito[i][1][1] * carrito[i][1][2];
            totalCompra += subtotal;

            listaCompra.innerHTML += `
            <tr>
                <td>${carrito[i][1][0]}</td>
                <td>${carrito[i][1][1]}€</td>
                <td>
                    <svg onclick="decrementarCantidad(${i})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" style="cursor: pointer;" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                    </svg>
                    ${carrito[i][1][2]}
                    <svg onclick="incrementarCantidad(${i})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" style="cursor: pointer;" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </td>
                <td>${subtotal}€</td>
                <td onclick="eliminarProducto(${i})" style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </td>
            </tr>`;
        }
    }
    totalCompraHTML.innerHTML = `
    <tr>
        <td colspan="5">${totalCompra}€</td>
    </tr>
    `;
}

/**
 * Incrementa la cantidad de un producto en el carrito.
 * @param {number} index - Índice del producto en el carrito.
 */
function incrementarCantidad(index) {
    carrito[index][1][2]++;
    cargarCarrito();
}

/**
 * Decrementa la cantidad de un producto en el carrito.
 * @param {number} index - Índice del producto en el carrito.
 */
function decrementarCantidad(index) {
    if (carrito[index][1][2] > 1) {
        carrito[index][1][2]--;
        cargarCarrito();
    }
}

/**
 * Elimina un producto del carrito.
 * @param {number} index - Índice del producto en el carrito.
 */
function eliminarProducto(index) {
    carrito.splice(index, 1);
    cargarCarrito();
}

cargarPagina();
cargarCategorias();