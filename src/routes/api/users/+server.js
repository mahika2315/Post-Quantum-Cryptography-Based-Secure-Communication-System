import { users, broadcast } from '$lib/server/db.js';

export async function GET() {
	const userList = Array.from(users.values());
	return new Response(JSON.stringify(userList), {
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function POST({ request }) {
	const data = await request.json();
	// data should have: id (phone), phone, name, profilePhoto
	
	users.set(data.id, data);
	
	// Broadcast new user to everyone online so they see the new contact immediately
	broadcast('new_user', data);
	
	return new Response(JSON.stringify({ success: true, user: data }), {
		headers: { 'Content-Type': 'application/json' }
	});
}
