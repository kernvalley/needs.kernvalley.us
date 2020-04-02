customElements.define('form-items', class HTMLFormItemsElement extends HTMLElement {
	constructor() {
		super();

		fetch('/components/request/itemized/items.html').then(async resp => {
			const html = await resp.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const tmp = document.createDocumentFragment();
			tmp.append(...doc.head.children, ...doc.body.children);

			tmp.querySelector('[data-action="create"]').addEventListener('click', async () => {
				const invalid = this.items.find(item => ! item.valid);
				if (invalid instanceof HTMLElement) {
					invalid.querySelector('.item-input').focus();
				} else {
					await customElements.whenDefined('form-item');
					const Item = customElements.get('form-item');
					this.querySelector('.item-container').append(new Item());
				}
			});
			this.append(tmp);
		});
	}

	toJSON() {
		return this.items;
	}

	get items() {
		return Array.from(this.querySelectorAll('form-item'));
	}

	get form() {
		return this.closest('form');
	}
});
