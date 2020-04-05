import Router from './Router.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';
export const title = 'Kern River Valley Healthy Shopping Resouce';
export const DEBUG = location.hostname.endsWith('.netlify.live');
export const ENDPOINT = DEBUG ? 'http://localhost:8081' : 'https://b5774ac5-2d54-4d4a-953f-4d91327b9cf9.kernvalley.us';

export const routes = {
	login: async ({router, user}) => {
		if (! await user.loggedIn) {
			router.getComponent('login-form').then(async el => {
				document.title = `Login | ${title}`;
				const main = document.getElementById('main');
				[...main.children].forEach(el => el.remove());
				await el.ready;
				main.append(el);
			});
		} else {
			router.go('');
		}
	},
	messages: async ({router, user, args}) => {
		if (await user.can('viewMessage')) {
			const [uuid = null] = args;
			if (typeof uuid === 'string') {
				router.getComponent('message-details', uuid).then(async el => {
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			} else {
				router.getComponent('message-list').then(async el => {
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			}
		} else {
			await alert('You do not have permission for that');
			Router.go('');
		}
	},
	logout: async ({router, user}) => {
		await user.logOut();
		router.go('');
	},
	register: async ({user}) => {
		if (!await  user.loggedIn) {
			document.title = `Register | ${title}`;
			Router.getComponent('registration-form').then(async el => {
				const main = document.getElementById('main');
				[...main.children].forEach(el => el.remove());
				await el.ready;
				main.append(el);
			});
		} else {
			Router.go('');
		}
	},
	requests: async ({router, user, args}) => {
		const [uuid = null] = args;
		if (uuid === 'new') {
			if (await router.user.can('createNeed')) {
				router.getComponent('request-form').then(async el => {
					document.title = `Request Form | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			} else {
				await alert('You do not have permission for that');
				router.go('');
			}
		} else if (uuid === 'admin') {
			if (await router.user.can('adminCreateNeed')) {
				router.getComponent('admin-request-form').then(async el => {
					document.title = `Admin Request Form | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			} else {
				await alert('You do not have permission for that');
				router.go('requests', 'new');
			}
		} else if (uuid === null) {
			if (! await user.can('listNeed')) {
				await alert('You do not have permssion to access that');
				history.back();
			} else {
				router.getComponent('request-list').then(async el => {
					document.title = `Request Form | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			}
		} else {
			// @TODO check permission
			router.getComponent('request-details', uuid).then(async el => {
				document.title = `Request Details | ${title}`;
				const main = document.getElementById('main');
				[...main.children].forEach(el => el.remove());
				await el.ready;
				main.append(el);
			});
		}
	},
	contact: async ({router}) => {
		router.getComponent('contact-info').then(async el => {
			document.title = `Contact | ${title}`;
			const main = document.getElementById('main');
			[...main.children].forEach(el => el.remove());
			await el.ready;
			main.append(el);
		});
	},
	volunteers: async ({router, args}) => {
		const [uuid = null] = args;
		if (typeof uuid === 'string') {
			router.getComponent('volunteer-individual', uuid).then(async el => {
				document.title = `Volunteers | ${title}`;
				const main = document.getElementById('main');
				[...main.children].forEach(el => el.remove());
				await el.ready;
				main.append(el);
			});
		} else {
			router.getComponent('volunteer-all').then(async el => {
				document.title = `Volunteers | ${title}`;
				const main = document.getElementById('main');
				[...main.children].forEach(el => el.remove());
				await el.ready;
				main.append(el);
			});
		}
	},
	createPerson: async ({router, /*user*/}) => {
		// @TODO Check user permissions
		if (! await router.user.can('createPerson')) {
			await alert('You do not have permissions for that');
			await router.go('');
		} else {
			router.getComponent('person-new').then(async el => {
				document.title = `Create Person | ${title}`;
				const main = document.getElementById('main');
				[...main.children].forEach(el => el.remove());
				await el.ready;
				main.append(el);
			});
		}
	},
	'': async ({router}) => {
		router.getComponent('home-component').then(async el => {
			document.title = title;
			const main = document.getElementById('main');
			[...main.children].forEach(el => el.remove());
			await el.ready;
			main.append(el);
		});
	},
};
