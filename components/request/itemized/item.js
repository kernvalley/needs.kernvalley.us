customElements.define('form-item', class HTMLFormItemElement extends HTMLElement {
	constructor() {
		super();

		fetch('/components/request/itemized/item.html').then(async resp => {
			const html = await resp.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const tmp = document.createDocumentFragment();
			tmp.append(...doc.head.children, ...doc.body.children);

			tmp.querySelector('[data-action="delete"]').addEventListener('click', async () => {
				if (await confirm('Are you sure you want to delete this item?')) {
					this.remove();
				}
			});
			this.append(tmp);
			this.addEventListener('keypress', event => {
				if (event.keyCode === 13) {
					event.preventDefault();
					if (this.valid) {
						const Item = customElements.get(this.tagName.toLowerCase());
						const item = new Item();
						this.insertAdjacentElement('afterend', item);
						item.querySelector('[name="item[]"]').focus();
					}
				}
			});
		});
	}

	toJSON() {
		return {
			quantity: this.qty,
			item: this.item,
		};
	}

	get item() {
		return this.querySelector('input[name="item[]"]').value;
	}

	set item(val) {
		return this.querySelector('input[name="item[]"]').value = val;
	}

	get qty() {
		return this.querySelector('input[name="qty[]"]').valueAsNumber;
	}

	set qty(val) {
		this.querySelector('input[name="qty[]"]').value = val;
	}

	get valid() {
		return this.item !== '' && ! Number.isNaN(this.qty);
	}
});
