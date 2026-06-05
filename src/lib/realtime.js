export class RealtimeClient {
	constructor() {
		this.eventSource = null;
		this.listeners = new Map();
		this.userId = null;
	}

	connect(userId) {
		this.userId = userId;
		if (this.eventSource) this.eventSource.close();
		
		this.eventSource = new EventSource(`/api/events?userId=${userId}`);
		
		this.eventSource.addEventListener('connected', (e) => {
			console.log('Real-time connection established');
			this.emit('connected', JSON.parse(e.data));
		});

		this.eventSource.addEventListener('receive_message', (e) => {
			this.emit('receive_message', JSON.parse(e.data));
		});

		this.eventSource.addEventListener('webrtc_signal', (e) => {
			this.emit('webrtc_signal', JSON.parse(e.data));
		});

		this.eventSource.addEventListener('user_status', (e) => {
			this.emit('user_status', JSON.parse(e.data));
		});
	}

	on(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event).add(callback);
	}

	emit(event, data) {
		if (this.listeners.has(event)) {
			this.listeners.get(event).forEach(cb => cb(data));
		}
	}

	async sendMessage(receiver, ciphertext, iv) {
		await fetch('/api/messages', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sender: this.userId,
				receiver,
				ciphertext,
				iv,
				timestamp: new Date().toISOString()
			})
		});
	}

	async sendSignal(target, signal) {
		await fetch('/api/webrtc', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				target,
				caller: this.userId,
				signal
			})
		});
	}
}

export const realtime = new RealtimeClient();
