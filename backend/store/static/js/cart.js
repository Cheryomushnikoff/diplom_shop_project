document.addEventListener('DOMContentLoaded', loadPage)
const cartButtons = document.querySelectorAll('.cartButton');

cartButtons.forEach(cartButton =>
    cartButton.onclick = (e) => updateCartElem(e));

function loadPage(e) {
    const containers = document.querySelectorAll('.product-container');
    containers.forEach(container => renderCartElem(container));
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



async function updateCartElem(e) {
    const cart = getCart();
    const container = e.target.parentNode;
    const productName = container.querySelector('.productName').textContent;
    const productPrice = container.querySelector('.productPrice').textContent;

    const csrftoken = getCookie('csrftoken');

    let response = await fetch('products/api-add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ productName })
    });

    cart[productName] = {
        productName,
        productPrice,
        quantity: 1
    };

    sessionStorage.setItem('cart', JSON.stringify(cart));
    renderCartElem(container);

}


function renderCartElem(container) {
    const productName = container.querySelector('.productName').textContent;
    const cart = getCart();

    if (!(Object.keys(cart).includes(productName))) return false

    const btn = container.querySelector('button');

    const psevdoForm = document.createElement('div');
    psevdoForm.classList.add('psevdoForm');

    const addBtn = document.createElement('button');
    addBtn.classList.add('addBtn');
    addBtn.textContent = '+';
    addBtn.onclick = async () => addProduct(productName);

    const popBtn = document.createElement('button');
    popBtn.classList.add('popBtn');
    popBtn.textContent = '-';
    popBtn.onclick = async () => popProduct(productName);

    const intInput = document.createElement('input');
    intInput.type = 'number';
    intInput.classList.add('intInput');
    intInput.value = cart[productName]['quantity'];
    intInput.oninput = async () => redirectProduct(productName);

    container.removeChild(btn);
    psevdoForm.append(popBtn, intInput, addBtn);
    container.append(psevdoForm);
}

async function addProduct(productName){

}

async function popProduct(productName) {

}
async function redirectProduct(productName) {

}

function getCart() {
    return sessionStorage.getItem('cart') ? JSON.parse(sessionStorage.getItem('cart')) : {};
}