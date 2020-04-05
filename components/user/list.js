import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('user-list', class HTMLUserListElement extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.getTemplate('/components/user/list.html').then(async temp => {
			const url = new URL('./user/', ENDPOINT);
			url.searchParams.set('token', await Router.user.token);

			const resp = await fetch(url, {
				mode: 'cors',
				headers: new Headers({
					Accept: 'application/json',
				}),
			});

			if (resp.ok) {
				const template = temp.querySelector('#user-list-item-template').content;
				const data = await resp.json();
				const link = new URL(location.href);
				const users = data.map(user => {
					const tmp = template.cloneNode(true);
					link.hash = `#users/${user.identifier}`;
					$('[data-field="user-link"]', tmp).attr({href: link.href});
					$('[data-field="name"]', tmp).text(user.person.name);
					$('[data-field="role"]', tmp).text(user.role.name);
					$('[data-field="image"]', tmp).attr({
						src: user.person.image.url,
						// width: user.person.image.width,
						// height: user.person.image.height,
					});
					return tmp;
				});
				temp.querySelector('.users-container').append(...users);
				this.shadowRoot.append(temp);
				this.dispatchEvent(new Event('ready'));
			} else {
				this.shadowRoot.append(await Router.getComponent('error-message', 'Error loading user data', true));
				this.dispatchEvent(new Event('ready'));
			}
		});
	}
});
