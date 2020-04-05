import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('message-list', class HTMLMessagesListElement extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.getTemplate('/components/messages/list.html').then(async temp => {
			const template = temp.querySelector('#message-preview-template').content;
			const list = temp.querySelector('[data-field="messages"]');
			const url = new URL('./contact/', ENDPOINT);
			url.searchParams.set('token', await Router.user.token);
			const resp = await fetch(url, {
				mode: 'cors',
				headers: new Headers({
					Accept: 'application/json',
				}),
			});

			if (resp.ok) {
				const data = await resp.json();
				const link = new URL(location.href);
				let n = 0;
				const msgs = data.map(msg => {
					const tmp = template.cloneNode(true);
					link.hash = `#messages/${msg.identifier}`;
					$('.message-item', tmp).toggleClass('message-read', msg.opened);
					$('.message-item', tmp).toggleClass('message-odd', n++ % 2 === 0);
					$('[data-field="name"]', tmp).text(msg.name);
					$('[data-field="created"]', tmp).text(new Date(msg.created).toLocaleString());
					$('[data-field="subject"]', tmp).text(msg.subject);
					$('[data-field="message-url"]', tmp).attr({href: link.href});
					return tmp;
				});

				list.append(...msgs);
				this.shadowRoot.append(temp);
				this.dispatchEvent(new Event('ready'));
			} else {
				this.shadowRoot.append(await Router.getComponent('error-message', 'No messages to display', true));
				this.dispatchEvent(new Event('ready'));
			}
		});
	}
});
