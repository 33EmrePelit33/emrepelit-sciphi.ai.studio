import { Article, LanguageCode, SimulationType } from '../types';
import { getLocalizedArray, getLocalizedText } from '../i18n/translations';
import { estimateSpeechDurationSec } from './culturalVoiceEngine';

export const EXPLAINER_VIDEO_DURATION_SEC = 0; // Deprecated fixed cap — duration now adapts dynamically to full summary narration

export type EntityInteractionMode =
  | 'INTRO_GATHER'
  | 'CONTEXT_CONTRAST'
  | 'FIRST_CONTACT'
  | 'EQUATION_COUPLE'
  | 'DEEP_FLOW'
  | 'THRESHOLD_SHIFT'
  | 'EVIDENCE_PROOF'
  | 'EPISTEMIC_LINK'
  | 'HOLISTIC_SYNTHESIS'
  | 'OPEN_INQUIRY';

export interface TranslatedArticleContent {
  title: string;
  subtitle?: string;
  abstract: string;
  keyFindings: string[];
  contentParagraphs: string[];
  methodologyNote?: string;
}

export interface ExplainerVideoScene {
  index: number;
  startSec: number;
  endSec: number;
  estimatedDurationSec: number;
  heading: string;
  caption: string;
  narrationText: string;
  narrationSentences: string[];
  keyEquation: string;
  bulletPoints: string[];
  visualTheme: SimulationType;
  showAuthorPortrait: boolean;
  isConclusionScene?: boolean;
  entityRoleTag: string;
  entityStoryBeat: string;
  interactionMode: EntityInteractionMode;
  conceptChips: string[];
}

export interface ArticleComprehensiveVideoBundle {
  language: LanguageCode;
  articleTitle: string;
  articleSubtitle: string;
  fullComprehensiveSummaryText: string;
  totalEstimatedDurationSec: number;
  totalSentences: number;
  totalWords: number;
  scenes: ExplainerVideoScene[];
}

export interface ArticleQuizQuestion {
  id: string;
  questionType: 'KEY_FINDING' | 'MODEL_MECHANISM' | 'CONCEPTUAL_SYNTHESIS' | 'CRITICAL_INQUIRY';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  freedomNote: string;
}

export interface LearningUiStrings {
  videoBadge: string;
  videoTitlePrefix: string;
  playBtn: string;
  pauseBtn: string;
  restartBtn: string;
  voiceOnBtn: string;
  voiceOffBtn: string;
  scriptToggleBtn: string;
  exportWebmBtn: string;
  stopRecordingBtn: string;
  recordingBtn: string;
  legalAndFreedomNote: string;
  videoLangLabel: string;
  culturalNarratorLabel: string;
  durationAutoBadge: string;
  translatingBadge: string;
  voiceSelectLabel: string;
  quizTitlePrefix: string;
  quizSubtitle: string;
  questionLabel: string;
  scoreLabel: string;
  nextQuestionBtn: string;
  resetQuizBtn: string;
  correctBadge: string;
  reviewBadge: string;
  freedomQuizNote: string;
  completedBanner: string;
  openViewBtn: string;
}

const LEARNING_UI_12_LANGS: Record<LanguageCode, LearningUiStrings> = {
  tr: {
    videoBadge: 'HTML5 GENİŞ ÖZET SENTETİK SESLİ VİDEO · 12 DİL · SÜRE SINIRSIZ',
    videoTitlePrefix: 'Geniş Özetli Sentetik Sesli Video (12 Dil)',
    playBtn: 'Özeti Sesli Oynat',
    pauseBtn: 'Duraklat',
    restartBtn: 'Başa Sar',
    voiceOnBtn: 'Sesli Anlatım Açık',
    voiceOffBtn: 'Ses Kapalı',
    scriptToggleBtn: 'Geniş Özet & Canlı Metin',
    exportWebmBtn: 'Sesli Video Kaydet (.webm)',
    stopRecordingBtn: 'Kaydı Bitir & İndir',
    recordingBtn: 'Kaydediliyor…',
    legalAndFreedomNote:
      'Yasal Sorumluluk Reddi & Sentetik Ses Bildirimi: Bu video sabit süre kısıtı olmadan makalenin geniş özetini tamamen yapay/sentetik kültürel ses profilleriyle (gerçek kişi sesi veya taklidi içermez) kullanıcı tonlama tercihine göre okur; yalnızca bilimsel-felsefi eğitim ve kavrama amaçlıdır, hukuki/tıbbi/mali tavsiye niteliği taşımaz, üçüncü taraf hak ihlali veya kanuni mükellefiyet doğurmaz ve düşünce hürriyetini tam olarak korur.',
    videoLangLabel: 'Video & Ses Dili',
    culturalNarratorLabel: 'Sentetik Kültürel Ses',
    durationAutoBadge: 'Konuşmacı Bitiş Süresi',
    translatingBadge: 'Geniş özet seçili dile çevriliyor…',
    voiceSelectLabel: 'Cihaz Sesi',
    quizTitlePrefix: 'Etkileşimli Makale Testi',
    quizSubtitle: 'Makale genelinden çıkan bütüncül sonuçlarla uyumlu profesyonel çoktan seçmeli öz-değerlendirme',
    questionLabel: 'Soru',
    scoreLabel: 'Doğru',
    nextQuestionBtn: 'Sonraki Soru →',
    resetQuizBtn: 'Testi Yeniden Başlat',
    correctBadge: '✓ Doğru Yanıt — Makalenin Genel Sonucu ile Örtüşüyor',
    reviewBadge: '○ Analitik Açıklama — Kavramsal Değerlendirme',
    freedomQuizNote:
      'Not: Bu çoktan seçmeli sorular yalnızca kendi hızınızda kavrama amaçlıdır; hiçbir hukuki yükümlülük veya ideolojik dayatma içermez ve düşünce hürriyetini tam olarak korur.',
    completedBanner: 'Tebrikler! Makalenin genel sonucuna dayalı testi tamamladınız.',
    openViewBtn: 'Geniş Özet Video & Testi Aç',
  },
  en: {
    videoBadge: 'HTML5 SYNTHETIC COMPREHENSIVE SUMMARY VIDEO · 12 LANGUAGES · UNRESTRICTED',
    videoTitlePrefix: 'Comprehensive Summary Video (12 Languages)',
    playBtn: 'Play Narrated Summary',
    pauseBtn: 'Pause',
    restartBtn: 'Restart',
    voiceOnBtn: 'Narration On',
    voiceOffBtn: 'Muted',
    scriptToggleBtn: 'Full Summary & Live Script',
    exportWebmBtn: 'Save Audio Video (.webm)',
    stopRecordingBtn: 'Finish & Save Video',
    recordingBtn: 'Recording…',
    legalAndFreedomNote:
      'Zero Legal Liability & Synthetic Voice Notice: This educational video narrates the full summary using purely synthetic cultural acoustic profiles (no real person’s voice or likeness) with user-controlled intonation and finishes naturally with the narration; provided strictly for scientific and philosophical learning—not legal, medical, or financial advice—with zero third-party rights infringement and full respect for freedom of thought.',
    videoLangLabel: 'Video & Voice Language',
    culturalNarratorLabel: 'Synthetic Cultural Voice',
    durationAutoBadge: 'Speaker-Synced Duration',
    translatingBadge: 'Translating comprehensive summary…',
    voiceSelectLabel: 'Device Voice',
    quizTitlePrefix: 'Interactive Article Quiz',
    quizSubtitle: 'Professional multiple-choice assessment aligned with the article’s overall conclusion',
    questionLabel: 'Question',
    scoreLabel: 'Correct',
    nextQuestionBtn: 'Next Question →',
    resetQuizBtn: 'Restart Quiz',
    correctBadge: '✓ Verified Understanding — Aligns with Overall Article Conclusion',
    reviewBadge: '○ Analytical Review — Conceptual Distinction',
    freedomQuizNote:
      'These interactive questions exist solely for self-paced educational engagement, carry zero legal obligation, and respect freedom of thought.',
    completedBanner: 'Well done! You completed this article’s comprehensive quiz.',
    openViewBtn: 'Open Summary Video & Quiz',
  },
  es: {
    videoBadge: 'VIDEO HTML5 RESUMEN AMPLIADO Y VOZ CULTURAL SINTÉTICA · 12 IDIOMAS',
    videoTitlePrefix: 'Video Resumen Ampliado (12 Idiomas)',
    playBtn: 'Reproducir Resumen Narrado',
    pauseBtn: 'Pausar',
    restartBtn: 'Reiniciar',
    voiceOnBtn: 'Narración Activa',
    voiceOffBtn: 'Silenciado',
    scriptToggleBtn: 'Resumen Amplio y Guion',
    exportWebmBtn: 'Guardar con Audio (.webm)',
    stopRecordingBtn: 'Finalizar y Guardar',
    recordingBtn: 'Grabando…',
    legalAndFreedomNote:
      'Aviso de Cero Obligación Legal y Voz Sintética: Este video educativo utiliza únicamente voces culturales sintéticas (sin personas reales) con entonación controlada por el usuario; tiene fines estrictamente divulgativos y no constituye asesoramiento legal, médico ni financiero, respetando plenamente la libertad de pensamiento.',
    videoLangLabel: 'Idioma de Video y Voz',
    culturalNarratorLabel: 'Voz Cultural Sintética',
    durationAutoBadge: 'Duración del Narrador',
    translatingBadge: 'Traduciendo resumen ampliado…',
    voiceSelectLabel: 'Voz del Sistema',
    quizTitlePrefix: 'Cuestionario Interactivo del Artículo',
    quizSubtitle: 'Preguntas de opción múltiple alineadas con la conclusión general del artículo',
    questionLabel: 'Pregunta',
    scoreLabel: 'Aciertos',
    nextQuestionBtn: 'Siguiente →',
    resetQuizBtn: 'Reiniciar Test',
    correctBadge: '✓ Respuesta Correcta — Coincide con la Conclusión',
    reviewBadge: '○ Revisión Analítica',
    freedomQuizNote:
      'Preguntas exclusivamente educativas sin obligaciones legales, respetando plenamente la libertad de pensamiento.',
    completedBanner: '¡Completaste la evaluación integral del artículo!',
    openViewBtn: 'Abrir Video Resumen y Test',
  },
  de: {
    videoBadge: 'HTML5-VIDEO GESAMTZUSAMMENFASSUNG & SYNTHETISCHE KULTURSTIMME · 12 SPRACHEN',
    videoTitlePrefix: 'Video-Gesamtzusammenfassung (12 Sprachen)',
    playBtn: 'Zusammenfassung Abspielen',
    pauseBtn: 'Pause',
    restartBtn: 'Neustart',
    voiceOnBtn: 'Sprache An',
    voiceOffBtn: 'Stumm',
    scriptToggleBtn: 'Gesamtzusammenfassung & Text',
    exportWebmBtn: 'Mit Ton Speichern (.webm)',
    stopRecordingBtn: 'Aufnahme Beenden',
    recordingBtn: 'Aufnahme…',
    legalAndFreedomNote:
      'Haftungsausschluss & Synthetische Stimme: Dieses Lernvideo nutzt rein synthetische kulturelle Stimmprofile (keine realen Personen) mit frei wählbarer Intonation; es dient ausschließlich der wissenschaftlichen Bildung, stellt keine Rechts- oder Fachberatung dar, begründet keinerlei rechtliche Verpflichtung und wahrt uneingeschränkte Gedankenfreiheit.',
    videoLangLabel: 'Video- & Sprachwahl',
    culturalNarratorLabel: 'Synthetische Kulturstimme',
    durationAutoBadge: 'Sprecherdauer',
    translatingBadge: 'Übersetze Zusammenfassung…',
    voiceSelectLabel: 'Systemstimme',
    quizTitlePrefix: 'Interaktiver Artikel-Test',
    quizSubtitle: 'Multiple-Choice-Fragen abgestimmt auf das Gesamtergebnis des Artikels',
    questionLabel: 'Frage',
    scoreLabel: 'Richtig',
    nextQuestionBtn: 'Nächste Frage →',
    resetQuizBtn: 'Test Zurücksetzen',
    correctBadge: '✓ Korrekt — Stimmt mit der Gesamtaussage überein',
    reviewBadge: '○ Analytische Erläuterung',
    freedomQuizNote:
      'Ausschließlich zur unverbindlichen Selbstprüfung erstellt; wahrt uneingeschränkte Gedankenfreiheit.',
    completedBanner: 'Sie haben den Wissenstest zu diesem Artikel abgeschlossen.',
    openViewBtn: 'Video-Zusammenfassung & Test',
  },
  fr: {
    videoBadge: 'VIDÉO HTML5 RÉSUMÉ APPROFONDI & VOIX CULTURELLE SYNTHÉTIQUE · 12 LANGUES',
    videoTitlePrefix: 'Vidéo Résumé Approfondi (12 Langues)',
    playBtn: 'Lire le Résumé Narré',
    pauseBtn: 'Pause',
    restartBtn: 'Recommencer',
    voiceOnBtn: 'Voix Active',
    voiceOffBtn: 'Muet',
    scriptToggleBtn: 'Résumé Complet & Texte',
    exportWebmBtn: 'Enregistrer Audio (.webm)',
    stopRecordingBtn: 'Terminer et Sauvegarder',
    recordingBtn: 'Enregistrement…',
    legalAndFreedomNote:
      'Clause de Non-Responsabilité & Voix Synthétique : Cette vidéo éducative utilise exclusivement des profils vocaux culturels synthétiques (aucune personne réelle) avec intonation réglable par l’utilisateur ; strictement à but pédagogique, sans conseil juridique ou médical, sans obligation légale et dans le plein respect de la liberté de pensée.',
    videoLangLabel: 'Langue Vidéo & Voix',
    culturalNarratorLabel: 'Voix Culturelle Synthétique',
    durationAutoBadge: 'Durée du Narrateur',
    translatingBadge: 'Traduction du résumé…',
    voiceSelectLabel: 'Voix Système',
    quizTitlePrefix: 'Quiz Interactif de l’Article',
    quizSubtitle: 'Questionnaire à choix multiples aligné sur la conclusion générale de l’article',
    questionLabel: 'Question',
    scoreLabel: 'Correct',
    nextQuestionBtn: 'Suivant →',
    resetQuizBtn: 'Réinitialiser',
    correctBadge: '✓ Réponse Validée',
    reviewBadge: '○ Analyse Conceptuelle',
    freedomQuizNote:
      'Ce quiz sert uniquement à l’apprentissage libre sans obligation légale et respecte pleinement la liberté de pensée.',
    completedBanner: 'Bravo ! Vous avez terminé le quiz de cet article.',
    openViewBtn: 'Ouvrir Vidéo Résumé & Quiz',
  },
  ru: {
    videoBadge: 'HTML5-ВИДЕО С ПОДРОБНЫМ РЕЗЮМЕ И СИНТЕТИЧЕСКИМ ГОЛОСОМ · 12 ЯЗЫКОВ',
    videoTitlePrefix: 'Видео-резюме статьи (12 языков)',
    playBtn: 'Слушать и смотреть резюме',
    pauseBtn: 'Пауза',
    restartBtn: 'Сначала',
    voiceOnBtn: 'Озвучка Вкл',
    voiceOffBtn: 'Без звука',
    scriptToggleBtn: 'Полное резюме и текст',
    exportWebmBtn: 'Сохранить со звуком (.webm)',
    stopRecordingBtn: 'Завершить запись',
    recordingBtn: 'Запись…',
    legalAndFreedomNote:
      'Отказ от юридической ответственности и синтез речи: видео использует полностью синтетические культурные голосовые профили (не реальных людей) с настройкой интонации пользователем; предназначено исключительно для образовательных целей, не является юридической или иной профессиональной консультацией и не создаёт правовых обязательств.',
    videoLangLabel: 'Язык видео и озвучки',
    culturalNarratorLabel: 'Синтетический голос',
    durationAutoBadge: 'По времени озвучки',
    translatingBadge: 'Перевод подробного резюме…',
    voiceSelectLabel: 'Системный голос',
    quizTitlePrefix: 'Интерактивный Тест по Статье',
    quizSubtitle: 'Вопросы с выбором ответа на основе общего вывода статьи',
    questionLabel: 'Вопрос',
    scoreLabel: 'Верно',
    nextQuestionBtn: 'Далее →',
    resetQuizBtn: 'Начать заново',
    correctBadge: '✓ Верно — Соответствует общему выводу статьи',
    reviewBadge: '○ Аналитическое пояснение',
    freedomQuizNote:
      'Тест создан исключительно для добровольного обучения без юридических обязательств и с уважением свободы мысли.',
    completedBanner: 'Вы успешно завершили проверку знаний по статье.',
    openViewBtn: 'Открыть Видео-резюме и Тест',
  },
  ar: {
    videoBadge: 'فيديو HTML5 للملخص الشامل بصوت ثقافي اصطناعي · 12 لغة · بلا حد زمني',
    videoTitlePrefix: 'فيديو الملخص الشامل المسموع (12 لغة)',
    playBtn: 'تشغيل الملخص بالصوت',
    pauseBtn: 'إيقاف مؤقت',
    restartBtn: 'إعادة',
    voiceOnBtn: 'السرد الصوتي مفعّل',
    voiceOffBtn: 'صامت',
    scriptToggleBtn: 'الملخص الشامل والنص الحي',
    exportWebmBtn: 'حفظ فيديو بالصوت (.webm)',
    stopRecordingBtn: 'إنهاء وحفظ الفيديو',
    recordingBtn: 'جارٍ التسجيل…',
    legalAndFreedomNote:
      'إخلاء مسؤولية وإشعار صوت اصطناعي: يستخدم هذا الفيديو التعليمي ملفات صوتية ثقافية اصطناعية بالكامل (لا تحاكي أي شخص حقيقي) مع تحكم كامل للمستخدم في التنغيم؛ المحتوى للتثقيف العلمي والفلسفي فقط ولا يعد استشارة قانونية أو مهنية ولا يرتب أي التزام قانوني مع احترام تام لحرية الفكر.',
    videoLangLabel: 'لغة الفيديو والصوت',
    culturalNarratorLabel: 'صوت ثقافي اصطناعي',
    durationAutoBadge: 'مدة إنهاء السرد',
    translatingBadge: 'جارٍ ترجمة الملخص الشامل…',
    voiceSelectLabel: 'صوت النظام',
    quizTitlePrefix: 'اختبار تفاعلي للمقال',
    quizSubtitle: 'أسئلة اختيار من متعدد متوافقة مع الاستنتاج العام للمقال',
    questionLabel: 'سؤال',
    scoreLabel: 'صحيح',
    nextQuestionBtn: 'السؤال التالي ←',
    resetQuizBtn: 'إعادة الاختبار',
    correctBadge: '✓ إجابة صحيحة — متوافقة مع خلاصة المقال',
    reviewBadge: '○ توضيح تحليلي',
    freedomQuizNote:
      'هذه الأسئلة للتعلم الذاتي فقط دون أي التزام قانوني ومع الاحترام الكامل لحرية الفكر.',
    completedBanner: 'أحسنت! لقد أكملت اختبار الفهم لهذا المقال.',
    openViewBtn: 'فتح فيديو الملخص والاختبار',
  },
  zh: {
    videoBadge: 'HTML5 深度摘要纯合成文化语音视频 · 12语种 · 随讲者完播计时',
    videoTitlePrefix: '深度摘要合成语音视频 (12语种)',
    playBtn: '播放完整摘要语音',
    pauseBtn: '暂停',
    restartBtn: '重播',
    voiceOnBtn: '语音开启',
    voiceOffBtn: '静音',
    scriptToggleBtn: '完整摘要与实时文稿',
    exportWebmBtn: '导出有声视频 (.webm)',
    stopRecordingBtn: '完成并保存',
    recordingBtn: '录制中…',
    legalAndFreedomNote:
      '免责声明与合成语音说明：本视频采用纯合成文化声学配置（不模仿任何真实人物），语调与语速完全由用户自主调节；仅作科学哲学普及学习之用，不构成法律、医疗或金融建议，不产生任何法律责任，并充分尊重思想自由。',
    videoLangLabel: '视频与配音语言',
    culturalNarratorLabel: '合成文化声线',
    durationAutoBadge: '按完播时长同步',
    translatingBadge: '正在翻译完整摘要…',
    voiceSelectLabel: '系统语音',
    quizTitlePrefix: '文章互动测验',
    quizSubtitle: '与全文核心结论相契合的专业多项选择题评估',
    questionLabel: '问题',
    scoreLabel: '正确',
    nextQuestionBtn: '下一题 →',
    resetQuizBtn: '重新测试',
    correctBadge: '✓ 回答正确 — 与全文结论一致',
    reviewBadge: '○ 概念解析',
    freedomQuizNote: '测验仅用于互动学习，无任何法律约束，充分尊重自由思考。',
    completedBanner: '恭喜！您已完成本篇文章的互动测验。',
    openViewBtn: '打开摘要视频与测验',
  },
  ja: {
    videoBadge: 'HTML5 論文詳細要約・純合成カルチャー音声動画 · 12言語',
    videoTitlePrefix: '詳細要約合成音声動画 (12言語)',
    playBtn: '要約ナレーションを再生',
    pauseBtn: '一時停止',
    restartBtn: '最初から',
    voiceOnBtn: '音声オン',
    voiceOffBtn: 'ミュート',
    scriptToggleBtn: '詳細要約・字幕スクリプト',
    exportWebmBtn: '音声付動画を保存 (.webm)',
    stopRecordingBtn: '録画完了・保存',
    recordingBtn: '録画中…',
    legalAndFreedomNote:
      '免責事項および合成音声の表示：本動画は実在の人物を模倣しない純粋な合成カルチャー音声を使用し、抑揚や速度は利用者が自由に設定できます。純粋な学術・哲学の理解支援を目的としており、法的・専門的助言ではなく、法的義務や権利侵害は一切生じません。',
    videoLangLabel: '動画・音声言語',
    culturalNarratorLabel: '合成カルチャー音声',
    durationAutoBadge: '朗読完了に自動同期',
    translatingBadge: '詳細要約を翻訳中…',
    voiceSelectLabel: 'システム音声',
    quizTitlePrefix: 'インタラクティブ理解度テスト',
    quizSubtitle: '論文全体の結論と整合する専門的な多肢選択問題',
    questionLabel: '問題',
    scoreLabel: '正解',
    nextQuestionBtn: '次の問題 →',
    resetQuizBtn: 'やり直す',
    correctBadge: '✓ 正解 — 記事全体の結論と一致',
    reviewBadge: '○ 分析的解説',
    freedomQuizNote: '自由な思考と探究を尊重し、法的義務のない純粋な学習支援を目的としています。',
    completedBanner: 'この記事の確認テストを完了しました。',
    openViewBtn: '詳細要約動画とテストを開く',
  },
  pt: {
    videoBadge: 'VÍDEO HTML5 RESUMO ABRANGENTE E VOZ CULTURAL SINTÉTICA · 12 IDIOMAS',
    videoTitlePrefix: 'Vídeo Resumo Abrangente (12 Idiomas)',
    playBtn: 'Reproduzir Resumo Narrado',
    pauseBtn: 'Pausar',
    restartBtn: 'Reiniciar',
    voiceOnBtn: 'Voz Ativa',
    voiceOffBtn: 'Mudo',
    scriptToggleBtn: 'Resumo Completo e Roteiro',
    exportWebmBtn: 'Salvar com Áudio (.webm)',
    stopRecordingBtn: 'Concluir e Salvar',
    recordingBtn: 'Gravando…',
    legalAndFreedomNote:
      'Isenção de Obrigação Legal e Voz Sintética: Este vídeo educativo utiliza apenas perfis vocais culturais sintéticos (sem pessoas reais) com entonação escolhida pelo usuário; destina-se exclusivamente ao estudo científico-filosófico, não constitui aconselhamento jurídico ou profissional e não gera obrigação legal.',
    videoLangLabel: 'Idioma do Vídeo e Voz',
    culturalNarratorLabel: 'Voz Cultural Sintética',
    durationAutoBadge: 'Duração do Narrador',
    translatingBadge: 'Traduzindo resumo completo…',
    voiceSelectLabel: 'Voz do Sistema',
    quizTitlePrefix: 'Quiz Interativo do Artigo',
    quizSubtitle: 'Questões de múltipla escolha alinhadas à conclusão geral do artigo',
    questionLabel: 'Pergunta',
    scoreLabel: 'Acertos',
    nextQuestionBtn: 'Próxima →',
    resetQuizBtn: 'Reiniciar Quiz',
    correctBadge: '✓ Resposta Correta — Alinhada à Conclusão',
    reviewBadge: '○ Nota Analítica',
    freedomQuizNote:
      'Perguntas criadas apenas para interação educativa sem obrigações legais, preservando a liberdade de pensamento.',
    completedBanner: 'Parabéns! Você concluiu o quiz deste artigo.',
    openViewBtn: 'Abrir Vídeo Resumo e Quiz',
  },
  it: {
    videoBadge: 'VIDEO HTML5 SINTESI COMPLETA E VOCE CULTURALE SINTETICA · 12 LINGUE',
    videoTitlePrefix: 'Video Sintesi Completa (12 Lingue)',
    playBtn: 'Riproduci Sintesi Narrata',
    pauseBtn: 'Pausa',
    restartBtn: 'Ricomincia',
    voiceOnBtn: 'Voce Attiva',
    voiceOffBtn: 'Muto',
    scriptToggleBtn: 'Sintesi Estesa e Testo',
    exportWebmBtn: 'Salva con Audio (.webm)',
    stopRecordingBtn: 'Completa e Salva',
    recordingBtn: 'Registrazione…',
    legalAndFreedomNote:
      'Esclusione di Responsabilità e Voce Sintetica: Questo video utilizza esclusivamente profili vocali culturali sintetici (nessuna persona reale) con intonazione controllata dall’utente; ha finalità puramente didattiche, non costituisce consulenza legale o professionale e non comporta alcun obbligo giuridico.',
    videoLangLabel: 'Lingua Video e Voce',
    culturalNarratorLabel: 'Voce Culturale Sintetica',
    durationAutoBadge: 'Durata della Narrazione',
    translatingBadge: 'Traduzione della sintesi…',
    voiceSelectLabel: 'Voce di Sistema',
    quizTitlePrefix: 'Quiz Interattivo dell’Articolo',
    quizSubtitle: 'Domande a scelta multipla coerenti con la conclusione generale dell’articolo',
    questionLabel: 'Domanda',
    scoreLabel: 'Corrette',
    nextQuestionBtn: 'Prossima →',
    resetQuizBtn: 'Ricomincia Quiz',
    correctBadge: '✓ Risposta Corretta — Coerente con la Conclusione',
    reviewBadge: '○ Analisi Concettuale',
    freedomQuizNote:
      'Domande create solo per l’apprendimento libero senza obblighi legali, nel pieno rispetto della libertà di pensiero.',
    completedBanner: 'Ottimo! Hai completato il quiz di questo articolo.',
    openViewBtn: 'Apri Video Sintesi e Quiz',
  },
  ko: {
    videoBadge: 'HTML5 심층 요약 순수 합성 문화 음성 영상 · 12개 언어',
    videoTitlePrefix: '심층 요약 합성 음성 영상 (12개 언어)',
    playBtn: '심층 요약 음성 재생',
    pauseBtn: '일시정지',
    restartBtn: '처음부터',
    voiceOnBtn: '음성 켜짐',
    voiceOffBtn: '음소거',
    scriptToggleBtn: '전체 심층 요약 및 자막',
    exportWebmBtn: '음성 포함 저장 (.webm)',
    stopRecordingBtn: '녹화 완료 및 저장',
    recordingBtn: '녹화 중…',
    legalAndFreedomNote:
      '법적 면책 및 합성 음성 안내: 본 교육 영상은 실존 인물을 모방하지 않는 순수 합성 문화 음성을 사용하며 억양과 속도는 사용자가 직접 조절합니다. 과학·철학 이해를 돕기 위한 순수 교육 목적이며 법률·의료·재무 자문이 아니므로 어떠한 법적 의무도 발생시키지 않습니다.',
    videoLangLabel: '영상 및 음성 언어',
    culturalNarratorLabel: '합성 문화 음성',
    durationAutoBadge: '낭독 완료 시간 기준',
    translatingBadge: '심층 요약을 번역하는 중…',
    voiceSelectLabel: '시스템 음성',
    quizTitlePrefix: '인터랙티브 이해도 퀴즈',
    quizSubtitle: '논문 전체 결론과 부합하는 전문 객관식 이해도 점검',
    questionLabel: '문제',
    scoreLabel: '정답',
    nextQuestionBtn: '다음 문제 →',
    resetQuizBtn: '다시 풀기',
    correctBadge: '✓ 정답입니다 — 전체 결론과 일치',
    reviewBadge: '○ 분석적 해설',
    freedomQuizNote:
      '법적 의무 없는 순수 학습용 질문이며 독자의 사상과 탐구의 자유를 존중합니다.',
    completedBanner: '이 글의 종합 이해도 퀴즈를 완료했습니다.',
    openViewBtn: '심층 요약 영상 및 퀴즈 열기',
  },
};

export function getLearningUiStrings(lang: LanguageCode): LearningUiStrings {
  return LEARNING_UI_12_LANGS[lang] || LEARNING_UI_12_LANGS.en;
}

function deterministicHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rotateOptionsDeterministically(
  correctOption: string,
  distractors: string[],
  seedStr: string
): { options: string[]; correctIndex: number } {
  const pool = [correctOption, ...distractors.slice(0, 3)];
  const h = deterministicHash(seedStr);
  const shift = h % pool.length;
  const rotated = pool.map((_, i) => pool[(i + shift) % pool.length]);
  const correctIndex = rotated.indexOf(correctOption);
  return { options: rotated, correctIndex: Math.max(0, correctIndex) };
}

function cleanSentence(text: string): string {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function protectNonSentenceDots(text: string): string {
  const DOT_TOKEN = '\uE000';
  return text
    // Protect decimal numbers (e.g. 3.14, 10.5281)
    .replace(/(\d)\.(\d)/g, `$1${DOT_TOKEN}$2`)
    // Protect alphanumeric figure/version/domain dots and Unicode abbreviations (e.g. FIG. BLG.316, ör., doç., v2.1, ai.studio)
    .replace(/(^|[\s([{"'“«])(FIG|BLG|NO|DR|PROF|DOÇ|YRD|VB|VS|ÖR|BKZ|DK|SN|ST|YY|E\.G|I\.E|ETC|MR|MRS|MS|VOL|CH)\./gi, `$1$2${DOT_TOKEN}`)
    .replace(/([A-Za-z0-9])\.([A-Za-z0-9])/g, `$1${DOT_TOKEN}$2`);
}

function restoreNonSentenceDots(text: string): string {
  return text.replace(/\uE000/g, '.');
}

export function splitNarrationSentences(text: string): string[] {
  const cleaned = cleanSentence(text);
  if (!cleaned) return [];

  const protectedText = protectNonSentenceDots(cleaned);
  const rawMatches = protectedText.match(/[^.!?。！？؟]+[.!?。！？؟]+|[^.!?。！？؟]+$/g);
  const segments = (rawMatches || [protectedText])
    .map((s) => restoreNonSentenceDots(s).trim())
    .filter((s) => s.length > 0 && /[0-9A-Za-zÀ-ÿğĞıİöÖüÜşŞçÇ\u0400-\u04FF\u0600-\u06FF\u3040-\u9FFF\uAC00-\uD7AF]/.test(s));

  // Ensure no individual sentence exceeds ~165 characters so Chrome/Edge/Safari speechSynthesis never truncates
  const bounded: string[] = [];
  const pushBounded = (seg: string) => {
    if (seg.length <= 165) {
      bounded.push(seg);
      return;
    }
    const clauses = seg.split(/(?<=[,;،、；:])\s+/);
    let acc = '';
    for (const c of clauses) {
      if (c.length > 165) {
        if (acc.trim()) {
          bounded.push(acc.trim());
          acc = '';
        }
        // Hard word-boundary split for long unpunctuated clauses
        const words = c.split(/\s+/).filter(Boolean);
        let wAcc = '';
        for (const w of words) {
          const test = wAcc ? `${wAcc} ${w}` : w;
          if (test.length > 155 && wAcc) {
            bounded.push(wAcc.trim());
            wAcc = w;
          } else {
            wAcc = test;
          }
        }
        if (wAcc.trim()) bounded.push(wAcc.trim());
        continue;
      }
      if (acc && acc.length + c.length + 1 > 160) {
        bounded.push(acc.trim());
        acc = c;
      } else {
        acc = acc ? `${acc} ${c}` : c;
      }
    }
    if (acc.trim()) bounded.push(acc.trim());
  };

  for (const seg of segments) {
    pushBounded(seg);
  }
  return bounded;
}

function splitCleanSentences(text: string): string[] {
  const protectedText = protectNonSentenceDots(cleanSentence(text));
  return protectedText
    .split(/(?<=[.!?。！？؟])\s+/)
    .map((s) => restoreNonSentenceDots(s).trim())
    .filter((s) => s.length > 18);
}

function shortenClause(text: string, maxLen = 148): string {
  const clean = cleanSentence(text);
  if (!clean) return '';
  if (clean.length <= maxLen) return clean;
  const sentences = splitCleanSentences(clean);
  if (sentences.length > 0 && sentences[0].length <= maxLen && sentences[0].length >= 36) {
    return sentences[0];
  }
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const trimmed = (lastSpace > 48 ? sliced.slice(0, lastSpace) : sliced)
    .replace(/[,:;—–-]+$/, '')
    .trim();
  return `${trimmed}.`;
}

const CONCEPT_STOP_WORDS = new Set([
  've', 'veya', 'ile', 'için', 'gibi', 'olarak', 'olan', 'olduğu', 'ancak', 'fakat', 'çünkü',
  'bir', 'bu', 'şu', 'daha', 'çok', 'en', 'kadar', 'üzerine', 'üzerinde', 'hakkında', 'içinde',
  'nasıl', 'neden', 'nedir', 'mi', 'mı', 'mu', 'mü', 'ise', 'de', 'da', 'ki', 'her', 'tüm',
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'about', 'what', 'when', 'where',
  'which', 'their', 'there', 'they', 'have', 'been', 'will', 'would', 'could', 'should', 'does',
  'are', 'was', 'were', 'not', 'but', 'our', 'can', 'all', 'its', 'more', 'most', 'only',
]);

function extractArticleConceptChips(
  sourceText: string,
  fallbackLabels: string[],
  maxChips = 3
): string[] {
  const words = cleanSentence(sourceText)
    .replace(/[.,;:!?()[\]"'«»“”‘’—–-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !CONCEPT_STOP_WORDS.has(w.toLowerCase()) && !/^\d+$/.test(w));

  const picked: string[] = [];
  const seen = new Set<string>();
  for (const w of words) {
    const key = w.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      picked.push(w.length > 16 ? `${w.slice(0, 15)}…` : w);
    }
    if (picked.length >= maxChips) break;
  }
  for (const fb of fallbackLabels) {
    if (picked.length >= maxChips) break;
    if (!seen.has(fb.toLowerCase())) {
      seen.add(fb.toLowerCase());
      picked.push(fb);
    }
  }
  return picked.slice(0, maxChips);
}

interface SummaryLocalePack {
  headings: [string, string, string, string, string, string, string, string];
  introLead: (title: string, category: string) => string;
  problemLead: string;
  mechanismLead: string;
  modelLead: (simTitle: string, paramSummary: string) => string;
  deepLead: string;
  findingsLead: string;
  conclusionLead: string;
  closingText: string;
  closingBullets: [string, string];
  domainRoles: Record<SimulationType, string>;
  domainSummary: Record<SimulationType, string>;
  domainFallbacks: Record<SimulationType, [string, string, string]>;
  domainBeats: Record<SimulationType, [string, string, string, string, string, string, string, string]>;
}

const SUMMARY_LOCALE_PACKS: Record<LanguageCode, SummaryLocalePack> = {
  tr: {
    headings: [
      '1. Giriş, Temel Tez & Kapsamlı Çerçeve',
      '2. Kavramsal Zemin & Problem Kurulumu',
      '3. Hareketli Varlıkların Etkileşim Mekaniği',
      '4. Matematiksel & Kuramsal Model Analizi',
      '5. Derin Analiz & Nedensel Süreç Akışı',
      '6. Temel Bilimsel & Felsefi Bulgular',
      '7. Makalenin Bütüncül Sonucu & Sentezi',
      '8. Eleştirel Sorgulama & Özgür Düşünce Kapanışı',
    ],
    introLead: (title, category) =>
      `Emre Pelit tarafından ${category} alanında kaleme alınan "${title}" başlıklı makalenin geniş özetine hoş geldiniz.`,
    problemLead: 'Makalenin kavramsal zemini ve temel problem kurulumu şu argümanlarla şekillenir:',
    mechanismLead: 'İncelenen mekanizma ve kavramlar arasındaki etkileşim şu süreç üzerinden açıklanır:',
    modelLead: (simTitle, paramSummary) =>
      `Kuramsal ve matematiksel model "${simTitle}" çerçevesinde ele alınır. Temel parametreler: ${paramSummary}.`,
    deepLead: 'Makalenin derin analiz katmanında yer alan nedensel akış ve ara çıkarımlar şunlardır:',
    findingsLead: 'Çalışmadan elde edilen temel bilimsel ve felsefi bulgular bir bütün olarak şöyle özetlenir:',
    conclusionLead: 'Tüm argümanlar bir araya getirildiğinde makalenin ulaştığı bütüncül sonuç şudur:',
    closingText:
      'Bu geniş özet, makalenin ana düşüncelerini berrak biçimde kavramak için hazırlanmıştır. Sahnede gördüğünüz soyut varlıkları etkileşimli olarak sınayabilir, kendi eleştirel değerlendirmenizi özgürce geliştirebilirsiniz. Dinlediğiniz için teşekkür ederiz.',
    closingBullets: [
      'Konuşmacı Bitiş Süresine Senkron · Süre Kısıtı Yok',
      '12 Dilde Kültürel Seslendirme · Özgür Düşünceye Tam Saygı',
    ],
    domainRoles: {
      quantum: 'Dalga Paketleri ↔ Çift Yarık ↔ Gözlemci Ajanı',
      higgs: 'Skaler Alan Kuantaları ↔ Fermiyon & Bozon Gezginleri',
      holographic: 'Sınır Kübit Ajanları ↔ Hacim (Bulk) Geometri Çekirdeği',
      spacetime: 'Sabit Gözlemci (τ₀) ↔ Göreceli Gezgin (τ) ↔ Kütleçekim Kuyusu',
      consciousness: 'Geri Beslemeli Zihin Düğümleri ↔ Enformasyon Kıvılcımları (Φ)',
      chaos: 'İkiz Kaşif Varlıklar (A & B) ↔ Garip Çeker Yörüngesi',
      software: 'Veri Paketi Ajanları ↔ Doğrulama Modülleri ↔ Bilgi Merkezi',
    },
    domainSummary: {
      quantum: 'Dalga fonksiyonu süperpozisyonu, girişim saçakları ve gözlemci eşleşmesi dinamikleri',
      higgs: 'Skaler alan potansiyeli, kendiliğinden simetri kırılımı ve kütle kazanım mekanizması',
      holographic: 'Sınır-hacim (AdS/CFT) enformasyon projeksiyonu ve Bekenstein-Hawking entropi sınırı',
      spacetime: 'Minkowski ışık konisi geometrisi, Lorentz değişmezliği ve metrik bükülme analizi',
      consciousness: 'Bütünleşik enformasyon (Φ), öznel deneyim ve algoritmik hesaplanabilirlik ilişkisi',
      chaos: 'Doğrusal olmayan yörünge kararlılığı, başlangıç koşullarına hassasiyet ve garip çekerler',
      software: 'Modüler sistem mimarisi, veri kısıt doğrulaması ve gerçek zamanlı çıkarım akışı',
    },
    domainFallbacks: {
      quantum: ['Süperpozisyon', 'Gözlemci', 'Dekoherans'],
      higgs: ['Skaler Alan', 'Simetri Kırılımı', 'Kütle Kazanımı'],
      holographic: ['Sınır Yüzeyi', 'Enformasyon', 'Holografi'],
      spacetime: ['Öz-Zaman', 'Işık Konisi', 'Metrik Eğrilik'],
      consciousness: ['Bütünleşik Φ', 'Geri Bildirim', 'Farkındalık'],
      chaos: ['Başlangıç Farkı', 'Çatallanma', 'Garip Çeker'],
      software: ['Veri Akışı', 'Doğrulama', 'Sistem Mimarisi'],
    },
    domainBeats: {
      quantum: [
        'Kaynak yayıcıdan çıkan kuantum dalga paketleri makalenin temel sorusunu sahneye taşır.',
        'Klasik parçacık sezgisi ile dalga süperpozisyonu yan yana hareket ederek farkı görünür kılar.',
        'Dalga paketleri çift yarıktan geçerken birbirleriyle girişim saçakları örerek etkileşir.',
        'Denklem parametreleri dalga genliğini ve faz uyumunu canlı olarak şekillendirir.',
        'Gözlemci sensör ajanı yaklaştıkça dalga paketleriyle bilgi alışverişi ve dekoherans başlar.',
        'Ölçüm etkileşimi sonrası olasılık dalgaları dedektör ekranında tekil altın izlere odaklanır.',
        'Tüm dalga ve parçacık varlıkları makalenin bütüncül sonucunda tutarlı bir dengeye oturur.',
        'Sahneye tıklayarak veya simülatörü kullanarak kendi deneyinizi özgürce sürdürebilirsiniz.',
      ],
      higgs: [
        'Skaler alan kafesi titreşerek makalenin temel kütle ve simetri sorusunu canlandırır.',
        'Yüksek enerjili simetrik evrede kütlesiz parçacıklar alan içinde engelsiz biçimde süzülür.',
        'Fermiyon ve bozon varlıkları skaler alan düğümleriyle etkileşime geçerek enerji alışverişi yapar.',
        'Meksika şapkası potansiyeli ve denklem parametreleri vakum taban vadisini canlı şekillendirir.',
        'Alan kuantaları ağır parçacıkların çevresinde kümelenerek kütle (eylemsizlik) halesi oluşturur.',
        'Kütlesiz foton hızla ilerlerken kütle kazanan bozonun yavaşlaması temel bulguyu somutlaştırır.',
        'Alan ve parçacık varlıkları makalenin bütüncül sonucunu özetleyen kararlı vakum dengesine oturur.',
        'Eleştirel sorgulama için yeni hipotezler ve simülasyon testleri okura açık bırakılır.',
      ],
      holographic: [
        'Dış sınır halkasındaki enformasyon ajanları makalenin temel gerçeklik sorusunu aydınlatır.',
        'Üç boyutlu hacim algısı ile iki boyutlu sınır kodlaması arasındaki zıtlık görselleştirilir.',
        'Sınır kübitleri merkeze doğru ışık demetleri göndererek dolanıklık bağları kurar.',
        'Entropi ve yüzey alanı denklemi sınır düğümlerinin bilgi akış yoğunluğunu ölçekler.',
        'İçe projeksiyon ışınları merkezde etkileşerek uzay-zaman geometrisini adım adım örer.',
        'Olay ufku halkası boyunca korunan korelasyon yayları çalışmanın temel bulgularını kanıtlar.',
        'Sınır ve hacim varlıkları makalenin bütüncül sonucunu temsil eden tekil holografik ağda buluşur.',
        'Sahne etkileşimi ve kavrama sorularıyla kuantum kütleçekimi yorumlarını özgürce sorgulayın.',
      ],
      spacetime: [
        'İki saatli gözlemci varlığı uzay-zaman ızgarası üzerinde konumlanarak zamanın doğasını sorgular.',
        'Mutlak klasik saat beklentisi ile göreceli öz-zaman akışı yan yana karşılaştırılır.',
        'Göreceli gezgin hızlandıkça saat ibresi sabit gözlemciye göre gözle görülür biçimde yavaşlar.',
        'Lorentz faktörü ve metrik denklem parametreleri ışık konisi eğimini canlı olarak belirler.',
        'Merkezdeki kütleçekim kuyusu uzay-zaman ızgarasını büker ve geçen fotonların rotasını eğer.',
        'Nedensel ışık konisi içindeki dünya çizgisinin değişmez aralığı temel bulguları görünür kılar.',
        'Gözlemciler, fotonlar ve metrik eğriler makalenin bütüncül sonucunda uyumlu bir haritada birleşir.',
        'Kendi zaman ve nedensellik analizinizi sınamak için sahneyle ve testle etkileşime geçin.',
      ],
      consciousness: [
        'Ağ üzerindeki bilişsel düğümler uyanarak makalenin bilinç ve zihin sorusunu görünür kılar.',
        'Yalıtılmış doğrusal işlem zinciri ile karşılıklı etkileşen bütünleşik ağ yan yana kıyaslanır.',
        'Bilişsel ajanlar çift yönlü enformasyon kıvılcımları paylaşarak eşzamanlı döngüler kurar.',
        'Entegrasyon (Φ) denklemi ve parametreler ağın bağlantı yoğunluğunu canlı olarak yönlendirir.',
        'Geri bildirim halkaları güçlendikçe düğümler arasında altın renkli kolektif farkındalık alanı doğar.',
        'Eşzamanlı ateşleme dalgaları ve nedensel bağ okları temel bulguları somutlaştırır.',
        'Tüm zihinsel düğümler makalenin bütüncül sonucunu yansıtan bütünsel bir Φ halkasında kenetlenir.',
        'Dogmatik yargılardan uzak biçimde zihin felsefesi ve yapay zeka soruları özgür tartışmaya açılır.',
      ],
      chaos: [
        'Neredeyse aynı noktadan başlayan A ve B ikiz varlıkları makalenin kaos sorusunu açar.',
        'Doğrusal öngörü beklentisi ile doğrusal olmayan geri besleme dinamiği karşılaştırılır.',
        'İkiz varlıklar başlangıçta yan yana ilerlerken mikroskobik Δx₀ farkı büyümeye başlar.',
        'Lyapunov ve çekici denklem parametreleri faz uzayı şeritlerinin kıvrımını canlı değiştirir.',
        'Çatallanma eşiğinde A ve B varlıkları çekerin zıt kanatlarına savrularak ayrışır.',
        'Ayrışma yayı deterministik kuralların rastgelelik olmadan nasıl karmaşıklık ürettiğini gösterir.',
        'İkiz varlıkların izleri makalenin bütüncül sonucunu simgeleyen kararlı çekici geometrisini tamamlar.',
        'Sahneye tıklayarak başlangıç sapması oluşturabilir ve kavrama testiyle deneyiminizi pekiştirebilirsiniz.',
      ],
      software: [
        'Hareketli veri paketi ajanları modüler mimari hattına girerek makalenin sistem sorusunu başlatır.',
        'Dağınık işlenmemiş veri ile yapılandırılmış algoritmik akış yan yana görselleştirilir.',
        'Doğrulayıcı ajanlar gelen paketleri tarayarak kural tutarlılığını canlı darbelerle sınar.',
        'Model kısıtları ve denklem parametreleri aşamalar arasındaki işlem kapasitesini ayarlar.',
        'Onaylanan bilgi paketleri analiz katmanından sentez modülüne senkronize köprülerle aktarılır.',
        'Hatalı gürültünün elenmesi ve güvenilir çıktı üretimi temel bilimsel bulguları somutlaştırır.',
        'Tüm veri ve modül varlıkları makalenin bütüncül sonucunu taşıyan merkez bilgi ağında birleşir.',
        'Sistem mantığını sahne etkileşimi ve kavrama testiyle doğrudan deneyimleyebilirsiniz.',
      ],
    },
  },
  en: {
    headings: [
      '1. Introduction, Core Thesis & Full Overview',
      '2. Conceptual Foundation & Problem Framing',
      '3. Interactive Entity Dynamics & Mechanism',
      '4. Mathematical & Theoretical Model Analysis',
      '5. Deep Analysis & Causal Process Flow',
      '6. Core Scientific & Philosophical Findings',
      '7. Holistic Article Conclusion & Synthesis',
      '8. Critical Inquiry & Freedom of Thought Closing',
    ],
    introLead: (title, category) =>
      `Welcome to the comprehensive narrated summary of "${title}", authored by Emre Pelit in the field of ${category}.`,
    problemLead: 'The conceptual foundation and core research question unfold through the following arguments:',
    mechanismLead: 'The underlying mechanism and interaction between key concepts operate as follows:',
    modelLead: (simTitle, paramSummary) =>
      `The formal theoretical model is examined through "${simTitle}". Baseline parameters: ${paramSummary}.`,
    deepLead: 'At the deeper analytical layer, the article develops the following causal connections:',
    findingsLead: 'The key scientific and philosophical findings emerging from this study can be summarized as follows:',
    conclusionLead: 'Bringing every argument together, the article arrives at this holistic conclusion:',
    closingText:
      'This comprehensive summary is designed to make the core insights of the study effortless to grasp. Feel free to interact with the animated entities on stage and form your own independent critical view. Thank you for watching and listening.',
    closingBullets: [
      'Speaker-Synced Duration · No Artificial Time Limit',
      '12-Language Cultural Narration · Full Freedom of Thought',
    ],
    domainRoles: {
      quantum: 'Wave-Packet Agents ↔ Double-Slit Gate ↔ Observer Sensor',
      higgs: 'Scalar Field Quanta ↔ Fermion & Boson Travelers',
      holographic: 'Boundary Qubit Agents ↔ Emergent Bulk Geometry Core',
      spacetime: 'Stationary Observer (τ₀) ↔ Relativistic Traveler (τ) ↔ Gravity Well',
      consciousness: 'Recurrent Cognitive Nodes ↔ Integrated Information Sparks (Φ)',
      chaos: 'Twin Explorer Entities (A & B) ↔ Strange Attractor Manifold',
      software: 'Data-Packet Agents ↔ Validator Modules ↔ Knowledge Hub',
    },
    domainSummary: {
      quantum: 'Wavefunction superposition, interference fringes, and observer coupling dynamics',
      higgs: 'Scalar field potential, spontaneous symmetry breaking, and mass-generation topology',
      holographic: 'Boundary-to-bulk holographic projection and Bekenstein entropy encoding',
      spacetime: 'Minkowski light-cone geometry, Lorentz invariance, and spacetime metric curvature',
      consciousness: 'Integrated information (Φ), subjective experience, and algorithmic limits',
      chaos: 'Nonlinear trajectory stability, sensitive dependence, and strange-attractor geometry',
      software: 'Modular pipeline architecture, structured constraint solving, and live inference flow',
    },
    domainFallbacks: {
      quantum: ['Superposition', 'Observer', 'Decoherence'],
      higgs: ['Scalar Field', 'Symmetry Break', 'Mass Halo'],
      holographic: ['Boundary Area', 'Information', 'Holography'],
      spacetime: ['Proper Time', 'Light Cone', 'Curvature'],
      consciousness: ['Integrated Φ', 'Feedback Loop', 'Awareness'],
      chaos: ['Initial Delta', 'Bifurcation', 'Attractor'],
      software: ['Data Flow', 'Validation', 'Architecture'],
    },
    domainBeats: {
      quantum: [
        'Quantum wave-packet agents emerge from the source emitter to introduce the article’s core question.',
        'Classical particle intuition and quantum superposition move side by side to clarify the contrast.',
        'Wave packets traverse the double slit and interact to weave luminous interference fringes.',
        'Active equation parameters adjust wave amplitude and phase coherence dynamically on stage.',
        'As the Observer sensor approaches, its scanning beam couples with the traveling wave packets.',
        'Upon measurement interaction, dispersed probability waves localize into discrete detector hits.',
        'All wave and particle entities converge into an equilibrium pattern summarizing the conclusion.',
        'Click the stage or test the interactive quiz below with complete freedom of inquiry.',
      ],
      higgs: [
        'The pulsing scalar field lattice sets the stage for the article’s mass and symmetry inquiry.',
        'In the high-energy symmetric phase, massless travelers glide effortlessly across the canvas.',
        'Fermion and boson entities interact with scalar field nodes, exchanging subtle energy pulses.',
        'The Mexican-hat potential and active parameters reshape the vacuum energy valley in real time.',
        'Field quanta cluster around coupled particles, forming a visible inertia (mass) aura.',
        'A massless photon zips past unimpeded while heavy bosons slow down past the critical threshold.',
        'Field and particle agents settle into the unified equilibrium representing the conclusion.',
        'Open inquiry invites readers to probe parameter sensitivity and evaluate the quiz freely.',
      ],
      holographic: [
        'Orbiting boundary qubit agents illuminate the article’s core question of space and information.',
        'Three-dimensional bulk intuition is contrasted visually with two-dimensional boundary encoding.',
        'Boundary agents fire coherent entanglement arcs inward across the holographic disk.',
        'Entropy and area equations scale the live density of boundary information beams.',
        'Inward projection rays intersect at the center, assembling emergent bulk geometry step by step.',
        'Preserved correlations flowing around the horizon visibly demonstrate the core findings.',
        'Boundary and bulk entities synchronize into a single holographic synthesis of the conclusion.',
        'Click the stage to probe boundary correlations and test your understanding below.',
      ],
      spacetime: [
        'Two clock-bearing observer entities appear on the spacetime grid to frame the nature of time.',
        'Absolute classical time expectation is contrasted directly with relativistic proper time.',
        'As the Relativistic Traveler accelerates, its live clock hand ticks visibly slower than τ₀.',
        'Lorentz factor and metric parameters dynamically govern the light-cone geometry on screen.',
        'A central gravity well warps the spacetime grid, visibly bending passing light-photon paths.',
        'Invariant spacetime intervals inside the causal light cone highlight the primary findings.',
        'Observers, photons, and curved geodesics align to summarize the holistic conclusion.',
        'Click the spacetime grid to emit light pulses and explore the interactive quiz.',
      ],
      consciousness: [
        'Cognitive agent nodes awaken across the network to frame the mind-consciousness question.',
        'An isolated feed-forward chain is contrasted beside a richly interconnected recurrent cluster.',
        'Recurrent agents exchange glowing information sparks to initiate synchronized feedback loops.',
        'Integration (Φ) equations and baseline parameters modulate live network coupling intensity.',
        'As bidirectional loops synchronize, a golden integrated field halo emerges around the network.',
        'Coherent multi-node firing patterns and causal links illustrate the primary findings.',
        'All cognitive entities unify into a harmonic Φ ring reflecting the article’s overall conclusion.',
        'Readers remain free to question every hypothesis and explore the interactive quiz below.',
      ],
      chaos: [
        'Twin explorer entities A and B launch nearly side by side to introduce deterministic chaos.',
        'Linear predictable paths are visually contrasted against nonlinear feedback curves.',
        'Although A and B begin almost identically, their tiny Δx₀ separation begins amplifying.',
        'Lyapunov and attractor parameters continuously sculpt the rotating phase-space manifold.',
        'At the bifurcation point, entities A and B diverge dramatically onto opposite attractor wings.',
        'The live separation arc demonstrates how deterministic rules produce rich complexity.',
        'Both explorer trails complete the strange-attractor geometry embodying the conclusion.',
        'Click the stage to perturb the trajectory and evaluate your synthesis in the quiz below.',
      ],
      software: [
        'Animated data-packet agents enter the modular pipeline to introduce the system thesis.',
        'Unstructured noise is contrasted side by side with verified algorithmic pipeline flow.',
        'Validator agent nodes inspect incoming packets with live verification shield pulses.',
        'Model constraints and equation parameters dynamically regulate pipeline throughput.',
        'Verified knowledge packets advance cleanly across synchronized analysis and synthesis stages.',
        'Filtering anomalous noise while preserving coherent signals proves the core findings.',
        'All packets and validator agents converge into the central hub symbolizing the conclusion.',
        'Click the pipeline stage to inject a live test packet and complete the comprehension quiz.',
      ],
    },
  },
  es: {
    headings: [
      '1. Introducción, Tesis Central y Visión General',
      '2. Fundamento Conceptual y Planteamiento',
      '3. Dinámica de Entidades y Mecanismo',
      '4. Modelo Matemático y Marco Teórico',
      '5. Análisis Profundo y Flujo Causal',
      '6. Hallazgos Científicos y Filosóficos Clave',
      '7. Conclusión Integral y Síntesis Final',
      '8. Pensamiento Crítico y Cierre Abierto',
    ],
    introLead: (title, category) =>
      `Bienvenidos al resumen ampliado narrado del artículo "${title}", escrito por Emre Pelit en el área de ${category}.`,
    problemLead: 'La base conceptual y el problema central del estudio se estructuran a partir de los siguientes argumentos:',
    mechanismLead: 'El mecanismo principal y la interacción entre las variables clave funcionan de la siguiente manera:',
    modelLead: (simTitle, paramSummary) =>
      `El modelo teórico y matemático se analiza mediante "${simTitle}". Parámetros de referencia: ${paramSummary}.`,
    deepLead: 'En la capa de análisis profundo, el artículo desarrolla estas relaciones causales:',
    findingsLead: 'Los principales hallazgos científicos y filosóficos de la investigación se resumen así:',
    conclusionLead: 'Al integrar todos los argumentos, el artículo alcanza la siguiente conclusión global:',
    closingText:
      'Este resumen ampliado facilita una comprensión clara de la obra manteniendo total respeto por la libertad de pensamiento. Puedes interactuar con las entidades en pantalla y continuar explorando el cuestionario. Gracias por escuchar.',
    closingBullets: [
      'Duración sincronizada con el narrador · Sin límite fijo',
      'Narración cultural en 12 idiomas · Libertad de pensamiento',
    ],
    domainRoles: {
      quantum: 'Paquetes de Onda ↔ Doble Rendija ↔ Sensor Observador',
      higgs: 'Cuantos del Campo Escalar ↔ Fermiones y Bosones',
      holographic: 'Cúbits de Frontera ↔ Núcleo Geométrico Volumétrico',
      spacetime: 'Observador en Reposo (τ₀) ↔ Viajero Relativista (τ)',
      consciousness: 'Nodos Cognitivos Recurrentes ↔ Información Integrada (Φ)',
      chaos: 'Entidades Gemelas (A y B) ↔ Atractor Extraño',
      software: 'Paquetes de Datos ↔ Validadores ↔ Núcleo de Síntesis',
    },
    domainSummary: {
      quantum: 'Superposición de función de onda, franjas de interferencia y acoplamiento del observador',
      higgs: 'Potencial del campo escalar, ruptura espontánea de simetría y origen de la masa',
      holographic: 'Proyección holográfica frontera-volumen y entropía de Bekenstein-Hawking',
      spacetime: 'Geometría del cono de luz, invariancia de Lorentz y curvatura métrica',
      consciousness: 'Información integrada (Φ), experiencia subjetiva y límites algorítmicos',
      chaos: 'Estabilidad no lineal, sensibilidad a condiciones iniciales y atractores extraños',
      software: 'Arquitectura modular, validación estructurada y flujo de inferencia en vivo',
    },
    domainFallbacks: {
      quantum: ['Superposición', 'Observador', 'Decoherencia'],
      higgs: ['Campo Escalar', 'Simetría', 'Masa'],
      holographic: ['Frontera', 'Información', 'Holografía'],
      spacetime: ['Tiempo Propio', 'Cono de Luz', 'Curvatura'],
      consciousness: ['Φ Integrada', 'Retroalimentación', 'Conciencia'],
      chaos: ['Delta Inicial', 'Bifurcación', 'Atractor'],
      software: ['Flujo', 'Validación', 'Arquitectura'],
    },
    domainBeats: {
      quantum: [
        'Los paquetes de onda cuánticos emergen de la fuente para presentar la pregunta central.',
        'La intuición clásica de partícula se contrasta junto a la superposición ondulatoria.',
        'Las ondas atraviesan la doble rendija creando franjas luminosas de interferencia.',
        'Los parámetros de la ecuación regulan amplitud y coherencia en tiempo real.',
        'El sensor observador se acerca e intercambia información con las ondas cuánticas.',
        'Tras la medición, la probabilidad se localiza en impactos discretos sobre el detector.',
        'Todas las entidades convergen en un equilibrio que resume la conclusión del artículo.',
        'Haz clic en el escenario para experimentar libremente con el modelo interactivo.',
      ],
      higgs: [
        'La red pulsante del campo escalar introduce el problema de la masa y la simetría.',
        'En la fase simétrica de alta energía, las partículas sin masa se deslizan libremente.',
        'Fermiones y bosones interactúan con los nodos del campo intercambiando pulsos.',
        'El potencial de sombrero mexicano moldea el valle de vacío en tiempo real.',
        'Los cuantos del campo rodean a las partículas acopladas generando un halo de inercia.',
        'El fotón sin masa avanza sin freno mientras el bosón masivo desacelera.',
        'Campo y partículas alcanzan el equilibrio estable que sintetiza la conclusión.',
        'Explora libremente las hipótesis físicas y el cuestionario interactivo inferior.',
      ],
      holographic: [
        'Los cúbits en la frontera iluminan la relación entre espacio e información.',
        'La intuición tridimensional se contrasta con la codificación bidimensional del borde.',
        'Los agentes de frontera proyectan arcos de entrelazamiento hacia el interior.',
        'Las ecuaciones de entropía y área escalan el flujo de información holográfica.',
        'Los rayos proyectados construyen paso a paso la geometría emergente central.',
        'Las correlaciones preservadas en el horizonte respaldan los hallazgos clave.',
        'Frontera y volumen se unifican en la síntesis holográfica de la conclusión.',
        'Interactúa con el escenario para explorar las correlaciones holográficas.',
      ],
      spacetime: [
        'Dos observadores con reloj en la malla espacio-temporal plantean la naturaleza del tiempo.',
        'El tiempo absoluto clásico se compara directamente con el tiempo propio relativista.',
        'Al acelerar el viajero, su reloj marca el tiempo visiblemente más lento que τ₀.',
        'El factor de Lorentz y la métrica definen la inclinación del cono de luz.',
        'El pozo gravitacional curva la malla y desvía la trayectoria de los fotones.',
        'Los intervalos invariantes dentro del cono causal muestran los hallazgos principales.',
        'Observadores, fotones y geodésicas se alinean en la conclusión integral.',
        'Haz clic en la malla para emitir pulsos de luz y profundizar en el cuestionario.',
      ],
      consciousness: [
        'Los nodos cognitivos se activan para plantear el vínculo entre mente y conciencia.',
        'Una cadena lineal aislada se compara con una red recurrente fuertemente acoplada.',
        'Los agentes intercambian chispas de información creando bucles sincronizados.',
        'La ecuación de integración Φ modula la densidad de conexiones en vivo.',
        'Al fortalecerse la retroalimentación emerge un halo dorado de integración colectiva.',
        'Los patrones sincrónicos de disparo ilustran los hallazgos filosóficos y científicos.',
        'Todos los nodos se integran en un anillo armónico Φ que resume la conclusión.',
        'El modelo permanece abierto al análisis crítico y a la libre reflexión.',
      ],
      chaos: [
        'Las entidades gemelas A y B parten casi juntas para ilustrar el caos determinista.',
        'Las trayectorias lineales predecibles se contrastan con curvas no lineales.',
        'Una diferencia inicial diminuta Δx₀ comienza a amplificarse progresivamente.',
        'Los parámetros de Lyapunov esculpen en vivo el atractor extraño en rotación.',
        'En el umbral de bifurcación, A y B divergen hacia alas opuestas del atractor.',
        'El arco de separación muestra cómo reglas deterministas generan alta complejidad.',
        'Ambas trayectorias completan la geometría que simboliza la conclusión global.',
        'Haz clic en el escenario para introducir una perturbación y evaluar tu comprensión.',
      ],
      software: [
        'Los paquetes de datos animados ingresan al flujo modular presentando la tesis.',
        'El ruido sin estructura se contrasta junto al procesamiento algorítmico verificado.',
        'Los módulos validadores inspeccionan cada paquete con pulsos de verificación.',
        'Las restricciones del modelo regulan el rendimiento entre etapas en tiempo real.',
        'Los paquetes aprobados fluyen de forma sincronizada hacia la síntesis final.',
        'El filtrado de anomalías respalda la estabilidad demostrada en los hallazgos.',
        'Todos los módulos convergen en el núcleo de conocimiento de la conclusión.',
        'Haz clic en el flujo para inyectar un paquete de prueba y realizar el cuestionario.',
      ],
    },
  },
  de: {
    headings: [
      '1. Einleitung, Kernthese & Gesamtüberblick',
      '2. Begriffliche Grundlage & Problemstellung',
      '3. Dynamik der Entitäten & Wirkmechanismus',
      '4. Mathematisches & Theoretisches Modell',
      '5. Tiefenanalyse & Kausale Prozesskette',
      '6. Zentrale Wissenschaftliche & Philosophische Befunde',
      '7. Gesamtfazit & Integrale Synthese',
      '8. Kritische Reflexion & Offener Abschluss',
    ],
    introLead: (title, category) =>
      `Willkommen zur ausführlichen gesprochenen Zusammenfassung des Artikels "${title}" von Emre Pelit aus dem Bereich ${category}.`,
    problemLead: 'Die begriffliche Grundlage und zentrale Fragestellung entfalten sich durch folgende Argumente:',
    mechanismLead: 'Der zugrunde liegende Mechanismus und die Wechselwirkung der Schlüsselkonzepte funktionieren wie folgt:',
    modelLead: (simTitle, paramSummary) =>
      `Das formale Modell wird anhand von "${simTitle}" betrachtet. Basisparameter: ${paramSummary}.`,
    deepLead: 'Auf der tieferen Analyseebene entwickelt der Artikel diese kausalen Zusammenhänge:',
    findingsLead: 'Die wesentlichen wissenschaftlichen und philosophischen Erkenntnisse lassen sich wie folgt zusammenfassen:',
    conclusionLead: 'Führt man alle Argumente zusammen, gelangt der Artikel zu diesem Gesamtergebnis:',
    closingText:
      'Diese umfassende Zusammenfassung macht die Kernaussagen klar nachvollziehbar und wahrt uneingeschränkte Gedankenfreiheit. Interagieren Sie gerne direkt mit den animierten Objekten auf der Bühne. Vielen Dank fürs Zuhören.',
    closingBullets: [
      'Synchron zur Sprechdauer · Ohne künstliches Zeitlimit',
      '12-Sprachen-Kultursprecher · Volle Gedankenfreiheit',
    ],
    domainRoles: {
      quantum: 'Wellenpakete ↔ Doppelspalt ↔ Beobachtersensor',
      higgs: 'Skalarfeld-Quanten ↔ Fermionen & Bosonen',
      holographic: 'Rand-Qubits ↔ Emergenter Volumenkern',
      spacetime: 'Ruhender Beobachter (τ₀) ↔ Relativistischer Reisender (τ)',
      consciousness: 'Rekurrente Knoten ↔ Integrierte Information (Φ)',
      chaos: 'Zwillings-Entitäten (A & B) ↔ Seltsamer Attraktor',
      software: 'Datenpakete ↔ Prüfmodule ↔ Wissenszentrum',
    },
    domainSummary: {
      quantum: 'Wellenfunktions-Superposition, Interferenzmuster und Beobachterkopplung',
      higgs: 'Skalarfeldpotenzial, spontane Symmetriebrechung und Massenerzeugung',
      holographic: 'Holografische Rand-Volumen-Projektion und Bekenstein-Entropie',
      spacetime: 'Minkowski-Lichtkegel, Lorentz-Invarianz und Raumzeitkrümmung',
      consciousness: 'Integrierte Information (Φ), subjektives Erleben und algorithmische Grenzen',
      chaos: 'Nichtlineare Stabilität, Sensitivität gegenüber Anfangsbedingungen und Attraktoren',
      software: 'Modulare Pipeline-Architektur, Konsistenzprüfung und Live-Inferenz',
    },
    domainFallbacks: {
      quantum: ['Superposition', 'Beobachter', 'Dekohärenz'],
      higgs: ['Skalarfeld', 'Symmetrie', 'Masse'],
      holographic: ['Randfläche', 'Information', 'Holografie'],
      spacetime: ['Eigenzeit', 'Lichtkegel', 'Krümmung'],
      consciousness: ['Integriertes Φ', 'Rückkopplung', 'Bewusstsein'],
      chaos: ['Anfangsdelta', 'Bifurkation', 'Attraktor'],
      software: ['Datenfluss', 'Prüfung', 'Architektur'],
    },
    domainBeats: {
      quantum: [
        'Quanten-Wellenpakete treten aus der Quelle aus und eröffnen die Kernfrage.',
        'Klassische Teilchenvorstellung und Wellensuperposition werden direkt gegenübergestellt.',
        'Die Wellenpakete durchqueren den Doppelspalt und bilden leuchtende Interferenzmuster.',
        'Gleichungsparameter passen Amplitude und Kohärenz dynamisch in Echtzeit an.',
        'Der Beobachtersensor nähert sich und koppelt über Messsignale an die Wellenpakete.',
        'Durch die Messung lokalisieren sich Wahrscheinlichkeitswellen auf dem Detektor.',
        'Alle Entitäten vereinen sich zu einem Gleichgewicht als Synthese des Gesamtfazits.',
        'Klicken Sie auf die Bühne, um eigene Impulse auszulösen und das Quiz zu testen.',
      ],
      higgs: [
        'Das schwingende Skalarfeldgitter eröffnet die Frage nach Masse und Symmetrie.',
        'In der symmetrischen Hochenergiephase gleiten masselose Teilchen ungehindert.',
        'Fermionen und Bosonen treten erstmals mit den Feldknoten in Wechselwirkung.',
        'Das Mexikanerhut-Potenzial formt das Vakuumtal live anhand der Parameter.',
        'Feldquanten sammeln sich um gekoppelte Teilchen und bilden eine Trägheitsaura.',
        'Während das Photon ungehindert fliegt, bremst das massereiche Boson ab.',
        'Feld und Teilchen finden in das stabile Gleichgewicht der Schlussfolgerung.',
        'Die Bühne bleibt offen für eigene Parameterprüfungen und kritisches Denken.',
      ],
      holographic: [
        'Umlaufende Rand-Qubits beleuchten die Beziehung zwischen Raum und Information.',
        'Dreidimensionale Raumintuition wird zweidimensionaler Randkodierung gegenübergestellt.',
        'Randknoten senden kohärente Verschränkungsbögen in das Innere.',
        'Entropie- und Flächengleichungen skalieren die Dichte des Informationsflusses.',
        'Einwärts gerichtete Projektionen weben schrittweise die innere Geometrie.',
        'Erhaltene Korrelationen entlang des Horizonts stützen die Kernbefunde.',
        'Rand und Volumen verschmelzen zur holografischen Gesamtsynthese.',
        'Klicken Sie auf die Bühne, um Randkorrelationen interaktiv zu testen.',
      ],
      spacetime: [
        'Zwei Beobachter mit Uhren im Raumzeitgitter hinterfragen die Natur der Zeit.',
        'Absolute klassische Zeit wird direkt mit relativistischer Eigenzeit verglichen.',
        'Bei Beschleunigung tickt die Uhr des Reisenden sichtbar langsamer als τ₀.',
        'Lorentzfaktor und Metrik steuern dynamisch die Lichtkegelgeometrie.',
        'Ein zentrales Gravitationspotenzial krümmt das Gitter und lenkt Photonen ab.',
        'Invariante Raumzeitintervalle im Kausalkegel belegen die Hauptbefunde.',
        'Beobachter, Photonen und Geodäten bündeln sich zum Gesamtfazit.',
        'Klicken Sie in das Gitter, um Lichtimpulse zu senden und das Quiz zu lösen.',
      ],
      consciousness: [
        'Kognitive Netzknoten erwachen und veranschaulichen die Bewusstseinsfrage.',
        'Eine lineare Kette steht einem rekurrent vernetzten Cluster gegenüber.',
        'Rekurrente Agenten tauschen Informationsfunken in synchronen Schleifen aus.',
        'Die Integrationsgleichung Φ steuert live die Vernetzungsdichte.',
        'Starke Rückkopplung erzeugt eine goldene Aura integrierter Information.',
        'Synchrone Aktivierungsmuster verdeutlichen die wissenschaftlichen Befunde.',
        'Alle Knoten fügen sich zu einem harmonischen Φ-Ring als Gesamtfazit.',
        'Alle Hypothesen bleiben frei zur kritischen Prüfung und Diskussion.',
      ],
      chaos: [
        'Die Zwillings-Entitäten A und B starten fast identisch im chaotischen System.',
        'Vorhersagbare lineare Bahnen werden nichtlinearen Kurven gegenübergestellt.',
        'Eine winzige Anfangsdifferenz Δx₀ verstärkt sich kontinuierlich.',
        'Lyapunov- und Attraktorparameter formen den rotierenden Phasenraum live.',
        'Am Bifurkationspunkt trennen sich A und B auf gegenüberliegende Flügel.',
        'Der Trennungsbogen zeigt, wie deterministische Regeln Komplexität erzeugen.',
        'Beide Spuren vollenden die Attraktorgeometrie der Schlussfolgerung.',
        'Klicken Sie auf die Bühne, um eine Störung auszulösen und Ihr Wissen zu prüfen.',
      ],
      software: [
        'Animierte Datenpakete treten in die modulare Pipeline der Systemthese ein.',
        'Unstrukturiertes Rauschen wird verifiziertem Algorithmusfluss gegenübergestellt.',
        'Prüfmodule inspizieren eingehende Pakete mit Live-Verifikationsimpulsen.',
        'Modellbedingungen regeln den Durchsatz zwischen den Stufen dynamisch.',
        'Geprüfte Wissenspakete gelangen synchron in Analyse und Synthese.',
        'Das Herausfiltern von Anomalien bestätigt die Stabilität der Kernbefunde.',
        'Alle Module münden im zentralen Wissensknoten des Gesamtfazits.',
        'Klicken Sie in die Pipeline, um ein Testpaket einzuspeisen.',
      ],
    },
  },
  fr: {
    headings: [
      '1. Introduction, Thèse Centrale & Vue d’Ensemble',
      '2. Fondement Conceptuel & Problématique',
      '3. Dynamique des Entités & Mécanisme',
      '4. Modèle Mathématique & Cadre Théorique',
      '5. Analyse Approfondie & Chaîne Causale',
      '6. Résultats Scientifiques & Philosophiques Clés',
      '7. Conclusion Globale & Synthèse Finale',
      '8. Esprit Critique & Ouverture Libre',
    ],
    introLead: (title, category) =>
      `Bienvenue dans le résumé approfondi narré de l’article « ${title} », rédigé par Emre Pelit dans le domaine ${category}.`,
    problemLead: 'Le socle conceptuel et la question fondamentale de l’étude reposent sur les arguments suivants :',
    mechanismLead: 'Le mécanisme central et l’interaction entre les concepts clés se déroulent ainsi :',
    modelLead: (simTitle, paramSummary) =>
      `Le modèle formel est exploré à travers « ${simTitle} ». Paramètres de référence : ${paramSummary}.`,
    deepLead: 'Dans sa dimension analytique approfondie, l’article met en lumière ces liens causaux :',
    findingsLead: 'Les principaux résultats scientifiques et philosophiques de cette recherche se résument ainsi :',
    conclusionLead: 'En reliant l’ensemble des arguments, l’article aboutit à cette conclusion globale :',
    closingText:
      'Ce résumé approfondi vise une compréhension claire tout en respectant pleinement la liberté de pensée. N’hésitez pas à interagir avec les entités animées et à poursuivre avec le quiz. Merci de votre écoute.',
    closingBullets: [
      'Calibré sur la durée du narrateur · Sans limite fixe',
      'Narration culturelle en 12 langues · Liberté de pensée',
    ],
    domainRoles: {
      quantum: 'Paquets d’Ondes ↔ Double Fente ↔ Capteur Observateur',
      higgs: 'Quanta du Champ Scalaire ↔ Fermions & Bosons',
      holographic: 'Qubits de Bord ↔ Noyau Géométrique Interne',
      spacetime: 'Observateur au Repos (τ₀) ↔ Voyageur Relativiste (τ)',
      consciousness: 'Nœuds Cognitifs Récurrents ↔ Information Intégrée (Φ)',
      chaos: 'Entités Jumelles (A & B) ↔ Attracteur Étrange',
      software: 'Paquets de Données ↔ Validateurs ↔ Centre de Synthèse',
    },
    domainSummary: {
      quantum: 'Superposition d’onde, franges d’interférence et couplage de l’observateur',
      higgs: 'Potentiel scalaire, brisure spontanée de symétrie et génération de masse',
      holographic: 'Projection holographique bord-volume et entropie de Bekenstein',
      spacetime: 'Cône de lumière de Minkowski, invariance de Lorentz et courbure métrique',
      consciousness: 'Information intégrée (Φ), expérience subjective et limites algorithmiques',
      chaos: 'Stabilité non linéaire, sensibilité aux conditions initiales et attracteurs',
      software: 'Architecture modulaire, validation formelle et flux d’inférence en direct',
    },
    domainFallbacks: {
      quantum: ['Superposition', 'Observateur', 'Décohérence'],
      higgs: ['Champ Scalaire', 'Symétrie', 'Masse'],
      holographic: ['Frontière', 'Information', 'Holographie'],
      spacetime: ['Temps Propre', 'Cône de Lumière', 'Courbure'],
      consciousness: ['Φ Intégrée', 'Rétroaction', 'Conscience'],
      chaos: ['Delta Initial', 'Bifurcation', 'Attracteur'],
      software: ['Flux', 'Validation', 'Architecture'],
    },
    domainBeats: {
      quantum: [
        'Des paquets d’ondes quantiques émergent de la source pour poser la question centrale.',
        'L’intuition classique de particule est comparée à la superposition ondulatoire.',
        'Les ondes traversent la double fente et tissent des franges d’interférence lumineuses.',
        'Les paramètres de l’équation ajustent amplitude et cohérence en direct.',
        'Le capteur observateur s’approche et interagit avec les paquets d’ondes.',
        'Lors de la mesure, les ondes de probabilité se localisent sur le détecteur.',
        'Toutes les entités convergent vers l’équilibre qui synthétise la conclusion.',
        'Cliquez sur la scène pour interagir librement et explorer le quiz ci-dessous.',
      ],
      higgs: [
        'Le réseau du champ scalaire vibre pour introduire la question de la masse.',
        'Dans la phase symétrique, les particules sans masse glissent librement.',
        'Fermions et bosons échangent leurs premières impulsions avec le champ.',
        'Le potentiel en chapeau mexicain façonne la vallée du vide en temps réel.',
        'Les quanta du champ entourent les particules couplées d’un halo d’inertie.',
        'Le photon sans masse file sans entrave tandis que le boson massif ralentit.',
        'Champ et particules se stabilisent dans l’équilibre final de la conclusion.',
        'Poursuivez votre réflexion critique avec la simulation et le quiz interactif.',
      ],
      holographic: [
        'Les qubits de la frontière éclairent le lien entre espace et information.',
        'L’intuition volumique 3D contraste avec l’encodage 2D du bord.',
        'Les nœuds périphériques projettent des arcs d’intrication vers le centre.',
        'Les équations d’entropie modulent la densité des faisceaux d’information.',
        'Les projections internes assemblent progressivement la géométrie émergente.',
        'Les corrélations préservées sur l’horizon confirment les résultats majeurs.',
        'Bord et volume s’unissent dans la synthèse holographique finale.',
        'Cliquez sur le disque holographique pour tester les corrélations en direct.',
      ],
      spacetime: [
        'Deux observateurs munis d’horloges posent la question de la nature du temps.',
        'Le temps absolu classique est confronté au temps propre relativiste.',
        'À grande vitesse, l’horloge du voyageur bat visiblement plus lentement que τ₀.',
        'Le facteur de Lorentz et la métrique orientent le cône de lumière en direct.',
        'Un puits gravitationnel courbe la grille et dévie la trajectoire des photons.',
        'Les intervalles invariants dans le cône causal illustrent les résultats clés.',
        'Observateurs, photons et géodésiques s’alignent pour la conclusion globale.',
        'Cliquez sur la grille espace-temps pour émettre un signal lumineux.',
      ],
      consciousness: [
        'Les nœuds cognitifs s’éveillent autour de la question de la conscience.',
        'Une chaîne linéaire isolée contraste avec un réseau récurrent interconnecté.',
        'Les agents échangent des étincelles d’information en boucles synchronisées.',
        'L’équation d’intégration Φ module la densité de couplage en temps réel.',
        'La rétroaction soutenue fait émerger un halo doré d’intégration collective.',
        'Les schémas d’activation cohérents illustrent les découvertes principales.',
        'Les nœuds s’unissent dans un anneau Φ reflétant la conclusion globale.',
        'Chaque hypothèse reste ouverte à l’examen critique et au dialogue libre.',
      ],
      chaos: [
        'Les entités jumelles A et B partent presque ensemble dans le système chaotique.',
        'Les trajectoires linéaires prévisibles contrastent avec la dynamique non linéaire.',
        'Un écart initial infime Δx₀ commence à s’amplifier rapidement.',
        'Les paramètres de Lyapunov sculptent l’attracteur étrange en rotation.',
        'Au seuil de bifurcation, A et B divergent vers des ailes opposées.',
        'L’arc de séparation montre comment des règles déterministes créent la complexité.',
        'Les deux trajectoires dessinent la géométrie de la conclusion globale.',
        'Cliquez sur la scène pour perturber la trajectoire et explorer le quiz.',
      ],
      software: [
        'Les paquets de données animés entrent dans le pipeline modulaire de la thèse.',
        'Le bruit non structuré contraste avec le flux algorithmique vérifié.',
        'Les modules validateurs contrôlent chaque paquet par impulsions en direct.',
        'Les contraintes du modèle régulent le débit entre les étapes.',
        'Les paquets validés progressent de manière synchronisée vers la synthèse.',
        'Le filtrage des anomalies confirme la robustesse des résultats clés.',
        'Tous les modules convergent vers le noyau de connaissance final.',
        'Cliquez sur le pipeline pour injecter un paquet de test interactif.',
      ],
    },
  },
  ru: {
    headings: [
      '1. Введение, Главный Тезис и Общий Обзор',
      '2. Концептуальная Основа и Постановка Проблемы',
      '3. Взаимодействие Объектов и Механизм',
      '4. Математическая и Теоретическая Модель',
      '5. Глубокий Анализ и Причинно-Следственный Поток',
      '6. Ключевые Научные и Философские Выводы',
      '7. Целостное Заключение и Синтез Статьи',
      '8. Критическое Осмысление и Свобода Мысли',
    ],
    introLead: (title, category) =>
      `Добро пожаловать к подробному голосовому резюме статьи «${title}», написанной Эмре Пелитом в области ${category}.`,
    problemLead: 'Концептуальная основа и ключевой исследовательский вопрос раскрываются через следующие положения:',
    mechanismLead: 'Основной механизм и взаимодействие между ключевыми понятиями работают следующим образом:',
    modelLead: (simTitle, paramSummary) =>
      `Формальная модель рассматривается через «${simTitle}». Базовые параметры: ${paramSummary}.`,
    deepLead: 'На уровне углублённого анализа статья прослеживает следующие причинно-следственные связи:',
    findingsLead: 'Главные научные и философские результаты исследования можно обобщить так:',
    conclusionLead: 'Объединяя все аргументы, статья приходит к следующему целостному выводу:',
    closingText:
      'Это подробное резюме помогает ясно понять ключевые идеи работы при полном уважении свободы мысли. Вы можете взаимодействовать с объектами на сцене и проверить понимание в тесте ниже. Благодарим за внимание.',
    closingBullets: [
      'Длительность по времени диктора · Без лимита',
      'Культурная озвучка на 12 языках · Свобода мысли',
    ],
    domainRoles: {
      quantum: 'Волновые пакеты ↔ Две щели ↔ Датчик наблюдателя',
      higgs: 'Кванты скалярного поля ↔ Фермионы и бозоны',
      holographic: 'Граничные кубиты ↔ Ядро объёмной геометрии',
      spacetime: 'Неподвижный наблюдатель (τ₀) ↔ Релятивистский путешественник (τ)',
      consciousness: 'Рекуррентные узлы ↔ Интегрированная информация (Φ)',
      chaos: 'Парные агенты (A и B) ↔ Странный аттрактор',
      software: 'Пакеты данных ↔ Валидаторы ↔ Центр синтеза',
    },
    domainSummary: {
      quantum: 'Суперпозиция волновой функции, интерференция и связь с наблюдателем',
      higgs: 'Потенциал скалярного поля, спонтанное нарушение симметрии и масса',
      holographic: 'Голографическая проекция граница-объём и энтропия Бекенштейна',
      spacetime: 'Световой конус Минковского, инвариантность Лоренца и кривизна метрики',
      consciousness: 'Интегрированная информация (Φ), субъективный опыт и пределы алгоритмов',
      chaos: 'Нелинейная устойчивость, чувствительность к начальным условиям и аттракторы',
      software: 'Модульная архитектура, проверка ограничений и потоковый вывод',
    },
    domainFallbacks: {
      quantum: ['Суперпозиция', 'Наблюдатель', 'Декогеренция'],
      higgs: ['Скалярное поле', 'Симметрия', 'Масса'],
      holographic: ['Граница', 'Информация', 'Голография'],
      spacetime: ['Собственное время', 'Световой конус', 'Кривизна'],
      consciousness: ['Интеграция Φ', 'Обратная связь', 'Сознание'],
      chaos: ['Начальный сдвиг', 'Бифуркация', 'Аттрактор'],
      software: ['Поток данных', 'Проверка', 'Архитектура'],
    },
    domainBeats: {
      quantum: [
        'Квантовые волновые пакеты выходят из источника, раскрывая главный вопрос статьи.',
        'Классическое представление о частице сравнивается с волновой суперпозицией.',
        'Волны проходят через две щели и формируют светящуюся интерференционную картину.',
        'Параметры уравнения в реальном времени меняют амплитуду и фазовую согласованность.',
        'Приближающийся наблюдатель вступает в информационный обмен с волновыми пакетами.',
        'В результате измерения волны вероятности локализуются на экране детектора.',
        'Все объекты сходятся в равновесном узоре, отражающем общий вывод статьи.',
        'Нажмите на сцену, чтобы взаимодействовать с моделью и пройти тест.',
      ],
      higgs: [
        'Колеблющаяся решётка скалярного поля задаёт вопрос о массе и симметрии.',
        'В симметричной фазе высоких энергий безмассовые частицы движутся свободно.',
        'Фермионы и бозоны начинают обмениваться импульсами с узлами поля.',
        'Потенциал «мексиканской шляпы» формирует долину вакуума в реальном времени.',
        'Кванты поля скапливаются вокруг связанных частиц, создавая ореол инерции.',
        'Безмассовый фотон пролетает мгновенно, а массивный бозон замедляется.',
        'Поле и частицы устанавливают устойчивое равновесие итогового вывода.',
        'Проверьте параметры модели и перейдите к интерактивному тесту ниже.',
      ],
      holographic: [
        'Граничные кубиты раскрывают связь между пространством и информацией.',
        'Трёхмерный объём визуально сопоставляется с двумерной кодировкой границы.',
        'Граничные узлы направляют лучи запутанности к центру диска.',
        'Уравнения энтропии масштабируют плотность потоков информации.',
        'Внутренние проекции шаг за шагом формируют объёмную геометрию.',
        'Сохраняемые корреляции на горизонте подтверждают ключевые выводы.',
        'Граница и объём объединяются в единой голографической картине финала.',
        'Нажмите на сцену, чтобы исследовать корреляции границы в реальном времени.',
      ],
      spacetime: [
        'Два наблюдателя с часами на сетке пространства-времени исследуют природу времени.',
        'Классическое абсолютное время сравнивается с релятивистским собственным временем.',
        'При ускорении стрелка часов путешественника заметно замедляется по сравнению с τ₀.',
        'Фактор Лоренца и метрика динамически задают наклон светового конуса.',
        'Центральная гравитационная яма искривляет сетку и отклоняет фотоны.',
        'Инвариантные интервалы внутри светового конуса иллюстрируют главные выводы.',
        'Наблюдатели, фотоны и геодезические линии складываются в итоговый синтез.',
        'Нажмите на сетку, чтобы запустить световой импульс и пройти тест.',
      ],
      consciousness: [
        'Когнитивные узлы активируются, ставя вопрос о природе сознания.',
        'Изолированная линейная цепь противопоставляется связанному рекуррентному кластеру.',
        'Агенты обмениваются искрами информации, образуя синхронные контуры.',
        'Уравнение интеграции Φ динамически регулирует плотность связей.',
        'Усиление обратной связи рождает золотое поле целостной интеграции.',
        'Согласованные импульсы узлов наглядно показывают ключевые выводы.',
        'Все узлы объединяются в гармоничное кольцо Φ, отражающее итог статьи.',
        'Исследование остаётся открытым для свободного критического анализа.',
      ],
      chaos: [
        'Парные объекты A и B стартуют почти из одной точки в хаотической системе.',
        'Предсказуемые линейные траектории сопоставляются с нелинейными кривыми.',
        'Крошечное начальное отличие Δx₀ начинает быстро нарастать.',
        'Параметры Ляпунова формируют вращающийся странный аттрактор.',
        'В точке бифуркации A и B расходятся на противоположные крылья аттрактора.',
        'Дуга расхождения показывает, как детерминизм порождает сложность.',
        'Оба следа завершают геометрию аттрактора, символизируя общий вывод.',
        'Нажмите на сцену, чтобы внести возмущение и оценить понимание в тесте.',
      ],
      software: [
        'Анимированные пакеты данных входят в модульный конвейер системы.',
        'Неструктурированный шум сравнивается с проверенным алгоритмическим потоком.',
        'Модули проверки сканируют каждый пакет в реальном времени.',
        'Ограничения модели управляют пропускной способностью этапов.',
        'Проверенные пакеты синхронно переходят от анализа к синтезу.',
        'Отсеивание аномалий подтверждает надёжность ключевых выводов.',
        'Все модули сходятся в центральном узле знаний итогового вывода.',
        'Нажмите на конвейер, чтобы подать тестовый пакет данных.',
      ],
    },
  },
  ar: {
    headings: [
      '1. المقدمة والأطروحة المركزية والإطار العام',
      '2. الأساس المفاهيمي وصياغة الإشكالية',
      '3. آلية تفاعل الكائنات المتحركة',
      '4. النموذج الرياضي والإطار النظري',
      '5. التحليل العميق والتسلسل السببي',
      '6. النتائج العلمية والفلسفية الجوهرية',
      '7. الخلاصة الشاملة والتركيب النهائي للمقال',
      '8. التأمل النقدي وحرية الفكر',
    ],
    introLead: (title, category) =>
      `مرحباً بكم في الملخص الشامل المسموع لمقال "${title}" بقلم إمري بيليت في مجال ${category}.`,
    problemLead: 'يتشكل الأساس المفاهيمي والإشكالية الرئيسية للمقال من خلال المحاور التالية:',
    mechanismLead: 'تعمل الآلية الأساسية وتفاعل المفاهيم المحورية عبر المسار التالي:',
    modelLead: (simTitle, paramSummary) =>
      `يُعالج النموذج النظري والرياضي ضمن "${simTitle}". المعاملات الأساسية: ${paramSummary}.`,
    deepLead: 'في مستوى التحليل المعمق، يطور المقال الروابط السببية التالية:',
    findingsLead: 'تتلخص أبرز النتائج العلمية والفلسفية المستخلصة من هذه الدراسة فيما يلي:',
    conclusionLead: 'عند جمع كل الحجج والتحليلات، يصل المقال إلى هذه الخلاصة الشاملة:',
    closingText:
      'أُعدّ هذا الملخص الشامل لتيسير فهم الأفكار الأساسية للمقال بوضوح تام مع الاحترام الكامل لحرية الفكر والتأمل المستقل. يمكنك التفاعل مع الكائنات المتحركة على الشاشة واختبار فهمك أدناه. شكراً لحسن استماعكم.',
    closingBullets: [
      'مدة الفيديو مطابقة لإنهاء الراوي · بلا حد ثابت',
      'سرد ثقافي بـ 12 لغة · احترام كامل لحرية الفكر',
    ],
    domainRoles: {
      quantum: 'حزم الموجات ↔ الشق المزدوج ↔ مستشعر المراقب',
      higgs: 'كمّات المجال القياسي ↔ الفرميونات والبوزونات',
      holographic: 'كيوبتات الحدود ↔ نواة الهندسة الحجمية',
      spacetime: 'المراقب الساكن (τ₀) ↔ المسافر النسبي (τ)',
      consciousness: 'عقد معرفية مترابطة ↔ شرارات المعلومات المتكاملة (Φ)',
      chaos: 'كائنان توأمان (A و B) ↔ الجاذب الغريب',
      software: 'حزم البيانات ↔ وحدات التحقق ↔ مركز المعرفة',
    },
    domainSummary: {
      quantum: 'تراكب الدالة الموجية وتداخلها وتأثير اقتران المراقب',
      higgs: 'جهد المجال القياسي والانكسار التلقائي للتناظر وآلية اكتساب الكتلة',
      holographic: 'الإسقاط الهولوغرافي بين الحد والحجم وحدود إنتروبيا بيكنشتاين',
      spacetime: 'هندسة مخروط الضوء وثبات لورنتز وانحناء الزمكان',
      consciousness: 'المعلومات المتكاملة (Φ) والتجربة الذاتية وحدود الخوارزميات',
      chaos: 'الديناميكا غير الخطية والحساسية للشروط الابتدائية والجاذب الغريب',
      software: 'البنية المعيارية والتحقق المنهجي وتدفق الاستدلال المباشر',
    },
    domainFallbacks: {
      quantum: ['التراكب', 'المراقب', 'فقدان الترابط'],
      higgs: ['المجال القياسي', 'التناظر', 'الكتلة'],
      holographic: ['الحد السطحي', 'المعلومات', 'الهولوغرافيا'],
      spacetime: ['الزمن الذاتي', 'مخروط الضوء', 'الانحناء'],
      consciousness: ['تكامل Φ', 'التغذية الراجعة', 'الوعي'],
      chaos: ['الفرق الابتدائي', 'التشعب', 'الجاذب'],
      software: ['تدفق البيانات', 'التحقق', 'المعمارية'],
    },
    domainBeats: {
      quantum: [
        'تنطلق حزم الموجات الكمية من المصدر لتقديم السؤال الجوهري للمقال.',
        'تُقارن النظرة الجسيمية الكلاسيكية بالتراكب الموجي جنباً إلى جنب.',
        'تعبر الموجات الشق المزدوج لتشكل أهداب التداخل المضيئة.',
        'تضبط معاملات المعادلة سعة الموجة والترابط الطوري بشكل مباشر.',
        'يقترب مستشعر المراقب ويتبادل المعلومات مع الحزم الموجية.',
        'بعد التفاعل القياسي تتمركز الموجات الاحتمالية في نقاط محددة على الكاشف.',
        'تتآلف كل الكائنات في نمط متوازن يجسد الخلاصة الشاملة للمقال.',
        'انقر على المشهد للتفاعل المباشر واستكشف الاختبار التفاعلي أدناه.',
      ],
      higgs: [
        'تهتز شبكة المجال القياسي لتمهيد سؤال الكتلة والتناظر.',
        'في الطور المتناظر عالي الطاقة تنساب الجسيمات عديمة الكتلة بحرية.',
        'تتفاعل الفرميونات والبوزونات مع عقد المجال بتبادل نبضات طاقية.',
        'يشكل جهد القبعة المكسيكية وادي الفراغ بصورة حية.',
        'تتجمع كمّات المجال حول الجسيمات المقترنة مكونة هالة الكتلة.',
        'يمر الفوتون بلا عائق بينما يتباطأ البوزون الثقيل عند العتبة الحرجة.',
        'يستقر المجال والجسيمات في توازن الفراغ الممثل للخلاصة النهائية.',
        'المجال مفتوح لاختبار المعاملات والتأمل النقدي الحر.',
      ],
      holographic: [
        'تضيء كيوبتات الحدود السؤال المركزي حول المكان والمعلومات.',
        'يُقارن الحدس ثلاثي الأبعاد بالترميز ثنائي الأبعاد على السطح.',
        'ترسل عقد الحدود أشعة تشابك مترابطة نحو المركز.',
        'تضبط معادلات الإنتروبيا والمساحة كثافة تدفق المعلومات.',
        'تتقاطع الإسقاطات الداخلية لبناء الهندسة الحجمية خطوة بخطوة.',
        'تؤكد الارتباطات المحفوظة على الأفق النتائج العلمية الرئيسية.',
        'يتكامل الحد والحجم في شبكة هولوغرافية واحدة تجسد الخلاصة.',
        'انقر على المشهد لاستكشاف الارتباطات التفاعلية بحرية.',
      ],
      spacetime: [
        'يظهر مراقبان بساعتين على شبكة الزمكان لطرح سؤال طبيعة الزمن.',
        'يُقارن الزمن المطلق الكلاسيكي بالزمن الذاتي النسبي مباشرة.',
        'مع تسارع المسافر تبطؤ حركة عقارب ساعته بوضوح مقارنة بـ τ₀.',
        'يحكم معامل لورنتز والمترية ميل مخروط الضوء بشكل فوري.',
        'تُحني بئر الجاذبية شبكة الزمكان وتثني مسار الفوتونات العابرة.',
        'تبرهن الفواصل الثابتة داخل المخروط السببي على النتائج الرئيسية.',
        'تنتظم الساعات والفوتونات والانحناءات لتلخيص الاستنتاج الشامل.',
        'انقر على الشبكة لإطلاق نبضة ضوئية ومتابعة الاختبار أدناه.',
      ],
      consciousness: [
        'تنشط العقد المعرفية في الشبكة لطرح سؤال العقل والوعي.',
        'تُقارن السلسلة الخطية المعزولة بالشبكة المترابطة ذات التغذية الراجعة.',
        'تتبادل العقد شرارات المعلومات مشكّلة حلقات متزامنة.',
        'تنظم معادلة التكامل Φ كثافة الترابط الشبكي مباشرة.',
        'مع اشتداد التغذية الراجعة تنبثق هالة ذهبية للوعي المتكامل.',
        'توضح أنماط الإطلاق المتزامنة النتائج العلمية والفلسفية الرئيسية.',
        'تتحد العقد في حلقة Φ متناغمة تعكس الخلاصة الكلية للمقال.',
        'تبقى كل الفرضيات مفتوحة للنقاش الحر والتفكير النقدي.',
      ],
      chaos: [
        'ينطلق الكائنان التوأمان A و B من نقطة شبه متطابقة لعرض الفوضى الحتمية.',
        'تُقارن المسارات الخطية المتوقعة بالمنحنيات غير الخطية.',
        'يبدأ الفرق الابتدائي الضئيل Δx₀ بالتضخم تدريجياً.',
        'تصوغ معاملات ليابونوف والجاذب فضاء الطور الدوار مباشرة.',
        'عند نقطة التشعب يتباعد الكائنان نحو جناحين متقابلين للجاذب.',
        'يوضح قوس التباعد كيف تولد القواعد الحتمية تعقيداً ثرياً.',
        'يكمل المساران هندسة الجاذب الغريب المجسدة للخلاصة.',
        'انقر على المشهد لإدخال اضطراب لحظي واختبار فهمك أدناه.',
      ],
      software: [
        'تدخل حزم البيانات المتحركة إلى المسار المعياري لعرض أطروحة النظام.',
        'يُقارن الضجيج غير المنظم بتدفق الخوارزمية الموثقة.',
        'تفحص وحدات التحقق كل حزمة بنبضات تدقيق حية.',
        'تنظم قيود النموذج طاقة المعالجة بين المراحل.',
        'تنتقل الحزم الموثقة بسلاسة من التحليل إلى التركيب.',
        'يثبت استبعاد الشذوذ استقرار وموثوقية النتائج الأساسية.',
        'تلتقي كل الوحدات في مركز المعرفة الممثل للخلاصة النهائية.',
        'انقر على المسار لإدخال حزمة اختبار تفاعلية.',
      ],
    },
  },
  zh: {
    headings: [
      '1. 引言、核心论题与全景概览',
      '2. 概念基础与核心问题构建',
      '3. 动态实体交互与作用机制',
      '4. 数学与理论模型解析',
      '5. 深度分析与因果演化过程',
      '6. 核心科学与哲学发现',
      '7. 全文整体结论与综合提炼',
      '8. 批判性思考与自由探究结语',
    ],
    introLead: (title, category) =>
      `欢迎收听由 Emre Pelit 在${category}领域撰写的论文《${title}》的完整深度摘要。`,
    problemLead: '文章的概念基础与核心问题围绕以下论点逐步展开：',
    mechanismLead: '核心作用机制与关键概念之间的相互作用通过以下过程呈现：',
    modelLead: (simTitle, paramSummary) =>
      `形式化理论模型通过“${simTitle}”展开分析。基准参数为：${paramSummary}。`,
    deepLead: '在深度分析层面，文章揭示了如下关键因果链条：',
    findingsLead: '本研究得出的核心科学与哲学发现可综合概括如下：',
    conclusionLead: '综合全文所有论证，本篇文章最终得出如下整体结论：',
    closingText:
      '本完整深度摘要旨在帮助读者清晰把握文章核心思想，同时充分尊重每位读者的独立思考与思想自由。欢迎点击互动舞台体验模型并参与下方测验。感谢您的聆听。',
    closingBullets: [
      '随主讲人完播自动计时 · 无固定时长限制',
      '12语种本土文化配音 · 尊重思想自由',
    ],
    domainRoles: {
      quantum: '波包粒子 ↔ 双缝闸门 ↔ 观测者传感器',
      higgs: '标量场量子 ↔ 费米子与玻色子',
      holographic: '边界量子比特 ↔ 涌现体几何核心',
      spacetime: '静止观测者 (τ₀) ↔ 相对论行者 (τ)',
      consciousness: '循环认知节点 ↔ 整合信息火花 (Φ)',
      chaos: '双生探索体 (A 与 B) ↔ 奇异吸引子',
      software: '数据包代理 ↔ 校验模块 ↔ 知识中枢',
    },
    domainSummary: {
      quantum: '波函数叠加、干涉条纹与观测者耦合动力学',
      higgs: '标量场势能、自发对称性破缺与质量产生机制',
      holographic: '边界到体积的全息投影与贝肯斯坦熵极限',
      spacetime: '闵可夫斯基光锥几何、洛伦兹不变性与度规弯曲',
      consciousness: '整合信息量 (Φ)、主观体验与算法边界',
      chaos: '非线性轨迹稳定性、初值敏感性与奇异吸引子',
      software: '模块化架构、约束校验与实时推理流',
    },
    domainFallbacks: {
      quantum: ['叠加态', '观测者', '退相干'],
      higgs: ['标量场', '对称破缺', '质量机制'],
      holographic: ['边界表面', '信息熵', '全息原理'],
      spacetime: ['固有时', '光锥', '时空弯曲'],
      consciousness: ['整合 Φ', '反馈回路', '意识觉知'],
      chaos: ['初值微差', '分岔点', '吸引子'],
      software: ['数据流', '校验机制', '系统架构'],
    },
    domainBeats: {
      quantum: [
        '量子波包从发射源出发，引出本篇论文的核心问题。',
        '经典粒子直觉与量子波叠加并列呈现，凸显本质差异。',
        '波包穿过双缝并相互干涉，编织出明亮的干涉条纹。',
        '方程参数实时调节波幅与相位相干性。',
        '观测者传感器靠近并与行进中的波包发生信息耦合。',
        '测量作用使概率波在探测器屏幕上汇聚为离散落点。',
        '所有波与粒子实体汇聚成呼应全文结论的平衡图景。',
        '点击右侧舞台即可自由互动，并尝试下方理解度测验。',
      ],
      higgs: [
        '脉动的标量场晶格引出关于质量与对称性的核心探索。',
        '在高能对称阶段，无质量粒子在场中自由滑行。',
        '费米子与玻色子开始与场节点交换能量脉冲。',
        '墨西哥帽势能与参数实时重塑真空能量谷。',
        '场量子聚集在耦合粒子周围，形成可见的惯性质量光环。',
        '无质量光子畅行无阻，而获质量玻色子明显减速。',
        '场与粒子安定在象征全文结论的稳定真空平衡中。',
        '欢迎自由测试参数并开展独立批判性思考。',
      ],
      holographic: [
        '环绕边界的量子比特照亮空间与信息关系的主题。',
        '三维体积直觉与二维边界编码形成鲜明视觉对照。',
        '边界节点向圆盘中心发射相干纠缠弧线。',
        '熵与面积方程实时调节边界信息流的密度。',
        '向内投影的光束逐步构建出涌现的体几何结构。',
        '视界边缘守恒的关联弧直观印证了核心发现。',
        '边界与体积统一为代表全文结论的全息网络。',
        '点击舞台探索边界关联，并完成下方测验。',
      ],
      spacetime: [
        '时空网格上的两位时钟观测者共同引出时间本质之问。',
        '经典绝对时间预期与相对论固有时流逝直接对比。',
        '高速行者加速时，其时钟指针明显慢于静止时钟 τ₀。',
        '洛伦兹因子与度规参数动态决定光锥几何形态。',
        '中心引力井弯曲时空网格，使经过的光子路径偏折。',
        '因果光锥内的不变量间隔直观展示研究核心发现。',
        '观测者、光子与测地线汇合，概括全文整体结论。',
        '点击时空网格发射光脉冲，深入探索互动测验。',
      ],
      consciousness: [
        '认知网络节点逐一唤醒，展现心智与意识之问。',
        '孤立的前馈链条与高度互联的循环网络并置对比。',
        '循环代理彼此交换信息火花，建立同步反馈环路。',
        '整合度 Φ 方程与参数实时调节网络耦合强度。',
        '双向反馈增强时，网络中心涌现出金色整合意识光环。',
        '多节点协同放电模式清晰呈现文章核心发现。',
        '所有节点融入和谐的 Φ 环，呼应全文综合结论。',
        '所有假说均保持开放，尊重每位读者的独立思辨。',
      ],
      chaos: [
        '几乎同点出发的双生探索体 A 与 B 拉开确定性混沌序幕。',
        '线性可预测轨迹与非线性反馈曲线形成直观对比。',
        '微小的初始差异 Δx₀ 开始不断放大。',
        '李雅普诺夫参数实时雕琢旋转中的相空间吸引子。',
        '抵达分岔点时，A 与 B 剧烈分离并飞向吸引子两翼。',
        '实时分离弧展示确定性规则如何孕育丰富复杂性。',
        '两条轨迹共同绘出象征全文结论的奇异吸引子几何。',
        '点击舞台注入微小扰动，并通过测验检验理解。',
      ],
      software: [
        '动态数据包代理进入模块化流水线，呈现系统论题。',
        '无序噪声与经过验证的算法数据流并列对比。',
        '校验节点以实时脉冲检测每一个输入数据包。',
        '模型约束条件动态调控各阶段处理吞吐量。',
        '通过校验的知识包同步迈向分析与综合模块。',
        '滤除异常噪声并保持稳定输出印证了核心发现。',
        '所有模块与数据流汇聚至代表结论的知识中枢。',
        '点击流水线舞台即可注入测试数据包进行体验。',
      ],
    },
  },
  ja: {
    headings: [
      '1. 導入・中心命題と全体像',
      '2. 概念的基盤と問題設定',
      '3. 動的オブジェクトの相互作用と仕組み',
      '4. 数理モデルと理論的枠組み',
      '5. 深層分析と因果プロセス',
      '6. 主要な科学的・哲学的知見',
      '7. 論文全体の統合的結論',
      '8. 批判的探究と思想の自由の結び',
    ],
    introLead: (title, category) =>
      `エムレ・ペリットによる${category}分野の論文「${title}」の詳細要約ナレーションへようこそ。`,
    problemLead: '本論文の概念的基盤と中心的な問題設定は、次の議論によって構成されます。',
    mechanismLead: '中核となるメカニズムと主要概念の相互作用は次のように展開します。',
    modelLead: (simTitle, paramSummary) =>
      `数理・理論モデルは「${simTitle}」として定式化されます。基準パラメータは ${paramSummary} です。`,
    deepLead: 'より深い分析層では、次のような因果関係が明らかにされます。',
    findingsLead: '本研究から導き出された主要な科学的・哲学的知見は次の通りです。',
    conclusionLead: 'すべての議論を統合すると、論文全体は次の結論に至ります。',
    closingText:
      'この詳細要約は、論文の核心を明快に理解できるよう作成されており、読者の自由な思考を最大限に尊重します。ステージ上のオブジェクトをクリックして体験し、下の理解度テストもお試しください。ご視聴ありがとうございました。',
    closingBullets: [
      '朗読完了時間に完全同期 · 固定時間制限なし',
      '12言語ネイティブ語り · 思想の自由を尊重',
    ],
    domainRoles: {
      quantum: '波束エージェント ↔ 二重スリット ↔ 観測センサー',
      higgs: 'スカラー場量子 ↔ フェルミオン・ボソン',
      holographic: '境界量子ビット ↔ 創発バルク幾何コア',
      spacetime: '静止観測者 (τ₀) ↔ 相対論的旅人 (τ)',
      consciousness: '再帰認知ノード ↔ 統合情報スパーク (Φ)',
      chaos: '双子探索体 (A・B) ↔ ストレンジアトラクタ',
      software: 'データパケット ↔ 検証モジュール ↔ 知識ハブ',
    },
    domainSummary: {
      quantum: '波動関数の重ね合わせ、干渉縞、および観測者結合の動力学',
      higgs: 'スカラー場ポテンシャル、自発的対称性の破れ、質量獲得機構',
      holographic: '境界から内部へのホログラフィック投影とベッケンシュタインエントロピー',
      spacetime: 'ミンコフスキー光円錐幾何、ローレンツ不変性、計量曲率',
      consciousness: '統合情報 (Φ)、主観的経験、計算可能性の限界',
      chaos: '非線形軌道安定性、初期値鋭敏性、ストレンジアトラクタ',
      software: 'モジュラー構造、制約検証、リアルタイム推論フロー',
    },
    domainFallbacks: {
      quantum: ['重ね合わせ', '観測者', 'デコヒーレンス'],
      higgs: ['スカラー場', '対称性の破れ', '質量ハロー'],
      holographic: ['境界面積', '情報量', 'ホログラフィ'],
      spacetime: ['固有時間', '光円錐', '時空曲率'],
      consciousness: ['統合 Φ', '帰還ループ', '意識'],
      chaos: ['初期差', '分岐点', 'アトラクタ'],
      software: ['データ流', '検証機構', 'アーキテクチャ'],
    },
    domainBeats: {
      quantum: [
        '量子波束エージェントが放出源から現れ、論文の核心的な問いを提示します。',
        '古典粒子像と量子重ね合わせが並んで進み、違いを視覚化します。',
        '波束は二重スリットを通過して鮮やかな干渉縞を織りなします。',
        '方程式パラメータが振幅と位相コヒーレンスをリアルタイムに調整します。',
        '観測センサーが接近すると、波束との情報結合が始まります。',
        '測定相互作用により確率波は検出器上の離散的な点に収束します。',
        'すべての粒子と波が論文全体の結論を象徴する均衡へと収まります。',
        'ステージをクリックして自由に操作し、下のクイズもお試しください。',
      ],
      higgs: [
        '脈動するスカラー場格子が質量と対称性の問いを立ち上げます。',
        '高エネルギー対称相では無質量粒子が抵抗なく滑走します。',
        'フェルミオンとボソンが場のノードと相互作用を始めます。',
        'メキシカンハット型ポテンシャルが真空の谷をリアルタイムに形作ります。',
        '場の量子が粒子周囲に集まり、質量という慣性のオーラを生みます。',
        '無質量光子が駆け抜ける一方、重いボソンは明確に減速します。',
        '場と粒子が結論を表す安定した真空均衡へと落ち着きます。',
        '自由な批判的視点でパラメータとテストを探究してください。',
      ],
      holographic: [
        '境界上の量子ビットが空間と情報の根本的な問いを照らします。',
        '三次元体積の直感と二次元境界符号化が対比されます。',
        '境界ノードが中心へ量子もつれの弧を放ちます。',
        'エントロピーと面積の式が情報流の密度を制御します。',
        '内側への投影が段階的にバルク幾何を構築します。',
        '地平面に沿って保たれる相関が主要知見を裏付けます。',
        '境界と内部が結論を体現する一つのホログラフィック網へ統合されます。',
        'ステージをクリックして境界相関を直接体感してください。',
      ],
      spacetime: [
        '時空格子上の二人の時計観測者が時間の本質を問いかけます。',
        '古典的絶対時間と相対論的固有時間が並んで比較されます。',
        '旅人が加速するほど、時計の針は τ₀ より明らかに遅く進みます。',
        'ローレンツ因子と計量が光円錐の傾きを動的に決定します。',
        '中央の重力井戸が時空を歪め、通過する光子の軌道を曲げます。',
        '因果光円錐内の不変間隔が主要な科学的知見を示します。',
        '観測者・光子・測地線が調和し、論文の結論を要約します。',
        '格子をクリックして光パルスを発信し、クイズに挑戦してください。',
      ],
      consciousness: [
        '認知ノードが目覚め、心と意識の問いを可視化します。',
        '孤立した直線鎖と密接な再帰ネットワークが対比されます。',
        'エージェントが情報スパークを交わし同期ループを形成します。',
        '統合情報 Φ の式が結合強度をリアルタイムに調整します。',
        '双方向帰還が強まると黄金の統合意識ハローが立ち上がります。',
        '多ノードの同期発火パターンが主要知見を具体的に示します。',
        '全ノードが結論を映す調和的な Φ リングへと統合されます。',
        'すべての仮説は自由な批判的検討に開かれています。',
      ],
      chaos: [
        'ほぼ同じ位置から出発する双子探索体 A と B がカオスを導入します。',
        '予測可能な線形軌道と非線形帰還曲線が対比されます。',
        'ごく微小な初期差 Δx₀ が次第に増幅していきます。',
        'リアプノフ係数とアトラクタが位相空間をリアルタイムに造形します。',
        '分岐点で A と B は反対側の翼へと劇的に分岐します。',
        '分離の弧が決定論的法則から生まれる複雑さを示します。',
        '二つの軌跡が結論を象徴するストレンジアトラクタを完成させます。',
        'ステージをクリックして微小摂動を与え、理解度を確認してください。',
      ],
      software: [
        '動的データパケットがモジュラーパイプラインに入り主題を開きます。',
        '未整理ノイズと検証済みアルゴリズム流が並んで示されます。',
        '検証ノードが各パケットをリアルタイムに検査します。',
        'モデル制約が各段階の処理能力を動的に調整します。',
        '承認された知識パケットが解析から統合へ同期移動します。',
        '異常ノイズの除去が主要知見の信頼性を証明します。',
        '全モジュールが結論を象徴する中央知識ハブに集約されます。',
        'ステージをクリックしてテストパケットを投入できます。',
      ],
    },
  },
  pt: {
    headings: [
      '1. Introdução, Tese Central e Visão Geral',
      '2. Fundamento Conceitual e Problemática',
      '3. Dinâmica das Entidades e Mecanismo',
      '4. Modelo Matemático e Quadro Teórico',
      '5. Análise Profunda e Fluxo Causal',
      '6. Principais Achados Científicos e Filosóficos',
      '7. Conclusão Integral e Síntese Final',
      '8. Reflexão Crítica e Encerramento Livre',
    ],
    introLead: (title, category) =>
      `Bem-vindos ao resumo abrangente narrado do artigo "${title}", de autoria de Emre Pelit na área de ${category}.`,
    problemLead: 'A base conceitual e a questão central do estudo desenvolvem-se a partir dos seguintes argumentos:',
    mechanismLead: 'O mecanismo central e a interação entre os conceitos essenciais operam da seguinte forma:',
    modelLead: (simTitle, paramSummary) =>
      `O modelo teórico e matemático é investigado por meio de "${simTitle}". Parâmetros de referência: ${paramSummary}.`,
    deepLead: 'Na camada de análise aprofundada, o artigo estabelece as seguintes conexões causais:',
    findingsLead: 'Os principais achados científicos e filosóficos deste trabalho resumem-se assim:',
    conclusionLead: 'Reunindo todos os argumentos, o artigo chega a esta conclusão abrangente:',
    closingText:
      'Este resumo completo facilita a compreensão clara das ideias centrais respeitando integralmente a liberdade de pensamento. Interaja livremente com as entidades animadas na tela e explore o quiz abaixo. Obrigado por acompanhar.',
    closingBullets: [
      'Duração sincronizada ao narrador · Sem limite fixo',
      'Narração cultural em 12 idiomas · Liberdade de pensamento',
    ],
    domainRoles: {
      quantum: 'Pacotes de Onda ↔ Fenda Dupla ↔ Sensor Observador',
      higgs: 'Quanta do Campo Escalar ↔ Férmions e Bósons',
      holographic: 'Qubits de Fronteira ↔ Núcleo Geométrico Interno',
      spacetime: 'Observador em Repouso (τ₀) ↔ Viajante Relativístico (τ)',
      consciousness: 'Nós Cognitivos Recorrentes ↔ Informação Integrada (Φ)',
      chaos: 'Entidades Gêmeas (A e B) ↔ Atrator Estranho',
      software: 'Pacotes de Dados ↔ Validadores ↔ Centro de Síntese',
    },
    domainSummary: {
      quantum: 'Superposição quântica, franjas de interferência e acoplamento do observador',
      higgs: 'Potencial escalar, quebra espontânea de simetria e geração de massa',
      holographic: 'Projeção holográfica fronteira-volume e entropia de Bekenstein',
      spacetime: 'Cone de luz de Minkowski, invariância de Lorentz e curvatura métrica',
      consciousness: 'Informação integrada (Φ), experiência subjetiva e limites algorítmicos',
      chaos: 'Estabilidade não linear, sensibilidade inicial e atratores estranhos',
      software: 'Arquitetura modular, validação de restrições e inferência em tempo real',
    },
    domainFallbacks: {
      quantum: ['Superposição', 'Observador', 'Decoerência'],
      higgs: ['Campo Escalar', 'Simetria', 'Massa'],
      holographic: ['Fronteira', 'Informação', 'Holografia'],
      spacetime: ['Tempo Próprio', 'Cone de Luz', 'Curvatura'],
      consciousness: ['Φ Integrada', 'Retroalimentação', 'Consciência'],
      chaos: ['Delta Inicial', 'Bifurcação', 'Atrator'],
      software: ['Fluxo', 'Validação', 'Arquitetura'],
    },
    domainBeats: {
      quantum: [
        'Pacotes de onda quânticos surgem da fonte apresentando a questão central.',
        'A intuição clássica de partícula contrasta com a superposição ondulatória.',
        'As ondas atravessam a fenda dupla tecendo franjas luminosas de interferência.',
        'Os parâmetros da equação regulam amplitude e coerência em tempo real.',
        'O observador aproxima-se e acopla seu feixe de leitura aos pacotes de onda.',
        'Após a medição, as ondas de probabilidade localizam-se no detector.',
        'Todas as entidades convergem no equilíbrio que resume a conclusão geral.',
        'Clique no palco para interagir livremente e explorar o quiz abaixo.',
      ],
      higgs: [
        'A rede pulsante do campo escalar apresenta o problema da massa e simetria.',
        'Na fase simétrica de alta energia, partículas sem massa deslizam sem atrito.',
        'Férmions e bósons interagem com os nós do campo trocando pulsos.',
        'O potencial do chapéu mexicano molda o vale do vácuo ao vivo.',
        'Quanta do campo agrupam-se em torno de partículas gerando um halo de massa.',
        'O fóton sem massa avança livremente enquanto o bóson massivo desacelera.',
        'Campo e partículas estabilizam-se no equilíbrio final da conclusão.',
        'Explore livremente os parâmetros e a avaliação interativa abaixo.',
      ],
      holographic: [
        'Qubits orbitais na fronteira iluminam a relação entre espaço e informação.',
        'A intuição tridimensional contrasta com a codificação bidimensional da borda.',
        'Agentes da borda projetam arcos de emaranhamento rumo ao centro.',
        'Equações de entropia e área ajustam a densidade do fluxo informativo.',
        'Projeções internas constroem gradualmente a geometria emergente.',
        'Correlações preservadas no horizonte confirmam os achados centrais.',
        'Fronteira e volume unificam-se na síntese holográfica conclusiva.',
        'Clique no disco para sondar correlações de fronteira ao vivo.',
      ],
      spacetime: [
        'Dois observadores com relógios na grade espaço-temporal questionam o tempo.',
        'O tempo absoluto clássico é comparado ao tempo próprio relativístico.',
        'À medida que o viajante acelera, seu relógio avança mais devagar que τ₀.',
        'O fator de Lorentz e a métrica governam a geometria do cone de luz.',
        'Um poço gravitacional curva a grade e desvia a trajetória dos fótons.',
        'Intervalos invariantes dentro do cone causal evidenciam os achados.',
        'Observadores, fótons e geodésicas alinham-se na conclusão integral.',
        'Clique na grade para emitir pulsos de luz e realizar o quiz.',
      ],
      consciousness: [
        'Nós cognitivos despertam na rede introduzindo a questão da consciência.',
        'Uma cadeia linear isolada contrasta com um cluster recorrente integrado.',
        'Agentes trocam faíscas de informação formando laços sincronizados.',
        'A equação de integração Φ modula a densidade das conexões ao vivo.',
        'Com o reforço do feedback surge um halo dourado de integração coletiva.',
        'Padrões coerentes de disparo ilustram os achados principais.',
        'Todos os nós unem-se em um anel Φ harmônico refletindo a conclusão.',
        'Todas as hipóteses permanecem abertas à reflexão crítica independente.',
      ],
      chaos: [
        'As entidades gêmeas A e B partem quase juntas no sistema caótico.',
        'Trajetórias lineares previsíveis contrastam com curvas não lineares.',
        'Uma diferença inicial mínima Δx₀ começa a amplificar-se.',
        'Parâmetros de Lyapunov esculpem o atrator estranho em rotação.',
        'Na bifurcação, A e B divergem para asas opostas do atrator.',
        'O arco de separação demonstra como regras deterministas geram complexidade.',
        'Ambas as trilhas completam a geometria que simboliza a conclusão.',
        'Clique no palco para perturbar a trajetória e testar seu entendimento.',
      ],
      software: [
        'Pacotes de dados animados entram no pipeline modular da tese.',
        'Ruído desestruturado contrasta com fluxo algorítmico verificado.',
        'Módulos validadores inspecionam cada pacote com pulsos em tempo real.',
        'Restrições do modelo regulam o desempenho entre as etapas.',
        'Pacotes aprovados avançam sincronizados para análise e síntese.',
        'A filtragem de anomalias comprova a estabilidade dos achados centrais.',
        'Todos os módulos convergem para o núcleo de conhecimento final.',
        'Clique no pipeline para injetar um pacote de teste ao vivo.',
      ],
    },
  },
  it: {
    headings: [
      '1. Introduzione, Tesi Centrale e Quadro Generale',
      '2. Fondamento Concettuale e Impostazione',
      '3. Dinamica delle Entità e Meccanismo',
      '4. Modello Matematico e Quadro Teorico',
      '5. Analisi Approfondita e Flusso Causale',
      '6. Risultati Scientifici e Filosofici Chiave',
      '7. Conclusione Complessiva e Sintesi Finale',
      '8. Riflessione Critica e Chiusura Aperta',
    ],
    introLead: (title, category) =>
      `Benvenuti alla sintesi completa narrata dell’articolo "${title}", scritto da Emre Pelit nell’ambito di ${category}.`,
    problemLead: 'Le basi concettuali e il problema centrale dello studio emergono dai seguenti argomenti:',
    mechanismLead: 'Il meccanismo chiave e l’interazione tra i concetti fondamentali operano come segue:',
    modelLead: (simTitle, paramSummary) =>
      `Il modello teorico e matematico viene esaminato tramite "${simTitle}". Parametri di riferimento: ${paramSummary}.`,
    deepLead: 'A un livello di analisi più profondo, l’articolo sviluppa queste connessioni causali:',
    findingsLead: 'I principali risultati scientifici e filosofici dello studio si possono riassumere così:',
    conclusionLead: 'Collegando tutte le argomentazioni, l’articolo giunge a questa conclusione complessiva:',
    closingText:
      'Questa sintesi estesa rende chiare le idee portanti dell’opera nel pieno rispetto della libertà di pensiero. Interagite liberamente con le entità animate sullo schermo e mettetevi alla prova con il quiz sottostante. Grazie per l’ascolto.',
    closingBullets: [
      'Durata sincronizzata alla voce · Nessun limite fisso',
      'Narrazione culturale in 12 lingue · Libertà di pensiero',
    ],
    domainRoles: {
      quantum: 'Pacchetti d’Onda ↔ Doppia Fenditura ↔ Sensore Osservatore',
      higgs: 'Quanti del Campo Scalare ↔ Fermioni e Bosoni',
      holographic: 'Qubit di Confine ↔ Nucleo Geometrico Interno',
      spacetime: 'Osservatore a Riposo (τ₀) ↔ Viaggiatore Relativistico (τ)',
      consciousness: 'Nodi Cognitivi Ricorrenti ↔ Informazione Integrata (Φ)',
      chaos: 'Entità Gemelle (A e B) ↔ Attrattore Strano',
      software: 'Pacchetti Dati ↔ Validatori ↔ Centro di Sintesi',
    },
    domainSummary: {
      quantum: 'Sovrapposizione quantistica, frange di interferenza e accoppiamento dell’osservatore',
      higgs: 'Potenziale scalare, rottura spontanea di simmetria e generazione di massa',
      holographic: 'Proiezione olografica bordo-volume ed entropia di Bekenstein',
      spacetime: 'Cono di luce di Minkowski, invarianza di Lorentz e curvatura metrica',
      consciousness: 'Informazione integrata (Φ), esperienza soggettiva e limiti algoritmici',
      chaos: 'Stabilità non lineare, sensibilità alle condizioni iniziali e attrattori strani',
      software: 'Architettura modulare, verifica dei vincoli e flusso di inferenza in diretta',
    },
    domainFallbacks: {
      quantum: ['Sovrapposizione', 'Osservatore', 'Decoerenza'],
      higgs: ['Campo Scalare', 'Simmetria', 'Massa'],
      holographic: ['Confine', 'Informazione', 'Olografia'],
      spacetime: ['Tempo Proprio', 'Cono di Luce', 'Curvatura'],
      consciousness: ['Φ Integrata', 'Feedback', 'Coscienza'],
      chaos: ['Delta Iniziale', 'Biforcazione', 'Attrattore'],
      software: ['Flusso Dati', 'Verifica', 'Architettura'],
    },
    domainBeats: {
      quantum: [
        'I pacchetti d’onda quantistici emergono dalla sorgente introducendo la domanda centrale.',
        'L’intuizione classica di particella si confronta con la sovrapposizione ondulatoria.',
        'Le onde attraversano la doppia fenditura creando frange luminose di interferenza.',
        'I parametri dell’equazione regolano ampiezza e coerenza in tempo reale.',
        'Il sensore osservatore si avvicina scambiando informazione con le onde.',
        'Con la misura, le onde di probabilità si localizzano sullo schermo rivelatore.',
        'Tutte le entità convergono nell’equilibrio che riassume la conclusione.',
        'Clicca sul palco per interagire liberamente e provare il quiz sottostante.',
      ],
      higgs: [
        'Il reticolo vibrante del campo scalare apre la questione di massa e simmetria.',
        'Nella fase simmetrica ad alta energia le particelle senza massa scorrono libere.',
        'Fermioni e bosoni interagiscono con i nodi del campo scambiando impulsi.',
        'Il potenziale a cappello messicano modella la valle del vuoto in diretta.',
        'I quanti del campo si addensano attorno alle particelle generando un alone di massa.',
        'Il fotone prosegue indisturbato mentre il bosone massivo rallenta.',
        'Campo e particelle si assestano nell’equilibrio finale della conclusione.',
        'Esplora liberamente i parametri e il questionario interattivo sottostante.',
      ],
      holographic: [
        'I qubit sul confine illuminano il legame tra spazio e informazione.',
        'L’intuizione tridimensionale si confronta con la codifica bidimensionale.',
        'Gli agenti di confine proiettano archi di entanglement verso il centro.',
        'Le equazioni di entropia modulano la densità dei fasci informativi.',
        'Le proiezioni interne costruiscono gradualmente la geometria emergente.',
        'Le correlazioni conservate lungo l’orizzonte confermano i risultati chiave.',
        'Confine e volume si unificano nella sintesi olografica conclusiva.',
        'Clicca sul disco per esplorare dal vivo le correlazioni di confine.',
      ],
      spacetime: [
        'Due osservatori dotati di orologio sulla griglia spazio-temporale interrogano il tempo.',
        'Il tempo assoluto classico viene confrontato con il tempo proprio relativistico.',
        'Accelerando, l’orologio del viaggiatore scandisce il tempo più lentamente di τ₀.',
        'Il fattore di Lorentz e la metrica determinano l’inclinazione del cono di luce.',
        'Un pozzo gravitazionale curva la griglia deviando il percorso dei fotoni.',
        'Gli intervalli invarianti nel cono causale dimostrano i risultati principali.',
        'Osservatori, fotoni e geodetiche si allineano nella conclusione complessiva.',
        'Clicca sulla griglia per emettere un impulso luminoso e svolgere il quiz.',
      ],
      consciousness: [
        'I nodi cognitivi si attivano sulla rete introducendo il tema della coscienza.',
        'Una catena lineare isolata è affiancata a una rete ricorrente integrata.',
        'Gli agenti scambiano scintille informative creando cicli sincronizzati.',
        'L’equazione di integrazione Φ regola dal vivo l’intensità dei collegamenti.',
        'Con il rafforzarsi del feedback emerge un alone dorato di coscienza integrata.',
        'Gli schemi di attivazione coerenti illustrano i risultati principali.',
        'Tutti i nodi si fondono in un anello Φ armonico che sintetizza la conclusione.',
        'Ogni ipotesi resta aperta alla libera analisi critica.',
      ],
      chaos: [
        'Le entità gemelle A e B partono quasi insieme nel sistema caotico.',
        'Le traiettorie lineari prevedibili contrastano con le curve non lineari.',
        'Una minuscola differenza iniziale Δx₀ inizia ad amplificarsi rapidamente.',
        'I parametri di Lyapunov scolpiscono l’attrattore strano in rotazione.',
        'Alla biforcazione A e B divergono sulle ali opposte dell’attrattore.',
        'L’arco di separazione mostra come regole deterministiche generino complessità.',
        'Entrambe le tracce completano la geometria che incarna la conclusione.',
        'Clicca sul palco per perturbare la traiettoria e metterti alla prova nel quiz.',
      ],
      software: [
        'I pacchetti dati animati entrano nella pipeline modulare della tesi.',
        'Il rumore disorganizzato contrasta con il flusso algoritmico verificato.',
        'I moduli validatori esaminano ogni pacchetto con impulsi dal vivo.',
        'I vincoli del modello regolano la capacità tra le diverse fasi.',
        'I pacchetti approvati procedono sincronizzati verso analisi e sintesi.',
        'Il filtraggio delle anomalie conferma la solidità dei risultati chiave.',
        'Tutti i moduli convergono nel nucleo di conoscenza della conclusione.',
        'Clicca sulla pipeline per inviare un pacchetto di test interattivo.',
      ],
    },
  },
  ko: {
    headings: [
      '1. 서론, 핵심 명제 및 전체 개요',
      '2. 개념적 토대와 문제 제기',
      '3. 동적 개체 상호작용과 작동 원리',
      '4. 수리적·이론적 모델 분석',
      '5. 심층 분석과 인과적 전개',
      '6. 핵심 과학적·철학적 발견',
      '7. 논문 전체의 통합적 결론',
      '8. 비판적 탐구와 사상의 자유 맺음말',
    ],
    introLead: (title, category) =>
      `${category} 분야에서 엠레 펠리트(Emre Pelit)가 집필한 논문 "${title}"의 심층 요약 음성 해설에 오신 것을 환영합니다.`,
    problemLead: '논문의 개념적 토대와 핵심 연구 질문은 다음 논의를 통해 전개됩니다.',
    mechanismLead: '중심 메커니즘과 핵심 개념 간의 상호작용은 다음과 같이 작동합니다.',
    modelLead: (simTitle, paramSummary) =>
      `형식적 이론 모델은 "${simTitle}" 틀 안에서 분석됩니다. 기준 매개변수는 ${paramSummary}입니다.`,
    deepLead: '심층 분석 단계에서는 다음과 같은 인과 관계가 드러납니다.',
    findingsLead: '이 연구에서 도출된 핵심 과학적·철학적 발견은 다음과 같이 정리됩니다.',
    conclusionLead: '모든 논증을 종합하면 논문 전체는 다음의 통합적 결론에 도달합니다.',
    closingText:
      '이 심층 요약은 논문의 핵심 통찰을 명확히 이해하도록 돕기 위해 제작되었으며 독자의 자유로운 비판적 사고를 온전히 존중합니다. 화면의 개체를 클릭해 상호작용해 보시고 아래 퀴즈도 경험해 보시기 바랍니다. 경청해 주셔서 감사합니다.',
    closingBullets: [
      '내레이터 낭독 완료에 자동 동기화 · 시간 제한 없음',
      '12개 언어 문화권 내레이션 · 사상의 자유 존중',
    ],
    domainRoles: {
      quantum: '파동 묶음 ↔ 이중 슬릿 ↔ 관측자 센서',
      higgs: '스칼라장 양자 ↔ 페르미온 및 보손',
      holographic: '경계 큐비트 ↔ 창발적 내부 기하 코어',
      spacetime: '정지 관측자 (τ₀) ↔ 상대론적 여행자 (τ)',
      consciousness: '순환 인지 노드 ↔ 통합 정보 스파크 (Φ)',
      chaos: '쌍둥이 탐험체 (A & B) ↔ 기묘한 끌개',
      software: '데이터 패킷 ↔ 검증 모듈 ↔ 지식 허브',
    },
    domainSummary: {
      quantum: '파동함수 중첩, 간섭무늬 및 관측자 결합 동역학',
      higgs: '스칼라장 퍼텐셜, 자발적 대칭 깨짐 및 질량 생성 원리',
      holographic: '경계-내부 홀로그래픽 투영과 베켄슈타인 엔트로피 한계',
      spacetime: '민코프스키 빛원뿔 기하학, 로런츠 불변성 및 시공간 곡률',
      consciousness: '통합 정보량 (Φ), 주관적 경험 및 알고리즘의 한계',
      chaos: '비선형 궤적 안정성, 초기 조건 민감성 및 기묘한 끌개',
      software: '모듈형 파이프라인 아키텍처, 제약 검증 및 실시간 추론 흐름',
    },
    domainFallbacks: {
      quantum: ['중첩 상태', '관측자', '결어긋남'],
      higgs: ['스칼라장', '대칭 깨짐', '질량 헤일로'],
      holographic: ['경계 면적', '정보량', '홀로그래피'],
      spacetime: ['고유 시간', '빛원뿔', '시공간 곡률'],
      consciousness: ['통합 Φ', '피드백 루프', '의식'],
      chaos: ['초기 편차', '분기점', '끌개'],
      software: ['데이터 흐름', '검증 체계', '아키텍처'],
    },
    domainBeats: {
      quantum: [
        '양자 파동 묶음이 방출원에서 출발해 논문의 핵심 질문을 엽니다.',
        '고전 입자 직관과 양자 중첩이 나란히 움직이며 차이를 보여줍니다.',
        '파동 묶음이 이중 슬릿을 통과해 선명한 간섭무늬를 형성합니다.',
        '방정식 매개변수가 진폭과 위상 일관성을 실시간으로 조절합니다.',
        '관측자 센서가 접근하며 파동 묶음과 정보 결합을 시작합니다.',
        '측정 상호작용 이후 확률 파동이 검출기 화면의 개별 점으로 수렴합니다.',
        '모든 파동과 입자가 논문의 전체 결론을 상징하는 균형으로 모입니다.',
        '무대를 클릭해 직접 상호작용하고 아래 이해도 퀴즈를 풀어보세요.',
      ],
      higgs: [
        '진동하는 스칼라장 격자가 질량과 대칭성의 핵심 질문을 제시합니다.',
        '고에너지 대칭 단계에서는 질량 없는 입자가 자유롭게 이동합니다.',
        '페르미온과 보손이 장 노드와 상호작용하며 에너지를 주고받습니다.',
        '멕시칸 햇 퍼텐셜이 진공 에너지 골짜기를 실시간으로 형성합니다.',
        '장 양자가 결합 입자 주변에 모여 관성(질량) 헤일로를 만듭니다.',
        '광자는 거침없이 통과하는 반면 무거운 보손은 뚜렷이 감속합니다.',
        '장과 입자가 결론을 대변하는 안정된 진공 균형에 안착합니다.',
        '자유로운 비판적 시각으로 매개변수와 퀴즈를 탐구해 보세요.',
      ],
      holographic: [
        '경계 큐비트들이 공간과 정보의 근본 질문을 밝힙니다.',
        '3차원 체적 직관과 2차원 경계 부호화가 시각적으로 대조됩니다.',
        '경계 노드들이 중심을 향해 양자 얽힘 호를 투사합니다.',
        '엔트로피와 면적 방정식이 정보 흐름의 밀도를 조절합니다.',
        '내부 투영 광선이 단계적으로 창발적 기하학을 구성합니다.',
        '지평선 따라 보존되는 상관관계가 핵심 발견을 입증합니다.',
        '경계와 내부가 전체 결론을 담은 하나의 홀로그래픽 망으로 통합됩니다.',
        '무대를 클릭해 경계 상관관계를 직접 실험해 보세요.',
      ],
      spacetime: [
        '시공간 격자 위의 두 시계 관측자가 시간의 본질을 묻습니다.',
        '고전적 절대 시간과 상대론적 고유 시간이 나란히 비교됩니다.',
        '여행자가 가속할수록 시계 바늘은 τ₀보다 눈에 띄게 느리게 움직입니다.',
        '로런츠 인자와 계량이 빛원뿔 기울기를 실시간으로 결정합니다.',
        '중심 중력 우물이 시공간을 휘게 하고 광자 경로를 굴절시킵니다.',
        '인과 빛원뿔 내부의 불변 간격이 핵심 연구 결과를 보여줍니다.',
        '관측자, 광자, 측지선이 조화를 이루며 전체 결론을 요약합니다.',
        '격자를 클릭해 빛 펄스를 보내고 아래 퀴즈에 참여해 보세요.',
      ],
      consciousness: [
        '인지 노드들이 깨어나 마음과 의식의 질문을 시각화합니다.',
        '고립된 순방향 사슬과 밀접한 순환 네트워크가 나란히 대조됩니다.',
        '에이전트들이 정보 스파크를 주고받으며 동기화 루프를 만듭니다.',
        '통합 정보 Φ 방정식이 네트워크 결합 밀도를 실시간 조절합니다.',
        '양방향 피드백이 강해지면 황금빛 통합 의식 헤일로가 나타납니다.',
        '다중 노드 동기 발화 패턴이 핵심 과학·철학 발견을 드러냅니다.',
        '모든 노드가 전체 결론을 반영하는 조화로운 Φ 고리로 결합합니다.',
        '모든 가설은 자유로운 비판적 검토와 토론에 열려 있습니다.',
      ],
      chaos: [
        '거의 같은 지점에서 출발한 쌍둥이 A와 B가 결정론적 혼돈을 엽니다.',
        '예측 가능한 선형 경로와 비선형 피드백 곡선이 대조됩니다.',
        '아주 작은 초기 차이 Δx₀가 점점 증폭되기 시작합니다.',
        '랴푸노프 매개변수가 회전하는 위상 공간 끌개를 실시간으로 조각합니다.',
        '분기점에서 A와 B는 끌개의 반대 날개로 극적으로 갈라집니다.',
        '분리 호는 결정론적 규칙이 어떻게 풍부한 복잡성을 낳는지 보여줍니다.',
        '두 궤적이 전체 결론을 상징하는 기묘한 끌개 기하학을 완성합니다.',
        '무대를 클릭해 미세 섭동을 주고 아래 퀴즈로 이해도를 확인하세요.',
      ],
      software: [
        '움직이는 데이터 패킷이 모듈형 파이프라인으로 진입해 주제를 엽니다.',
        '비정형 잡음과 검증된 알고리즘 흐름이 나란히 비교됩니다.',
        '검증 모듈이 들어오는 패킷을 실시간 펄스로 점검합니다.',
        '모델 제약 조건이 단계별 처리량을 동적으로 조절합니다.',
        '승인된 지식 패킷이 분석에서 종합 단계로 동기 이동합니다.',
        '이상 잡음 필터링이 핵심 발견의 신뢰성을 증명합니다.',
        '모든 모듈이 결론을 상징하는 중앙 지식 허브로 수렴합니다.',
        '무대를 클릭해 테스트 패킷을 직접 주입해 볼 수 있습니다.',
      ],
    },
  },
};

function getSummaryLocalePack(lang: LanguageCode): SummaryLocalePack {
  return SUMMARY_LOCALE_PACKS[lang] || SUMMARY_LOCALE_PACKS.en;
}

function extractArticleHolisticConclusion(
  article: Article,
  language: LanguageCode,
  translatedOverride?: TranslatedArticleContent | null
): {
  title: string;
  subtitle: string;
  abstractText: string;
  paragraphs: string[];
  findings: string[];
  methodologyNote: string;
  conclusionPrimary: string;
  conclusionSecondary: string;
  contextOpening: string;
  middleAnalysis: string;
} {
  const isTr = language === 'tr';
  const title = cleanSentence(translatedOverride?.title || getLocalizedText(article.title, language));
  const subtitle = cleanSentence(
    translatedOverride?.subtitle || getLocalizedText(article.subtitle, language)
  );
  const abstractText = cleanSentence(
    translatedOverride?.abstract || getLocalizedText(article.abstract, language)
  );
  const findings = (
    translatedOverride?.keyFindings && translatedOverride.keyFindings.length > 0
      ? translatedOverride.keyFindings
      : getLocalizedArray(article.keyFindings, language)
  )
    .map(cleanSentence)
    .filter(Boolean);

  const rawParagraphs = (
    translatedOverride?.contentParagraphs && translatedOverride.contentParagraphs.length > 0
      ? translatedOverride.contentParagraphs
      : getLocalizedArray(article.contentParagraphs, language)
  )
    .map(cleanSentence)
    .filter((p) => p.length > 20 && !/Bu makale .* tarihinde Mersin'de yazılmıştır/i.test(p));

  const methodologyNote = cleanSentence(
    translatedOverride?.methodologyNote ||
      getLocalizedText(article.simulation?.methodologyNote, language)
  );

  const paragraphs = rawParagraphs.length > 0 ? rawParagraphs : [abstractText || subtitle || title];
  const contextOpening = splitCleanSentences(paragraphs[0])[0] || abstractText || subtitle || title;

  const midIdx = Math.min(paragraphs.length - 1, Math.max(0, Math.floor(paragraphs.length / 2)));
  const middleSentences = splitCleanSentences(paragraphs[midIdx] || '');
  const middleAnalysis = middleSentences[0] || findings[0] || abstractText || title;

  const lastParagraph = paragraphs[paragraphs.length - 1] || '';
  const prevLastParagraph = paragraphs.length >= 2 ? paragraphs[paragraphs.length - 2] : '';
  const lastSentences = splitCleanSentences(lastParagraph);
  const prevLastSentences = splitCleanSentences(prevLastParagraph);

  const rawPrimaryConclusion =
    (lastSentences.length > 0 ? lastSentences[lastSentences.length - 1] : '') ||
    (prevLastSentences.length > 0 ? prevLastSentences[prevLastSentences.length - 1] : '') ||
    findings[findings.length - 1] ||
    abstractText ||
    title;

  const rawSecondaryConclusion =
    findings.find((f) => f !== rawPrimaryConclusion && f.length > 28) ||
    (prevLastSentences.length > 0 ? prevLastSentences[0] : '') ||
    findings[0] ||
    middleAnalysis ||
    abstractText;

  const conclusionPrimary = shortenClause(
    rawPrimaryConclusion.length >= 36 ? rawPrimaryConclusion : `${title}: ${abstractText}`,
    165
  );

  const conclusionSecondary = shortenClause(
    rawSecondaryConclusion.length >= 36 && rawSecondaryConclusion !== conclusionPrimary
      ? rawSecondaryConclusion
      : isTr
        ? `${article.category} ekseninde incelenen bulgular, kavramsal tutarlılığı deneysel ve kuramsal sınama ile birleştirir.`
        : `Findings in ${article.category} connect conceptual consistency with empirical and theoretical testability.`,
    165
  );

  return {
    title,
    subtitle,
    abstractText,
    paragraphs,
    findings,
    methodologyNote,
    conclusionPrimary,
    conclusionSecondary,
    contextOpening,
    middleAnalysis,
  };
}

/**
 * Extracts a full, rich, non-truncated comprehensive summary for an article in ANY of the 12 world languages,
 * and computes speaker-calibrated chapter durations dynamically (no artificial 10-minute cap).
 */
export function buildArticleComprehensiveVideo(
  article: Article,
  language: LanguageCode,
  translatedOverride?: TranslatedArticleContent | null
): ArticleComprehensiveVideoBundle {
  const pack = getSummaryLocalePack(language);
  const {
    title,
    subtitle,
    abstractText,
    paragraphs,
    findings,
    methodologyNote,
    conclusionPrimary,
    conclusionSecondary,
    contextOpening,
    middleAnalysis,
  } = extractArticleHolisticConclusion(article, language, translatedOverride);

  const eq = article.simulation?.equationLatex || 'Ψ(x,t) → Φ';
  const simTitle = cleanSentence(
    getLocalizedText(article.simulation?.title || { tr: title, en: title }, language)
  );
  const simParams = article.simulation?.parameters || [];
  const simType: SimulationType = article.simulation?.type || 'quantum';

  const domainRoles = pack.domainRoles[simType];
  const domainHint = pack.domainSummary[simType];
  const domainFallbacks = pack.domainFallbacks[simType];
  const domainBeats = pack.domainBeats[simType];

  const paramSummary =
    simParams.length > 0
      ? simParams
          .slice(0, 3)
          .map((p) => `${getLocalizedText(p.label, language)}: ${p.defaultValue} ${p.unit}`.trim())
          .join(' · ')
      : domainHint;

  // Partition ALL article paragraphs cleanly into 4 narrative arcs so NO core argument is lost
  const totalP = paragraphs.length;
  const sliceRange = (startRatio: number, endRatio: number): string[] => {
    if (totalP === 0) return [];
    const s = Math.min(totalP - 1, Math.floor(startRatio * totalP));
    const e = Math.min(totalP, Math.max(s + 1, Math.ceil(endRatio * totalP)));
    return paragraphs.slice(s, e);
  };

  // Extract a dense but fluent synthesis of each paragraph band (first 2–3 informative sentences per paragraph, bounded neatly)
  const condenseBand = (band: string[], maxChars = 760): string => {
    const picked: string[] = [];
    let len = 0;
    for (const para of band) {
      const sents = splitCleanSentences(para);
      const candidates = sents.length > 0 ? sents.slice(0, 3) : [para];
      for (const s of candidates) {
        if (picked.includes(s)) continue;
        if (len + s.length > maxChars && picked.length >= 2) break;
        picked.push(s);
        len += s.length + 1;
      }
      if (len >= maxChars) break;
    }
    return picked.join(' ').trim();
  };

  const openingBandText = condenseBand(sliceRange(0, 0.3), 680) || abstractText || contextOpening;
  const mechanismBandText =
    condenseBand(sliceRange(0.28, 0.56), 680) || middleAnalysis || openingBandText;
  const deepBandText =
    condenseBand(sliceRange(0.54, 0.84), 680) ||
    findings[0] ||
    middleAnalysis ||
    openingBandText;
  const closingBandText =
    condenseBand(sliceRange(0.8, 1.0), 640) ||
    `${conclusionPrimary} ${conclusionSecondary !== conclusionPrimary ? conclusionSecondary : ''}`.trim();

  const allFindingsText =
    findings.length > 0
      ? findings.map((f, i) => `${i + 1}. ${f}`).join(' ')
      : deepBandText || abstractText;

  const baseChips = extractArticleConceptChips(`${title} ${abstractText}`, domainFallbacks, 3);

  const chapterDrafts: Array<{
    heading: string;
    narrationText: string;
    caption: string;
    bullets: [string, string];
    mode: EntityInteractionMode;
    showPortrait: boolean;
    isConclusion?: boolean;
    chipSource: string;
  }> = [
    {
      heading: pack.headings[0],
      narrationText: cleanSentence(
        `${pack.introLead(title, article.category)} ${subtitle ? `${subtitle}.` : ''} ${abstractText}`
      ),
      caption: shortenClause(abstractText || subtitle || title, 210),
      bullets: [
        `${article.category} · ${title}`,
        shortenClause(subtitle || contextOpening, 118),
      ],
      mode: 'INTRO_GATHER',
      showPortrait: true,
      chipSource: `${title} ${abstractText}`,
    },
    {
      heading: pack.headings[1],
      narrationText: cleanSentence(`${pack.problemLead} ${openingBandText}`),
      caption: shortenClause(openingBandText, 210),
      bullets: [shortenClause(contextOpening, 112), shortenClause(openingBandText, 112)],
      mode: 'CONTEXT_CONTRAST',
      showPortrait: false,
      chipSource: `${openingBandText} ${title}`,
    },
    {
      heading: pack.headings[2],
      narrationText: cleanSentence(`${pack.mechanismLead} ${domainBeats[2]} ${mechanismBandText}`),
      caption: shortenClause(mechanismBandText, 210),
      bullets: [domainRoles, shortenClause(mechanismBandText, 112)],
      mode: 'FIRST_CONTACT',
      showPortrait: false,
      chipSource: `${mechanismBandText} ${domainRoles}`,
    },
    {
      heading: `${pack.headings[3]} · ${shortenClause(simTitle, 32)}`,
      narrationText: cleanSentence(
        `${pack.modelLead(simTitle, paramSummary)} ${domainHint}. ${methodologyNote}`
      ),
      caption: shortenClause(`${domainHint}. ${paramSummary}`, 210),
      bullets: [shortenClause(domainHint, 112), shortenClause(paramSummary, 112)],
      mode: 'EQUATION_COUPLE',
      showPortrait: false,
      chipSource: `${simTitle} ${paramSummary}`,
    },
    {
      heading: pack.headings[4],
      narrationText: cleanSentence(`${pack.deepLead} ${deepBandText}`),
      caption: shortenClause(deepBandText, 210),
      bullets: [shortenClause(deepBandText, 112), shortenClause(middleAnalysis, 112)],
      mode: 'DEEP_FLOW',
      showPortrait: false,
      chipSource: `${deepBandText} ${middleAnalysis}`,
    },
    {
      heading: pack.headings[5],
      narrationText: cleanSentence(`${pack.findingsLead} ${allFindingsText}`),
      caption: shortenClause(findings[0] || allFindingsText, 210),
      bullets: [
        shortenClause(findings[0] || deepBandText, 114),
        shortenClause(findings[1] || findings[0] || conclusionSecondary, 114),
      ],
      mode: 'EVIDENCE_PROOF',
      showPortrait: false,
      chipSource: `${allFindingsText}`,
    },
    {
      heading: pack.headings[6],
      narrationText: cleanSentence(
        `${pack.conclusionLead} ${closingBandText} ${
          closingBandText.includes(conclusionPrimary.slice(0, 35)) ? '' : conclusionPrimary
        }`
      ),
      caption: shortenClause(conclusionPrimary, 210),
      bullets: [shortenClause(conclusionPrimary, 116), shortenClause(conclusionSecondary, 114)],
      mode: 'HOLISTIC_SYNTHESIS',
      showPortrait: false,
      isConclusion: true,
      chipSource: `${conclusionPrimary} ${conclusionSecondary}`,
    },
    {
      heading: pack.headings[7],
      narrationText: cleanSentence(pack.closingText),
      caption: shortenClause(pack.closingText, 210),
      bullets: pack.closingBullets,
      mode: 'OPEN_INQUIRY',
      showPortrait: true,
      chipSource: `${title} ${conclusionPrimary}`,
    },
  ];

  // Dynamically accumulate startSec/endSec based on actual spoken narration length in this language (no fixed cap!)
  let cursorSec = 0;
  let totalSentences = 0;

  const scenes: ExplainerVideoScene[] = chapterDrafts.map((draft, idx) => {
    const narrationSentences = splitNarrationSentences(draft.narrationText);
    const estDur = estimateSpeechDurationSec(draft.narrationText, language, 1.0);
    const startSec = cursorSec;
    const endSec = startSec + estDur;
    cursorSec = endSec;
    totalSentences += narrationSentences.length;

    return {
      index: idx,
      startSec,
      endSec,
      estimatedDurationSec: estDur,
      heading: draft.heading,
      caption: draft.caption,
      narrationText: draft.narrationText,
      narrationSentences,
      keyEquation: eq,
      bulletPoints: draft.bullets,
      visualTheme: simType,
      showAuthorPortrait: draft.showPortrait,
      isConclusionScene: draft.isConclusion,
      entityRoleTag: domainRoles,
      entityStoryBeat: domainBeats[idx] || domainBeats[0],
      interactionMode: draft.mode,
      conceptChips: extractArticleConceptChips(draft.chipSource, baseChips, 3),
    };
  });

  const fullComprehensiveSummaryText = scenes
    .map((sc) => `${sc.heading}\n${sc.narrationText}`)
    .join('\n\n');

  const totalWords = fullComprehensiveSummaryText
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    language,
    articleTitle: title,
    articleSubtitle: subtitle,
    fullComprehensiveSummaryText,
    totalEstimatedDurationSec: Math.max(15, cursorSec),
    totalSentences,
    totalWords,
    scenes,
  };
}

export function buildArticleExplainerScenes(
  article: Article,
  language: LanguageCode,
  translatedOverride?: TranslatedArticleContent | null
): ExplainerVideoScene[] {
  return buildArticleComprehensiveVideo(article, language, translatedOverride).scenes;
}


interface DomainQuizBank {
  q1Distractors: string[];
  q2Correct: string;
  q2Distractors: string[];
  q3Distractors: string[];
  q4Correct: string;
  q4Distractors: string[];
}

function getDomainQuizBank(
  simType: SimulationType,
  language: LanguageCode,
  primaryParamLabel: string
): DomainQuizBank {
  const isTr = language === 'tr';

  if (isTr) {
    const bankTr: Record<SimulationType, DomainQuizBank> = {
      quantum: {
        q1Distractors: [
          'Gözlemciyle etkileşime giren kuantum sistemlerde faz uyumu ölçüm sıklığından bağımsız kalarak dalga girişimini sürekli keskinleştirir.',
          'Mikroskobik parçacıkların olasılık genlikleri, yalnızca makroskobik termal denge kurulduktan sonra tamamen deterministik klasik yörüngelere dönüşür.',
          'Dalga fonksiyonu çöküşü, sistem ile çevre arasındaki bilgi aktarımını ortadan kaldırarak yerel gizli değişkenlerin doğrudan ölçülmesini sağlar.',
        ],
        q2Correct:
          'Dedektör eşleşmesi veya yol-bilgisi erişimi arttıkça kuantum faz uyumu zayıflar; girişim saçakları silikleşerek istatistiksel dağılım klasik toplama yaklaşır.',
        q2Distractors: [
          'Dedektör eşleşme katsayısı büyüdükçe yol-bilgisi belirsizliği artar ve bu durum çift yarık girişim kontrastını maksimum değere sabitler.',
          'Ölçüm aygıtının faz kayması yalnızca momentum uzayını etkilediğinden konum uzayındaki olasılık dağılımında dekoherans gözlenmez.',
          'Planck sabiti sınırında sistem entropisi azaldıkça kuantum süperpozisyon bileşenleri birbirini güçlendirerek klasik sınırı ortadan kaldırır.',
        ],
        q3Distractors: [
          'Kuantum ölçüm problemi yalnızca deneysel sensör çözünürlüğünün yetersizliğinden doğar; ideal cihazlarda eşzamanlı kesin konum-momentum ölçülür.',
          'Çevreyle kurulan kuantum dolanıklığı, alt sistemin indirgenmiş yoğunluk matrisindeki köşegen dışı faz terimlerini yapay olarak büyütür.',
          'Epistemolojik belirsizlik fiziksel evrenin matematiksel modelinden tamamen bağımsız olup yalnızca insan algısının zamansal gecikmesinden kaynaklanır.',
        ],
        q4Correct:
          `Kuramsal varsayımları "${primaryParamLabel}" gibi parametre değişimleri altında girişim kontrastı ve dekoherans ölçütleriyle sınarken farklı yorumları açık tutmaktır.`,
        q4Distractors: [
          'Tek bir ölçüm yorumunu aksiyomatik kesinlik olarak kabul edip parametre duyarlılığı testlerini kuram dışı saymaktır.',
          'Matematiksel olasılık dağılımlarını ampirik gözlem verilerinden ayırarak yalnızca sözel metafizik çıkarımlarla yetinmektir.',
          'Süperpozisyon varsayımlarını deneysel yanlışlanabilirlik koşulundan muaf tutarak alternatif fiziksel modelleri inceleme dışı bırakmaktır.',
        ],
      },
      higgs: {
        q1Distractors: [
          'Enerji yoğunluğu yükseldikçe skaler alan vakum beklenti değeri mutlak maksimuma çıkar ve tüm ayar bozonlarının kütle farkı sıfırlanır.',
          'Kendiliğinden simetri kırılımı, yalnızca temel fermiyonların kütlesiz kalmasını zorunlu kılan yüksek sıcaklık faz geçişlerinde ortaya çıkar.',
          'Ayar değişmezliği ilkesi, simetri kırıldıktan sonra potansiyel tabanının tekil ve simetrik bir merkez noktada sabitlenmesini gerektirir.',
        ],
        q2Correct:
          'Sıcaklık kritik eşik değerinin altına indiğinde skaler potansiyelin simetrisi kendiliğinden kırılır ve alan sıfır olmayan bir vakum taban değerine yerleşir.',
        q2Distractors: [
          'Kritik sıcaklığın üzerinde alan potansiyeli çift kuyulu bir yapıya bürünerek parçacık kütlelerini kalıcı olarak en yüksek seviyeye kilitler.',
          'Kendiliğinden simetri kırılımı sırasında Goldstone kipleri skaler alandan tamamen kopar ve elektromanyetik alanı kütlesiz olmaktan çıkarır.',
          'Vakum beklenti değeri sıfıra yaklaştıkça elektrozayıf etkileşim menzili kısalır ve zayıf ayar bozonları kütlesiz fotonlarla özdeşleşir.',
        ],
        q3Distractors: [
          'Meksika şapkası potansiyelindeki taban çöküşü, Lagrange yoğunluğunun temel simetrisini matematiksel olarak da tamamen yok eder.',
          'Parçacıkların kütle kazanımı dış bir sürtünme kuvvetine benzer biçimde uzay-zaman boyunca hareket hızını doğrusal olarak yavaşlatır.',
          'Yüksek enerjili çarpışmalarda gözlenen ayar birleşimi, düşük enerjili evrende zayıf ve güçlü kuvvetlerin tamamen özdeş kaldığını kanıtlar.',
        ],
        q4Correct:
          `Ayar simetrisi ilkelerini "${primaryParamLabel}" eşik geçişleriyle birlikte nicel olarak test edip alternatif yüksek-enerji kuramlarına eleştirel alan tanımaktır.`,
        q4Distractors: [
          'Simetri kırılımı modellerini yalnızca düşük enerji ölçeğindeki tek bir parametre noktasıyla sınırlayıp faz geçişi analizini dışlamaktır.',
          'Lagrange formalizminin deneysel parçacık spektrumuyla karşılaştırılmasına gerek duymadan salt soyut simetri gruplarını esas almaktır.',
          'Yerleşik Standart Model kabullerini olası yeni fizik imzalarına karşı tartışmaya tamamen kapalı bir dogma olarak ele almaktır.',
        ],
      },
      holographic: {
        q1Distractors: [
          'Holografik ilkeye göre bir bölgedeki maksimum enformasyon entropisi çevreleyen yüzey alanından bağımsız olarak doğrudan hacmin küpüyle orantılıdır.',
          'AdS/CFT eşlenikliği, sınır teorisindeki kuantum bilginin olay ufku içinde tamamen geri döndürülemez biçimde yok olduğunu kanıtlar.',
          'Termodinamik entropi artışı, fiziksel sistemlerin mikro durum sayısını azaltarak evrensel bilgi taşıma kapasitesini mutlak sıfıra indirir.',
        ],
        q2Correct:
          'Bir uzay bölgesinin barındırabileceği azami enformasyon kapasitesi üç boyutlu hacmiyle değil, o hacmi çevreleyen sınır yüzeyinin alanıyla ölçeklenir.',
        q2Distractors: [
          'Bekenstein-Hawking sınırı aşıldığında ekstra bilgi hacmin merkezinde sıkışarak olay ufkunun yüzey alanını sıfıra doğru küçültür.',
          'Sınır yüzey alanı küçüldükçe sistemin birim hacimde depolayabileceği kuantum bit yoğunluğu üstel biçimde artış gösterir.',
          'Hacim içindeki kütleçekimsel dinamikler sınır düzeyindeki konformal alan teorisiyle yalnızca klasik Newton limitinde eşlenik olur.',
        ],
        q3Distractors: [
          'Kara delik buharlaşması sırasında açığa çıkan radyasyon, başlangıç kuantum durumuna dair hiçbir korelasyon veya faz bilgisi taşıyamaz.',
          'Landauer ilkesi, bir bit bilginin silinmesinin termodinamik olarak sıfır ısı yayılımıyla ve tamamen tersinir biçimde gerçekleştiğini gösterir.',
          'Bilgi ve entropi kavramları yalnızca bilişsel gözlemcinin öznel cehaletini ifade eder; fiziksel uzay-zaman geometrisiyle bağı yoktur.',
        ],
        q4Correct:
          `Entropi ve sınır-hacim ilişkilerini "${primaryParamLabel}" üzerinden nicel olarak sınarken kuantum kütleçekimi yaklaşımlarında açık sorgulamayı sürdürmektir.`,
        q4Distractors: [
          'Holografik dualiteyi yalnızca tek bir geometrik özel çözüme indirgeyip termodinamik sınır koşullarını inceleme dışı bırakmaktır.',
          'Enformasyon korunumu tartışmalarını deneysel ve matematiksel tutarlılık testlerinden ayırarak tek taraflı bir varsayıma kilitlemektir.',
          'Olay ufku ölçekleme yasalarını sabit varsayarak parametre duyarlılığı değişimlerinin entropi üzerindeki etkisini göz ardı etmektir.',
        ],
      },
      spacetime: {
        q1Distractors: [
          'Yüksek göreceli hızlarda hareket eden bir gözlemcinin yerel öz-zamanı, dış eylemsiz gözlemcinin saatine kıyasla her zaman daha hızlı akar.',
          'Blok evren modeli, ışık konisinin dışındaki uzaysal olayların nedensel sinyallerle geriye dönük olarak yeniden düzenlenebileceğini savunur.',
          'Kütleçekimsel alan şiddetlendikçe uzay-zaman metriğindeki eğrilik azalır ve zaman genişlemesi tüm koordinat sistemlerinde ortadan kalkar.',
        ],
        q2Correct:
          'Göreceli hız yükseldiğinde veya kütleçekim potansiyeli derinleştikçe yerel öz-zaman (proper time) uzak eylemsiz gözlemciye göre daha yavaş ilerler.',
        q2Distractors: [
          'Işık hızına yaklaşıldığında Lorentz faktörü bire yaklaşır ve hareketli saatler ile durgun saatler arasındaki süre farkı tamamen sıfırlanır.',
          'Minkowski ışık konisi diyagramında ışıktan hızlı (uzaysal) aralıklar gelecekten geçmişe doğrudan nedensel bilgi aktarımına olanak tanır.',
          'Genel görelilikte eşzamanlılık tüm eylemsiz ve ivmeli gözlemciler için mutlak olup koordinat dönüşümlerinden etkilenmez.',
        ],
        q3Distractors: [
          'Zaman oku fenomeni temel mikroskobik alan denklemlerinin zaman tersinmezliğinden değil, ışık hızının her gözlemcide değişmesinden doğar.',
          'Uzay-zamanın dört boyutlu geometrik yapısı yalnızca soyut bir hesaplama kolaylığıdır; fiziksel yörüngeler üzerinde ölçülebilir bir etkisi yoktur.',
          'Evrenin genişleme ivmesi arttıkça lokal kozmolojik ufuk genişler ve tüm uzak galaksiler nedensel temas bölgesine geri döner.',
        ],
        q4Correct:
          `Göreceli metrik değişmezliği ile felsefi zaman yorumlarını "${primaryParamLabel}" parametre testleriyle birleştirip bağımsız eleştirel analizi korumaktır.`,
        q4Distractors: [
          'Zaman felsefesi tartışmalarını özel ve genel göreliliğin matematiksel ışık konisi kısıtlarından tamamen yalıtarak yürütmektir.',
          'Metrik zaman genişlemesini yalnızca sezgisel günlük saat algısıyla ölçüp Lorentz dönüşümlerini geçersiz saymaktır.',
          'Koordinat seçimine bağlı sonuçları fiziksel gerçeklik kabul edip gözlemciden bağımsız değişmez büyüklükleri yok saymaktır.',
        ],
      },
      consciousness: {
        q1Distractors: [
          'Bilinçli deneyim yalnızca donanım saat hızının artırılmasıyla doğrusal biçimde ortaya çıkar ve alt sistem entegrasyonuna gereksinim duymaz.',
          'Bütünleşik enformasyon düzeyi (Φ), bir sistemdeki bileşenlerin birbirinden tamamen yalıtıldığı modüler yapılarda maksimum değerine ulaşır.',
          'Zihin felsefesindeki açıklama boşluğu, sözdizimsel sembol işleme kurallarının eksiksiz listelenmesiyle öznel deneyimi tamamen özdeşleştirir.',
        ],
        q2Correct:
          'Öznel deneyim ve bütünleşik enformasyon (Φ), izole işlem hızından ziyade sistem bileşenlerinin birbirine indirgenemez nedensel entegrasyonuna bağlıdır.',
        q2Distractors: [
          'İleri beslemeli ve iç geri bildirimi olmayan mantık kapılarının sayısı arttırıldıkça sistemin bütünleşik Φ değeri sınırsız biçimde yükselir.',
          'Yapay bir hesaplama mimarisi doğal dili akıcı biçimde ürettiği anda öznel farkındalık (qualia) fiziksel yasalarca otomatik olarak garanti edilir.',
          'Epistemik farkındalık yalnızca duyusal girdi frekansına indirgenir; içsel dünya modeli ve tahmin hatası minimizasyonu rol oynamaz.',
        ],
        q3Distractors: [
          'Hesaplamalı modeller ile biyolojik sinir ağları arasındaki tek fark enerji tüketimi olup nedensel topoloji öznel deneyim üzerinde etkilidir değildir.',
          'Özgür irade ve karar süreçleri, yalnızca deterministik kaosun öngörülemezliğinden değil mutlak rasgele kuantum gürültüsünden ibarettir.',
          'Bilinç çalışmaları nörobiyolojik ölçüm ve bilişim kuramından ayrıştırılarak yalnızca içebakışçı tanımlarla kesin sonuca bağlanabilir.',
        ],
        q4Correct:
          `Yapay zeka ve bilinç kuramlarını "${primaryParamLabel}" duyarlılığı üzerinden hesapsal ve felsefi ölçütlerle sınarken düşünce hürriyetini esas almaktır.`,
        q4Distractors: [
          'Bilincin fiziksel ya da hesaplamalı doğasına dair tek bir kuramı tartışmasız mutlak gerçek ilan ederek alternatif yaklaşımları dışlamaktır.',
          'Davranışsal dil çıktısını içsel nedensel entegrasyon analizinin tamamen yerine koyarak yapısal ölçütleri gereksiz görmektir.',
          'Zihin-beden ilişkisinde deneysel nörobilim bulgularını kuramsal tutarlılık sorgulamalarından tamamen koparmaktır.',
        ],
      },
      chaos: {
        q1Distractors: [
          'Deterministik doğrusal olmayan sistemlerde başlangıç koşullarındaki küçük sapmalar zaman ilerledikçe sönümlenerek tek sabit yörüngeye birleşir.',
          'Kaos kuramı, doğadaki karmaşık sistemlerin hiçbir matematiksel kurala uymadığını ve tüm yerel yörüngelerin saf rastgelelik ürettiğini gösterir.',
          'Pozitif Lyapunov üssü, sistemin uzun vadeli davranışının başlangıç belirsizliğinden etkilenmeden sonsuza dek kesin biçimde hesaplanabileceğini kanıtlar.',
        ],
        q2Correct:
          'Tamamen deterministik kurallarla yönetilen doğrusal olmayan sistemlerde bile başlangıç koşullarına üstel hassasiyet uzun vadeli öngörü ufkunu sınırlar.',
        q2Distractors: [
          'Doğrusal olmayan geri besleme terimleri eklendikçe faz uzayındaki garip çekerler dağılır ve tüm yörüngeler basit periyodik döngülere kilitlenir.',
          'Lyapunov üssü pozitif değer aldığında komşu yörüngeler zamanla birbirine yaklaşarak sistemin öngörülebilirlik süresini sonsuza uzatır.',
          'Öngörülemezlik yalnızca sisteme dışarıdan eklenen stokastik gürültüden kaynaklanır; saf deterministik denklemlerde çatallanma gerçekleşmez.',
        ],
        q3Distractors: [
          'Karmaşık sistemlerdeki ani faz geçişleri yalnızca doğrusal süperpozisyon ilkesinin doğrudan toplanabilir bir sonucudur.',
          'Başlangıç koşulu hassasiyeti, geçmişteki nedensel zincirlerin fiziksel olarak geçersiz olduğunu ve doğa yasalarının kesintiye uğradığını gösterir.',
          'Etik ve özgürlük tartışmaları dinamik sistemlerin kısıt ve olasılık uzaylarından tamamen bağımsız, nedensellik dışı alanlarda konumlanır.',
        ],
        q4Correct:
          `Deterministik yasalar ile öngörü ufkunun sınırlarını "${primaryParamLabel}" parametre duyarlılığıyla test edip açık eleştirel sorgulamayı korumaktır.`,
        q4Distractors: [
          'Determinizmi mutlak uzun-vadeli öngörülebilirlikle özdeşleştirerek doğrusal olmayan hassasiyet analizlerini geçersiz saymaktır.',
          'Kaos ve karmaşıklık modellerini tek bir başlangıç verisiyle çalıştırıp parametre ve sapma duyarlılığını incelememektir.',
          'Felsefi özgürlük ve determinizm yorumlarında bilimsel veri ve model sınırlarını tamamen göz ardı etmektir.',
        ],
      },
      software: {
        q1Distractors: [
          'Yapay zeka destekli karar sistemlerinde tüm çıktı şemalarını ve domain kısıtlarını kaldırmak doğruluğu her bağlamda maksimize eder.',
          'Örnekleme sıcaklığı (temperature) yükseldikçe algoritmik çıktılar daha belirlenimci hale gelir ve yapılandırılmış şema hataları sıfırlanır.',
          'Modüler mimari yerine tüm iş mantığını tek doğrulanmamış serbest metin bloğunda toplamak sistem güvenilirliğini artırır.',
        ],
        q2Correct:
          'Açık alan kısıtları, modüler doğrulama ve belirlenimci şema denetimi, karar destek sistemlerinin güvenilirliğini ve tekrarlanabilirliğini artırır.',
        q2Distractors: [
          'Sistem kısıt ağırlıkları devre dışı bırakıldığında bağlam dışı varsayımlar azalır ve çıktı biçimi kendiliğinden tutarlı hale gelir.',
          'Çok aşamalı kontrol adımlarının kaldırılması her zaman gerçek dünya kısıtlarıyla çelişmeyen eksiksiz öneriler üretilmesini sağlar.',
          'Yapılandırılmış veri şemaları yalnızca görsel sunumu etkiler; çıkarım doğruluğu veya kullanıcı güvenliği üzerinde ölçülebilir bir rolü yoktur.',
        ],
        q3Distractors: [
          'Otomatik yazılım asistanlarının ürettiği her çıktı kullanıcı denetimi ve alan uzmanlığı kontrolüne gerek kalmadan doğrudan kesin kabul edilmelidir.',
          'Kullanıcı parametrelerinin ve kısıt profillerinin yoksayılması kişiselleştirme kalitesini sistem genelinde otomatik olarak iyileştirir.',
          'Gerçek zamanlı geri bildirim döngüleri sistem kararlılığını bozduğu için tek yönlü statik şablonlarla sınırlı kalınmalıdır.',
        ],
        q4Correct:
          `Yazılım mimarisini "${primaryParamLabel}" gibi kısıt parametreleriyle test ederken insan merkezli şeffaflık ve eleştirel doğrulama ilkesini sürdürmektir.`,
        q4Distractors: [
          'Model çıktılarının doğrulama katmanlarını kaldırarak her öneriyi sorgusuz biçimde nihai karar olarak uygulamaktır.',
          'Parametre ayarlamalarını yalnızca rastgele denemelerle sınırlayıp tekrarlanabilir test ölçütlerini kullanmamaktır.',
          'Kullanıcı tercihleri ve bağlamsal güvenlik sınırlarını hesaplama verimliliği adına sistem dışında bırakmaktır.',
        ],
      },
    };
    return bankTr[simType] || bankTr.quantum;
  }

  const bankEn: Record<SimulationType, DomainQuizBank> = {
    quantum: {
      q1Distractors: [
        'Increasing detector coupling with a quantum system perpetually sharpens interference fringes regardless of measurement rate.',
        'Probability amplitudes strictly collapse into classical Newtonian orbits only after full macroscopic thermal equilibrium.',
        'Wavefunction collapse removes environmental entanglement so that local hidden variables become directly measurable.',
      ],
      q2Correct:
        'As detector coupling or which-path information grows, phase coherence weakens and interference fringes approach a classical probability sum.',
      q2Distractors: [
        'Stronger detector coupling lowers which-path precision and locks interference fringe contrast at its theoretical maximum.',
        'Phase shifts in a measurement apparatus affect only momentum space, leaving positional probability distributions free from decoherence.',
        'Near the Planck scale, decreasing entropy amplifies coherent superposition terms and eliminates the classical correspondence limit.',
      ],
      q3Distractors: [
        'The quantum measurement problem stems solely from sensor hardware noise; ideal instruments measure exact conjugate variables jointly.',
        'Environmental entanglement artificially amplifies off-diagonal phase coherence terms inside the reduced density matrix.',
        'Epistemological uncertainty is detached from physical state evolution and reflects only human perceptual latency.',
      ],
      q4Correct:
        `Testing theoretical assumptions across parameter shifts such as "${primaryParamLabel}" via decoherence bounds while keeping inquiry open.`,
      q4Distractors: [
        'Treating a single measurement interpretation as axiomatic certainty and excluding parameter sensitivity tests.',
        'Detaching mathematical probability amplitudes from empirical data in favor of purely non-testable claims.',
        'Shielding superposition postulates from falsifiability criteria and dismissing competing physical frameworks.',
      ],
    },
    higgs: {
      q1Distractors: [
        'As energy density increases, the scalar vacuum expectation value maximizes and eliminates mass splitting across gauge bosons.',
        'Spontaneous symmetry breaking occurs solely during high-temperature phase transitions that enforce massless fermions.',
        'Gauge invariance requires the post-transition scalar potential minimum to remain fixed at a symmetric zero origin.',
      ],
      q2Correct:
        'Below the critical thermal threshold, scalar potential symmetry breaks spontaneously and settles at a non-zero vacuum expectation value.',
      q2Distractors: [
        'Above the critical threshold, the double-well potential deepens and permanently locks particle masses at peak values.',
        'During symmetry breaking, Goldstone modes decouple entirely and leave weak gauge bosons strictly massless.',
        'As the vacuum expectation value approaches zero, electroweak range shrinks and weak bosons merge identically with photons.',
      ],
      q3Distractors: [
        'Settling into an asymmetric well mathematically erases the underlying gauge symmetry of the Lagrangian itself.',
        'Mass acquisition operates like classical mechanical drag that steadily decelerates particles through flat spacetime.',
        'High-energy electroweak unification proves weak and electromagnetic forces stay indistinguishable at ambient temperatures.',
      ],
      q4Correct:
        `Testing gauge-symmetry thresholds quantitatively via parameters like "${primaryParamLabel}" while staying open to beyond-Standard-Model evidence.`,
      q4Distractors: [
        'Restricting symmetry-breaking analysis to one low-energy point without probing thermal phase-transition dynamics.',
        'Relying strictly on abstract group theory without comparing predicted mass spectra against collider observations.',
        'Treating existing field-theoretic assumptions as immune to high-precision experimental falsification.',
      ],
    },
    holographic: {
      q1Distractors: [
        'The holographic bound states maximum information entropy scales directly with three-dimensional volume cubed rather than boundary area.',
        'AdS/CFT duality demonstrates that quantum information crossing an event horizon is permanently erased from unitary evolution.',
        'Entropy growth contracts available microstate counts and forces total information capacity toward absolute zero.',
      ],
      q2Correct:
        'Maximum information capacity inside a spatial region scales with its bounding surface area rather than its three-dimensional volume.',
      q2Distractors: [
        'Exceeding the Bekenstein bound compresses excess bits toward the center while shrinking the bounding horizon area to zero.',
        'Shrinking the boundary surface area increases volumetric quantum bit density exponentially without gravitational collapse.',
        'Bulk gravitational dynamics match boundary conformal field theories solely within the non-relativistic Newtonian limit.',
      ],
      q3Distractors: [
        'Hawking radiation emitted during black hole evaporation carries zero quantum correlation with the initial infalling state.',
        'Landauer’s principle proves erasing one bit of information requires zero thermodynamic heat dissipation in closed cycles.',
        'Physical entropy measures solely human ignorance and bears no quantitative connection to spacetime horizon geometry.',
      ],
      q4Correct:
        `Evaluating area-law entropy bounds through "${primaryParamLabel}" while maintaining critical openness across quantum-gravity proposals.`,
      q4Distractors: [
        'Reducing holographic dualities to one idealized metric while ignoring boundary thermodynamic constraints.',
        'Separating information-conservation debates from quantitative consistency checks in favor of fixed assumptions.',
        'Treating horizon scaling laws as invariant even when extreme parameter regimes alter surface geometry.',
      ],
    },
    spacetime: {
      q1Distractors: [
        'An observer moving at relativistic velocity experiences proper time ticking strictly faster than a distant inertial clock.',
        'The block-universe framework implies spacelike-separated events can be causally reordered via superluminal signaling.',
        'Stronger gravitational fields flatten metric curvature and eliminate proper-time differences across all frames.',
      ],
      q2Correct:
        'Under higher relativistic velocity or deeper gravitational potential, local proper time dilates relative to a distant inertial observer.',
      q2Distractors: [
        'Approaching light speed drives the Lorentz factor to unity and erases elapsed proper-time divergence between frames.',
        'Minkowski light cones allow spacelike intervals to transmit causal information backward into the observer’s past.',
        'General relativity preserves universal simultaneity independent of relative motion or gravitational potential.',
      ],
      q3Distractors: [
        'The thermodynamic arrow of time arises from non-constant light speed rather than macroscopic boundary entropy.',
        'Four-dimensional spacetime geometry serves merely as a notational device without measurable effects on clock paths.',
        'Accelerated cosmic expansion expands causal horizons so all distant galaxies re-enter mutual light cones.',
      ],
      q4Correct:
        `Synthesizing invariant metric structure with philosophical time models via "${primaryParamLabel}" tests and independent critical inquiry.`,
      q4Distractors: [
        'Debating temporal philosophy in isolation from special and general relativistic light-cone constraints.',
        'Evaluating gravitational time dilation solely via everyday intuition while setting Lorentz transformations aside.',
        'Mistaking coordinate-dependent artifacts for observer-independent geometric invariants.',
      ],
    },
    consciousness: {
      q1Distractors: [
        'Conscious awareness emerges linearly from raw processor clock speed without requiring causal integration across subsystems.',
        'Integrated information (Φ) reaches its maximum inside strictly decoupled feed-forward architectures with zero internal feedback.',
        'The explanatory gap reduces phenomenal experience completely to syntactic symbol manipulation speed.',
      ],
      q2Correct:
        'Integrated information (Φ) and phenomenal experience hinge on irreducible causal integration across components rather than isolated clock rate.',
      q2Distractors: [
        'Adding disconnected feed-forward logic gates automatically drives integrated information Φ toward infinity.',
        'Fluently generating natural language guarantees subjective qualia under every purely syntactic architecture.',
        'Epistemic awareness depends exclusively on sensory input bandwidth rather than internal predictive modeling.',
      ],
      q3Distractors: [
        'Biological neural networks and algorithmic pipelines differ solely in power consumption rather than causal topology.',
        'Free-will debates depend exclusively on pure stochastic noise rather than structured constraint spaces.',
        'Consciousness research can reach final certainty via introspection alone without neuroscience or information theory.',
      ],
      q4Correct:
        `Testing AI and philosophy-of-mind hypotheses against "${primaryParamLabel}" sensitivity while preserving full freedom of thought.`,
      q4Distractors: [
        'Declaring one computational or philosophical theory of mind dogmatic and excluding rival frameworks.',
        'Treating surface behavioral output as a complete substitute for structural causal-integration analysis.',
        'Isolating neuroscientific evidence from conceptual consistency and falsifiability evaluations.',
      ],
    },
    chaos: {
      q1Distractors: [
        'Tiny initial perturbations in deterministic nonlinear systems always decay exponentially onto a single static trajectory.',
        'Chaos theory proves complex systems obey no underlying equations and generate pure uncorrelated white noise.',
        'A positive Lyapunov exponent guarantees infinite long-horizon predictability from approximate initial states.',
      ],
      q2Correct:
        'Even strictly deterministic nonlinear dynamics display sensitive dependence on initial conditions, bounding long-term predictability.',
      q2Distractors: [
        'Stronger nonlinear feedback collapses strange attractors onto simple, globally stable periodic orbits.',
        'When Lyapunov exponents turn positive, neighboring phase-space trajectories converge indefinitely.',
        'Diverging forecasts arise solely from external random noise rather than deterministic nonlinear bifurcations.',
      ],
      q3Distractors: [
        'Sudden phase transitions in complex systems follow directly from linear superposition additivity.',
        'Sensitive dependence demonstrates that physical laws break down and causal conservation no longer holds.',
        'Philosophical debates on agency operate entirely outside dynamical constraint topologies and attractors.',
      ],
      q4Correct:
        `Testing predictability horizons against "${primaryParamLabel}" perturbations while keeping deterministic and philosophical inquiry open.`,
      q4Distractors: [
        'Equating mathematical determinism with unlimited forecasting precision and ignoring sensitivity exponents.',
        'Running complex models from one fixed seed without inspecting bifurcation thresholds or perturbation growth.',
        'Discarding empirical dynamical boundaries when analyzing complexity and agency.',
      ],
    },
    software: {
      q1Distractors: [
        'Removing domain constraints and schema validation maximizes factual reliability across every AI output.',
        'Maximizing sampling temperature makes structured outputs strictly deterministic with zero format drift.',
        'Merging all system logic into unvalidated free-form prompts increases auditability and engineering rigor.',
      ],
      q2Correct:
        'Explicit domain constraints, modular validation, and deterministic schema checks strengthen reliability and repeatability.',
      q2Distractors: [
        'Disabling constraint weights reduces hallucination rates and automatically preserves domain consistency.',
        'Eliminating multi-stage verification ensures domain recommendations never conflict with user safety bounds.',
        'Structured schemas affect visual styling only without measurable impact on accuracy or reproducibility.',
      ],
      q3Distractors: [
        'Automated assistant outputs should be applied as final authority without domain verification or human review.',
        'Ignoring individual user profiles and boundary parameters uniformly improves personalization quality.',
        'Real-time feedback loops destabilize modular pipelines and should be replaced with static text blocks.',
      ],
      q4Correct:
        `Validating pipeline behavior across "${primaryParamLabel}" constraints while upholding transparency, user agency, and rigorous verification.`,
      q4Distractors: [
        'Bypassing schema and safety layers to treat unverified outputs as final production decisions.',
        'Tuning system parameters through unmeasured trial-and-error without reproducible benchmarks.',
        'Omitting contextual constraints and user-specific boundaries for minor speed gains.',
      ],
    },
  };
  return bankEn[simType] || bankEn.quantum;
}

export function buildArticleQuizQuestions(
  article: Article,
  language: LanguageCode
): ArticleQuizQuestion[] {
  const isTr = language === 'tr';
  const simType = article.simulation?.type || 'quantum';
  const simTitle = getLocalizedText(
    article.simulation?.title || article.title,
    language
  );
  const primaryParam = article.simulation?.parameters?.[0];
  const primaryParamLabel = primaryParam
    ? getLocalizedText(primaryParam.label, language)
    : simTitle;

  const {
    title,
    findings,
    conclusionPrimary,
    conclusionSecondary,
    middleAnalysis,
  } = extractArticleHolisticConclusion(article, language);

  const bank = getDomainQuizBank(simType, language, primaryParamLabel);

  // Ensure Q3 correct choice never duplicates Q1 correct choice word-for-word
  const synthesisCorrect =
    conclusionSecondary !== conclusionPrimary
      ? conclusionSecondary
      : shortenClause(
          findings[0] || middleAnalysis || conclusionPrimary,
          152
        );

  // Q1: Holistic Conclusion of THIS specific article
  const q1 = rotateOptionsDeterministically(
    conclusionPrimary,
    bank.q1Distractors,
    `${article.id}-holistic-q1-${language}`
  );

  // Q2: Theoretical / Simulation Mechanism tied to the overall model
  const q2 = rotateOptionsDeterministically(
    bank.q2Correct,
    bank.q2Distractors,
    `${article.id}-mech-q2-${language}`
  );

  // Q3: Cross-Concept Synthesis linking key findings to holistic conclusion
  const q3 = rotateOptionsDeterministically(
    synthesisCorrect,
    bank.q3Distractors,
    `${article.id}-synth-q3-${language}`
  );

  // Q4: Methodological Verification, Falsifiability & Freedom of Thought
  const q4 = rotateOptionsDeterministically(
    bank.q4Correct,
    bank.q4Distractors,
    `${article.id}-method-q4-${language}`
  );

  return [
    {
      id: `${article.id}-quiz-1`,
      questionType: 'KEY_FINDING',
      prompt: isTr
        ? `“${title}” makalesinin bütünü ve kapanış argümanı değerlendirildiğinde ulaşılan temel kavramsal sonuç aşağıdakilerden hangisidir?`
        : `Considering the full scope and closing argument of "${title}", which statement best captures its overall conclusion?`,
      options: q1.options,
      correctIndex: q1.correctIndex,
      explanation: isTr
        ? `Makalenin genel sonucu: ${conclusionPrimary}`
        : `Holistic article conclusion: ${conclusionPrimary}`,
      freedomNote: isTr
        ? 'Bu sonuç metnin bütüncül analizini özetler; farklı bilimsel ve felsefi yorumlarınız için her zaman eleştirel değerlendirmeye açıktır.'
        : 'This summarizes the article’s overall argument while remaining open to your independent critical evaluation.',
    },
    {
      id: `${article.id}-quiz-2`,
      questionType: 'MODEL_MECHANISM',
      prompt: isTr
        ? `Makaledeki genel sonuca temel oluşturan "${simTitle}" modelinde (${primaryParamLabel}) belirleyici mekanizma aşağıdakilerden hangisidir?`
        : `Within the "${simTitle}" framework (${primaryParamLabel}) underpinning this article’s conclusion, which dynamic principle holds?`,
      options: q2.options,
      correctIndex: q2.correctIndex,
      explanation: isTr
        ? `Model dinamiği ve sonuç ilişkisi: ${bank.q2Correct}`
        : `Model mechanism alignment: ${bank.q2Correct}`,
      freedomNote: isTr
        ? 'Parametre sürgülerini yukarıdaki interaktif simülatörde değiştirerek bu davranışı bizzat doğrulayabilirsiniz.'
        : 'You can test this behavior directly by adjusting parameters in the interactive simulator above.',
    },
    {
      id: `${article.id}-quiz-3`,
      questionType: 'CONCEPTUAL_SYNTHESIS',
      prompt: isTr
        ? `Makalenin "${article.category}" eksenindeki temel bulguları ile çalışmadan çıkan genel sonuç bir arada ele alındığında hangi yargı metinle bütüncül olarak örtüşür?`
        : `When synthesizing the core findings in ${article.category} with the article’s overall conclusion, which judgment aligns with the text?`,
      options: q3.options,
      correctIndex: q3.correctIndex,
      explanation: isTr
        ? `Bütüncül sentez değerlendirmesi: ${synthesisCorrect}`
        : `Holistic synthesis insight: ${synthesisCorrect}`,
      freedomNote: isTr
        ? 'Kavramsal sentezler mutlak dogma değil, farklı disiplinler arası karşılaştırmaya açık analitik önermelerdir.'
        : 'Conceptual syntheses are testable analytical propositions rather than closed dogma.',
    },
    {
      id: `${article.id}-quiz-4`,
      questionType: 'CRITICAL_INQUIRY',
      prompt: isTr
        ? `Bu makaleden çıkan genel sonucun bilimsel ve felsefi tutarlılığını sınamak için benimsenecek en sağlıklı metodolojik yaklaşım hangisidir?`
        : `Which methodological approach most soundly tests the scientific and philosophical consistency of this article’s overall conclusion?`,
      options: q4.options,
      correctIndex: q4.correctIndex,
      explanation: isTr
        ? `Metodolojik doğrulama ilkesi: ${bank.q4Correct}`
        : `Methodological testing principle: ${bank.q4Correct}`,
      freedomNote: isTr
        ? 'Makale yanındaki soru ve itiraz kutusu aracılığıyla kendi eleştirel tezlerinizi özgürce paylaşabilirsiniz.'
        : 'You are welcome to submit alternative hypotheses or critiques at any time via the Q&A panel.',
    },
  ];
}
