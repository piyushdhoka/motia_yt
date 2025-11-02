import { useState } from 'react';

// Backend base URL must be provided via environment variable NEXT_PUBLIC_BACKEND_URL
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [channel, setChannel] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);

    if (!channel || !email) {
      setError('Please provide both channel and email');
      setLoading(false);
      return;
    }

    if (!BACKEND) {
      setError('Backend URL not configured. Set NEXT_PUBLIC_BACKEND_URL in .env.local before running.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(BACKEND.replace(/\/$/, '') + '/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, email }),
      });

      const bodyText = await res.text();
      let body;
      try {
        body = JSON.parse(bodyText);
      } catch {
        body = { raw: bodyText };
      }

      if (!res.ok) {
        setError(body?.error || body?.message || `Request failed with ${res.status}`);
      } else {
        setResponse(body);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'system-ui, Arial', padding: 20 }}>
      <h1>Motia — Submit Channel</h1>
      <p style={{ maxWidth: 760 }}>
        This frontend posts a channel handle or name and your email to the backend to generate improved
        YouTube titles and send them over email.
      </p>


      {!BACKEND && (
        <p style={{ color: 'crimson' }}>
          NEXT_PUBLIC_BACKEND_URL is not set. Create <code>.env.local</code> in this folder with the variable set
          before running or deploying.
        </p>
      )}

      <form onSubmit={submit} style={{ marginBottom: 16, maxWidth: 680 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Channel (name or handle, e.g. @mychannel or My Channel Name)
          <input
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            placeholder="@handle or channel name"
            style={{ display: 'block', marginTop: 6, width: '100%' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Your email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ display: 'block', marginTop: 6, width: '100%' }}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && (
        <section style={{ color: 'crimson', maxWidth: 760 }}>
          <h3>Error</h3>
          <pre>{error}</pre>
        </section>
      )}

      {response && (
        <section style={{ maxWidth: 760 }}>
          <h3>Response</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f8fa', padding: 12 }}>{JSON.stringify(response, null, 2)}</pre>
          {response.jobId && (
            <p>
              Job ID: <code>{response.jobId}</code>
            </p>
          )}
          <p style={{ marginTop: 8 }}>
            The backend will process the job and email you results when ready. There is no public status
            endpoint in the current backend, so check your email.
          </p>
        </section>
      )}

      <hr style={{ marginTop: 20 }} />
      <small>
        Tip: set <code>NEXT_PUBLIC_BACKEND_URL</code> in <code>.env.local</code> to change the backend base
        URL.
      </small>
    </main>
  );
}
