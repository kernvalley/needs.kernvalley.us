import HTMLCustomElement from '../custom-element.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';
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

				if (await user.logIn({
					email: form.get('email'),
					password: form.get('password'),
				})) {
					target.reset();
					Router.go('');
				} else {
					await alert('Error logging in. Check email & password.');
					target.querySelector('[type="[password]"').focus();
				}
			});

			this.shadowRoot.append(tmp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
