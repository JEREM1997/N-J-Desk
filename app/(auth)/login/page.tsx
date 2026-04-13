import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="space-y-6 p-8 md:p-9">
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Espace sécurisé</p>
        <h1 className="text-3xl font-semibold tracking-tight">Connexion</h1>
        <p className="text-sm text-muted">Accédez à votre espace chantier premium.</p>
      </div>
      <form className="space-y-4">
        <input className="w-full" type="email" placeholder="Email" />
        <input className="w-full" type="password" placeholder="Mot de passe" />
        <Button className="w-full">Se connecter</Button>
      </form>
      <p className="text-center text-sm text-muted">Création de comptes gérée depuis les paramètres administrateur.</p>
    </Card>
  );
}
