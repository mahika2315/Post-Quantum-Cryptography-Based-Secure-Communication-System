<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let activeTab = 1;

	const tabs = [
		{ 
			id: 1, 
			title: "The Quantum Threat", 
			subtitle: "Why we need Post-Quantum Cryptography...",
			icon: "⚛️"
		},
		{ 
			id: 2, 
			title: "ML-KEM-1024 Key Exchange", 
			subtitle: "CRYSTALS-Kyber lattice-based key en...",
			icon: "🔑"
		},
		{ 
			id: 3, 
			title: "CRYSTALS-Dilithium Signatures", 
			subtitle: "Digital signatures & authentication",
			icon: "✍️"
		},
		{ 
			id: 4, 
			title: "ChaCha20-Poly1305 Encryption", 
			subtitle: "Authenticated symmetric encryption",
			icon: "🔒"
		}
	];

	function navigateToLogin() {
		goto('/');
	}

	// Tab 1: The Quantum Threat State
	let t1Step = 1;
	let t1Animating = false;
	let classicalBroken = false;
	let quantumWaveActive = false;

	function nextT1Step() {
		if (t1Step < 4) t1Step++;
	}
	function prevT1Step() {
		if (t1Step > 1) t1Step--;
	}

	function runQuantumAttack() {
		t1Animating = true;
		quantumWaveActive = true;
		
		// Phase 1: Quantum Computer charges
		setTimeout(() => {
			// Phase 2: Shor's algorithm runs & classical structures break
			classicalBroken = true;
		}, 1500);

		setTimeout(() => {
			t1Animating = false;
			quantumWaveActive = false;
		}, 3000);
	}

	function resetQuantumAttack() {
		t1Animating = false;
		classicalBroken = false;
		quantumWaveActive = false;
		t1Step = 1;
	}

	// Tab 2: ML-KEM-1024 State
	let t2Step = 1;
	let t2Animating = false;
	let showAliceKeys = false;
	let showBobKeys = false;
	let pubKeyFlying = false;
	let cipherFlying = false;
	let derivedSecret = null;
	let secretHex = "";

	function startKemStep() {
		if (t2Animating) return;
		t2Animating = true;

		if (t2Step === 1) {
			// Step 1: Alice generates ML-KEM key pair
			showAliceKeys = true;
			setTimeout(() => {
				t2Animating = false;
				t2Step = 2;
			}, 1000);
		} else if (t2Step === 2) {
			// Step 2: Alice publishes her public key
			pubKeyFlying = true;
			setTimeout(() => {
				pubKeyFlying = false;
				showBobKeys = true; // Bob now has the public key
				t2Animating = false;
				t2Step = 3;
			}, 1500);
		} else if (t2Step === 3) {
			// Step 3: Bob encapsulates a shared secret
			derivedSecret = "0x8e5c1a7d...3f2b";
			secretHex = "E598F7A1";
			setTimeout(() => {
				t2Animating = false;
				t2Step = 4;
			}, 1200);
		} else if (t2Step === 4) {
			// Step 4: Bob sends back the ciphertext
			cipherFlying = true;
			setTimeout(() => {
				cipherFlying = false;
				t2Animating = false;
				t2Step = 5;
			}, 1500);
		} else if (t2Step === 5) {
			// Step 5: Alice decapsulates the ciphertext
			setTimeout(() => {
				t2Animating = false;
				t2Step = 6; // Complete
			}, 1000);
		}
	}

	function resetKemDemo() {
		t2Step = 1;
		t2Animating = false;
		showAliceKeys = false;
		showBobKeys = false;
		pubKeyFlying = false;
		cipherFlying = false;
		derivedSecret = null;
		secretHex = "";
	}

	// Tab 3: CRYSTALS-Dilithium Signatures State
	let t3Step = 1;
	let t3Animating = false;
	let dsaAliceKeys = false;
	let dsaMessageSigned = false;
	let dsaSigFlying = false;
	let dsaBobVerifying = false;
	let dsaVerificationSuccess = false;

	function runDsaStep() {
		if (t3Animating) return;
		t3Animating = true;

		if (t3Step === 1) {
			// Step 1: Alice generates keypair
			dsaAliceKeys = true;
			setTimeout(() => {
				t3Animating = false;
				t3Step = 2;
			}, 1000);
		} else if (t3Step === 2) {
			// Step 2: Alice signs the message
			dsaMessageSigned = true;
			setTimeout(() => {
				t3Animating = false;
				t3Step = 3;
			}, 1200);
		} else if (t3Step === 3) {
			// Step 3: Signature is transmitted with the message
			dsaSigFlying = true;
			setTimeout(() => {
				dsaSigFlying = false;
				t3Animating = false;
				t3Step = 4;
			}, 1500);
		} else if (t3Step === 4) {
			// Step 4: Bob verifies the signature
			dsaBobVerifying = true;
			setTimeout(() => {
				dsaBobVerifying = false;
				dsaVerificationSuccess = true;
				t3Animating = false;
				t3Step = 5; // Complete
			}, 1500);
		}
	}

	function resetDsaDemo() {
		t3Step = 1;
		t3Animating = false;
		dsaAliceKeys = false;
		dsaMessageSigned = false;
		dsaSigFlying = false;
		dsaBobVerifying = false;
		dsaVerificationSuccess = false;
	}

	// Tab 4: ChaCha20-Poly1305 State
	let t4Input = "Attack at dawn!";
	let t4KeyHex = "a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7";
	let t4IvHex = "5f38a9d10e2b";
	let t4Ciphertext = "";
	let t4DecryptedText = "";
	let t4State = "plain"; // plain, encrypting, encrypted, decrypting, decrypted

	function handleEncrypt() {
		if (!t4Input.trim()) return;
		t4State = "encrypting";
		setTimeout(() => {
			// Generate basic mock ciphertext in base64
			let binary = '';
			const encoder = new TextEncoder();
			const bytes = encoder.encode(t4Input);
			bytes.forEach(b => binary += String.fromCharCode(b ^ 0x42)); // simple XOR for demo
			t4Ciphertext = window.btoa(binary);
			t4State = "encrypted";
		}, 1500);
	}

	function handleDecrypt() {
		t4State = "decrypting";
		setTimeout(() => {
			const binary = window.atob(t4Ciphertext);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i) ^ 0x42;
			}
			t4DecryptedText = new TextDecoder().decode(bytes);
			t4State = "decrypted";
		}, 1500);
	}

	function resetSymmetricDemo() {
		t4Input = "Attack at dawn!";
		t4Ciphertext = "";
		t4DecryptedText = "";
		t4State = "plain";
	}

	// General Tab Navigation
	function nextTab() {
		if (activeTab < 4) {
			activeTab++;
		}
	}

	function prevTab() {
		if (activeTab > 1) {
			activeTab--;
		}
	}
</script>

<div class="demo-page">
	<!-- Navigation Bar -->
	<nav class="navbar glass-panel">
		<div class="nav-brand">
			<div class="logo-icon">
				<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
			</div>
			<span class="brand-name">CipherNova</span>
		</div>
		
		<div class="nav-links">
			<a href="/" class="nav-link">Home</a>
			<a href="#" class="nav-link active">⚛️ PQC Demo</a>
		</div>
		
		<div class="nav-actions">
			<button class="icon-btn" title="Toggle Theme">
				<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
			</button>
			<div class="language-selector">
				<small>US</small> <strong>EN</strong> <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
			</div>
			<button class="nav-login-btn" onclick={navigateToLogin}>Login</button>
			<button class="nav-register-btn" onclick={navigateToLogin}>Register</button>
		</div>
	</nav>

	<!-- Hero Section -->
	<header class="hero-section">
		<div class="badge">QUANTUM CRYPTOGRAPHY & NETWORK SECURITY</div>
		<h1 class="hero-title">Post-Quantum Cryptography</h1>
		<h2 class="hero-subtitle">Interactive Visual Demonstration</h2>
		<p class="hero-description">
			Explore how ML-KEM-1024, CRYSTALS-Dilithium, and ChaCha20-Poly1305 protect<br>
			communications against quantum computer attacks.
		</p>
	</header>

	<!-- Tab Navigation -->
	<div class="tabs-container">
		<div class="tabs-wrapper">
			{#each tabs as tab}
				<button 
					class="tab-btn {activeTab === tab.id ? 'active' : ''}" 
					onclick={() => activeTab = tab.id}
				>
					<div class="tab-icon">{tab.icon}</div>
					<div class="tab-text">
						<div class="tab-title">{tab.title}</div>
						<div class="tab-subtitle">{tab.subtitle}</div>
					</div>
					<div class="tab-number">{tab.id}</div>
				</button>
			{/each}
		</div>
		<div class="progress-bar-container">
			<div class="progress-bar" style="width: {(activeTab / 4) * 100}%"></div>
		</div>
	</div>

	<!-- Content Area -->
	<main class="content-section glass-panel animate-fade-in">
		
		<!-- TAB 1: THE QUANTUM THREAT -->
		{#if activeTab === 1}
			<div class="tab-content" id="tab-1">
				<div class="content-header">
					<span class="content-icon">⚛️</span>
					<h2>The Quantum Threat to Classical Cryptography</h2>
				</div>
				<p class="content-lead">Understanding why RSA and ECC must be replaced</p>

				<div class="tab-grid-layout">
					<!-- Step Narrative Panel (Left) -->
					<div class="narrative-panel">
						<div class="timeline">
							<div class="timeline-item {t1Step === 1 ? 'selected' : ''}" onclick={() => t1Step = 1}>
								<div class="timeline-marker">1</div>
								<div class="timeline-content">
									<h3>Classical Encryption (RSA/ECC)</h3>
									<p>Modern public-key cryptography relies on the hardness of integer factorization (RSA) and discrete logarithm problems (ECC).</p>
								</div>
							</div>
							<div class="timeline-item {t1Step === 2 ? 'selected' : ''}" onclick={() => t1Step = 2}>
								<div class="timeline-marker danger">2</div>
								<div class="timeline-content">
									<h3>Enter: Quantum Computers</h3>
									<p>Shor's algorithm running on a cryptanalytically useful quantum computer will break RSA and ECC in hours by finding periods in modular calculations.</p>
								</div>
							</div>
							<div class="timeline-item {t1Step === 3 ? 'selected' : ''}" onclick={() => t1Step = 3}>
								<div class="timeline-marker warning">3</div>
								<div class="timeline-content">
									<h3>"Harvest Now, Decrypt Later"</h3>
									<p>Adversaries capture and store encrypted traffic today, waiting until a quantum computer is operational to retroactively decrypt it.</p>
								</div>
							</div>
							<div class="timeline-item {t1Step === 4 ? 'selected' : ''}" onclick={() => t1Step = 4}>
								<div class="timeline-marker success">4</div>
								<div class="timeline-content">
									<h3>Post-Quantum Cryptography (PQC)</h3>
									<p>PQC structures keys around algebraic lattices. Breaking them requires solving geometric multi-dimensional lattice vector problems (e.g. M-LWE), which are quantum-safe.</p>
								</div>
							</div>
						</div>

						<div class="stepper-controls">
							<button class="btn btn-secondary" onclick={prevT1Step} disabled={t1Step === 1}>Previous Step</button>
							<button class="btn btn-primary" onclick={nextT1Step} disabled={t1Step === 4}>Next Step</button>
						</div>
					</div>

					<!-- Visual Comparison Panel (Right) -->
					<div class="visual-panel">
						{#if quantumWaveActive}
							<div class="quantum-sweep-wave"></div>
						{/if}

						<div class="comparison-boxes">
							<!-- Classical Panel (Red glow) -->
							<div class="comparison-card classical {classicalBroken ? 'broken' : ''}">
								<div class="card-header-badge red-badge">
									{classicalBroken ? '❌ Vulnerable / Broken' : '⚠️ Classical (Vulnerable)'}
								</div>
								
								<div class="cipher-row">
									<div class="cipher-label">
										<span>RSA-2048</span>
										<small>{classicalBroken ? 'Broken by Shor\'s' : 'Factoring Prime Products'}</small>
									</div>
									<div class="cipher-bar-wrapper">
										<div class="cipher-bar red-fill" style="width: {classicalBroken ? '0%' : '100%'}"></div>
									</div>
								</div>

								<div class="cipher-row">
									<div class="cipher-label">
										<span>ECDH P-256</span>
										<small>{classicalBroken ? 'Broken by Shor\'s' : 'Discrete Logarithm curve'}</small>
									</div>
									<div class="cipher-bar-wrapper">
										<div class="cipher-bar red-fill" style="width: {classicalBroken ? '0%' : '100%'}"></div>
									</div>
								</div>

								<div class="cipher-row">
									<div class="cipher-label">
										<span>ECDSA</span>
										<small>{classicalBroken ? 'Broken by Shor\'s' : 'Identity Verification'}</small>
									</div>
									<div class="cipher-bar-wrapper">
										<div class="cipher-bar red-fill" style="width: {classicalBroken ? '0%' : '100%'}"></div>
									</div>
								</div>
							</div>

							<div class="versus-divider">VS</div>

							<!-- Post Quantum Panel (Green glow) -->
							<div class="comparison-card pqc {classicalBroken ? 'active-protection' : ''}">
								<div class="card-header-badge green-badge">✔️ Post-Quantum (CipherNova)</div>
								
								<div class="cipher-row">
									<div class="cipher-label">
										<span>ML-KEM-1024</span>
										<small>Module-LWE Lattice Keygen</small>
									</div>
									<div class="cipher-bar-wrapper">
										<div class="cipher-bar green-fill" style="width: 100%"></div>
									</div>
								</div>

								<div class="cipher-row">
									<div class="cipher-label">
										<span>Dilithium</span>
										<small>Module-Lattice Digital Signatures</small>
									</div>
									<div class="cipher-bar-wrapper">
										<div class="cipher-bar green-fill" style="width: 100%"></div>
									</div>
								</div>

								<div class="cipher-row">
									<div class="cipher-label">
										<span>ChaCha20</span>
										<small>Symmetric Stream Bulk Privacy</small>
									</div>
									<div class="cipher-bar-wrapper">
										<div class="cipher-bar green-fill" style="width: 100%"></div>
									</div>
								</div>
							</div>
						</div>

						<div class="attack-controls">
							<button class="btn btn-danger" onclick={runQuantumAttack} disabled={t1Animating}>
								{#if t1Animating}
									⏳ Animating Attack...
								{:else}
									💥 Simulate Shor's Quantum Attack
								{/if}
							</button>
							<button class="btn btn-secondary" onclick={resetQuantumAttack}>Reset</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 2: ML-KEM-1024 KEY EXCHANGE -->
		{#if activeTab === 2}
			<div class="tab-content" id="tab-2">
				<div class="content-header">
					<span class="content-icon">🔑</span>
					<h2>ML-KEM-1024 (CRYSTALS-Kyber) Key Exchange</h2>
				</div>
				<p class="content-lead">FIPS 203 — Lattice-based Key Encapsulation Mechanism</p>

				<div class="interactive-stage">
					<!-- Visual Handshake Arena -->
					<div class="handshake-arena">
						<!-- Alice -->
						<div class="party-node alice">
							<div class="avatar-large">👩‍🦰</div>
							<h4>Alice</h4>
							
							{#if showAliceKeys}
								<div class="key-pills animate-slide-in">
									<span class="key-pill blue-badge" title="Public ML-KEM Key">🔑 pk<sub>A</sub></span>
									<span class="key-pill red-badge" title="Private ML-KEM Key">🔒 sk<sub>A</sub></span>
								</div>
							{/if}

							{#if t2Step === 6}
								<div class="shared-key-pouch pouch-green animate-pulse">
									🔑 derived secret cached
								</div>
							{/if}
						</div>

						<!-- Signaling Server / Transit Area -->
						<div class="transit-tunnel">
							<div class="tunnel-line"></div>
							
							{#if pubKeyFlying}
								<div class="flying-packet pub-key-packet animate-fly-right">
									pk<sub>A</sub>
								</div>
							{/if}

							{#if cipherFlying}
								<div class="flying-packet cipher-packet animate-fly-left">
									c (ciphertext)
								</div>
							{/if}

							<div class="server-node glass">
								<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--secondary)"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
								<small>Signal Server</small>
							</div>
						</div>

						<!-- Bob -->
						<div class="party-node bob">
							<div class="avatar-large">👨‍🦱</div>
							<h4>Bob</h4>

							{#if showBobKeys}
								<div class="key-pills animate-slide-in">
									<span class="key-pill blue-badge">🔑 pk<sub>A</sub></span>
								</div>
							{/if}

							{#if t2Step >= 3}
								<div class="shared-key-pouch pouch-green animate-pulse">
									🔑 secret derived
								</div>
							{/if}
						</div>
					</div>

					<!-- Narration & Execution Block -->
					<div class="execution-log-box glass">
						<div class="log-title">🚀 Handshake Execution Sequence (Step {t2Step} of 5)</div>
						
						<div class="log-steps-list">
							<div class="log-step-row {t2Step === 1 ? 'active' : ''}">
								<span class="log-bullet">1</span>
								<p><strong>Alice generates ML-KEM key pair:</strong> Using CRYSTALS-Kyber lattice math, Alice creates a public key (pk) and secret key (sk). The public key is based on the Learning With Errors (LWE) problem — hard for both classical and quantum computers.</p>
							</div>
							<div class="log-step-row {t2Step === 2 ? 'active' : ''}">
								<span class="log-bullet">2</span>
								<p><strong>Alice publishes her public key:</strong> Alice sends her public key pk<sub>A</sub> over the network to the server so that Bob can retrieve it.</p>
							</div>
							<div class="log-step-row {t2Step === 3 ? 'active' : ''}">
								<span class="log-bullet">3</span>
								<p><strong>Bob encapsulates a shared secret:</strong> Bob retrieves pk<sub>A</sub>, generates a random 32-byte secret key locally, and wraps (encapsulates) it using Alice's public key. This produces a secure <strong>Ciphertext (c)</strong>.</p>
							</div>
							<div class="log-step-row {t2Step === 4 ? 'active' : ''}">
								<span class="log-bullet">4</span>
								<p><strong>Bob sends ciphertext back:</strong> Bob transmits the encapsulated Ciphertext (c) over the SSE socket line to Alice's active connection.</p>
							</div>
							<div class="log-step-row {t2Step === 5 ? 'active' : ''}">
								<span class="log-bullet">5</span>
								<p><strong>Alice decapsulates the shared secret:</strong> Alice receives Ciphertext (c) and decapsulates it using her private key sk<sub>A</sub>. Both parties now possess the identical shared key without ever transmitting it over the wire!</p>
							</div>
						</div>

						{#if derivedSecret}
							<div class="derived-secret-visual animate-fade-in">
								<div class="visual-header">🔑 Identical Shared Key Derived Securely</div>
								<div class="secret-hex-row">
									<span>Derived Shared Secret:</span> <code>{derivedSecret}</code> <span class="hex-match">Hex Verification: {secretHex} ✔️</span>
								</div>
							</div>
						{/if}

						<div class="animation-buttons">
							<button class="btn btn-primary" onclick={startKemStep} disabled={t2Animating || t2Step > 5}>
								{#if t2Animating}
									⏳ Processing...
								{:else if t2Step === 6}
									✔️ Key Exchange Complete!
								{:else}
									⚙️ Run Step {t2Step}
								{/if}
							</button>
							<button class="btn btn-secondary" onclick={resetKemDemo}>Reset Handshake</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 3: CRYSTALS-DILITHIUM SIGNATURES -->
		{#if activeTab === 3}
			<div class="tab-content" id="tab-3">
				<div class="content-header">
					<span class="content-icon">✍️</span>
					<h2>CRYSTALS-Dilithium Signatures</h2>
				</div>
				<p class="content-lead">FIPS 204 — Quantum-Safe Digital Signatures & Authentication</p>

				<div class="interactive-stage">
					<div class="handshake-arena">
						<!-- Alice -->
						<div class="party-node alice">
							<div class="avatar-large">👩‍🦰</div>
							<h4>Alice (Signer)</h4>
							
							{#if dsaAliceKeys}
								<div class="key-pills animate-slide-in">
									<span class="key-pill blue-badge" title="Verification Key">🔑 vk (public)</span>
									<span class="key-pill red-badge" title="Signing Key">✍️ sk (secret)</span>
								</div>
							{/if}
						</div>

						<!-- Sign/Verify Box -->
						<div class="signature-box-wrapper">
							{#if t3Step === 2}
								<div class="dsa-box-card sign-step-card animate-pulse">
									<div class="dsa-card-header">✍️ Sign(sk, msg)</div>
									<small>m = "Hello Bob"</small>
									<div class="dsa-tag">σ = signature</div>
								</div>
							{/if}

							{#if dsaSigFlying}
								<div class="dsa-flying-envelope animate-fly-right">
									✉️ msg + σ
								</div>
							{/if}

							{#if t3Step >= 4}
								<div class="dsa-box-card verify-step-card {dsaVerificationSuccess ? 'success-card' : ''}">
									<div class="dsa-card-header">✔️ Verify(vk, msg, σ)</div>
									{#if dsaVerificationSuccess}
										<div class="success-alert">TRUE ✔️</div>
									{:else}
										<div class="progress-alert">Verifying parameters...</div>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Bob -->
						<div class="party-node bob">
							<div class="avatar-large">👨‍🦱</div>
							<h4>Bob (Verifier)</h4>

							{#if t3Step >= 3}
								<div class="key-pills animate-slide-in">
									<span class="key-pill blue-badge">🔑 vk (public)</span>
								</div>
							{/if}

							{#if dsaVerificationSuccess}
								<div class="shared-key-pouch pouch-green animate-pulse">
									✔️ Authentic
								</div>
							{/if}
						</div>
					</div>

					<!-- Narrative -->
					<div class="execution-log-box glass">
						<div class="log-title">🚀 Authentication Pipeline (Step {t3Step} of 4)</div>
						
						<div class="log-steps-list">
							<div class="log-step-row {t3Step === 1 ? 'active' : ''}">
								<span class="log-bullet">1</span>
								<p><strong>Alice generates Dilithium key pair:</strong> Alice generates a long-term post-quantum public verification key (vk) and private signing key (sk) on her browser.</p>
							</div>
							<div class="log-step-row {t3Step === 2 ? 'active' : ''}">
								<span class="log-bullet">2</span>
								<p><strong>Alice signs the message:</strong> Alice inputs the message ("Hello Bob") and her private signing key (sk) into the Dilithium algorithm, producing a digital signature (σ).</p>
							</div>
							<div class="log-step-row {t3Step === 3 ? 'active' : ''}">
								<span class="log-bullet">3</span>
								<p><strong>Signature is transmitted with the message:</strong> The message combined with the signature (msg + σ) is sent over the signal server network.</p>
							</div>
							<div class="log-step-row {t3Step === 4 ? 'active' : ''}">
								<span class="log-bullet">4</span>
								<p><strong>Bob verifies the signature:</strong> Bob retrieves Alice's public verification key (vk), and checks the signature against the message. If the math verifies, Bob is 100% certain the message was sent by Alice and was not modified by an attacker in transit!</p>
							</div>
						</div>

						<div class="animation-buttons">
							<button class="btn btn-primary" onclick={runDsaStep} disabled={t3Animating || t3Step > 4}>
								{#if t3Animating}
									⏳ Processing...
								{:else if t3Step === 5}
									✔️ Verification Complete!
								{:else}
									⚙️ Run Step {t3Step}
								{/if}
							</button>
							<button class="btn btn-secondary" onclick={resetDsaDemo}>Reset Signature Demo</button>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 4: CHACHA20-POLY1305 ENCRYPTION -->
		{#if activeTab === 4}
			<div class="tab-content" id="tab-4">
				<div class="content-header">
					<span class="content-icon">🔒</span>
					<h2>ChaCha20-Poly1305 Encryption</h2>
				</div>
				<p class="content-lead">Authenticated Symmetric Encryption — Fast, Low-Overhead Bulk Data Privacy</p>

				<div class="tab-grid-layout">
					<!-- Interactive Input Control (Left) -->
					<div class="narrative-panel">
						<div class="symmetric-console glass">
							<div class="form-group">
								<label>Plaintext Message (m)</label>
								<input type="text" bind:value={t4Input} class="input-field" disabled={t4State !== 'plain'} placeholder="Type a message..." />
							</div>

							<div class="form-group">
								<label>Derived 256-bit Session Key (k)</label>
								<input type="text" value={t4KeyHex} class="input-field monospace-field" disabled />
							</div>

							<div class="form-group">
								<label>Initialization Vector (iv)</label>
								<input type="text" value={t4IvHex} class="input-field monospace-field" disabled />
							</div>

							<div class="action-buttons-symmetric">
								<button class="btn btn-primary" onclick={handleEncrypt} disabled={t4State !== 'plain'}>
									🔒 Encrypt Message
								</button>
								<button class="btn btn-success" onclick={handleDecrypt} disabled={t4State !== 'encrypted'}>
									🔓 Decrypt Message
								</button>
								<button class="btn btn-secondary" onclick={resetSymmetricDemo}>
									Reset Console
								</button>
							</div>
						</div>
					</div>

					<!-- Visual cipher transformation (Right) -->
					<div class="visual-panel">
						<div class="cipher-stage glass">
							<!-- Plain Text State -->
							{#if t4State === 'plain'}
								<div class="stage-state animate-fade-in">
									<div class="stage-state-badge">PLAIN DATA</div>
									<div class="stage-text-block plaintext-glow">{t4Input}</div>
									<small class="stage-caption">Waiting to apply ChaCha20-Poly1305 ciphers...</small>
								</div>
							{/if}

							<!-- Encrypting State -->
							{#if t4State === 'encrypting'}
								<div class="stage-state encrypting-active">
									<div class="stage-state-badge warning-badge">ENCRYPTING IN PROGRESS</div>
									<div class="cipher-wheel-container">
										<div class="cipher-wheel">⚙️</div>
									</div>
									<div class="shuffled-bytes">XOR-ing binary array with 256-bit key...</div>
								</div>
							{/if}

							<!-- Encrypted State -->
							{#if t4State === 'encrypted'}
								<div class="stage-state animate-fade-in">
									<div class="stage-state-badge danger-badge">ENCRYPTED CIPHERTEXT IN TRANSIT</div>
									<div class="stage-text-block ciphertext-glow">{t4Ciphertext}</div>
									
									<div class="transit-database-card">
										<small style="color: var(--secondary)">🔒 SERVER DATABASE VIEW</small>
										<pre style="font-size: 0.75rem; margin: 5px 0"><code>{`{
  "sender": "alice",
  "receiver": "bob",
  "ciphertext": "${t4Ciphertext.substring(0, 15)}...",
  "iv": "${t4IvHex}"
}`}</code></pre>
									</div>
								</div>
							{/if}

							<!-- Decrypting State -->
							{#if t4State === 'decrypting'}
								<div class="stage-state encrypting-active">
									<div class="stage-state-badge warning-badge">DECRYPTING IN PROGRESS</div>
									<div class="cipher-wheel-container">
										<div class="cipher-wheel reverse">⚙️</div>
									</div>
									<div class="shuffled-bytes">Verifying Poly1305 MAC tag and decapsulating...</div>
								</div>
							{/if}

							<!-- Decrypted State -->
							{#if t4State === 'decrypted'}
								<div class="stage-state animate-fade-in">
									<div class="stage-state-badge success-badge">DECRYPTED SUCCESSFULLY</div>
									<div class="stage-text-block plaintext-glow">{t4DecryptedText}</div>
									<small class="stage-caption">Recipient Bob reads Alice's verified plain text!</small>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Stepper Footer (Bottom Nav) -->
		<footer class="tab-navigation-footer">
			<div class="page-indicator">{activeTab} / 4</div>
			<div class="stepper-buttons-row">
				<button class="btn btn-secondary" onclick={prevTab} disabled={activeTab === 1}>Previous</button>
				<button class="btn btn-primary" onclick={nextTab} disabled={activeTab === 4}>Next</button>
			</div>
		</footer>

	</main>
</div>

<style>
	/* HSL Dark Theme and variables */
	:global(:root) {
		--bg-dark: #070a12;
		--glass-bg: rgba(15, 23, 42, 0.4);
		--glass-border: rgba(255, 255, 255, 0.08);
		--primary: #3b82f6;
		--accent: #8b5cf6;
		--secondary: #10b981;
		--danger: #ef4444;
		--warning: #f59e0b;
		--text-muted: #64748b;
		--radius-lg: 16px;
		--radius-md: 12px;
		--radius-sm: 8px;
	}

	:global(body) {
		background: var(--bg-dark);
		background-image: 
			radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
			radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
	}

	.demo-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		font-family: 'Inter', sans-serif;
		padding-bottom: 4rem;
	}

	/* Glassmorphism Panel styles */
	.glass-panel {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(16px);
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
	}

	/* Navbar */
	.navbar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		border-radius: 0;
		border-left: none;
		border-right: none;
		border-top: none;
		background: rgba(7, 10, 18, 0.8);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}
	.logo-icon {
		background: linear-gradient(135deg, var(--primary), var(--accent));
		width: 36px; height: 36px;
		border-radius: 10px;
		display: flex; justify-content: center; align-items: center;
		box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
		color: white;
	}
	.brand-name {
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}
	.nav-link {
		color: #94a3b8;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}
	.nav-link:hover { color: white; }
	.nav-link.active {
		color: white;
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.icon-btn {
		background: transparent; border: none; color: #94a3b8; cursor: pointer;
	}
	.icon-btn:hover { color: white; }
	.language-selector {
		display: flex; align-items: center; gap: 0.3rem; color: #cbd5e1; font-size: 0.85rem; cursor: pointer;
	}
	.nav-login-btn {
		background: transparent; border: none; color: white; font-weight: 500; cursor: pointer; font-size: 0.95rem;
	}
	.nav-register-btn {
		background: var(--accent); border: none; color: white; padding: 0.5rem 1.2rem; border-radius: 6px; font-weight: 500; cursor: pointer; transition: background 0.2s; font-size: 0.95rem;
	}
	.nav-register-btn:hover { background: #7c3aed; }

	/* Hero Section */
	.hero-section {
		width: 100%;
		max-width: 1200px;
		text-align: center;
		padding: 4rem 1rem 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.badge {
		background: rgba(59, 130, 246, 0.15);
		color: #93c5fd;
		border: 1px solid rgba(59, 130, 246, 0.3);
		padding: 0.4rem 1.2rem;
		border-radius: 30px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 1px;
		margin-bottom: 1.5rem;
	}
	.hero-title {
		font-size: 3.5rem;
		font-weight: 800;
		margin: 0 0 1rem;
		background: linear-gradient(to right, #fff, #94a3b8);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.hero-subtitle {
		font-size: 1.5rem;
		font-weight: 500;
		color: #cbd5e1;
		margin: 0 0 1.5rem;
	}
	.hero-description {
		color: #94a3b8;
		line-height: 1.6;
		font-size: 1.05rem;
	}

	/* Tabs */
	.tabs-container {
		width: 100%;
		max-width: 1000px;
		margin-bottom: 2rem;
	}
	.tabs-wrapper {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.tab-btn {
		background: rgba(30, 41, 59, 0.4);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		padding: 1rem;
		display: flex;
		align-items: flex-start;
		text-align: left;
		cursor: pointer;
		position: relative;
		transition: all 0.3s;
		color: white;
	}
	.tab-btn:hover {
		background: rgba(59, 130, 246, 0.1);
		border-color: rgba(59, 130, 246, 0.3);
	}
	.tab-btn.active {
		background: rgba(59, 130, 246, 0.15);
		border-color: rgba(59, 130, 246, 0.5);
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
	}
	.tab-icon {
		font-size: 1.5rem;
		margin-right: 0.8rem;
		background: rgba(0,0,0,0.2);
		padding: 0.4rem;
		border-radius: 6px;
	}
	.tab-title {
		font-weight: 600;
		font-size: 0.9rem;
		margin-bottom: 0.2rem;
	}
	.tab-subtitle {
		font-size: 0.7rem;
		color: #94a3b8;
		line-height: 1.3;
	}
	.tab-number {
		position: absolute;
		top: -8px;
		right: -8px;
		background: var(--primary);
		color: white;
		width: 20px; height: 20px;
		border-radius: 50%;
		display: flex; justify-content: center; align-items: center;
		font-size: 0.7rem;
		font-weight: bold;
		box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
	}

	.progress-bar-container {
		width: 100%;
		height: 4px;
		background: rgba(255,255,255,0.05);
		border-radius: 4px;
		overflow: hidden;
	}
	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--primary), var(--accent));
		transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Content Section */
	.content-section {
		width: 100%;
		max-width: 1000px;
		padding: 3rem;
		background: rgba(15, 20, 35, 0.6);
	}

	.content-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}
	.content-icon { font-size: 2rem; }
	.content-header h2 {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0;
	}
	.content-lead {
		color: #94a3b8;
		font-size: 1.1rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.1);
		padding-bottom: 1rem;
	}

	/* Grid layouts */
	.tab-grid-layout {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 2.5rem;
		align-items: start;
	}

	/* Timeline Stepper for Tab 1 */
	.timeline {
		position: relative;
		padding-left: 2rem;
	}
	.timeline::before {
		content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
		background: rgba(255,255,255,0.05);
	}
	.timeline-item {
		position: relative; margin-bottom: 1.5rem; cursor: pointer;
		padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid transparent;
		transition: all 0.2s;
	}
	.timeline-item:hover {
		background: rgba(255, 255, 255, 0.02);
	}
	.timeline-item.selected {
		background: rgba(59, 130, 246, 0.05);
		border-color: rgba(59, 130, 246, 0.2);
	}
	.timeline-marker {
		position: absolute; left: -2.7rem; top: 1rem;
		width: 24px; height: 24px; border-radius: 50%;
		background: #1e293b; color: #94a3b8;
		display: flex; justify-content: center; align-items: center;
		font-size: 0.8rem; font-weight: bold;
		border: 2px solid var(--bg-dark);
		transition: all 0.2s;
	}
	.timeline-item.selected .timeline-marker {
		background: var(--primary);
		color: white;
		box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
	}
	.timeline-item.selected .timeline-marker.danger { background: var(--danger); }
	.timeline-item.selected .timeline-marker.warning { background: var(--warning); }
	.timeline-item.selected .timeline-marker.success { background: var(--secondary); }
	
	.timeline-content h3 { margin: 0 0 0.25rem; font-size: 1.05rem; font-weight: 600; }
	.timeline-content p { color: #94a3b8; line-height: 1.4; margin: 0; font-size: 0.85rem; }

	.stepper-controls {
		margin-top: 1.5rem;
		display: flex;
		gap: 0.5rem;
	}

	/* Visual Panel for Tab 1 */
	.visual-panel {
		position: relative;
		border: 1px solid var(--glass-border);
		background: rgba(0,0,0,0.15);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		overflow: hidden;
	}

	/* Quantum sweep wave animation */
	.quantum-sweep-wave {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
		z-index: 5;
		transform: translateX(-100%);
		animation: sweepWave 3s ease-in-out;
		pointer-events: none;
	}

	@keyframes sweepWave {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.comparison-boxes {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
	}

	.comparison-card {
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		padding: 1.2rem;
		background: rgba(15, 23, 42, 0.6);
		transition: all 0.3s;
	}

	.comparison-card.classical {
		border-color: rgba(239, 68, 68, 0.2);
		box-shadow: 0 0 15px rgba(239, 68, 68, 0.05);
	}
	.comparison-card.classical.broken {
		border-color: rgba(239, 68, 68, 0.5);
		box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
		opacity: 0.7;
	}

	.comparison-card.pqc {
		border-color: rgba(16, 185, 129, 0.2);
		box-shadow: 0 0 15px rgba(16, 185, 129, 0.05);
	}
	.comparison-card.pqc.active-protection {
		border-color: rgba(16, 185, 129, 0.6);
		box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
	}

	.card-header-badge {
		font-size: 0.75rem;
		font-weight: bold;
		padding: 0.25rem 0.6rem;
		border-radius: 12px;
		display: inline-block;
		margin-bottom: 1rem;
	}
	.red-badge { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
	.green-badge { background: rgba(16, 185, 129, 0.15); color: #a7f3d0; border: 1px solid rgba(16, 185, 129, 0.3); }
	.blue-badge { background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
	.warning-badge { background: rgba(245, 158, 11, 0.15); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.3); }
	.danger-badge { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
	.success-badge { background: rgba(16, 185, 129, 0.15); color: #a7f3d0; border: 1px solid rgba(16, 185, 129, 0.3); }

	.cipher-row {
		margin-bottom: 0.75rem;
	}
	.cipher-row:last-child { margin-bottom: 0; }

	.cipher-label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.25rem;
		font-size: 0.85rem;
	}
	.cipher-label span { font-weight: 600; }
	.cipher-label small { color: #64748b; font-size: 0.7rem; }

	.cipher-bar-wrapper {
		width: 100%;
		height: 6px;
		background: rgba(0,0,0,0.4);
		border-radius: 4px;
		overflow: hidden;
	}
	.cipher-bar {
		height: 100%;
		border-radius: 4px;
		transition: width 1.5s ease-out, background-color 0.5s;
	}
	.red-fill { background-color: var(--danger); box-shadow: 0 0 5px var(--danger); }
	.green-fill { background-color: var(--secondary); box-shadow: 0 0 5px var(--secondary); }

	.versus-divider {
		position: absolute;
		top: 50%; left: 50%;
		transform: translate(-50%, -50%);
		background: var(--bg-dark);
		border: 1px solid var(--glass-border);
		width: 32px; height: 32px;
		border-radius: 50%;
		display: flex; justify-content: center; align-items: center;
		font-size: 0.8rem; font-weight: bold; color: var(--text-muted);
		z-index: 10;
	}

	.attack-controls {
		display: flex;
		gap: 0.5rem;
	}

	/* Interactive Stage for Tab 2 / 3 */
	.interactive-stage {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.handshake-arena {
		height: 180px;
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		background: rgba(0,0,0,0.15);
		padding: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.party-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 120px;
		position: relative;
		z-index: 10;
	}

	.avatar-large {
		font-size: 2.5rem;
		background: rgba(255, 255, 255, 0.05);
		width: 70px; height: 70px;
		border-radius: 20px;
		display: flex; justify-content: center; align-items: center;
		border: 1px solid var(--glass-border);
		box-shadow: 0 4px 20px rgba(0,0,0,0.3);
		margin-bottom: 0.5rem;
	}

	.party-node h4 { margin: 0; font-size: 0.95rem; font-weight: 600; }

	.key-pills {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.5rem;
		position: absolute;
		bottom: -55px;
	}
	.key-pill {
		font-size: 0.65rem;
		font-weight: bold;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		display: inline-block;
	}

	.shared-key-pouch {
		margin-top: 0.5rem;
		font-size: 0.65rem;
		font-weight: bold;
		padding: 0.2rem 0.5rem;
		border-radius: 20px;
		border: 1px solid rgba(16, 185, 129, 0.4);
		background: rgba(16, 185, 129, 0.15);
		color: #a7f3d0;
		box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
		position: absolute;
		bottom: -35px;
	}

	.transit-tunnel {
		flex: 1;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 0 1rem;
	}
	.tunnel-line {
		position: absolute;
		left: 0; right: 0; height: 2px;
		background: dashed rgba(255,255,255,0.05);
		z-index: 1;
	}

	.server-node {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		padding: 0.4rem 0.8rem;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		z-index: 5;
	}
	.server-node small { font-size: 0.65rem; color: var(--text-muted); }

	/* Flying Packets */
	.flying-packet {
		position: absolute;
		top: 30%;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		border-radius: 20px;
		color: white;
		font-size: 0.7rem;
		font-weight: bold;
		padding: 0.3rem 0.8rem;
		box-shadow: 0 4px 15px rgba(59, 130, 246, 0.5);
		z-index: 20;
	}

	@keyframes flyRight {
		0% { left: 10%; transform: scale(0.8); opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { left: 80%; transform: scale(1); }
	}

	@keyframes flyLeft {
		0% { right: 10%; transform: scale(0.8); opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { right: 80%; transform: scale(1); }
	}

	.animate-fly-right {
		animation: flyRight 1.5s forwards cubic-bezier(0.25, 1, 0.5, 1);
	}
	.animate-fly-left {
		animation: flyLeft 1.5s forwards cubic-bezier(0.25, 1, 0.5, 1);
	}

	/* Stepper Log Box */
	.execution-log-box {
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		background: rgba(15, 23, 42, 0.6);
	}
	.log-title {
		font-weight: 700;
		color: #93c5fd;
		font-size: 0.95rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid rgba(255,255,255,0.05);
		padding-bottom: 0.5rem;
	}
	.log-steps-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.log-step-row {
		display: flex;
		gap: 1rem;
		opacity: 0.4;
		transition: all 0.3s;
		padding: 0.4rem;
		border-radius: 6px;
	}
	.log-step-row.active {
		opacity: 1;
		background: rgba(255,255,255,0.02);
	}
	.log-bullet {
		background: #1e293b;
		color: #94a3b8;
		width: 20px; height: 20px;
		border-radius: 50%;
		display: flex; justify-content: center; align-items: center;
		font-size: 0.75rem; font-weight: bold;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}
	.log-step-row.active .log-bullet {
		background: var(--primary);
		color: white;
	}
	.log-step-row p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		color: #cbd5e1;
	}
	.log-step-row.active p {
		color: white;
	}

	.derived-secret-visual {
		margin-top: 1.5rem;
		background: rgba(16, 185, 129, 0.05);
		border: 1px dashed rgba(16, 185, 129, 0.3);
		padding: 1rem;
		border-radius: 8px;
	}
	.visual-header {
		color: var(--secondary);
		font-size: 0.8rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	.secret-hex-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
	}
	.secret-hex-row code {
		font-family: monospace; color: #a5b4fc; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;
	}
	.hex-match {
		color: var(--secondary); font-weight: bold; font-size: 0.8rem;
	}

	.animation-buttons {
		margin-top: 1.5rem;
		display: flex;
		gap: 0.5rem;
	}

	/* Tab 3 Signature box styles */
	.signature-box-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
		padding: 0 1rem;
	}

	.dsa-box-card {
		background: rgba(15, 23, 42, 0.8);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		padding: 0.8rem 1.2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		box-shadow: 0 4px 20px rgba(0,0,0,0.3);
	}
	.dsa-card-header {
		font-weight: bold;
		font-size: 0.85rem;
		color: var(--accent);
	}
	.dsa-tag {
		font-size: 0.7rem;
		background: rgba(139, 92, 246, 0.15);
		border: 1px solid rgba(139, 92, 246, 0.3);
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		color: #c084fc;
	}
	.dsa-flying-envelope {
		background: linear-gradient(135deg, var(--accent), var(--secondary));
		box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
		padding: 0.4rem 0.8rem;
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: bold;
		z-index: 20;
		animation: flyRight 1.5s forwards cubic-bezier(0.25, 1, 0.5, 1);
	}

	.verify-step-card {
		border-color: rgba(255,255,255,0.05);
	}
	.verify-step-card.success-card {
		border-color: rgba(16, 185, 129, 0.4);
		box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
	}
	.success-alert {
		color: var(--secondary); font-weight: bold; font-size: 0.95rem; margin-top: 0.25rem;
	}
	.progress-alert {
		color: var(--text-muted); font-size: 0.75rem;
	}

	/* Tab 4 Symmetric styles */
	.symmetric-console {
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		background: rgba(15, 23, 42, 0.6);
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.form-group label {
		font-size: 0.75rem;
		font-weight: bold;
		color: #94a3b8;
	}
	.input-field {
		width: 100%;
		padding: 0.65rem 0.8rem;
		background: rgba(0,0,0,0.3);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-sm);
		color: white;
		font-size: 0.9rem;
	}
	.input-field:focus {
		outline: none;
		border-color: var(--primary);
	}
	.monospace-field {
		font-family: monospace;
		font-size: 0.8rem;
		color: #a5b4fc;
	}

	.action-buttons-symmetric {
		display: flex;
		gap: 0.5rem;
	}

	.cipher-stage {
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		background: rgba(0,0,0,0.15);
		height: 100%;
		min-height: 250px;
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.stage-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.stage-state-badge {
		font-size: 0.7rem;
		font-weight: bold;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		background: rgba(255,255,255,0.05);
		border: 1px solid rgba(255,255,255,0.1);
		color: #94a3b8;
	}

	.stage-text-block {
		background: rgba(0,0,0,0.4);
		border: 1px solid var(--glass-border);
		padding: 1rem 1.5rem;
		border-radius: var(--radius-md);
		font-size: 1.3rem;
		font-weight: bold;
		word-break: break-all;
		width: 100%;
		max-width: 320px;
	}

	.plaintext-glow {
		color: white;
		text-shadow: 0 0 10px rgba(255,255,255,0.2);
	}
	.ciphertext-glow {
		color: #a5b4fc;
		font-family: monospace;
		text-shadow: 0 0 10px rgba(165, 180, 252, 0.3);
		font-size: 1.1rem;
	}

	.stage-caption {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.cipher-wheel-container {
		font-size: 4rem;
		animation: rotateWheel 2s linear infinite;
		line-height: 1;
	}
	.cipher-wheel {
		display: inline-block;
	}
	.cipher-wheel.reverse {
		animation: rotateWheelReverse 2s linear infinite;
	}

	@keyframes rotateWheel {
		to { transform: rotate(360deg); }
	}
	@keyframes rotateWheelReverse {
		to { transform: rotate(-360deg); }
	}

	.shuffled-bytes {
		font-family: monospace;
		font-size: 0.75rem;
		color: var(--primary);
	}

	.transit-database-card {
		background: rgba(0,0,0,0.3);
		border: 1px dashed rgba(259, 130, 246, 0.2);
		border-radius: 8px;
		padding: 0.75rem;
		width: 100%;
		max-width: 320px;
		text-align: left;
	}

	/* Buttons and UI elements */
	.btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		font-size: 0.85rem;
		border: 1px solid transparent;
		transition: all 0.2s;
	}
	.btn-primary {
		background: var(--primary);
		color: white;
		box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
	}
	.btn-primary:hover {
		background: #2563eb;
	}
	.btn-secondary {
		background: rgba(255,255,255,0.05);
		border-color: var(--glass-border);
		color: #cbd5e1;
	}
	.btn-secondary:hover {
		background: rgba(255,255,255,0.1);
	}
	.btn-danger {
		background: var(--danger);
		color: white;
		box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
	}
	.btn-danger:hover { background: #dc2626; }
	
	.btn-success {
		background: var(--secondary);
		color: white;
		box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
	}
	.btn-success:hover { background: #059669; }

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		box-shadow: none;
	}

	/* Footer Stepper Nav */
	.tab-navigation-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 3rem;
		border-top: 1px solid rgba(255,255,255,0.05);
		padding-top: 1.5rem;
	}
	.page-indicator {
		font-size: 0.85rem;
		color: var(--text-muted);
		font-weight: bold;
	}
	.stepper-buttons-row {
		display: flex;
		gap: 0.5rem;
	}

	/* Animation Helpers */
	.animate-fade-in {
		animation: fadeIn 0.3s ease-out forwards;
	}
	.animate-slide-in {
		animation: slideIn 0.3s ease-out forwards;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideIn {
		from { transform: translateY(10px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}
</style>
