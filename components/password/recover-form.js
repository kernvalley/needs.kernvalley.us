import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

customElements.define('password-recover-form', class HTMLPasswordRecoverFormElement extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.getTemplate('/components/password/recover-form.html').then(temp => {
			temp.querySelector('form').addEventListener('submit', async event => {
				event.preventDefault();
				const target = event.target;
				const body = new FormData(target);
				const resp = await fetch(new URL('./passwordreset/', ENDPOINT), {
					mode: 'cors',
					method: 'POST',
					headers: new Headers({
						Accept: 'application/json',
					}),
					body,
				});

				if (resp.ok) {
					await alert('If the account exists, an email has been sent. It expires in 6 hours.');
					Router.go('');
				} else {
					const err = await resp.json();
					if (err.hasOwnProperty('error')) {
						await alert(err.error.message);
					}
				}
			});

			this.shadowRoot.append(temp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
