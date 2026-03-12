import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useSignInMutation } from '../store/api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';

export default function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn({ email, password }).unwrap();
      dispatch(setCredentials({
        user: result.user,
        token: result.session.access_token,
      }));
      toast.success('Signed in successfully');
      navigate('/dam');
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Invalid email or password';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access the DAM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
