import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <Card className="space-y-5 p-8">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
        <p className="text-sm text-muted">Initialisez votre espace N&J Desk en quelques secondes.</p>
      </div>
      <form className="space-y-4">
        <input className="w-full rounded-xl border bg-white px-4 py-3" placeholder="Nom complet" />
        <input className="w-full rounded-xl border bg-white px-4 py-3" type="email" placeholder="Email" />
        <input className="w-full rounded-xl border bg-white px-4 py-3" type="password" placeholder="Mot de passe" />
        <Button className="w-full">Créer le compte</Button>
      </form>
      <p className="text-center text-sm text-muted">
        Déjà inscrit ?{' '}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Connexion
        </Link>
      </p>
    </Card>
  );
}
