import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

customElements.define('request-list', class HTMLRequestListElement extends HTMLCustomElement {
	constructor(uuid = null) {
		super();
		this.attachShadow({mode: 'open'});
		const user = Router.user;
		this.getTemplate('/components/request/list/list.html').then(async tmp => {
			const url = new URL('/requests.json', document.baseURI);
			const template = tmp.querySelector('template').content;
			url.searchParams.set('uuid', uuid);
			url.searchParams.set('token', user.token);
			const resp = await fetch(url, {mode: 'cors'});
			const requests = await resp.json();
			const items = requests.map(request => {
				const temp = template.cloneNode(true);
				const img = new Image(32, 32);
				const created = new Date(request.created);
				img.classList.add('round');
				request.tags.forEach(tag => $(`.tags [data-tag="${CSS.escape(tag)}"]`, temp).unhide());
				$('[data-tags]', temp).data({tags: request.tags.join(' ')});
				$('[data-request-id]', temp).data({requestId: request.uuid});
				$('[data-field="json"]', temp).text(JSON.stringify(request, null, 4));
				$('[data-field="title"]', temp).text(request.title);
				$('[data-field="user"]', temp).text(request.user.name);
				$('[data-field="user"]', temp).data({userId: request.user.uuid});
				$('[data-field="area"]', temp).text(request.area);
				$('[data-field="user-image"]', temp).attr({src: request.user.image});
				$('[data-field="created"]', temp).text(created.toLocaleString());
				$('[data-field="link"]', temp).attr({href: new URL(`/#request/${request.uuid}`, document.baseURI).href});
				return temp;
			});
			// this.append(...items);
			this.shadowRoot.append(tmp, ...items);
			this.dispatchEvent(new Event('ready'));
		});
	}
});
