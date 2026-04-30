// cart.js

// 1. ตัวแปรเก็บสถานะตะกร้าสินค้า
// ดึงข้อมูลเก่าจาก LocalStorage ทันทีที่โหลดไฟล์ (ถ้ามี)
let cart = JSON.parse(localStorage.getItem('shopping_cart')) || [];

/**
 * เพิ่มสินค้าลงตะกร้า
 * @param {number} productID 
 * @param {number} price 
 * @param {Array} allProducts - ต้องส่ง array สินค้าทั้งหมดเข้ามาเพื่อหาข้อมูล
 */
function addToCart(productID, price, allProducts) {
    const existingProduct = cart.find(item => item.id === productID);

    if (existingProduct) {
        existingProduct.quantity += 1;
        console.log(`Updated quantity for ID: ${productID}`);
    } else {
        const productData = allProducts.find(p => p.id === productID);

        if (productData) {
            cart.push({
                ...productData,
                price: price,
                quantity: 1
            });
            console.log("Successfully added new item to cart.");
        } else {
            console.error(`Fatal Error: Product ID ${productID} not found.`);
        }
    }

    console.log(cart)

    saveToLocalStorage();
    updateCartUI();
}

/**
 * บันทึกลง LocalStorage
 */
function saveToLocalStorage() {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
}

/**
 * อัปเดต UI (ฟังก์ชันนี้อาจจะปล่อยว่างไว้ หรือเขียน Logic กลาง เช่น อัปเดตตัวเลขบน Icon ตะกร้า)
 */
/**
 * Updates the Mini Cart UI to reflect current cart state.
 * อัพเดท mini_cart ทั้งหมดบนหน้าให้เรียบไทม์ (real-time)
 */
function updateCartUI() {
    console.log("🛒 Updating Cart UI - Current Cart State:", cart);

    // 2. คำนวณจำนวนชิ้นทั้งหมด (Badge) และราคารวม
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 4. สร้าง HTML สำหรับรายการสินค้า
    let cartItemsHTML = '';
    
    if (cart.length === 0) {
        cartItemsHTML = '<div class="cart_item"><p style="padding:10px;">Your cart is empty</p></div>';
    } else {
        cartItemsHTML = cart.map(item => `
            <div class="cart_item">
                <div class="cart_img">
                    <a href="#"><img src="${item.image}" alt="${item.title}"></a>
                </div>
                <div class="cart_info">
                    <a href="#">${item.title}</a>
                    <p>Qty: ${item.quantity} X <span> $${item.price.toFixed(2)} </span></p>    
                </div>
                <div class="cart_remove">
                    <a href="javascript:void(0)" onclick="removeFromCart(${item.id})">
                        <i class="ion-android-close"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    // 5. สร้าง Template HTML สำหรับ mini_cart
    const miniCartHTML = `
        <div class="mini_cart_list">
            ${cartItemsHTML}
        </div>
        <div class="mini_cart_table">
            <div class="cart_total">
                <span>Sub total:</span>
                <span class="price">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="cart_total mt-10">
                <span>Total:</span>
                <span class="price">$${subtotal.toFixed(2)}</span>
            </div>
        </div>
        <div class="mini_cart_footer">
            <div class="cart_button">
                <a href="cart.html">View cart</a>
            </div>
            <div class="cart_button">
                <a href="checkout.html">Checkout</a>
            </div>
        </div>
    `;

    // 6. อัพเดท ALL mini_cart_wrapper บนหน้า (Header + Offcanvas)
    const allMiniCarts = document.querySelectorAll('.mini_cart');
    allMiniCarts.forEach(miniCart => {
        miniCart.innerHTML = miniCartHTML;
    });

    // 7. อัพเดท ALL cart_quantity badges
    const allCartBadges = document.querySelectorAll('.cart_quantity');
    allCartBadges.forEach(badge => {
        badge.innerText = totalItems;
        // เพิ่ม CSS class เพื่อให้มีอนิเมชั่นเมื่อ update
        badge.classList.add('cart-updated');
        setTimeout(() => {
            badge.classList.remove('cart-updated');
        }, 300);
    });

    console.log(`✅ Cart Updated: ${totalItems} items, $${subtotal.toFixed(2)}`);
}

/**
 * (Optional) แถมฟังก์ชันลบสินค้าให้ด้วย เพื่อให้ปุ่ม X ทำงานได้
 */
function removeFromCart(productID) {
    cart = cart.filter(item => item.id !== productID);
    saveToLocalStorage();
    updateCartUI();
}

// ถ้าต้องการให้หน้าอื่นเห็นตัวแปร cart ด้วย
function getCart() {
    return cart;
}