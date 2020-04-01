import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

customElements.define('person-new', class HTMLPersonElement extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.getTemplate('/components/person/new.html').then(async temp => {
			$('form', temp).submit(async event => {
				event.preventDefault();
				const form = new FormData(event.target);

				const resp = await fetch(new URL('./Person/', ENDPOINT), {
					mode: 'cors',
					method: 'POST',
					headers: new Headers({
						Accept: 'application/json',
						'Content-Type': 'application/json',
					}),
					body: JSON.stringify({
						token: await Router.user.token,
						person: {
							name: form.get('name'),
							email: form.get('email') || null,
							telephone: form.get('telephone'),
							address: {
								streetAddress: form.get('streetAddress'),
								addressLocality: form.get('addressLocality'),
								addressRegion: form.get('addressRegion'),
								postalCode: form.get('postalCode'),
								addressCountry: form.get('addressCountry'),
							}
						}
					})
				});

				if (resp.ok) {
					await alert('New person created');
					Router.go('requests', 'admin');
				} else {
					const err = await resp.json();
					if (err.hasOwnProperty('error')) {
						await alert(err.error.message);
					} else {
						await alert('An unknown error occurred');
					}
				}
			});
			this.shadowRoot.append(temp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
