import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, UserCircle, Shield } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: Role) => {
    login(role);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">LA County HR Portal</CardTitle>
          <CardDescription>Select your role to access the portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="h-24 w-full flex-col gap-2 text-left transition-all hover:border-primary hover:bg-primary/5"
            onClick={() => handleLogin('employee')}
          >
            <UserCircle className="h-8 w-8 text-primary" />
            <div>
              <div className="font-semibold">Employee</div>
              <div className="text-xs text-muted-foreground">
                View dashboard, submit time off requests
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-24 w-full flex-col gap-2 text-left transition-all hover:border-primary hover:bg-primary/5"
            onClick={() => handleLogin('admin')}
          >
            <Shield className="h-8 w-8 text-accent" />
            <div>
              <div className="font-semibold">HR Admin</div>
              <div className="text-xs text-muted-foreground">
                Manage requests, announcements, and reports
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
