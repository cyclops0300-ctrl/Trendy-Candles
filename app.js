// Premium Shop — Vanilla JS storefront
const BRAND_NAME = "Trendy Candles";

const products = [
  {
    id: "p1",
    title: "Dark fragrance candle",
    category: "home",
    price: 450,
    compareAt: 220,
    rating: 0.0,
    reviews: 0,
    image: "https://images.unsplash.com/photo-1520974735194-85d85ba42c5f?q=80&w=1400&auto=format&fit=crop",
    new: true
  },
  {
    id: "p2",
    title: "Sculpted Candle — Noi",
    category: "home",
    price: 400,
    compareAt: 0,
    rating: 4.6,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1607863680176-9b68e8eb49b4?q=80&w=1400&auto=format&fit=crop",
    new: false
  },
  {
    id: "p3",
    title: "Wireless Over‑Ear Headphones",
    category: "tech",
    price: 260,
    compareAt: 299,
    rating: 4.7,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1518443895914-6f6b5b4f0b18?q=80&w=1400&auto=format&fit=crop",
    new: true
  },
  {
    id: "p4",
    title: "Serum — Vitamin C 15%",
    category: "beauty",
    price: 56,
    compareAt: 72,
    rating: 4.5,
    reviews: 302,
    image: "https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=1400&auto=format&fit=crop",
    new: false
  },
  {
    id: "p5",
    title: "Stoneware Mug Set (2)",
    category: "home",
    price: 42,
    compareAt: 0,
    rating: 4.4,
    reviews: 65,
    image: "https://images.unsplash.com/photo-1486621315404-1d41e3e717b0?q=80&w=1400&auto=format&fit=crop",
    new: false
  },
  {
    id: "p6",
    title: "Minimal Leather Wallet",
    category: "apparel",
    price: 95,
    compareAt: 0,
    rating: 4.3,
    reviews: 194,
    image: "https://images.unsplash.com/photo-1584917865442-fd7e506cdcf0?q=80&w=1400&auto=format&fit=crop",
    new: false
  },
  {
    id: "p7",
    title: "Aroma Diffuser",
    category: "home",
    price: 70,
    compareAt: 0,
    rating: 4.1,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop",
    new: true
  },
  {
    id: "p8",
    title: "MagSafe Charging Dock",
    category: "tech",
    price: 58,
    compareAt: 0,
    rating: 4.2,
    reviews: 211,
    image: "https://images.unsplash.com/photo-1610945415295-6e4b9f4c83f6?q=80&w=1400&auto=format&fit=crop",
    new: false
  }
];

// State
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
let filterState = {
  q: "",
  category: "all",
  sort: "featured",
  maxPrice: 1000
};

// Elements
const grid = document.querySelector(".products");
const cartDrawer = document.getElementById("cartDrawer");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCount = document.getElementById("cartCount");
const wishCount = document.getElementById("wishCount");
const quickView = document.getElementById("quickView");
const qvTitle = document.getElementById("qvTitle");
const qvBody = document.getElementById("qvBody");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const sort = document.getElementById("sort");
const category = document.getElementById("category");
const price = document.getElementById("price");
const priceOut = document.getElementById("priceOut");
const resetFilters = document.getElementById("resetFilters");

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const menuBtn = document.querySelector(".header__menu-btn");
const mobileNav = document.getElementById("mobileNav");
menuBtn.addEventListener("click", () => {
  const expanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  mobileNav.hidden = expanded;
});

// Helpers
const fmt = n => `$${n.toFixed(2)}`;
const save = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateBadges();
};
const updateBadges = () => {
  cartCount.textContent = cart.reduce((a,i)=>a+i.qty,0);
  wishCount.textContent = wishlist.length;
};

// Render product grid
function render(){
  const { q, category: cat, sort: s, maxPrice } = filterState;
  let items = products
    .filter(p => (cat === "all" || p.category === cat))
    .filter(p => p.price <= maxPrice)
    .filter(p => p.title.toLowerCase().includes(q.toLowerCase()));
  switch(s){
    case "price-asc": items.sort((a,b)=>a.price-b.price); break;
    case "price-desc": items.sort((a,b)=>b.price-a.price); break;
    case "rating-desc": items.sort((a,b)=>b.rating-a.rating); break;
    case "newest": items.sort((a,b)=>(b.new?1:0)-(a.new?1:0)); break;
    default: /* featured */ items.sort((a,b)=> (b.new?1:0) + b.rating - ((a.new?1:0)+a.rating));
  }
  grid.innerHTML = "";
  if(!items.length){
    grid.innerHTML = '<div class="empty">No products found. Try adjusting filters.</div>';
    return;
  }
  items.forEach(p => {
    const inWish = wishlist.includes(p.id);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card__media" role="img" aria-label="${p.title}">
        ${p.new ? '<span class="card__badge">NEW</span>' : ''}
        <img src="${p.image}" alt="">
      </div>
      <div class="card__body">
        <h3 class="card__title">${p.title}</h3>
        <div class="card__price">
          <span class="price">${fmt(p.price)}</span>
          ${p.compareAt ? `<span class="strike">${fmt(p.compareAt)}</span>`: ""}
        </div>
        <div class="rating">★ ${p.rating.toFixed(1)} · ${p.reviews}</div>
        <div class="card__actions">
          <button class="btn btn--primary" data-add="${p.id}">Add to cart</button>
          <button class="btn btn--ghost" data-qv="${p.id}">Quick view</button>
          <button class="icon-btn" aria-pressed="${inWish}" title="Wishlist" data-wish="${p.id}">♡</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Event delegation for product actions
grid.addEventListener("click", (e) => {
  const addId = e.target.getAttribute("data-add");
  const qvId = e.target.getAttribute("data-qv");
  const wishId = e.target.getAttribute("data-wish");
  if(addId){
    addToCart(addId);
  }else if(qvId){
    openQuickView(qvId);
  }else if(wishId){
    toggleWishlist(wishId, e.target);
  }
});

function toggleWishlist(id, btn){
  const i = wishlist.indexOf(id);
  if(i>-1){ wishlist.splice(i,1); } else { wishlist.push(id); }
  if(btn){ btn.setAttribute("aria-pressed", String(i===-1)); }
  save();
}

function addToCart(id, qty=1){
  const p = products.find(x => x.id===id);
  if(!p) return;
  const line = cart.find(x => x.id===id);
  if(line) line.qty += qty;
  else cart.push({ id, qty, price: p.price, title: p.title, image: p.image });
  save();
  openCart();
}

function openCart(){
  renderCart();
  cartDrawer.showModal();
}
function closeCart(){ cartDrawer.close(); }

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartDrawer.querySelector(".drawer__backdrop").addEventListener("click", closeCart);

function renderCart(){
  if(!cart.length){
    cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
    cartSubtotal.textContent = fmt(0);
    return;
  }
  cartItems.innerHTML = "";
  let subtotal = 0;
  cart.forEach(line => {
    subtotal += line.price * line.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${line.image}" alt="">
      <div>
        <div style="font-weight:600">${line.title}</div>
        <div class="price">${fmt(line.price)}</div>
        <div class="qty">
          <button aria-label="Decrease" data-dec="${line.id}">−</button>
          <input type="number" min="1" value="${line.qty}" data-qty="${line.id}" aria-label="Quantity">
          <button aria-label="Increase" data-inc="${line.id}">+</button>
        </div>
      </div>
      <button class="icon-btn" aria-label="Remove" data-remove="${line.id}">✕</button>
    `;
    cartItems.appendChild(row);
  });
  cartSubtotal.textContent = fmt(subtotal);
}

cartItems.addEventListener("click", (e)=>{
  const id = e.target.getAttribute("data-inc") || e.target.getAttribute("data-dec") || e.target.getAttribute("data-remove");
  if(!id) return;
  const line = cart.find(l=>l.id===id);
  if(!line) return;
  if(e.target.hasAttribute("data-inc")) line.qty++;
  if(e.target.hasAttribute("data-dec")) line.qty = Math.max(1, line.qty-1);
  if(e.target.hasAttribute("data-remove")) cart = cart.filter(l=>l.id!==id);
  save();
  renderCart();
});
cartItems.addEventListener("change", (e)=>{
  const id = e.target.getAttribute("data-qty");
  if(!id) return;
  const line = cart.find(l=>l.id===id);
  if(!line) return;
  line.qty = Math.max(1, parseInt(e.target.value||"1",10));
  save();
  renderCart();
});

// Quick view
function openQuickView(id){
  const p = products.find(x => x.id===id);
  if(!p) return;
  qvTitle.textContent = p.title;
  qvBody.innerHTML = `
    <img src="${p.image}" alt="${p.title}">
    <div>
      <div class="price">${fmt(p.price)} ${p.compareAt? `<span class="strike">${fmt(p.compareAt)}</span>`:""}</div>
      <p>Category: <strong>${p.category}</strong></p>
      <p>Rating: <strong>${p.rating.toFixed(1)}</strong> (${p.reviews} reviews)</p>
      <p>Meticulously crafted using premium materials. Designed for daily use with elevated details.</p>
      <div class="card__actions">
        <button class="btn btn--primary" id="qvAdd">Add to cart</button>
        <button class="btn btn--ghost" id="qvWish">${wishlist.includes(p.id) ? "Remove from" : "Add to"} wishlist</button>
      </div>
    </div>
  `;
  quickView.showModal();
  document.getElementById("qvAdd").onclick = ()=> addToCart(p.id);
  document.getElementById("qvWish").onclick = ()=> toggleWishlist(p.id);
}
document.getElementById("closeQV").addEventListener("click", ()=> quickView.close());
quickView.querySelector(".modal__backdrop").addEventListener("click", ()=> quickView.close());

// Filters
searchInput.addEventListener("input", (e)=>{ filterState.q = e.target.value.trim(); render(); });
clearSearch.addEventListener("click", ()=>{ searchInput.value = ""; filterState.q=""; render(); });
sort.addEventListener("change", (e)=>{ filterState.sort = e.target.value; render(); });
category.addEventListener("change", (e)=>{ filterState.category = e.target.value; render(); });
price.addEventListener("input", (e)=>{ filterState.maxPrice = Number(e.target.value); priceOut.textContent = `$${filterState.maxPrice}`; render(); });
resetFilters.addEventListener("click", ()=>{
  filterState = { q:"", category:"all", sort:"featured", maxPrice:500 };
  searchInput.value = "";
  category.value = "all";
  sort.value = "featured";
  price.value = 500;
  priceOut.textContent = "$500";
  render();
});

// Checkout (demo only)
document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  alert("This is a demo checkout. Integrate Stripe/PayPal to accept payments.");
});

// Initial render
render();
updateBadges();
