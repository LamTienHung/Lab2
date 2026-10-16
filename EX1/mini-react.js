export function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: String(text),
            children: []
        }
    };
}

export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...(props || {}),
            children: children
                .flat(Infinity)
                .filter(child =>
                    child !== null &&
                    child !== undefined &&
                    child !== false &&
                    child !== true
                )
                .map(child =>
                    typeof child === 'object'
                        ? child
                        : createTextElement(child)
                )
        }
    };
}

export function renderToDOM(vNode) {
    if (!vNode || typeof vNode !== 'object') {
        throw new TypeError('Invalid VNode');
    }

    if (vNode.type === 'TEXT_ELEMENT') {
        return document.createTextNode(vNode.props.nodeValue);
    }

    if (typeof vNode.type !== 'string') {
        throw new TypeError('Invalid element type');
    }

    const dom = document.createElement(vNode.type);

    Object.entries(vNode.props)
        .filter(([name]) =>
            name !== 'children' &&
            name !== 'nodeValue' &&
            name !== 'key'
        )
        .forEach(([name, value]) => {
            if (name.startsWith('on') && typeof value === 'function') {
                const eventName = name.slice(2).toLowerCase();
                dom.addEventListener(eventName, value);
            } else if (name === 'className') {
                dom.className = value;
            } else if (name === 'style' && value && typeof value === 'object') {
                Object.assign(dom.style, value);
            } else if (
                !name.startsWith('on') &&
                !['innerHTML', 'outerHTML', 'srcdoc'].includes(name) &&
                value !== null &&
                value !== undefined
            ) {
                dom.setAttribute(name, String(value));
            }
        });

    vNode.props.children.forEach(child => {
        dom.appendChild(renderToDOM(child));
    });

    return dom;
}
