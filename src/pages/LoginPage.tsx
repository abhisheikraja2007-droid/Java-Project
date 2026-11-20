import { useState, FormEvent } from 'react';
import { Lock, Unlock, AlertOctagon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock login - in real app this would call the API
    if (email && password) {
      // Simulate API call
      await new Promise(r => setTimeout(r, 500));
      
      if (password === '1204') {
        login(
          'mock-access-token',
          'mock-refresh-token',
          {
            id: 'US-01',
            name: 'Inspector Elena Rostova',
            email: 'e.rostova@precinct12.gov',
            role: 'Lead Investigator',
            badgeNumber: '1204',
            permissions: ['VIEW_ALL', 'EDIT_CASE', 'AUTHORIZE_EVIDENCE', 'MODIFY_AUDIT', 'MANAGE_USERS'],
          }
        );
        navigate('/');
      } else {
        setError('INVALID SECURITY LOCK PIN. AUTHENTICATION ATTEMPT LOGGED.');
      }
    } else {
      setError('Please enter credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 animate-pulse" />
        
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-2 border border-blue-100">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 font-sans">Precinct 12 Secure Terminal</h1>
          <p className="text-xs text-slate-500 font-mono">T-104 • DISTRICT PRECINCT 12 AUTHORITY</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5 text-left">Operator Email</label>
            <Input
              type="email"
              required
              placeholder="e.rostova@precinct12.gov"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-0">Credentials PIN</label>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••"
                className="w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide PIN' : 'Show PIN'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5" role="alert">
              <AlertOctagon className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            icon={<Unlock className="h-4 w-4 text-emerald-500" />}
          >
            Unlock Console
          </Button>
        </form>

        <div className="text-[9px] font-mono text-slate-500 block mt-2 leading-normal flex items-center justify-center gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
          <AlertOctagon className="h-3 w-3 text-amber-500 shrink-0" />
          Demo credentials: <span className="font-mono text-slate-700">e.rostova@precinct12.gov</span> / <span className="font-mono text-slate-700">1204</span>
        </div>
      </div>
    </div>
  );
}