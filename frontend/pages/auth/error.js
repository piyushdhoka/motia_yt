import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    console.error('Auth error:', error);
    // Redirect to home after 2 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, router]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'system-ui'
    }}>
      <h1>Authentication Error</h1>
      <p>There was a problem signing you in.</p>
      <p style={{ color: '#666' }}>Redirecting you back...</p>
      {error && <p style={{ fontSize: '12px', color: '#999' }}>Error: {error}</p>}
    </div>
  );
}
