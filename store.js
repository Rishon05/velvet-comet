/* =========================================================================
   Velvet Comet store engine - cart, drawer, grid + product rendering
   Requires products.js loaded first.
   ========================================================================= */

/* -------------------------------------------------------------------------
   CHECKOUT CONFIG
   Two ways to take money, both documented in README:

   A) PER-PRODUCT (simplest, no backend): set each product's `stripe` field in
      products.js to a Stripe Payment Link. "Buy now" on a product page sends
      the customer straight there. (Single product per checkout.)

   B) MULTI-ITEM CART (needs a tiny serverless function): set CHECKOUT_ENDPOINT
      to your deployed Stripe Checkout function (see checkout-worker.js).
      The cart POSTs its items and redirects to a combined Stripe checkout.
   ------------------------------------------------------------------------- */
const CHECKOUT_ENDPOINT = ""; // e.g. "https://your-worker.workers.dev/checkout"

/* ---------- cart state ---------- */
const CART_KEY = "nova_cart";
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

function addToCart(id) {
  const line = cart.find(l => l.id === id);
  if (line) line.qty++; else cart.push({ id, qty: 1 });
  saveCart(); renderCart();
  const p = getProduct(id);
  toast(`${p ? p.name : "Item"} added to cart`);
  openCart();
}
function changeQty(id, delta) {
  const line = cart.find(l => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(l => l.id !== id);
  saveCart(); renderCart();
}
function removeItem(id) { cart = cart.filter(l => l.id !== id); saveCart(); renderCart(); }
function cartCount() { return cart.reduce((s, l) => s + l.qty, 0); }
function cartTotal() { return cart.reduce((s, l) => { const p = getProduct(l.id); return s + (p ? p.price * l.qty : 0); }, 0); }

/* ---------- checkout ---------- */
async function checkout() {
  if (!cart.length) return;
  if (CHECKOUT_ENDPOINT && CHECKOUT_ENDPOINT.startsWith("http")) {
    try {
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      throw new Error("no url");
    } catch (e) {
      alert("Checkout failed. Check your CHECKOUT_ENDPOINT / Stripe function.");
      return;
    }
  }
  // fallback: single item with its own payment link
  if (cart.length === 1) {
    const p = getProduct(cart[0].id);
    if (p && p.stripe && p.stripe.startsWith("http")) { window.location.href = p.stripe; return; }
  }
  alert("Checkout isn't connected yet.\n\nEither:\n• add a Stripe Payment Link per product (products.js → stripe), or\n• set CHECKOUT_ENDPOINT in store.js for multi-item cart checkout.\n\nSee README.md.");
}

/* ---------- drawer + toast DOM (injected once) ---------- */
function injectChrome() {
  if (document.getElementById("novaDrawer")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="overlay" id="novaOverlay"></div>
    <aside class="cart-drawer" id="novaDrawer" aria-label="Cart">
      <div class="cart-head"><h3>Your cart</h3><button class="cart-close" id="novaClose">×</button></div>
      <div class="cart-items" id="novaItems"></div>
      <div class="cart-foot" id="novaFoot"></div>
    </aside>
    <div class="toast" id="novaToast"></div>`;
  document.body.appendChild(wrap);
  document.getElementById("novaOverlay").addEventListener("click", closeCart);
  document.getElementById("novaClose").addEventListener("click", closeCart);
}
function openCart() { document.getElementById("novaDrawer").classList.add("open"); document.getElementById("novaOverlay").classList.add("open"); }
function closeCart() { document.getElementById("novaDrawer").classList.remove("open"); document.getElementById("novaOverlay").classList.remove("open"); }

let toastTimer;
function toast(msg) {
  const t = document.getElementById("novaToast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- render cart ---------- */
function renderCart() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    const n = cartCount(); el.textContent = n; el.style.display = n ? "grid" : "none";
  });
  const items = document.getElementById("novaItems");
  const foot = document.getElementById("novaFoot");
  if (!items) return;
  if (!cart.length) {
    items.innerHTML = `<div class="cart-empty">Your cart is empty.<br><br><a href="index.html" class="btn btn-ghost">Browse products</a></div>`;
    foot.innerHTML = ""; return;
  }
  items.innerHTML = cart.map(l => {
    const p = getProduct(l.id); if (!p) return "";
    const img = p.image ? `<img src="${p.image}" alt="">` : p.emoji;
    return `<div class="cart-item">
      <div class="ci-media">${img}</div>
      <div>
        <div class="ci-name">${p.name}</div>
        <div class="ci-price">${gbp(p.price)}</div>
        <div class="ci-qty">
          <button onclick="changeQty('${p.id}',-1)">−</button>
          <span>${l.qty}</span>
          <button onclick="changeQty('${p.id}',1)">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="removeItem('${p.id}')">Remove</button>
    </div>`;
  }).join("");
  foot.innerHTML = `
    <div class="cart-total"><span>Total</span><span>${gbp(cartTotal())}</span></div>
    <button class="btn btn-primary btn-block btn-lg" onclick="checkout()">Checkout</button>
    <p class="cart-note">Secure checkout · taxes & shipping shown at payment</p>`;
}

/* ---------- homepage grid + filters ---------- */
const FEATURED = ["laser-keyboard", "recorder-pen", "fingerprint-padlock"];
function catalogOrder(arr) {
  return [...arr].sort((a, b) => {
    const ia = FEATURED.indexOf(a.id), ib = FEATURED.indexOf(b.id);
    const ra = ia === -1 ? FEATURED.length + PRODUCTS.indexOf(a) : ia;
    const rb = ib === -1 ? FEATURED.length + PRODUCTS.indexOf(b) : ib;
    return ra - rb;
  });
}
function renderGrid(filter = "All") {
  const grid = document.getElementById("grid"); if (!grid) return;
  const list = catalogOrder(filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter));
  grid.innerHTML = list.map(p => {
    const media = p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="pc-emoji">${p.emoji}</span>`;
    const badge = p.badge ? `<span class="pc-badge">${p.badge}</span>` : "";
    return `<div class="product-card">
      <a href="product.html?id=${p.id}" class="pc-media">${media}${badge}</a>
      <div class="pc-body">
        <div class="pc-cat">${p.category}</div>
        <a href="product.html?id=${p.id}" class="pc-name">${p.name}</a>
        <div class="pc-tag">${p.tagline}</div>
        <div class="pc-foot">
          <span class="pc-price">${gbp(p.price)}</span>
          <div class="pc-actions">
            <a href="product.html?id=${p.id}" class="pc-view">View</a>
            <button class="btn btn-primary pc-add" onclick="addToCart('${p.id}')">Add</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
}
function renderFilters() {
  const bar = document.getElementById("filters"); if (!bar) return;
  bar.innerHTML = CATEGORIES.map((c, i) =>
    `<button class="filter-chip ${i === 0 ? "active" : ""}" data-filter="${c}">${c}</button>`).join("");
  bar.querySelectorAll(".filter-chip").forEach(chip => chip.addEventListener("click", () => {
    bar.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    renderGrid(chip.dataset.filter);
  }));
}

/* ---------- product detail page ---------- */
function renderProduct() {
  const mount = document.getElementById("pdp"); if (!mount) return;
  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id);
  if (!p) { mount.innerHTML = `<p class="lead">Product not found. <a href="index.html" style="color:var(--accent-2)">Back to store</a>.</p>`; return; }
  document.title = `${p.name} | Velvet Comet`;
  const media = p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="pc-emoji">${p.emoji}</span>`;
  const tick = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>`;
  mount.innerHTML = `
    <div class="pdp-media">${media}</div>
    <div class="pdp-info">
      <a href="index.html" class="back-link">← All products</a>
      <div class="pc-cat">${p.category}</div>
      <h1>${p.name}</h1>
      <div class="pdp-tag">${p.tagline}</div>
      <p class="pdp-hook">${p.hook}</p>
      <div class="pdp-price">${gbp(p.price)}</div>
      <div class="pdp-pricenote">incl. VAT · free UK delivery</div>
      <div class="pdp-cta">
        <button class="btn btn-primary btn-lg" onclick="addToCart('${p.id}')">Add to cart</button>
        <button class="btn btn-ghost btn-lg" onclick="addToCart('${p.id}');checkout()">Buy now</button>
      </div>
      <div class="pdp-trust">
        <span>${tick} 30-day returns</span>
        <span>${tick} 12-month warranty</span>
        <span>${tick} Secure checkout</span>
      </div>
    </div>`;

  // features + specs below
  const extra = document.getElementById("pdpExtra");
  if (extra) {
    extra.innerHTML = `
      <div class="container">
        <p class="eyebrow">Features</p><h2>Why you'll love it</h2>
        <div class="pdp-features">
          ${p.features.map(f => `<div class="pdp-feature"><h3>${f.title}</h3><p>${f.desc}</p></div>`).join("")}
        </div>
        <p class="eyebrow" style="margin-top:48px;">The details</p><h2>Specifications</h2>
        <dl class="spec-wrap">
          ${p.specs.map(s => `<div class="spec-row"><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`).join("")}
        </dl>
        <p class="cart-note" style="text-align:left;margin-top:14px;">Confirm every spec against your supplier sheet before publishing.</p>
      </div>`;
  }
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  injectChrome();
  renderFilters();
  renderGrid();
  renderProduct();
  renderCart();
  document.querySelectorAll("[data-open-cart]").forEach(b => b.addEventListener("click", openCart));
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));
});
