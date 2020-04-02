import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { confirm, alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

if (('customElements' in window) && customElements.get('admin-request-form') === undefined) {
	customElements.define('admin-request-form', class HTMLAdminRequestForm extends HTMLCustomElement {
		constructor() {
			super();
			this.attachShadow({mode: 'open'});

			this.getTemplate('/components/request/admin-request/admin-request.html').then(async tmp => {
				const token = await Router.user.token;
				let debouncer = null;

				$('[list="users-list"]', tmp).input(async function() {
					if (this.value !== '') {
						debouncer = setTimeout(() => {
							if (typeof debouncer === 'number') {
								clearTimeout(debouncer);
								debouncer = null;
							}

							const url = new URL('./Person/', ENDPOINT);
							url.searchParams.set('token', token);
							url.searchParams.set('name', this.value);

							fetch(url, {mode: 'cors'}).then(async resp => {
								if (resp.ok) {
									const users = await resp.json();
									const opts = users.map(user => {
										const opt = document.createElement('option');
										opt.value = user.name;
										return opt;
									});
									[...this.list.options].forEach(el => el.remove());
									this.list.append(...opts);
								}
							});
						}, 600);
					} else {
						if (typeof debouncer === 'number') {
							debouncer = null;
							clearTimeout(debouncer);
						}

						[...this.list.options].forEach(el => el.remove());
					}
				});

				$('form', tmp).submit(async event => {
					event.preventDefault();
					const target = event.target;
					const form = new FormData(target);
					const resp = await fetch(new URL('./needs/', ENDPOINT), {
						method: 'POST',
						mode: 'cors',
						headers: new Headers({
							'Content-Type': 'application/json',
						}),
						body: JSON.stringify({
							user: form.get('user'),
							title: form.get('title'),
							tags: form.get('tags'),
							description: form.get('description'),
							items: this.items,
							token: await Router.user.token,
						}),
					});

					if (resp.ok) {
						target.reset();

						if (! await confirm('Request created. Create another?')) {
							Router.go('requests');
						}
					} else {
						const err = await resp.json();
						if (err.hasOwnProperty('error')) {
							await alert(err.error.message);
						} else {
							await alert('An unknown error occured');
						}
					}
				});

				this.shadowRoot.append(tmp);
				this.dispatchEvent(new Event('ready'));
			});
		}

		get items() {
			return this.shadowRoot.querySelector('form-items').items;
		}
	});
}
