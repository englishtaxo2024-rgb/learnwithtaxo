import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { recordsApi } from '../../services/recordsApi';

export function LoginPage({ setUser, mode = 'student' }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await recordsApi.login({ identifier, accessCode, requestedRole: mode });
      setUser(data.user);
      navigate(data.redirectPath || `/${data.role}`, { replace: true });
    } catch (err) {
      setError(err.message || 'This account was not found. Please check your details or contact support.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-md">
        <BrandLogo role={mode} />
        <h1 className="mt-8 text-2xl font-black capitalize">{mode} login</h1>
        <p className="mt-2 text-taxo-light">Use your approved email, phone, or code with the access code assigned by admin.</p>
        <form className="mt-5 space-y-3" onSubmit={login}>
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder={mode === 'student' ? 'Email, phone, or student code' : 'Email or teacher code'} className="w-full rounded-md border border-white/10 bg-taxo-dark p-3" required />
          <input value={accessCode} onChange={(event) => setAccessCode(event.target.value)} placeholder="Access code or password" type="password" className="w-full rounded-md border border-white/10 bg-taxo-dark p-3" required />
          {error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button className="w-full" disabled={busy}>{busy ? 'Checking...' : 'Continue to portal'}</Button>
        </form>
      </Card>
    </div>
  );
}
