"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-10 grid gap-4">
      <input
        name="email"
        type="email"
        required
        placeholder="Email admin"
        className="rounded-[1.3rem] border border-white/15 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-stone-500"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Mot de passe"
        className="rounded-[1.3rem] border border-white/15 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-stone-500"
      />
      {state.error ? <p className="text-sm text-rose-400">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#c9a227] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#e2c769] disabled:opacity-70"
      >
        {pending ? "Connexion..." : "Entrer"}
      </button>
    </form>
  );
}
