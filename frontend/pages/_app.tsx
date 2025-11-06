import { AppProps } from 'next/app';
import { ClerkLayout } from '../lib/clerk';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkLayout>
      <Component {...pageProps} />
    </ClerkLayout>
  );
}