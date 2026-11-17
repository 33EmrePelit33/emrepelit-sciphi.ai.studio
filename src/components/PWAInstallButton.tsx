import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Smartphone, Monitor, X, WifiOff, Share2, ShieldCheck, Globe } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { OFFICIAL_10_WEBSITES } from '../data/initialData';

interface PWAInstallButtonProps {
  compact?: boolean;
  totalArticlesCount?: number;
  onDownloadInteraction?: (detail: {
    action: 'PROMPT_TRIGGERED' | 'INSTALL_ACCEPTED' | 'INSTALL_DISMISSED' | 'IOS_GUIDE_OPENED' | 'DESKTOP_GUIDE_OPENED' | 'OFFLINE_LAUNCHER_DOWNLOADED';
    summary: string;
  }) => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  totalArticlesCount = 316,
  onDownloadInteraction,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installSuccessBanner, setInstallSuccessBanner] = useState(false);

  useEffect(() => {
    const onInstalledEvent = () => {
      setInstallSuccessBanner(true);
      onDownloadInteraction?.({
        action: 'INSTALL_ACCEPTED',
        summary: 'PWA Uygulama Kurulumu Tamamlandı (Ana Ekran / Masaüstü Uygulaması Yüklendi)',
      });
    };
    window.addEventListener('sciphil:pwa-installed', onInstalledEvent);
    return () => window.removeEventListener('sciphil:pwa-installed', onInstalledEvent);
  }, [onDownloadInteraction]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showInstallModal) {
        setShowInstallModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showInstallModal]);

  // Per PWA standard: suppress install button when already running in standalone installed mode
  if (isInstalled) {
    return null;
  }

  const handleDownloadClick = async () => {
    if (isInstallable) {
      onDownloadInteraction?.({
        action: 'PROMPT_TRIGGERED',
        summary: 'Üst Menü Download Butonu: Tarayıcı Native PWA Kurulum Penceresi Başlatıldı',
      });
      const accepted = await install();
      if (accepted) {
        setInstallSuccessBanner(true);
        onDownloadInteraction?.({
          action: 'INSTALL_ACCEPTED',
          summary: 'Üst Menü Download Butonu: Kullanıcı Uygulama Kurulumunu Onayladı (PWA Yüklendi)',
        });
      } else {
        onDownloadInteraction?.({
          action: 'INSTALL_DISMISSED',
          summary: 'Üst Menü Download Butonu: Kurulum Kılavuzu Açıldı',
        });
        setShowInstallModal(true);
      }
      return;
    }

    if (isIOS) {
      onDownloadInteraction?.({
        action: 'IOS_GUIDE_OPENED',
        summary: 'Üst Menü Download Butonu: iOS Safari Ana Ekrana Ekle Kılavuzu Açıldı',
      });
      setShowInstallModal(true);
      return;
    }

    onDownloadInteraction?.({
      action: 'DESKTOP_GUIDE_OPENED',
      summary: 'Üst Menü Download Butonu: Uygulama Kurulum & Çevrimdışı Paket Penceresi Açıldı',
    });
    setShowInstallModal(true);
  };

  const handleDownloadOfflineLauncher = () => {
    const htmlContent = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Emre Pelit — Sci-Phil Ana Hub Uygulaması (${totalArticlesCount} Makale · 10 Site 301 Ağı)</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0F172A; color: #F8FAFC; margin: 0; padding: 32px; line-height: 1.6; }
    .card { max-width: 720px; margin: 0 auto; background: #1E293B; border: 2px solid #F59E0B; border-radius: 6px; padding: 28px; }
    h1 { margin-top: 0; color: #FBBF24; font-size: 22px; }
    a.btn { display: inline-block; background: #10B981; color: #022C22; font-weight: 700; text-decoration: none; padding: 12px 20px; border-radius: 4px; margin: 12px 0; }
    ul { font-family: monospace; font-size: 13px; padding-left: 18px; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Emre Pelit — Sci-Phil Ana Hub &amp; 301 Akademik Ağı</h1>
    <p><strong>Kapsam:</strong> ${totalArticlesCount} Özgün Bilim &amp; Felsefe Makalesi (Önceki Bilimsel Araştırmalar &amp; Yerleşik Kabuller + 12 Dil Seslendirme + İnteraktif Simülasyonlar)</p>
    <p><a class="btn" href="https://emrepelit-sciphi.ai.studio/">Ana Hub Uygulamasını Başlat (emrepelit-sciphi.ai.studio) →</a></p>
    <h3>10 Resmi 301 Ağı Web Sitesi (Tekil Otorite Merkezi: emrepelit-sciphi.ai.studio)</h3>
    <ul>
      ${OFFICIAL_10_WEBSITES.map((d) => `<li><a style="color:#38BDF8" href="https://${d}/">${d}</a></li>`).join('\n      ')}
    </ul>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sci-Phil-Emre-Pelit-App-Launcher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    onDownloadInteraction?.({
      action: 'OFFLINE_LAUNCHER_DOWNLOADED',
      summary: 'Uygulama Çevrimdışı Başlatıcı Dosyası (Sci-Phil-Emre-Pelit-App-Launcher.html) İndirildi',
    });
    setInstallSuccessBanner(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleDownloadClick}
        title="Sci-Phil Akademik Platformunu Uygulama Olarak İndir / Kur (PWA · 10 Site 301 Ağı)"
        aria-label="Uygulamayı İndir (Download)"
        className={`inline-flex items-center gap-1.5 font-mono font-extrabold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
          compact
            ? 'px-2.5 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700'
            : 'px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700 shadow-xs'
        }`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Download</span>
        {!compact && (
          <span className="hidden xl:inline text-[10px] font-semibold opacity-90">
            (Uygulama)
          </span>
        )}
      </button>

      {showInstallModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Uygulama Olarak İndir (PWA Kurulum Penceresi)"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0F172A] border-2 border-emerald-400 text-slate-100 rounded-sm shadow-2xl p-5 sm:p-6 space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/pwa-192x192.png"
                  alt="Sci-Phil PWA İkonu"
                  width={40}
                  height={40}
                  decoding="async"
                  className="w-10 h-10 rounded-md border border-amber-400/80 object-cover shrink-0"
                />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                    PWA BAĞIMSIZ UYGULAMA · 10 RESMİ 301 SİTESİNDE AKTİF
                  </div>
                  <h3 className="text-base font-editorial font-bold text-white">
                    Emre Pelit — Sci-Phil Uygulamasını İndir &amp; Kur
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                aria-label="Kurulum Penceresini Kapat"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {installSuccessBanner && (
              <div className="bg-emerald-950 border border-emerald-400 text-emerald-200 px-3 py-2 rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  İşlem tamamlandı ve Analitik Paneli Uygulama Etkileşimleri kaydına işlendi!
                </span>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                {isIOS ? (
                  <>
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>iPhone / iPad (iOS Safari) Kurulum Adımları</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span>Masaüstü (Windows / macOS / Linux) &amp; Android Kurulumu</span>
                  </>
                )}
              </div>

              {isIOS ? (
                <ol className="list-decimal pl-5 space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    Safari alt araç çubuğundaki <strong>Paylaş</strong> (<Share2 className="inline w-3 h-3" />) simgesine dokunun.
                  </li>
                  <li>
                    Aşağı kaydırıp <strong>Ana Ekrana Ekle (Add to Home Screen)</strong> seçeneğine dokunun.
                  </li>
                  <li>
                    Sağ üstten <strong>Ekle</strong> butonuna basın; Sci-Phil bağımsız uygulama olarak kurulacaktır.
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal pl-5 space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    <strong>Chrome / Edge / Brave / Opera:</strong> Sağ üstteki tarayıcı adres çubuğunda bulunan{' '}
                    <strong>&quot;Sci-Phil Uygulamasını Yükle&quot;</strong> simgesine veya tarayıcı menüsünden{' '}
                    <strong>&quot;Yayınla, kaydet ve paylaş → Sayfayı uygulama olarak yükle&quot;</strong> seçeneğine tıklayın.
                  </li>
                  <li>
                    <strong>Android Chrome / Samsung Internet:</strong> Menü (⋮) →{' '}
                    <strong>&quot;Uygulamayı yükle / Ana ekrana ekle&quot;</strong> seçin.
                  </li>
                  <li>
                    Web App Manifest (<code>/manifest.webmanifest</code>) ve Service Worker çevrimdışı önbelleği şu anda bu oturumda ve tüm 10 resmi 301 sitesinde aktiftir.
                  </li>
                </ol>
              )}
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xs space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>301 Ağındaki Tüm 10 Resmi Web Sitesinde PWA Hazır:</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {totalArticlesCount} özgün makale, önceki bilimsel araştırmalar (isimli bilim insanları), yerleşik kabuller, 12 dil sesli anlatım ve matematiksel simülasyonlar tek tıkla başlatılabilir uygulama olarak çalışır; otorite %100 <code>emrepelit-sciphi.ai.studio</code> üzerinde korunur.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {isInstallable && (
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Şimdi Tarayıcı ile Kur</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDownloadOfflineLauncher}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Uygulama Başlatıcı Paketini İndir (.html)</span>
              </button>
              <a
                href="/manifest.webmanifest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manifest ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-sm bg-amber-500 px-3.5 py-2 text-xs font-mono font-bold text-slate-950 shadow-xl border border-amber-700"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Çevrimdışı Mod — Önbelleğe alınmış veriler kullanılıyor.</span>
    </div>
  );
};
