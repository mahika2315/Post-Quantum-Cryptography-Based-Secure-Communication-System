/**
 * PQC Crypto Service (Mock / Wrapper)
 * In a real implementation, this would import 'mlkem' and '@noble/post-quantum'
 * For this automated setup without external dependencies installed, we use WebCrypto to simulate
 * the Kyber and Dilithium behavior for demonstration of the Zero-Knowledge Architecture.
 */

// Simulated ML-KEM-1024 (Kyber)
export const MLKEM = {
	generateKeyPair: async () => {
		const keyPair = await window.crypto.subtle.generateKey(
			{ name: 'ECDH', namedCurve: 'P-384' },
			true,
			['deriveKey']
		);
		return {
			publicKey: await window.crypto.subtle.exportKey('raw', keyPair.publicKey),
			privateKey: keyPair.privateKey // Keep as CryptoKey internally for mock
		};
	},
	
	encapsulate: async (publicKeyBuffer) => {
		// Simulate generating a shared secret and ciphertext
		const importedPubKey = await window.crypto.subtle.importKey(
			'raw', publicKeyBuffer, { name: 'ECDH', namedCurve: 'P-384' }, true, []
		);
		const tempKeyPair = await window.crypto.subtle.generateKey(
			{ name: 'ECDH', namedCurve: 'P-384' }, true, ['deriveKey']
		);
		
		const sharedSecret = await window.crypto.subtle.deriveKey(
			{ name: 'ECDH', public: importedPubKey },
			tempKeyPair.privateKey,
			{ name: 'AES-GCM', length: 256 },
			true,
			['encrypt', 'decrypt']
		);
		
		const ciphertext = await window.crypto.subtle.exportKey('raw', tempKeyPair.publicKey);
		const secretBuffer = await window.crypto.subtle.exportKey('raw', sharedSecret);
		
		return { ciphertext, sharedSecret: secretBuffer };
	},
	
	decapsulate: async (ciphertextBuffer, privateKey) => {
		const importedCiphertextKey = await window.crypto.subtle.importKey(
			'raw', ciphertextBuffer, { name: 'ECDH', namedCurve: 'P-384' }, true, []
		);
		
		const sharedSecret = await window.crypto.subtle.deriveKey(
			{ name: 'ECDH', public: importedCiphertextKey },
			privateKey,
			{ name: 'AES-GCM', length: 256 },
			true,
			['encrypt', 'decrypt']
		);
		
		return window.crypto.subtle.exportKey('raw', sharedSecret);
	}
};

// Simulated CRYSTALS-Dilithium (ML-DSA)
export const MLDSA = {
	generateKeyPair: async () => {
		const keyPair = await window.crypto.subtle.generateKey(
			{ name: 'ECDSA', namedCurve: 'P-384' },
			true,
			['sign', 'verify']
		);
		return {
			publicKey: await window.crypto.subtle.exportKey('raw', keyPair.publicKey),
			privateKey: keyPair.privateKey
		};
	},
	
	sign: async (messageBuffer, privateKey) => {
		return window.crypto.subtle.sign(
			{ name: 'ECDSA', hash: { name: 'SHA-384' } },
			privateKey,
			messageBuffer
		);
	},
	
	verify: async (signature, messageBuffer, publicKeyBuffer) => {
		const pubKey = await window.crypto.subtle.importKey(
			'raw', publicKeyBuffer, { name: 'ECDSA', namedCurve: 'P-384' }, true, ['verify']
		);
		return window.crypto.subtle.verify(
			{ name: 'ECDSA', hash: { name: 'SHA-384' } },
			pubKey,
			signature,
			messageBuffer
		);
	}
};

// Simulated ChaCha20-Poly1305 (using AES-GCM as fallback in WebCrypto)
export const Symmetric = {
	encrypt: async (messageStr, sharedSecretBuffer) => {
		const key = await window.crypto.subtle.importKey(
			'raw', sharedSecretBuffer, { name: 'AES-GCM' }, false, ['encrypt']
		);
		const iv = window.crypto.getRandomValues(new Uint8Array(12));
		const encoder = new TextEncoder();
		const data = encoder.encode(messageStr);
		
		const ciphertext = await window.crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			data
		);
		
		return { ciphertext, iv };
	},
	
	decrypt: async (ciphertext, iv, sharedSecretBuffer) => {
		const key = await window.crypto.subtle.importKey(
			'raw', sharedSecretBuffer, { name: 'AES-GCM' }, false, ['decrypt']
		);
		
		const decryptedBuffer = await window.crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			ciphertext
		);
		
		const decoder = new TextDecoder();
		return decoder.decode(decryptedBuffer);
	},
	
	encryptFile: async (fileArrayBuffer, sharedSecretBuffer) => {
		const key = await window.crypto.subtle.importKey(
			'raw', sharedSecretBuffer, { name: 'AES-GCM' }, false, ['encrypt']
		);
		const iv = window.crypto.getRandomValues(new Uint8Array(12));
		
		const ciphertext = await window.crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			fileArrayBuffer
		);
		
		return { ciphertext, iv };
	},

	decryptFile: async (ciphertextBuffer, iv, sharedSecretBuffer) => {
		const key = await window.crypto.subtle.importKey(
			'raw', sharedSecretBuffer, { name: 'AES-GCM' }, false, ['decrypt']
		);
		
		const decryptedBuffer = await window.crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			ciphertextBuffer
		);
		
		return decryptedBuffer;
	}
};

// Helpers for ArrayBuffer <-> Base64
export function bufferToBase64(buffer) {
	let binary = '';
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

export function base64ToBuffer(base64) {
	const binary_string = window.atob(base64);
	const len = binary_string.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}
