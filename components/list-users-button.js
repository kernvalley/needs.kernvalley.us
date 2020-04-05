import Router from '../js/Router.js';

customElements.define('list-users-button', class HTMLRequestNewButtonElement extends HTMLElement {
	async connectedCallback() {
		const user = Router.user;
		this.hidden = ! await user.can('listUser');

		user.addEventListener('login', async () => {
			this.hidden = ! await user.can('listUser');
		});

		user.addEventListener('logout', () => this.hidden = true);

		this.addEventListener('click', () => Router.go('users'));
	}
});
