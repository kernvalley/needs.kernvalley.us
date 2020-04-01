import HTMLCustomElement from '../custom-element.js';
import Router from '../../js/Router.js';
import { ENDPOINT } from '../../js/consts.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('volunteer-individual', class HTMLIndividualVolunteerElement extends HTMLCustomElement {
	constructor(uuid = null) {
		super();
		if (typeof uuid === 'string') {
			this.attachShadow({mode: 'open'});
			this.getTemplate('/components/volunteer/individual.html').then(async tmp => {
				const url = new URL('./volunteers/', ENDPOINT);
				url.searchParams.set('uuid', uuid);
				const resp = await fetch(url, {
					mode: 'cors',
					headers: new Headers({
						Accept: 'application/json',
					}),
				});

				if (resp.ok) {
					const user = await resp.json();
					console.log(user);
					$('[data-field="name"]', tmp).text(user.name);
					$('[data-field="role"]', tmp).text(user.role);
					$('[data-field="image"]', tmp).attr({src: user.image});
					this.shadowRoot.append(tmp);
					this.dispatchEvent(new Event('ready'));
				} else {
					this.shadowRoot.append(await Router.getComponent('error-message', 'Error loading user data', true));
					this.dispatchEvent(new Event('ready'));
				}
			});
		} else {
			Router.go('volunteers');
		}
	}
});
