/**
 * Main application script for E-commerce
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. กำหนดตัวแปรอ้างอิงถึง HTML element
    const productContainer = document.querySelector('#product-list');

    // 2. ฟังก์ชันดึงข้อมูลจาก API
    const fetchProducts = async () => {
        try {
            // เรียกไปยัง Endpoint ที่เราสร้างไว้ใน Node.js
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const products = await response.json();
            renderProducts(products);

        } catch (error) {
            console.error('Fetch error:', error);
            if (productContainer) {
                productContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-danger">ขออภัย! ไม่สามารถโหลดข้อมูลสินค้าได้ในขณะนี้</p>
                    </div>`;
            }
        }
    };

    // 3. ฟังก์ชันสร้าง HTML สำหรับแสดงผลสินค้า
    const renderProducts = (products) => {
        if (!productContainer) return;

        if (!products || products.length === 0) {
            productContainer.innerHTML = '<p class="text-center">ไม่มีสินค้าในระบบ</p>';
            return;
        }

        const html = products.map(product => {
            return `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="product-card">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.image_alt}" class="img-fluid">
                            ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                        </div>
                        <div class="product-info mt-3">
                            <small class="text-uppercase text-muted">${product.category}</small>
                            <h5 class="product-title">${product.title}</h5>
                            <div class="price-wrap">
                                <span class="current-price text-primary h5">$${product.current_price.toFixed(2)}</span>
                                ${product.original_price ? 
                                    `<span class="original-price text-muted ms-2"><del>$${product.original_price.toFixed(2)}</del></span>` 
                                    : ''}
                            </div>
                            <button class="btn btn-outline-dark btn-sm mt-2 w-100" onclick="addToCart(${product.id}, ${product.current_price})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        productContainer.innerHTML = html;
    };

    // เริ่มทำงานเมื่อโหลดหน้าเว็บ
    if (productContainer) {
        fetchProducts();
    }
});
