import { Provider } from '@web3-react/types';

export type OKXWalletProvider = Provider & {
  isOkxWallet?: boolean;
  isConnected?: () => boolean;
  providers?: OKXWalletProvider[];
};

interface Window {
  okxwallet?: OKXWalletProvider;
}

export interface DetectOKXWalletProviderOptions {
  silent?: boolean;
  timeout?: number;
}

/**
 * Returns a Promise that resolves to the value of window.ethereum or window.avalanche
 * if it is set with the Core Wallet provider within the given timeout, or null.
 * The Promise will not reject, but an error will be thrown if invalid options
 * are provided.
 *
 * @param options - Options bag.
 * @param options.silent - Whether to silence console errors. Does not affect
 * thrown errors. Default: false
 * @param options.timeout - Milliseconds to wait for 'ethereum#initialized' to
 * be dispatched. Default: 3000
 * @returns A Promise that resolves with the Provider if it is detected within
 * given timeout, otherwise null.
 */
export function detectOKXWalletProvider<T = OKXWalletProvider>({
  silent = false,
  timeout = 3000,
}: DetectOKXWalletProviderOptions = {}): Promise<T | null> {
  let handled = false;

  return new Promise((resolve) => {
    if ((window as Window).okxwallet) {
      handleProvider();
    } else {
      window.addEventListener('okxwallet#initialized', handleProvider, {
        once: true,
      });

      setTimeout(() => {
        handleProvider();
      }, timeout);
    }

    function handleProvider() {
      if (handled) {
        return;
      }
      handled = true;

      window.removeEventListener('okxwallet#initialized', handleProvider);

      const { okxwallet } = window as Window;

      if (okxwallet && okxwallet.isOkxWallet) {
        resolve(okxwallet as unknown as T);
      } else {
        const message = okxwallet
          ? 'Non-OKXWallet window.okxwallet detected.'
          : 'Unable to detect window.okxwallet.';

        !silent && console.error('detectOKXWalletProvider:', message);
        resolve(null);
      }
    }
  });
}
