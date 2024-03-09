let productosData; 

async function renderProductos() {
  
  document.getElementById("productos").innerHTML = '<div class="loading">Cargando productos...</div>';

  try {
    const respuesta = await fetch('./js/productos.json');
    const data = await respuesta.json();
    productosData = data; 

    let contenido = "";
    for (const producto of data) {
      contenido += `<div class="col-xl-6 text-center card">
        <img src="${producto.imagen}" alt="${producto.peso}" />
        <p>Cantidad en peso: ${producto.descripcion}</p>
        <p>Precio: $${producto.precio}</p>
        <p>Cantidad de sabores máximo: ${producto.cantidadSabores}</p>
        <p>Código de Producto: ${producto.codigo}</p>
      </div>`;
    }

   
    setTimeout(() => {
      document.getElementById("productos").innerHTML = contenido;
    }, 1000); 
  } catch (error) {
    
    document.getElementById("productos").innerHTML = '<div class="alert alert-danger text-center" role="alert"> Oopps, parece que lo que estabas buscando no está disponible</div>';
  }
}

renderProductos();

document.getElementById("confirmarPedido").addEventListener("click", () => {
  const codigoProducto = parseInt(document.getElementById("codigoProducto").value);
  const codigoPostal = parseInt(document.getElementById("codigoPostal").value);

  const productoElegido = productosData.find(producto => producto.codigo === codigoProducto);

  if (!productoElegido) {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Por favor, ingrese un producto",
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  let costoEnvio = 0;
  if (codigoPostal >= 1000 && codigoPostal <= 1699) {
    costoEnvio = 500;
  } else if (codigoPostal >= 1700 && codigoPostal <= 2000) {
    costoEnvio = 1000;
  } else {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Por favor, ingrese un código postal válido",
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  const costoTotal = productoElegido.precio + costoEnvio;
  document.getElementById("totalCosto").textContent = `El costo total es: $${costoTotal}`;

  
  let historialPedidos = JSON.parse(localStorage.getItem("historialPedidos")) || [];
  historialPedidos.push({ codigoProducto, codigoPostal, costoTotal });
  localStorage.setItem("historialPedidos", JSON.stringify(historialPedidos));

  
});