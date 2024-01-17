const limite = 8;

function cargarPagina(){
    // Llama a la api y recoge todos los datos
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
        console.log(json);
        const arrayProductos = json;

        // Busca el contenedor "tarjetas"
        const tarjetas = document.getElementById('tarjetas');

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

                tarjetas.innerHTML += productoHTML;
        });
    });
}

function verDetalles(title, description, price, image) {
  const detalleProducto = document.getElementById('detalleProducto');
  const tituloModal = document.getElementById('tituloModal');
  detalleProducto.innerHTML = `
    <img src="${image}" class="w-50 mx-auto" alt="${title}">
    <p>${description}</p>
    <p class="fs-3">${price} €</p>
    <a href="#" class="btn btn-primary">Comprar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-fill" viewBox="0 0 16 16">
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg></a>
  `;
  tituloModal.innerHTML = title;
  const detalleModal = new bootstrap.Modal(document.getElementById('detalleModal'));
  detalleModal.show();
}

cargarPagina();