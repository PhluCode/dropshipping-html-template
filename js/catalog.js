/**
 * ดึงข้อมูลสินค้าจาก API หรือ JSON File
 */

let allProducts = [];

async function loadProducts() {
    
    const dataSource = '/api/products';

    try {
        const response = await fetch(dataSource);
        if (!response.ok) {
            throw new Error(`System failed to fetch: ${response.status}`);
        }
        allProducts = await response.json();
        
        // ส่งข้อมูลที่ได้ไปให้ฟังก์ชัน Render
        renderProducts(allProducts);
        
    } catch (error) {
        console.error("Full Stack Dev Error:", error);
        displayErrorMessage();
    }
}

/**
 * รับข้อมูล Array ของสินค้าแล้วสร้าง HTML เพื่อแสดงผล
 */
function renderProducts(products) {
    const gridContainer = document.querySelector('.product_grid');
    
    if (!gridContainer) return;

    const productCards = products.map(product => {
        // สร้าง Star Rating HTML
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += i <= product.rating 
                ? '<i class="fa fa-star"></i>' 
                : '<i class="fa fa-star-o"></i>';
        }

        return `
            <div class="product_item">
                <div class="product_image">
                    <img src="${product.image}" alt="${product.image_alt}">
                    ${product.badge ? `<span class="product_badge">${product.badge}</span>` : ''}
                </div>
                <div class="product_content">
                    <h3 class="product_title">${product.title}</h3>
                    <div class="product_rating">
                        ${starsHTML}
                    </div>
                    <div class="product_price">
                        <span class="price_current">$${product.current_price.toFixed(2)}</span>
                        <span class="price_original">$${product.original_price.toFixed(2)}</span>
                    </div>
                    <div class="product_actions">
                        <button href="product-details.html?id=${product.id}" data-id=${product.id} data-price=${product.original_price.toFixed(2)} class="btn_add_cart">
                            <i class="fa fa-shopping-cart"></i> Add
                        </button>
                        <button href="wishlist.html" class="btn_wishlist">
                            <i class="fa fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    gridContainer.innerHTML = productCards;
}

/**
 * แสดงข้อความเมื่อเกิด Error
 */
function displayErrorMessage() {
    const gridContainer = document.querySelector('.product_grid');
    if (gridContainer) {
        gridContainer.innerHTML = `
            <div class="error_container" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p>Oops! We're having trouble loading the shop catalog right now.</p>
            </div>
        `;
    }
}

/**
 * ฟังก์ชันสำหรับกรองข้อมูลสินค้าตามชื่อและหมวดหมู่
 * @param {string} searchTerm - คำค้นหาจาก User (เช่น 'shirt', 'phone')
 * @param {string} category - หมวดหมู่ที่เลือก (เช่น 'Electronics', 'All')
 * @returns {Array} - Array ของสินค้าที่ผ่านการกรองแล้ว
 */
function filterProducts(searchTerm, category) {
    // แก้ไข: ตรวจสอบก่อนว่า searchTerm มีค่าและเป็น string ไหม 
    // ถ้าไม่ใช่ (เช่น เป็น null หรือ undefined) ให้เปลี่ยนเป็น string ว่าง "" แทน
    const safeSearchTerm = (typeof searchTerm === 'string') ? searchTerm : "";

    // 1. ปรับเป็นตัวพิมพ์เล็ก (ตอนนี้จะไม่พังแล้วเพราะเรามั่นใจว่าเป็น string)
    const normalizedSearch = safeSearchTerm.toLowerCase().trim();

    return allProducts.filter(product => {
        // ป้องกันกรณี product.title ไม่มีค่า (เผื่อข้อมูลในฐานข้อมูลมาไม่ครบ)
        const title = product.title ? product.title.toLowerCase() : "";
        const matchesTitle = title.includes(normalizedSearch);

        const matchesCategory = (category === "") || (product.category === category);

        return matchesTitle && matchesCategory;
    });
}

const searchInput = document.querySelector('.search_input');
const categorySelect = document.querySelector('#category-filter');

function updateFilteredUI() {
    const searchTerm = searchInput.value;
    const selectedCategory = categorySelect.value;

    const fillteredData = filterProducts(searchTerm, selectedCategory);

    renderProducts(fillteredData);
}


categorySelect.addEventListener('change', ()=> {
    console.log("Category changed to:", categorySelect.value);
    updateFilteredUI();
})

searchInput.addEventListener('input', ()=> {
    updateFilteredUI();
})

const productGrid = document.querySelector('.product_grid');

productGrid.addEventListener('click', (event) => {
    const btn = event.target.closest('.btn_add_cart');
    if (!btn) return;

    const productId = Number(btn.getAttribute('data-id')); 
    const price = parseFloat(btn.getAttribute('data-price'));

    // เรียกใช้ฟังก์ชันจาก cart.js 
    // *ต้องส่ง allProducts เข้าไปด้วย เพราะ cart.js ไม่เห็นตัวแปรนี้*
    addToCart(productId, price, allProducts); 
});

// ใน catalog.html ตรงส่วนล่างสุดของ <script>
document.addEventListener('DOMContentLoaded', () => {
    // 1. โหลดสินค้าหลัก
    if (typeof loadProducts === 'function') loadProducts();
    
    // 2. บังคับให้ Mini Cart แสดงผลจากข้อมูลใน LocalStorage ทันที
    if (typeof updateCartUI === 'function') {
        updateCartUI(); 
    }
});
    