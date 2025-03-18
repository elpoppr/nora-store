// »Ì«‰«  «·„‰ Ã« 
const products = [
    {
        id: 1,
        name: "”«⁄… –ﬂÌ…",
        price: 499,
        category: "electronics",
        image: "images/products/smart-watch.jpg"
    },
    {
        id: 2,
        name: "ÕﬁÌ»… ‰”«∆Ì…",
        price: 299,
        category: "fashion",
        image: "images/products/bag.jpg"
    },
    {
        id: 3,
        name: "Â« › –ﬂÌ",
        price: 1200,
        category: "electronics",
        image: "images/products/phone.jpg"
    },
    {
        id: 4,
        name: "·«» Ê»",
        price: 8500,
        category: "electronics",
        image: "images/products/laptop.jpg"
    },
    {
        id: 5,
        name: "”„«⁄… ·« ”·ﬂÌ…",
        price: 450,
        category: "electronics",
        image: "images/products/headphones.jpg"
    },
    {
        id: 6,
        name: "„·«»” ⁄Ìœ ··√Ê·«œ",
        price: 350,
        category: "fashion",
        image: "images/products/eid-boys.jpg"
    },
    {
        id: 7,
        name: "„·«»” ⁄Ìœ ··»‰« ",
        price: 400,
        category: "fashion",
        image: "images/products/eid-girls.jpg"
    }
];

// ⁄—»… «· ”Êﬁ
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ⁄—÷ «·„‰ Ã« 
function renderProducts(filter = 'all') {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(p => p.category === filter);

    filteredProducts.forEach(product => {
        const productCard = `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price * 7} Ã.„</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        ≈÷«›… ≈·Ï «·”·…
                    </button>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
}

// ≈÷«›… ≈·Ï «·”·…
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

//  ÕœÌÀ ⁄œ«œ «·”·…
function updateCartCounter() {
    const counter = document.querySelector('.cart-counter');
    counter.textContent = cart.length;
}

//  ’›Ì… «·„‰ Ã« 
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// «· „—Ì— «·”·” ⁄‰œ «·‰ﬁ— ⁄·Ï «·—Ê«»ÿ
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// «· ÂÌ∆… «·√Ê·Ì…
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCounter();
});