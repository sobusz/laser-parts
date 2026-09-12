import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import BrandLockup from "@/components/BrandLockup";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useUtils();

  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/admin");
    },
    onError: (err) => setError(err.message),
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block bg-black">
        <img src="/photos/hero-laser.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
        <div className="absolute inset-0 tech-grid-dark" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
        <div className="relative h-full p-10 flex flex-col justify-end">
          <BrandLockup inverted />
          <p className="text-white/70 mt-6 max-w-sm">Panel administracyjny katalogu B2B Laser Parts.</p>
        </div>
      </div>
      <form
        className="flex flex-col justify-center p-8 lg:p-16 bg-background"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          login.mutate({ email, password });
        }}
      >
        <div className="w-full max-w-sm mx-auto">
          <div className="lg:hidden mb-8">
            <BrandLockup />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">Logowanie</h1>
          <p className="text-sm text-muted-foreground mb-6">Dostęp tylko dla administratorów.</p>
          <div className="space-y-3">
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Hasło</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 uppercase tracking-wide text-[13px]" disabled={login.isPending}>
              {login.isPending ? "Logowanie..." : "Zaloguj"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
