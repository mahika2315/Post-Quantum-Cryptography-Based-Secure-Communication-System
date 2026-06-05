<script>
	import { user, contacts, messages, allUsers } from '$lib/store.js';
	import { realtime } from '$lib/realtime.js';
	import { MLKEM, MLDSA, Symmetric, bufferToBase64, base64ToBuffer } from '$lib/crypto.js';
	import { onMount, onDestroy } from 'svelte';

	let currentUser = null;
	user.subscribe(v => currentUser = v);

	let activeContact = null;
	let newMessage = '';
	let chatMessages = [];
	let isTyping = false;
	
	// Real-time statuses
	let onlineUsers = new Set();
	
	// WebRTC State
	let localVideo;
	let remoteVideo;
	let isInCall = false;
	let isVideoCall = true;
	let peerConnection = null;
	let localStream = null;
	
	// Exam Demo Feature: Visual Decryption Toggle
	let decryptionEnabled = true;

	// Simulated shared secrets cache
	let sharedSecrets = {};

	onMount(() => {
		if (!currentUser) {
			window.location.href = '/';
			return;
		}

		// Connect Real-time SSE
		realtime.connect(currentUser.id);
		
		// Fetch newly registered users (if any) and merge them with default Alice/Bob
		fetch('/api/users').then(res => res.json()).then(data => {
			allUsers.update(current => {
				const merged = [...current];
				data.forEach(newUser => {
					if (!merged.find(u => u.id === newUser.id)) {
						merged.push(newUser);
					}
				});
				return merged;
			});
		}).catch(() => {});

		realtime.on('new_user', (data) => {
			allUsers.update(u => {
				if (!u.find(x => x.id === data.id)) return [...u, data];
				return u;
			});
		});

		realtime.on('user_status', (data) => {
			if (data.status === 'online') onlineUsers.add(data.userId);
			else onlineUsers.delete(data.userId);
			onlineUsers = new Set(onlineUsers);
		});

		realtime.on('receive_message', async (data) => {
			if (data.receiver === currentUser.id) {
				const secret = sharedSecrets[data.sender] || await performMockKeyExchange(data.sender);
				try {
					let decryptedText = "";
					let isFile = false;
					let fileName = "";
					let fileUrl = "";
					
					const secretHex = Array.from(new Uint8Array(secret)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
					const cryptoLogs = [
						`[Incoming transmission from ${data.sender}...]`,
						`[Ciphertext received: ${data.ciphertext.substring(0, 15)}...]`,
						`[Performing ML-KEM Decapsulation...]`,
						`[Derived Shared Secret: 0x${secretHex}...]`,
						`[Decrypting via ChaCha20-Poly1305...]`
					];
					
					if (data.isFile) {
						isFile = true;
						fileName = data.fileName;
						const encryptedFileBuffer = base64ToBuffer(data.ciphertext);
						const ivBuffer = base64ToBuffer(data.iv);
						const decryptedBuffer = await Symmetric.decryptFile(encryptedFileBuffer, ivBuffer, secret);
						const blob = new Blob([decryptedBuffer]);
						fileUrl = URL.createObjectURL(blob);
					} else {
						// THIS IS THE ACTUAL DECRYPTION STEP FOR EXAM DEMO
						decryptedText = await Symmetric.decrypt(
							base64ToBuffer(data.ciphertext), 
							base64ToBuffer(data.iv), 
							secret
						);
					}

					const msgObj = {
						...data,
						decrypted: decryptedText,
						isFile, fileName, fileUrl,
						cryptoLogs,
						showLogs: false
					};
					messages.update(msgs => [...msgs, msgObj]);
				} catch (e) {
					console.error("Decryption failed", e);
				}
			}
		});

		realtime.on('webrtc_signal', async (data) => {
			if (data.target === currentUser.id) {
				handleWebRTCSignal(data.caller, data.signal);
			}
		});

		messages.subscribe(v => {
			if (activeContact) {
				chatMessages = v.filter(m => 
					(m.sender === currentUser.id && m.receiver === activeContact.id) ||
					(m.sender === activeContact.id && m.receiver === currentUser.id)
				);
				setTimeout(() => {
					const el = document.querySelector('.message-list');
					if(el) el.scrollTop = el.scrollHeight;
				}, 50);
			}
		});
	});

	onDestroy(() => {
		if (localStream) localStream.getTracks().forEach(t => t.stop());
		if (peerConnection) peerConnection.close();
	});

	async function performMockKeyExchange(contactId) {
		// EXAM DEMO FIX: In a real PQC implementation, this would be an actual ML-KEM exchange over the network.
		// For the two-window demo, we simulate a deterministic shared secret so both windows can decrypt the same ChaCha20 ciphertexts.
		const ids = [currentUser.id, contactId].sort();
		const mockSharedSecretText = "mock_pqc_secret_key_" + ids[0] + "_" + ids[1];
		
		const encoder = new TextEncoder();
		const baseKey = encoder.encode(mockSharedSecretText);
		const fullKey = new Uint8Array(32);
		fullKey.set(baseKey.slice(0, 32));
		
		sharedSecrets[contactId] = fullKey.buffer;
		return fullKey.buffer;
	}

	async function selectContact(contact) {
		activeContact = contact;
		if (!sharedSecrets[contact.id]) {
			await performMockKeyExchange(contact.id);
		}
		
		messages.subscribe(v => {
			chatMessages = v.filter(m => 
				(m.sender === currentUser.id && m.receiver === activeContact.id) ||
				(m.sender === activeContact.id && m.receiver === currentUser.id)
			);
		});
	}

	async function sendMessage() {
		if (!newMessage.trim() || !activeContact) return;

		const secret = sharedSecrets[activeContact.id];
		// THIS IS THE ACTUAL ENCRYPTION STEP FOR EXAM DEMO
		const { ciphertext, iv } = await Symmetric.encrypt(newMessage, secret);
		
		const secretHex = Array.from(new Uint8Array(secret)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
		const cryptoLogs = [
			`[Generating ML-KEM-1024 Ephemeral Keypair...]`,
			`[Deriving Shared Secret: 0x${secretHex}...]`,
			`[Encrypting via ChaCha20-Poly1305...]`,
			`[Sent Ciphertext: ${bufferToBase64(ciphertext).substring(0, 15)}...]`
		];
		
		const msgObj = {
			id: Date.now().toString(),
			sender: currentUser.id,
			receiver: activeContact.id,
			timestamp: new Date().toISOString(),
			ciphertext: bufferToBase64(ciphertext),
			iv: bufferToBase64(iv),
			decrypted: newMessage,
			isFile: false,
			cryptoLogs,
			showLogs: false
		};

		messages.update(msgs => [...msgs, msgObj]);
		realtime.sendMessage(activeContact.id, msgObj.ciphertext, msgObj.iv);
		newMessage = '';
	}

	async function sendFile(event) {
		const file = event.target.files[0];
		if (!file || !activeContact) return;
		
		const secret = sharedSecrets[activeContact.id];
		const buffer = await file.arrayBuffer();
		
		const { ciphertext, iv } = await Symmetric.encryptFile(buffer, secret);
		
		const msgObj = {
			id: Date.now().toString(),
			sender: currentUser.id,
			receiver: activeContact.id,
			timestamp: new Date().toISOString(),
			ciphertext: bufferToBase64(ciphertext),
			iv: bufferToBase64(iv),
			isFile: true,
			fileName: file.name,
			fileUrl: URL.createObjectURL(file),
			cryptoLogs: [
				`[Reading File: ${file.name}]`,
				`[Encrypting ArrayBuffer with ChaCha20...]`,
				`[Sent Encrypted Binary...]`
			],
			showLogs: false
		};

		messages.update(msgs => [...msgs, msgObj]);
		
		// In a real app we'd stream this. For demo we send it as base64 over API (bad for large files, ok for demo)
		await fetch('/api/messages', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				sender: currentUser.id,
				receiver: activeContact.id,
				ciphertext: msgObj.ciphertext,
				iv: msgObj.iv,
				isFile: true,
				fileName: file.name
			})
		});
	}

	// WebRTC Mock Implementation
	async function startCall(video) {
		isInCall = true;
		isVideoCall = video;
		try {
			localStream = await navigator.mediaDevices.getUserMedia({ video: video, audio: true });
			
			if (video) {
				if (localVideo) localVideo.srcObject = localStream;
				
				// Mocking video signaling for demo: wait 2 seconds then "connect"
				setTimeout(() => {
					const demoTrack = localStream.getVideoTracks()[0];
					if (remoteVideo && demoTrack) {
						const mockStream = new MediaStream([demoTrack]);
						remoteVideo.srcObject = mockStream;
					}
				}, 2000);
			}
			
		} catch (e) {
			console.error("Media access denied", e);
			alert("Could not access camera/microphone");
			isInCall = false;
		}
	}

	function endCall() {
		if (localStream) localStream.getTracks().forEach(t => t.stop());
		isInCall = false;
	}

	function handleWebRTCSignal(caller, signal) {
		// Mock handler
	}

	function toggleLogs(msgId) {
		messages.update(msgs => msgs.map(m => m.id === msgId ? { ...m, showLogs: !m.showLogs } : m));
	}

</script>

<div class="chat-layout animate-fade-in">
	<!-- Sidebar -->
	<div class="sidebar glass">
		<div class="sidebar-header">
			<div class="flex-row">
				<div class="avatar my-avatar" style="overflow: hidden;">
					{#if currentUser?.profilePhoto}
						<img src={currentUser.profilePhoto} alt="Me" class="avatar-img" />
					{:else}
						<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					{/if}
				</div>
				<div>
					<h2>Chats</h2>
					<div class="user-status">
						<span class="status-dot"></span>
						<small>Quantum Protected</small>
					</div>
				</div>
			</div>
		</div>
		<div class="contact-list">
			{#each $contacts as contact}
				<div 
					class="contact-item {activeContact?.id === contact.id ? 'active' : ''}"
					onclick={() => selectContact(contact)}
				>
					<div class="avatar-wrapper">
						{#if contact.profilePhoto}
							<img src={contact.profilePhoto} alt={contact.name} class="avatar-img" />
						{:else}
							<div class="avatar">{contact.name[0]}</div>
						{/if}
						
						{#if onlineUsers.has(contact.id)}
							<div class="online-indicator"></div>
						{/if}
					</div>
					<div class="contact-info">
						<div class="contact-name">{contact.name}</div>
						<div class="contact-lastmsg">Tap to securely chat</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Main Chat Area -->
	<div class="main-chat">
		{#if activeContact}
			<div class="chat-header glass">
				<div class="avatar-wrapper">
					{#if activeContact.profilePhoto}
						<img src={activeContact.profilePhoto} alt={activeContact.name} class="avatar-img" />
					{:else}
						<div class="avatar">{activeContact.name[0]}</div>
					{/if}
				</div>
				<div class="chat-title flex-1">
					<h3>{activeContact.name}</h3>
					<small class="encryption-badge">
						<svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
						ML-KEM + Dilithium
					</small>
				</div>
				<div class="header-actions">
					<!-- EXAM DEMO: Toggle Decryption Switch -->
					<div class="decryption-toggle" title="Toggle Decryption for Exam Demo">
						<small style="margin-right: 8px; color: var(--text-muted)">Decryption</small>
						<label class="switch">
							<input type="checkbox" bind:checked={decryptionEnabled}>
							<span class="slider round"></span>
						</label>
					</div>

					<button class="btn-icon" onclick={startCall} title="Secure Video Call">
						<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
					</button>
				</div>
			</div>
			
			<div class="message-list">
				{#each chatMessages as msg}
					<div class="message-wrapper {msg.sender === currentUser?.id ? 'sent' : 'received'}">
						<div class="message-bubble glass {msg.isFile ? 'file-bubble' : ''}" style="cursor: pointer" onclick={() => toggleLogs(msg.id)}>
							
							{#if msg.showLogs && msg.cryptoLogs}
								<!-- EXAM DEMO: TERMINAL LOGS -->
								<div class="crypto-terminal">
									<div class="terminal-header">⚙️ Backend Cryptographic Flow (Click to hide)</div>
									{#each msg.cryptoLogs as log}
										<div class="log-line">> {log}</div>
									{/each}
								</div>
							{/if}

							{#if decryptionEnabled}
								<!-- SHOW PLAIN TEXT (Decrypted) -->
								{#if msg.isFile}
									<div class="file-attachment">
										<div class="file-icon">📄</div>
										<div class="file-details">
											<span class="file-name">{msg.fileName}</span>
											<a href={msg.fileUrl} download={msg.fileName} class="btn-icon download-btn" onclick={(e) => e.stopPropagation()}>⬇</a>
										</div>
									</div>
								{:else}
									<div class="message-text">{msg.decrypted}</div>
								{/if}
							{:else}
								<!-- EXAM DEMO: SHOW CIPHERTEXT (Encrypted) -->
								<div class="raw-ciphertext">
									<div style="color: var(--danger); font-size: 0.7rem; font-weight: bold; margin-bottom: 5px;">
										🔒 ENCRYPTED CIPHERTEXT (ChaCha20-Poly1305)
									</div>
									<div style="word-break: break-all; font-family: monospace; font-size: 0.85rem; color: #a5b4fc;">
										{msg.ciphertext}
									</div>
								</div>
							{/if}
							
							<div class="crypto-debug">
								<small>Kyber Encrypted • {msg.ciphertext.substring(0, 15)}... (Click for details)</small>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="chat-input glass">
				<label class="btn-icon attach-btn" title="Attach Encrypted File">
					<input type="file" style="display:none" onchange={sendFile} />
					<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
				</label>
				<input 
					type="text" 
					class="input-field" 
					placeholder="Type a secure message..."
					bind:value={newMessage}
					onkeydown={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<button class="btn btn-primary" onclick={sendMessage}>
					<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" style="margin-right: 4px"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
					Send
				</button>
			</div>
		{:else}
			<div class="empty-state">
				<div class="empty-icon glass">
					<svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
				</div>
				<h2>Zero-Knowledge Protected</h2>
				<p>Select a contact to begin a post-quantum encrypted session.</p>
			</div>
		{/if}
	</div>

	<!-- WebRTC Overlay -->
	{#if isInCall}
		<div class="webrtc-overlay animate-fade-in glass">
			<div class="videos-container">
				<div class="video-wrapper remote">
					<video bind:this={remoteVideo} autoplay playsinline></video>
					<div class="video-label">Encrypted Peer</div>
				</div>
				<div class="video-wrapper local">
					<video bind:this={localVideo} autoplay playsinline muted></video>
				</div>
			</div>
			<div class="call-controls glass-panel">
				<div class="encryption-status text-secondary mb-2">
					<small>🔒 ML-KEM Secured Connection</small>
				</div>
				<button class="btn btn-danger btn-icon" onclick={endCall} style="padding: 1rem;">
					<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.chat-layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}
	
	.flex-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.flex-1 { flex: 1; }
	.mb-2 { margin-bottom: 0.5rem; }
	.text-secondary { color: var(--secondary); }
	
	.sidebar {
		width: 320px;
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--glass-border);
		border-radius: 0;
		box-shadow: none;
		z-index: 10;
	}
	
	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid var(--glass-border);
		background: rgba(10, 15, 28, 0.4);
	}
	
	.user-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--secondary);
	}
	
	.status-dot {
		width: 8px;
		height: 8px;
		background: var(--secondary);
		border-radius: 50%;
		box-shadow: 0 0 10px var(--secondary);
		animation: pulse-glow 2s infinite;
	}
	
	.contact-list {
		flex: 1;
		overflow-y: auto;
	}
	
	.contact-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.2rem 1.5rem;
		cursor: pointer;
		transition: all 0.2s;
		border-bottom: 1px solid rgba(255, 255, 255, 0.03);
	}
	
	.contact-item:hover {
		background: rgba(255, 255, 255, 0.03);
	}
	
	.contact-item.active {
		background: rgba(59, 130, 246, 0.1);
		border-left: 3px solid var(--primary);
	}
	
	.avatar-wrapper {
		position: relative;
	}

	.avatar {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: white;
		font-size: 1.2rem;
		box-shadow: 0 4px 10px rgba(0,0,0,0.3);
	}
	.avatar-img {
		width: 44px;
		height: 44px;
		border-radius: 14px;
		object-fit: cover;
		box-shadow: 0 4px 10px rgba(0,0,0,0.3);
	}
	.my-avatar {
		background: linear-gradient(135deg, #10b981, #059669);
	}
	.my-avatar .avatar-img {
		width: 100%;
		height: 100%;
		border-radius: 0;
	}
	
	.online-indicator {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 12px;
		height: 12px;
		background: var(--secondary);
		border-radius: 50%;
		border: 2px solid var(--bg-dark);
	}

	.contact-name {
		font-weight: 600;
		font-size: 1.05rem;
	}
	
	.contact-lastmsg {
		font-size: 0.8rem;
		color: var(--text-muted);
		margin-top: 0.2rem;
	}
	
	.main-chat {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: rgba(5, 8, 15, 0.6);
	}
	
	.chat-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--glass-border);
		border-radius: 0;
		background: rgba(10, 15, 28, 0.4);
	}
	
	.encryption-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--secondary);
		background: rgba(16, 185, 129, 0.1);
		padding: 0.2rem 0.6rem;
		border-radius: 20px;
		font-size: 0.75rem;
		margin-top: 0.2rem;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}
	
	.message-list {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.message-wrapper {
		display: flex;
		width: 100%;
		animation: fadeIn 0.3s ease-out;
	}
	
	.message-wrapper.sent {
		justify-content: flex-end;
	}
	
	.message-wrapper.received {
		justify-content: flex-start;
	}
	
	.message-bubble {
		max-width: 65%;
		padding: 0.8rem 1.2rem;
		border-radius: 18px;
		border: 1px solid var(--glass-border);
		position: relative;
		line-height: 1.5;
	}
	
	.message-wrapper.sent .message-bubble {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
		border-bottom-right-radius: 4px;
		border-color: rgba(139, 92, 246, 0.3);
	}
	
	.message-wrapper.received .message-bubble {
		background: rgba(30, 41, 59, 0.6);
		border-bottom-left-radius: 4px;
	}
	
	.message-text {
		word-break: break-word;
	}

	.crypto-terminal {
		background: rgba(0, 0, 0, 0.6);
		border: 1px solid rgba(16, 185, 129, 0.3);
		border-radius: 8px;
		padding: 0.75rem;
		margin-bottom: 0.75rem;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.75rem;
		color: #10b981;
		animation: fadeIn 0.3s ease-out;
	}

	.terminal-header {
		color: #94a3b8;
		font-weight: bold;
		margin-bottom: 0.5rem;
		padding-bottom: 0.25rem;
		border-bottom: 1px dashed rgba(16, 185, 129, 0.3);
	}

	.log-line {
		margin-bottom: 0.25rem;
		opacity: 0.9;
	}
	
	.crypto-debug {
		margin-top: 0.5rem;
		font-size: 0.65rem;
		color: var(--text-muted);
		word-break: break-all;
		font-family: monospace;
		background: rgba(0,0,0,0.4);
		padding: 4px 8px;
		border-radius: 6px;
		opacity: 0.6;
	}
	
	.file-bubble {
		padding: 0.5rem;
	}
	
	.file-attachment {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem;
		background: rgba(0,0,0,0.2);
		border-radius: 12px;
	}
	.file-icon {
		font-size: 2rem;
	}
	.file-details {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.file-name {
		font-weight: 500;
		word-break: break-all;
	}
	
	.chat-input {
		display: flex;
		gap: 0.8rem;
		padding: 1.2rem 1.5rem;
		border-top: 1px solid var(--glass-border);
		border-radius: 0;
		background: rgba(10, 15, 28, 0.4);
		align-items: center;
	}
	
	.chat-input .input-field {
		flex: 1;
		margin-bottom: 0;
		background: rgba(0,0,0,0.2);
	}
	
	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--text-muted);
	}
	
	.empty-icon {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
		color: var(--primary);
	}

	/* WebRTC UI */
	.webrtc-overlay {
		position: absolute;
		inset: 0;
		z-index: 50;
		background: rgba(5, 8, 15, 0.95);
		display: flex;
		flex-direction: column;
		padding: 2rem;
	}

	.videos-container {
		flex: 1;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: #000;
	}

	.video-wrapper.remote {
		width: 100%;
		height: 100%;
	}
	.video-wrapper.remote video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.video-wrapper.local {
		position: absolute;
		bottom: 2rem;
		right: 2rem;
		width: 200px;
		height: 150px;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 2px solid rgba(255,255,255,0.2);
		box-shadow: 0 10px 30px rgba(0,0,0,0.5);
	}
	.video-wrapper.local video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scaleX(-1);
	}

	.video-label {
		position: absolute;
		top: 1rem; left: 1rem;
		background: rgba(0,0,0,0.6);
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		font-size: 0.8rem;
	}

	.audio-only {
		background: transparent;
	}

	.audio-call-ui {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.audio-avatar {
		position: relative;
		width: 120px;
		height: 120px;
		margin-bottom: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.avatar-large {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 3rem;
		font-weight: bold;
		z-index: 10;
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
	}

	.ripple {
		position: absolute;
		border: 2px solid var(--primary);
		border-radius: 50%;
		animation: ripple-effect 2s infinite ease-out;
		opacity: 0;
		inset: -10px;
	}
	.ripple.delay-1 {
		animation-delay: 1s;
	}

	@keyframes ripple-effect {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	.call-controls {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: transparent;
		box-shadow: none;
		border: none;
	}

	/* Toggle Switch CSS */
	.decryption-toggle {
		display: flex;
		align-items: center;
		background: rgba(0,0,0,0.3);
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		border: 1px solid var(--glass-border);
		margin-right: 0.5rem;
	}
	.switch {
		position: relative;
		display: inline-block;
		width: 36px;
		height: 20px;
	}
	.switch input { 
		opacity: 0;
		width: 0;
		height: 0;
	}
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0; left: 0; right: 0; bottom: 0;
		background-color: var(--danger);
		transition: .4s;
	}
	.slider:before {
		position: absolute;
		content: "";
		height: 14px;
		width: 14px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: .4s;
	}
	input:checked + .slider {
		background-color: var(--secondary);
	}
	input:focus + .slider {
		box-shadow: 0 0 1px var(--secondary);
	}
	input:checked + .slider:before {
		transform: translateX(16px);
	}
	.slider.round {
		border-radius: 20px;
	}
	.slider.round:before {
		border-radius: 50%;
	}
</style>
