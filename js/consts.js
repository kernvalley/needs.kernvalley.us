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
	password: async ({user, router, args}) => {
		const [action = null, token = null] = args;
		switch (action) {
		case 'forgot':
			if (await user.loggedIn) {
				alert('You are already logged in');
				// @TODO Impelment change password form
				router.go('password', 'change');
			} else {
				router.getComponent('password-recover-form').then(async el => {
					document.title = `Forgot Password | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			}
			break;

		case 'reset':
			if (await user.loggedIn) {
				alert('You are already logged in');
				// @TODO Impelment change password form
				// router.go('password', 'change');
				router.go('');
			} else if (typeof token !== 'string' || token === '') {
				await alert('No reset token');
				router.go('login');
			} else {
				router.getComponent('password-reset-form', token).then(async el => {
					document.title = `Reset Password | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			}
			break;
		default:
			console.error(`Invalid action: ${action}`);
			router.go('login');
		}
	},
	users: async ({router, user, args}) => {
		if (! await user.can('listUser')) {
			await alert('You do not have permission for that');
			router.go('');
		} else {
			const [uuid = null] = args;

			if (typeof uuid === 'string') {
				router.getComponent('user-details', uuid).then(async el => {
					document.title = `User Details | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			} else {
				router.getComponent('user-list').then(async el => {
					document.title = `Users | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			}
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
