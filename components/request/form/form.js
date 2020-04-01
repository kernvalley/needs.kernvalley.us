import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

if (('customElements' in window) && customElements.get('request-form') === undefined) {
	customElements.define('request-form', class HTMLRequestForm extends HTMLCustomElement {
		constructor() {
			super();
			this.attachShadow({mode: 'open'});

			this.getTemplate('/components/request/form/form.html').then(async tmp => {
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
							title: form.get('title'),
							tags: form.get('tags'),
							description: form.get('description'),
							token: await Router.user.token,
						}),
					});

					if (resp.ok) {
						target.reset();
					} else {
						const err = await resp.json();
						if (err.hasOwnProperty('error')) {
							await alert(err.error.message);
						} else {
							await alert('An unknown error occured submitting your request');
						}
					}
				});

				this.shadowRoot.append(tmp);
				this.dispatchEvent(new Event('ready'));
			});
		}
	});
}
