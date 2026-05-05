function clearCartContents() {
    cart = [];
    saveToLocalStorage();
    updateCartUI();
    renderCartPage();
    renderCheckoutPage();
}

function setCheckoutMessage(message, type = 'error') {
    const messageElement = document.getElementById('checkout-message');
    if (!messageElement) return;
    messageElement.textContent = message;
    messageElement.style.color = type === 'success' ? '#2ecc71' : '#e74c3c';
}

function clearCheckoutFieldErrors() {
    ['checkout-email', 'checkout-phone', 'checkout-cardholder', 'checkout-card-number', 'checkout-card-expiry', 'checkout-card-cvv'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.border = '';
        }
    });
}

function validateCheckoutFields() {
    const email = document.getElementById('checkout-email');
    const phone = document.getElementById('checkout-phone');
    const cardholder = document.getElementById('checkout-cardholder');
    const cardNumber = document.getElementById('checkout-card-number');
    const expiry = document.getElementById('checkout-card-expiry');
    const cvv = document.getElementById('checkout-card-cvv');

    const errors = [];
    const emailValue = email?.value.trim() || '';
    const phoneValue = phone?.value.trim() || '';
    const cardholderValue = cardholder?.value.trim() || '';
    const cardNumberValue = cardNumber?.value.replace(/\s+/g, '') || '';
    const expiryValue = expiry?.value.trim() || '';
    const cvvValue = cvv?.value.trim() || '';

    const emailValid = /^\S+@\S+\.\S+$/.test(emailValue);
    if (!emailValue || !emailValid) {
        errors.push({ field: 'Email Address', element: email, message: 'กรุณากรอกอีเมลให้ถูกต้อง' });
    }

    if (!phoneValue || !/^\+?[0-9\-\s]{7,}$/.test(phoneValue)) {
        errors.push({ field: 'Phone', element: phone, message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' });
    }

    if (!cardholderValue) {
        errors.push({ field: 'Cardholder Name', element: cardholder, message: 'กรุณากรอกชื่อบนบัตร' });
    }

    if (!/^[0-9]{13,19}$/.test(cardNumberValue)) {
        errors.push({ field: 'Card Number', element: cardNumber, message: 'กรุณากรอกหมายเลขบัตรเครดิตให้ถูกต้อง' });
    }

    if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(expiryValue)) {
        errors.push({ field: 'Expiration Date', element: expiry, message: 'กรุณากรอกวันหมดอายุในรูปแบบ MM / YY' });
    }

    if (!/^[0-9]{3,4}$/.test(cvvValue)) {
        errors.push({ field: 'CVV / CVC', element: cvv, message: 'กรุณากรอก CVV / CVC ให้ถูกต้อง' });
    }

    return errors;
}

function handleCheckoutSubmit(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    clearCheckoutFieldErrors();
    setCheckoutMessage('', 'error');

    const currentCart = getCart();
    if (currentCart.length === 0) {
        setCheckoutMessage('ไม่มีสินค้าในตะกร้า โปรดเพิ่มรายการก่อนชำระเงิน', 'error');
        return;
    }

    const errors = validateCheckoutFields();
    if (errors.length > 0) {
        errors.forEach(error => {
            if (error.element) {
                error.element.style.border = '1px solid #e74c3c';
            }
        });
        const message = errors.map(error => `${error.field}: ${error.message}`).join(' / ');
        setCheckoutMessage(message, 'error');
        if (errors[0].element) {
            errors[0].element.focus();
        }
        return;
    }

    clearCartContents();
    setCheckoutMessage('สั่งซื้อสำเร็จแล้ว ตะกร้าสินค้าของคุณถูกล้างเรียบร้อย', 'success');
}

function bindCheckoutSubmit() {
    const checkoutButton = document.getElementById('checkout-submit');
    if (!checkoutButton) return;
    checkoutButton.addEventListener('click', handleCheckoutSubmit);
}

window.addEventListener('DOMContentLoaded', bindCheckoutSubmit);
