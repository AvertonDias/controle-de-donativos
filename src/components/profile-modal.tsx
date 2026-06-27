'use client';

import * as React from 'react';
import { updateProfile, updatePassword, User } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ user, open, onOpenChange }: ProfileModalProps) {
  const [name, setName] = React.useState(user.displayName || '');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  // Atualiza o nome local quando o usuário do firebase mudar
  React.useEffect(() => {
    if (user.displayName) {
      setName(user.displayName);
    }
  }, [user.displayName]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Atualizar nome se mudou
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Atualizar senha se fornecida
      if (password) {
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        if (password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        await updatePassword(user, password);
      }

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas alterações foram salvas com sucesso.',
      });
      onOpenChange(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      let message = error.message || 'Não foi possível salvar as alterações.';
      
      if (error.code === 'auth/requires-recent-login') {
        message = 'Para alterar a senha, você precisa ter feito login recentemente. Por favor, saia e entre novamente.';
      }

      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">Configurar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações básicas de conta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome Completo</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-4 border-t pt-4">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-primary">Segurança</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Alterar Senha</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Deixe em branco para manter"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-accent font-bold py-6 shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}