"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
// import { register } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await register(fullName, email, password);
      alert("Cuenta creada correctamente");
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">
            T
          </div>
          <h1 className="text-xl font-semibold">Telecom</h1>
        </div>

        <form className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Crear una cuenta</h2>

          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña (min. 6)"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type={show ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="text-sm text-blue-600"
          >
            {show ? "Ocultar contraseñas" : "Mostrar contraseñas"}
          </button>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
            Crear Cuenta
          </button>

          <p className="text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/" className="text-blue-600 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}