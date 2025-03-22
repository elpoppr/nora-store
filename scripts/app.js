// ------ إدارة القائمة المتنقلة ------ //
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

// ------ بيانات المنتجات ------ //
const products = [
    { 
        id: 1, 
        name: "لابتوب", 
        price: 15000, 
        category: "electronics", 
        image: "images/products/laptop.jpg",
        specs: {
            "المعالج": "Intel Core i7-1165G7",
            "الذاكرة": "16GB DDR4",
            "التخزين": "512GB SSD",
            "كارت الشاشة": "Intel Iris Xe",
            "الشاشة": "15.6 بوصة FHD"
        }
    },
    { 
        id: 2, 
        name: "هاتف ذكي", 
        price: 5999, 
        category: "electronics", 
        image: "images/products/phone.jpg",
        specs: {
            "الشاشة": "6.5 بوصة AMOLED",
            "المعالج": "Snapdragon 888",
            "الذاكرة": "8GB RAM",
            "التخزين": "256GB",
            "البطارية": "5000mAh"
        }
    },
    // إضافة منتجات أخرى هنا بنفس الهيكل
];

// ------ عرض المنتجات ------ //
function renderProducts(filteredProducts = products) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card" data-category="${product.category}" onclick="showProductDetails(${product.id})">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price.toLocaleString()} ج.م</p>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">أضف إلى السلة</button>
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
let currentProductId = null;

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
                    <p>${item.price.toLocaleString()} ج.م × ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.insertAdjacentHTML('beforeend', cartItem);
    });
    
    totalPrice.textContent = total.toLocaleString();
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ------ تفاصيل المنتج ------ //
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    currentProductId = productId;
    
    document.getElementById('detailProductName').textContent = product.name;
    document.getElementById('detailProductPrice').textContent = `${product.price.toLocaleString()} ج.م`;
    document.getElementById('detailProductImage').src = product.image;
    
    const specsList = document.getElementById('productSpecs');
    specsList.innerHTML = '';
    for (const [key, value] of Object.entries(product.specs)) {
        specsList.innerHTML += `
            <li>
                <span>${key}:</span>
                <span>${value}</span>
            </li>
        `;
    }
    
    openModal('productDetailsModal');
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
        closeModal('productDetailsModal');
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
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('السلة فارغة! أضف منتجات أولاً.');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'checkout-confirm-modal';
    modal.innerHTML = `
        <div class="confirm-content">
            <h3>تأكيد الطلب</h3>
            <p>الإجمالي: <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} ج.م</span></p>
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
});

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
}

// التهيئة الأولية
renderProducts();
updateCartUI();
