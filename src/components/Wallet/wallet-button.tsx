'use client';

import { ReactNode, useMemo, useCallback } from 'react';
import { WalletError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter} from '@solana/wallet-adapter-wallets';
import { useCluster } from '../cluster/cluster-data-access';

import '@solana/wallet-adapter-react-ui/styles.css';

// Optional: dynamic WalletMultiButton
import dynamic from 'next/dynamic';
export const WalletButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();

  // Ensure we have a valid endpoint
  const endpoint = useMemo(() => cluster?.endpoint || '', [cluster]);

  const onError = useCallback((error: WalletError) => {
    console.error('Wallet error:', error);
  }, []);

  // Add wallets here (Phantom for now)
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  // Show loader if endpoint not ready
  if (!endpoint) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Connecting to Solana...
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}