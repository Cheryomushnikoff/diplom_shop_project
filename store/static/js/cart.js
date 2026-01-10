document.addEventListener('DOMContentLoaded', loadPage)
const cartButtons = document.querySelectorAll('.cartButton');

cartButtons.forEach(cartButton =>
    cartButton.onclick = (e) => updateCartElem(e));

function loadPage(e) {
    const containers = document.querySelectorAll('.product-container');
    console.log(containers)
    containers.forEach(container => renderCartElem(container))
}

function updateCartElem(e) {
    const cart = getCart();
    const container = e.target.parentNode;
    const productName = container.querySelector('.productName').textContent;
    const productPrice = container.querySelector('.productPrice').textContent;

    cart[productName] = {
        productName,
        productPrice,
        quantity: 1
    };

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartElem(container);

}


function renderCartElem(container) {
    const productName = container.querySelector('.productName').textContent;
    const cart = getCart();

    if (!(Object.keys(cart).includes(productName))) return false

    const btn = container.querySelector('button');

    console.log(cart)
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
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
}