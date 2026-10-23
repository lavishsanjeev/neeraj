/**
 * VoteShield AI - Mock Election Data & Attack Scenarios
 * Tailored for Engineering Students and Instructors evaluating AI & Cybersecurity principles.
 */

export const ELECTION_METADATA = {
  electionId: 'VS-CAMPUS-2026-GEN',
  title: '2026 Engineering Student Council & Tech Policy Election',
  institution: 'Faculty of Engineering & Computing Sciences',
  electionSalt: 'VOTE-SHIELD-CAMPUS-2026-AIRGAP-SALT',
  publicKey: 'PUBKEY-ED25519-VOTESHIELD-EC-SECP256K1-89F4B',
  algorithm: 'SHA-256 Merkle Chain + ZK Nullifiers + Client-side AES/Paillier Envelope',
  totalRegisteredVoters: 120,
  votingWindow: 'Air-Gapped Offline Local Mode'
};

export const CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Elena Rostova',
    slate: 'Cyber Defense & Privacy Initiative',
    avatar: '👩‍💻',
    color: '#06b6d4', // cyan
    badge: 'Security Architecture',
    platform: 'Mandate open-source cryptographic audits for all university systems, implement air-gapped student privacy vaults, and expand student cybersecurity research grants.'
  },
  {
    id: 'cand-2',
    name: 'Arjun Patel',
    slate: 'Open Science & Quantum Collective',
    avatar: '👨‍🔬',
    color: '#10b981', // emerald
    badge: 'Applied Cryptography',
    platform: 'Build decentralized campus compute nodes, sponsor post-quantum encryption workshops, and eliminate vendor lock-in for student research data.'
  },
  {
    id: 'cand-3',
    name: 'Maya Lin',
    slate: 'AI Ethics & Autonomous Safety Caucus',
    avatar: '👩‍🔬',
    color: '#8b5cf6', // purple
    badge: 'Explainable AI',
    platform: 'Establish algorithmic transparency boards, enforce strict anti-bias auditing on campus proctoring software, and sponsor edge-AI robotics labs.'
  },
  {
    id: 'cand-4',
    name: 'Devon Miller',
    slate: 'Digital Rights & Green Infrastructure',
    avatar: '🧑‍🔧',
    color: '#f59e0b', // amber
    badge: 'Resilient Systems',
    platform: 'Solar-powered server racks for engineering maker-spaces, anonymous whistleblowing protocols for tech integrity, and 24/7 maker-space hardware access.'
  }
];

export const REFERENDUMS = [
  {
    id: 'ref-1',
    code: 'PROP-ENG-01',
    title: 'Adoption of Verifiable Open-Source Voting Across University Bodies',
    description: 'Shall the Engineering Faculty adopt mandatory end-to-end verifiable (E2E-V) cryptographic voting systems with client-side zero-knowledge proofs for all future student governance elections?',
    options: [
      { id: 'yes', label: 'In Favor (Yes)' },
      { id: 'no', label: 'Opposed (No)' }
    ]
  }
];

export const INITIAL_REGISTERED_VOTERS = [
  {
    id: 'VTR-8801',
    studentId: 'ENG-2023-0104',
    name: 'Sophia Rodriguez',
    department: 'Computer Science (Cybersecurity Specialization)',
    secretKey: 'VOTER_SEC_KEY_SOPHIA_99120',
    biometricVector: [0.82, 0.14, -0.65, 0.44, 0.91, 0.12, -0.38, 0.77],
    hasVoted: false,
    avatar: '👩🏽',
    livenessBaseline: {
      blinkRatePerMin: 18,
      depthVariance: 0.88,
      skinTextureScore: 0.94
    }
  },
  {
    id: 'VTR-8802',
    studentId: 'ENG-2023-0219',
    name: 'Liam O’Connor',
    department: 'Electrical & Computer Engineering',
    secretKey: 'VOTER_SEC_KEY_LIAM_44819',
    biometricVector: [0.12, 0.79, -0.22, 0.61, -0.45, 0.88, 0.33, -0.19],
    hasVoted: false,
    avatar: '👨🏻',
    livenessBaseline: {
      blinkRatePerMin: 21,
      depthVariance: 0.91,
      skinTextureScore: 0.96
    }
  },
  {
    id: 'VTR-8803',
    studentId: 'ENG-2024-0341',
    name: 'Aisha Al-Mansoor',
    department: 'Artificial Intelligence & Robotics',
    secretKey: 'VOTER_SEC_KEY_AISHA_77312',
    biometricVector: [0.94, -0.31, 0.45, -0.12, 0.73, 0.29, -0.81, 0.66],
    hasVoted: false,
    avatar: '👩🏻',
    livenessBaseline: {
      blinkRatePerMin: 16,
      depthVariance: 0.89,
      skinTextureScore: 0.95
    }
  },
  {
    id: 'VTR-8804',
    studentId: 'ENG-2022-0498',
    name: 'Tariq Johnson',
    department: 'Software Engineering',
    secretKey: 'VOTER_SEC_KEY_TARIQ_33891',
    biometricVector: [-0.41, 0.63, 0.84, -0.29, 0.55, -0.14, 0.69, -0.32],
    hasVoted: false,
    avatar: '👨🏿',
    livenessBaseline: {
      blinkRatePerMin: 20,
      depthVariance: 0.92,
      skinTextureScore: 0.97
    }
  },
  {
    id: 'VTR-8805',
    studentId: 'ENG-2023-0572',
    name: 'Kavita Sundaram',
    department: 'Information Systems Security',
    secretKey: 'VOTER_SEC_KEY_KAVITA_55102',
    biometricVector: [0.73, 0.38, -0.59, 0.82, -0.21, 0.64, 0.17, 0.93],
    hasVoted: false,
    avatar: '👩🏾',
    livenessBaseline: {
      blinkRatePerMin: 19,
      depthVariance: 0.87,
      skinTextureScore: 0.93
    }
  },
  {
    id: 'VTR-8806',
    studentId: 'ENG-2024-0611',
    name: 'Lucas Ferreira',
    department: 'Quantum Computing Lab',
    secretKey: 'VOTER_SEC_KEY_LUCAS_11928',
    biometricVector: [-0.67, 0.19, 0.52, 0.77, -0.83, 0.35, -0.24, 0.49],
    hasVoted: false,
    avatar: '👨🏼',
    livenessBaseline: {
      blinkRatePerMin: 22,
      depthVariance: 0.90,
      skinTextureScore: 0.94
    }
  }
];

export const ATTACK_SCENARIOS = [
  {
    id: 'attack-screen-spoof',
    category: 'AI Biometric Vulnerability',
    title: 'Presentation Attack: 2D Screen / Printed Photo Spoof',
    type: 'ai-limitation',
    severity: 'High Threat to Edge AI',
    principle: 'Presentation Attack Detection (PAD) & Liveness Limitations',
    description: 'An adversary holds a high-resolution photograph or smartphone replay video of an enrolled student in front of the kiosk optical sensor.',
    mechanism: 'Lightweight offline edge neural networks struggle with specular glare reflections, micro-movement latency, and monocular depth estimation without active IR sensors.',
    securityControlDemonstration: 'VoteShield checks micro-facial liveness variance, 3D pupil depth disparity, and texture frequency harmonics. When the score falls below threshold (< 0.80), authentication fails.',
    limitationCaveat: 'LIMITATION: In poorly lit offline booths or with low-cost webcams, high-resolution organic OLED displays can trigger false acceptances (FAR), or ambient flicker can cause legitimate voters to be rejected (FRR).'
  },
  {
    id: 'attack-double-voting',
    category: 'Cryptographic Protection',
    title: 'Sybil & Double-Voting Attack: Duplicate Ballot Submission',
    type: 'security-control',
    severity: 'Defended by Architecture',
    principle: 'Cryptographic Nullifier Invariants',
    description: 'An authenticated voter attempts to cast a second ballot, or an attacker intercepts a voter credentials to vote again under the same identity.',
    mechanism: 'Each ballot submission requires publishing the cryptographic nullifier `H(Voter_Secret || Election_Salt)`. The local state engine checks the Nullifier Registry before committing to the Merkle tree.',
    securityControlDemonstration: 'The second submission publishes the identical nullifier hash already logged in the registry. The transaction is instantly aborted with an ATTEMPTED_DOUBLE_VOTE error, without exposing which candidate was voted for.',
    limitationCaveat: 'LIMITATION: The nullifier relies on the secrecy of the voter key. If the voter key is stolen before first use, the legitimate voter is permanently locked out (Denial of Service).'
  },
  {
    id: 'attack-ledger-tamper',
    category: 'Cryptographic Protection',
    title: 'Insider Ledger Tampering: Modifying Ballot Choice in Storage',
    type: 'security-control',
    severity: 'Defended by Architecture',
    principle: 'Merkle Tree Hash Avalanche & Audit Trail',
    description: 'A rogue kiosk administrator with local SQLite/IndexedDB root access alters leaf #2 from Candidate A to Candidate B directly in storage.',
    mechanism: 'The Merkle tree recomputes parent hashes recursively: `H(L + R)`. Altering a single bit in any leaf cascades through all ancestor hashes up to the Merkle Root.',
    securityControlDemonstration: 'VoteShield immediately recalculates the Merkle Root and compares it against the signed public checkpoint. The tree turns red, triggering an INTEGRITY_MISMATCH alarm identifying the exact compromised node.',
    limitationCaveat: 'LIMITATION: Merkle verification detects tampering after the fact, but does not self-heal without Byzantine fault-tolerant consensus across multiple independent offline nodes.'
  },
  {
    id: 'attack-adversarial-noise',
    category: 'AI Biometric Vulnerability',
    title: 'Adversarial Evasion: Imperceptible Perturbation Masking',
    type: 'ai-limitation',
    severity: 'Emerging AI Exploit',
    principle: 'Neural Network Vulnerability to Gradient Evasion',
    description: 'An attacker applies subtle digital adversarial noise (FGSM / PGD with ε = 0.03) or 3D-printed adversarial patterned eyeglass frames to fool the edge face verification model.',
    mechanism: 'Lightweight convolutional or transformer embeddings rely on feature linearities in high-dimensional space. Perturbations invisible to human proctors cause catastrophic feature vector misclassification.',
    securityControlDemonstration: 'VoteShield shows how cosine similarity drops or falsely matches another identity when adversarial noise vectors are injected into the 128-d embedding pipeline.',
    limitationCaveat: 'LIMITATION: Truly robust adversarial defense on resource-constrained offline edge devices remains an open research problem in AI security.'
  },
  {
    id: 'attack-coercion',
    category: 'Socio-Technical Limitation',
    title: 'Physical Coercion & Vote Selling (The Receipt Paradox)',
    type: 'systemic-limitation',
    severity: 'Fundamental Voting Paradox',
    principle: 'Individual Verifiability vs. Receipt-Freeness',
    description: 'A coercive party (e.g., student union boss or employer) demands to inspect the voter cryptographic receipt to verify the voter chose Candidate C.',
    mechanism: 'If a voting system provides cryptographic receipts proving who you voted for, it inherently enables vote-buying and extortion.',
    securityControlDemonstration: 'VoteShield decouples the receipt: the receipt proves ballot INCLUSION in the Merkle Tree (via Tracker ID and Merkle Proof), but contains only the encrypted ciphertext envelope, not plaintext candidate choices.',
    limitationCaveat: 'LIMITATION: If an attacker forces the voter to surrender their ephemeral encryption randomness or stand directly behind the kiosk during selection (shoulder-surfing), cryptographic math alone cannot prevent coercion.'
  }
];

export const LAB_EXERCISES = [
  {
    id: 'lab-1',
    title: 'Lab 1: Cryptographic Nullifier & Anonymity Analysis',
    objective: 'Demonstrate how a voter can prove eligibility and cast exactly one vote without disclosing their identity to the tally board.',
    steps: [
      'Select Sophia Rodriguez from the Voter Directory.',
      'Notice her private secret key and corresponding deterministic nullifier hash.',
      'Cast a ballot for Elena Rostova and inspect the published nullifier in the ledger.',
      'Attempt to vote a second time with Sophia. Observe the Nullifier Collision error.',
      'Check the public ledger: is Sophia Rodriguez’s name linked to Candidate Elena Rostova?'
    ],
    discussionQuestion: 'Why must the nullifier hash incorporate an Election Salt? What security vulnerability occurs if the same salt is reused across multiple university elections?'
  },
  {
    id: 'lab-2',
    title: 'Lab 2: Merkle Tree Audit & Hash Avalanche Effect',
    objective: 'Verify cryptographic ballot inclusion using sibling proof paths and simulate an adversarial database manipulation.',
    steps: [
      'Cast 3 or 4 votes across different candidates.',
      'Navigate to the Cryptographic Audit Ledger.',
      'Download or copy your Voter Receipt Tracker Hash.',
      'Open the "Receipt Verifier" tab, paste the tracker, and run "Verify Merkle Path".',
      'Now switch to the "Tamper Simulator" tab and inject a forged ballot in Leaf #1.',
      'Observe the instant Merkle Root divergence and audit failure.'
    ],
    discussionQuestion: 'If an election ledger contains 1,000,000 ballots, how many hash operations are required for an individual voter to cryptographically prove their ballot was counted?'
  },
  {
    id: 'lab-3',
    title: 'Lab 3: Edge AI Biometric Robustness vs. Adversarial Evasion',
    objective: 'Evaluate the trade-off between False Rejection Rate (FRR) and False Acceptance Rate (FAR) under spoofing conditions.',
    steps: [
      'Navigate to the Adversarial Lab and select "Presentation Attack: Screen Spoof".',
      'Toggle the AI Liveness Threshold from 0.85 (Strict) to 0.65 (Permissive).',
      'Observe the Liveness Confidence breakdown: texture harmonics, blink detection, and specular glare.',
      'Run the "Adversarial Perturbation" test to see how imperceptible epsilon noise alters embedding cosine distance.'
    ],
    discussionQuestion: 'Why is running face verification models completely offline on edge hardware better for civil liberties than cloud-based biometric verification, yet harder to defend against physical presentation attacks?'
  }
];
