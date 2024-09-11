//sort product by name 
brands.sort((a, b) => a.name > b.name ? 1 : -1)

const app = get_node('#sizer_app')
const body = get_node('body')
const header = get_node('header')
const main = get_node('main')
const h1 = cr_node('h1')()
const div = cr_node('div')
const button = cr_node('button')


let search_switch = false


function search_bar(e) {
    const input = e.target.value.toLowerCase()
    const regex = /^[A-Za-z](?:[A-Za-z ]*[A-Za-z])?$/;
    if (!regex.test(input) && input !== '') return

    const searched_brands = brands.filter(el => search_switch ?
        el.name.toLowerCase().includes(input)
        : el.name.toLowerCase().startsWith(input)
    )
    init(searched_brands)
}




//Button functions


function close_modal(parent, child, name) {
    body.classList.remove('modal_open')
    parent.removeChild(child)
    const brand_lables = [...document.querySelectorAll('.brand_btn')]
    brand_lables.map(el => {
        if (el.innerText === name) el.focus()
        el.removeAttribute('tabindex')
    })
}

// when btn click open modal with brand prods
function open_modal(btn_name, brands) {
    body.classList.add('modal_open')
    const brand_lables = [...document.querySelectorAll('.brand_btn')]
    brand_lables.map(el => setAttr(el, { tabindex: -1 }))

    const brand = brands.find(el => el.name === btn_name)
    const brand_prods = brand.products.map((el, i) => button({ class: 'product_btn dark_btn', onclick: (e) => show_sizes_keys(e, el.sizes) })(el.type))
    const products_div = div({ class: 'brand_products' })(...brand_prods)

    const modal = div({ class: 'modal' })(
        div({ class: 'brand_container' })(
            div({ class: 'brand_header' })(
                button({ class: 'dark_btn brand_name_btn', onclick: () => products_div.replaceChildren(...brand_prods) })(brand.name),

                button({ class: 'close dark_btn', onclick: () => close_modal(body, modal, btn_name) })(
                    cr_node('i')({ class: "fa-regular fa-circle-xmark" })()
                )),
            products_div
        )
    )
    body.append(modal)
}

function find_size_value(e, size) {
    e.target.parentNode.classList.add('row')
    e.target.parentNode.replaceChildren(
        div({ class: 'half_circle hc_1' })(e.target.innerText),
        div({ class: 'half_circle hc_2' })(size)
    )
}

function click_size_value(e, index, other_sizes) {
    if (get_node('.other_size_btns')) get_node('.other_size_btns').remove()
    e.target.parentNode.replaceChildren(e.target)
    get_node('.brand_products').append(
        div({ class: 'other_size_btns' })(...other_sizes.map(el => button({ class: 'size_key_btn dark_btn', onclick: (e) => find_size_value(e, el[Object.keys(el)][index]) })(Object.keys(el)))
        ))
}

function show_size_values(e, sizes) {
    if (get_node('.other_size_btns')) get_node('.other_size_btns').remove()
    e.target.classList.add('hc_1')
    get_node('.size_keys').classList.add('row')
    const current_sizes = sizes.reduce((acc, el) => {
        if (acc === null && Object.keys(el)[0] === e.target.innerText) return Object.values(el)[0];
        return acc;
    }, null)
    const other_sizes = sizes.filter(el => Object.keys(el)[0] !== e.target.innerText)

    const parent_node = e.target.parentNode
    parent_node.replaceChildren(e.target)
    parent_node.append(div({ class: 'size_value' })(
        ...current_sizes.map((el, i) => button({ class: 'dark_btn hc_2', onclick: (e) => click_size_value(e, i, other_sizes) })(el)))
    )
}

function show_sizes_keys(e, sizes) {
    const parent_node = e.target.parentNode
    const size_key_btns = sizes.map(el => button({ class: 'size_key_btn dark_btn', onclick: (e) => show_size_values(e, sizes) })(Object.keys(el)))
    if (parent_node.children.length > 1) parent_node.replaceChildren(e.target)
    parent_node.append(div({ class: 'size_keys' })(...size_key_btns))
}

function switch_search_btn(e) {
    search_switch = !search_switch
    search_switch ? e.target.innerText = '..a.' : e.target.innerText = 'A...'
}


//init function
function init(brands) {
    const brand_lables = brands.map(el => button({ class: 'brand_btn', onclick: (e) => open_modal(el.name, brands) })(el.name))
    main.replaceChildren(...brand_lables)
}


// init
header.append(
    h1('SIZER'),
    div({ class: 'search_div' })(
        cr_node('input')({
            onkeyup: debounce(e => search_bar(e, brands), 250),
            id: 'search_input',
            autocomplete: 'off',
            type: 'text',
            class: 'search_box',
            size: 15,
            placeholder: 'Search Brand...'
        })(),
        button({
            id: 'search_switch',
            class: 'search_switch_btn',
            onclick: (e) => switch_search_btn(e)
        })('A...')
    )

)

init(brands)
