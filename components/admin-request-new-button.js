import Router from '../js/Router.js';

customElements.define('admin-request-new-button', class HTMLRequestNewButtonElement extends HTMLElement {
	async connectedCallback() {
		const user = Router.user;
		this.hidden = ! await user.can('adminCreateNeed');

		user.addEventListener('login', async () => {
			this.hidden = ! await user.can('adminCreateNeed');
		});

		user.addEventListener('logout', () => this.hidden = true);

		this.addEventListener('click', () => Router.go('requests/admin'));
	}
});
