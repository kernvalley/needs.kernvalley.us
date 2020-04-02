import HTMLCustomElement from '../../custom-element.js';
import { ENDPOINT } from '../../../js/consts.js';
import Router from '../../../js/Router.js';
import { $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import { alert} from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';

customElements.define('request-details', class HTMLRequestDetailsElement extends HTMLCustomElement {
	constructor(uuid = null) {
		super();
		if (typeof uuid !== 'string') {
			Router.go('requests');
		} else {
			this.attachShadow({mode: 'open'});
			this.getTemplate('/components/request/details/details.html').then(async temp => {
				const url = new URL('./needs/', ENDPOINT);
				const itemTemplate = temp.querySelector('#list-item-template').content;
				url.searchParams.set('token', await Router.user.token);
				url.searchParams.set('uuid', uuid);

				const resp = await fetch(url, {
					mode: 'cors',
					header: new Headers({
						Accept: 'application/json',
					}),
				});
				const request = await resp.json();
				const img = new Image(32, 32);
				const created = new Date(request.created);
				if (Array.isArray(request.items)) {
					const items = request.items.map(item => {
						const tmp = itemTemplate.cloneNode(true);
						$('[data-field="item-qty"]', tmp).text(item.quantity);
						$('[data-field="item-text"]', tmp).text(item.item);
						return tmp;
					});
					console.info(items);
					temp.querySelector('[data-field="list-items"]').append(...items);
				}

				img.classList.add('round');
				request.tags.forEach(tag => $(`.tags [data-tag="${CSS.escape(tag)}"]`, temp).unhide());

				$('#request-upload-btn', temp).change(async ({target}) => {
					if (target.files.length === 1) {
						const body = new FormData();
						body.set('token', await Router.user.token);
						body.set('uuid', request.identifier);
						body.set('upload', target.files.item(0), target.files.item(0).name);

						try {
							const resp = await fetch(new URL('./needs/', ENDPOINT), {
								method: 'POST',
								mode: 'cors',
								body,
							});

							if (resp.ok) {
								await alert('Image updated');
								target.value = null;
							} else {
								const err = await resp.json();
								if ('error' in err) {
									throw new Error(err.error.message);
								} else {
									throw new Error('Unknown error uploading');
								}
							}
						} catch (err) {
							console.error(err);
							await alert(err.message);
						}
					}
				});

				$('[data-tags]', temp).data({tags: request.tags.join(' ')});

				temp.querySelector('select[name="status"]').value = request.status;

				$('select[name="status"]', temp).change(async event => {
					const target = event.target;
					const resp = await fetch(new URL('./needs/', ENDPOINT), {
						method: 'POST',
						mode: 'cors',
						headers: new Headers({
							'Content-Type': 'application/json',
						}),
						body: JSON.stringify({
							token: await Router.user.token,
							uuid: request.identifier,
							status: target.value,
						}),
					});

					if (! resp.ok) {
						await alert('Error updating status');
					}
				});
				$('[data-request-id]', temp).data({requestId: request.identifier});
				$('[data-field="title"]', temp).text(request.title);
				$('[data-field="description"]', temp).text(request.description);
				$('[data-field="user"]', temp).text(request.user.name);
				$('[data-field="user"]', temp).data({userId: request.user.identifier});
				$('[data-field="streetAddress"]', temp).text(request.user.address.streetAddress);
				$('[data-field="addressRegion"]', temp).text(request.user.address.addressRegion);
				$('[data-field="addressLocality"]', temp).text(request.user.address.addressLocality);
				$('[data-field="postalCode"]', temp).text(request.user.address.postalCode);
				$('[data-field="addressCountry"]', temp).text(request.user.address.addressCoutry);
				$('[data-field="user-image"]', temp).attr({src: request.user.image.url});
				$('[data-field="email-link"]', temp).attr({href: `mailto:${request.user.email}`});
				$('[data-field="email-addr"]', temp).text(request.user.email);
				$('[data-field="tel-link"]', temp).attr({href: `tel:${request.user.telephone}`});
				$('[data-field="tel-num"]', temp).text(request.user.telephone);
				$('[data-field="created"]', temp).text(created.toLocaleString());

				if (typeof request.user.address.url === 'string') {
					$('[data-field="addr-url"]', temp).attr({href: request.user.address.url});
				} else {
					$('[data-field="addr-url"]', temp).remove();
				}

				if (request.assigned === null) {
					$('button[data-field="claim"]', temp).click(async ({target}) => {
						const {identifier} = await Router.user.person;
						const resp = await fetch(new URL('./needs/', ENDPOINT), {
							method: 'POST',
							mode: 'cors',
							headers: new Headers({
								'Content-Type': 'application/json',
							}),
							body: JSON.stringify({
								assignee: identifier,
								token: await Router.user.token,
								uuid: request.identifier,
							}),
						});

						if (resp.ok) {
							target.closest('button').remove();
						} else {
							alert('Error claiming request');
						}
					});
				} else {
					$('button[data-field="claim"]', temp).remove();
				}
				this.shadowRoot.append(temp);
				this.dispatchEvent(new Event('ready'));
			});
		}
	}
});
