import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, UserCheck } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import type { LanguageCode } from '../types';

interface UserAuthButtonProps {
  language: LanguageCode;
  onAuthChange?: (user: User | null, idToken: string | null) => void;
}

const LABELS: Record<LanguageCode, { signIn: string; signOut: string; signingIn: string }> = {
  tr: { signIn: 'Google ile Giriş', signOut: 'Çıkış', signingIn: 'Bağlanıyor…' },
  en: { signIn: 'Google Sign-In', signOut: 'Sign Out', signingIn: 'Signing in…' },
  es: { signIn: 'Entrar con Google', signOut: 'Salir', signingIn: 'Conectando…' },
  de: { signIn: 'Mit Google anmelden', signOut: 'Abmelden', signingIn: 'Anmelden…' },
  fr: { signIn: 'Connexion Google', signOut: 'Déconnexion', signingIn: 'Connexion…' },
  ru: { signIn: 'Войти через Google', signOut: 'Выйти', signingIn: 'Вход…' },
  ar: { signIn: 'دخول Google', signOut: 'خروج', signingIn: 'جاري الدخول…' },
  zh: { signIn: 'Google 登录', signOut: '退出', signingIn: '登录中…' },
  ja: { signIn: 'Googleログイン', signOut: 'ログアウト', signingIn: '接続中…' },
  pt: { signIn: 'Entrar com Google', signOut: 'Sair', signingIn: 'Entrando…' },
  it: { signIn: 'Accedi con Google', signOut: 'Esci', signingIn: 'Accesso…' },
  ko: { signIn: 'Google 로그인', signOut: '로그아웃', signingIn: '로그인 중…' },
  no: { signIn: 'Logg inn med Google', signOut: 'Logg ut', signingIn: 'Logger inn…' },
  is: { signIn: 'Skrá inn með Google', signOut: 'Skrá út', signingIn: 'Skrái inn…' },
  da: { signIn: 'Log ind med Google', signOut: 'Log ud', signingIn: 'Logger ind…' },
  sv: { signIn: 'Logga in med Google', signOut: 'Logga ut', signingIn: 'Loggar in…' },
  nl: { signIn: 'Inloggen met Google', signOut: 'Uitloggen', signingIn: 'Inloggen…' },
  fi: { signIn: 'Kirjaudu Googlella', signOut: 'Kirjaudu ulos', signingIn: 'Kirjaudutaan…' },
  ga: { signIn: 'Sínigh isteach le Google', signOut: 'Sínigh amach', signingIn: 'Ag síniú isteach…' },
  lb: { signIn: 'Mat Google umellen', signOut: 'Ofmellen', signingIn: 'Mellt un…' },
  rm: { signIn: 'S’annunziar cun Google', signOut: 'Sortir', signingIn: 'S’annunzia…' },
  ms: { signIn: 'Log Masuk Google', signOut: 'Log Keluar', signingIn: 'Sedang masuk…' },
  ta: { signIn: 'Google உள்நுழைவு', signOut: 'வெளியேறு', signingIn: 'உள்நுழைகிறது…' },
};

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({ language, onAuthChange }) => {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const ui = LABELS[language] || LABELS.en;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          onAuthChange?.(currentUser, token);
        } catch {
          onAuthChange?.(currentUser, null);
        }
      } else {
        onAuthChange?.(null, null);
      }
    });
    return () => unsub();
  }, [onAuthChange]);

  const handleSignIn = async () => {
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const token = await cred.user.getIdToken();
      onAuthChange?.(cred.user, token);
    } catch (err) {
      console.error('Google Sign-In cancelled or failed:', err);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut(auth);
      onAuthChange?.(null, null);
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    const shortName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Account';
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-stone-300 bg-[#FBF9F5] text-xs font-mono text-stone-800">
        <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span className="max-w-[110px] truncate">{shortName}</span>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={busy}
          title={ui.signOut}
          className="ml-1 pl-1.5 border-l border-stone-300 text-stone-600 hover:text-stone-950 cursor-pointer inline-flex items-center gap-1"
        >
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">{ui.signOut}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={busy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-stone-300 bg-white hover:bg-stone-100 text-xs font-mono text-stone-800 transition-colors cursor-pointer disabled:opacity-50"
    >
      <LogIn className="w-3.5 h-3.5 text-[#1E3A8A]" />
      <span>{busy ? ui.signingIn : ui.signIn}</span>
    </button>
  );
};
