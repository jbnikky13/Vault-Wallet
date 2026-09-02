const VAULT_KEY = "arc-wallet-vault-v1";
const ITERATIONS = 310000;

export type WalletVault = {
  version: 1;
  address: `0x${string}`;
  salt: string;
  iv: string;
  ciphertext: string;
  createdAt: string;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function saveWalletVault(mnemonic: string, address: `0x${string}`, password: string): Promise<void> {
  if (password.length < 8) throw new Error("Wallet password must be at least 8 characters.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(mnemonic));
  const vault: WalletVault = { version: 1, address, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)), createdAt: new Date().toISOString() };
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

export function hasWalletVault(): boolean {
  return typeof window !== "undefined" && Boolean(localStorage.getItem(VAULT_KEY));
}

export function getVaultAddress(): `0x${string}` | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return null;
  try { return (JSON.parse(raw) as WalletVault).address; } catch { return null; }
}

export async function unlockWalletVault(password: string): Promise<string> {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) throw new Error("No Arc Wallet exists on this device.");
  const vault = JSON.parse(raw) as WalletVault;
  const key = await deriveKey(password, base64ToBytes(vault.salt));
  try {
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(vault.iv) }, key, base64ToBytes(vault.ciphertext));
    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error("Incorrect wallet password.");
  }
}

export function clearWalletVault(): void {
  localStorage.removeItem(VAULT_KEY);
}
