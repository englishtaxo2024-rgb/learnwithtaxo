import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { demoUsers } from '../../config/roles';

export function LoginPage({ setUser, mode = 'student' }) {
  const navigate = useNavigate();
  function login() {
    const user = demoUsers[mode] || demoUsers.student;
    setUser(user);
    navigate(mode === 'teacher' ? '/teacher' : mode === 'admin' ? '/admin' : '/student');
  }
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-md">
        <BrandLogo role={mode} />
        <h1 className="mt-8 text-2xl font-black capitalize">{mode} login</h1>
        <p className="mt-2 text-taxo-light">Parent email is required for student login. Teacher passwords are owner-managed and cannot be changed by teachers.</p>
        <div className="mt-5 space-y-3">
          <input placeholder={mode === 'student' ? 'Parent email' : 'Email'} className="w-full rounded-md border border-white/10 bg-taxo-dark p-3" />
          <input placeholder="Password or placement access code" type="password" className="w-full rounded-md border border-white/10 bg-taxo-dark p-3" />
          <Button className="w-full" onClick={login}>Continue to portal</Button>
        </div>
      </Card>
    </div>
  );
}
