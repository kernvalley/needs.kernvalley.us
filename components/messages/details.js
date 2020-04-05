import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { confirm, alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

customElements.define('message-details', class HTMLMessagesListElement extends HTMLCustomElement {
	constructor(uuid = null) {
		super();
		this.attachShadow({mode: 'open'});
		if (typeof uuid !== 'string') {
			this.dispatchEvent(new Event('ready'));
			Router.go('messages');
		} else {
			this.identifier = uuid;

			this.getTemplate('/components/messages/details.html').then(async temp => {
				const url = new URL('./contact/', ENDPOINT);
				url.searchParams.set('uuid', uuid);
				url.searchParams.set('token', await Router.user.token);
				const resp = await fetch(url, {
					mode: 'cors',
					headers: new Headers({
						Accept: 'application/json',
					}),
				});

				if (resp.ok) {
					const msg = await resp.json();
					$('[data-field="name"]', temp).text(msg.name);
					$('[data-field="created"]', temp).text(new Date(msg.created).toLocaleString());
					$('[data-field="subject"]', temp).text(msg.subject);
					$('[data-field="message"]', temp).text(msg.message);
					$('[data-field="telephone-uri"]', temp).attr({href: `tel:${msg.telephone}`});
					$('[data-field="telephone"]', temp).text(msg.telephone.replace('+1', ''));
					$('[data-field="email-uri"]', temp).attr({href: `mailto:${msg.email}`});
					$('[data-field="email"]', temp).text(msg.email);

					if (await Router.user.can('deleteMessage')) {
						$('[data-action="delete"]', temp).unhide();
						$('[data-action="delete"]', temp).click(async () => {
							if (await confirm('Are you sure you want to delete this message')) {
								const url = new URL('./contact/', ENDPOINT);
								url.searchParams.set('token', await Router.user.token);
								url.searchParams.set('uuid', this.identifier);
								const resp = await fetch(url, {
									mode: 'cors',
									method: 'DELETE',
								});

								if (resp.ok) {
									await alert('Message deleted');
									Router.go('messages');
								} else {
									const err = await resp.json();
									if (err.hasOwnProperty('error')) {
										await alert(err.error.message);
									} else {
										await alert('An unknown error occured');
									}
								}
							}
						}, {
							passive: true,
						});
					}

					this.shadowRoot.append(temp);
					this.dispatchEvent(new Event('ready'));
				} else {
					this.shadowRoot.append(await Router.getComponent('error-message', 'No messages to display', true));
					this.dispatchEvent(new Event('ready'));
				}
			});

		}
	}

	async attributeChangedCallback(name) {
		await this.ready;
		switch(name) {
		case 'identifier':
			console.info(this.identifier);
			break;

		default:
			throw new Error(`Unhandled attribute changed: ${name}`);
		}
	}

	get identifier() {
		return this.getAttribute('identifier');
	}

	set identifier(val) {
		this.setAttribute('identifier', val);
	}

	static get observedAttributes() {
		return [
			'identifier',
		];
	}
});
