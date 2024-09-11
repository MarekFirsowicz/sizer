
const setAttr = (node, props) => {
    for (const key in props) {
        if (typeof props[key] === 'function') {
            node[key] = props[key]
        }
        // else if (key.startsWith('data-')) {
        //     const dataKey = key.substring(5).replace(/-./g, (char) => char[1].toUpperCase());
        //     node.dataset[dataKey] = props[key];}
        else {
            node.setAttribute(key, props[key])
        }
    }
    return node
}

const crHtml = tag => document.createElement(tag)
const get_node = (node) => document.querySelector(node)
const get_all = (nodes) => document.querySelectorAll(nodes)
const rotate_node = (node, deg) => node.style.transform = `rotate(${deg}deg)`


function cr_node(tag) {
    return function (props = {}) {
        return function (...children) {
            const el = crHtml(tag)
            setAttr(el, props)
            children.map(child => {
                if (typeof child === 'string') {
                    el.textContent = child
                }
                else {
                    el.append(child)
                }
            })
            return el
        }
    }
}

function debounce(fn, delay) {
    let id;
    return function (...args) {
        if (id) clearTimeout(id)
        id = setTimeout(() => {
            fn(...args)
        }, delay)
    };
}
