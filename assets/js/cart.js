// cart.js

const AUTH_USER_KEY = 'authUser';
const CART_KEY_PREFIX = 'shopping_cart_';
const CART_KEY_GUEST = 'shopping_cart_guest';

let currentCartStorageKey = getCurrentCartKey();
let cart = loadCartFromStorage();

function getAuthUserFromStorage() {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function getCurrentCartKey() {
    const user = getAuthUserFromStorage();
    if (!user) {
        return CART_KEY_GUEST;
    }

    const identifier = user.username || user.email || user.first_name || user.id;
    if (!identifier) {
        return CART_KEY_GUEST;
    }

    return `${CART_KEY_PREFIX}${identifier}`;
}

function loadCartFromStorage() {
    const key = getCurrentCartKey();
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
        return JSON.parse(raw) || [];
    } catch {
        return [];
    }
}

function ensureCartKey() {
    const key = getCurrentCartKey();
    if (key !== currentCartStorageKey) {
        currentCartStorageKey = key;
        cart = loadCartFromStorage();
    }
}

function saveToLocalStorage() {
    const key = getCurrentCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
}

function getCart() {
    ensureCartKey();
    return cart;
}

function getCartSubtotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function addToCart(productID, price = null, allProducts = null) {
    ensureCartKey();

    const existingProduct = cart.find(item => item.id === productID);
    if (existingProduct) {
        existingProduct.quantity += 1;
        console.log(`Updated quantity for ID: ${productID}`);
    } else {
        const productData = Array.isArray(allProducts)
            ? allProducts.find(p => p.id === productID)
            : null;
        const resolvedPrice = price != null
            ? price
            : productData?.current_price ?? productData?.price ?? 0;

        cart.push({
            id: productID,
            title: productData?.title || `Product ${productID}`,
            image: productData?.image || 'assets/img/s-product/product.jpg',
            price: resolvedPrice,
            quantity: 1
        });

        console.log('Successfully added new item to cart.');
    }

    saveToLocalStorage();
    updateCartUI();
    renderCartPage();
    renderCheckoutPage();
}

function updateItemQuantity(productID, quantity) {
    ensureCartKey();
    const qty = Number(quantity);
    if (qty <= 0) return;

    const item = cart.find(entry => entry.id === productID);
    if (!item) return;

    item.quantity = qty;
    saveToLocalStorage();
    updateCartUI();
    renderCartPage();
    renderCheckoutPage();
}

function removeFromCart(productID) {
    ensureCartKey();
    cart = cart.filter(item => item.id !== productID);
    saveToLocalStorage();
    updateCartUI();
    renderCartPage();
    renderCheckoutPage();
}

function renderMiniCart() {
    const currentCart = getCart();
    const subtotal = getCartSubtotal();

    let cartItemsHTML = '';
    if (currentCart.length === 0) {
        cartItemsHTML = '<div class="cart_item"><p style="padding:10px;">Your cart is empty</p></div>';
    } else {
        cartItemsHTML = currentCart.map(item => `
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

    document.querySelectorAll('.mini_cart').forEach(miniCart => {
        miniCart.innerHTML = miniCartHTML;
    });
}

function updateCartUI() {
    const currentCart = getCart();
    const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);

    renderMiniCart();

    document.querySelectorAll('.cart_quantity').forEach(badge => {
        badge.innerText = totalItems;
        badge.classList.add('cart-updated');
        setTimeout(() => badge.classList.remove('cart-updated'), 300);
    });

    console.log(`✅ Cart Updated: ${totalItems} items, $${getCartSubtotal().toFixed(2)}`);
}

function renderCartPage() {
    const cartBody = document.getElementById('cart-items');
    if (!cartBody) return;

    const currentCart = getCart();
    if (currentCart.length === 0) {
        cartBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 2rem;">Your cart is empty.</td>
            </tr>
        `;
    } else {
        cartBody.innerHTML = currentCart.map(item => `
            <tr>
                <td class="product_thumb"><a href="#"><img src="${item.image}" alt="${item.title}"></a></td>
                <td class="product_name"><a href="#">${item.title}</a></td>
                <td class="product-price">$${item.price.toFixed(2)}</td>
                <td class="product_quantity">
                    <label>Quantity</label>
                    <input class="cart-quantity-input" data-product-id="${item.id}" min="1" max="100" value="${item.quantity}" type="number">
                </td>
                <td class="product_total">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="product_remove"><a href="javascript:void(0)" class="remove-item" data-product-id="${item.id}"><i class="ion-android-close"></i></a></td>
            </tr>
        `).join('');
    }

    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const shippingElement = document.getElementById('cart-shipping');

    const subtotal = getCartSubtotal();
    const shipping = currentCart.length === 0 ? 0 : 5.00;
    const total = subtotal + shipping;

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    cartBody.querySelectorAll('.cart-quantity-input').forEach(input => {
        input.addEventListener('change', event => {
            const productId = Number(event.target.dataset.productId);
            const quantity = Number(event.target.value);
            if (quantity < 1) {
                event.target.value = 1;
                return;
            }
            updateItemQuantity(productId, quantity);
        });
    });

    cartBody.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const productId = Number(button.dataset.productId);
            removeFromCart(productId);
        });
    });
}

function renderCheckoutPage() {
    const orderItemsBody = document.getElementById('checkout-order-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    if (!orderItemsBody) return;

    const currentCart = getCart();
    if (currentCart.length === 0) {
        orderItemsBody.innerHTML = `
            <tr>
                <td colspan="2" style="text-align:center; padding: 2rem;">No items in your cart.</td>
            </tr>
        `;
    } else {
        orderItemsBody.innerHTML = currentCart.map(item => `
            <tr>
                <td>${item.title} <strong>× ${item.quantity}</strong></td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');
    }

    const subtotal = getCartSubtotal();
    const shipping = currentCart.length === 0 ? 0 : 5.00;
    const total = subtotal + shipping;

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function initCartScripts() {
    updateCartUI();
    renderCartPage();
    renderCheckoutPage();
}

window.addEventListener('DOMContentLoaded', initCartScripts);
