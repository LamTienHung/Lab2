import {
    createElement,
    createTextElement,
    renderToDOM
} from './mini-react.js';

const vApp = createElement(
    'main',
    { id: 'root-view', role: 'main' },

    createElement(
        'header',
        { className: 'hero' },

        createElement(
            'h1',
            null,
            'Mini React Engine'
        ),

        createElement(
            'p',
            null,
            'Exercise 1 - Virtual DOM & Mounting Engine'
        )
    ),

    createElement(
        'section',
        { className: 'content', 'aria-label': 'Security testing' },

        createElement(
            'h2',
            null,
            'Virtual DOM Test'
        ),

        createElement(
            'p',
            null,
            'This interface is generated using custom createElement and renderToDOM functions.'
        ),

        createElement(
            'p',
            { className: 'security-test' },
            '<script>alert(1)</script>'
        ),

        createElement(
            'p',
            { className: 'security-test' },
            '<img src=x onerror=alert(1)> Safe Text'
        ),

        createElement(
            'button',
            {
                id: 'test-button',
                onClick: () => {
                    console.log('Ping');
                    alert('Mini React button works!');
                }
            },
            'Click Me'
        )
    ),

    createElement(
        'footer',
        null,
        createElement(
            'p',
            null,
            'Lab 02 - Exercise 1'
        )
    )
);

const root = document.getElementById('app');

root.replaceChildren(renderToDOM(vApp));

// Verification tests
console.assert(
    root.querySelector('button') !== null,
    'Mount Failed'
);

console.assert(
    root.querySelector('main') !== null,
    'Semantic main element missing'
);

console.assert(
    root.querySelectorAll('script').length === 0,
    'XSS test failed'
);

console.assert(
    root.querySelectorAll('img').length === 0,
    'HTML injection test failed'
);

console.assert(
    root.querySelectorAll('#root-view').length === 1,
    'Unexpected root nodes'
);

const textNode = createTextElement('Test');

console.assert(
    textNode.type === 'TEXT_ELEMENT',
    'Text normalization failed'
);

console.log('EX1 verification completed.');
console.log('Virtual DOM:', vApp);
