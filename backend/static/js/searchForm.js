export function getSearchMenu(e) {
    if (window.innerWidth <= 624){
        e.stopPropagation();
        e.preventDefault();
        const searchInput = document.querySelector('[name="name"]');
        const searchContainer = document.querySelector('#search-container');
        if (!searchContainer.classList.contains('visible')) {
            setTimeout(() => searchInput.style.width = '200px', 0);
            searchContainer.classList.add('visible');

            return false;
        }
        setTimeout(() => searchContainer.classList.remove('visible'), 300);
        searchInput.style.width = '0px';
    } else {
        checkForm()
    }
}


export function removeSearchMenu() {
    if (window.innerWidth <= 624) {
        const searchInput = document.querySelector('[name="name"]');
        const searchContainer = document.querySelector('#search-container');

        if (searchContainer.classList.contains('visible')) {
            setTimeout(() => searchContainer.classList.remove('visible'), 300);
            searchInput.style.width = '0px';
        }
    }
}


export function submitSearch(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkForm();
    }
}

function checkForm() {
    const form = document.getElementById('searchForm');
    const searchInput = form.querySelector('[name="name"]');
    searchInput.value = searchInput.value.trim()
    if (searchInput.value){
            form.submit();
    } else {
            searchInput.style.borderColor = 'red';
            searchInput.classList.add('red-placeholder')
            searchInput.placeholder = 'Надо что-то написать...'
    }
}