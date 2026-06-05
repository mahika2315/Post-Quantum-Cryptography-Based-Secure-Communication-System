import { emitToUser } from '$lib/server/db.js';

export async function POST({ request }) {
	const data = await request.json();
	// data should have: target, caller, signal (offer, answer, candidate)
	
	emitToUser(data.target, 'webrtc_signal', data);
	
	return new Response(JSON.stringify({ success: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
