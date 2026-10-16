# ARG420 PWA — versión inicial gratuita

Este proyecto es un prototipo web instalable con catálogo de ejemplo, filtros, carrito y pedido preparado para WhatsApp.

## Antes de compartirlo con clientes
1. Abrí `app.js`.
2. Cambiá `WHATSAPP_NUMBER` por el número real de ARG420 en formato internacional, solo dígitos. Ejemplo de formato argentino: `54911XXXXXXXX` (reemplazá las X; no incluyas `+`, espacios ni guiones).
3. Editá el arreglo `PRODUCTS`: nombres, categorías, precios, emojis y descripciones.
4. Reemplazá los productos de ejemplo y verificá que cada artículo esté autorizado para comercialización.
5. Probá el carrito y el mensaje de WhatsApp con tu propio teléfono antes de publicarlo.

## Publicar gratis en GitHub Pages
1. Creá o iniciá sesión en https://github.com/
2. Creá un repositorio nuevo, por ejemplo `arg420-app`. Para la primera prueba, podés hacerlo público.
3. Subí al repositorio TODOS los archivos y carpetas de este ZIP. `index.html` debe quedar en la raíz, no dentro de otra carpeta.
4. En el repositorio, abrí **Settings → Pages**.
5. En **Build and deployment**, elegí **Deploy from a branch**.
6. Elegí la rama `main` y la carpeta `/(root)`, y presioná **Save**.
7. Esperá a que GitHub genere el enlace de GitHub Pages. Abrilo desde el celular para probarlo.

## Instalar en Android
Cuando esté publicado por HTTPS, abrí el enlace en Chrome. Usá el menú ⋮ y elegí **Instalar aplicación** o **Agregar a pantalla de inicio**. La opción exacta puede variar según el dispositivo y el navegador.

## Qué hace y qué NO hace esta versión
- Sí: muestra productos de ejemplo, filtra, calcula el carrito en el navegador y prepara el mensaje de WhatsApp.
- No: procesa pagos, registra usuarios, guarda pedidos en una base de datos, administra inventario real ni tiene un panel privado.
- El carrito vive en memoria; si recargás la página, puede perderse.
- GitHub Pages aloja archivos estáticos. Para usuarios, administración segura, pedidos persistentes o stock sincronizado haría falta un backend aparte.
- El pedido no queda confirmado hasta que ARG420 responda por WhatsApp.
- El proyecto no garantiza por sí solo que todos los productos sean legales en cada situación; verificá normativa y condiciones aplicables.

## Archivos
- `index.html`: estructura de la app.
- `styles.css`: diseño responsive negro y verde urbano.
- `app.js`: productos de ejemplo, filtros, carrito y WhatsApp.
- `manifest.webmanifest`: configuración de la PWA.
- `sw.js`: caché básica para mejorar la carga y permitir recursos previamente visitados sin conexión.
- `icons/`: iconos de la aplicación.
