import Router from '../js/Router.js';

customElements.define('create-person-button', class HTMLRequestNewButtonElement extends HTMLElement {
	async connectedCallback() {
		const user = Router.user;
		this.hidden = ! await user.can('createPerson');

		user.addEventListener('login', async () => {
			this.hidden = ! await user.can('createPerson');
		});

		user.addEventListener('logout', () => this.hidden = true);

		this.addEventListener('click', () => Router.go('createPerson'));
	}
});
