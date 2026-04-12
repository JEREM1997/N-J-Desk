import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="space-y-5 p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
        <p className="text-sm text-muted">Accédez à votre espace chantier premium.</p>
      </div>
      <form className="space-y-4">
        <input className="w-full rounded-xl border bg-white px-4 py-3" type="email" placeholder="Email" />
        <input className="w-full rounded-xl border bg-white px-4 py-3" type="password" placeholder="Mot de passe" />
        <Button className="w-full">Se connecter</Button>
      </form>
      <p className="text-center text-sm text-muted">
        Pas encore de compte ?{' '}
        <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
          Inscription
        </Link>
      </p>
    </Card>
  );
}
