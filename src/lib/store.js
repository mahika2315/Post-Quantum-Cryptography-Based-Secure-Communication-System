import { writable, derived } from 'svelte/store';

// Mock user state
export const user = writable(null); // { id, name, phone, profilePhoto, keys: { mlkem, mldsa } }

// All registered users in the network (Pre-loaded with Alice & Bob for Exam Demo)
export const allUsers = writable([
	{ id: 'alice', phone: '+1 555-ALICE', name: 'Alice', profilePhoto: null },
	{ id: 'bob', phone: '+1 555-BOB', name: 'Bob', profilePhoto: null }
]);

// Contacts list automatically filters out the current user
export const contacts = derived([user, allUsers], ([$user, $allUsers]) => {
	if (!$user) return [];
	return $allUsers.filter(u => u.id !== $user.id);
});

// Mock messages store
export const messages = writable([]);
