import HTMLCustomElement from '../custom-element.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('registration-form', class HTMLRegistrationForm extends HTMLCustomElement {
	constructor() {
		super();
		const user = Router.user;
		this.attachShadow({mode: 'open'});

		this.getTemplate('/components/registration/form.html').then(async tmp => {
			$('form', tmp).submit(async event => {
				event.preventDefault();
				const target = event.target;
				const form = new FormData(event.target);
				const resp = await user.register({
					username: form.get('username'),
					password: form.get('password'),
					name: form.get('name'),
					telephone: form.get('telephone'),
					streetAddress: form.get('streetAddress'),
					addressLocality: form.get('addressLocality'),
					addressRegion: form.get('addressRegion'),
					postalCode: form.get('postalCode'),
				});
				const Toast = customElements.get('toast-message');
				const toast = new Toast();
				const pre = document.createElement('pre');
				const code = document.createElement('code');
				pre.slot = 'content';
				code.textContent = JSON.stringify(resp, null, 4);
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
