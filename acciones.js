let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let total = 0;

const btnsAgregar = document.querySelectorAll('.btn');
const carritoContenido = document.getElementById('carrito-contenido');
const carritoLateral = document.getElementById('carrito-lateral');
const btnCerrar = document.getElementById('cerrar-carrito');
const btnPagar = document.getElementById('btn-pagar');
const carritoBtn = document.getElementById('carrito');

// Crear contador de productos
const contadorProductos = document.createElement('span');
contadorProductos.id = 'contador-productos';
contadorProductos.style.marginLeft = '5px';
carritoBtn.appendChild(contadorProductos);

// Mostrar/Ocultar carrito
carritoBtn.addEventListener('click', () => {
  carritoLateral.style.right = '0';
});

btnCerrar.addEventListener('click', () => {
  carritoLateral.style.right = '-300px';
});

// Agregar productos
btnsAgregar.forEach(btn => {
  if (btn.textContent.trim().toUpperCase() === 'ADD TO CAR') {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.card');
      const nombre = card.querySelector('.card-title').textContent.trim();
      const precioTexto = card.querySelector('.card-price').textContent.trim().replace(/[^\d]/g, '');
      const precio = parseFloat(precioTexto);
      const imagen = card.querySelector('img').src;

      agregarAlCarrito({ nombre, precio, imagen });
    });
  }
});

function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.nombre === producto.nombre);
  if (existente) {
    existente.cantidad += 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  guardarCarrito();
  actualizarCarrito();
}

function eliminarDelCarrito(nombre) {
  carrito = carrito.filter(p => p.nombre !== nombre);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoContenido.innerHTML = '';
  total = 0;
  let cantidadTotal = 0;

  carrito.forEach(producto => {
    const item = document.createElement('div');
    item.classList.add('item-carrito');

    total += producto.precio * producto.cantidad;
    cantidadTotal += producto.cantidad;

    item.innerHTML = `
      <img src="${producto.imagen}" width="50" style="border-radius: 5px;">
      <span style="margin-left: 10px;">x${producto.cantidad}</span>
      <span style="margin-left: auto; font-weight: bold;">${(producto.precio * producto.cantidad).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
      <button style="margin-left: 10px;" onclick="eliminarDelCarrito('${producto.nombre}')">❌</button>
    `;

    carritoContenido.appendChild(item);
  });

  const totalDiv = document.createElement('div');
  totalDiv.style.marginTop = '15px';
  totalDiv.style.fontWeight = 'bold';
  totalDiv.textContent = `Total: ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
  carritoContenido.appendChild(totalDiv);

  contadorProductos.textContent = cantidadTotal;
}

// Guardar en localStorage
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Pagar
btnPagar.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
  } else {
    alert(`Total a pagar: ${total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`);
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  }
});

// Mostrar carrito al cargar
actualizarCarrito();
