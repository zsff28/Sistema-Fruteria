const categorias = ['Frutas', 'Verduras', 'Hierbas', 'Fruta fina', 'Congelados', 'Semillas', 'Desechable'];

// Catálogo de ejemplo. Más adelante estos datos se pedirán a la API.
// Pon tus imágenes en imagenes/ y ajusta aquí el nombre y la extensión.
const productos = [
  { id: 1, nombre: 'Manzana', categoria: 'Frutas', precio: 35, unidad: 'kg', imagen: 'imagenes/manzana.png' },
  { id: 2, nombre: 'Plátano', categoria: 'Frutas', precio: 28, unidad: 'kg', imagen: 'imagenes/platano.png' },
  { id: 3, nombre: 'Mango', categoria: 'Frutas', precio: 45, unidad: 'kg', imagen: 'imagenes/mango.png' },
  { id: 4, nombre: 'Papaya', categoria: 'Frutas', precio: 22, unidad: 'kg', imagen: 'imagenes/papaya.png' },
  { id: 5, nombre: 'Naranja', categoria: 'Frutas', precio: 18, unidad: 'kg', imagen: 'imagenes/naranja.png' },
  { id: 6, nombre: 'Sandía', categoria: 'Frutas', precio: 12, unidad: 'kg', imagen: 'imagenes/sandia.png' },
  { id: 7, nombre: 'Limón', categoria: 'Frutas', precio: 25, unidad: 'kg', imagen: 'imagenes/limon.png' },
  { id: 8, nombre: 'Uva', categoria: 'Fruta fina', precio: 55, unidad: 'kg', imagen: 'imagenes/uva.png' },
  { id: 9, nombre: 'Fresa', categoria: 'Fruta fina', precio: 65, unidad: 'kg', imagen: 'imagenes/fresa.png' },
  { id: 10, nombre: 'Melón', categoria: 'Frutas', precio: 15, unidad: 'kg', imagen: 'imagenes/melon.png' },
  { id: 11, nombre: 'Piña', categoria: 'Frutas', precio: 32, unidad: 'kg', imagen: 'imagenes/pina.png' },
  { id: 12, nombre: 'Coco', categoria: 'Frutas', precio: 25, unidad: 'pza', imagen: 'imagenes/coco.png' },
  { id: 13, nombre: 'Jitomate', categoria: 'Verduras', precio: 24, unidad: 'kg', imagen: 'imagenes/jitomate.png' },
  { id: 14, nombre: 'Cebolla', categoria: 'Verduras', precio: 20, unidad: 'kg', imagen: 'imagenes/cebolla.png' },
  { id: 15, nombre: 'Arroz', categoria: 'Semillas', precio: 30, unidad: 'kg', imagen: 'imagenes/arroz.png' } ,
  { id: 16, nombre: 'Cilantro', categoria: 'Hierbas', precio: 8, unidad: 'pza', imagen: 'imagenes/cilantro.png' },
  { id: 17, nombre: 'Perejil', categoria: 'Hierbas', precio: 8, unidad: 'pza', imagen: 'imagenes/perejil.png' },
  { id: 18, nombre: 'Zarzamora', categoria: 'Fruta fina', precio: 90, unidad: 'kg', imagen: 'imagenes/zarzamora.png' },
  { id: 19, nombre: 'Fresa congelada', categoria: 'Congelados', precio: 55, unidad: 'kg', imagen: 'imagenes/fresa-congelada.png' },
  { id: 20, nombre: 'Mango congelado', categoria: 'Congelados', precio: 60, unidad: 'kg', imagen: 'imagenes/mango-congelado.png' },
  { id: 21, nombre: 'Frijol', categoria: 'Semillas', precio: 38, unidad: 'kg', imagen: 'imagenes/frijol.png' },
  { id: 22, nombre: 'Lenteja', categoria: 'Semillas', precio: 35, unidad: 'kg', imagen: 'imagenes/lenteja.png' },
  { id: 23, nombre: 'Vaso desechable', categoria: 'Desechable', precio: 25, unidad: 'paq', imagen: 'imagenes/vaso.png' },
  { id: 24, nombre: 'Plato desechable', categoria: 'Desechable', precio: 30, unidad: 'paq', imagen: 'imagenes/plato.png' }
];
