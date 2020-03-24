import Router from '../js/Router.js';

customElements.define('register-button', class HTMLLoginButton extends HTMLElement {
	constructor() {
		super();
		const user = Router.user;
		user.addEventListener('login', () => this.hidden = true);
		user.addEventListener('logout', () => this.hidden = false);
		this.addEventListener('click', () => Router.go('register'));
	}

	async connectedCallback() {
		this.hidden = await Router.user.loggedIn;
	}
});
