import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card className="space-y-6 p-8 md:p-9">
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Administration</p>
        <h1 className="text-3xl font-semibold tracking-tight">Création désactivée</h1>
        <p className="text-sm text-muted">Les nouveaux utilisateurs sont créés depuis les paramètres.</p>
      </div>
      <Link href="/login">
        <Button className="w-full">Retour à la connexion</Button>
      </Link>
    </Card>
  );
}
