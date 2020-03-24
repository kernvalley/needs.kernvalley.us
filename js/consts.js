import Router from './Router.js';
export const ENDPOINT = 'https://api.kernvalley.us';
export const title = 'Kern River Valley Healthy Shopping Resouce';

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
	request: async ({args, user, router}) => {
		const uuid = args.length > 0 ? args[0] : null;
		console.info({uuid});
		if (await user.loggedIn) {
			if (uuid === null) {
				router.getComponent('request-form', uuid).then(async el => {
					document.title = `Request Form | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			} else {
				router.getComponent('request-list', uuid).then(async el => {
					document.title = `Request Test | ${title}`;
					const main = document.getElementById('main');
					[...main.children].forEach(el => el.remove());
					await el.ready;
					main.append(el);
				});
			}
		} else {
			Router.go('login');
		}
	},
	requests: async ({router, user, args = []}) => {
		console.info({user, args});
		router.getComponent('request-list').then(async el => {
			document.title = `Request Form | ${title}`;
			const main = document.getElementById('main');
			[...main.children].forEach(el => el.remove());
			await el.ready;
			main.append(el);
		});
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
