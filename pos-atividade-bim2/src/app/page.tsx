import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex w-full max-w-md flex-col items-center justify-center p-8 bg-white dark:bg-zinc-950 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
          Atividade Avaliativa 2º Bimestre
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
          Disciplina de POS • Infoweb • IFRN
        </p>

        <div className="w-full bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg mb-8">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase block mb-1">
            Aluna
          </span>
          <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
            Sarah Medeiros dos Santos
          </p>
        </div>

        <Link
          href="/auth"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 font-medium transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Acessar Tela de Login
        </Link>
      </main>
    </div>
  );
}