"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const router = useRouter();
  
  // Estado para gerir os campos do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação simples (não vazios)
    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha o apelido e a senha.");
      return;
    }

    setLoading(true);

    try {
    // Autenticação na API DummyJSON
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 60,
      }),
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Apelido ou senha incorretos.");
      }

      // Armazena localmente os dados do utilizador
      localStorage.setItem("user", JSON.stringify(data));

      // Redireciona para o dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Aceder à Conta</CardTitle>
          <CardDescription className="text-center">
            Utilize as credenciais do DummyJSON (ex: emilys / emilyspass)
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Apelido (Username)
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Ex: emilys"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A autenticar..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}