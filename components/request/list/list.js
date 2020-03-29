import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('request-list', class HTMLRequestListElement extends HTMLCustomElement {
	constructor() {
		super();
		this.attachShadow({mode: 'open'});
		const user = Router.user;
		this.getTemplate('/components/request/list/list.html').then(async tmp => {
			const url = new URL('./needs/', ENDPOINT);
			const template = tmp.querySelector('template').content;
			url.searchParams.set('token', await user.token);
			const resp = await fetch(url, {mode: 'cors'});

			if (resp.ok) {
				if (resp.status === 204) {
					this.shadowRoot.append(await Router.getComponent('error-message', 'No Results to display', true));
					this.dispatchEvent(new Event('ready'));
				} else {
					const builder = request => {
						const temp = template.cloneNode(true);
						const img = new Image(32, 32);
						const created = new Date(request.created);
						img.classList.add('round');
						request.tags.forEach(tag => $(`.tags [data-tag="${CSS.escape(tag)}"]`, temp).unhide());
						$('[data-tags]', temp).data({tags: request.tags.join(' ')});
						$('[data-request-id]', temp).data({requestId: request.identifier});
						$('[data-field="json"]', temp).text(JSON.stringify(request, null, 4));
						$('[data-field="title"]', temp).text(request.title);
						$('[data-field="user"]', temp).text(request.user.name);
						$('[data-field="user"]', temp).data({userId: request.user.identifier});
						$('[data-field="area"]', temp).text(request.user.address.addressLocality);
						$('[data-field="user-image"]', temp).attr({src: request.user.image.url});
						$('[data-field="created"]', temp).text(created.toLocaleString());
						if (typeof uuid === 'string') {
							$('[data-field="link"]', temp).hide();
							$('[data-field="description"]', temp).text(request.description);
						} else {
							$('[data-field="link"]', temp).attr({href: new URL(`/#requests/${request.identifier}`, document.baseURI).href});
							$('.description-field', temp).hide();
						}
						return temp;
					};

					const data = await resp.json();
					const items = data.map(builder);
					tmp.querySelector('.requests-container').append(...items);
					this.shadowRoot.append(tmp);
					this.dispatchEvent(new Event('ready'));
					// @ TODO Handle invalid data
				}
			}
		});
	}
});
