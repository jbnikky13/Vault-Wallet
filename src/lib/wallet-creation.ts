import { generateMnemonic, mnemonicToAccount, english } from "viem/accounts";

export type WalletPhraseOption = {
  id: string;
  words: string[];
  mnemonic: string;
};

/**
 * Generate a cryptographically random BIP-39 recovery phrase.
 * The phrase is generated locally in the browser by viem.
 * Never send the mnemonic to an API or store it on a server.
 */
export function generateWalletPhrase(): string {
  return generateMnemonic(english, 128);
}

export function createPhraseOptions(count = 3): WalletPhraseOption[] {
  return Array.from({ length: count }, (_, index) => {
    const mnemonic = generateWalletPhrase();
    return {
      id: `${Date.now()}-${index}-${crypto.randomUUID()}`,
      words: mnemonic.split(" "),
      mnemonic,
    };
  });
}

export function getWalletAddress(mnemonic: string): `0x${string}` {
  return mnemonicToAccount(mnemonic).address;
}

export function validateMnemonic(mnemonic: string): boolean {
  try {
    mnemonicToAccount(mnemonic);
    return true;
  } catch {
    return false;
  }
}
