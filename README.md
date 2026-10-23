# VoteShield AI: An AI-Assisted, Offline-First Digital Voting Security Simulator

> **Objective:** A locally running digital voting security application designed for engineering students and instructors to evaluate AI applications and cybersecurity principles: voter verification, duplicate-vote prevention, ballot privacy, cryptographic audit integrity, and instant result calculation.

---

## 🏛️ System Architecture & Principles

```
       +-------------------------------------------------------------+
       |                  AIR-GAPPED CLIENT ENGINE                   |
       +-------------------------------------------------------------+
                                      |
         1. AI Face Verification      |  2. Cryptographic Nullifier
            (128-d Cosine Metric &    |     H(Voter_Secret || Salt)
             3D Liveness Detection)   |     (Single-Vote Invariant)
                                      v
       +-------------------------------------------------------------+
       |                   BALLOT SELECTION & SEAL                   |
       |       Choices Sealed in Client Envelope: Enc_pk(Vote)       |
       +-------------------------------------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |             IMMUTABLE MERKLE TREE AUDIT LEDGER              |
       |    Leaf #N = SHA-256(Nullifier || Ciphertext || Timestamp)  |
       |    Parent Node = SHA-256(Leaf_Left || Leaf_Right)           |
       |    Checkpoint: Signed Election Merkle Root                  |
       +-------------------------------------------------------------+
                                      |
        3. Receipt Generation         |  4. Instant Tally Ceremony
           (Tracker ID & Sibling      |     (Threshold Decryption &
            O(log N) Proof Path)      |      Homomorphic Aggregation)
```

### 1. Voter Verification (Edge AI Biometrics)
- Evaluates 128-dimensional biometric facial embeddings strictly client-side in RAM.
- Employs **Presentation Attack Detection (PAD)**: analyzes 3D pupil depth disparity, specular surface glare, and micro-blink frequency.
- *Limitation Demonstrated:* Trade-off between False Acceptance Rate (FAR) and False Rejection Rate (FRR) under varied ambient lighting and flat 2D screen/photo spoofing.

### 2. Duplicate-Vote Prevention (Zero-Knowledge Nullifiers)
- Each ballot submission generates a deterministic token:
  $$\text{Nullifier} = H(\text{Voter\_Secret\_Key} \parallel \text{Election\_Salt})$$
- The Nullifier Registry verifies that no identical nullifier exists in $O(1)$ time. If an authenticated student attempts to cast a second ballot, the transaction is immediately rejected with a **Nullifier Collision Violation**.
- *Ballot Secrecy Guarantee:* The nullifier is one-way ($H$ is SHA-256) and mathematically independent of the candidate choice.

### 3. Ballot Privacy (Envelope Encryption)
- Plaintext votes are sealed client-side inside an asymmetric cryptographic envelope:
  $$C = \text{Enc}_{\text{Public\_Key}}(\text{Choices} \parallel \text{Ephemeral\_IV})$$
- No student identity or Student ID is ever stored or transmitted alongside the choice.

### 4. Cryptographic Audit Integrity (Merkle Tree & Hash Avalanche)
- Ballots form leaves in a binary Merkle Tree.
- Each voter receives an **Audit Receipt** containing their unique Tracker ID and an $O(\log_2 N)$ sibling proof path.
- **Insider Tamper Simulator:** Students and instructors can modify a candidate choice in any leaf in local storage. VoteShield immediately recomputes the Merkle Root, detects the avalanche divergence against the signed checkpoint, and triggers a system-wide **Audit Alert**.

### 5. Instant Election Result Calculation (Official Tally Ceremony)
- Provides real-time tabulation of presidential candidates, referendum questions, and turnout statistics.
- Features an interactive **Tally Ceremony** simulator that verifies all leaves against the Merkle Root before certifying results.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Installation & Launch
```bash
# Clone the repository and enter directory
cd "neeraj goyat"

# Install dependencies
npm install

# Start the local offline development server
npm run dev
```

Visit `http://localhost:5173` to interact with the application.

---

## 🧪 Laboratory Exercises for Students & Instructors

The application includes an interactive **Engineering Guide** tab with three structured lab experiments:

1. **Lab 1: Cryptographic Nullifier & Anonymity Analysis**
   - Cast a ballot with Sophia Rodriguez.
   - Inspect her published nullifier in the public ledger.
   - Attempt to vote a second time with the same student to observe the $O(1)$ rejection.
   - *Discussion Question:* Why must the nullifier incorporate an Election Salt? What security vulnerability occurs if the same salt is reused across elections?

2. **Lab 2: Merkle Tree Audit & Hash Avalanche Effect**
   - Cast several ballots across candidates.
   - Go to the **Receipt Sibling Proof Verifier** and test your ballot tracker.
   - Open the **Tamper Simulator** and inject a forged candidate choice into Leaf #0.
   - Observe how 1 altered bit cascades through all ancestor hashes and invalidates the official root.

3. **Lab 3: Edge AI Biometric Robustness vs. Adversarial Evasion**
   - Test the Presentation Attack mode (2D Screen / Printed Photo Spoof).
   - Adjust the Liveness Cutoff threshold ($\theta$) from 0.40 to 0.95 to examine FAR vs. FRR.
   - Inject $\epsilon$-gradient adversarial noise to study feature embedding classification collapse.

---

## 🛠️ Technology Stack
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS v4, Lucide React icons
- **Cryptography:** Web Crypto API (SubtleCrypto SHA-256) with zero-dependency synchronous pure JS fallback
- **Animations & Visualization:** HTML5 Canvas biometric scanner, Canvas Confetti
