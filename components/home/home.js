import HTMLCustomElement from '../custom-element.js';

customElements.define('home-component', class HTMLHomeComponent extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		this.getTemplate('/components/home/home.html').then(async tmp => {
			this.shadowRoot.append(tmp);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
