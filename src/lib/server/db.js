// In-memory data store for the backend. 
// Using globalThis prevents Vite dev server from wiping memory across different API route calls.
export const users = globalThis.__cnsUsers || new Map(); 
globalThis.__cnsUsers = users;

export const messages = globalThis.__cnsMessages || []; 
globalThis.__cnsMessages = messages;

export const eventsClients = globalThis.__cnsEventsClients || new Map(); 
globalThis.__cnsEventsClients = eventsClients;

export function addClient(userId, controller) {
	if (!eventsClients.has(userId)) {
		eventsClients.set(userId, new Set());
	}
	eventsClients.get(userId).add(controller);
}

export function removeClient(userId, controller) {
	if (eventsClients.has(userId)) {
		eventsClients.get(userId).delete(controller);
		if (eventsClients.get(userId).size === 0) {
			eventsClients.delete(userId);
		}
	}
}

export function emitToUser(userId, eventName, data) {
	if (eventsClients.has(userId)) {
		const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
		eventsClients.get(userId).forEach(controller => {
			try {
				controller.enqueue(new TextEncoder().encode(payload));
			} catch (e) {
				console.error("Error sending event to user", userId, e);
			}
		});
	}
}

export function broadcast(eventName, data, excludeUserId = null) {
	const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
	for (const [userId, controllers] of eventsClients.entries()) {
		if (userId === excludeUserId) continue;
		controllers.forEach(controller => {
			try {
				controller.enqueue(new TextEncoder().encode(payload));
			} catch (e) {}
		});
	}
}
