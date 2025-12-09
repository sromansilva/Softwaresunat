import { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

interface LoginPageProps {
  onLogin: (user: { code: string; name: string; role: string }) => void;
}

const validUsers = [
  { code: 'A22319658', name: 'Sergio Román', role: 'Auditor Senior' },
  { code: 'A22323683', name: 'David Moya', role: 'Auditor' },
  { code: 'A22323711', name: 'Jorge Leturia', role: 'Auditor' },
  { code: 'A22323721', name: 'Sebastián Pérez', role: 'Auditor' },
];

const VALID_PASSWORD = 'qwerty123';

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticación
    setTimeout(() => {
      const user = validUsers.find(u => u.code === codigo);
      
      if (user && password === VALID_PASSWORD) {
        onLogin(user);
      } else {
        setError('Credenciales incorrectas. Por favor, verifique su código de empleado y contraseña.');
      }
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003876] to-[#002555] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="#003876" fontSize="48">
                S
              </text>
            </svg>
          </div>
          <h1 className="text-white text-3xl mb-2">SUNAT</h1>
          <p className="text-white/80 text-sm">Sistema de Fiscalización Inteligente</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-[#003876]">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="codigo">Código de Empleado</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="codigo"
                    type="text"
                    placeholder="A22319658"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#003876] hover:bg-[#002555]"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Sistema Seguro SUNAT - Uso exclusivo de personal autorizado
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-white/60 text-xs">
          <p>&copy; 2024 SUNAT - Superintendencia Nacional de Aduanas y de Administración Tributaria</p>
        </div>
      </div>
    </div>
  );
}