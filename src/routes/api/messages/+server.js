import { emitToUser, messages } from '$lib/server/db.js';

export async function POST({ request }) {
	const data = await request.json();
	// data should have: sender, receiver, ciphertext, iv
	
	// Server stores encrypted message only
	messages.push(data);
	
	// Relay to recipient
	emitToUser(data.receiver, 'receive_message', data);
	
	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
