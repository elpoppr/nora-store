const products = [
    { id: 1, name: "ساعة ذكية", price: 499, category: "electronics", image: "images/products/smart-watch.jpg" },
    { id: 2, name: "حقيبة نسائية", price: 299, category: "fashion", image: "images/products/bag.jpg" },
    { id: 3, name: "هاتف محمول", price: 1200, category: "electronics", image: "images/products/phone.jpg" },
    { id: 4, name: "لابتوب", price: 8500, category: "electronics", image: "images/products/laptop.jpg" },
    { id: 5, name: "سماعات لاسلكية", price: 450, category: "electronics", image: "images/products/headphones.jpg" },
    { id: 6, name: "ملابس عيد للاولاد", price: 350, category: "fashion", image: "images/products/eid-boys.jpg" },
    { id: 7, name: "ملابس عيد للبنات", price: 400, category: "fashion", image: "images/products/eid-girls.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".animate-on-scroll").forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 1
    });
});

// Render Products
function renderProducts(filter = 'all', customProducts = null) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    const filteredProducts = customProducts || 
        (filter === 'all' ? products : products.filter(p => p.category === filter));

    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price * 7} ج.م</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        أضف إلى السلة
                    </button>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
}

// إضافة إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

// تحديث عداد السلة
function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    counter.textContent = cart.length;
}

// فتح نافذة السلة
document.querySelector('.cart-icon').addEventListener('click', () => {
    openModal('cartModal');
});

// تحميل عناصر السلة
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.getElementById('totalPrice');
    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * 7;
        total += itemTotal;
        
        const cartItem = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${itemTotal} ج.م</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">حذف</button>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItem;
    });

    totalPriceElement.textContent = total;
}

// حذف عنصر من السلة
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartCounter();
}

// التمرير إلى أعلى الصفحة
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// فتح وإغلاق الـ Modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    if (modalId === 'cartModal') loadCartItems();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// إغلاق الـ Modal عند النقر خارجها
window.onclick = function(e) {
    if (e.target.className === 'modal') {
        e.target.style.display = 'none';
    }
}

// Event Listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
    );
    renderProducts('all', filteredProducts);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCounter();
});
