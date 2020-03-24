import HTMLCustomElement from '../custom-element.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('login-form', class HTMLLoginForm extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		const user = Router.user;

		this.getTemplate('/components/login/form.html').then(async tmp => {
			$('form', tmp).submit(async event => {
				const target = event.target;
				event.preventDefault();
				const form = new FormData(event.target);
				const data = await user.logIn({
					username: form.get('username'),
					password: form.get('password'),
				});
				const Toast = customElements.get('toast-message');
				const toast = new Toast();
				const pre = document.createElement('pre');
				const code = document.createElement('code');
				pre.slot = 'content';
				code.textContent = JSON.stringify(data, null, 4);
				toast.backdrop = true;
				pre.append(code);
				toast.append(pre);
				document.body.append(toast);
				await toast.show();
				await toast.closed;
				toast.remove();
				target.reset();
				Router.go('');
			});

			this.shadowRoot.append(tmp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
