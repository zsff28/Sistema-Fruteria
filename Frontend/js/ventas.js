// 1. Estado en memoria: se reinicia al recargar la página.
const elemento = id => document.getElementById(id);
const dinero = centavos => (centavos / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const escapar = texto => String(texto).replace(/[&<>"']/g, caracter => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[caracter]));
let cuentas = [{ id: 1, lineas: [] }];
let cuentaActiva = 1;
let siguienteCuenta = 2;
let siguienteTicket = 1;
let categoria = 'Frutas';
let productoActual = null;
let indiceEdicion = null;
const cuenta = () => cuentas.find(c => c.id === cuentaActiva);
// Precio en centavos y peso en milésimas: redondeo por línea del ticket.
const importeLinea = linea => Math.round(linea.precioCentavos * linea.cantidadMilesimas / 1000);
const totalCuenta = () => cuenta().lineas.reduce((total, linea) => total + importeLinea(linea), 0);
const cantidadTexto = linea => `${linea.cantidadMilesimas / 1000} ${escapar(linea.unidad)}`;

// 2. Inicio y navegación entre cuentas.
elemento('entrar').onclick = () => { elemento('inicio').hidden = true; elemento('sistema').hidden = false; };
elemento('salir').onclick = () => { elemento('sistema').hidden = true; elemento('inicio').hidden = false; };
function dibujarCuentas() {
  elemento('cuentas').replaceChildren();
  cuentas.forEach(c => {
    const boton = document.createElement('button');
    boton.textContent = `Cuenta ${c.id} (${c.lineas.length})`;
    boton.className = c.id === cuentaActiva ? 'activo' : '';
    boton.onclick = () => { cuentaActiva = c.id; dibujarTicket(); };
    elemento('cuentas').append(boton);
  });
  const nueva = document.createElement('button');
  nueva.textContent = 'Nueva cuenta';
  nueva.onclick = () => { cuentaActiva = siguienteCuenta++; cuentas.push({id: cuentaActiva, lineas: []}); dibujarTicket(); };
  elemento('cuentas').append(nueva);
}

// 3. Catálogo y búsqueda.
function dibujarCategorias() {
  elemento('categorias').replaceChildren();
  categorias.forEach(nombre => {
    const boton = document.createElement('button');
    boton.textContent = nombre;
    boton.className = nombre === categoria ? 'activo' : '';
    boton.onclick = () => { categoria = nombre; elemento('buscar').value = ''; dibujarCategorias(); dibujarProductos(); };
    elemento('categorias').append(boton);
  });
}
const normalizar = texto => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function dibujarProductos() {
  elemento('productos').replaceChildren();
  const visibles = productos.filter(p => (elemento('buscar').value.trim() || p.categoria === categoria) && normalizar(p.nombre).includes(normalizar(elemento('buscar').value.trim())));
  elemento('titulo-categoria').textContent = elemento('buscar').value.trim() ? 'Resultados en todas las categorías' : categoria;
  elemento('cantidad-productos').textContent = `${visibles.length} productos`;
  visibles.forEach(p => {
    const boton = document.createElement('button');
    boton.className = 'producto';
    boton.title = `${p.nombre} · ${p.unidad}`;
    boton.innerHTML = `<span class="sin-imagen">Sin imagen</span><strong>${escapar(p.nombre)}</strong>`;
    const imagen = document.createElement('img');
    imagen.alt = '';
    imagen.onload = () => { boton.firstElementChild.replaceWith(imagen); };
    if (p.imagen) imagen.src = p.imagen;
    boton.onclick = () => abrirProducto(p);
    elemento('productos').append(boton);
  });
  if (!visibles.length) elemento('productos').textContent = 'No se encontraron productos. Prueba otro nombre o agrega uno.';
}
elemento('buscar').oninput = dibujarProductos;

// 4. Agregar o editar precio y peso antes de guardar en el ticket.
function abrirProducto(producto, indice = null) {
  productoActual = producto;
  indiceEdicion = indice;
  const linea = indice === null ? null : cuenta().lineas[indice];
  elemento('nombre-producto').textContent = producto.nombre;
  elemento('label-precio').textContent = `Precio por ${producto.unidad} (MXN)`;
  elemento('label-cantidad').textContent = producto.unidad === 'kg' ? 'Peso (kg)' : `Cantidad (${producto.unidad})`;
  elemento('precio').value = linea ? linea.precioCentavos / 100 : producto.precio;
  elemento('cantidad').min = producto.unidad === 'kg' ? '0.001' : '1';
  elemento('cantidad').step = producto.unidad === 'kg' ? '0.001' : '1';
  elemento('cantidad').value = linea ? linea.cantidadMilesimas / 1000 : 1;
  elemento('guardar-producto').textContent = indice === null ? 'Agregar al ticket' : 'Guardar cambios';
  actualizarImporte();
  elemento('editor').showModal();
  elemento('cantidad').focus();
  elemento('cantidad').select();
}
function leerLinea() {
  return { productoId: productoActual.id, nombre: productoActual.nombre, unidad: productoActual.unidad,
    precioCentavos: Math.round(Number(elemento('precio').value) * 100), cantidadMilesimas: Math.round(Number(elemento('cantidad').value) * 1000) };
}
function actualizarImporte() {
  const valido = elemento('precio').checkValidity() && elemento('cantidad').checkValidity();
  elemento('importe').textContent = valido ? dinero(importeLinea(leerLinea())) : 'Revisa los valores';
}
elemento('precio').oninput = actualizarImporte;
elemento('cantidad').oninput = actualizarImporte;
elemento('form-producto').onsubmit = evento => {
  evento.preventDefault();
  if (!evento.target.reportValidity()) return;
  const linea = leerLinea();
  if (indiceEdicion === null) cuenta().lineas.push(linea);
  else cuenta().lineas[indiceEdicion] = linea;
  elemento('editor').close();
  dibujarTicket();
};
function dibujarTicket() {
  elemento('filas').replaceChildren();
  cuenta().lineas.forEach((linea, indice) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td>${escapar(linea.nombre)}</td><td>${cantidadTexto(linea)}</td><td>${dinero(linea.precioCentavos)} / ${escapar(linea.unidad)}</td><td>${dinero(importeLinea(linea))}</td><td></td>`;
    const editar = document.createElement('button'); editar.textContent = 'Editar';
    editar.onclick = () => abrirProducto(productos.find(p => p.id === linea.productoId), indice);
    const quitar = document.createElement('button'); quitar.textContent = 'Quitar';
    quitar.onclick = () => { cuenta().lineas.splice(indice, 1); dibujarTicket(); };
    fila.lastElementChild.append(editar, quitar);
    elemento('filas').append(fila);
  });
  elemento('vacio').hidden = cuenta().lineas.length > 0;
  elemento('total').textContent = dinero(totalCuenta());
  elemento('pagar').disabled = cuenta().lineas.length === 0;
  elemento('vaciar').disabled = cuenta().lineas.length === 0;
  dibujarCuentas();
}
elemento('vaciar').onclick = () => { if (confirm('¿Vaciar los productos de esta cuenta?')) { cuenta().lineas = []; dibujarTicket(); } };

// 5. Cobro simulado. No hay conexión a bancos ni base de datos.
function resumenLineas(lineas) {
  return lineas.map(l => `<div class="linea"><span>${escapar(l.nombre)}<small>${cantidadTexto(l)} × ${dinero(l.precioCentavos)}</small></span><strong>${dinero(importeLinea(l))}</strong></div>`).join('');
}
elemento('pagar').onclick = () => {
  elemento('form-cobro').reset();
  elemento('resumen').innerHTML = resumenLineas(cuenta().lineas);
  elemento('total-cobro').textContent = dinero(totalCuenta());
  actualizarCobro(); elemento('cobro').showModal();
};
function actualizarCobro() {
  const efectivo = elemento('metodo').value === 'Efectivo';
  elemento('efectivo').hidden = !efectivo;
  elemento('recibido').required = efectivo;
  elemento('recibido').disabled = !efectivo;
  const recibido = Math.round(Number(elemento('recibido').value) * 100);
  const suficiente = elemento('recibido').value !== '' && elemento('recibido').checkValidity() && recibido >= totalCuenta();
  elemento('cambio').textContent = suficiente ? `Cambio: ${dinero(recibido - totalCuenta())}` : 'Ingresa un importe suficiente para cubrir el total.';
  elemento('confirmar').disabled = !elemento('metodo').value || (efectivo && !suficiente);
}
elemento('metodo').onchange = actualizarCobro;
elemento('recibido').oninput = actualizarCobro;
elemento('form-cobro').onsubmit = evento => {
  evento.preventDefault(); actualizarCobro();
  if (elemento('confirmar').disabled || !evento.target.reportValidity() || !cuenta().lineas.length) return;
  const total = totalCuenta();
  const metodo = elemento('metodo').value;
  const recibido = metodo === 'Efectivo' ? Math.round(Number(elemento('recibido').value) * 100) : total;
  // Futuro: enviar las líneas y el pago a la API y esperar su confirmación.
  const recibo = `<div class="recibo"><h3>FRUTERÍA VICTORIA</h3><p>STOCKLY · Ticket de demostración</p><p>Folio de sesión: DEMO-${String(siguienteTicket++).padStart(4, '0')}<br>Fecha: ${new Date().toLocaleString('es-MX')}<br>Cuenta: ${cuentaActiva}</p>${resumenLineas(cuenta().lineas)}<div class="linea"><b>TOTAL</b><b>${dinero(total)}</b></div><p>Método: ${escapar(metodo)}</p>${metodo === 'Efectivo' ? `<p>Recibido: ${dinero(recibido)}<br>Cambio: ${dinero(recibido - total)}</p>` : ''}<p>Gracias por su compra.</p><small>Prototipo sin registro permanente.</small></div>`;
  elemento('comprobante').innerHTML = recibo;
  elemento('ticket-impreso').innerHTML = recibo;
  cuenta().lineas = [];
  elemento('cobro').close(); dibujarTicket(); elemento('resultado').showModal();
};
elemento('imprimir').onclick = () => window.print();
document.querySelectorAll('[data-cerrar]').forEach(boton => { boton.onclick = () => elemento(boton.dataset.cerrar).close(); });
window.addEventListener('beforeunload', evento => { if (cuentas.some(c => c.lineas.length)) { evento.preventDefault(); evento.returnValue = ''; } });
dibujarCategorias(); dibujarProductos(); dibujarTicket();

// 6. Separador: reparte el espacio disponible sin desplazar toda la página.
const separador = elemento('separador');
let proporcionTicket = 45;
function ajustarPaneles(valor) {
  proporcionTicket = Math.max(20, Math.min(75, valor));
  elemento('sistema').style.setProperty('--ticket-fr', proporcionTicket + 'fr');
  elemento('sistema').style.setProperty('--catalogo-fr', (100 - proporcionTicket) + 'fr');
  separador.setAttribute('aria-valuenow', Math.round(proporcionTicket));
}
let arrastre = null;
separador.addEventListener('pointerdown', evento => {
  if (evento.button !== 0) return;
  const ticket = document.querySelector('.ticket');
  const catalogo = document.querySelector('.catalogo');
  arrastre = { y: evento.clientY, porcentaje: proporcionTicket, alto: ticket.clientHeight + catalogo.clientHeight };
  separador.setPointerCapture(evento.pointerId);
  evento.preventDefault();
});
separador.addEventListener('pointermove', evento => {
  if (arrastre) ajustarPaneles(arrastre.porcentaje + (evento.clientY - arrastre.y) / arrastre.alto * 100);
});
separador.addEventListener('pointerup', () => { arrastre = null; });
separador.addEventListener('pointercancel', () => { arrastre = null; });
separador.addEventListener('lostpointercapture', () => { arrastre = null; });
separador.addEventListener('keydown', evento => {
  if (evento.key === 'ArrowUp' || evento.key === 'ArrowDown') {
    evento.preventDefault();
    ajustarPaneles(proporcionTicket + (evento.key === 'ArrowUp' ? -5 : 5));
  }
});

// 7. Alta de productos para probar el catálogo sin una base de datos.
categorias.forEach(nombre => {
  const opcion = document.createElement('option');
  opcion.textContent = nombre;
  elemento('alta-categoria').append(opcion);
});
elemento('nuevo-producto').onclick = () => {
  elemento('form-alta').reset();
  elemento('alta-categoria').value = categoria;
  elemento('error-alta').textContent = '';
  elemento('alta-producto').showModal();
};
elemento('form-alta').onsubmit = evento => {
  evento.preventDefault();
  if (!evento.target.reportValidity()) return;
  const nombre = elemento('alta-nombre').value.trim();
  const grupo = elemento('alta-categoria').value;
  const unidad = elemento('alta-unidad').value;
  const ruta = elemento('alta-imagen').value.trim();
  if (!nombre) { elemento('error-alta').textContent = 'Escribe un nombre.'; return; }
  if (ruta && !/^imagenes\/[a-zA-Z0-9_\-/.]+\.(png|jpe?g|webp|gif)$/i.test(ruta)) {
    elemento('error-alta').textContent = 'Usa una ruta como imagenes/manzana.png, sin espacios ni acentos.'; return;
  }
  if (productos.some(p => normalizar(p.nombre) === normalizar(nombre) && p.categoria === grupo && p.unidad === unidad)) {
    elemento('error-alta').textContent = 'Ese producto y unidad ya existen en esta categoría.'; return;
  }
  productos.push({id: Math.max(...productos.map(p => p.id)) + 1, nombre, categoria: grupo,
    precio: Number(elemento('alta-precio').value), unidad, imagen: ruta});
  categoria = grupo;
  elemento('buscar').value = '';
  elemento('alta-producto').close();
  dibujarCategorias(); dibujarProductos();
};
// Atajo de escritorio: F2 lleva al buscador cuando no hay una ventana abierta.
document.addEventListener('keydown', evento => {
  if (evento.key === 'F2' && !elemento('sistema').hidden && !document.querySelector('dialog[open]')) {
    evento.preventDefault(); elemento('buscar').focus();
  }
});
