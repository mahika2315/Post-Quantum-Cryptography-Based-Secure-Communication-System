CipherNova 🚀
A Post-Quantum Cryptography (PQC) Based End-to-End Secure Messaging Platform
CipherNova (formerly KyberShield) is a zero-knowledge, end-to-end encrypted messaging and peer-to-peer WebRTC signaling application designed to mitigate the future threat of Cryptanalytically Useful Quantum Computers (CRQCs) and active "Store Now, Decrypt Later" (SNDL) attacks.

🔒 Cryptographic Suite
CipherNova implements the latest NIST Post-Quantum Cryptography standards (released August 2024), running entirely client-side inside the sandboxed browser execution memory:

ML-KEM-1024 (FIPS 203): Module-Lattice-Based Key-Encapsulation Mechanism (formerly Crystals-Kyber) used to perform secure post-quantum key handshakes.
ML-DSA-87 (FIPS 204): Module-Lattice-Based Digital Signature Standard (formerly Crystals-Dilithium) used to verify user identities and prevent Man-In-The-Middle (MITM) attacks.
AES-256-GCM / ChaCha20-Poly1305: Authenticated symmetric encryption utilizing unique 96-bit Initialization Vectors (IV) to protect chat messages and binary file transfers, ensuring complete confidentiality and integrity.
✨ Features
Zero-Knowledge Architecture: All key pair generations, signatures, encapsulations, and symmetric decryptions execute strictly client-side. The routing server is completely blind to private keys and message plaintexts.
Real-Time Duplex Syncing: Utilizes Server-Sent Events (SSE) for low-overhead, real-time message routing and presence detection.
Encrypted WebRTC Signaling: Video/audio signaling parameters (SDP and ICE Candidates) are encrypted using derived post-quantum shared secrets.
Interactive Cryptographic Console: A built-in terminal log overlay and a global "Decryption Switch" designed to visually demonstrate the step-by-step cryptographic operations and transit security.
🛠️ Tech Stack
Frontend: Svelte 5 / SvelteKit (with Svelte writable/derived stores)
Design System: Vanilla CSS with glassmorphism & dark-mode aesthetics
Cryptographic Engines: Noble PQC libraries (@noble/post-quantum) & W3C WebCrypto API
Backend: Node.js & SvelteKit API endpoints
Database: High-performance, memory-resident server registry (managed via globalThis)
🚀 Setup & Installation
Prerequisites
Make sure you have Node.js (v20+) installed.

Installation
Clone this repository:
bash

git clone https://github.com/YOUR_USERNAME/ciphernova.git
cd ciphernova
Install dependencies:
bash

npm install
Start the local development server:
bash

npm run dev
Open the application in your browser:
http://localhost:5173
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
