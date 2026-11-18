import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Code2,
  Compass,
  Download,
  ExternalLink,
  FileBadge,
  FileText,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { LanguageCode } from '../types';

const NEW_CV_PDF_URL = '/assets/emre-pelit-cv.pdf';
const NEW_CV_DOWNLOAD_NAME = 'Emre_Pelit_Ozgecmis_CV.pdf';

interface EmrePelitCVMenuProps {
  language: LanguageCode;
  isOpen: boolean;
  onToggleOpen: () => void;
  totalArticlesCount: number;
}

export const EmrePelitCVMenu: React.FC<EmrePelitCVMenuProps> = ({
  language,
  isOpen,
  onToggleOpen,
  totalArticlesCount,
}) => {
  const [zoomDocument, setZoomDocument] = useState<boolean>(false);
  const safeArticlesCount = Math.max(316, totalArticlesCount);

  const labelMap: Record<
    string,
    {
      dropdownTitle: string;
      dropdownSubtitle: string;
      openBtn: string;
      closeBtn: string;
      ownershipTitle: string;
      ownershipDesc: string;
      cvDocumentTitle: string;
      personalTitle: string;
      achievementsTitle: string;
      educationTitle: string;
      experienceTitle: string;
      careerObjectiveTitle: string;
      skillsTitle: string;
      languagesTitle: string;
      interestsTitle: string;
      profileTitle: string;
      downloadCv: string;
    }
  > = {
    tr: {
      dropdownTitle: 'Emre Pelit — Resmi Özgeçmiş (CV) & Münhasır Eser Sahipliği Açılır Menüsü',
      dropdownSubtitle:
        'Yapay Zeka ve Otonom Robotik Geliştiricisi | Bilgisayar Programcısı · Telif sicili ve güncel özgeçmiş (CV) belgesi',
      openBtn: 'Özgeçmiş (CV) Açılır Menüsünü Aç',
      closeBtn: 'Özgeçmiş (CV) Açılır Menüsünü Kapat',
      ownershipTitle: 'Münhasır Yazar Mülkiyeti ve Telif Hakları Beyanı (%100 Emre Pelit)',
      ownershipDesc: `Bu platformda (emrepelit-sciphi.ai.studio Kanonik Ana Hub), 301 ağında ve emrepelit7337.blogspot.com üzerinde yer alan ${safeArticlesCount} adet bilim, felsefe ve teknoloji makalesinin tamamı, makale özetleri, kavramsal tezleri ve matematiksel simülasyon kurguları münhasıran Emre Pelit'e aittir.`,
      cvDocumentTitle: 'Güncel Özgeçmiş (CV) PDF Belgesi — Emre Pelit (2 Sayfa)',
      personalTitle: 'İletişim & Doğrulanmış Profiller',
      achievementsTitle: 'Başarılar, Burslar ve Ödüller',
      educationTitle: 'Eğitim Bilgileri',
      experienceTitle: 'Deneyim ve Projeler',
      careerObjectiveTitle: 'Kariyer Hedefi',
      skillsTitle: 'Teknik Yetkinlikler',
      languagesTitle: 'Yabancı Dil',
      interestsTitle: 'İlgi Alanları',
      profileTitle: 'Kişisel Profil',
      downloadCv: 'Özgeçmişi İndir (PDF)',
    },
    en: {
      dropdownTitle: 'Emre Pelit — Official Curriculum Vitae (CV) & Exclusive Authorship Menu',
      dropdownSubtitle:
        'AI & Autonomous Robotics Developer | Computer Programmer · Official CV and 100% exclusive authorship registry',
      openBtn: 'Open Emre Pelit CV Dropdown',
      closeBtn: 'Close Emre Pelit CV Dropdown',
      ownershipTitle: 'Declaration of Exclusive Authorship & Copyright (100% Emre Pelit)',
      ownershipDesc: `All ${safeArticlesCount} Science, Philosophy & Technology articles, abstracts, theoretical frameworks, and mathematical simulation models published on this Canonical Main Hub (emrepelit-sciphi.ai.studio) belong exclusively to Emre Pelit.`,
      cvDocumentTitle: 'Updated Curriculum Vitae (CV) PDF — Emre Pelit (2 Pages)',
      personalTitle: 'Contact & Verified Profiles',
      achievementsTitle: 'Achievements, Scholarships & Awards',
      educationTitle: 'Education',
      experienceTitle: 'Experience & Projects',
      careerObjectiveTitle: 'Career Objective',
      skillsTitle: 'Technical Skills',
      languagesTitle: 'Foreign Language',
      interestsTitle: 'Interests',
      profileTitle: 'Personal Profile',
      downloadCv: 'Download Official CV (PDF)',
    },
    es: {
      dropdownTitle: 'Emre Pelit — Currículum Vitae (CV) Oficial y Autoría Exclusiva',
      dropdownSubtitle:
        'Desarrollador de IA y Robótica Autónoma | Programador · Documento CV actualizado y registro de propiedad intelectual',
      openBtn: 'Abrir Menú de CV',
      closeBtn: 'Cerrar Menú de CV',
      ownershipTitle: 'Declaración de Autoría Exclusiva (100% Emre Pelit)',
      ownershipDesc: `La totalidad de los ${safeArticlesCount} artículos en este Hub Central (emrepelit-sciphi.ai.studio) pertenecen exclusivamente a Emre Pelit.`,
      cvDocumentTitle: 'Documento CV Oficial (PDF) — Emre Pelit',
      personalTitle: 'Contacto y Perfiles',
      achievementsTitle: 'Logros, Becas y Premios',
      educationTitle: 'Educación',
      experienceTitle: 'Experiencia y Proyectos',
      careerObjectiveTitle: 'Objetivo Profesional',
      skillsTitle: 'Competencias Técnicas',
      languagesTitle: 'Idiomas',
      interestsTitle: 'Intereses',
      profileTitle: 'Perfil Personal',
      downloadCv: 'Descargar CV (PDF)',
    },
    de: {
      dropdownTitle: 'Emre Pelit — Offizieller Lebenslauf (CV) & Exklusive Urheberschaft',
      dropdownSubtitle:
        'KI- & Autonome Robotik-Entwickler | Programmierer · Aktueller Lebenslauf und Urheberrechtsnachweis',
      openBtn: 'Lebenslauf (CV) öffnen',
      closeBtn: 'Lebenslauf (CV) schließen',
      ownershipTitle: 'Erklärung der Exklusiven Urheberschaft (100 % Emre Pelit)',
      ownershipDesc: `Alle ${safeArticlesCount} Artikel auf emrepelit-sciphi.ai.studio sind ausschließliches geistiges Eigentum von Emre Pelit.`,
      cvDocumentTitle: 'Aktueller Lebenslauf (PDF) — Emre Pelit',
      personalTitle: 'Kontakt & Profile',
      achievementsTitle: 'Erfolge, Stipendien & Auszeichnungen',
      educationTitle: 'Ausbildung',
      experienceTitle: 'Erfahrung & Projekte',
      careerObjectiveTitle: 'Karriereziel',
      skillsTitle: 'Technische Kompetenzen',
      languagesTitle: 'Fremdsprachen',
      interestsTitle: 'Interessen',
      profileTitle: 'Persönliches Profil',
      downloadCv: 'CV herunterladen (PDF)',
    },
    fr: {
      dropdownTitle: 'Emre Pelit — Curriculum Vitae (CV) Officiel et Droit d’Auteur Exclusif',
      dropdownSubtitle:
        'Développeur IA & Robotique Autonome | Programmeur · CV mis à jour et registre de propriété intellectuelle',
      openBtn: 'Ouvrir le Menu CV',
      closeBtn: 'Fermer le Menu CV',
      ownershipTitle: 'Déclaration de Propriété Intellectuelle Exclusive (100 % Emre Pelit)',
      ownershipDesc: `L'intégralité des ${safeArticlesCount} articles publiés sur emrepelit-sciphi.ai.studio appartient exclusivement à Emre Pelit.`,
      cvDocumentTitle: 'Document CV Officiel (PDF) — Emre Pelit',
      personalTitle: 'Contact & Profils',
      achievementsTitle: 'Réalisations, Bourses & Prix',
      educationTitle: 'Formation',
      experienceTitle: 'Expérience & Projets',
      careerObjectiveTitle: 'Objectif Professionnel',
      skillsTitle: 'Compétences Techniques',
      languagesTitle: 'Langues',
      interestsTitle: 'Centres d’Intérêt',
      profileTitle: 'Profil Personnel',
      downloadCv: 'Télécharger le CV (PDF)',
    },
  };

  const labels = labelMap[language] || labelMap.tr;

  return (
    <section id="emre-pelit-cv" className="scroll-mt-24">
      <div className="bg-white border border-stone-300 overflow-hidden">
        {/* Interactive Accordion / Dropdown Header Bar */}
        <div
          onClick={onToggleOpen}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleOpen();
            }
          }}
          className="px-6 py-4 bg-[#F5F2EB] hover:bg-[#ECE7DC] transition-colors flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none border-b border-stone-300"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-editorial font-bold text-lg shrink-0 overflow-hidden border border-stone-300">
              <img
                src="/assets/emre-pelit-cv-portrait.png"
                alt="Emre Pelit CV Fotoğrafı"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#1E3A8A]">
                <span>YAZAR ÖZGEÇMİŞİ (CV) &amp; MÜNHASIR ESER SAHİPLİĞİ</span>
                <span>·</span>
                <span>YAPAY ZEKA &amp; OTONOM ROBOTİK GELİŞTİRİCİSİ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-editorial font-semibold text-stone-900">
                {labels.dropdownTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#1E3A8A] rounded-sm">
              <FileBadge className="w-3.5 h-3.5" />
              <span>{isOpen ? labels.closeBtn : labels.openBtn}</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </div>
        </div>

        {/* Collapsible Dropdown Content */}
        {isOpen && (
          <div className="p-6 lg:p-8 space-y-8 bg-[#FBF9F5]">
            {/* Exclusive Authorship & Copyright Banner */}
            <div className="bg-white border border-stone-300 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{labels.ownershipTitle}</span>
                </div>
                <p className="text-sm font-academic-body text-stone-800 leading-relaxed max-w-4xl">
                  {labels.ownershipDesc}
                </p>
              </div>

              <div className="shrink-0 bg-[#F5F2EB] border border-stone-300 px-4 py-3 text-xs font-mono space-y-1">
                <div className="text-stone-500">YAPAY ZEKA &amp; OTONOM ROBOTİK GELİŞTİRİCİSİ</div>
                <div className="text-base font-bold text-stone-900">EMRE PELİT</div>
                <div className="text-[11px] text-emerald-800">
                  Tüm Makaleler ({safeArticlesCount}/{safeArticlesCount}) Emre Pelit’e Aittir
                </div>
              </div>
            </div>

            {/* Two-Column CV Presentation: Left Technical Competencies & PDF / Right Career, Education, Experience & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 5 Cols: Embedded PDF Document + Technical Skills + Foreign Language + Interests + Personal Profile */}
              <div className="lg:col-span-5 space-y-5">
                {/* Embedded Updated Official PDF CV */}
                <div className="bg-white border border-stone-300 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-800">
                      <FileText className="w-4 h-4 text-[#1E3A8A]" />
                      <span>{labels.cvDocumentTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setZoomDocument((prev) => !prev)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-sm cursor-pointer"
                      >
                        {zoomDocument ? (
                          <>
                            <Minimize2 className="w-3.5 h-3.5" />
                            <span>Küçült</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Genişlet</span>
                          </>
                        )}
                      </button>
                      <a
                        href={NEW_CV_PDF_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Aç</span>
                      </a>
                      <a
                        href={NEW_CV_PDF_URL}
                        download={NEW_CV_DOWNLOAD_NAME}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF İndir</span>
                      </a>
                    </div>
                  </div>

                  <div
                    className={`border border-stone-200 bg-stone-100 overflow-hidden transition-all flex flex-col ${
                      zoomDocument ? 'h-[820px]' : 'h-[520px]'
                    }`}
                  >
                    <object
                      data={`${NEW_CV_PDF_URL}#view=FitH`}
                      type="application/pdf"
                      className="w-full flex-1 min-h-0"
                      aria-label="Emre Pelit Resmi Özgeçmiş (CV) PDF Belgesi"
                    >
                      <iframe
                        src={`${NEW_CV_PDF_URL}#view=FitH`}
                        title="Emre Pelit Resmi Özgeçmiş (CV) PDF Belgesi"
                        className="w-full h-full border-0"
                      >
                        <div className="p-6 text-center space-y-3 text-xs font-mono text-stone-700">
                          <p>Tarayıcınız gömülü PDF önizlemesini desteklemiyorsa belgeyi doğrudan açabilirsiniz.</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            <a
                              href={NEW_CV_PDF_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white border border-stone-300 text-[#1E3A8A] font-semibold rounded-sm"
                            >
                              Yeni Sekmede Aç ↗
                            </a>
                            <a
                              href={NEW_CV_PDF_URL}
                              download={NEW_CV_DOWNLOAD_NAME}
                              className="px-3 py-1.5 bg-[#1E3A8A] text-white font-semibold rounded-sm"
                            >
                              PDF İndir / Görüntüle
                            </a>
                          </div>
                        </div>
                      </iframe>
                    </object>
                    <div className="px-3 py-1.5 bg-[#FBF9F5] border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-600">
                      <span>Önizleme görünmezse:</span>
                      <div className="flex items-center gap-3">
                        <a
                          href={NEW_CV_PDF_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1E3A8A] font-semibold hover:underline"
                        >
                          Yeni Sekmede Aç ↗
                        </a>
                        <a
                          href={NEW_CV_PDF_URL}
                          download={NEW_CV_DOWNLOAD_NAME}
                          className="text-[#1E3A8A] font-semibold hover:underline"
                        >
                          PDF İndir
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Competencies Card */}
                <div className="bg-white border border-stone-300 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold pb-2 border-b border-stone-200">
                    <Code2 className="w-4 h-4" />
                    <span>{labels.skillsTitle}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="font-mono font-bold text-stone-900 mb-1">
                        Programlama Dilleri
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        Python (Orta-Üstü / İleri), C, C++, Java, HTML5
                      </p>
                    </div>

                    <div>
                      <div className="font-mono font-bold text-stone-900 mb-1">
                        Uzmanlık Alanları
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        Yapay Zeka (AI), Tam Otonom Robotik Sistemler, Algoritmalar, Matematiksel Modelleme
                      </p>
                    </div>

                    <div>
                      <div className="font-mono font-bold text-stone-900 mb-1">
                        Araçlar &amp; Teknolojiler
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        Git / GitHub, Web Geliştirme, Sensör ve Mikrodenetleyici Temelleri
                      </p>
                    </div>
                  </div>
                </div>

                {/* Foreign Language & Interests */}
                <div className="bg-white border border-stone-300 p-5 space-y-4">
                  <div className="space-y-1.5 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
                      <Globe className="w-4 h-4" />
                      <span>{labels.languagesTitle}</span>
                    </div>
                    <div className="text-sm font-bold text-stone-900">
                      İngilizce — B2-C1
                    </div>
                    <div className="text-xs text-stone-700">
                      İleri Orta / İleri Düzey (CAT Dil Sınavı Başarı Sertifikalı)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
                      <Compass className="w-4 h-4" />
                      <span>{labels.interestsTitle}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-800 list-disc pl-4">
                      <li>Yapay Zeka ve Derin Öğrenme</li>
                      <li>Tam Otonom Robot Teknolojileri</li>
                      <li>Astronomi ve Uzay Bilimleri</li>
                      <li>Rekabetçi Matematik</li>
                      <li>Yüzme (Aktif Sporcu)</li>
                    </ul>
                  </div>
                </div>

                {/* Personal Profile Quote Card */}
                <div className="bg-[#F2F4FB] border-l-4 border-[#1E3A8A] p-4 space-y-1.5">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                    {labels.profileTitle}
                  </div>
                  <p className="text-xs font-academic-body text-stone-800 leading-relaxed">
                    Astronomi ve uzay tutkusuyla şekillenen analitik bakış açısını yapay zeka ve tam otonom robotik mühendisliği hedeflerine dönüştüren; zorluklara karşı yüksek direnç ve disiplinle çalışan araştırmacı.
                  </p>
                </div>
              </div>

              {/* Right 7 Cols: Header Identity + Career Objective + Education + Experience & Projects + Achievements */}
              <div className="lg:col-span-7 space-y-5">
                {/* Profile Header & Career Objective */}
                <div className="bg-white border border-stone-300 p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-200">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-editorial font-bold text-stone-900 tracking-tight">
                        EMRE PELİT
                      </h3>
                      <div className="text-sm font-semibold text-[#1E3A8A]">
                        Yapay Zeka ve Otonom Robotik Geliştiricisi | Bilgisayar Programcısı
                      </div>
                    </div>
                    <a
                      href={NEW_CV_PDF_URL}
                      download={NEW_CV_DOWNLOAD_NAME}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{labels.downloadCv}</span>
                    </a>
                  </div>

                  {/* Contact Bar matching PDF Header */}
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FBF9F5] p-3.5 border border-stone-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                      <div>
                        <dt className="sr-only">Konum</dt>
                        <dd className="font-medium text-stone-900">
                          Toroslar, Mersin, Türkiye
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                      <div>
                        <dt className="sr-only">E-posta</dt>
                        <dd className="font-mono text-stone-900">
                          <a href="mailto:emrepelit39@gmail.com" className="hover:underline">
                            emrepelit39@gmail.com
                          </a>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                      <div>
                        <dt className="sr-only">GitHub</dt>
                        <dd className="font-mono text-[#1E3A8A]">
                          <a
                            href="https://github.com/emrepelit109"
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="hover:underline inline-flex items-center gap-1"
                          >
                            <span>github.com/emrepelit109</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                      <div>
                        <dt className="sr-only">Web</dt>
                        <dd className="font-mono text-[#1E3A8A]">
                          <a
                            href="https://emrepelit-sciphi.ai.studio/"
                            className="hover:underline"
                          >
                            emrepelit-sciphi.ai.studio
                          </a>
                        </dd>
                      </div>
                    </div>
                  </dl>

                  {/* Career Objective */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
                      <Sparkles className="w-4 h-4" />
                      <span>{labels.careerObjectiveTitle}</span>
                    </div>
                    <p className="text-sm font-academic-body text-stone-800 leading-relaxed bg-[#F7F4EC] p-4 border border-stone-200">
                      Güçlü matematiksel analitik altyapı ile yazılım mühendisliği disiplinini birleştirerek{' '}
                      <strong>Yapay Zeka</strong> ve <strong>Tam Otonom Robotik Sistemler</strong> alanında Ar-Ge odaklı projeler geliştirmek; çevresel algılama ve otonom karar alma mimarileri üzerine uzmanlaşmak.
                    </p>
                  </div>
                </div>

                {/* Education Bilgileri */}
                <div className="bg-white border border-stone-300 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold pb-2 border-b border-stone-200">
                    <GraduationCap className="w-4 h-4" />
                    <span>{labels.educationTitle}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-base font-editorial font-bold text-stone-900">
                          Anadolu Üniversitesi – Açıköğretim Fakültesi (AÖF)
                        </h4>
                        <span className="text-xs font-mono text-[#1E3A8A] font-semibold">
                          2026 – Devam Ediyor
                        </span>
                      </div>
                      <div className="text-xs font-medium text-stone-700">
                        Bilgisayar Programcılığı (Önlisans)
                      </div>
                    </div>

                    <div className="space-y-0.5 pt-3 border-t border-stone-200">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-base font-editorial font-bold text-stone-900">
                          Mersin Üniversitesi – Mühendislik Fakültesi
                        </h4>
                        <span className="text-xs font-mono text-stone-600 tabular-nums">
                          2020 – 2025
                        </span>
                      </div>
                      <div className="text-xs font-medium text-[#1E3A8A]">
                        Bilgisayar Mühendisliği
                      </div>
                      <p className="text-xs font-academic-body text-stone-700 leading-relaxed">
                        Önlisans mezuniyet gereklilikleri başarıyla tamamlanmıştır.
                      </p>
                    </div>

                    <div className="space-y-0.5 pt-3 border-t border-stone-200">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-base font-editorial font-bold text-stone-900">
                          Çağdaşkent Anadolu Lisesi, Mersin
                        </h4>
                        <span className="text-xs font-mono text-stone-600 tabular-nums">
                          Mezuniyet: 2020
                        </span>
                      </div>
                      <div className="text-xs font-medium text-stone-700">Lise Diploması</div>
                      <p className="text-xs font-academic-body text-stone-700 leading-relaxed">
                        Lise giriş sınavında 460 puan ile Mersin Yıldırımhan Fen Lisesi&apos;ne yerleşilmiş, okulun kapanması sebebiyle lise öğrenimi Çağdaşkent Anadolu Lisesi&apos;nde tamamlanmıştır. Ortaokul döneminde TED Mersin Koleji&apos;nde tam burslu olarak öğrenim görülmüştür.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience & Projects */}
                <div className="bg-white border border-stone-300 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold pb-2 border-b border-stone-200">
                    <Briefcase className="w-4 h-4" />
                    <span>{labels.experienceTitle}</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-stone-900">
                        Yazılım ve Mühendislik Stajyeri (2 Dönem Yaz Stajı)
                      </div>
                      <p className="font-academic-body text-stone-700 leading-relaxed">
                        Yazılım geliştirme süreçleri, algoritma optimizasyonu ve temel sistem mimarileri üzerine uygulamalı staj deneyimi.
                      </p>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-stone-200">
                      <div className="font-bold text-sm text-stone-900">
                        Bilim, Felsefe ve Teknoloji Yayınları (emrepelit-sciphi.ai.studio)
                      </div>
                      <p className="font-academic-body text-stone-700 leading-relaxed">
                        Yapay zeka, kuantum fiziği, astronomi, zihin felsefesi ve otonom sistemler üzerine yayımlanan 300&apos;ü aşkın özgün makale ve teknik inceleme.
                      </p>
                    </div>

                    <div className="space-y-1 pt-3 border-t border-stone-200">
                      <div className="font-bold text-sm text-stone-900">
                        Akran Eğitimi ve Matematik Mentorluğu
                      </div>
                      <p className="font-academic-body text-stone-700 leading-relaxed">
                        Matematik ve fen bilimleri alanlarında analitik problem çözme ve sınav hazırlık süreçlerinde birebir konu anlatımı ve soru çözüm rehberliği.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievements, Scholarships & Awards (Page 2 of Official PDF) */}
                <div className="bg-white border border-stone-300 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold pb-2 border-b border-stone-200">
                    <Award className="w-4 h-4" />
                    <span>{labels.achievementsTitle}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                      <div className="text-[11px] font-mono text-stone-500">MATEMATİK OLİMPİYATI</div>
                      <div className="text-base font-mono font-bold tabular-nums text-stone-900 mt-0.5">
                        2× Birincilik &amp; Ödül
                      </div>
                    </div>
                    <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                      <div className="text-[11px] font-mono text-stone-500">MEB BURSLULUK (PYBS)</div>
                      <div className="text-base font-mono font-bold tabular-nums text-[#1E3A8A] mt-0.5">
                        76. / ~1,5 Milyon
                      </div>
                    </div>
                    <div className="p-3 bg-[#FBF9F5] border border-stone-200">
                      <div className="text-[11px] font-mono text-stone-500">TAM BURS &amp; DİL</div>
                      <div className="text-base font-mono font-bold text-stone-900 mt-0.5">
                        12× 1.&apos;lik · B2-C1 CAT
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-800 list-disc pl-4 leading-relaxed">
                    <li>
                      <strong>Matematik Olimpiyatı 1.&apos;liği ve Para Ödülü:</strong> Mersin Üniversitesi Matematik Olimpiyatı (6. Sınıf).
                    </li>
                    <li>
                      <strong>Matematik Olimpiyatı 1.&apos;liği:</strong> Yıldırımhan Koleji Matematik Olimpiyatı (5. Sınıf).
                    </li>
                    <li>
                      <strong>Türkiye 76.&apos;lığı:</strong> MEB Parasız Yatılılık ve Bursluluk Sınavı (~1,5 milyon aday arasından, 5. Sınıf).
                    </li>
                    <li>
                      <strong>12 Farklı Kurumda 1.&apos;lik Madalyası ve Tam Burs:</strong> 4, 5, 6 ve 7. sınıflarda katılınan tüm dershane ve özel okul bursluluk sınavlarında kesintisiz birincilik (TED Mersin Koleji tam burslu kabulü dahil).
                    </li>
                    <li>
                      <strong>CAT Dil Sınavı Başarısı:</strong> Akademik ve teknik İngilizce yeterlilik derecesi (B2-C1).
                    </li>
                    <li>
                      <strong>Sportif İl Dereceleri:</strong> Mersin turnuvalarında yüzme, basketbol, futbol ve masa tenisi branşlarında bireysel ve takım halinde ilk 3 madalyaları.
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-700">
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="https://www.youtube.com/@science_only"
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="text-red-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>YouTube: @science_only</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span>·</span>
                      <a
                        href="https://www.linkedin.com/in/emrepelit109"
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="text-[#1E3A8A] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>LinkedIn: emrepelit109</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span>·</span>
                      <a
                        href="https://github.com/emrepelit109"
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="text-stone-900 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>GitHub: emrepelit109</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span>·</span>
                      <a
                        href="https://www.researchgate.net/profile/Emre-Pelit"
                        target="_blank"
                        rel="me noopener noreferrer"
                        className="text-teal-800 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>ResearchGate: Emre Pelit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <a
                      href={NEW_CV_PDF_URL}
                      download={NEW_CV_DOWNLOAD_NAME}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E3A8A] hover:underline font-semibold"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{labels.downloadCv}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
