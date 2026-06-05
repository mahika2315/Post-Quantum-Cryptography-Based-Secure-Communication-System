<script>
	import { user } from '$lib/store.js';
	import { MLKEM, MLDSA } from '$lib/crypto.js';
	import { goto } from '$app/navigation';

	let loading = false;
	let loggingInAs = '';
	let customPhone = '';
	let errorMsg = '';

	async function loginAs(identity) {
		loading = true;
		loggingInAs = identity;
		
		// Mock Key Generation (Zero-Knowledge Architecture)
		const mlkemKeys = await MLKEM.generateKeyPair();
		const mldsaKeys = await MLDSA.generateKeyPair();
		
		let name = identity === 'alice' ? 'Alice' : 'Bob';
		let phone = identity === 'alice' ? '+1 555-ALICE' : '+1 555-BOB';
		
		// Set user store, which unlocks /chat
		user.set({
			id: identity,
			name,
			phone,
			keys: {
				mlkem: mlkemKeys,
				mldsa: mldsaKeys
			}
		});
		
		// Redirect to chat
		goto('/chat');
	}

	async function loginCustom() {
		if (customPhone.length < 3) return;
		loading = true;
		loggingInAs = 'custom';
		errorMsg = '';
		
		try {
			// Check if user exists in the network
			const res = await fetch('/api/users');
			const users = await res.json();
			const existingUser = users.find(u => u.phone === customPhone || u.id === customPhone);
			
			if (!existingUser) {
				errorMsg = "Account not found. Please register first.";
				loading = false;
				loggingInAs = '';
				return;
			}

			// Generate local quantum keys
			const mlkemKeys = await MLKEM.generateKeyPair();
			const mldsaKeys = await MLDSA.generateKeyPair();
			
			user.set({
				...existingUser,
				keys: {
					mlkem: mlkemKeys,
					mldsa: mldsaKeys
				}
			});
			
			goto('/chat');
		} catch (e) {
			errorMsg = "Login failed.";
			loading = false;
			loggingInAs = '';
		}
	}
</script>

<div class="auth-container animate-fade-in">
	<div class="glass glass-panel login-box">
		<div class="brand">
			<div class="logo">
				<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: white">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
					<path d="M12 8v4"></path>
					<path d="M12 16h.01"></path>
				</svg>
			</div>
			<h1>CipherNova</h1>
			<p>Post-Quantum Secure Messaging</p>
		</div>

		{#if errorMsg}
			<div class="error-msg">{errorMsg}</div>
		{/if}

		<div class="button-group">
			<button class="btn btn-primary w-full" onclick={() => loginAs('alice')} disabled={loading}>
				{loading && loggingInAs === 'alice' ? 'Generating Keys...' : '👩‍🦰 Login as Alice'}
			</button>
			<button class="btn btn-primary w-full bob-btn" onclick={() => loginAs('bob')} disabled={loading}>
				{loading && loggingInAs === 'bob' ? 'Generating Keys...' : '👨‍🦱 Login as Bob'}
			</button>
		</div>

		<div class="divider">
			<span>OR CUSTOM LOGIN</span>
		</div>

		<div class="custom-login">
			<input type="text" bind:value={customPhone} placeholder="Enter Registered Phone Number" class="input-field" disabled={loading} />
			<button class="btn btn-secondary w-full" onclick={loginCustom} disabled={loading || customPhone.length < 3}>
				{loading && loggingInAs === 'custom' ? 'Verifying...' : 'Login'}
			</button>
		</div>

		<div class="crypto-notice">
			<div class="spinner" style={loading ? "opacity: 1" : "opacity: 0"}></div>
			<small>Generating ML-KEM-1024 and CRYSTALS-Dilithium Keys locally. The server never sees your private keys.</small>
		</div>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		padding: 2rem;
		min-height: 100vh;
	}
	
	.login-box {
		width: 100%;
		max-width: 420px;
		animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}
	
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(40px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.brand {
		text-align: center;
		margin-bottom: 2rem;
	}

	.demo-notice {
		background: rgba(16, 185, 129, 0.15);
		color: var(--secondary);
		padding: 0.5rem;
		text-align: center;
		border-radius: var(--radius-md);
		border: 1px solid rgba(16, 185, 129, 0.3);
		margin-bottom: 2rem;
		font-weight: 600;
		font-size: 0.9rem;
	}
	
	.logo {
		width: 64px;
		height: 64px;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		border-radius: 18px;
		margin: 0 auto 1.25rem;
		box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.logo::after {
		content: '';
		position: absolute;
		inset: -2px;
		border-radius: 20px;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		z-index: -1;
		opacity: 0.5;
		filter: blur(10px);
	}
	
	.brand h1 {
		font-size: 1.75rem;
		margin-bottom: 0.5rem;
		background: linear-gradient(to right, #fff, #94a3b8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	
	.brand p {
		font-size: 0.9rem;
		color: var(--text-muted);
	}
	
	.error-msg {
		background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;
		padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; font-size: 0.9rem;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.w-full {
		width: 100%;
		padding: 1rem;
		font-size: 1rem;
	}

	.bob-btn {
		background: linear-gradient(135deg, #10b981, #059669);
		box-shadow: 0 4px 20px 0 rgba(16, 185, 129, 0.4);
	}
	.bob-btn:hover:not(:disabled) {
		box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5);
	}

	.divider {
		display: flex;
		align-items: center;
		text-align: center;
		margin: 1.5rem 0;
		color: #64748b;
		font-size: 0.75rem;
		font-weight: bold;
		letter-spacing: 1px;
	}
	.divider::before, .divider::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid rgba(255,255,255,0.1);
	}
	.divider span {
		padding: 0 1rem;
	}

	.custom-login {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.input-field {
		width: 100%;
		padding: 0.8rem 1rem;
		background: rgba(15, 20, 35, 0.5);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: var(--radius-sm);
		color: white;
		font-size: 0.95rem;
		transition: border-color 0.2s;
	}
	.input-field:focus {
		outline: none;
		border-color: var(--primary);
	}

	.btn-secondary {
		background: rgba(30, 41, 59, 0.8);
		border: 1px solid rgba(255,255,255,0.1);
		color: white;
	}
	.btn-secondary:hover:not(:disabled) {
		background: rgba(59, 130, 246, 0.2);
		border-color: var(--primary);
	}
	
	.crypto-notice {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-top: 1.5rem;
		color: var(--text-muted);
		font-size: 0.8rem;
		gap: 0.75rem;
		background: rgba(0,0,0,0.2);
		padding: 1rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--glass-border);
	}
	
	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255,255,255,0.1);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		transition: opacity 0.3s;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
