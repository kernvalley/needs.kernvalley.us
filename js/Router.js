import User from './User.js';
const routes = {};
const user = new User();

function handler({
	href,
	origin,
	pathname,
	hash,
	route,
	args,
	search,
	params,
	user,
	router = Router,
} = Router.route) {
	if (routes.hasOwnProperty(route)) {
		routes[route]({
			href,
			origin,
			pathname,
			hash,
			route,
			args,
			search,
			params,
			user,
			router,
		});
	} else if (routes.hasOwnProperty('error-page')) {
		routes['error-page']({
			href,
			origin,
			pathname,
			hash,
			route,
			args,
			search,
			params,
			user,
			router,
		});
	} else {
		throw new Error(`Invalid route for ${route}`);
	}
}

window.getRoutes = () => routes;
export default class Router {
	static async getComponent(tag, {
		href,
		origin,
		pathname,
		hash,
		route,
		args,
		search,
		params,
		user,
		router,
	} = Router.route) {
		if (customElements.get(tag) === undefined) {
			await customElements.whenDefined(tag);
		}

		const El = customElements.get(tag);
		const el = new El({
			href,
			origin,
			pathname,
			hash,
			route,
			args,
			search,
			params,
			user,
			router,
		});
		return el;
	}

	static setRoute(route, callback) {
		if (typeof route === 'string' && callback instanceof Function) {
			routes[route] = callback;
		} else {
			throw new Error('Invalid route set');
		}
	}

	static get route() {
		const {pathname, hash, search, origin, href} = location;
		const [route = '', ...args] = hash.substr(1).split('/').filter(part => part !== '');
		const params = Object.fromEntries(new URLSearchParams(search).entries());

		return {
			href,
			origin,
			pathname,
			hash,
			route,
			args,
			search,
			params,
			user: Router.user,
			router: Router,
		};
	}

	static get routes() {
		return Object.keys(routes);
	}

	static set routes(opts = {}) {
		Object.entries(opts).forEach(([route, callback]) => Router.setRoute(route, callback));
	}

	static get user() {
		return user;
	}

	static go(...path) {
		location.hash = `#${path.join('/')}`;
	}

	static init() {
		handler(Router.route);
		window.addEventListener('hashchange', () => handler(Router.route));
	}
}
