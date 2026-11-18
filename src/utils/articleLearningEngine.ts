import { Article, LanguageCode, SimulationType } from '../types';
import { getLocalizedArray, getLocalizedText } from '../i18n/translations';

export const EXPLAINER_VIDEO_DURATION_SEC = 60;

export interface ExplainerVideoScene {
  index: number;
  startSec: number;
  endSec: number;
  heading: string;
  caption: string;
  keyEquation: string;
  bulletPoints: string[];
  visualTheme: SimulationType;
  showAuthorPortrait: boolean;
  isConclusionScene?: boolean;
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
    videoBadge: 'HTML5 ÖZGÜN AÇIKLAYICI VİDEO · 60 SN · TELİFSİZ',
    videoTitlePrefix: 'Görsel Anlatım Videosu (60 sn)',
    playBtn: 'Videoyu Oynat',
    pauseBtn: 'Duraklat',
    restartBtn: 'Başa Sar',
    voiceOnBtn: 'Sesli Anlatım Açık',
    voiceOffBtn: 'Sesli Anlatım',
    scriptToggleBtn: 'Senaryo & Altyazı',
    exportWebmBtn: 'HTML5 Video Kaydet (.webm)',
    stopRecordingBtn: 'Kaydı Bitir & İndir',
    recordingBtn: 'Kaydediliyor…',
    legalAndFreedomNote:
      'Bu 60 saniyelik video tamamen HTML5/Canvas ile üretilmiştir; yazar Emre Pelit’in kendi özgeçmiş fotoğrafı dışında hiçbir üçüncü taraf hakkını ihlal etmez ve her okurun bağımsız düşünce hürriyetine saygı duyar.',
    quizTitlePrefix: 'Etkileşimli Makale Testi',
    quizSubtitle: 'Makale genelinden çıkan bütüncül sonuçlarla uyumlu profesyonel çoktan seçmeli öz-değerlendirme',
    questionLabel: 'Soru',
    scoreLabel: 'Doğru',
    nextQuestionBtn: 'Sonraki Soru →',
    resetQuizBtn: 'Testi Yeniden Başlat',
    correctBadge: '✓ Doğru Yanıt — Makalenin Genel Sonucu ile Örtüşüyor',
    reviewBadge: '○ Analitik Açıklama — Kavramsal Değerlendirme',
    freedomQuizNote:
      'Not: Bu çoktan seçmeli sorular makale bütününden çıkan sonuçları pekiştirmek içindir; hiçbir ideolojik görüşü dayatmaz ve düşünce hürriyetini tam olarak korur.',
    completedBanner: 'Tebrikler! Makalenin genel sonucuna dayalı testi tamamladınız.',
    openViewBtn: '60 sn Video & Testi Aç',
  },
  en: {
    videoBadge: 'ORIGINAL HTML5 EXPLAINER VIDEO · 60s · ROYALTY-FREE',
    videoTitlePrefix: 'Visual Explainer Video (60s)',
    playBtn: 'Play Video',
    pauseBtn: 'Pause',
    restartBtn: 'Restart',
    voiceOnBtn: 'Voiceover On',
    voiceOffBtn: 'Voiceover',
    scriptToggleBtn: 'Script & Captions',
    exportWebmBtn: 'Save HTML5 Video (.webm)',
    stopRecordingBtn: 'Finish & Save Video',
    recordingBtn: 'Recording…',
    legalAndFreedomNote:
      'Generated purely with HTML5 Canvas and the author’s own CV portrait; respects all third-party legal rights and every reader’s freedom of thought.',
    quizTitlePrefix: 'Interactive Article Quiz',
    quizSubtitle: 'Professional multiple-choice assessment aligned with the article’s overall conclusion',
    questionLabel: 'Question',
    scoreLabel: 'Correct',
    nextQuestionBtn: 'Next Question →',
    resetQuizBtn: 'Restart Quiz',
    correctBadge: '✓ Verified Understanding — Aligns with Overall Article Conclusion',
    reviewBadge: '○ Analytical Review — Conceptual Distinction',
    freedomQuizNote:
      'These interactive questions exist solely for self-paced engagement and never restrict freedom of thought or independent critical inquiry.',
    completedBanner: 'Well done! You completed this article’s comprehensive quiz.',
    openViewBtn: 'Open 60s Video & Quiz',
  },
  es: {
    videoBadge: 'VIDEO EXPLICATIVO HTML5 ORIGINAL · 60s · LIBRE DE REGALÍAS',
    videoTitlePrefix: 'Video Explicativo Visual (60s)',
    playBtn: 'Reproducir',
    pauseBtn: 'Pausar',
    restartBtn: 'Reiniciar',
    voiceOnBtn: 'Voz Activa',
    voiceOffBtn: 'Narración',
    scriptToggleBtn: 'Guion y Subtítulos',
    exportWebmBtn: 'Guardar Video (.webm)',
    stopRecordingBtn: 'Finalizar y Guardar',
    recordingBtn: 'Grabando…',
    legalAndFreedomNote:
      'Generado íntegramente con HTML5 Canvas y el retrato oficial del autor; respeta todos los derechos legales y la libertad de pensamiento.',
    quizTitlePrefix: 'Cuestionario Interactivo del Artículo',
    quizSubtitle: 'Preguntas de opción múltiple alineadas con la conclusión general del artículo',
    questionLabel: 'Pregunta',
    scoreLabel: 'Aciertos',
    nextQuestionBtn: 'Siguiente →',
    resetQuizBtn: 'Reiniciar Test',
    correctBadge: '✓ Respuesta Correcta — Coincide con la Conclusión',
    reviewBadge: '○ Revisión Analítica',
    freedomQuizNote:
      'Preguntas diseñadas únicamente para el aprendizaje interactivo, respetando plenamente la libertad de pensamiento.',
    completedBanner: '¡Completaste la evaluación integral del artículo!',
    openViewBtn: 'Abrir Video (60s) y Test',
  },
  de: {
    videoBadge: 'ORIGINALES HTML5-ERKLÄRVIDEO · 60s · RECHTEFREI',
    videoTitlePrefix: 'Visuelles Erklärvideo (60s)',
    playBtn: 'Abspielen',
    pauseBtn: 'Pause',
    restartBtn: 'Neustart',
    voiceOnBtn: 'Sprache An',
    voiceOffBtn: 'Vorlesen',
    scriptToggleBtn: 'Skript & Untertitel',
    exportWebmBtn: 'Video Speichern (.webm)',
    stopRecordingBtn: 'Aufnahme Beenden',
    recordingBtn: 'Aufnahme…',
    legalAndFreedomNote:
      'Rein mit HTML5 Canvas und dem eigenen Lebenslauf-Porträt des Autors erstellt; wahrt alle Rechte Dritter sowie die Gedankenfreiheit.',
    quizTitlePrefix: 'Interaktiver Artikel-Test',
    quizSubtitle: 'Multiple-Choice-Fragen abgestimmt auf das Gesamtergebnis des Artikels',
    questionLabel: 'Frage',
    scoreLabel: 'Richtig',
    nextQuestionBtn: 'Nächste Frage →',
    resetQuizBtn: 'Test Zurücksetzen',
    correctBadge: '✓ Korrekt — Stimmt mit der Gesamtaussage überein',
    reviewBadge: '○ Analytische Erläuterung',
    freedomQuizNote:
      'Ausschließlich zur interaktiven Selbstprüfung erstellt; wahrt uneingeschränkte Gedanken- und Meinungsfreiheit.',
    completedBanner: 'Sie haben den Wissenstest zu diesem Artikel abgeschlossen.',
    openViewBtn: '60s-Video & Test öffnen',
  },
  fr: {
    videoBadge: 'VIDÉO EXPLICATIVE HTML5 ORIGINALE · 60s · LIBRE DE DROITS',
    videoTitlePrefix: 'Vidéo Explicative Visuelle (60s)',
    playBtn: 'Lire la Vidéo',
    pauseBtn: 'Pause',
    restartBtn: 'Recommencer',
    voiceOnBtn: 'Voix Active',
    voiceOffBtn: 'Narration',
    scriptToggleBtn: 'Script & Sous-titres',
    exportWebmBtn: 'Enregistrer (.webm)',
    stopRecordingBtn: 'Terminer et Sauvegarder',
    recordingBtn: 'Enregistrement…',
    legalAndFreedomNote:
      'Produit uniquement via HTML5 Canvas et le portrait CV de l’auteur ; respecte tous les droits légaux et la liberté de pensée.',
    quizTitlePrefix: 'Quiz Interactif de l’Article',
    quizSubtitle: 'Questionnaire à choix multiples aligné sur la conclusion générale de l’article',
    questionLabel: 'Question',
    scoreLabel: 'Correct',
    nextQuestionBtn: 'Suivant →',
    resetQuizBtn: 'Réinitialiser',
    correctBadge: '✓ Réponse Validée',
    reviewBadge: '○ Analyse Conceptuelle',
    freedomQuizNote:
      'Ce quiz sert uniquement à l’apprentissage interactif et respecte pleinement la liberté de pensée de chaque lecteur.',
    completedBanner: 'Bravo ! Vous avez terminé le quiz de cet article.',
    openViewBtn: 'Ouvrir Vidéo (60s) & Quiz',
  },
  ru: {
    videoBadge: 'ОРИГИНАЛЬНОЕ HTML5-ВИДЕО · 60с · БЕЗ НАРУШЕНИЯ ПРАВ',
    videoTitlePrefix: 'Видео-Пояснение (60с)',
    playBtn: 'Смотреть',
    pauseBtn: 'Пауза',
    restartBtn: 'Сначала',
    voiceOnBtn: 'Озвучка Вкл',
    voiceOffBtn: 'Озвучка',
    scriptToggleBtn: 'Сценарий и Субтитры',
    exportWebmBtn: 'Сохранить (.webm)',
    stopRecordingBtn: 'Завершить запись',
    recordingBtn: 'Запись…',
    legalAndFreedomNote:
      'Создано на чистом HTML5 Canvas с портретом автора из резюме; уважает права третьих лиц и свободу мысли.',
    quizTitlePrefix: 'Интерактивный Тест по Статье',
    quizSubtitle: 'Вопросы с выбором ответа на основе общего вывода статьи',
    questionLabel: 'Вопрос',
    scoreLabel: 'Верно',
    nextQuestionBtn: 'Далее →',
    resetQuizBtn: 'Начать заново',
    correctBadge: '✓ Верно — Соответствует общему выводу статьи',
    reviewBadge: '○ Аналитическое пояснение',
    freedomQuizNote:
      'Тест создан исключительно для интерактивного изучения при полном уважении свободы мысли.',
    completedBanner: 'Вы успешно завершили проверку знаний по статье.',
    openViewBtn: 'Открыть Видео (60с) и Тест',
  },
  ar: {
    videoBadge: 'فيديو توضيحي بـ HTML5 · 60 ثانية · خالٍ من انتهاك الحقوق',
    videoTitlePrefix: 'فيديو شرح بصري (60 ث)',
    playBtn: 'تشغيل',
    pauseBtn: 'إيقاف مؤقت',
    restartBtn: 'إعادة',
    voiceOnBtn: 'التعليق الصوتي مفعّل',
    voiceOffBtn: 'تعليق صوتي',
    scriptToggleBtn: 'النص والترجمة',
    exportWebmBtn: 'حفظ الفيديو (.webm)',
    stopRecordingBtn: 'إنهاء وحفظ الفيديو',
    recordingBtn: 'جارٍ التسجيل…',
    legalAndFreedomNote:
      'تم إنشاؤه بالكامل عبر HTML5 Canvas وصورة المؤلف من سيرته الذاتية مع احترام كامل لحقوق الآخرين وحرية الفكر.',
    quizTitlePrefix: 'اختبار تفاعلي للمقال',
    quizSubtitle: 'أسئلة اختيار من متعدد متوافقة مع الاستنتاج العام للمقال',
    questionLabel: 'سؤال',
    scoreLabel: 'صحيح',
    nextQuestionBtn: 'السؤال التالي ←',
    resetQuizBtn: 'إعادة الاختبار',
    correctBadge: '✓ إجابة صحيحة — متوافقة مع خلاصة المقال',
    reviewBadge: '○ توضيح تحليلي',
    freedomQuizNote:
      'هذه الأسئلة للتعلم التفاعلي والتقييم الذاتي فقط مع الاحترام الكامل لحرية الفكر.',
    completedBanner: 'أحسنت! لقد أكملت اختبار الفهم لهذا المقال.',
    openViewBtn: 'فتح الفيديو (60ث) والاختبار',
  },
  zh: {
    videoBadge: '原创 HTML5 科普视频 · 60秒 · 无版权争议',
    videoTitlePrefix: '可视化概念短片 (60秒)',
    playBtn: '播放视频',
    pauseBtn: '暂停',
    restartBtn: '重播',
    voiceOnBtn: '语音开启',
    voiceOffBtn: '语音讲解',
    scriptToggleBtn: '脚本与字幕',
    exportWebmBtn: '导出视频 (.webm)',
    stopRecordingBtn: '完成并保存',
    recordingBtn: '录制中…',
    legalAndFreedomNote:
      '完全由 HTML5 Canvas 与作者简历肖像生成，不侵犯任何第三方权益，并充分尊重每位读者的思想自由。',
    quizTitlePrefix: '文章互动测验',
    quizSubtitle: '与全文核心结论相契合的专业多项选择题评估',
    questionLabel: '问题',
    scoreLabel: '正确',
    nextQuestionBtn: '下一题 →',
    resetQuizBtn: '重新测试',
    correctBadge: '✓ 回答正确 — 与全文结论一致',
    reviewBadge: '○ 概念解析',
    freedomQuizNote: '测验仅用于互动学习，充分尊重自由思考与独立判断。',
    completedBanner: '恭喜！您已完成本篇文章的互动测验。',
    openViewBtn: '打开 60秒视频与测验',
  },
  ja: {
    videoBadge: 'HTML5 オリジナル解説動画 · 60秒 · 著作権配慮済み',
    videoTitlePrefix: 'ビジュアル解説動画 (60秒)',
    playBtn: '再生',
    pauseBtn: '一時停止',
    restartBtn: '最初から',
    voiceOnBtn: '音声オン',
    voiceOffBtn: '音声解説',
    scriptToggleBtn: 'スクリプト・字幕',
    exportWebmBtn: '動画保存 (.webm)',
    stopRecordingBtn: '録画完了・保存',
    recordingBtn: '録画中…',
    legalAndFreedomNote:
      'HTML5 Canvas と著者自身の履歴書写真のみを用いて生成され、第三者の権利および読者の思想の自由を尊重します。',
    quizTitlePrefix: 'インタラクティブ理解度テスト',
    quizSubtitle: '論文全体の結論と整合する専門的な多肢選択問題',
    questionLabel: '問題',
    scoreLabel: '正解',
    nextQuestionBtn: '次の問題 →',
    resetQuizBtn: 'やり直す',
    correctBadge: '✓ 正解 — 記事全体の結論と一致',
    reviewBadge: '○ 分析的解説',
    freedomQuizNote: '自由な思考と探究を尊重し、純粋な学習支援を目的としています。',
    completedBanner: 'この記事の確認テストを完了しました。',
    openViewBtn: '60秒動画とテストを開く',
  },
  pt: {
    videoBadge: 'VÍDEO EXPLICATIVO HTML5 ORIGINAL · 60s · LIVRE DE DIREITOS',
    videoTitlePrefix: 'Vídeo Explicativo Visual (60s)',
    playBtn: 'Reproduzir',
    pauseBtn: 'Pausar',
    restartBtn: 'Reiniciar',
    voiceOnBtn: 'Voz Ativa',
    voiceOffBtn: 'Narração',
    scriptToggleBtn: 'Roteiro e Legendas',
    exportWebmBtn: 'Salvar Vídeo (.webm)',
    stopRecordingBtn: 'Concluir e Salvar',
    recordingBtn: 'Gravando…',
    legalAndFreedomNote:
      'Gerado puramente em HTML5 Canvas com o retrato oficial do autor; respeita todos os direitos legais e a liberdade de pensamento.',
    quizTitlePrefix: 'Quiz Interativo do Artigo',
    quizSubtitle: 'Questões de múltipla escolha alinhadas à conclusão geral do artigo',
    questionLabel: 'Pergunta',
    scoreLabel: 'Acertos',
    nextQuestionBtn: 'Próxima →',
    resetQuizBtn: 'Reiniciar Quiz',
    correctBadge: '✓ Resposta Correta — Alinhada à Conclusão',
    reviewBadge: '○ Nota Analítica',
    freedomQuizNote:
      'Perguntas criadas apenas para interação educativa, preservando integralmente a liberdade de pensamento.',
    completedBanner: 'Parabéns! Você concluiu o quiz deste artigo.',
    openViewBtn: 'Abrir Vídeo (60s) e Quiz',
  },
  it: {
    videoBadge: 'VIDEO ESPLICATIVO HTML5 ORIGINALE · 60s · SENZA VIOLAZIONI',
    videoTitlePrefix: 'Video Esplicativo Visivo (60s)',
    playBtn: 'Riproduci',
    pauseBtn: 'Pausa',
    restartBtn: 'Ricomincia',
    voiceOnBtn: 'Voce Attiva',
    voiceOffBtn: 'Narrazione',
    scriptToggleBtn: 'Testo e Sottotitoli',
    exportWebmBtn: 'Salva Video (.webm)',
    stopRecordingBtn: 'Completa e Salva',
    recordingBtn: 'Registrazione…',
    legalAndFreedomNote:
      'Generato esclusivamente con HTML5 Canvas e il ritratto CV dell’autore; rispetta i diritti altrui e la libertà di pensiero.',
    quizTitlePrefix: 'Quiz Interattivo dell’Articolo',
    quizSubtitle: 'Domande a scelta multipla coerenti con la conclusione generale dell’articolo',
    questionLabel: 'Domanda',
    scoreLabel: 'Corrette',
    nextQuestionBtn: 'Prossima →',
    resetQuizBtn: 'Ricomincia Quiz',
    correctBadge: '✓ Risposta Corretta — Coerente con la Conclusione',
    reviewBadge: '○ Analisi Concettuale',
    freedomQuizNote:
      'Domande create solo per stimolare l’apprendimento interattivo nel pieno rispetto della libertà di pensiero.',
    completedBanner: 'Ottimo! Hai completato il quiz di questo articolo.',
    openViewBtn: 'Apri Video (60s) e Quiz',
  },
  ko: {
    videoBadge: 'HTML5 오리지널 해설 영상 · 60초 · 저작권 준수',
    videoTitlePrefix: '시각적 해설 영상 (60초)',
    playBtn: '재생',
    pauseBtn: '일시정지',
    restartBtn: '처음부터',
    voiceOnBtn: '음성 켜짐',
    voiceOffBtn: '음성 해설',
    scriptToggleBtn: '스크립트 및 자막',
    exportWebmBtn: '영상 저장 (.webm)',
    stopRecordingBtn: '녹화 완료 및 저장',
    recordingBtn: '녹화 중…',
    legalAndFreedomNote:
      'HTML5 Canvas와 저자의 이력서 사진만으로 제작되어 타인의 권리를 침해하지 않으며 사상의 자유를 존중합니다.',
    quizTitlePrefix: '인터랙티브 이해도 퀴즈',
    quizSubtitle: '논문 전체 결론과 부합하는 전문 객관식 이해도 점검',
    questionLabel: '문제',
    scoreLabel: '정답',
    nextQuestionBtn: '다음 문제 →',
    resetQuizBtn: '다시 풀기',
    correctBadge: '✓ 정답입니다 — 전체 결론과 일치',
    reviewBadge: '○ 분석적 해설',
    freedomQuizNote:
      '상호작용 학습만을 위한 질문이며, 독자의 사상과 탐구의 자유를 온전히 존중합니다.',
    completedBanner: '이 글의 종합 이해도 퀴즈를 완료했습니다.',
    openViewBtn: '60초 영상 및 퀴즈 열기',
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

function splitCleanSentences(text: string): string[] {
  return cleanSentence(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24);
}

function shortenClause(text: string, maxLen = 148): string {
  const clean = cleanSentence(text);
  if (!clean) return '';
  if (clean.length <= maxLen) return clean;
  const sentences = splitCleanSentences(clean);
  if (sentences.length > 0 && sentences[0].length <= maxLen && sentences[0].length >= 42) {
    return sentences[0];
  }
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  const trimmed = (lastSpace > 55 ? sliced.slice(0, lastSpace) : sliced)
    .replace(/[,:;—–-]+$/, '')
    .trim();
  return `${trimmed}.`;
}

function extractArticleHolisticConclusion(article: Article, language: LanguageCode): {
  title: string;
  abstractText: string;
  paragraphs: string[];
  findings: string[];
  conclusionPrimary: string;
  conclusionSecondary: string;
  contextOpening: string;
  middleAnalysis: string;
} {
  const isTr = language === 'tr';
  const title = getLocalizedText(article.title, language);
  const subtitle = getLocalizedText(article.subtitle, language);
  const abstractText = getLocalizedText(article.abstract, language);
  const findings = getLocalizedArray(article.keyFindings, language).map(cleanSentence).filter(Boolean);
  const rawParagraphs = getLocalizedArray(article.contentParagraphs, language)
    .map(cleanSentence)
    .filter((p) => p.length > 25 && !/Bu makale .* tarihinde Mersin'de yazılmıştır/i.test(p));

  const paragraphs = rawParagraphs.length > 0 ? rawParagraphs : [abstractText || subtitle || title];
  const contextOpening = splitCleanSentences(paragraphs[0])[0] || abstractText || subtitle || title;

  const midIdx = Math.min(paragraphs.length - 1, Math.max(0, Math.floor(paragraphs.length / 2)));
  const middleSentences = splitCleanSentences(paragraphs[midIdx] || '');
  const middleAnalysis = middleSentences[0] || findings[0] || abstractText || title;

  // Holistic conclusion prioritizes the closing paragraph(s) of the full article + last core finding
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
    findings.find((f) => f !== rawPrimaryConclusion && f.length > 32) ||
    (prevLastSentences.length > 0 ? prevLastSentences[0] : '') ||
    findings[0] ||
    middleAnalysis ||
    abstractText;

  const conclusionPrimary = shortenClause(
    rawPrimaryConclusion.length >= 42
      ? rawPrimaryConclusion
      : isTr
        ? `${title}: ${abstractText}`
        : `${title}: ${abstractText}`,
    158
  );

  const conclusionSecondary = shortenClause(
    rawSecondaryConclusion.length >= 42 && rawSecondaryConclusion !== conclusionPrimary
      ? rawSecondaryConclusion
      : isTr
        ? `${article.category} ekseninde incelenen bulgular, kavramsal tutarlılığı deneysel ve kuramsal sınama ile birleştirir.`
        : `Findings in ${article.category} connect conceptual consistency with empirical and theoretical testability.`,
    158
  );

  return {
    title,
    abstractText,
    paragraphs,
    findings,
    conclusionPrimary,
    conclusionSecondary,
    contextOpening,
    middleAnalysis,
  };
}

export function buildArticleExplainerScenes(
  article: Article,
  language: LanguageCode
): ExplainerVideoScene[] {
  const isTr = language === 'tr';
  const {
    title,
    abstractText,
    paragraphs,
    findings,
    conclusionPrimary,
    conclusionSecondary,
    contextOpening,
    middleAnalysis,
  } = extractArticleHolisticConclusion(article, language);

  const subtitle = getLocalizedText(article.subtitle, language);
  const eq = article.simulation?.equationLatex || 'Ψ(x,t) → Φ';
  const simTitle = getLocalizedText(article.simulation?.title || { tr: title, en: title }, language);
  const simParams = article.simulation?.parameters || [];
  const simType = article.simulation?.type || 'quantum';

  const domainSummaryMapTr: Record<SimulationType, string> = {
    quantum: 'Dalga fonksiyonu süperpozisyonu, girişim saçakları ve gözlemci eşleşmesi dinamikleri',
    higgs: 'Skaler alan potansiyeli, kendiliğinden simetri kırılımı ve kütle kazanım mekanizması',
    holographic: 'Sınır-hacim (AdS/CFT) enformasyon projeksiyonu ve Bekenstein-Hawking entropi sınırı',
    spacetime: 'Minkowski ışık konisi geometrisi, Lorentz değişmezliği ve metrik bükülme analizi',
    consciousness: 'Bütünleşik enformasyon (Φ), öznel deneyim ve algoritmik hesaplanabilirlik ilişkisi',
    chaos: 'Doğrusal olmayan yörünge kararlılığı, başlangıç koşullarına hassasiyet ve garip çekerler',
    software: 'Modüler sistem mimarisi, veri kısıt doğrulaması ve gerçek zamanlı çıkarım akışı',
  };

  const domainSummaryMapEn: Record<SimulationType, string> = {
    quantum: 'Wavefunction superposition, interference fringes, and observer coupling dynamics',
    higgs: 'Scalar field potential, spontaneous symmetry breaking, and mass-generation topology',
    holographic: 'Boundary-to-bulk holographic projection and Bekenstein entropy encoding',
    spacetime: 'Minkowski light-cone geometry, Lorentz invariance, and spacetime metric curvature',
    consciousness: 'Integrated information (Φ), subjective experience, and algorithmic limits',
    chaos: 'Nonlinear trajectory stability, sensitive dependence, and strange-attractor geometry',
    software: 'Modular pipeline architecture, structured constraint solving, and live inference flow',
  };

  const domainHint = isTr ? domainSummaryMapTr[simType] : domainSummaryMapEn[simType];
  const paramSummary =
    simParams.length > 0
      ? simParams
          .slice(0, 3)
          .map((p) => `${getLocalizedText(p.label, language)}: ${p.defaultValue} ${p.unit}`)
          .join(' · ')
      : domainHint;

  const bodyLead1 = shortenClause(paragraphs[0] || contextOpening, 130);
  const bodyLead2 = shortenClause(paragraphs[1] || middleAnalysis, 130);

  return [
    {
      index: 0,
      startSec: 0,
      endSec: 9,
      heading: isTr ? '1. Yazar Sunumu & Temel Soru' : '1. Author Overview & Core Question',
      caption: isTr
        ? `Emre Pelit’in "${title}" makalesi şu soruyu merkeze alır: ${shortenClause(abstractText, 185)}`
        : `Emre Pelit’s study "${title}" centers on: ${shortenClause(abstractText, 185)}`,
      keyEquation: eq,
      bulletPoints: [
        isTr ? `Alan: ${article.category}` : `Domain: ${article.category}`,
        shortenClause(subtitle || contextOpening, 108),
      ],
      visualTheme: simType,
      showAuthorPortrait: true,
    },
    {
      index: 1,
      startSec: 9,
      endSec: 19,
      heading: isTr ? '2. Kavramsal Bağlam & Arka Plan' : '2. Conceptual Context & Background',
      caption: isTr
        ? `${bodyLead1} ${paragraphs[1] ? '— ' + shortenClause(paragraphs[1], 115) : ''}`
        : `${bodyLead1} ${paragraphs[1] ? '— ' + shortenClause(paragraphs[1], 115) : ''}`,
      keyEquation: eq,
      bulletPoints: [
        shortenClause(contextOpening, 106),
        shortenClause(bodyLead2, 106),
      ],
      visualTheme: simType,
      showAuthorPortrait: false,
    },
    {
      index: 2,
      startSec: 19,
      endSec: 30,
      heading: isTr ? `3. Matematiksel Model: ${simTitle}` : `3. Dynamic Model: ${simTitle}`,
      caption: isTr
        ? `${domainHint}. Aktif başlangıç parametreleri: ${paramSummary}.`
        : `${domainHint}. Baseline parameters: ${paramSummary}.`,
      keyEquation: eq,
      bulletPoints: [
        domainHint,
        paramSummary,
      ],
      visualTheme: simType,
      showAuthorPortrait: false,
    },
    {
      index: 3,
      startSec: 30,
      endSec: 41,
      heading: isTr ? '4. Öne Çıkan Bulgular & Analiz' : '4. Key Findings & Analytical Depth',
      caption: isTr
        ? `${shortenClause(findings[0] || middleAnalysis, 130)} ${findings[1] ? '— ' + shortenClause(findings[1], 125) : ''}`
        : `${shortenClause(findings[0] || middleAnalysis, 130)} ${findings[1] ? '— ' + shortenClause(findings[1], 125) : ''}`,
      keyEquation: eq,
      bulletPoints: [
        shortenClause(findings[0] || middleAnalysis, 108),
        shortenClause(findings[1] || findings[0] || bodyLead2, 108),
      ],
      visualTheme: simType,
      showAuthorPortrait: false,
    },
    {
      index: 4,
      startSec: 41,
      endSec: 51,
      heading: isTr ? '5. Makaleden Çıkan Bütüncül Sonuç' : '5. Overall Article Conclusion',
      caption: isTr
        ? `Makalenin genel sonucu: ${conclusionPrimary} ${conclusionSecondary !== conclusionPrimary ? '— ' + shortenClause(conclusionSecondary, 110) : ''}`
        : `Overall conclusion: ${conclusionPrimary}`,
      keyEquation: eq,
      bulletPoints: [
        shortenClause(conclusionPrimary, 112),
        shortenClause(conclusionSecondary, 112),
      ],
      visualTheme: simType,
      showAuthorPortrait: false,
      isConclusionScene: true,
    },
    {
      index: 5,
      startSec: 51,
      endSec: EXPLAINER_VIDEO_DURATION_SEC,
      heading: isTr
        ? '6. Eleştirel Sorgulama & Çoktan Seçmeli Test'
        : '6. Critical Inquiry & Comprehension Quiz',
      caption: isTr
        ? 'Dogmatik kabul yerine parametreleri canlı test edin, düşünce hürriyetinizi koruyun ve makale sonucuyla uyumlu çoktan seçmeli soruları çözün.'
        : 'Test the simulation parameters directly, preserve full freedom of thought, and evaluate your synthesis with the quiz below.',
      keyEquation: eq,
      bulletPoints: [
        isTr ? 'Açık Hipotez · Yanlışlanabilirlik & Fikir Özgürlüğü' : 'Open Hypothesis · Falsifiability & Freedom of Thought',
        isTr ? '60 sn Anlatım + Bütüncül Sonuç Testi & Simülatör' : '60s Explainer + Conclusion-Aligned Quiz & Simulator',
      ],
      visualTheme: simType,
      showAuthorPortrait: true,
    },
  ];
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
