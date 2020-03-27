import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('request-list', class HTMLRequestListElement extends HTMLCustomElement {
	constructor({args}) {
		super();
		var uuid = args.length === 0 ? null : args[0];
		this.attachShadow({mode: 'open'});
		const user = Router.user;
		this.getTemplate('/components/request/list/list.html').then(async tmp => {
			const url = new URL('./needs/', ENDPOINT);
			const template = tmp.querySelector('template').content;
			if (typeof uuid === 'string') {
				url.searchParams.set('uuid', uuid);
			}
			url.searchParams.set('token', await user.token);
			const resp = await fetch(url, {mode: 'cors'});
			if (resp.ok) {
				const builder = request => {
					console.info({request});
					const temp = template.cloneNode(true);
					const img = new Image(32, 32);
					const created = new Date(request.created);
					img.classList.add('round');
					request.tags.forEach(tag => $(`.tags [data-tag="${CSS.escape(tag)}"]`, temp).unhide());
					console.info({uuid});
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
						$('[data-field="link"]', temp).attr({href: new URL(`/#request/${request.identifier}`, document.baseURI).href});
						$('.description-field', temp).hide();
					}
					return temp;
				};

				const data = await resp.json();
				console.info(data);
				if (data.hasOwnProperty('unassigned') && Array.isArray(data.unassigned)) {
					const {assigned = [], unassigned = []} = data;
					const items = [...assigned, ...unassigned].map(builder);

					this.shadowRoot.append(tmp, ...items);

				} else {
					const item = builder(data);
					this.shadowRoot.append(tmp, item);
				}

			}
			this.dispatchEvent(new Event('ready'));
		});
	}
});
