import Router from '../js/Router.js';

customElements.define('request-list-button', class HTMLRequestNewButtonElement extends HTMLElement {
	async connectedCallback() {
		const user = Router.user;
		this.hidden = ! await user.loggedIn;

		user.addEventListener('login', async () => {
			this.hidden = ! await user.can('listNeed');
		});

		user.addEventListener('logout', () => this.hidden = true);

		this.addEventListener('click', () => Router.go('requests/'));
	}
});
