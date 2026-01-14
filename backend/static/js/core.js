import {submitSearch, getSearchMenu, removeSearchMenu} from  './searchForm.js'
import {createAdaptiveNav} from'./createAdaptiveNav.js'

const searchInput = document.getElementById('searchInput')
searchInput.addEventListener('click', (e) => e.stopPropagation())
searchInput.addEventListener('keydown', (e) => submitSearch(e))

const btnSearch = document.querySelector('.btn-search')
btnSearch.addEventListener('click', (e) => getSearchMenu(e))

document.addEventListener("DOMContentLoaded", createAdaptiveNav)

window.addEventListener('resize', createAdaptiveNav)

document.body.addEventListener('click', removeSearchMenu)










