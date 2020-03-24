const RESERVED = [
	'load',
	'error',
	'abort',
];

const BASE = window;

export default class EventTarget {
	addEventListener(event, ...args) {
		if (RESERVED.includes(event)) {
			throw new Error(`Cannot use event type: ${event}`);
		} else {
			BASE.addEventListener(event, ...args);
		}
	}

	dispatchEvent(event, ...args) {
		if (RESERVED.includes(event)) {
			throw new Error(`Cannot use event type: ${event}`);
		} else {
			BASE.dispatchEvent(event, ...args);
		}
	}

	removeEventListener(event, ...args) {
		if (RESERVED.includes(event)) {
			throw new Error(`Cannot use event type: ${event}`);
		} else {
			BASE.removeEventListener(event, ...args);
		}
	}
}
