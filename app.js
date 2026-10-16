/*
 * ARG420 PWA — prototipo gratuito.
 * Editá PRODUCTS y WHATSAPP_NUMBER para personalizarlo.
 * Esta versión no guarda pedidos en un servidor ni procesa pagos.
 */
const WHATSAPP_NUMBER = "54911XXXXXXXX"; // Reemplazá por tu número: código país + área + número, solo dígitos.

const PRODUCTS = [
  { id: 1, name: "Fertilizante base", category: "Fertilizantes", price: 8500, emoji: "🧪", description: "Producto de ejemplo. Editá nombre, precio y descripción." },
  { id: 2, name: "Sustrato para cultivo", category: "Sustratos y macetas", price: 6500, emoji: "🌱", description: "Producto de ejemplo. Confirmá disponibilidad antes de vender." },
  { id: 3, name: "Maceta geotextil", category: "Sustratos y macetas", price: 2500, emoji: "🪴", description: "Producto de ejemplo para probar el catálogo." },
  { id: 4, name: "Herramienta de cultivo", category: "Herramientas y accesorios", price: 4200, emoji: "🛠️", description: "Producto de ejemplo. Reemplazalo por un artículo real." },
  { id: 5, name: "Semillas autorizadas", category: "Semillas autorizadas", price: 5000, emoji: "🌿", description: "Ejemplo ilustrativo; publicar solo artículos cuya comercialización esté permitida." },
  { id: 6, name: "Combo de temporada", category: "Combos y promociones", price: 15000, emoji: "⚡", description: "Promoción ficticia para probar la aplicación." },
  { id: 7, name: "Accesorios varios", category: "Herramientas y accesorios", price: 3500, emoji: "🔧", description: "Producto de ejemplo para editar." },
  { id: 8, name: "Nutrientes para plantas", category: "Fertilizantes", price: 9200, emoji: "💧", description: "Producto de ejemplo. Comprobá etiqueta y uso autorizado." }
];

const state = { category: "Todos", search: "", cart: new Map() };
const money = value => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
const $ = selector => document.querySelector(selector);

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
}
function renderFilters() {
  $("#categoryFilters").innerHTML = categories().map(category =>
    `<button type="button" class="filter-btn ${state.category === category ? "active" : ""}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`
  ).join("");
}
function renderProducts() {
  const query = state.search.toLocaleLowerCase("es-AR");
  const visible = PRODUCTS.filter(p => (state.category === "Todos" || p.category === state.category) &&
    `${p.name} ${p.category} ${p.description}`.toLocaleLowerCase("es-AR").includes(query));
  $("#productGrid").innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-art" aria-hidden="true">${p.emoji}</div>
      <div class="product-body">
        <span class="product-category">${escapeHTML(p.category)}</span>
        <h3>${escapeHTML(p.name)}</h3>
        <p class="product-desc">${escapeHTML(p.description)}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" type="button" data-add="${p.id}" aria-label="Agregar ${escapeHTML(p.name)} al pedido">+</button></div>
      </div>
    </article>`).join("");
  $("#emptyMessage").classList.toggle("hidden", visible.length > 0);
}
function renderCart() {
  const entries = [...state.cart.entries()];
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + (PRODUCTS.find(p => p.id === id)?.price || 0) * qty, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#checkoutBtn").disabled = count === 0;
  $("#checkoutHint").textContent = count ? "Se abrirá WhatsApp con el detalle para revisar y enviar." : "Agregá un producto para preparar tu pedido.";
  $("#cartItems").innerHTML = entries.length ? entries.map(([id, qty]) => {
    const p = PRODUCTS.find(item => item.id === id);
    return `<div class="cart-row"><div><div class="cart-row-title">${escapeHTML(p.name)}</div><div class="cart-row-sub">${money(p.price)} c/u · Subtotal ${money(p.price * qty)}</div></div><div class="quantity-controls"><button type="button" data-dec="${id}" aria-label="Quitar uno">−</button><strong>${qty}</strong><button type="button" data-inc="${id}" aria-label="Agregar uno">+</button></div></div>`;
  }).join("") : '<p class="muted">Todavía no agregaste productos.</p>';
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  window.setTimeout(() => el.classList.remove("show"), 1800);
}
function add(id) {
  state.cart.set(id, (state.cart.get(id) || 0) + 1); renderCart(); toast("Agregado al pedido");
}
$("#categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]"); if (!button) return;
  state.category = button.dataset.category; renderFilters(); renderProducts();
});
$("#productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]"); if (button) add(Number(button.dataset.add));
});
$("#cartItems").addEventListener("click", event => {
  const inc = event.target.closest("[data-inc]"); const dec = event.target.closest("[data-dec]");
  if (inc) { const id = Number(inc.dataset.inc); add(id); }
  if (dec) { const id = Number(dec.dataset.dec); const qty = (state.cart.get(id) || 0) - 1; if (qty <= 0) state.cart.delete(id); else state.cart.set(id, qty); renderCart(); }
});
$("#searchInput").addEventListener("input", event => { state.search = event.target.value; renderProducts(); });
$("#clearCartBtn").addEventListener("click", () => { state.cart.clear(); renderCart(); });
$("#checkoutBtn").addEventListener("click", () => {
  if (state.cart.size === 0) return;
  if (WHATSAPP_NUMBER.includes("X")) { toast("Primero configurá tu número en app.js"); return; }
  const lines = [...state.cart.entries()].map(([id, qty]) => {
    const p = PRODUCTS.find(item => item.id === id); return `• ${p.name} x${qty}: ${money(p.price * qty)}`;
  });
  const total = [...state.cart.entries()].reduce((sum, [id, qty]) => sum + PRODUCTS.find(p => p.id === id).price * qty, 0);
  const message = `¡Hola, ARG420! Quiero consultar por este pedido:\n\n${lines.join("\n")}\n\nTotal estimado: ${money(total)}\n\n¿Me confirman disponibilidad, precio final y envío?`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
const communityLink = $("#communityWhatsApp");
communityLink.href = "#pedido";
communityLink.addEventListener("click", event => {
  if (WHATSAPP_NUMBER.includes("X")) { event.preventDefault(); toast("Configurá tu número de WhatsApp en app.js"); }
  else { event.preventDefault(); window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola, ARG420! Quiero consultar.")}`, "_blank", "noopener,noreferrer"); }
});

let installPrompt;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault(); installPrompt = event; $("#installBtn").classList.remove("hidden");
});
$("#installBtn").addEventListener("click", async () => {
  if (!installPrompt) { toast("Usá el menú del navegador: Agregar a pantalla de inicio"); return; }
  installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; $("#installBtn").classList.add("hidden");
});
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(err => console.info("Service worker no disponible en esta vista", err)));
}
renderFilters(); renderProducts(); renderCart();
