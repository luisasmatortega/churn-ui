"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
// import { login } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) 
  {
    e.preventDefault();

    try {
      const data = await login(email, password);

      // 🔐 Guardamos JWT real
      localStorage.setItem("token", data.token);

      document.cookie = `token=${data.token}; path=/`;

      router.push("/dashboard/inicio");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 grid place-items-center font-bold">
            T
          </div>
          <h1 className="text-xl font-semibold">Telecom</h1>
        </div>

        <form  className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Iniciar Sesión</h2>

          <div>
            <label className="text-sm text-slate-600">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-600">Contraseña</label>
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="text-sm text-blue-600"
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
            Iniciar Sesión
          </button>

          <p className="text-center text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-blue-600 font-medium">
              Crear una cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}