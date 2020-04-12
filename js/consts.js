import Router from './Router.js';
import { alert } from 'https://cdn.kernvalley.us/js/std-js/asyncDialog.js';
export const title = 'Kern River Valley Healthy Shopping Resouce';
export const DEBUG = location.hostname.endsWith('.netlify.live');
export const ENDPOINT = DEBUG ? 'http://localhost:8081' : 'https://b5774ac5-2d54-4d4a-953f-4d91327b9cf9.kernvalley.us';

export const routes = {
	login: async ({router, user}) => {
		if (! await user.loggedIn) {
			document.body.classList.add('no-pointer-events');
			router.getComponent('login-form').then(async el => {
				const main = document.getElementById('main');
				const els = [...main.children];
				el.hidden = true;
				main.append(el);
				await el.ready;
				await el.stylesLoaded;
				els.forEach(el => el.remove());
				el.hidden = false;
				document.title = `Login | ${title}`;
				document.body.classList.remove('no-pointer-events');
			});
		} else {
			router.go('');
		}
	},
	messages: async ({router, user, args}) => {
		if (await user.can('viewMessage')) {
			const [uuid = null] = args;
			document.body.classList.add('no-pointer-events');

			if (typeof uuid === 'string') {
				router.getComponent('message-details', uuid).then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Message | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			} else {
				router.getComponent('message-list').then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Messages | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			}
		} else {
			document.body.classList.remove('no-pointer-events');
			await alert('You do not have permission for that');
			Router.go('');
		}
	},
	logout: async ({router, user}) => {
		await user.logOut();
		router.go('');
	},
	register: async ({user}) => {
		if (! await  user.loggedIn) {
			document.body.classList.add('no-pointer-events');

			Router.getComponent('registration-form').then(async el => {
				const main = document.getElementById('main');
				const els = [...main.children];
				el.hidden = true;
				main.append(el);
				await el.ready;
				await el.stylesLoaded;
				els.forEach(el => el.remove());
				el.hidden = false;
				document.title = `Register | ${title}`;
				document.body.classList.remove('no-pointer-events');
			});
		} else {
			Router.go('');
		}
	},
	requests: async ({router, user, args}) => {
		const [uuid = null] = args;
		document.body.classList.add('no-pointer-events');

		if (uuid === 'new') {
			if (await router.user.can('createNeed')) {
				router.getComponent('request-form').then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Request Form | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			} else {
				document.body.classList.remove('no-pointer-events');
				await alert('You do not have permission for that');
				router.go('');
			}
		} else if (uuid === 'admin') {
			if (await router.user.can('adminCreateNeed')) {
				document.body.classList.add('no-pointer-events');
				router.getComponent('admin-request-form').then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Admin Request Form | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			} else {
				document.body.classList.remove('no-pointer-events');
				await alert('You do not have permission for that');
				router.go('requests', 'new');
			}
		} else if (uuid === null) {
			if (! await user.can('listNeed')) {
				document.body.classList.remove('no-pointer-events');
				await alert('You do not have permssion to access that');
				history.back();
			} else {
				router.getComponent('request-list').then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Request Form | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			}
		} else {
			// @TODO check permission
			document.body.classList.add('no-pointer-events');
			router.getComponent('request-details', uuid).then(async el => {
				const main = document.getElementById('main');
				const els = [...main.children];
				el.hidden = true;
				main.append(el);
				await el.ready;
				await el.stylesLoaded;
				els.forEach(el => el.remove());
				el.hidden = false;
				document.title = `Request Details | ${title}`;
				document.body.classList.remove('no-pointer-events');
			});
		}
	},
	contact: async ({router}) => {
		document.body.classList.add('no-pointer-events');

		router.getComponent('contact-info').then(async el => {
			const main = document.getElementById('main');
			const els = [...main.children];
			el.hidden = true;
			main.append(el);
			await el.ready;
			await el.stylesLoaded;
			els.forEach(el => el.remove());
			el.hidden = false;
			document.title = `Contact | ${title}`;
			document.body.classList.remove('no-pointer-events');
		});
	},
	volunteers: async ({router, args}) => {
		const [uuid = null] = args;
		document.body.classList.add('no-pointer-events');

		if (typeof uuid === 'string') {
			router.getComponent('volunteer-individual', uuid).then(async el => {
				document.title = `Volunteers | ${title}`;
				const els = [...main.children];
				el.hidden = true;
				main.append(el);
				await el.ready;
				await el.stylesLoaded;
				els.forEach(el => el.remove());
				el.hidden = false;
				const main = document.getElementById('main');
				document.body.classList.remove('no-pointer-events');
			});
		} else {
			router.getComponent('volunteer-all').then(async el => {
				const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Volunteers | ${title}`;
					document.body.classList.remove('no-pointer-events');
			});
		}
	},
	createPerson: async ({router, /*user*/}) => {
		// @TODO Check user permissions
		if (! await router.user.can('createPerson')) {
			document.body.classList.remove('no-pointer-events');

			await alert('You do not have permissions for that');
			await router.go('');
		} else {
			document.body.classList.add('no-pointer-events');

			router.getComponent('person-new').then(async el => {
				const main = document.getElementById('main');
				const els = [...main.children];
				el.hidden = true;
				main.append(el);
				await el.ready;
				await el.stylesLoaded;
				els.forEach(el => el.remove());
				el.hidden = false;
				document.title = `Create Person | ${title}`;
				document.body.classList.remove('no-pointer-events');
			});
		}
	},
	password: async ({user, router, args}) => {
		const [action = null, token = null] = args;
		document.body.classList.add('no-pointer-events');

		switch (action) {
		case 'forgot':
			if (await user.loggedIn) {
				document.body.classList.remove('no-pointer-events');

				alert('You are already logged in');
				// @TODO Impelment change password form
				router.go('password', 'change');
			} else {
				router.getComponent('password-recover-form').then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Forgot Password | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			}
			break;

		case 'reset':
			if (await user.loggedIn) {
				document.body.classList.remove('no-pointer-events');
				alert('You are already logged in');
				// @TODO Impelment change password form
				// router.go('password', 'change');
				router.go('');
			} else if (typeof token !== 'string' || token === '') {
				document.body.classList.remove('no-pointer-events');
				await alert('No reset token');
				router.go('login');
			} else {
				document.body.classList.add('no-pointer-events');
				router.getComponent('password-reset-form', token).then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Reset Password | ${title}`;
					document.body.classList.remove('no-pointer-events');
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
			document.body.classList.remove('no-pointer-events');
			await alert('You do not have permission for that');
			router.go('');
		} else {
			const [uuid = null] = args;
			document.body.classList.add('no-pointer-events');

			if (typeof uuid === 'string') {
				router.getComponent('user-details', uuid).then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `User Details | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			} else {
				router.getComponent('user-list').then(async el => {
					const main = document.getElementById('main');
					const els = [...main.children];
					el.hidden = true;
					main.append(el);
					await el.ready;
					await el.stylesLoaded;
					els.forEach(el => el.remove());
					el.hidden = false;
					document.title = `Users | ${title}`;
					document.body.classList.remove('no-pointer-events');
				});
			}
		}
	},
	'': async ({router}) => {
		document.body.classList.add('no-pointer-events');

		router.getComponent('home-component').then(async el => {
			const main = document.getElementById('main');
			const els = [...main.children];
			el.hidden = true;
			main.append(el);
			await el.ready;
			await el.stylesLoaded;
			document.title = title;
			els.forEach(el => el.remove());
			el.hidden = false;
			document.body.classList.remove('no-pointer-events');
		});
	},
};
