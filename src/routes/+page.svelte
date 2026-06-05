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
		goto('/login');
	}

	function navigateToRegister() {
		goto('/register');
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
			<a href="#" class="nav-link">Home</a>
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
			<button class="nav-register-btn" onclick={navigateToRegister}>Register</button>
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
		{#if activeTab === 1}
			<div class="tab-content" id="tab-1">
				<div class="content-header">
					<span class="content-icon">⚛️</span>
					<h2>The Quantum Threat to Classical Cryptography</h2>
				</div>
				<p class="content-lead">Understanding why RSA and ECC must be replaced</p>
				
				<div class="timeline">
					<div class="timeline-item">
						<div class="timeline-marker">1</div>
						<div class="timeline-content">
							<h3>Classical Encryption (RSA/ECC)</h3>
							<p>Modern internet security relies on the mathematical difficulty of factoring large prime numbers (RSA) or solving discrete logarithms (ECC). For classical computers, these problems take billions of years to crack, keeping our data secure.</p>
						</div>
					</div>
					<div class="timeline-item">
						<div class="timeline-marker danger">2</div>
						<div class="timeline-content">
							<h3 style="color: #ef4444">Shor's Algorithm & Quantum Computers</h3>
							<p>In 1994, Peter Shor discovered a quantum algorithm that can solve both integer factorization and discrete logarithms exponentially faster. A sufficiently large, fault-tolerant quantum computer (CRQC) running Shor's algorithm will completely break RSA and ECC in hours, not millennia.</p>
						</div>
					</div>
					<div class="timeline-item">
						<div class="timeline-marker warning">3</div>
						<div class="timeline-content">
							<h3 style="color: #f59e0b">"Harvest Now, Decrypt Later"</h3>
							<p>Adversaries are currently intercepting and storing encrypted network traffic. While they cannot read it today, they are waiting until CRQCs are built to retroactively decrypt sensitive communications.</p>
						</div>
					</div>
					<div class="timeline-item">
						<div class="timeline-marker success">4</div>
						<div class="timeline-content">
							<h3 style="color: #10b981">The PQC Solution</h3>
							<p>Post-Quantum Cryptography (PQC) replaces these vulnerable math problems with new ones—like Learning With Errors (LWE) over lattices—which are mathematically resistant to both classical and quantum computer attacks.</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 2}
			<div class="tab-content" id="tab-2">
				<div class="content-header">
					<span class="content-icon">🔑</span>
					<h2>ML-KEM-1024 (Kyber) Key Exchange</h2>
				</div>
				<p class="content-lead">NIST-Approved Lattice-Based Key Encapsulation Mechanism</p>
				
				<div class="info-grid">
					<div class="info-card">
						<h3>The Mathematical Foundation</h3>
						<p>ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism) is based on the computationally hard <strong>Module Learning With Errors (M-LWE)</strong> problem. Instead of prime numbers, it uses multi-dimensional lattice structures with intentional random "noise" added to equations, making it impossible for quantum algorithms to find the hidden keys.</p>
					</div>
					<div class="info-card">
						<h3>Security Level: 1024</h3>
						<p>We are using the highest security parameter set, ML-KEM-1024 (formerly Kyber-1024). It is classified by NIST as providing <strong>Category 5 security</strong>, meaning it is computationally equivalent to breaking AES-256 using brute force.</p>
					</div>
				</div>

				<div class="process-flow">
					<div class="process-step">
						<div class="step-title">1. Key Generation</div>
						<div class="step-desc">Alice generates an ephemeral ML-KEM-1024 public and private key pair locally on her device.</div>
					</div>
					<div class="process-arrow">➔</div>
					<div class="process-step">
						<div class="step-title">2. Encapsulation</div>
						<div class="step-desc">Bob uses Alice's public key to encapsulate (hide) a 32-byte shared symmetric secret, creating a ciphertext.</div>
					</div>
					<div class="process-arrow">➔</div>
					<div class="process-step">
						<div class="step-title">3. Decapsulation</div>
						<div class="step-desc">Alice receives the ciphertext and uses her private key to extract the exact same 32-byte shared secret.</div>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 3}
			<div class="tab-content" id="tab-3">
				<div class="content-header">
					<span class="content-icon">✍️</span>
					<h2>CRYSTALS-Dilithium Signatures</h2>
				</div>
				<p class="content-lead">Quantum-Safe Digital Signatures and Authentication</p>
				
				<div class="info-grid">
					<div class="info-card" style="grid-column: span 2;">
						<h3>Why Key Exchange isn't enough</h3>
						<p>While ML-KEM allows two parties to agree on a secret securely, it does not prove <em>who</em> you are talking to. Without authentication, a Man-In-The-Middle (MITM) attacker with a quantum computer could simply intercept the key exchange. We must replace classical RSA/ECDSA signatures with a post-quantum alternative.</p>
					</div>
					<div class="info-card">
						<h3>Fiat-Shamir with Aborts</h3>
						<p>CRYSTALS-Dilithium is a lattice-based signature scheme. It uses a technique called the "Fiat-Shamir with Aborts" framework over module lattices. It ensures that the signature does not leak any information about the secret key, even after millions of signatures.</p>
					</div>
					<div class="info-card">
						<h3>Authentication Flow</h3>
						<p>In our platform, each user generates a long-term Dilithium identity keypair. Before the ML-KEM key exchange occurs, the user cryptographically signs their public parameters. The receiver verifies the Dilithium signature to cryptographically prove the sender's identity.</p>
					</div>
				</div>
			</div>
		{/if}

		{#if activeTab === 4}
			<div class="tab-content" id="tab-4">
				<div class="content-header">
					<span class="content-icon">🔒</span>
					<h2>ChaCha20-Poly1305 Encryption</h2>
				</div>
				<p class="content-lead">Fast, Authenticated Symmetric Bulk Encryption</p>
				
				<div class="info-grid">
					<div class="info-card">
						<h3>Symmetric vs Asymmetric</h3>
						<p>Public-key algorithms (like ML-KEM) are slow and only used to safely transmit a small 32-byte secret key over the network. Once Alice and Bob both have this derived secret key, they switch to a much faster symmetric algorithm to encrypt the actual text messages, files, and WebRTC streams.</p>
					</div>
					<div class="info-card">
						<h3>Why ChaCha20?</h3>
						<p>Grover's algorithm halves the effective security of symmetric ciphers against quantum computers. A 256-bit key is required for post-quantum safety. We utilize ChaCha20-Poly1305 (256-bit), a highly secure, extremely fast stream cipher that is immune to timing attacks and performs remarkably well on mobile devices without hardware acceleration.</p>
					</div>
				</div>

				<div class="code-block glass">
					<div class="code-header">Zero-Knowledge Implementation (src/lib/crypto.js)</div>
					<pre><code>// The 32-byte shared secret derived from ML-KEM
const derivedSecretKey = await MLKEM.decapsulate(ciphertext, privateKey);

// Fast symmetric authenticated encryption
const { ciphertext, iv } = await ChaCha20Poly1305.encrypt(
    plaintextMessage, 
    derivedSecretKey
);

// ONLY the ciphertext and initialization vector are sent to the backend database
await supabase.from('messages').insert({ ciphertext, iv });</code></pre>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	/* Inherit global theme from app.css but override for this specific page structure */
	:global(body) {
		background: #0f1423;
		background-image: 
			radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
			radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
	}

	.demo-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		font-family: 'Inter', sans-serif;
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
		background: rgba(15, 20, 35, 0.8);
		backdrop-filter: blur(12px);
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
		background: linear-gradient(135deg, #3b82f6, #8b5cf6);
		width: 36px; height: 36px;
		border-radius: 10px;
		display: flex; justify-content: center; align-items: center;
		box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
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
		background: #8b5cf6; border: none; color: white; padding: 0.5rem 1.2rem; border-radius: 6px; font-weight: 500; cursor: pointer; transition: background 0.2s; font-size: 0.95rem;
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
		background: linear-gradient(to right, #e2e8f0, #94a3b8);
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
		background: rgba(30, 41, 59, 0.5);
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 8px;
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
		background: #3b82f6;
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
		background: linear-gradient(90deg, #3b82f6, #8b5cf6);
		transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Content Section */
	.content-section {
		width: 100%;
		max-width: 1000px;
		padding: 3rem;
		margin-bottom: 4rem;
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

	/* Timeline (Tab 1) */
	.timeline {
		position: relative;
		padding-left: 2rem;
	}
	.timeline::before {
		content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
		background: rgba(255,255,255,0.1);
	}
	.timeline-item {
		position: relative; margin-bottom: 2.5rem;
	}
	.timeline-marker {
		position: absolute; left: -2.7rem; top: 0;
		width: 24px; height: 24px; border-radius: 50%;
		background: #334155; color: white;
		display: flex; justify-content: center; align-items: center;
		font-size: 0.8rem; font-weight: bold;
		border: 2px solid #0f1423;
	}
	.timeline-marker.danger { background: #ef4444; }
	.timeline-marker.warning { background: #f59e0b; }
	.timeline-marker.success { background: #10b981; }
	
	.timeline-content h3 { margin: 0 0 0.5rem; font-size: 1.2rem; }
	.timeline-content p { color: #cbd5e1; line-height: 1.6; margin: 0; }

	/* Info Grids */
	.info-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	.info-card {
		background: rgba(0,0,0,0.2);
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 12px;
		padding: 1.5rem;
	}
	.info-card h3 {
		color: #93c5fd;
		margin: 0 0 0.8rem;
		font-size: 1.1rem;
	}
	.info-card p {
		color: #cbd5e1;
		line-height: 1.6;
		margin: 0;
		font-size: 0.95rem;
	}

	/* Process Flow */
	.process-flow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(59, 130, 246, 0.05);
		border: 1px dashed rgba(59, 130, 246, 0.3);
		padding: 2rem;
		border-radius: 12px;
	}
	.process-step {
		flex: 1; text-align: center;
	}
	.step-title {
		font-weight: 700; color: white; margin-bottom: 0.5rem;
	}
	.step-desc {
		font-size: 0.85rem; color: #94a3b8; line-height: 1.4;
	}
	.process-arrow {
		font-size: 2rem; color: rgba(59, 130, 246, 0.5); padding: 0 1rem;
	}

	/* Code Block */
	.code-block {
		background: #0f172a !important;
		padding: 0;
		overflow: hidden;
	}
	.code-header {
		background: rgba(0,0,0,0.3);
		padding: 0.5rem 1rem;
		font-family: monospace;
		font-size: 0.8rem;
		color: #94a3b8;
		border-bottom: 1px solid rgba(255,255,255,0.05);
	}
	.code-block pre {
		margin: 0; padding: 1.5rem; overflow-x: auto;
	}
	.code-block code {
		font-family: 'Courier New', Courier, monospace;
		color: #a5b4fc;
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
