import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <section className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-[#0f0f14] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.35)]">
        <p className="text-sm uppercase tracking-[0.34em] text-[#c9a227]">Connexion admin</p>
        <h1 className="display-font mt-4 text-6xl uppercase tracking-[0.14em] text-white">Gerer la boutique</h1>
        <p className="mt-4 text-stone-300">
          Connectez-vous avec un compte staff pour gerer les produits, les images et les nouvelles commandes.
        </p>
        <LoginForm />
        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
          <p className="font-semibold text-white">Comptes de demo</p>
          <p className="mt-2">Admin: admin@novathread.com / admin12345</p>
          <p>Staff: staff@novathread.com / staff12345</p>
        </div>
      </section>
    </main>
  );
}
