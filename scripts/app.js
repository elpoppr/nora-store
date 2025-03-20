const products = [
    { id: 1, name: "ساعة ذكية", price: 499, category: "electronics", image: "images/products/smart-watch.jpg" },
    { id: 2, name: "حقيبة نسائية", price: 299, category: "fashion", image: "images/prod// ------ القائمة المتنقلة ------ //
document.querySelector('.hamburger').addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.nav-links').classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        document.querySelector('.nav-links').classList.remove('active');
    }
});

document.querySelector('.nav-links').addEventListener('click', (e) => {
    e.stopPropagation();
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ------ المنتجات ------ //
const products = [
    { id: 1, name: "لابتوب", price: 15000, category: "electronics", image: "images/products/laptop.jpg" },
    { id: 2, name: "هاتف ذكي", price: 5999, category: "electronics", image: "images/products/phone.jpg" },
    { id: 3, name: "فساتين أطفال", price: 450, category: "fashion", image: "images/products/eid-girls.jpg" },
    { id: 4, name: "ملابس رجالي", price: 600, category: "fashion", image: "images/products/eid-boys.jpg" },
    { id: 5, name: "ساعة ذكية", price: 1200, category: "electronics", image: "images/products/smart-watch.jpg" },
    { id: 6, name: "سماعات", price: 300, category: "electronics", image: "images/products/headphones.jpg" },
    { id: 7, name: "حقيبة", price: 250, category: "fashion", image: "images/products/bag.jpg" }
];

// ------ عرض المنتجات ------ //
function renderProducts(filteredProducts = products) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price} ج.م</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">أضف إلى السلة</button>
                </div>
            </div>
        `;
        productsGrid.insertAdjacentHTML('beforeend', productCard);
    });
}

// ------ تصفية المنتجات ------ //
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
        renderProducts(filtered);
    });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    renderProducts(filtered);
});

// ------ إدارة السلة ------ //
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    try { navigator.vibrate(50); } catch(e) { console.log("Vibration API not supported"); }
    updateCartUI();
    showToast('تمت إضافة المنتج إلى السلة');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    try { navigator.vibrate([30, 50, 30]); } catch(e) { console.log("Vibration API not supported"); }
    updateCartUI();
    showToast('تم إزالة المنتج من السلة');
}

function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const totalPrice = document.getElementById('totalPrice');
    let total = 0;
    document.querySelector('.cart-counter').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const cartItem = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" width="60">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} ج.م × ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.insertAdjacentHTML('beforeend', cartItem);
    });
    totalPrice.textContent = total;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ------ النوافذ المنبثقة ------ //
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal('cartModal');
        closeModal('aboutModal');
    }
}

document.querySelectorAll('.modal-content').forEach(modal => {
    modal.addEventListener('click', (e) => e.stopPropagation());
});

// ------ الإشعارات ------ //
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ------ تأكيد الشراء ------ //
function confirmCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة! أضف منتجات أولاً.');
        return;
    }
    const modal = document.createElement('div');
    modal.className = 'checkout-confirm-modal';
    modal.innerHTML = `
        <div class="confirm-content">
            <h3>تأكيد الطلب</h3>
            <p>الإجمالي: <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ج.م</p>
            <div class="confirm-buttons">
                <button class="confirm-yes">نعم، أكمل</button>
                <button class="confirm-no">تراجع</button>
            </div>
        </div>
    `;
    modal.querySelector('.confirm-yes').addEventListener('click', () => {
        alert('تمت العملية بنجاح! سيصلك إشعار بالتوصيل.');
        cart = [];
        updateCartUI();
        closeModal('cartModal');
        modal.remove();
    });
    modal.querySelector('.confirm-no').addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}

document.querySelector('.checkout-btn').addEventListener('click', confirmCheckout);

// ------ البحث الصوتي ------ //
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        document.getElementById('searchInput').value = transcript;
        renderProducts(products.filter(p => p.name.includes(transcript)));
    };
    document.querySelector('.voice-search-btn').addEventListener('click', () => recognition.start());
} else {
    document.querySelector('.voice-search-btn').style.display = 'none';
    console.log("البحث الصوتي غير مدعوم في متصفحك!");
}

// ------ الوضع الليلي ------ //
document.getElementById('neo-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', this.checked);
});

document.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
    document.getElementById('neo-toggle').checked = isDark;
});

// ------ التمرير للأعلى ------ //
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}ucts/bag.jpg" },
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
