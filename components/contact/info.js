import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';
customElements.define('contact-info', class HTMLRequestForm extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});

		this.getTemplate('/components/contact/info.html').then(async tmp => {
			tmp.querySelector('form').addEventListener('submit', async event => {
				const target = event.target;
				event.preventDefault();
				const form = new FormData(event.target);
				const resp = await fetch(new URL('./contact/', ENDPOINT), {
					method: 'POST',
					mode: 'cors',
					body: JSON.stringify(Object.fromEntries(form.entries())),
					headers: new Headers({
						Accept: 'application/json',
						'Content-Type': 'application/json',
					})
				});

				if (resp.ok) {
					await alert('Message Sent');
					target.reset();
				} else {
					await alert('Error sending message. Please try another means.');
				}
			});

			this.shadowRoot.append(tmp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
