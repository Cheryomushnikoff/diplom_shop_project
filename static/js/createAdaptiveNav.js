export function createAdaptiveNav() {
    const authDesktop = document.getElementById('authDesktop');
    const authMobile = document.getElementById('authMobile');

    if (screen.availWidth > 450) { // если это не экран мобильного телефона

        const logo = document.getElementById('logo');
        const navBar = document.querySelector('.custom-nav');
        let logoTxt = document.getElementById('logo-txt');
        const searchInput = document.querySelector('[name="name"]');

        if (navBar.offsetWidth >= 500) {
            searchInput.style.width = '200px'

        } else {
            searchInput.style.width = '0px'

        }

        if (authDesktop || authMobile) {
            if (navBar.offsetWidth >= 660) {
                authMobile.style.display = 'none';
                authDesktop.style.display = 'inline-block';

            } else {
                authMobile.style.display = 'inline-block';
                authDesktop.style.display = 'none'

            }
        }

        if (navBar.offsetWidth >= 775) {
            if (!logoTxt) {
                logoTxt = document.createElement('span');
                logoTxt.id = 'logo-txt'
                logoTxt.innerText = 'Beads-shop';
                logo.appendChild(logoTxt);
            }
        } else {
            if (logoTxt) {
                logoTxt.remove()
            }
        }
    }
}

createAdaptiveNav = throttle(createAdaptiveNav, 100)

function throttle(func, time) {
    let canDo = true;
    return function (...arg) {
        if (canDo) {
            canDo = false;
            func(...arg);
            setTimeout(() => {
                canDo = true;
            }, time)
        }

    }
}