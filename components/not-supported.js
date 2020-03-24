customElements.define('not-supported', class HTMLNotSupportedElement extends HTMLElement {
	connectedCallback() {
		this.remove();
	}
});
