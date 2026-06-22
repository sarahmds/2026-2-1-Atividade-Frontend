"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableTableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para formulário (Criar / Editar)
  const [quoteText, setQuoteText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Autores salvos localmente
  const [savedAuthors, setSavedAuthors] = useState<string[]>([]);

  // 1. Verificar se o usuário está autenticado e carregar dados
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth");
      return;
    }
    setUser(JSON.parse(storedUser));

    // Carregar autores sugeridos
    const storedAuthors = localStorage.getItem("savedAuthors");
    if (storedAuthors) {
      setSavedAuthors(JSON.parse(storedAuthors));
    }

    // Carregar frases da API
    fetch("https://dummyjson.com/quotes?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setQuotes(data.quotes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // 2. Salvar novo autor nas sugestões locais
  const saveAuthorLocally = (author: string) => {
    const trimmed = author.trim();
    if (trimmed && !savedAuthors.includes(trimmed)) {
      const updated = [...savedAuthors, trimmed];
      setSavedAuthors(updated);
      localStorage.setItem("savedAuthors", JSON.stringify(updated));
    }
  };

  // 3. Submeter formulário (Criar ou Atualizar)
  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!quoteText.trim() || !authorName.trim()) {
      setFormError("Por favor, preencha a frase e o autor.");
      return;
    }

    if (editingId !== null) {
      // Atualizar localmente
      setQuotes(
        quotes.map((q) =>
          q.id === editingId ? { ...q, quote: quoteText.trim(), author: authorName.trim() } : q
        )
      );
    } else {
      // Criar localmente
      const newQuote: Quote = {
        id: Date.now(), // ID gerado temporário
        quote: quoteText.trim(),
        author: authorName.trim(),
      };
      setQuotes([newQuote, ...quotes]);
    }

    saveAuthorLocally(authorName);
    handleCloseDialog();
  };

  // 4. Preparar para editar
  const handleEditClick = (quote: Quote) => {
    setEditingId(quote.id);
    setQuoteText(quote.quote);
    setAuthorName(quote.author);
    setIsDialogOpen(true);
  };

  // 5. Apagar frase
  const handleDeleteQuote = (id: number) => {
    setQuotes(quotes.filter((q) => q.id !== id));
  };

  // Limpar form ao fechar modal
  const handleCloseDialog = () => {
    setEditingId(null);
    setQuoteText("");
    setAuthorName("");
    setFormError(null);
    setIsDialogOpen(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-sm font-medium text-zinc-500">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard de Frases</h1>
            <p className="text-sm text-zinc-500">Olá, {user.firstName || "Usuário"}. Gerencie suas citações favoritas.</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Sair</Button>
        </header>

        {/* Listagem de Frases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Citações cadastradas</CardTitle>
              <CardDescription>Visualize, edite ou apague frases célebres.</CardDescription>
            </div>

            {/* Modal para criar frase */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>Nova Frase</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar Frase" : "Adicionar Frase"}</DialogTitle>
                  <DialogDescription>
                    Insira o texto da citação e o respectivo autor.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSaveQuote} className="space-y-4 pt-2">
                  {formError && (
                    <div className="p-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/30 rounded border border-red-200">
                      {formError}
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Frase / Citação</label>
                    <Textarea
                      placeholder="Escreva a frase aqui..."
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Autor</label>
                    <Input
                      placeholder="Nome do autor"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      list="authors-suggestions"
                    />
                    {/* Autocompletar com autores salvos localmente */}
                    <datalist id="authors-suggestions">
                      {savedAuthors.map((author, index) => (
                        <option key={index} value={author} />
                      ))}
                    </datalist>
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="button" variant="ghost" onClick={handleCloseDialog}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
              <Table>
                <TableHeader>
                  <TableTableRow>
                    <TableHead>Frase</TableHead>
                    <TableHead className="w-[180px]">Autor</TableHead>
                    <TableHead className="w-[140px] text-right">Ações</TableHead>
                  </TableTableRow>
                </TableHeader>
                <TableBody>
                  {quotes.length === 0 ? (
                    <TableTableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-sm text-zinc-500">
                        Nenhuma frase disponível.
                      </TableCell>
                    </TableTableRow>
                  ) : (
                    quotes.map((q) => (
                      <TableTableRow key={q.id}>
                        <TableCell className="font-medium">"{q.quote}"</TableCell>
                        <TableCell className="text-zinc-500">{q.author}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(q)}>
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteQuote(q.id)}>
                            Apagar
                          </Button>
                        </TableCell>
                      </TableTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}