import HTMLCustomElement from '../custom-element.js';
import { ENDPOINT } from '../../js/consts.js';
import Router from '../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('user-details', class HTMLUserListElement extends HTMLCustomElement {
	constructor(uuid = null) {
		super();
		this.attachShadow({mode: 'open'});

		if (typeof uuid !== 'string') {
			Router.go('users');
		} else {
			this.identifier = uuid;

			this.getTemplate('/components/user/details.html').then(async temp => {
				const url = new URL('./user/', ENDPOINT);
				url.searchParams.set('token', await Router.user.token);
				url.searchParams.set('uuid', this.identifier);

				const resp = await fetch(url, {
					mode: 'cors',
					headers: new Headers({
						Accept: 'application/json',
					}),
				});

				if (resp.ok) {
					const user = await resp.json();

					fetch(new URL('./roles/', ENDPOINT), {
						mode: 'cors',
						headers: new Headers({
							Accept: 'application/json',
						}),
					}).then(async resp => {
						if (resp.ok) {
							const roles = await resp.json();
							const select = this.shadowRoot.childElementCount === 0
								? temp.querySelector('select[data-field="role"]')
								: this.shadowRoot.querySelector('select[data-field="role"]');
							roles.forEach(role => {
								const opt = document.createElement('option');
								opt.value = role.id;
								opt.textContent = role.name;
								select.append(opt);
							});
							select.value = user.role.id;
							select.addEventListener('change', async ({target}) => {
								const resp = await fetch(new URL('./user/', ENDPOINT), {
									mode: 'cors',
									method: 'POST',
									headers: new Headers({
										Accept: 'application/json',
										'Content-Type': 'application/json',
									}),
									body: JSON.stringify({
										user: this.identifier,
										token: await Router.user.token,
										role: parseInt(target.value),
									})
								});

								if (! resp.ok) {
									const err = await resp.json();
									if (err.hasOwnProperty('error')) {
										await alert(err.error.message);
										throw new Error(err.error.message);
									}
								}
							}, {
								passive: true,
							});
						} else {
							throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
						}
					}).catch(console.error);
					$('[data-field="name"]', temp).text(user.person.name);
					// $('[data-field="role"]', temp).text(user.role.name);
					$('[data-field="image"]', temp).attr({
						src: user.person.image.url,
						// width: user.person.image.width,
						// height: user.person.image.height,
					});
					this.shadowRoot.append(temp);
					this.dispatchEvent(new Event('ready'));
				} else {
					this.shadowRoot.append(await Router.getComponent('error-message', 'Error loading user data', true));
					this.dispatchEvent(new Event('ready'));
				}
			});
		}
	}

	get identifier() {
		return this.getAttribute('identifier');
	}

	set identifier(val) {
		this.setAttribute('identifier', val);
	}

	async attributeChangedCallback(name) {
		await this.ready;

		switch(name) {
		case 'identifier':
			console.info(this.indetifier);
			break;

		default:
			throw new Error(`Unhandled attribute changed: ${name}`);
		}
	}

	static get observedAttributes(){
		return [
			'identifier',
		];
	}
});
