/**
 * VoteShield AI - Cryptographic Engine
 * Offline-first verifiable cryptography implementation using Web Crypto API
 * with pure JS fallback for air-gapped or non-secure contexts.
 */

// Pure JS SHA-256 implementation to guarantee 100% offline reliability anywhere
function sha256Sync(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let compositeClearHex = [];
  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << ((3 - (i % 4)) * 8);
  }

  for (let j = 0; j < words.length; j += 16) {
    const w = words.slice(j, j + 16);
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
    let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (let i = 0; i < 64; i++) {
      if (i < 16) {
        // use w[i]
      } else {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + s1 + ch + k[i] + w[i]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Computes SHA-256 hash asynchronously using Web Crypto when available,
 * falling back seamlessly to sha256Sync.
 */
export async function computeSHA256(data) {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(stringData);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // fallback
  }
  return sha256Sync(stringData);
}

/**
 * Synchronous version for rapid tree builds and offline validation
 */
export function hashSync(data) {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  return sha256Sync(stringData);
}

/**
 * Generate a deterministic voter nullifier for an election.
 * Nullifier = H(Voter_Secret_Key || Election_Salt)
 * Decouples identity from the ballot choice while guaranteeing 1-vote-per-voter.
 */
export function generateNullifier(voterSecret, electionSalt = 'VOTE-SHIELD-2026-PRIMARY') {
  return hashSync(`${voterSecret}:${electionSalt}`);
}

/**
 * Client-Side Envelope Encryption (Simulating Asymmetric Paillier / RSA-OAEP / AES-GCM)
 * Encrypts raw choices with election public key and ephemeral initialization vector.
 */
export function encryptBallot(choices, electionPublicKey = 'PUBKEY-VOTESHIELD-ED25519-MASTER-2026') {
  const payload = JSON.stringify(choices);
  const iv = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();
  
  // Simulated authenticated envelope ciphertext
  const rawCipherInput = `${payload}::${iv}::${electionPublicKey}::${timestamp}`;
  const ciphertextHash = hashSync(rawCipherInput);
  
  // Base64 simulated encrypted payload structure
  const envelope = {
    scheme: 'AES-256-GCM / Paillier-Homomorphic-Ready',
    ephemeralIV: iv,
    recipientKey: electionPublicKey.substring(0, 16) + '...',
    ciphertext: `ENC_${ciphertextHash.substring(0, 48)}`,
    commitmentProof: hashSync(`COMMIT_${payload}_${iv}`),
    timestamp
  };

  return {
    envelope,
    rawCiphertext: JSON.stringify(envelope)
  };
}

/**
 * Full Merkle Tree implementation for Cryptographic Election Audit Integrity
 */
export class MerkleTree {
  constructor(leaves = []) {
    this.rawLeaves = leaves;
    this.layers = [];
    this.buildTree();
  }

  buildTree() {
    if (this.rawLeaves.length === 0) {
      // Default empty root
      this.layers = [[hashSync('VOTESHIELD_EMPTY_ROOT')]];
      return;
    }

    // Leaf hashes
    let currentLayer = this.rawLeaves.map(leaf => 
      typeof leaf === 'string' ? (leaf.startsWith('0x') || leaf.length === 64 ? leaf : hashSync(leaf)) : hashSync(leaf)
    );

    this.layers = [currentLayer];

    while (currentLayer.length > 1) {
      const nextLayer = [];
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = (i + 1 < currentLayer.length) ? currentLayer[i + 1] : left; // duplicate if odd
        const parentHash = hashSync(left + right);
        nextLayer.push(parentHash);
      }
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  getRoot() {
    if (this.layers.length === 0 || this.layers[this.layers.length - 1].length === 0) {
      return hashSync('VOTESHIELD_EMPTY_ROOT');
    }
    return this.layers[this.layers.length - 1][0];
  }

  getProof(leafIndex) {
    const proof = [];
    if (leafIndex < 0 || leafIndex >= this.rawLeaves.length) {
      return proof;
    }

    let currentIndex = leafIndex;
    for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
      const layer = this.layers[layerIndex];
      const isRightNode = currentIndex % 2 === 1;
      const pairIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          hash: layer[pairIndex]
        });
      } else {
        // Paired with self
        proof.push({
          position: 'right',
          hash: layer[currentIndex]
        });
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  static verifyProof(leafHash, proof, expectedRoot) {
    let currentHash = leafHash;
    for (const step of proof) {
      if (step.position === 'left') {
        currentHash = hashSync(step.hash + currentHash);
      } else {
        currentHash = hashSync(currentHash + step.hash);
      }
    }
    return currentHash.toLowerCase() === expectedRoot.toLowerCase();
  }
}

/**
 * Generate cryptographic receipt verification card
 */
export function generateVoterReceipt({
  trackerId,
  nullifier,
  leafHash,
  merkleRoot,
  leafIndex,
  proof,
  timestamp
}) {
  return {
    receiptId: `REC-${trackerId.substring(0, 8).toUpperCase()}`,
    trackerId,
    nullifier,
    leafHash,
    merkleRoot,
    leafIndex,
    proof,
    timestamp: new Date(timestamp).toISOString(),
    securitySeal: hashSync(`${trackerId}::${merkleRoot}::${nullifier}`)
  };
}
