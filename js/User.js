import { ENDPOINT } from './consts.js';

export default class User extends EventTarget {
	constructor() {
		super();

		if (this.loggedIn) {
			// Login stuff
		}
	}

	get loggedIn() {
		return this.has('token');
	}

	get whenLoggedIn() {
		return new Promise(async resolve => {
			if (await this.loggedIn) {
				resolve();
			} else {
				this.addEventListener('login', () => resolve(), {once: true});
			}
		});
	}

	get token() {
		return this.get('token');
	}

	set token(val) {
		this.set('token', val);
	}

	async register({
		email,
		password,
		name,
		telephone,
		streetAddress,
		addressLocality,
		addressRegion,
		postalCode,
	}) {
		const resp = await fetch(new URL('/test/', ENDPOINT), {
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify({
				email,
				password,
				name,
				telephone,
				address: {
					streetAddress,
					addressLocality,
					addressRegion,
					postalCode,
				},
			}),
			headers: new Headers({
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}),
		});

		if (resp.ok) {
			const detail = await resp.json();
			this.dispatchEvent(new CustomEvent('login', {detail}));
			this.token = 'dfgdfg';
			return detail;
		}
	}

	async logIn({email, password}) {
		const resp = await fetch(new URL('/test/', ENDPOINT), {
			mode: 'cors',
			method: 'POST',
			body: JSON.stringify({
				email,
				password,
			}),
			headers: new Headers({
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}),
		});

		if (resp.ok) {
			const detail = await resp.json();
			this.dispatchEvent(new CustomEvent('login', {detail}));
			this.token = 'dfgdfg';
			return detail;
		}
	}

	async get(prop) {
		return localStorage.getItem(prop);
	}

	async set(prop, val) {
		localStorage.setItem(prop, val);
	}

	async has(...props) {
		return props.every(prop => localStorage.hasOwnProperty(prop));
	}

	async delete(...props) {
		props.forEach(prop => localStorage.removeItem(prop));
	}

	async logOut() {
		localStorage.clear();
		this.dispatchEvent(new Event('logout'));
	}
}
