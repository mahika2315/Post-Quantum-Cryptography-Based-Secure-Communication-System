<script>
	import { user } from '$lib/store.js';
	import { MLKEM, MLDSA } from '$lib/crypto.js';
	import { goto } from '$app/navigation';

	let phone = '';
	let otp = '';
	let username = '';
	let profilePhoto = '';
	let step = 1;
	let loading = false;
	let errorMsg = '';

	async function requestOTP() {
		if (phone.length < 5) return;
		loading = true;
		// Mock network delay
		setTimeout(() => {
			loading = false;
			step = 2;
		}, 1000);
	}

	async function verifyOTP() {
		if (otp.length < 4) return;
		loading = true;
		setTimeout(() => {
			loading = false;
			step = 3;
		}, 1000);
	}

	function onFileSelected(e) {
		let file = e.target.files[0];
		if (!file) return;
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = e => {
			profilePhoto = e.target.result;
		};
	}

	async function completeRegistration() {
		if (username.length < 2) return;
		loading = true;
		errorMsg = '';
		
		try {
			// Generate local quantum keys
			const mlkemKeys = await MLKEM.generateKeyPair();
			const mldsaKeys = await MLDSA.generateKeyPair();
			
			const newUser = {
				id: phone, // using phone as ID for simplicity
				name: username,
				phone: phone,
				profilePhoto: profilePhoto || null
			};

			// Register globally
			await fetch('/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newUser)
			});

			// Set local store with keys
			user.set({
				...newUser,
				keys: {
					mlkem: mlkemKeys,
					mldsa: mldsaKeys
				}
			});
			
			goto('/chat');
		} catch (e) {
			errorMsg = "Registration failed.";
			loading = false;
		}
	}
</script>

<div class="auth-container animate-fade-in">
	<div class="glass glass-panel auth-box">
		<div class="brand">
			<div class="logo">
				<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
			</div>
			<h1>Create Account</h1>
			<p>Join the post-quantum secure network</p>
		</div>

		{#if errorMsg}
			<div class="error-msg">{errorMsg}</div>
		{/if}

		{#if step === 1}
			<div class="form-group">
				<label>Phone Number</label>
				<input type="tel" bind:value={phone} placeholder="+1 (555) 000-0000" class="input-field" disabled={loading} />
			</div>
			<button class="btn btn-primary w-full" onclick={requestOTP} disabled={loading || phone.length < 5}>
				{loading ? 'Sending OTP...' : 'Send OTP'}
			</button>
			
			<div class="switch-mode">
				<p>Already have an account? <a href="/login">Login here</a></p>
			</div>
		{:else if step === 2}
			<div class="form-group">
				<label>Enter OTP sent to {phone}</label>
				<input type="text" bind:value={otp} placeholder="1234" class="input-field" disabled={loading} />
			</div>
			<button class="btn btn-primary w-full" onclick={verifyOTP} disabled={loading || otp.length < 4}>
				{loading ? 'Verifying...' : 'Verify OTP'}
			</button>
		{:else if step === 3}
			<div class="profile-setup">
				<label class="photo-upload">
					<input type="file" accept="image/*" style="display:none" onchange={onFileSelected} disabled={loading} />
					{#if profilePhoto}
						<img src={profilePhoto} alt="Profile" class="preview-img" />
					{:else}
						<div class="photo-placeholder">
							<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
							<span>Add Photo</span>
						</div>
					{/if}
				</label>
				
				<div class="form-group" style="width: 100%">
					<label>Display Name</label>
					<input type="text" bind:value={username} placeholder="Alice Smith" class="input-field" disabled={loading} />
				</div>
			</div>

			<button class="btn btn-primary w-full" onclick={completeRegistration} disabled={loading || username.length < 2}>
				{loading ? 'Generating Quantum Keys...' : 'Create Account'}
			</button>
			<div class="crypto-notice">
				<small>Creating ML-KEM-1024 and CRYSTALS-Dilithium Keys securely on your device.</small>
			</div>
		{/if}
	</div>
</div>

<style>
	.auth-container {
		display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem;
	}
	.auth-box {
		width: 100%; max-width: 420px; animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); padding: 2.5rem 2rem;
	}
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(40px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.brand { text-align: center; margin-bottom: 2rem; }
	.logo {
		width: 64px; height: 64px; background: linear-gradient(135deg, var(--primary), var(--accent));
		border-radius: 18px; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;
		color: white; box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
	}
	.brand h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
	.brand p { font-size: 0.9rem; color: var(--text-muted); }
	
	.form-group { margin-bottom: 1.5rem; }
	.form-group label { display: block; margin-bottom: 0.5rem; color: #cbd5e1; font-size: 0.9rem; }
	.input-field { width: 100%; padding: 0.75rem 1rem; }
	
	.w-full { width: 100%; padding: 0.8rem; font-size: 1rem; }
	
	.error-msg {
		background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5;
		padding: 0.75rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: center; font-size: 0.9rem;
	}
	.switch-mode { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #94a3b8; }
	.switch-mode a { color: #3b82f6; text-decoration: none; font-weight: 600; }
	.switch-mode a:hover { text-decoration: underline; }
	
	.profile-setup { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; margin-bottom: 1rem; }
	.photo-upload { cursor: pointer; display: block; }
	.photo-placeholder {
		width: 100px; height: 100px; border-radius: 50%; border: 2px dashed rgba(255,255,255,0.2);
		display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0.5rem;
		color: #94a3b8; font-size: 0.8rem; transition: border 0.2s; background: rgba(0,0,0,0.2);
	}
	.photo-placeholder:hover { border-color: var(--primary); color: white; }
	.preview-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); }

	.crypto-notice { text-align: center; margin-top: 1.5rem; color: var(--text-muted); font-size: 0.8rem; line-height: 1.4; }
</style>
