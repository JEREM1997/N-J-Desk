import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <section className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted">Configuration de l&apos;espace N&J Intérieurs.</p>
      </div>
      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Identité de la société</h2>
        <input className="w-full rounded-xl border bg-white px-3 py-2 text-sm" defaultValue="N&J Intérieurs" />
        <div className="rounded-xl border border-dashed bg-black/[0.02] p-4 text-sm text-muted">
          Logo actuel : <code>public/branding/logo-placeholder.svg</code>
          <input type="file" className="mt-2 block w-full text-xs" />
        </div>
      </Card>
      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Préférences générales</h2>
        <label className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
          Notifications email
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
          Vue compacte tableaux
          <input type="checkbox" />
        </label>
        <Button className="w-fit">Enregistrer</Button>
      </Card>
    </section>
  );
}
