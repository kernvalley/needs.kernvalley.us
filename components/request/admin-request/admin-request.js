import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

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
						}, 4000);
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
					const form = new FormData(event.target);
					const resp = await fetch(new URL('./needs/', ENDPOINT), {
						method: 'POST',
						mode: 'cors',
						headers: new Headers({
							'Content-Type': 'application/json',
						}),
						body: JSON.stringify({
							title: form.get('title'),
							tags: form.get('tags'),
							description: form.get('description'),
							token: await Router.user.token,
						}),
					});
					const Toast = customElements.get('toast-message');
					const toast = new Toast();
					const pre = document.createElement('pre');
					const code = document.createElement('code');
					pre.slot = 'content';
					code.textContent = JSON.stringify(await resp.json(), null, 4);
					toast.backdrop = true;
					pre.append(code);
					toast.append(pre);
					document.body.append(toast);
					await toast.show();
					await toast.closed;
					toast.remove();
					event.target.reset();
				});

				this.shadowRoot.append(tmp);
				this.dispatchEvent(new Event('ready'));
			});
		}
	});
}
