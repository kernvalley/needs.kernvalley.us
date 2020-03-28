import HTMLCustomElement from '../custom-element.js';
import Router from '../../js/Router.js';
import { ENDPOINT } from '../../js/consts.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('volunteer-all', class HTMLIndividualVolunteerElement extends HTMLCustomElement {
	constructor(uuid = null) {
		super();
		if (typeof uuid !== 'string') {
			this.attachShadow({mode: 'open'});
			this.getTemplate('/components/volunteer/all.html').then(async tmp => {
				const url = new URL('./volunteers/', ENDPOINT);
				const resp = await fetch(url, {
					mode: 'cors',
					headers: new Headers({
						Accept: 'application/json',
					}),
				});

				if (resp.ok) {
					const users = await resp.json();
					const template = tmp.querySelector('#volunteer-template').content;
					console.table(users);
					const link = new URL(location.href);
					const items = users.map(user => {
						const item = template.cloneNode(true);
						link.hash = `#/volunteers/${user.identifier}`;
						$('[data-field="name"]', item).text(user.name);
						$('[data-field="role"]', item).text(user.role);
						$('[data-field="image"]', item).attr({src: user.image});
						$('[data-field="link"]', item).attr({href: link.href});
						return item;
					});
					tmp.append(...items);
					this.shadowRoot.append(tmp);
					this.dispatchEvent(new Event('ready'));
				} else {
					this.shadowRoot.append(await Router.getComponent('error-message', 'Error loading user data', true));
					this.dispatchEvent(new Event('ready'));
				}
			});
		} else {
			Router.go('volunteers', uuid);
		}
	}
});
