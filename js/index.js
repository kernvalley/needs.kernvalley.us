import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/js/std-js/deprefixer.js';
import 'https://unpkg.com/@webcomponents/custom-elements@1.3.2/custom-elements.min.js';
import { routes } from './consts.js';
import Router from './Router.js';
import './components.js';
import { ready, $ } from 'https://cdn.kernvalley.us/js/std-js/functions.js';
import * as actions from './actions.js';

document.documentElement.classList.replace('no-js', 'js');
document.documentElement.classList.toggle('no-details', document.createElement('details') instanceof HTMLUnknownElement);
document.documentElement.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

Router.routes = routes;
ready().then(async () => {
	Router.init();
	$('[data-action]').click(async function(event) {
		const action = this.dataset.action;
		if (actions[action] instanceof Function) {
			actions[action](event);
		}
	});
});
