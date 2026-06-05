# 🚀 CipherNova

> A Post-Quantum Cryptography (PQC) Based End-to-End Secure Messaging Platform

CipherNova is a zero-knowledge, end-to-end encrypted messaging application designed to mitigate the future threat of **Cryptanalytically Useful Quantum Computers (CRQCs)** and active **Store Now, Decrypt Later (SNDL)** attacks.

---

## 🔒 Cryptographic Suite

CipherNova implements the latest **NIST Post-Quantum Cryptography standards (August 2024)** and performs all cryptographic operations entirely client-side within the browser's sandboxed execution environment.

### ML-KEM-1024 (FIPS 203)
Module-Lattice-Based Key Encapsulation Mechanism (formerly **CRYSTALS-Kyber**) used for:

- Secure post-quantum key exchange
- Shared secret establishment
- Quantum-resistant communication

### ML-DSA-87 (FIPS 204)
Module-Lattice-Based Digital Signature Algorithm (formerly **CRYSTALS-Dilithium**) used for:

- Identity verification
- Message authentication
- Prevention of Man-In-The-Middle (MITM) attacks

### AES-256-GCM / ChaCha20-Poly1305
Authenticated symmetric encryption algorithms used to:

- Protect chat messages
- Secure binary file transfers
- Ensure confidentiality and integrity
- Utilize unique 96-bit Initialization Vectors (IVs)

---

## ✨ Features

### 🔐 Zero-Knowledge Architecture

- All key generation, signatures, encapsulations, and decryptions occur exclusively client-side.
- Private keys never leave the user's device.
- The server cannot access plaintext messages or cryptographic secrets.

### ⚡ Real-Time Duplex Messaging

- Utilizes Server-Sent Events (SSE) for efficient real-time communication.
- Supports instant message delivery and user presence detection.
- Low-overhead alternative to continuous polling.

### 🎥 Encrypted WebRTC Signaling

- SDP offers/answers are encrypted before transmission.
- ICE candidates are protected using derived post-quantum shared secrets.
- Secure audio and video session establishment.

### 🖥️ Interactive Cryptographic Console

Built-in developer console that visually demonstrates:

- Key generation
- ML-KEM encapsulation/decapsulation
- ML-DSA signing and verification
- Message encryption and decryption
- Network transmission workflow

### 🔄 Global Decryption Switch

A demonstration feature allowing users to visualize:

- Ciphertext in transit
- Secure message routing
- End-to-end decryption workflow
- Cryptographic protection mechanisms

---

## 🏗️ Architecture

```text
+-------------+       ML-KEM-1024       +-------------+
|  Client A   | <---------------------> |  Client B   |
+-------------+                         +-------------+
       |                                       |
       |     Encrypted Messages & Files        |
       +---------------------------------------+
                       |
                       v
              +------------------+
              | Routing Server   |
              +------------------+
                       |
                       v
              Zero Knowledge Only
```

The routing server acts solely as a transport layer and never has access to:

- Private keys
- Shared secrets
- Plaintext messages
- File contents

---

## 🛠️ Tech Stack

### Frontend

- Svelte 5
- SvelteKit
- Svelte Writable Stores
- Svelte Derived Stores

### Design System

- Vanilla CSS
- Glassmorphism UI
- Dark Mode Interface

### Cryptographic Engines

- @noble/post-quantum
- WebCrypto API

### Backend

- Node.js
- SvelteKit API Endpoints

### Database / State Management

- In-memory server registry
- Managed using `globalThis`
- High-speed session routing

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js v20+
- npm

### Clone Repository

```bash
git clone https://github.com/mahika2315/Post-Quantum-Cryptography-Based-Secure-Communication-System.git
cd Post-Quantum-Cryptography-Based-Secure-Communication-System
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Open Application

```text
http://localhost:5173/demo
```

---

## 📂 Project Structure

```text
ciphernova/
│
├── src/
│   ├── routes/
│   ├── lib/
│   ├── stores/
│   ├── crypto/
│   └── components/
│
├── static/
├── package.json
├── svelte.config.js
├── vite.config.js
└── README.md
```

---

## 🛡️ Security Objectives

CipherNova is designed to provide:

- Quantum-resistant key exchange
- Quantum-resistant digital signatures
- End-to-end encrypted messaging
- End-to-end encrypted file transfer
- Secure WebRTC signaling
- Zero-knowledge infrastructure
- Protection against Store-Now-Decrypt-Later attacks
- Strong confidentiality and integrity guarantees

---

## 🔬 Educational Purpose

CipherNova includes visual cryptographic demonstrations for:

- Post-Quantum Cryptography education
- Cybersecurity research
- Secure communication studies
- Understanding modern cryptographic workflows

---

## 📈 Future Roadmap

- Group messaging
- Multi-device synchronization
- QR-based contact verification
- Hybrid classical + PQC mode
- Secure encrypted backups
- Mobile applications
- Federated server architecture

---

## 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.
