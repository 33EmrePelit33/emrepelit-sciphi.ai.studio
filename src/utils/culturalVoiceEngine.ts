import { LanguageCode } from '../types';

export type IntonationPresetId =
  | 'documentary'
  | 'deep_calm'
  | 'academic_crisp'
  | 'expressive'
  | 'gentle_slow'
  | 'custom';

export interface UserIntonationConfig {
  presetId: IntonationPresetId;
  /** Fine pitch multiplier controlled by user (0.70 – 1.35) */
  pitch: number;
  /** Fine speech tempo multiplier controlled by user (0.70 – 1.75) */
  rate: number;
  /** Sentence & section pause rhythm multiplier controlled by user (0.50 – 1.80) */
  pauseScale: number;
  /** Audio volume (0.20 – 1.00) */
  volume: number;
}

export interface IntonationPresetSpec {
  id: Exclude<IntonationPresetId, 'custom'>;
  pitch: number;
  rate: number;
  pauseScale: number;
  volume: number;
  /** Style directive forwarded to server TTS speechMetadata.style */
  ttsStyleHint: string;
  labels: Record<LanguageCode, string>;
}

export interface IntonationUiLabels {
  panelTitle: string;
  syntheticBadge: string;
  presetLabel: string;
  pitchLabel: string;
  rateLabel: string;
  pauseLabel: string;
  volumeLabel: string;
  resetBtn: string;
  customTag: string;
  zeroLiabilityVoiceDisclaimer: string;
}

export const DEFAULT_USER_INTONATION: UserIntonationConfig = {
  presetId: 'documentary',
  pitch: 1.0,
  rate: 1.0,
  pauseScale: 1.0,
  volume: 1.0,
};

export const INTONATION_PRESETS: IntonationPresetSpec[] = [
  {
    id: 'documentary',
    pitch: 1.0,
    rate: 1.0,
    pauseScale: 1.0,
    volume: 1.0,
    ttsStyleHint: 'Balanced, clear, warm synthetic science documentary narration',
    labels: {
      tr: 'Doğal Belgesel',
      en: 'Natural Documentary',
      es: 'Documental Natural',
      de: 'Natürliche Doku',
      fr: 'Documentaire Naturel',
      ru: 'Естественный Док.',
      ar: 'وثائقي طبيعي',
      zh: '自然纪录片',
      ja: '自然ドキュメンタリー',
      pt: 'Documentário Natural',
      it: 'Documentario Naturale',
      ko: '자연 다큐멘터리',
      no: 'Naturlig dokumentar',
      is: 'Náttúruleg heimildarmynd',
      da: 'Naturlig dokumentar',
      sv: 'Naturlig dokumentär',
      nl: 'Natuurlijke documentaire',
      fi: 'Luonnollinen dokumentti',
      ga: 'Faisnéis Nádúrtha',
      lb: 'Natierlechen Documentaire',
      rm: 'Documentar natiral',
      ms: 'Dokumentari Semula Jadi',
      ta: 'இயற்கை ஆவணப்படம்',
    },
  },
  {
    id: 'deep_calm',
    pitch: 0.86,
    rate: 0.92,
    pauseScale: 1.25,
    volume: 1.0,
    ttsStyleHint: 'Calm, deep, composed synthetic voice with steady thoughtful cadence',
    labels: {
      tr: 'Sakin & Tok',
      en: 'Calm & Deep',
      es: 'Sereno y Profundo',
      de: 'Ruhig & Tief',
      fr: 'Calme & Grave',
      ru: 'Спокойный и Глубокий',
      ar: 'هادئ وعميق',
      zh: '沉稳低沉',
      ja: '落ち着いた低音',
      pt: 'Calmo e Grave',
      it: 'Calmo e Profondo',
      ko: '차분하고 깊은 톤',
      no: 'Rolig og dyp',
      is: 'Róleg og djúp',
      da: 'Rolig og dyb',
      sv: 'Lugn och djup',
      nl: 'Kalm en diep',
      fi: 'Rauhallinen ja syvä',
      ga: 'Ciúin agus Domhain',
      lb: 'Roueg an déif',
      rm: 'Ruassaivel e profund',
      ms: 'Tenang dan Mendalam',
      ta: 'அமைதியான ஆழமான குரல்',
    },
  },
  {
    id: 'academic_crisp',
    pitch: 1.03,
    rate: 1.04,
    pauseScale: 0.95,
    volume: 1.0,
    ttsStyleHint: 'Articulate, precise, academic lecture synthetic voice with clear enunciation',
    labels: {
      tr: 'Akademik & Net',
      en: 'Academic & Crisp',
      es: 'Académico y Claro',
      de: 'Akademisch & Klar',
      fr: 'Académique & Net',
      ru: 'Академический Чёткий',
      ar: 'أكاديمي واضح',
      zh: '学术清晰',
      ja: '学術・明瞭',
      pt: 'Acadêmico e Nítido',
      it: 'Accademico e Nitido',
      ko: '학술적이고 명료함',
      no: 'Akademisk og klar',
      is: 'Fræðileg og skýr',
      da: 'Akademisk og skarp',
      sv: 'Akademisk och tydlig',
      nl: 'Academisch en helder',
      fi: 'Akateeminen ja selkeä',
      ga: 'Acadúil agus Soiléir',
      lb: 'Akademesch a kloer',
      rm: 'Academic e cler',
      ms: 'Akademik dan Jelas',
      ta: 'கல்வி மற்றும் தெளிவான',
    },
  },
  {
    id: 'expressive',
    pitch: 1.12,
    rate: 1.08,
    pauseScale: 0.85,
    volume: 1.0,
    ttsStyleHint: 'Engaging, lively, expressive synthetic voice emphasizing key conceptual contrasts',
    labels: {
      tr: 'Canlı & Vurgulu',
      en: 'Lively & Expressive',
      es: 'Dinámico y Expresivo',
      de: 'Lebendig & Betont',
      fr: 'Vif & Expressif',
      ru: 'Живой и Выразительный',
      ar: 'حيوي ومعبّر',
      zh: '生动富有表现力',
      ja: '生き生きと抑揚豊か',
      pt: 'Vibrante e Expressivo',
      it: 'Vivace ed Espressivo',
      ko: '생동감 있는 억양',
      no: 'Levende og uttrykksfull',
      is: 'Lífleg og tjáningarrík',
      da: 'Levende og udtryksfuld',
      sv: 'Livlig och uttrycksfull',
      nl: 'Levendig en expressief',
      fi: 'Elävä ja ilmeikäs',
      ga: 'Beoga agus Léiritheach',
      lb: 'Lieweg an ausdrocksvoll',
      rm: 'Viv ed expressiv',
      ms: 'Ceria dan Ekspresif',
      ta: 'உயிரோட்டமான உச்சரிப்பு',
    },
  },
  {
    id: 'gentle_slow',
    pitch: 0.94,
    rate: 0.84,
    pauseScale: 1.45,
    volume: 0.95,
    ttsStyleHint: 'Gentle, slow, reflective synthetic narration with generous pauses for contemplation',
    labels: {
      tr: 'Yumuşak & Yavaş',
      en: 'Gentle & Reflective',
      es: 'Suave y Pausado',
      de: 'Sanft & Langsam',
      fr: 'Doux & Posé',
      ru: 'Мягкий и Размеренный',
      ar: 'لطيف ومتأنٍ',
      zh: '柔和舒缓',
      ja: '穏やかでゆっくり',
      pt: 'Suave e Pausado',
      it: 'Morbido e Lento',
      ko: '부드럽고 천천히',
      no: 'Myk og rolig',
      is: 'Mjúk og hæg',
      da: 'Blid og langsom',
      sv: 'Mjuk och långsam',
      nl: 'Zacht en rustig',
      fi: 'Lempeä ja rauhallinen',
      ga: 'Mín agus Mall',
      lb: 'Sanft a lues',
      rm: 'Dultsch e plaun',
      ms: 'Lembut dan Perlahan',
      ta: 'மென்மையான மற்றும் மெதுவான',
    },
  },
];

const INTONATION_UI_LABELS: Partial<Record<LanguageCode, IntonationUiLabels>> = {
  tr: {
    panelTitle: 'Konuşma Tonlaması (Kullanıcı İnisiyatifi)',
    syntheticBadge: 'Sentetik Kültürel Ses · Gerçek Kişi Değildir',
    presetLabel: 'Tonlama Biçimi',
    pitchLabel: 'Ses Perdesi (Ton)',
    rateLabel: 'Tempo (Hız)',
    pauseLabel: 'Duraklama Ritmi',
    volumeLabel: 'Ses Düzeyi',
    resetBtn: 'Varsayılan',
    customTag: 'Özel Tonlama',
    zeroLiabilityVoiceDisclaimer:
      'Tüm ses profilleri tamamen sentetik/yapay kültürel akustik modellerdir; hiçbir gerçek kişinin sesini veya kimliğini kullanmaz ve hiçbir yasal mükellefiyet doğurmaz.',
  },
  en: {
    panelTitle: 'Speech Intonation (User Controlled)',
    syntheticBadge: 'Synthetic Cultural Voice · Not a Real Person',
    presetLabel: 'Intonation Style',
    pitchLabel: 'Pitch / Tone',
    rateLabel: 'Tempo / Rate',
    pauseLabel: 'Pause Cadence',
    volumeLabel: 'Volume',
    resetBtn: 'Reset',
    customTag: 'Custom Tone',
    zeroLiabilityVoiceDisclaimer:
      'All narrators are purely synthetic cultural acoustic profiles; no real individual’s voice or likeness is used, carrying zero legal liability.',
  },
  es: {
    panelTitle: 'Entonación del Habla (Control del Usuario)',
    syntheticBadge: 'Voz Cultural Sintética · No es una Persona Real',
    presetLabel: 'Estilo de Entonación',
    pitchLabel: 'Tono (Altura)',
    rateLabel: 'Ritmo (Velocidad)',
    pauseLabel: 'Cadencia de Pausas',
    volumeLabel: 'Volumen',
    resetBtn: 'Restablecer',
    customTag: 'Personalizado',
    zeroLiabilityVoiceDisclaimer:
      'Todos los narradores son perfiles acústicos culturales puramente sintéticos; no imitan a ninguna persona real ni generan responsabilidad legal.',
  },
  de: {
    panelTitle: 'Sprachintonation (Nutzersteuerung)',
    syntheticBadge: 'Synthetische Kulturstimme · Keine echte Person',
    presetLabel: 'Intonationsstil',
    pitchLabel: 'Tonhöhe',
    rateLabel: 'Sprechtempo',
    pauseLabel: 'Pausenrhythmus',
    volumeLabel: 'Lautstärke',
    resetBtn: 'Standard',
    customTag: 'Benutzerdefiniert',
    zeroLiabilityVoiceDisclaimer:
      'Alle Stimmen sind rein synthetische kulturelle Akustikprofile ohne Bezug zu realen Personen und begründen keinerlei rechtliche Verpflichtung.',
  },
  fr: {
    panelTitle: 'Intonation Vocale (Libre Choix Utilisateur)',
    syntheticBadge: 'Voix Culturelle Synthétique · Aucune Personne Réelle',
    presetLabel: 'Style d’Intonation',
    pitchLabel: 'Hauteur (Ton)',
    rateLabel: 'Cadence (Vitesse)',
    pauseLabel: 'Rythme des Pauses',
    volumeLabel: 'Volume',
    resetBtn: 'Réinitialiser',
    customTag: 'Personnalisé',
    zeroLiabilityVoiceDisclaimer:
      'Toutes les voix sont des profils acoustiques culturels purement synthétiques sans lien avec aucune personne réelle ni obligation légale.',
  },
  ru: {
    panelTitle: 'Интонация речи (Выбор пользователя)',
    syntheticBadge: 'Синтетический культурный голос · Не реальный человек',
    presetLabel: 'Стиль интонации',
    pitchLabel: 'Высота тона',
    rateLabel: 'Темп речи',
    pauseLabel: 'Ритм пауз',
    volumeLabel: 'Громкость',
    resetBtn: 'Сброс',
    customTag: 'Свой тон',
    zeroLiabilityVoiceDisclaimer:
      'Все голоса являются полностью синтетическими культурными профилями, не имитируют реальных людей и не несут юридических обязательств.',
  },
  ar: {
    panelTitle: 'تنغيم الكلام (بحسب اختيار المستخدم)',
    syntheticBadge: 'صوت ثقافي اصطناعي · ليس شخصاً حقيقياً',
    presetLabel: 'أسلوب التنغيم',
    pitchLabel: 'طبقة الصوت',
    rateLabel: 'سرعة الإلقاء',
    pauseLabel: 'إيقاع التوقفات',
    volumeLabel: 'مستوى الصوت',
    resetBtn: 'افتراضي',
    customTag: 'تنغيم مخصص',
    zeroLiabilityVoiceDisclaimer:
      'جميع الأصوات نماذج صوتية ثقافية اصطناعية بالكامل لا تمثل أي شخص حقيقي ولا ترتب أي التزام قانوني.',
  },
  zh: {
    panelTitle: '语音语调控制（用户自主调节）',
    syntheticBadge: '纯合成文化声线 · 非真实人物',
    presetLabel: '语调风格',
    pitchLabel: '音调高低',
    rateLabel: '语速节奏',
    pauseLabel: '停顿韵律',
    volumeLabel: '音量',
    resetBtn: '恢复默认',
    customTag: '自定义语调',
    zeroLiabilityVoiceDisclaimer:
      '所有旁白均为纯合成文化声学配置，不模仿任何真实人物声音或身份，不产生任何法律责任。',
  },
  ja: {
    panelTitle: '話し方のイントネーション（ユーザー任意設定）',
    syntheticBadge: '純合成カルチャー音声 · 実在人物ではありません',
    presetLabel: '抑揚スタイル',
    pitchLabel: '声の高さ',
    rateLabel: '話速テンポ',
    pauseLabel: '間のリズム',
    volumeLabel: '音量',
    resetBtn: '初期値',
    customTag: 'カスタム抑揚',
    zeroLiabilityVoiceDisclaimer:
      'すべての音声は実在の人物を模倣しない純粋な合成カルチャー音声プロファイルであり、法的義務や権利侵害は一切生じません。',
  },
  pt: {
    panelTitle: 'Entonação da Fala (Controle do Usuário)',
    syntheticBadge: 'Voz Cultural Sintética · Não é Pessoa Real',
    presetLabel: 'Estilo de Entonação',
    pitchLabel: 'Tom (Altura)',
    rateLabel: 'Ritmo (Velocidade)',
    pauseLabel: 'Cadência de Pausas',
    volumeLabel: 'Volume',
    resetBtn: 'Padrão',
    customTag: 'Personalizado',
    zeroLiabilityVoiceDisclaimer:
      'Todas as vozes são perfis acústicos culturais puramente sintéticos, sem semelhança com pessoas reais e sem qualquer obrigação legal.',
  },
  it: {
    panelTitle: 'Intonazione Vocale (A Scelta dell’Utente)',
    syntheticBadge: 'Voce Culturale Sintetica · Non è una Persona Reale',
    presetLabel: 'Stile di Intonazione',
    pitchLabel: 'Tono (Altezza)',
    rateLabel: 'Ritmo (Velocità)',
    pauseLabel: 'Cadenza Pause',
    volumeLabel: 'Volume',
    resetBtn: 'Predefinito',
    customTag: 'Personalizzato',
    zeroLiabilityVoiceDisclaimer:
      'Tutte le voci sono profili acustici culturali puramente sintetici, senza alcun riferimento a persone reali né obblighi legali.',
  },
  ko: {
    panelTitle: '말하기 억양 설정 (사용자 자율 제어)',
    syntheticBadge: '순수 합성 문화 음성 · 실존 인물 아님',
    presetLabel: '억양 프리셋',
    pitchLabel: '음높이 (톤)',
    rateLabel: '말하기 속도',
    pauseLabel: '쉼표 리듬',
    volumeLabel: '음량',
    resetBtn: '기본값',
    customTag: '사용자 지정',
    zeroLiabilityVoiceDisclaimer:
      '모든 음성은 실존 인물을 모방하지 않는 순수 합성 문화 음향 프로필이며 어떠한 법적 의무도 발생시키지 않습니다.',
  },
};

const INTONATION_STORAGE_KEY = 'sciphil_voice_intonation_v1';

export function getLocalizedIntonationLabels(lang: LanguageCode): IntonationUiLabels {
  return INTONATION_UI_LABELS[lang] || INTONATION_UI_LABELS.en!;
}

export function loadUserIntonationConfig(): UserIntonationConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_USER_INTONATION };
  try {
    const raw = window.localStorage.getItem(INTONATION_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USER_INTONATION };
    const parsed = JSON.parse(raw);
    return {
      presetId: parsed.presetId || 'documentary',
      pitch: Math.max(0.7, Math.min(1.35, Number(parsed.pitch) || 1.0)),
      rate: Math.max(0.7, Math.min(1.75, Number(parsed.rate) || 1.0)),
      pauseScale: Math.max(0.5, Math.min(1.8, Number(parsed.pauseScale) || 1.0)),
      volume: Math.max(0.2, Math.min(1.0, Number(parsed.volume) || 1.0)),
    };
  } catch {
    return { ...DEFAULT_USER_INTONATION };
  }
}

export function saveUserIntonationConfig(config: UserIntonationConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(INTONATION_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

export function buildTtsIntonationDirective(
  config: UserIntonationConfig,
  lang: LanguageCode,
  persona: CulturalNarratorPersona
): string {
  const preset = INTONATION_PRESETS.find((p) => p.id === config.presetId);
  const baseStyle = preset
    ? preset.ttsStyleHint
    : `Custom user intonation (pitch ${config.pitch.toFixed(2)}, pace ${config.rate.toFixed(2)}x, pause rhythm ${config.pauseScale.toFixed(2)}x)`;
  const pitchCue =
    config.pitch < 0.92
      ? 'lower warm pitch'
      : config.pitch > 1.08
        ? 'brighter elevated pitch'
        : 'neutral natural pitch';
  const rateCue =
    config.rate < 0.92
      ? 'deliberate unhurried pace'
      : config.rate > 1.12
        ? 'brisk energetic pace'
        : 'steady documentary pace';
  return `Purely synthetic non-real-person cultural studio voice (${persona.culturalRegion}, language ${lang}): ${baseStyle}; ${pitchCue}, ${rateCue}.`;
}

export interface CulturalNarratorPersona {
  id: string;
  /** Purely synthetic cultural acoustic studio profile name — NEVER a real person's name */
  name: string;
  gender: 'male' | 'female';
  isSyntheticArchetype: true;
  roleTitleNative: string;
  roleTitleTr: string;
  culturalRegion: string;
  cadenceNote: string;
  preferredVoiceHints: string[];
  geminiVoiceFallback: 'Kore' | 'Charon' | 'Fenrir' | 'Puck' | 'Zephyr';
  rateMultiplier: number;
  pitch: number;
}

export interface CulturalLanguageVoiceProfile {
  code: LanguageCode;
  bcp47: string;
  altBcp47s: string[];
  nativeName: string;
  dir: 'ltr' | 'rtl';
  /** Average natural spoken characters per second for this writing system at 1.0x speed */
  charsPerSecond: number;
  sentencePauseMs: number;
  sectionPauseMs: number;
  personas: [CulturalNarratorPersona, CulturalNarratorPersona];
  /** Localized short canvas labels so the 16:9 stage renders natively in all 12 languages */
  stageLabels: {
    chapterPrefix: string;
    authorBanner: string;
    subtitleTag: string;
    summaryBadge: string;
    narratorPrefix: string;
    liveReading: string;
    speakerSynced: string;
    viewsLabel: string;
    clickTip: string;
    observerLabel: string;
    photonLabel: string;
    restClockLabel: string;
    travelerClockLabel: string;
    linearChainLabel: string;
    pipelineStages: [string, string, string, string];
  };
}

export const CULTURAL_VOICE_PROFILES: Record<LanguageCode, CulturalLanguageVoiceProfile> = {
  tr: {
    code: 'tr',
    bcp47: 'tr-TR',
    altBcp47s: ['tr'],
    nativeName: 'Türkçe',
    dir: 'ltr',
    charsPerSecond: 13.8,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'tr-synth-baritone',
        name: 'Anadolu Stüdyo · Bariton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Sentetik İstanbul Türkçesi Akustik Ses Profili',
        roleTitleTr: 'Sentetik İstanbul Türkçesi Akustik Ses Profili',
        culturalRegion: 'Türkçe Kültür Akustiği · Sentetik Profil A',
        cadenceNote: 'Durgun, tok ve berrak bilimsel anlatım tonu (gerçek kişi değildir)',
        preferredVoiceHints: ['ahmet', 'tolga', 'cem', 'google türkçe', 'turkish', 'tr-tr'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'tr-synth-clear',
        name: 'Boğaziçi Stüdyo · Berrak',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Sentetik Bilim & Felsefe Akustik Ses Profili',
        roleTitleTr: 'Sentetik Bilim & Felsefe Akustik Ses Profili',
        culturalRegion: 'Türkçe Kültür Akustiği · Sentetik Profil B',
        cadenceNote: 'Akıcı, anlaşılır ve sıcak kavramsal tonlama (gerçek kişi değildir)',
        preferredVoiceHints: ['emel', 'yelda', 'filiz', 'seda', 'google türkçe', 'turkish'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'BÖLÜM',
      authorBanner: 'EMRE PELİT · GENİŞ ÖZET SENTETİK SESLİ VİDEO',
      subtitleTag: '12 Dil Sentetik Kültürel Ses · Kullanıcı Tonlaması',
      summaryBadge: 'GENİŞ ÖZET',
      narratorPrefix: 'Sentetik Ses',
      liveReading: 'CANLI OKUMA',
      speakerSynced: 'Konuşmacı Süresine Senkron',
      viewsLabel: 'İzlenme',
      clickTip: 'İpucu: Sahnedeki hareketli varlıklara tıklayarak etkileşin',
      observerLabel: 'Gözlemci',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Sabit τ₀',
      travelerClockLabel: 'Gezgin τ (Yavaş)',
      linearChainLabel: 'Φ ≈ 0 (Doğrusal)',
      pipelineStages: ['GİRDİ', 'ANALİZ', 'DOĞRULAMA', 'SENTEZ'],
    },
  },
  en: {
    code: 'en',
    bcp47: 'en-US',
    altBcp47s: ['en-GB', 'en-AU', 'en-CA', 'en'],
    nativeName: 'English',
    dir: 'ltr',
    charsPerSecond: 14.8,
    sentencePauseMs: 340,
    sectionPauseMs: 740,
    personas: [
      {
        id: 'en-synth-baritone',
        name: 'Atlantic Studio · Deep',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetic Anglosphere Documentary Acoustic Profile',
        roleTitleTr: 'Sentetik İngilizce Derin Belgesel Akustik Profili',
        culturalRegion: 'Anglosphere Cultural Acoustics · Synthetic Profile A',
        cadenceNote: 'Measured, resonant documentary cadence (purely synthetic, non-human)',
        preferredVoiceHints: ['guy', 'daniel', 'arthur', 'brian', 'google us english', 'google uk english male'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.96,
        pitch: 0.95,
      },
      {
        id: 'en-synth-clear',
        name: 'Oxford Studio · Clear',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetic Academic Narration Acoustic Profile',
        roleTitleTr: 'Sentetik İngilizce Berrak Akademik Akustik Profili',
        culturalRegion: 'Anglosphere Cultural Acoustics · Synthetic Profile B',
        cadenceNote: 'Crisp, articulate educational tone (purely synthetic, non-human)',
        preferredVoiceHints: ['aria', 'jenny', 'samantha', 'serena', 'google uk english female', 'google us english'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.99,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CH',
      authorBanner: 'EMRE PELIT · SYNTHETIC COMPREHENSIVE SUMMARY VIDEO',
      subtitleTag: '12-Lang Synthetic Cultural Voice · User Intonation',
      summaryBadge: 'FULL SUMMARY',
      narratorPrefix: 'Synth Voice',
      liveReading: 'LIVE NARRATION',
      speakerSynced: 'Speaker-Synced Duration',
      viewsLabel: 'Views',
      clickTip: 'Tip: Click animated entities on stage to interact',
      observerLabel: 'Observer',
      photonLabel: 'Photon (m=0)',
      restClockLabel: 'Rest τ₀',
      travelerClockLabel: 'Traveler τ',
      linearChainLabel: 'Φ ≈ 0 (Linear)',
      pipelineStages: ['INPUT', 'ANALYZE', 'VERIFY', 'SYNTHESIS'],
    },
  },
  es: {
    code: 'es',
    bcp47: 'es-ES',
    altBcp47s: ['es-MX', 'es-AR', 'es-US', 'es'],
    nativeName: 'Español',
    dir: 'ltr',
    charsPerSecond: 14.6,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'es-synth-baritone',
        name: 'Estudio Ibérico · Grave',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Perfil Acústico Sintético Hispano de Divulgación',
        roleTitleTr: 'Sentetik İspanyolca Derin Akustik Profili',
        culturalRegion: 'Acústica Cultural Hispana · Perfil Sintético A',
        cadenceNote: 'Dicción cálida y pausada de documental (voz puramente sintética)',
        preferredVoiceHints: ['alvaro', 'jorge', 'diego', 'pablo', 'google español', 'spanish'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'es-synth-clear',
        name: 'Estudio Andino · Clara',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Perfil Acústico Sintético Académico en Español',
        roleTitleTr: 'Sentetik İspanyolca Berrak Akustik Profili',
        culturalRegion: 'Acústica Cultural Hispana · Perfil Sintético B',
        cadenceNote: 'Claridad expresiva y ritmo natural (voz puramente sintética)',
        preferredVoiceHints: ['elvira', 'dalia', 'monica', 'paulina', 'helena', 'google español'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CAP',
      authorBanner: 'EMRE PELIT · RESUMEN AMPLIADO CON VOZ SINTÉTICA',
      subtitleTag: '12 Idiomas · Voz Cultural Sintética · Entonación Libre',
      summaryBadge: 'RESUMEN AMPLIO',
      narratorPrefix: 'Voz Sintética',
      liveReading: 'LECTURA EN VIVO',
      speakerSynced: 'Duración del Narrador',
      viewsLabel: 'Vistas',
      clickTip: 'Consejo: Haz clic en las entidades animadas para interactuar',
      observerLabel: 'Observador',
      photonLabel: 'Fotón (m=0)',
      restClockLabel: 'Reposo τ₀',
      travelerClockLabel: 'Viajero τ',
      linearChainLabel: 'Φ ≈ 0 (Lineal)',
      pipelineStages: ['ENTRADA', 'ANÁLISIS', 'VERIFICAR', 'SÍNTESIS'],
    },
  },
  de: {
    code: 'de',
    bcp47: 'de-DE',
    altBcp47s: ['de-AT', 'de-CH', 'de'],
    nativeName: 'Deutsch',
    dir: 'ltr',
    charsPerSecond: 13.6,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'de-synth-baritone',
        name: 'Rhein Akustik · Tief',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetisches Deutschsprachiges Doku-Stimmprofil',
        roleTitleTr: 'Sentetik Almanca Derin Belgesel Akustik Profili',
        culturalRegion: 'DACH-Kulturakustik · Synthetisches Profil A',
        cadenceNote: 'Präzise, ruhige Wissenschaftsdiktion (rein synthetisch)',
        preferredVoiceHints: ['conrad', 'killian', 'stefan', 'markus', 'google deutsch', 'german'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.95,
        pitch: 0.95,
      },
      {
        id: 'de-synth-clear',
        name: 'Alpen Akustik · Klar',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetisches Akademisches Stimmprofil (Deutsch)',
        roleTitleTr: 'Sentetik Almanca Berrak Akademik Profil',
        culturalRegion: 'DACH-Kulturakustik · Synthetisches Profil B',
        cadenceNote: 'Klare, strukturierte Betonung (rein synthetisch)',
        preferredVoiceHints: ['katja', 'amala', 'anna', 'hedda', 'petra', 'google deutsch'],
        geminiVoiceFallback: 'Zephyr',
        rateMultiplier: 0.97,
        pitch: 1.01,
      },
    ],
    stageLabels: {
      chapterPrefix: 'KAP',
      authorBanner: 'EMRE PELIT · SYNTHETISCHE ZUSAMMENFASSUNG',
      subtitleTag: '12 Sprachen · Synthetische Kulturstimme · Freier Ton',
      summaryBadge: 'GESAMTZUSAMMENFASSUNG',
      narratorPrefix: 'Synth-Stimme',
      liveReading: 'LIVE-VORTRAG',
      speakerSynced: 'Synchron zur Sprechzeit',
      viewsLabel: 'Aufrufe',
      clickTip: 'Tipp: Klicken Sie auf die bewegten Objekte zur Interaktion',
      observerLabel: 'Beobachter',
      photonLabel: 'Photon (m=0)',
      restClockLabel: 'Ruhe τ₀',
      travelerClockLabel: 'Reisender τ',
      linearChainLabel: 'Φ ≈ 0 (Linear)',
      pipelineStages: ['EINGABE', 'ANALYSE', 'PRÜFUNG', 'SYNTHESE'],
    },
  },
  fr: {
    code: 'fr',
    bcp47: 'fr-FR',
    altBcp47s: ['fr-CA', 'fr-CH', 'fr-BE', 'fr'],
    nativeName: 'Français',
    dir: 'ltr',
    charsPerSecond: 14.2,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'fr-synth-baritone',
        name: 'Studio Lumière · Grave',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profil Acoustique Synthétique Francophone',
        roleTitleTr: 'Sentetik Fransızca Derin Akustik Profili',
        culturalRegion: 'Acoustique Francophone · Profil Synthétique A',
        cadenceNote: 'Phrazé posé et analytique (voix purement synthétique)',
        preferredVoiceHints: ['henri', 'remy', 'thomas', 'paul', 'google français', 'french'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'fr-synth-clear',
        name: 'Studio Seine · Claire',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profil Acoustique Synthétique Académique',
        roleTitleTr: 'Sentetik Fransızca Berrak Akustik Profili',
        culturalRegion: 'Acoustique Francophone · Profil Synthétique B',
        cadenceNote: 'Élocution limpide et pédagogique (voix purement synthétique)',
        preferredVoiceHints: ['denise', 'vivienne', 'amelie', 'audrey', 'hortense', 'google français'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CH',
      authorBanner: 'EMRE PELIT · RÉSUMÉ APPROFONDI VOIX SYNTHÉTIQUE',
      subtitleTag: '12 Langues · Voix Culturelle Synthétique · Ton Libre',
      summaryBadge: 'RÉSUMÉ COMPLET',
      narratorPrefix: 'Voix Synth.',
      liveReading: 'LECTURE EN DIRECT',
      speakerSynced: 'Synchronisé à la Voix',
      viewsLabel: 'Vues',
      clickTip: 'Astuce : Cliquez sur les entités animées pour interagir',
      observerLabel: 'Observateur',
      photonLabel: 'Photon (m=0)',
      restClockLabel: 'Repos τ₀',
      travelerClockLabel: 'Voyageur τ',
      linearChainLabel: 'Φ ≈ 0 (Linéaire)',
      pipelineStages: ['ENTRÉE', 'ANALYSE', 'VÉRIFIER', 'SYNTHÈSE'],
    },
  },
  ru: {
    code: 'ru',
    bcp47: 'ru-RU',
    altBcp47s: ['ru'],
    nativeName: 'Русский',
    dir: 'ltr',
    charsPerSecond: 13.2,
    sentencePauseMs: 380,
    sectionPauseMs: 800,
    personas: [
      {
        id: 'ru-synth-baritone',
        name: 'Нева Акустика · Баритон',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Синтетический академический звуковой профиль',
        roleTitleTr: 'Sentetik Rusça Derin Akustik Profili',
        culturalRegion: 'Русскоязычная акустика · Синтетический профиль A',
        cadenceNote: 'Глубокая и размеренная подача (полностью синтетический голос)',
        preferredVoiceHints: ['dmitry', 'yuri', 'pavel', 'maxim', 'google русский', 'russian'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.95,
        pitch: 0.95,
      },
      {
        id: 'ru-synth-clear',
        name: 'Волга Акустика · Чистый',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Синтетический просветительский звуковой профиль',
        roleTitleTr: 'Sentetik Rusça Berrak Akustik Profili',
        culturalRegion: 'Русскоязычная акустика · Синтетический профиль B',
        cadenceNote: 'Ясная и интеллигентная дикция (полностью синтетический голос)',
        preferredVoiceHints: ['svetlana', 'dariya', 'milena', 'irina', 'katya', 'google русский'],
        geminiVoiceFallback: 'Zephyr',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'ГЛ',
      authorBanner: 'EMRE PELIT · ПОДРОБНОЕ РЕЗЮМЕ (СИНТЕЗ РЕЧИ)',
      subtitleTag: '12 Языков · Синтетический голос · Выбор интонации',
      summaryBadge: 'ПОЛНОЕ РЕЗЮМЕ',
      narratorPrefix: 'Синтез-голос',
      liveReading: 'ОЗВУЧКА В ЭФИРЕ',
      speakerSynced: 'По длительности речи',
      viewsLabel: 'Просмотры',
      clickTip: 'Подсказка: Нажмите на движущиеся объекты на сцене',
      observerLabel: 'Наблюдатель',
      photonLabel: 'Фотон (m=0)',
      restClockLabel: 'Покой τ₀',
      travelerClockLabel: 'Полёт τ',
      linearChainLabel: 'Φ ≈ 0 (Линейная)',
      pipelineStages: ['ВХОД', 'АНАЛИЗ', 'ПРОВЕРКА', 'СИНТЕЗ'],
    },
  },
  ar: {
    code: 'ar',
    bcp47: 'ar-SA',
    altBcp47s: ['ar-EG', 'ar-AE', 'ar-MA', 'ar'],
    nativeName: 'العربية',
    dir: 'rtl',
    charsPerSecond: 12.2,
    sentencePauseMs: 400,
    sectionPauseMs: 840,
    personas: [
      {
        id: 'ar-synth-baritone',
        name: 'استوديو الفصحى · نبرة عميقة',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'ملف صوتي ثقافي اصطناعي بالفصحى الأكاديمية',
        roleTitleTr: 'Sentetik Arapça (Fusha) Derin Akustik Profili',
        culturalRegion: 'الأكاديمية العربية الفصحى · ملف اصطناعي أ',
        cadenceNote: 'إلقاء وثائقي رصين وواضح (صوت اصطناعي بالكامل)',
        preferredVoiceHints: ['hamed', 'shakir', 'maged', 'tarik', 'naayf', 'arabic'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.94,
        pitch: 0.95,
      },
      {
        id: 'ar-synth-clear',
        name: 'استوديو المشرق · نبرة صافية',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'ملف صوتي ثقافي اصطناعي للعلوم والفلسفة',
        roleTitleTr: 'Sentetik Arapça Berrak Akustik Profili',
        culturalRegion: 'الأكاديمية العربية الفصحى · ملف اصطناعي ب',
        cadenceNote: 'أداء علمي صافٍ ومتوازن (صوت اصطناعي بالكامل)',
        preferredVoiceHints: ['zariyah', 'salma', 'laila', 'mariam', 'hoda', 'arabic'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.96,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'فصل',
      authorBanner: 'EMRE PELIT · فيديو الملخص الشامل بصوت اصطناعي',
      subtitleTag: '12 لغة · صوت ثقافي اصطناعي · تنغيم بحرية المستخدم',
      summaryBadge: 'الملخص الشامل',
      narratorPrefix: 'صوت اصطناعي',
      liveReading: 'سرد صوتي مباشر',
      speakerSynced: 'مدة متزامنة مع السرد',
      viewsLabel: 'المشاهدات',
      clickTip: 'تلميح: انقر على الكائنات المتحركة في المشهد للتفاعل',
      observerLabel: 'المراقب',
      photonLabel: 'فوتون (m=0)',
      restClockLabel: 'سكون τ₀',
      travelerClockLabel: 'مسافر τ',
      linearChainLabel: 'Φ ≈ 0 (خطي)',
      pipelineStages: ['إدخال', 'تحليل', 'تحقق', 'تركيب'],
    },
  },
  zh: {
    code: 'zh',
    bcp47: 'zh-CN',
    altBcp47s: ['zh-TW', 'zh-HK', 'zh'],
    nativeName: '中文',
    dir: 'ltr',
    charsPerSecond: 4.8,
    sentencePauseMs: 380,
    sectionPauseMs: 820,
    personas: [
      {
        id: 'zh-synth-baritone',
        name: '标准普通话声场 · 沉稳',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: '纯合成普通话科学纪录片声学配置',
        roleTitleTr: 'Sentetik Çince (Mandarin) Derin Akustik Profili',
        culturalRegion: '中文学术声场 · 合成配置 A',
        cadenceNote: '沉稳厚重、字正腔圆的科普语调（纯合成声线，非真人）',
        preferredVoiceHints: ['yunxi', 'yunjian', 'yunyang', 'kangkang', 'google 普通话', 'chinese'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'zh-synth-clear',
        name: '科普人文声场 · 清朗',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: '纯合成科学哲学讲解声学配置',
        roleTitleTr: 'Sentetik Çince Berrak Akustik Profili',
        culturalRegion: '中文学术声场 · 合成配置 B',
        cadenceNote: '清晰温和、逻辑分明的讲解节奏（纯合成声线，非真人）',
        preferredVoiceHints: ['xiaoxiao', 'xiaoyi', 'ting-ting', 'tingting', 'yaoyao', 'huihui', 'google 普通话'],
        geminiVoiceFallback: 'Zephyr',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: '第',
      authorBanner: 'EMRE PELIT · 深度摘要纯合成语音视频',
      subtitleTag: '12语种合成文化声线 · 语调由用户自主调节',
      summaryBadge: '全文深度摘要',
      narratorPrefix: '合成声线',
      liveReading: '实时朗读',
      speakerSynced: '按完播时长同步',
      viewsLabel: '观看',
      clickTip: '提示：点击右侧动态实体舞台即可实时交互',
      observerLabel: '观测者',
      photonLabel: '光子 (m=0)',
      restClockLabel: '静止 τ₀',
      travelerClockLabel: '高速 τ',
      linearChainLabel: 'Φ ≈ 0 (线性)',
      pipelineStages: ['输入', '分析', '验证', '综合'],
    },
  },
  ja: {
    code: 'ja',
    bcp47: 'ja-JP',
    altBcp47s: ['ja'],
    nativeName: '日本語',
    dir: 'ltr',
    charsPerSecond: 5.4,
    sentencePauseMs: 400,
    sectionPauseMs: 850,
    personas: [
      {
        id: 'ja-synth-baritone',
        name: '標準日本語スタジオ · 穏やか',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: '純合成・日本語学術ドキュメンタリー音声プロファイル',
        roleTitleTr: 'Sentetik Japonca Derin Belgesel Akustik Profili',
        culturalRegion: '日本語学術音響 · 合成プロファイル A',
        cadenceNote: '明瞭で落ち着いた丁寧な語り口（実在人物ではない合成音声）',
        preferredVoiceHints: ['keita', 'otoya', 'ichiro', 'hattori', 'google 日本語', 'japanese'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'ja-synth-clear',
        name: '学術解説声場 · 明瞭',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: '純合成・科学哲学ナビゲーション音声プロファイル',
        roleTitleTr: 'Sentetik Japonca Berrak Akustik Profili',
        culturalRegion: '日本語学術音響 · 合成プロファイル B',
        cadenceNote: '聴き取りやすく端正な標準語（実在人物ではない合成音声）',
        preferredVoiceHints: ['nanami', 'kyoko', 'haruka', 'ayumi', 'o-ren', 'google 日本語'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: '章',
      authorBanner: 'EMRE PELIT · 合成音声による詳細要約動画',
      subtitleTag: '12言語合成カルチャー音声 · 抑揚はユーザー任意',
      summaryBadge: '詳細要約',
      narratorPrefix: '合成音声',
      liveReading: '音声朗読中',
      speakerSynced: '朗読完了時間に同期',
      viewsLabel: '視聴',
      clickTip: 'ヒント：右側の動くオブジェクトをクリックして操作',
      observerLabel: '観測者',
      photonLabel: '光子 (m=0)',
      restClockLabel: '静止 τ₀',
      travelerClockLabel: '移動 τ',
      linearChainLabel: 'Φ ≈ 0 (線形)',
      pipelineStages: ['入力', '解析', '検証', '統合'],
    },
  },
  pt: {
    code: 'pt',
    bcp47: 'pt-BR',
    altBcp47s: ['pt-PT', 'pt'],
    nativeName: 'Português',
    dir: 'ltr',
    charsPerSecond: 14.4,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'pt-synth-baritone',
        name: 'Estúdio Atlântico · Grave',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Perfil Acústico Sintético Lusófono',
        roleTitleTr: 'Sentetik Portekizce Derin Akustik Profili',
        culturalRegion: 'Acústica Cultural Lusófona · Perfil Sintético A',
        cadenceNote: 'Ritmo didático e harmonioso (voz puramente sintética)',
        preferredVoiceHints: ['antonio', 'felipe', 'daniel', 'duarte', 'google português', 'portuguese'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.96,
        pitch: 0.97,
      },
      {
        id: 'pt-synth-clear',
        name: 'Estúdio Lusófono · Clara',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Perfil Acústico Sintético de Ciência e Filosofia',
        roleTitleTr: 'Sentetik Portekizce Berrak Akustik Profili',
        culturalRegion: 'Acústica Cultural Lusófona · Perfil Sintético B',
        cadenceNote: 'Entonação acolhedora e precisão conceitual (voz sintética)',
        preferredVoiceHints: ['francisca', 'luciana', 'maria', 'raquel', 'joana', 'google português'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CAP',
      authorBanner: 'EMRE PELIT · RESUMO ABRANGENTE VOZ SINTÉTICA',
      subtitleTag: '12 Idiomas · Voz Cultural Sintética · Entonação Livre',
      summaryBadge: 'RESUMO COMPLETO',
      narratorPrefix: 'Voz Sintética',
      liveReading: 'NARRAÇÃO AO VIVO',
      speakerSynced: 'Duração sincronizada à voz',
      viewsLabel: 'Vistas',
      clickTip: 'Dica: Clique nas entidades animadas no palco para interagir',
      observerLabel: 'Observador',
      photonLabel: 'Fóton (m=0)',
      restClockLabel: 'Repouso τ₀',
      travelerClockLabel: 'Viajante τ',
      linearChainLabel: 'Φ ≈ 0 (Linear)',
      pipelineStages: ['ENTRADA', 'ANÁLISE', 'VALIDAR', 'SÍNTESE'],
    },
  },
  it: {
    code: 'it',
    bcp47: 'it-IT',
    altBcp47s: ['it'],
    nativeName: 'Italiano',
    dir: 'ltr',
    charsPerSecond: 14.3,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'it-synth-baritone',
        name: 'Studio Mediterraneo · Calda',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profilo Acustico Sintetico Documentaristico',
        roleTitleTr: 'Sentetik İtalyanca Sıcak Akustik Profili',
        culturalRegion: 'Acustica Culturale Italiana · Profilo Sintetico A',
        cadenceNote: 'Dizione elegante e incisiva (voce puramente sintetica)',
        preferredVoiceHints: ['diego', 'luca', 'cosimo', 'google italiano', 'italian'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'it-synth-clear',
        name: 'Studio Classico · Chiara',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profilo Acustico Sintetico Scientifico',
        roleTitleTr: 'Sentetik İtalyanca Berrak Akustik Profili',
        culturalRegion: 'Acustica Culturale Italiana · Profilo Sintetico B',
        cadenceNote: 'Intonazione chiara ed espressiva (voce puramente sintetica)',
        preferredVoiceHints: ['elsa', 'isabella', 'alice', 'federica', 'google italiano'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CAP',
      authorBanner: 'EMRE PELIT · SINTESI COMPLETA VOCE SINTETICA',
      subtitleTag: '12 Lingue · Voce Culturale Sintetica · Tono Libero',
      summaryBadge: 'SINTESI ESTESA',
      narratorPrefix: 'Voce Sintetica',
      liveReading: 'LETTO DAL VIVO',
      speakerSynced: 'Sincronizzato alla voce',
      viewsLabel: 'Visite',
      clickTip: 'Suggerimento: Clicca sulle entità animate per interagire',
      observerLabel: 'Osservatore',
      photonLabel: 'Fotone (m=0)',
      restClockLabel: 'Quiete τ₀',
      travelerClockLabel: 'Viaggiatore τ',
      linearChainLabel: 'Φ ≈ 0 (Lineare)',
      pipelineStages: ['INPUT', 'ANALISI', 'VERIFICA', 'SINTESI'],
    },
  },
  ko: {
    code: 'ko',
    bcp47: 'ko-KR',
    altBcp47s: ['ko'],
    nativeName: '한국어',
    dir: 'ltr',
    charsPerSecond: 6.2,
    sentencePauseMs: 380,
    sectionPauseMs: 820,
    personas: [
      {
        id: 'ko-synth-baritone',
        name: '표준 한국어 스튜디오 · 차분함',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: '순수 합성 한국어 학술 다큐멘터리 음향 프로필',
        roleTitleTr: 'Sentetik Korece Sakin Akustik Profili',
        culturalRegion: '한국어 학술 음향 · 합성 프로필 A',
        cadenceNote: '차분하고 신뢰감 있는 다큐멘터리 어조 (실존 인물 아님)',
        preferredVoiceHints: ['injoon', 'hyunsu', 'bongjin', 'minsu', 'google 한국의', 'korean'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'ko-synth-clear',
        name: '학술 내레이션 음장 · 선명함',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: '순수 합성 과학·철학 해설 음향 프로필',
        roleTitleTr: 'Sentetik Korece Berrak Akustik Profili',
        culturalRegion: '한국어 학술 음향 · 합성 프로필 B',
        cadenceNote: '또렷하고 부드러운 표준어 해설 (실존 인물 아님)',
        preferredVoiceHints: ['sunhi', 'yuna', 'heami', 'sora', 'seoyeon', 'google 한국의'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: '장',
      authorBanner: 'EMRE PELIT · 순수 합성 음성 심층 요약 영상',
      subtitleTag: '12개 언어 합성 문화 음성 · 사용자 자율 억양',
      summaryBadge: '심층 요약',
      narratorPrefix: '합성 음성',
      liveReading: '실시간 낭독',
      speakerSynced: '낭독 완료 시간 기준',
      viewsLabel: '조회',
      clickTip: '팁: 오른쪽 움직이는 개체를 클릭해 상호작용하세요',
      observerLabel: '관측자',
      photonLabel: '광자 (m=0)',
      restClockLabel: '정지 τ₀',
      travelerClockLabel: '이동 τ',
      linearChainLabel: 'Φ ≈ 0 (선형)',
      pipelineStages: ['입력', '분석', '검증', '종합'],
    },
  },
  no: {
    code: 'no',
    bcp47: 'nb-NO',
    altBcp47s: ['no-NO', 'nn-NO', 'no', 'nb'],
    nativeName: 'Norsk',
    dir: 'ltr',
    charsPerSecond: 14.2,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'no-synth-baritone',
        name: 'Nordic Studio · Baryton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Syntetisk norsk dokumentar-lydprofil',
        roleTitleTr: 'Sentetik Norveççe Derin Akustik Profili',
        culturalRegion: 'Nordisk akustikk · Syntetisk profil A',
        cadenceNote: 'Rolig og tydelig vitenskapelig fortellerstemme (syntetisk)',
        preferredVoiceHints: ['finn', 'henrik', 'google norsk', 'norwegian', 'nb-no'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'no-synth-clear',
        name: 'Fjord Studio · Klar',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Syntetisk akademisk fortellerprofil',
        roleTitleTr: 'Sentetik Norveççe Berrak Akustik Profili',
        culturalRegion: 'Nordisk akustikk · Syntetisk profil B',
        cadenceNote: 'Klar og balansert norsk artikulasjon (syntetisk)',
        preferredVoiceHints: ['pernille', 'iselin', 'nora', 'google norsk', 'norwegian'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'KAP',
      authorBanner: 'EMRE PELIT · SYNTETISK FORKLARINGSVIDEO',
      subtitleTag: '23 Språk · Syntetisk Kulturstemme · Fri Intonasjon',
      summaryBadge: 'SAMMENDRAG',
      narratorPrefix: 'Syntetisk Stemme',
      liveReading: 'DIREKTE LESING',
      speakerSynced: 'Synkronisert med tale',
      viewsLabel: 'Visninger',
      clickTip: 'Tips: Klikk på figurene i scenen for å utforske',
      observerLabel: 'Observatør',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Hvile τ₀',
      travelerClockLabel: 'Reisende τ',
      linearChainLabel: 'Φ ≈ 0 (Lineær)',
      pipelineStages: ['INN', 'ANALYSE', 'VERIFISERING', 'SYNTESE'],
    },
  },
  is: {
    code: 'is',
    bcp47: 'is-IS',
    altBcp47s: ['is'],
    nativeName: 'Íslenska',
    dir: 'ltr',
    charsPerSecond: 13.8,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'is-synth-baritone',
        name: 'Saga Studio · Djúp',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Tilbúin íslensk fræðirödd',
        roleTitleTr: 'Sentetik İzlandaca Derin Akustik Profili',
        culturalRegion: 'Íslensk hljóðfræði · Tilbúin rödd A',
        cadenceNote: 'Róleg og skýr vísindafrásögn (tilbúin rödd)',
        preferredVoiceHints: ['gunnar', 'icelandic', 'is-is'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'is-synth-clear',
        name: 'Reykjavík Studio · Skýr',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Tilbúin skýr frásagnarrödd',
        roleTitleTr: 'Sentetik İzlandaca Berrak Akustik Profili',
        culturalRegion: 'Íslensk hljóðfræði · Tilbúin rödd B',
        cadenceNote: 'Skýr og hlý íslensk rödd (tilbúin)',
        preferredVoiceHints: ['gudrun', 'dora', 'icelandic', 'is-is'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'KAFLI',
      authorBanner: 'EMRE PELIT · SKÝRINGARMYNDBAND',
      subtitleTag: '23 Tungumál · Tilbúin Rödd',
      summaryBadge: 'SAMANTEKT',
      narratorPrefix: 'Tilbúin Rödd',
      liveReading: 'BEIN LESTUR',
      speakerSynced: 'Samstillt við tal',
      viewsLabel: 'Áhorf',
      clickTip: 'Ábending: Smelltu á sviðið til að kanna',
      observerLabel: 'Athugandi',
      photonLabel: 'Ljóseind (m=0)',
      restClockLabel: 'Kyrr τ₀',
      travelerClockLabel: 'Ferðalangur τ',
      linearChainLabel: 'Φ ≈ 0 (Línuleg)',
      pipelineStages: ['INNTAK', 'GREINING', 'STAÐFESTING', 'SAMSETNING'],
    },
  },
  da: {
    code: 'da',
    bcp47: 'da-DK',
    altBcp47s: ['da'],
    nativeName: 'Dansk',
    dir: 'ltr',
    charsPerSecond: 14.3,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'da-synth-baritone',
        name: 'Øresund Studio · Baryton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Syntetisk dansk dokumentarprofil',
        roleTitleTr: 'Sentetik Danca Derin Akustik Profili',
        culturalRegion: 'Dansk kulturakustik · Syntetisk profil A',
        cadenceNote: 'Rolig og præcis videnskabsformidling (syntetisk)',
        preferredVoiceHints: ['jeppe', 'magnus', 'google dansk', 'danish', 'da-dk'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'da-synth-clear',
        name: 'København Studio · Klar',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Syntetisk akademisk stemmeprofil',
        roleTitleTr: 'Sentetik Danca Berrak Akustik Profili',
        culturalRegion: 'Dansk kulturakustik · Syntetisk profil B',
        cadenceNote: 'Klar og naturlig dansk diktion (syntetisk)',
        preferredVoiceHints: ['christel', 'sara', 'naja', 'google dansk', 'danish'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'KAP',
      authorBanner: 'EMRE PELIT · SYNTETISK FORKLARINGSVIDEO',
      subtitleTag: '23 Sprog · Syntetisk Kulturstemme',
      summaryBadge: 'RESUMÉ',
      narratorPrefix: 'Syntetisk Stemme',
      liveReading: 'LIVE OPLÆSNING',
      speakerSynced: 'Synkroniseret med tale',
      viewsLabel: 'Visninger',
      clickTip: 'Tip: Klik på scenen for at udforske',
      observerLabel: 'Observatør',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Hvile τ₀',
      travelerClockLabel: 'Rejsende τ',
      linearChainLabel: 'Φ ≈ 0 (Lineær)',
      pipelineStages: ['INPUT', 'ANALYSE', 'KONTROL', 'SYNTESE'],
    },
  },
  sv: {
    code: 'sv',
    bcp47: 'sv-SE',
    altBcp47s: ['sv'],
    nativeName: 'Svenska',
    dir: 'ltr',
    charsPerSecond: 14.4,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'sv-synth-baritone',
        name: 'Uppsala Studio · Baryton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Syntetisk svensk dokumentärprofil',
        roleTitleTr: 'Sentetik İsveççe Derin Akustik Profili',
        culturalRegion: 'Svensk kulturakustik · Syntetisk profil A',
        cadenceNote: 'Lugn och saklig vetenskaplig ton (syntetisk)',
        preferredVoiceHints: ['mattias', 'oskar', 'google svenska', 'swedish', 'sv-se'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'sv-synth-clear',
        name: 'Stockholm Studio · Klar',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Syntetisk akademisk berättarprofil',
        roleTitleTr: 'Sentetik İsveççe Berrak Akustik Profili',
        culturalRegion: 'Svensk kulturakustik · Syntetisk profil B',
        cadenceNote: 'Tydlig och harmonisk svensk röst (syntetisk)',
        preferredVoiceHints: ['sofie', 'hillevi', 'alva', 'astrid', 'google svenska', 'swedish'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'KAP',
      authorBanner: 'EMRE PELIT · SYNTETISK FÖRKLARINGSVIDEO',
      subtitleTag: '23 Språk · Syntetisk Kulturröst',
      summaryBadge: 'SAMMANFATTNING',
      narratorPrefix: 'Syntetisk Röst',
      liveReading: 'DIREKTUPPLÄSNING',
      speakerSynced: 'Synkad med tal',
      viewsLabel: 'Visningar',
      clickTip: 'Tips: Klicka på scenen för att interagera',
      observerLabel: 'Observatör',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Vila τ₀',
      travelerClockLabel: 'Resenär τ',
      linearChainLabel: 'Φ ≈ 0 (Linjär)',
      pipelineStages: ['DATA', 'ANALYS', 'VALIDERING', 'SYNTES'],
    },
  },
  nl: {
    code: 'nl',
    bcp47: 'nl-NL',
    altBcp47s: ['nl-BE', 'nl'],
    nativeName: 'Nederlands',
    dir: 'ltr',
    charsPerSecond: 14.5,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'nl-synth-baritone',
        name: 'Leiden Studio · Bariton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetisch Nederlands documentaireprofiel',
        roleTitleTr: 'Sentetik Felemenkçe Derin Akustik Profili',
        culturalRegion: 'Nederlandse cultuurakoestiek · Synthetisch A',
        cadenceNote: 'Heldere en rustige wetenschappelijke toon (synthetisch)',
        preferredVoiceHints: ['maarten', 'xander', 'ruben', 'google nederlands', 'dutch', 'nl-nl'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'nl-synth-clear',
        name: 'Delft Studio · Helder',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetisch academisch vertelprofiel',
        roleTitleTr: 'Sentetik Felemenkçe Berrak Akustik Profili',
        culturalRegion: 'Nederlandse cultuurakoestiek · Synthetisch B',
        cadenceNote: 'Vloeiende en duidelijke Nederlandse stem (synthetisch)',
        preferredVoiceHints: ['colette', 'fenna', 'ellen', 'claire', 'google nederlands', 'dutch'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'HFD',
      authorBanner: 'EMRE PELIT · SYNTHETISCHE UITLEGVIDEO',
      subtitleTag: '23 Talen · Synthetische Cultuurstem',
      summaryBadge: 'SAMENVATTING',
      narratorPrefix: 'Synthetische Stem',
      liveReading: 'LIVE VOORLEZEN',
      speakerSynced: 'Gesynchroniseerd met spraak',
      viewsLabel: 'Weergaven',
      clickTip: 'Tip: Klik op de scène om te verkennen',
      observerLabel: 'Waarnemer',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Rust τ₀',
      travelerClockLabel: 'Reiziger τ',
      linearChainLabel: 'Φ ≈ 0 (Lineair)',
      pipelineStages: ['INVOER', 'ANALYSE', 'TOETSING', 'SYNTHESE'],
    },
  },
  fi: {
    code: 'fi',
    bcp47: 'fi-FI',
    altBcp47s: ['fi'],
    nativeName: 'Suomi',
    dir: 'ltr',
    charsPerSecond: 13.6,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'fi-synth-baritone',
        name: 'Helsinki Studio · Baritoni',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synteettinen suomalainen dokumenttiääni',
        roleTitleTr: 'Sentetik Fince Derin Akustik Profili',
        culturalRegion: 'Suomalainen akustiikka · Synteettinen A',
        cadenceNote: 'Rauhallinen ja selkeä tieteellinen ääni (synteettinen)',
        preferredVoiceHints: ['harri', 'onni', 'google suomi', 'finnish', 'fi-fi'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'fi-synth-clear',
        name: 'Aalto Studio · Kirkas',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synteettinen akateeminen kertojaääni',
        roleTitleTr: 'Sentetik Fince Berrak Akustik Profili',
        culturalRegion: 'Suomalainen akustiikka · Synteettinen B',
        cadenceNote: 'Selkeä ja luonnollinen suomen ääntämys (synteettinen)',
        preferredVoiceHints: ['noora', 'selma', 'satu', 'google suomi', 'finnish'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'LUKU',
      authorBanner: 'EMRE PELIT · SYNTEETTINEN SELITYSVIDEO',
      subtitleTag: '23 Kieltä · Synteettinen Kulttuuriääni',
      summaryBadge: 'TIIVISTELMÄ',
      narratorPrefix: 'Synteettinen Ääni',
      liveReading: 'SUORA LUKU',
      speakerSynced: 'Synkronoitu puheeseen',
      viewsLabel: 'Katselut',
      clickTip: 'Vinkki: Klikkaa näyttämöä tutkiaksesi',
      observerLabel: 'Havaitsija',
      photonLabel: 'Fotoni (m=0)',
      restClockLabel: 'Lepo τ₀',
      travelerClockLabel: 'Matkaaja τ',
      linearChainLabel: 'Φ ≈ 0 (Lineaarinen)',
      pipelineStages: ['SYÖTE', 'ANALYYSI', 'TARKISTUS', 'SYNTEESI'],
    },
  },
  ga: {
    code: 'ga',
    bcp47: 'ga-IE',
    altBcp47s: ['ga', 'en-IE'],
    nativeName: 'Gaeilge',
    dir: 'ltr',
    charsPerSecond: 14.0,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'ga-synth-baritone',
        name: 'Dublin Studio · Domhain',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Próifíl Guth Sintéiseach Gaeilge',
        roleTitleTr: 'Sentetik İrlandaca Derin Akustik Profili',
        culturalRegion: 'Fuaimeolaíocht Éireannach · Sintéiseach A',
        cadenceNote: 'Guth soiléir eolaíochta (sintéiseach)',
        preferredVoiceHints: ['colm', 'irish', 'ga-ie', 'en-ie'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'ga-synth-clear',
        name: 'Galway Studio · Soiléir',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Próifíl Acadúil Sintéiseach',
        roleTitleTr: 'Sentetik İrlandaca Berrak Akustik Profili',
        culturalRegion: 'Fuaimeolaíocht Éireannach · Sintéiseach B',
        cadenceNote: 'Insint shoiléir rianúil (sintéiseach)',
        preferredVoiceHints: ['orla', 'moira', 'irish', 'ga-ie'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CAIB',
      authorBanner: 'EMRE PELIT · FÍSEÁN MÍNIÚCHÁIN',
      subtitleTag: '23 Teanga · Guth Sintéiseach',
      summaryBadge: 'ACHOIMRE',
      narratorPrefix: 'Guth Sintéiseach',
      liveReading: 'LÉAMH BEO',
      speakerSynced: 'Sioncronaithe le caint',
      viewsLabel: 'Radhairc',
      clickTip: 'Leid: Cliceáil ar an stáitse chun iniúchadh',
      observerLabel: 'Breathnóir',
      photonLabel: 'Fótón (m=0)',
      restClockLabel: 'Suaimhneas τ₀',
      travelerClockLabel: 'Taistealaí τ',
      linearChainLabel: 'Φ ≈ 0 (Líneach)',
      pipelineStages: ['IONCHUR', 'ANAILÍS', 'FÍORÚ', 'SINTÉIS'],
    },
  },
  lb: {
    code: 'lb',
    bcp47: 'lb-LU',
    altBcp47s: ['lb', 'de-LU', 'fr-LU'],
    nativeName: 'Lëtzebuergesch',
    dir: 'ltr',
    charsPerSecond: 14.0,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'lb-synth-baritone',
        name: 'Lëtzebuerg Studio · Bariton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetesch lëtzebuergesch Stëmmprofil',
        roleTitleTr: 'Sentetik Lüksemburgca Derin Akustik Profili',
        culturalRegion: 'Lëtzebuerger Akustik · Synthetesch A',
        cadenceNote: 'Roueg a kloer wëssenschaftlech Stëmm (synthetesch)',
        preferredVoiceHints: ['luxembourg', 'lb-lu', 'de-de'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'lb-synth-clear',
        name: 'Kirchberg Studio · Kloer',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Synthetesch akademesch Stëmm',
        roleTitleTr: 'Sentetik Lüksemburgca Berrak Akustik Profili',
        culturalRegion: 'Lëtzebuerger Akustik · Synthetesch B',
        cadenceNote: 'Kloer an natierlech Sprooch (synthetesch)',
        preferredVoiceHints: ['luxembourg', 'lb-lu', 'katja', 'anna'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'KAP',
      authorBanner: 'EMRE PELIT · ERKLÄRUNGSVIDEO',
      subtitleTag: '23 Sproochen · Synthetesch Stëmm',
      summaryBadge: 'ZESUMMENFAASSUNG',
      narratorPrefix: 'Synthetesch Stëmm',
      liveReading: 'LIVE LIESEN',
      speakerSynced: 'Synchroniséiert mat Ried',
      viewsLabel: 'Klicken',
      clickTip: 'Tipp: Klickt op d’Bün fir ze entdecken',
      observerLabel: 'Observateur',
      photonLabel: 'Photon (m=0)',
      restClockLabel: 'Rou τ₀',
      travelerClockLabel: 'Reesender τ',
      linearChainLabel: 'Φ ≈ 0 (Linear)',
      pipelineStages: ['INPUT', 'ANALYS', 'KONTROLL', 'SYNTHES'],
    },
  },
  rm: {
    code: 'rm',
    bcp47: 'rm-CH',
    altBcp47s: ['rm', 'it-CH', 'de-CH'],
    nativeName: 'Rumantsch',
    dir: 'ltr',
    charsPerSecond: 14.0,
    sentencePauseMs: 360,
    sectionPauseMs: 780,
    personas: [
      {
        id: 'rm-synth-baritone',
        name: 'Grischun Studio · Bariton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profil acustic sintetic rumantsch',
        roleTitleTr: 'Sentetik Romanşça Derin Akustik Profili',
        culturalRegion: 'Acustica alpina svizra · Sintetic A',
        cadenceNote: 'Vusch ruassaivla e clera (sintetica)',
        preferredVoiceHints: ['romansh', 'rm-ch', 'it-ch'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.95,
        pitch: 0.96,
      },
      {
        id: 'rm-synth-clear',
        name: 'Alpin Studio · Clera',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profil academic sintetic',
        roleTitleTr: 'Sentetik Romanşça Berrak Akustik Profili',
        culturalRegion: 'Acustica alpina svizra · Sintetic B',
        cadenceNote: 'Articulaziun clera ed armonica (sintetica)',
        preferredVoiceHints: ['romansh', 'rm-ch', 'elsa', 'alice'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.97,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'CAP',
      authorBanner: 'EMRE PELIT · VIDEO EXPLICATIV',
      subtitleTag: '23 Linguas · Vusch Sintetica',
      summaryBadge: 'RESUMZIUN',
      narratorPrefix: 'Vusch Sintetica',
      liveReading: 'LECTURA LIVE',
      speakerSynced: 'Sincronisà cun la vusch',
      viewsLabel: 'Visitas',
      clickTip: 'Tip: Clicca sin il palc per explorar',
      observerLabel: 'Observatur',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Paus τ₀',
      travelerClockLabel: 'Viagiatur τ',
      linearChainLabel: 'Φ ≈ 0 (Linear)',
      pipelineStages: ['INPUT', 'ANALISA', 'VERIFICA', 'SINTESA'],
    },
  },
  ms: {
    code: 'ms',
    bcp47: 'ms-MY',
    altBcp47s: ['ms-SG', 'ms'],
    nativeName: 'Bahasa Melayu',
    dir: 'ltr',
    charsPerSecond: 14.5,
    sentencePauseMs: 350,
    sectionPauseMs: 760,
    personas: [
      {
        id: 'ms-synth-baritone',
        name: 'Nusantara Studio · Bariton',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profil Suara Dokumentari Sintetik Bahasa Melayu',
        roleTitleTr: 'Sentetik Malayca Derin Akustik Profili',
        culturalRegion: 'Akustik Budaya Melayu · Profil Sintetik A',
        cadenceNote: 'Nada dokumentari sains yang tenang dan jelas (sintetik)',
        preferredVoiceHints: ['osman', 'google bahasa melayu', 'malay', 'ms-my', 'ms-sg'],
        geminiVoiceFallback: 'Fenrir',
        rateMultiplier: 0.96,
        pitch: 0.96,
      },
      {
        id: 'ms-synth-clear',
        name: 'Singapura Studio · Jelas',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'Profil Suara Akademik Sintetik',
        roleTitleTr: 'Sentetik Malayca Berrak Akustik Profili',
        culturalRegion: 'Akustik Budaya Melayu · Profil Sintetik B',
        cadenceNote: 'Sebutan jelas dan lancar (sintetik)',
        preferredVoiceHints: ['yasmin', 'amira', 'google bahasa melayu', 'malay', 'ms-my'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.98,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'BAB',
      authorBanner: 'EMRE PELIT · VIDEO PENERANGAN SINTETIK',
      subtitleTag: '23 Bahasa · Suara Budaya Sintetik',
      summaryBadge: 'RINGKASAN',
      narratorPrefix: 'Suara Sintetik',
      liveReading: 'BACAAN LANGSUNG',
      speakerSynced: 'Disegerakkan dengan suara',
      viewsLabel: 'Tontonan',
      clickTip: 'Tip: Klik pentas untuk meneroka',
      observerLabel: 'Pemerhati',
      photonLabel: 'Foton (m=0)',
      restClockLabel: 'Rehat τ₀',
      travelerClockLabel: 'Pengembara τ',
      linearChainLabel: 'Φ ≈ 0 (Linear)',
      pipelineStages: ['INPUT', 'ANALISIS', 'SEMAKAN', 'SINTESIS'],
    },
  },
  ta: {
    code: 'ta',
    bcp47: 'ta-IN',
    altBcp47s: ['ta-SG', 'ta-MY', 'ta'],
    nativeName: 'தமிழ்',
    dir: 'ltr',
    charsPerSecond: 11.4,
    sentencePauseMs: 380,
    sectionPauseMs: 820,
    personas: [
      {
        id: 'ta-synth-baritone',
        name: 'செந்தமிழ் ஸ்டுடியோ · ஆழம்',
        gender: 'male',
        isSyntheticArchetype: true,
        roleTitleNative: 'செயற்கை தமிழ் அறிவியல் குரல் சுயவிவரம்',
        roleTitleTr: 'Sentetik Tamilce Derin Akustik Profili',
        culturalRegion: 'தமிழ் ஒலியியல் · செயற்கை சுயவிவரம் A',
        cadenceNote: 'அமைதியான தெளிவான அறிவியல் உச்சரிப்பு (செயற்கை)',
        preferredVoiceHints: ['valluvar', 'anbu', 'google தமிழ்', 'tamil', 'ta-in', 'ta-sg'],
        geminiVoiceFallback: 'Charon',
        rateMultiplier: 0.94,
        pitch: 0.96,
      },
      {
        id: 'ta-synth-clear',
        name: 'அறிவியல் ஸ்டுடியோ · தெளிவு',
        gender: 'female',
        isSyntheticArchetype: true,
        roleTitleNative: 'செயற்கை கல்வி விளக்கக் குரல்',
        roleTitleTr: 'Sentetik Tamilce Berrak Akustik Profili',
        culturalRegion: 'தமிழ் ஒலியியல் · செயற்கை சுயவிவரம் B',
        cadenceNote: 'தெளிவான மென்மையான தமிழ் உரை (செயற்கை)',
        preferredVoiceHints: ['pallavi', 'venba', 'vani', 'google தமிழ்', 'tamil', 'ta-in'],
        geminiVoiceFallback: 'Kore',
        rateMultiplier: 0.96,
        pitch: 1.02,
      },
    ],
    stageLabels: {
      chapterPrefix: 'அத்தியாயம்',
      authorBanner: 'EMRE PELIT · செயற்கை விளக்க காணொளி',
      subtitleTag: '23 மொழிகள் · செயற்கை கலாச்சார குரல்',
      summaryBadge: 'சுருக்கம்',
      narratorPrefix: 'செயற்கை குரல்',
      liveReading: 'நேரடி வாசிப்பு',
      speakerSynced: 'குரலுடன் ஒத்திசைக்கப்பட்டது',
      viewsLabel: 'பார்வைகள்',
      clickTip: 'குறிப்பு: காட்சியைத் தொட்டு ஆராயுங்கள்',
      observerLabel: 'கவனிப்பாளர்',
      photonLabel: 'ஃபோட்டான் (m=0)',
      restClockLabel: 'நிலை τ₀',
      travelerClockLabel: 'பயணி τ',
      linearChainLabel: 'Φ ≈ 0 (நேரியல்)',
      pipelineStages: ['உள்ளீடு', 'பகுப்பாய்வு', 'சரிபார்ப்பு', 'தொகுப்பு'],
    },
  },
};

export function getCulturalVoiceProfile(lang: LanguageCode): CulturalLanguageVoiceProfile {
  return CULTURAL_VOICE_PROFILES[lang] || CULTURAL_VOICE_PROFILES.en;
}

export interface SelectedCulturalVoiceResult {
  voice: SpeechSynthesisVoice | null;
  displayVoiceName: string;
  isNativeVoiceAvailable: boolean;
  availableVoicesForLang: SpeechSynthesisVoice[];
}

/**
 * Picks the highest-quality synthetic system/neural SpeechSynthesisVoice matching the target language & cultural profile.
 * Never mimics any real individual; uses only standard device/neural synthetic voices.
 */
export function selectBestCulturalVoice(
  allVoices: SpeechSynthesisVoice[],
  lang: LanguageCode,
  personaIndex: 0 | 1 = 0,
  manualVoiceUri?: string
): SelectedCulturalVoiceResult {
  const profile = getCulturalVoiceProfile(lang);
  const persona = profile.personas[personaIndex] || profile.personas[0];
  const langPrefix = lang.toLowerCase();
  const targetBcp = profile.bcp47.toLowerCase();
  const altBcps = profile.altBcp47s.map((b) => b.toLowerCase());

  const availableVoicesForLang = allVoices.filter((v) => {
    const vl = (v.lang || '').toLowerCase().replace('_', '-');
    return vl === targetBcp || vl.startsWith(`${langPrefix}-`) || vl === langPrefix || altBcps.includes(vl);
  });

  if (manualVoiceUri) {
    const manual = availableVoicesForLang.find((v) => v.voiceURI === manualVoiceUri);
    if (manual) {
      return {
        voice: manual,
        displayVoiceName: manual.name,
        isNativeVoiceAvailable: true,
        availableVoicesForLang,
      };
    }
  }

  if (availableVoicesForLang.length === 0) {
    return {
      voice: null,
      displayVoiceName: `${persona.name} (${profile.bcp47})`,
      isNativeVoiceAvailable: false,
      availableVoicesForLang: [],
    };
  }

  const scored = availableVoicesForLang.map((v) => {
    const nameL = (v.name || '').toLowerCase();
    const langL = (v.lang || '').toLowerCase().replace('_', '-');
    let score = 0;

    if (langL === targetBcp) score += 30;
    else if (altBcps.includes(langL)) score += 20;
    else score += 10;

    if (/natural|neural|online|premium|enhanced|wavenet|siri/i.test(nameL)) score += 35;
    if (/google/i.test(nameL)) score += 24;
    if (/microsoft/i.test(nameL)) score += 18;
    if (/compact|espeak/i.test(nameL)) score -= 18;

    for (let i = 0; i < persona.preferredVoiceHints.length; i++) {
      if (nameL.includes(persona.preferredVoiceHints[i])) {
        score += 40 - i * 3;
        break;
      }
    }

    return { v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].v;

  return {
    voice: best,
    displayVoiceName: best.name,
    isNativeVoiceAvailable: true,
    availableVoicesForLang,
  };
}

/**
 * Estimates natural spoken duration (in seconds) of a text in the target language.
 * Scales dynamically with actual summary length, user rate, and user pause cadence.
 */
export function estimateSpeechDurationSec(
  text: string,
  lang: LanguageCode,
  rateMultiplier = 1.0,
  pauseScale = 1.0
): number {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return 4;
  const profile = getCulturalVoiceProfile(lang);
  const safeRate = Math.max(0.5, Math.min(2.5, rateMultiplier || 1));
  const safePause = Math.max(0.4, Math.min(2.2, pauseScale || 1));
  const sentenceCount = Math.max(1, (cleaned.match(/[.!?。！？؟]+/g) || []).length);
  const speakingSec = cleaned.length / (profile.charsPerSecond * safeRate);
  const pauseSec = ((sentenceCount * profile.sentencePauseMs * safePause) / 1000) / safeRate;
  return Math.max(3, Math.ceil(speakingSec + pauseSec));
}

interface SpokenSymbolWords {
  and: string;
  percent: string;
  equals: string;
  approx: string;
  notEqual: string;
  lessEq: string;
  greaterEq: string;
  plus: string;
  times: string;
  infinity: string;
  figure: string;
  number: string;
}

const SPOKEN_SYMBOL_WORDS: Partial<Record<LanguageCode, SpokenSymbolWords>> = {
  tr: {
    and: 've',
    percent: 'yüzde',
    equals: 'eşittir',
    approx: 'yaklaşık',
    notEqual: 'eşit değildir',
    lessEq: 'küçük veya eşittir',
    greaterEq: 'büyük veya eşittir',
    plus: 'artı',
    times: 'çarpı',
    infinity: 'sonsuzluk',
    figure: 'figür',
    number: 'numara',
  },
  en: {
    and: 'and',
    percent: 'percent',
    equals: 'equals',
    approx: 'approximately',
    notEqual: 'is not equal to',
    lessEq: 'less than or equal to',
    greaterEq: 'greater than or equal to',
    plus: 'plus',
    times: 'times',
    infinity: 'infinity',
    figure: 'figure',
    number: 'number',
  },
  es: {
    and: 'y',
    percent: 'por ciento',
    equals: 'es igual a',
    approx: 'aproximadamente',
    notEqual: 'no es igual a',
    lessEq: 'menor o igual que',
    greaterEq: 'mayor o igual que',
    plus: 'más',
    times: 'por',
    infinity: 'infinito',
    figure: 'figura',
    number: 'número',
  },
  de: {
    and: 'und',
    percent: 'Prozent',
    equals: 'gleich',
    approx: 'ungefähr',
    notEqual: 'ungleich',
    lessEq: 'kleiner gleich',
    greaterEq: 'größer gleich',
    plus: 'plus',
    times: 'mal',
    infinity: 'Unendlichkeit',
    figure: 'Abbildung',
    number: 'Nummer',
  },
  fr: {
    and: 'et',
    percent: 'pour cent',
    equals: 'égale',
    approx: 'environ',
    notEqual: 'différent de',
    lessEq: 'inférieur ou égal à',
    greaterEq: 'supérieur ou égal à',
    plus: 'plus',
    times: 'fois',
    infinity: 'infini',
    figure: 'figure',
    number: 'numéro',
  },
  ru: {
    and: 'и',
    percent: 'процентов',
    equals: 'равно',
    approx: 'приблизительно',
    notEqual: 'не равно',
    lessEq: 'меньше или равно',
    greaterEq: 'больше или равно',
    plus: 'плюс',
    times: 'умножить на',
    infinity: 'бесконечность',
    figure: 'рисунок',
    number: 'номер',
  },
  ar: {
    and: 'و',
    percent: 'بالمئة',
    equals: 'يساوي',
    approx: 'تقريباً',
    notEqual: 'لا يساوي',
    lessEq: 'أقل من أو يساوي',
    greaterEq: 'أكبر من أو يساوي',
    plus: 'زائد',
    times: 'ضرب',
    infinity: 'اللانهاية',
    figure: 'شكل',
    number: 'رقم',
  },
  zh: {
    and: '和',
    percent: '百分之',
    equals: '等于',
    approx: '约等于',
    notEqual: '不等于',
    lessEq: '小于等于',
    greaterEq: '大于等于',
    plus: '加',
    times: '乘以',
    infinity: '无穷大',
    figure: '图',
    number: '编号',
  },
  ja: {
    and: 'と',
    percent: 'パーセント',
    equals: 'イコール',
    approx: 'およそ',
    notEqual: '等しくない',
    lessEq: '以下',
    greaterEq: '以上',
    plus: 'プラス',
    times: '掛ける',
    infinity: '無限大',
    figure: '図',
    number: '番号',
  },
  pt: {
    and: 'e',
    percent: 'por cento',
    equals: 'igual a',
    approx: 'aproximadamente',
    notEqual: 'diferente de',
    lessEq: 'menor ou igual a',
    greaterEq: 'maior ou igual a',
    plus: 'mais',
    times: 'vezes',
    infinity: 'infinito',
    figure: 'figura',
    number: 'número',
  },
  it: {
    and: 'e',
    percent: 'per cento',
    equals: 'uguale a',
    approx: 'circa',
    notEqual: 'diverso da',
    lessEq: 'minore o uguale a',
    greaterEq: 'maggiore o uguale a',
    plus: 'più',
    times: 'per',
    infinity: 'infinito',
    figure: 'figura',
    number: 'numero',
  },
  ko: {
    and: '및',
    percent: '퍼센트',
    equals: '같다',
    approx: '약',
    notEqual: '같지 않다',
    lessEq: '이하',
    greaterEq: '이상',
    plus: '플러스',
    times: '곱하기',
    infinity: '무한대',
    figure: '그림',
    number: '번호',
  },
};

/**
 * Normalizes ANY text containing alphanumeric codes, decimals, abbreviations, math/Greek Unicode,
 * URLs, slashes, brackets, dashes, invisible chars, or emojis into smooth, natural spoken prose
 * so browser SpeechSynthesis NEVER stalls, skips, or fails on unusual character combinations.
 */
export function sanitizeTextForUninterruptedSpeech(
  rawText: string,
  lang: LanguageCode = 'tr'
): string {
  if (!rawText) return '';
  const w = SPOKEN_SYMBOL_WORDS[lang] || SPOKEN_SYMBOL_WORDS.en!;
  const isTr = lang === 'tr';

  let s = String(rawText);

  // 1. Unicode NFKC normalization (converts superscripts ², subscripts ₀, ligatures, fullwidth alphanumerics)
  try {
    s = s.normalize('NFKC');
  } catch {
    // ignore environments lacking normalize
  }

  // 2. Strip zero-width, bidi control, soft hyphens, BOM, ASCII control chars, and pictographic emojis
  s = s
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00AD]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ')
    .replace(/[\u2600-\u27BF\uE000-\uF8FF]/g, ' ');
  try {
    s = s.replace(/\p{Extended_Pictographic}/gu, ' ');
  } catch {
    // fallback if regex property escapes unavailable
  }

  // 3. Humanize URLs and emails so TTS never chokes on protocols or slashes
  s = s
    .replace(/https?:\/\/(?:www\.)?/gi, '')
    .replace(
      /\b([a-z0-9-]+(?:\.[a-z0-9-]+)*)\.(ai\.studio|blogspot\.com|com|org|net|edu|gov|io|studio)\b/gi,
      (_, host: string, tld: string) => `${host.replace(/\./g, ' ')} ${tld.replace(/\./g, ' ')}`
    );

  // 4. Normalize technical figure/archive codes & glued alphanumeric tokens (e.g. FIG. BLG.316, SCIPHIL-#305, E=mc2)
  s = s
    .replace(/\bFIG\.?\s*BLG\.?\s*(\d+)/gi, `${w.figure} $1`)
    .replace(/\bSCIPHIL[-_#\s]*(\d+)/gi, `Sci-Phil $1`)
    .replace(/\bNo\.?\s*(\d+)/gi, `${w.number} $1`)
    .replace(/#\s*(\d+)/g, `${w.number} $1`)
    .replace(/%(\d+(?:[.,]\d+)?)/g, `${w.percent} $1`)
    .replace(/(\d+(?:[.,]\d+)?)\s*%/g, isTr ? `${w.percent} $1` : `$1 ${w.percent}`)
    .replace(/(\d+)\s*\+/g, `$1 ${w.plus}`);

  // 5. Expand Greek letters & scientific/mathematical Unicode symbols into spoken words
  const symbolMap: Array<[RegExp, string]> = [
    [/[Φφ]/g, isTr ? ' Fi ' : ' Phi '],
    [/[Ψψ]/g, ' Psi '],
    [/[Δδ]/g, ' Delta '],
    [/[Λλ]/g, ' Lambda '],
    [/[Ττ]/g, ' Tau '],
    [/[Ππ]/g, ' Pi '],
    [/[Ωω]/g, ' Omega '],
    [/[Αα]/g, isTr ? ' Alfa ' : ' Alpha '],
    [/[Ββ]/g, ' Beta '],
    [/[Γγ]/g, isTr ? ' Gama ' : ' Gamma '],
    [/[Θθ]/g, isTr ? ' Teta ' : ' Theta '],
    [/[Σσς]/g, ' Sigma '],
    [/[Μμ]/g, isTr ? ' Mü ' : ' Mu '],
    [/[Εε]/g, ' Epsilon '],
    [/[ℏħ]/g, isTr ? ' Planck sabiti ' : ' h bar '],
    [/∞/g, ` ${w.infinity} `],
    [/≈|≃|≅/g, ` ${w.approx} `],
    [/≠/g, ` ${w.notEqual} `],
    [/≤/g, ` ${w.lessEq} `],
    [/≥/g, ` ${w.greaterEq} `],
    [/=/g, ` ${w.equals} `],
    [/×/g, ` ${w.times} `],
    [/±/g, ` ${w.plus} `],
    [/&/g, ` ${w.and} `],
    [/[→↔⇒⇔←↑↓]/g, ', '],
    [/[·•¦|§¶—–―]/g, ', '],
    [/\.{2,}|…/g, ', '],
  ];
  for (const [pattern, replacement] of symbolMap) {
    s = s.replace(pattern, replacement);
  }

  // 6. Separate glued alphanumeric symbols cleanly (e.g. "AdS/CFT" -> "AdS CFT", "x_1" -> "x 1", "a-b" -> "a b", "v2.1" -> "v 2.1")
  s = s
    .replace(/[/\\_~^*#`]/g, ' ')
    .replace(/[()[\]{}<>«»“”"„‟]/g, ' ')
    .replace(/(\d+)\.(\d+)/g, isTr ? '$1 virgül $2' : '$1.$2')
    // Separate ASCII letters glued directly to digits (e.g. "3D", "H2O", "BLG316", "10dk") only when ASCII so words like Turkish/other scripts remain intact
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .replace(/(\d)([A-Za-z])/g, '$1 $2')
    // Replace hyphens between words/codes with clean space so TTS never chokes on hyphenated alphanumeric IDs
    .replace(/\s*-\s*/g, ' ');

  // 7. Keep only safe Unicode letters, numbers, in-word apostrophes, spaces, and clean sentence punctuation
  try {
    s = s.replace(/[^\p{L}\p{N}\s.,!?;:'،、。！？؟]/gu, ' ');
  } catch {
    // Safe fallback preserving Latin/Turkish/Cyrillic/Arabic/CJK ranges
    s = s.replace(/[^0-9A-Za-zÀ-ÖØ-öø-ÿğĞıİöÖüÜşŞçÇА-Яа-яЁё\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\s.,!?;:'،、。！？؟]/g, ' ');
  }

  // 8. Clean stray apostrophes, repeated punctuation, and whitespace
  s = s
    .replace(/(^|\s)'+|'+(\s|$)/g, ' ')
    .replace(/\s+([.,!?;:،、。！？؟])/g, '$1')
    .replace(/([.,!?;:،、。！？؟])\1+/g, '$1')
    .replace(/,\s*\./g, '.')
    .replace(/\.\s*,/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

  // 9. Verify the chunk actually contains speakable alphanumeric/letter content
  try {
    if (!/[\p{L}\p{N}]/u.test(s)) return '';
  } catch {
    if (!/[0-9A-Za-zÀ-ÿ\u0400-\u04FF\u0600-\u06FF\u3040-\u9FFF\uAC00-\uD7AF]/.test(s)) return '';
  }

  return s;
}

/**
 * Ultra-safe plain fallback sanitizer used ONLY if a browser TTS voice throws an error
 * on a chunk — removes all punctuation except spaces so any OS voice can speak it cleanly.
 */
export function toPlainSpokenFallback(text: string): string {
  let s = String(text || '');
  try {
    s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
  } catch {
    s = s.replace(/[^0-9A-Za-zÀ-ÿğĞıİöÖüÜşŞçÇ\u0400-\u04FF\u0600-\u06FF\u3040-\u9FFF\uAC00-\uD7AF\s]/g, ' ');
  }
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Splits a sanitized spoken sentence into guaranteed browser-safe utterance chunks
 * (<= 155 chars for alphabetic/RTL scripts, <= 72 chars for CJK scripts) so Chrome, Edge,
 * Safari, and mobile Web Speech engines NEVER hit their single-utterance buffer timeout or cut off mid-sentence.
 */
export function splitSafeUtteranceChunks(
  rawText: string,
  lang: LanguageCode = 'tr'
): string[] {
  const sanitized = sanitizeTextForUninterruptedSpeech(rawText, lang);
  if (!sanitized) return [];

  const isCjk = lang === 'zh' || lang === 'ja' || lang === 'ko';
  const maxLen = isCjk ? 72 : 155;

  if (sanitized.length <= maxLen) return [sanitized];

  const chunks: string[] = [];

  // First split by natural clause punctuation (CJK fullwidth needs no trailing space; Western requires trailing space so decimals like 3.14 stay intact)
  const clauses = sanitized
    .split(/(?<=[。！？、；])\s*|(?<=[,;،:.!?])\s+/)
    .map((c) => c.trim())
    .filter(Boolean);

  const pushWordBounded = (segment: string) => {
    if (segment.length <= maxLen) {
      chunks.push(segment);
      return;
    }
    const hasSpaces = /\s/.test(segment);
    if (!hasSpaces) {
      // CJK or continuous script without spaces
      for (let i = 0; i < segment.length; i += maxLen) {
        const piece = segment.slice(i, i + maxLen).trim();
        if (piece) chunks.push(piece);
      }
      return;
    }
    const words = segment.split(/\s+/).filter(Boolean);
    let current = '';
    for (const word of words) {
      if (word.length > maxLen) {
        if (current) {
          chunks.push(current);
          current = '';
        }
        for (let i = 0; i < word.length; i += maxLen) {
          chunks.push(word.slice(i, i + maxLen));
        }
        continue;
      }
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxLen && current) {
        chunks.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) chunks.push(current);
  };

  let acc = '';
  for (const clause of clauses) {
    if (clause.length > maxLen) {
      if (acc) {
        pushWordBounded(acc);
        acc = '';
      }
      pushWordBounded(clause);
      continue;
    }
    const next = acc ? `${acc} ${clause}` : clause;
    if (next.length > maxLen && acc) {
      chunks.push(acc);
      acc = clause;
    } else {
      acc = next;
    }
  }
  if (acc) pushWordBounded(acc);

  return chunks.filter((c) => c.trim().length > 0);
}

