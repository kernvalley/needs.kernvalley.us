import Router from '../js/Router.js';

customElements.define('messages-button', class HTMLMessagesButton extends HTMLElement {
	async connectedCallback() {
		const user = Router.user;
		this.hidden = ! await user.can('viewMessage');

		user.addEventListener('login', async () => {
			this.hidden = ! await user.can('viewMessage');
		});

		user.addEventListener('logout', () => this.hidden = true);

		this.addEventListener('click', () => Router.go('messages'));
	}
});
