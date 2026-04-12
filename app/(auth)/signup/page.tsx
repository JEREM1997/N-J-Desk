import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <Card className="space-y-6 p-8 md:p-9">
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Lancement rapide</p>
        <h1 className="text-3xl font-semibold tracking-tight">Créer un compte</h1>
        <p className="text-sm text-muted">Initialisez votre espace N&J Desk en quelques secondes.</p>
      </div>
      <form className="space-y-4">
        <input className="w-full" placeholder="Nom complet" />
        <input className="w-full" type="email" placeholder="Email" />
        <input className="w-full" type="password" placeholder="Mot de passe" />
        <Button className="w-full">Créer le compte</Button>
      </form>
      <p className="text-center text-sm text-muted">
        Déjà inscrit ?{' '}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 transition hover:underline">
          Connexion
        </Link>
      </p>
    </Card>
  );
}
