export default class HTMLCustomElement extends HTMLElement {
	get ready() {
		return new Promise(resolve => {
			if (this.shadowRoot !== null && this.shadowRoot.childElementCount === 0) {
				this.addEventListener('ready', () => resolve(this), {once: true});
			} else {
				resolve(this);
			}
		}).then(() => this);
	}

	get stylesLoaded() {
		return this.ready.then(async () => {
			if (this.shadowRoot !== null) {
				const stylesheets = this.shadowRoot.querySelectorAll('link[rel="stylesheet"][href]');
				await Promise.all([...stylesheets].map(async link => {
					if (! link.disabled && link.sheet === null) {
						await new Promise((res, rej) => {
							link.addEventListener('load', () => res(), {once: true});
							link.addEventListener('error', () => rej(`Error loading ${link.href}`), {once: true});
						});
					}
					// @TODO Wait for `@import` loading
					// link.sheet.rules.filter(rule => rule.type === CSSRule.IMPORT_RULE)
				}));
			}
			return this;
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
