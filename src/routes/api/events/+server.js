import { addClient, removeClient, broadcast } from '$lib/server/db.js';

export function GET({ url }) {
	const userId = url.searchParams.get('userId');
	if (!userId) {
		return new Response('User ID required', { status: 400 });
	}

	let controller;
	const stream = new ReadableStream({
		start(c) {
			controller = c;
			addClient(userId, controller);
			
			// Send initial connected event
			const payload = `event: connected\ndata: {"status": "ok"}\n\n`;
			controller.enqueue(new TextEncoder().encode(payload));
			
			// Broadcast that user is online
			broadcast('user_status', { userId, status: 'online' }, userId);
		},
		cancel() {
			if (controller) {
				removeClient(userId, controller);
				broadcast('user_status', { userId, status: 'offline' }, userId);
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
}
