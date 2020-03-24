import HTMLCustomElement from '../custom-element.js';

customElements.define('contact-info', class HTMLRequestForm extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});

		this.getTemplate('/components/contact/info.html').then(async tmp => {
			tmp.querySelector('form').addEventListener('submit', async event => {
				const target = event.target;
				event.preventDefault();
				const form = new FormData(event.target);
				const Toast = customElements.get('toast-message');
				const toast = new Toast();
				const pre = document.createElement('pre');
				const code = document.createElement('code');
				pre.slot = 'content';
				code.textContent = JSON.stringify(Object.fromEntries(form.entries()), null, 4);
				toast.backdrop = true;
				pre.append(code);
				toast.append(pre);
				document.body.append(toast);
				await toast.show();
				await toast.closed;
				toast.remove();
				target.reset();
			});

			this.shadowRoot.append(tmp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
