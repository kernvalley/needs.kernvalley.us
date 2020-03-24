export default class HTMLCustomElement extends HTMLElement {
	get ready() {
		return new Promise(resolve => {
			if (this.shadowRoot === null || this.shadowRoot.childElementCount === 0) {
				this.addEventListener('ready', () => resolve(), {once: true});
			}
		});
	}

	async getTemplate(url) {
		const resp = await fetch(url);
		const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
		const frag = document.createDocumentFragment();
		frag.append(...doc.head.children, ...doc.body.children);
		return frag;
	}
}
