import Router from '../js/Router.js';
import { confirm } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

customElements.define('logout-button', class HTMLLoginButton extends HTMLElement {
	constructor() {
		super();
		const user = Router.user;
		user.addEventListener('login', () => this.hidden = false);
		user.addEventListener('logout', () => this.hidden = true);

		this.addEventListener('click', async () => {
			if (await confirm(this.message)) {
				Router.go('logout');
			}
		});
	}

	async connectedCallback() {
		this.hidden = ! await Router.user.loggedIn;
	}

	get message() {
		return this.getAttribute('message') || 'Are you sure you wish to logout?';
	}

	set message(val) {
		this.setAttribute('message', val);
	}
});
