import Button from "@/components/Button";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex flex-col gap-y-4 items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-error">403 - Forbidden</h1>

      <p className="text-lg font-medium max-w-md">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>

      <Button link="/dashboard">Retour au tableau de bord</Button>
    </main>
  );
}
