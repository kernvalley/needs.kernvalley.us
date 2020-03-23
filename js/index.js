import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://cdn.kernvalley.us/components/toast-message.js';
import { $, ready } from 'https://cdn.kernvalley.us/js/std-js/functions.js';

document.documentElement.classList.replace('no-js', 'js');
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

ready().then(async () => {
	$('form').submit(async event => {
		event.preventDefault();
		const data = Object.fromEntries(new FormData(event.target).entries());
		await customElements.whenDefined('toast-message');
		const Toast = customElements.get('toast-message');
		const toast = new Toast();
		const pre = document.createElement('pre');
		const code = document.createElement('code');
		console.info(data);
		pre.slot = 'content';
		code.textContent = JSON.stringify(data, null, 4);
		pre.append(code);
		toast.append(pre);
		document.body.append(toast);
		await toast.show();
		await toast.closed;
		toast.remove();
		event.target.reset();
	}, {
		passive: false,
		capture: true,
	});
});
