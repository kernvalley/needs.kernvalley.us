customElements.define('error-message', class HTMLErrorMessageElement extends HTMLElement {
	constructor(msg = 'An unknown error occured', addStyle = false) {
		super();
		this.classList.add('block', 'error', 'background-error', 'color-error', 'card');
		this.textContent = msg;
		this.addStyle = addStyle;
	}

	connectedCallback() {
		if (this.addStyle) {
			this.prepend(this.stylesheet);
		}
	}

	get addStyle() {
		return this.hasAttribute('addstyle');
	}

	set addStyle(val) {
		this.toggleAttribute('addstyle', val);
	}

	get stylesheet() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = new URL('css/error-message.css', document.baseURI);
		return link;
	}
});
