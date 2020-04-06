import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('password-reset-form', class HTMLPasswordResetFormElement extends HTMLCustomElement {
	constructor(token = null) {
		super();
		this.attachShadow({mode: 'open'});
		if (typeof token !== 'string' || token === '') {
			alert('No token given').then(() => Router.go('login'));
		}
		this.getTemplate('/components/password/reset-form.html').then(temp => {
			const url = new URL('./passwordreset/', ENDPOINT);
			url.searchParams.set('token', token);
			fetch(url, {
				mode: 'cors',
				headers: new Headers({
					Accept: 'application/json',
				}),
			}).then(async resp => {
				const data = await resp.json();

				if (resp.ok) {
					if (this.shadowRoot.childElementCount === 0) {
						temp.querySelector('input[name="email"]').value = data.email;
						$('[data-field="image"]', temp).attr({src: data.image.url});
						$('[data-field="name"]', temp).text(data.name);
					} else {
						this.shadowRoot.querySelector('input[name="email"]').value = data.email;
						$('[data-field="image"]', this.shadowRoot).attr({src: data.image.url});
						$('[data-field="name"]', this.shadowRoot).text(data.name);
					}
				} else {
					if (data.hasOwnProperty('error')) {
						throw new Error(data.error.message);
					} else {
						throw new Error(resp.statusText);
					}
				}
			}).catch(async err => {
				await alert(err.message);
				Router.go('login');
			});

			temp.querySelector('input[name="token"]').value = token;
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
					await alert('Password successfully changed');
					Router.go('login');
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
