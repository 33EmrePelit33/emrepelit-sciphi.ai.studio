import type { Article, LanguageCode, SimulationType } from '../types';
import { getLocalizedArray, getLocalizedText } from '../i18n/translations';
import { getHistoricalScientistsForTheme } from './everydayStoryVideoEngine';
import type { TranslatedArticleContent } from './articleLearningEngine';

export const EXAM_TOTAL_QUESTIONS = 20;
export const EXAM_DURATION_SECONDS = 900; // 15 minutes
export const EXAM_POINTS_CORRECT = 50;
export const EXAM_POINTS_BLANK = 10;
export const EXAM_POINTS_WRONG = -10;
export const EXAM_MIN_DIFFICULTY = 1;
export const EXAM_MAX_DIFFICULTY = 10;

export type ExamAnswerOutcome = 'correct' | 'wrong' | 'blank' | 'unanswered_exit';

export interface AdaptiveExamQuestion {
  id: string;
  difficulty: number; // 1 (easiest) to 10 (hardest)
  topicTag: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AdaptiveExamAnswerRecord {
  questionIndex: number; // 1..20
  questionId: string;
  difficulty: number;
  selectedOptionIndex: number | null;
  outcome: ExamAnswerOutcome;
  pointsDelta: number;
}

export interface ExamScoreBreakdown {
  correctCount: number;
  skippedBlankCount: number;
  exitBlankCount: number;
  totalBlankCount: number;
  wrongCount: number;
  totalQuestions: number;
  totalScore: number;
  peakDifficulty: number;
  averageDifficulty: number;
}

export interface ExamUiStrings {
  badgeTitle: string;
  cardTitle: string;
  cardSubtitle: string;
  startExamBtn: string;
  continueExamBtn: string;
  ruleCorrect: string;
  ruleBlank: string;
  ruleWrong: string;
  ruleAdaptive: string;
  ruleDuration: string;
  ruleEarlyExit: string;
  usernameGateTitle: string;
  usernameGateSubtitle: string;
  usernameInputLabel: string;
  usernamePlaceholder: string;
  usernameSubmitBtn: string;
  usernameChecking: string;
  usernameHint: string;
  usernameKvkkNote: string;
  usernameTakenWarning: string;
  usernameSuggestionsLabel: string;
  usernameCustomOptionLabel: string;
  usernameActiveLabel: string;
  usernameChangeBtn: string;
  usernameInvalidShort: string;
  usernameInvalidPii: string;
  questionLabel: string;
  difficultyLabel: string;
  timeRemainingLabel: string;
  liveScoreLabel: string;
  difficultyUpNotice: string;
  difficultyDownNotice: string;
  difficultyMaxNotice: string;
  difficultyMinNotice: string;
  leaveBlankBtn: string;
  exitExamBtn: string;
  exitConfirmTitle: string;
  exitConfirmBody: string; // uses {remaining} and {bonus}
  exitConfirmYesBtn: string;
  exitConfirmNoBtn: string;
  nextQuestionBtn: string;
  finishExamBtn: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  feedbackBlank: string;
  timeoutTitle: string;
  summaryTitle: string;
  summaryEarlyExitNote: string;
  summaryCorrectRow: string;
  summaryBlankRow: string;
  summaryExitBlankNote: string;
  summaryWrongRow: string;
  summaryTotalRow: string;
  summaryTimeRow: string;
  summaryStartEndRow: string;
  summaryPeakDiffRow: string;
  summaryMonthlyRankRow: string;
  summaryMonthlyTotalRow: string;
  summaryCurveTitle: string;
  retakeExamBtn: string;
  closeExamBtn: string;
  openLeaderboardBtn: string;
  savingScoreLabel: string;
  scoreSavedBadge: string;
  scoreSaveError: string;
  leaderboardTitle: string;
  leaderboardSubtitle: string;
  leaderboardMonthLabel: string;
  leaderboardCurrentMonthBadge: string;
  leaderboardFinalizedMonthBadge: string;
  leaderboardCountdownLabel: string; // uses {days} and {hours}
  leaderboardRankCol: string;
  leaderboardUserCol: string;
  leaderboardScoreCol: string;
  leaderboardTimeCol: string;
  leaderboardExamsCol: string;
  leaderboardCorrectCol: string;
  leaderboardPeakCol: string;
  leaderboardTieBreakNote: string;
  leaderboardYourStanding: string;
  leaderboardEmpty: string;
  leaderboardRefreshBtn: string;
  leaderboardParticipantsUnit: string;
  pointsUnit: string;
  difficultyTiers: [string, string, string, string, string, string, string, string, string, string];
  topicTags: {
    core: string;
    finding: string;
    model: string;
    parameter: string;
    history: string;
    method: string;
    critique: string;
    synthesis: string;
  };
}

const ENGLISH_EXAM_UI: ExamUiStrings = {
  badgeTitle: 'Adaptive 20-Question Timed Exam · Monthly Ranking',
  cardTitle: '20-Question Adaptive Practice Exam',
  cardSubtitle:
    'Aligned with this article’s topic. Starts easy and adjusts difficulty after every answer (+50 correct, +10 blank, -10 wrong). Leave anytime; remaining questions count as blank.',
  startExamBtn: 'Start 20-Question Exam',
  continueExamBtn: 'Resume Exam',
  ruleCorrect: '+50 Correct',
  ruleBlank: '+10 Blank',
  ruleWrong: '-10 Wrong',
  ruleAdaptive: 'Adaptive Difficulty (1–10)',
  ruleDuration: '15 Min Timer',
  ruleEarlyExit: 'Exit Anytime (Remaining = +10)',
  usernameGateTitle: 'Choose Your Unique Exam Username',
  usernameGateSubtitle:
    'Pick a username before starting. Your scores across all articles count toward the end-of-month ranking under this name.',
  usernameInputLabel: 'Username',
  usernamePlaceholder: 'e.g. physics_explorer',
  usernameSubmitBtn: 'Reserve Username & Start',
  usernameChecking: 'Checking availability…',
  usernameHint: '3–24 characters. Letters, numbers, underscore, dot or hyphen. No email or phone number.',
  usernameKvkkNote:
    'Only your pseudonymous username and exam points appear on the monthly leaderboard (KVKK/GDPR compliant).',
  usernameTakenWarning:
    'This username is already taken by another participant who claimed it first. Please choose another username below or enter your own.',
  usernameSuggestionsLabel: 'Available similar usernames (click to select):',
  usernameCustomOptionLabel: 'Or type a completely different custom username above:',
  usernameActiveLabel: 'Participant',
  usernameChangeBtn: 'Switch User',
  usernameInvalidShort: 'Username must be between 3 and 24 characters.',
  usernameInvalidPii: 'For privacy (KVKK/GDPR), do not use email addresses, phone numbers, or web links.',
  questionLabel: 'Question',
  difficultyLabel: 'Difficulty',
  timeRemainingLabel: 'Time Left',
  liveScoreLabel: 'Score',
  difficultyUpNotice: 'Correct (+50) · Next question becomes slightly harder',
  difficultyDownNotice: 'Not answered correctly · Next question becomes slightly easier',
  difficultyMaxNotice: 'Correct (+50) · Maximum difficulty level reached (10/10)',
  difficultyMinNotice: 'Not answered correctly · Remaining at starter level (1/10)',
  leaveBlankBtn: 'Leave Blank (+10)',
  exitExamBtn: 'Exit Exam',
  exitConfirmTitle: 'Exit Exam Early?',
  exitConfirmBody:
    'You have {remaining} remaining question(s). All remaining questions will be scored as blank (+{bonus} pts) and your exam will be finalized now.',
  exitConfirmYesBtn: 'Yes, Exit & Score Remaining as Blank',
  exitConfirmNoBtn: 'Continue Exam',
  nextQuestionBtn: 'Next Question',
  finishExamBtn: 'Finish & See Score',
  feedbackCorrect: 'Correct (+50 pts)',
  feedbackWrong: 'Incorrect (-10 pts)',
  feedbackBlank: 'Left Blank (+10 pts)',
  timeoutTitle: 'Time expired — remaining questions were automatically scored as blank (+10 pts each).',
  summaryTitle: 'Adaptive Practice Exam Completed',
  summaryEarlyExitNote: 'You exited early; all remaining questions were scored as blank (+10 pts each).',
  summaryCorrectRow: 'Correct Answers (+50 each)',
  summaryBlankRow: 'Blank / Skipped (+10 each)',
  summaryExitBlankNote: 'includes remaining questions after early exit',
  summaryWrongRow: 'Wrong Answers (-10 each)',
  summaryTotalRow: 'Total Exam Score',
  summaryTimeRow: 'Completion Time',
  summaryStartEndRow: 'Start → Finish',
  summaryPeakDiffRow: 'Peak Difficulty Reached',
  summaryMonthlyRankRow: 'Current Monthly Rank',
  summaryMonthlyTotalRow: 'Monthly Total Points',
  summaryCurveTitle: 'Adaptive Difficulty Trajectory (Questions 1–20)',
  retakeExamBtn: 'Take Again',
  closeExamBtn: 'Close',
  openLeaderboardBtn: 'Monthly Ranking',
  savingScoreLabel: 'Recording score to monthly leaderboard…',
  scoreSavedBadge: 'Recorded in Monthly Leaderboard',
  scoreSaveError: 'Score calculated locally; leaderboard sync will retry shortly.',
  leaderboardTitle: 'Monthly Practice Exam Leaderboard',
  leaderboardSubtitle:
    'Participants are ranked at the end of every month by total points earned across article adaptive exams using their reserved usernames.',
  leaderboardMonthLabel: 'Month',
  leaderboardCurrentMonthBadge: 'Active Month · Live Standings',
  leaderboardFinalizedMonthBadge: 'Month-End Finalized Ranking',
  leaderboardCountdownLabel: 'Month-end ranking closes in {days}d {hours}h',
  leaderboardRankCol: 'Rank',
  leaderboardUserCol: 'Username',
  leaderboardScoreCol: 'Monthly Score',
  leaderboardTimeCol: 'Time',
  leaderboardExamsCol: 'Exams',
  leaderboardCorrectCol: 'Correct',
  leaderboardPeakCol: 'Peak Lvl',
  leaderboardTieBreakNote:
    'Tie-breaker: When two participants have equal points, the one who completed in less time ranks higher.',
  leaderboardYourStanding: 'Your Standing',
  leaderboardEmpty: 'No exam scores recorded for this month yet. Complete any article’s 20-question adaptive exam to claim #1!',
  leaderboardRefreshBtn: 'Refresh',
  leaderboardParticipantsUnit: 'participants',
  pointsUnit: 'pts',
  difficultyTiers: [
    'L1 · Starter',
    'L2 · Basic',
    'L3 · Elementary',
    'L4 · Developing',
    'L5 · Intermediate',
    'L6 · Analytical',
    'L7 · Challenging',
    'L8 · Advanced',
    'L9 · Expert',
    'L10 · Master',
  ],
  topicTags: {
    core: 'Core Concept',
    finding: 'Key Finding',
    model: 'Theoretical Model',
    parameter: 'Parameter Analysis',
    history: 'Scientific Heritage',
    method: 'Methodology',
    critique: 'Critical Inquiry',
    synthesis: 'Deep Synthesis',
  },
};

const EXAM_UI_23_LANGS: Record<LanguageCode, ExamUiStrings> = {
  tr: {
    badgeTitle: '20 Soruluk Uyarlanabilir Süreli Deneme Sınavı · Aylık Sıralama',
    cardTitle: '20 Soruluk Uyarlanabilir Deneme Sınavı',
    cardSubtitle:
      'Bu makalenin konusuna özel hazırlanmıştır. Kolaydan başlar; her doğrudan sonra zorlaşır, doğru yapılmadığında kolaylaşır (+50 doğru, +10 boş, -10 yanlış). İstediğiniz an ayrılabilirsiniz; kalan sorular boş sayılır.',
    startExamBtn: '20 Soruluk Deneme Sınavına Başla',
    continueExamBtn: 'Sınava Devam Et',
    ruleCorrect: 'Doğru +50',
    ruleBlank: 'Boş +10',
    ruleWrong: 'Yanlış -10',
    ruleAdaptive: 'Uyarlanabilir Zorluk (1–10)',
    ruleDuration: '15 Dk Süreli',
    ruleEarlyExit: 'İstediğin An Ayrıl (Kalan = +10)',
    usernameGateTitle: 'Sınava Başlamadan Önce Kullanıcı Adınızı Belirleyin',
    usernameGateSubtitle:
      'Aylık puan sıralamasında bu kullanıcı adınız görünecektir. İlk alan kullanıcı adı kalıcı olarak korur.',
    usernameInputLabel: 'Kullanıcı Adı',
    usernamePlaceholder: 'Örn. bilim_kasifi',
    usernameSubmitBtn: 'Kullanıcı Adını Onayla ve Başla',
    usernameChecking: 'Uygunluk kontrol ediliyor…',
    usernameHint: '3–24 karakter. Harf, rakam, alt çizgi, nokta veya tire kullanabilirsiniz. E-posta/telefon yazmayın.',
    usernameKvkkNote:
      'Aylık sıralamada yalnızca seçtiğiniz takma kullanıcı adı ve puanınız gösterilir (KVKK & GDPR uyumlu).',
    usernameTakenWarning:
      'Bu kullanıcı adı daha önce başka bir kullanıcı tarafından alınmış. İlk alan kişi bu adı kullanabilir; lütfen aşağıdan kullanımda olmayan benzer bir ad seçin veya kendiniz başka bir kullanıcı adı belirleyin.',
    usernameSuggestionsLabel: 'Benzer ve kullanımda olmayan öneriler (seçmek için tıklayın):',
    usernameCustomOptionLabel: 'Veya bu önerilerin dışında yukarıya kendi istediğiniz farklı bir kullanıcı adını yazın:',
    usernameActiveLabel: 'Katılımcı',
    usernameChangeBtn: 'Kullanıcı Değiştir',
    usernameInvalidShort: 'Kullanıcı adı 3 ile 24 karakter arasında olmalıdır.',
    usernameInvalidPii: 'KVKK/GDPR gereği e-posta, telefon numarası veya web adresi yerine takma ad seçin.',
    questionLabel: 'Soru',
    difficultyLabel: 'Zorluk',
    timeRemainingLabel: 'Kalan Süre',
    liveScoreLabel: 'Puan',
    difficultyUpNotice: 'Doğru (+50) · Sonraki soru bir nebze daha zor olacak',
    difficultyDownNotice: 'Doğru yanıtlanmadı · Sonraki soru bir nebze daha kolay olacak',
    difficultyMaxNotice: 'Doğru (+50) · En üst zorluk seviyesindesiniz (10/10)',
    difficultyMinNotice: 'Doğru yanıtlanmadı · Başlangıç seviyesinde devam ediliyor (1/10)',
    leaveBlankBtn: 'Boş Bırak (+10 Puan)',
    exitExamBtn: 'Sınavdan Ayrıl',
    exitConfirmTitle: 'Sınavdan Şimdi Ayrılmak İstiyor musunuz?',
    exitConfirmBody:
      'Kalan {remaining} sorunun tamamı boş bırakılmış sayılacak (+{bonus} puan) ve deneme sınavınız şu an puanlanacaktır.',
    exitConfirmYesBtn: 'Evet, Ayrıl ve Kalanları Boş Sayarak Puanla',
    exitConfirmNoBtn: 'Sınava Devam Et',
    nextQuestionBtn: 'Sonraki Soru',
    finishExamBtn: 'Sınavı Bitir ve Puanı Gör',
    feedbackCorrect: 'Doğru Yanıt (+50 Puan)',
    feedbackWrong: 'Yanlış Yanıt (-10 Puan)',
    feedbackBlank: 'Boş Bırakıldı (+10 Puan)',
    timeoutTitle: 'Süre doldu — kalan sorular otomatik olarak boş (+10 puan) şeklinde puanlandı.',
    summaryTitle: '20 Soruluk Deneme Sınavı Tamamlandı',
    summaryEarlyExitNote: 'Sınavdan erken ayrıldınız; kalan tüm sorular boş bırakılmış (+10 puan) kabul edildi.',
    summaryCorrectRow: 'Doğru Yanıtlar (+50 puan)',
    summaryBlankRow: 'Boş Bırakılanlar (+10 puan)',
    summaryExitBlankNote: 'ayrıldıktan sonra kalan sorular dahil',
    summaryWrongRow: 'Yanlış Yanıtlar (-10 puan)',
    summaryTotalRow: 'Toplam Sınav Puanı',
    summaryTimeRow: 'Tamamlama Süresi',
    summaryStartEndRow: 'Başlangıç → Bitiş',
    summaryPeakDiffRow: 'Ulaşılan En Yüksek Zorluk',
    summaryMonthlyRankRow: 'Güncel Aylık Sıralama',
    summaryMonthlyTotalRow: 'Aylık Toplam Puanınız',
    summaryCurveTitle: 'Uyarlanabilir Zorluk Eğrisi (1–20. Sorular)',
    retakeExamBtn: 'Tekrar Dene',
    closeExamBtn: 'Kapat',
    openLeaderboardBtn: 'Aylık Sıralama',
    savingScoreLabel: 'Puanınız aylık sıralamaya kaydediliyor…',
    scoreSavedBadge: 'Aylık Sıralamaya Kaydedildi',
    scoreSaveError: 'Puanınız hesaplandı; sıralama eşitlemesi yeniden denenecektir.',
    leaderboardTitle: 'Aylık Deneme Sınavı Sıralaması',
    leaderboardSubtitle:
      'Her ayın sonunda tüm makalelerdeki 20 soruluk deneme sınavlarından elde edilen puanlara göre kullanıcı adlarıyla sıralama oluşturulur.',
    leaderboardMonthLabel: 'Dönem',
    leaderboardCurrentMonthBadge: 'Aktif Ay · Canlı Sıralama',
    leaderboardFinalizedMonthBadge: 'Ay Sonu Kesinleşen Sıralama',
    leaderboardCountdownLabel: 'Ay sonu sıralamasına kalan: {days} gün {hours} saat',
    leaderboardRankCol: 'Sıra',
    leaderboardUserCol: 'Kullanıcı Adı',
    leaderboardScoreCol: 'Aylık Puan',
    leaderboardTimeCol: 'Süre',
    leaderboardExamsCol: 'Sınav',
    leaderboardCorrectCol: 'Doğru',
    leaderboardPeakCol: 'En Yüksek Sv.',
    leaderboardTieBreakNote:
      'Eşitlik kuralı: Aynı puana sahip iki kullanıcıdan sınavı daha kısa sürede tamamlayan sıralamada daha üst basamakta yer alır.',
    leaderboardYourStanding: 'Sıralamanız',
    leaderboardEmpty: 'Bu ay henüz deneme sınavı kaydı bulunmuyor. Herhangi bir makaledeki 20 soruluk sınavı tamamlayarak 1. sıraya yerleşin!',
    leaderboardRefreshBtn: 'Yenile',
    leaderboardParticipantsUnit: 'katılımcı',
    pointsUnit: 'puan',
    difficultyTiers: [
      'Sv.1 · Başlangıç',
      'Sv.2 · Temel',
      'Sv.3 · Kolay-Orta',
      'Sv.4 · Gelişen',
      'Sv.5 · Orta',
      'Sv.6 · Analitik',
      'Sv.7 · Zorlayıcı',
      'Sv.8 · İleri',
      'Sv.9 · Uzman',
      'Sv.10 · Akademik Zirve',
    ],
    topicTags: {
      core: 'Temel Kavram',
      finding: 'Ana Bulgu',
      model: 'Kuramsal Model',
      parameter: 'Parametre Analizi',
      history: 'Bilim Tarihi',
      method: 'Yöntembilim',
      critique: 'Eleştirel Sorgu',
      synthesis: 'Derin Sentez',
    },
  },
  en: ENGLISH_EXAM_UI,
  es: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Examen Adaptativo de 20 Preguntas · Ranking Mensual',
    cardTitle: 'Examen de Práctica Adaptativo (20 Preguntas)',
    cardSubtitle:
      'Alineado con este artículo. Comienza fácil y ajusta la dificultad tras cada respuesta (+50 acierto, +10 en blanco, -10 error). Puedes salir cuando quieras; las restantes cuentan como en blanco.',
    startExamBtn: 'Iniciar Examen de 20 Preguntas',
    continueExamBtn: 'Continuar Examen',
    ruleCorrect: '+50 Acierto',
    ruleBlank: '+10 En blanco',
    ruleWrong: '-10 Error',
    ruleAdaptive: 'Dificultad Adaptativa (1–10)',
    ruleDuration: '15 Min',
    ruleEarlyExit: 'Salir cuando quieras (Restantes = +10)',
    usernameGateTitle: 'Elige tu Nombre de Usuario',
    usernameGateSubtitle: 'Define un nombre de usuario único antes de empezar para aparecer en el ranking mensual.',
    usernameInputLabel: 'Nombre de usuario',
    usernamePlaceholder: 'ej. explorador_ciencia',
    usernameSubmitBtn: 'Confirmar Nombre y Empezar',
    usernameTakenWarning:
      'Este nombre de usuario ya está en uso por quien lo registró primero. Elige una sugerencia disponible abajo o escribe otro nombre propio.',
    usernameSuggestionsLabel: 'Sugerencias disponibles similares:',
    usernameCustomOptionLabel: 'O escribe cualquier otro nombre de usuario personalizado arriba:',
    usernameActiveLabel: 'Participante',
    usernameChangeBtn: 'Cambiar usuario',
    questionLabel: 'Pregunta',
    difficultyLabel: 'Dificultad',
    timeRemainingLabel: 'Tiempo restante',
    liveScoreLabel: 'Puntos',
    leaveBlankBtn: 'Dejar en blanco (+10)',
    exitExamBtn: 'Salir del examen',
    exitConfirmTitle: '¿Salir del examen ahora?',
    exitConfirmBody:
      'Quedan {remaining} pregunta(s). Todas se puntuarán en blanco (+{bonus} pts) y el examen finalizará ahora.',
    exitConfirmYesBtn: 'Sí, salir y puntuar restantes en blanco',
    exitConfirmNoBtn: 'Seguir en el examen',
    nextQuestionBtn: 'Siguiente pregunta',
    finishExamBtn: 'Finalizar y ver puntuación',
    feedbackCorrect: 'Correcto (+50 pts)',
    feedbackWrong: 'Incorrecto (-10 pts)',
    feedbackBlank: 'En blanco (+10 pts)',
    summaryTitle: 'Examen Adaptativo Completado',
    summaryTotalRow: 'Puntuación Total',
    retakeExamBtn: 'Intentar de nuevo',
    closeExamBtn: 'Cerrar',
    openLeaderboardBtn: 'Ranking Mensual',
    leaderboardTitle: 'Ranking Mensual de Exámenes de Práctica',
    leaderboardSubtitle: 'Al final de cada mes se clasifica a los participantes por sus puntos totales con su nombre de usuario.',
    leaderboardCountdownLabel: 'Cierre de mes en {days}d {hours}h',
    leaderboardRankCol: 'Puesto',
    leaderboardUserCol: 'Usuario',
    leaderboardScoreCol: 'Puntos del mes',
    leaderboardTimeCol: 'Tiempo',
    leaderboardExamsCol: 'Exámenes',
    leaderboardCorrectCol: 'Aciertos',
    leaderboardPeakCol: 'Nivel máx.',
    summaryTimeRow: 'Tiempo de finalización',
    summaryStartEndRow: 'Inicio → Fin',
    leaderboardTieBreakNote:
      'Desempate: Con igual puntuación, quien complete el examen en menos tiempo ocupa un puesto superior.',
    leaderboardRefreshBtn: 'Actualizar',
    leaderboardParticipantsUnit: 'participantes',
    pointsUnit: 'pts',
  },
  de: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Adaptiver 20-Fragen-Test · Monatsrangliste',
    cardTitle: 'Adaptiver Übungstest (20 Fragen)',
    cardSubtitle:
      'Passend zu diesem Artikel. Beginnt leicht und passt die Schwierigkeit nach jeder Antwort an (+50 richtig, +10 leer, -10 falsch). Jederzeit beendbar; übrige Fragen zählen als leer.',
    startExamBtn: '20-Fragen-Test starten',
    continueExamBtn: 'Test fortsetzen',
    ruleCorrect: '+50 Richtig',
    ruleBlank: '+10 Leer',
    ruleWrong: '-10 Falsch',
    ruleAdaptive: 'Adaptive Schwierigkeit (1–10)',
    ruleDuration: '15 Min',
    ruleEarlyExit: 'Jederzeit beenden (Rest = +10)',
    usernameGateTitle: 'Eindeutigen Benutzernamen wählen',
    usernameGateSubtitle: 'Wähle vor dem Test einen Benutzernamen für die monatliche Rangliste.',
    usernameInputLabel: 'Benutzername',
    usernamePlaceholder: 'z. B. quanten_denker',
    usernameSubmitBtn: 'Namen sichern & starten',
    usernameTakenWarning:
      'Dieser Benutzername ist bereits vergeben. Bitte wähle einen freien Vorschlag unten oder gib einen eigenen Namen ein.',
    usernameSuggestionsLabel: 'Verfügbare ähnliche Vorschläge:',
    usernameCustomOptionLabel: 'Oder gib oben einen ganz eigenen Benutzernamen ein:',
    usernameActiveLabel: 'Teilnehmer',
    usernameChangeBtn: 'Wechseln',
    questionLabel: 'Frage',
    difficultyLabel: 'Stufe',
    timeRemainingLabel: 'Restzeit',
    liveScoreLabel: 'Punkte',
    leaveBlankBtn: 'Leer lassen (+10)',
    exitExamBtn: 'Test beenden',
    exitConfirmTitle: 'Test vorzeitig beenden?',
    exitConfirmBody:
      'Es verbleiben {remaining} Frage(n). Alle offenen Fragen werden als leer gewertet (+{bonus} Pkt.).',
    exitConfirmYesBtn: 'Ja, beenden & Rest als leer werten',
    exitConfirmNoBtn: 'Weiterarbeiten',
    nextQuestionBtn: 'Nächste Frage',
    finishExamBtn: 'Abschließen & Ergebnis zeigen',
    feedbackCorrect: 'Richtig (+50 Pkt.)',
    feedbackWrong: 'Falsch (-10 Pkt.)',
    feedbackBlank: 'Leer gelassen (+10 Pkt.)',
    summaryTitle: 'Adaptiver Übungstest abgeschlossen',
    summaryTotalRow: 'Gesamtpunktzahl',
    retakeExamBtn: 'Erneut versuchen',
    closeExamBtn: 'Schließen',
    openLeaderboardBtn: 'Monatsrangliste',
    leaderboardTitle: 'Monatliche Prüfungsrangliste',
    leaderboardSubtitle: 'Am Ende jedes Monats werden alle Teilnehmer nach ihren Gesamtpunkten und Benutzernamen gereiht.',
    leaderboardCountdownLabel: 'Monatsabschluss in {days}T {hours}Std',
    leaderboardRankCol: 'Rang',
    leaderboardUserCol: 'Benutzername',
    leaderboardScoreCol: 'Monatspunkte',
    leaderboardTimeCol: 'Zeit',
    leaderboardExamsCol: 'Tests',
    leaderboardCorrectCol: 'Richtig',
    leaderboardPeakCol: 'Max. Stufe',
    summaryTimeRow: 'Bearbeitungszeit',
    summaryStartEndRow: 'Start → Ende',
    leaderboardTieBreakNote:
      'Bei Punktgleichheit wird der Teilnehmer mit der kürzeren Bearbeitungszeit höher eingestuft.',
    leaderboardRefreshBtn: 'Aktualisieren',
    leaderboardParticipantsUnit: 'Teilnehmer',
    pointsUnit: 'Pkt.',
  },
  fr: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Examen Adaptatif 20 Questions · Classement Mensuel',
    cardTitle: 'Examen Blanc Adaptatif (20 Questions)',
    cardSubtitle:
      'Adapté à cet article. Commence facile et ajuste la difficulté après chaque réponse (+50 juste, +10 blanc, -10 faux). Quittez à tout moment : les questions restantes comptent comme blanches.',
    startExamBtn: 'Démarrer l’examen (20 questions)',
    continueExamBtn: 'Reprendre l’examen',
    ruleCorrect: '+50 Juste',
    ruleBlank: '+10 Blanc',
    ruleWrong: '-10 Faux',
    ruleAdaptive: 'Difficulté adaptative (1–10)',
    ruleDuration: '15 Min',
    ruleEarlyExit: 'Quitter librement (Restantes = +10)',
    usernameGateTitle: 'Choisissez votre nom d’utilisateur',
    usernameGateSubtitle: 'Choisissez un pseudonyme unique avant l’examen pour le classement mensuel.',
    usernameInputLabel: 'Nom d’utilisateur',
    usernamePlaceholder: 'ex. chercheur_etoiles',
    usernameSubmitBtn: 'Valider et commencer',
    usernameTakenWarning:
      'Ce nom d’utilisateur est déjà pris par son premier titulaire. Choisissez une suggestion libre ci-dessous ou saisissez un autre nom.',
    usernameSuggestionsLabel: 'Suggestions disponibles similaires :',
    usernameCustomOptionLabel: 'Ou saisissez votre propre nom d’utilisateur ci-dessus :',
    usernameActiveLabel: 'Participant',
    usernameChangeBtn: 'Changer',
    questionLabel: 'Question',
    difficultyLabel: 'Niveau',
    timeRemainingLabel: 'Temps restant',
    liveScoreLabel: 'Score',
    leaveBlankBtn: 'Laisser blanc (+10)',
    exitExamBtn: 'Quitter l’examen',
    exitConfirmTitle: 'Quitter l’examen maintenant ?',
    exitConfirmBody:
      'Il reste {remaining} question(s). Elles seront comptées comme blanches (+{bonus} pts) et votre score sera calculé.',
    exitConfirmYesBtn: 'Oui, quitter et noter le reste en blanc',
    exitConfirmNoBtn: 'Continuer',
    nextQuestionBtn: 'Question suivante',
    finishExamBtn: 'Terminer et voir le score',
    feedbackCorrect: 'Correct (+50 pts)',
    feedbackWrong: 'Incorrect (-10 pts)',
    feedbackBlank: 'Laissé blanc (+10 pts)',
    summaryTitle: 'Examen Blanc Terminé',
    summaryTotalRow: 'Score Total',
    retakeExamBtn: 'Recommencer',
    closeExamBtn: 'Fermer',
    openLeaderboardBtn: 'Classement Mensuel',
    leaderboardTitle: 'Classement Mensuel des Examens Blancs',
    leaderboardSubtitle: 'À la fin de chaque mois, les participants sont classés selon leurs points cumulés sous leur nom d’utilisateur.',
    leaderboardCountdownLabel: 'Clôture du mois dans {days}j {hours}h',
    leaderboardRankCol: 'Rang',
    leaderboardUserCol: 'Utilisateur',
    leaderboardScoreCol: 'Points du mois',
    leaderboardTimeCol: 'Temps',
    leaderboardExamsCol: 'Examens',
    leaderboardCorrectCol: 'Justes',
    leaderboardPeakCol: 'Niv. max',
    summaryTimeRow: 'Temps écoulé',
    summaryStartEndRow: 'Début → Fin',
    leaderboardTieBreakNote:
      'Égalité de points : le participant ayant terminé en moins de temps est classé plus haut.',
    leaderboardRefreshBtn: 'Actualiser',
    leaderboardParticipantsUnit: 'participants',
    pointsUnit: 'pts',
  },
  ru: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Адаптивный тест на 20 вопросов · Ежемесячный рейтинг',
    cardTitle: 'Адаптивный пробный экзамен (20 вопросов)',
    cardSubtitle:
      'По теме этой статьи. Начинается легко и меняет сложность после каждого ответа (+50 верно, +10 пропуск, -10 ошибка). Можно выйти в любой момент — оставшиеся засчитаются как пропуск.',
    startExamBtn: 'Начать экзамен (20 вопросов)',
    continueExamBtn: 'Продолжить экзамен',
    ruleCorrect: '+50 Верно',
    ruleBlank: '+10 Пропуск',
    ruleWrong: '-10 Ошибка',
    ruleAdaptive: 'Адаптивная сложность (1–10)',
    ruleDuration: '15 мин',
    ruleEarlyExit: 'Выход в любой момент (Остаток = +10)',
    usernameGateTitle: 'Выберите уникальное имя пользователя',
    usernameGateSubtitle: 'Задайте имя до начала экзамена — оно будет отображаться в ежемесячном рейтинге.',
    usernameInputLabel: 'Имя пользователя',
    usernamePlaceholder: 'напр. science_mind',
    usernameSubmitBtn: 'Закрепить имя и начать',
    usernameTakenWarning:
      'Это имя уже занято первым пользователем. Выберите свободный вариант ниже или придумайте другое имя.',
    usernameSuggestionsLabel: 'Свободные похожие варианты:',
    usernameCustomOptionLabel: 'Или введите любое другое собственное имя выше:',
    usernameActiveLabel: 'Участник',
    usernameChangeBtn: 'Сменить',
    questionLabel: 'Вопрос',
    difficultyLabel: 'Сложность',
    timeRemainingLabel: 'Осталось',
    liveScoreLabel: 'Баллы',
    leaveBlankBtn: 'Пропустить (+10)',
    exitExamBtn: 'Выйти из экзамена',
    exitConfirmTitle: 'Завершить экзамен досрочно?',
    exitConfirmBody:
      'Осталось вопросов: {remaining}. Все оставшиеся будут засчитаны как пропущенные (+{bonus} б.).',
    exitConfirmYesBtn: 'Да, выйти и засчитать остаток как пропуск',
    exitConfirmNoBtn: 'Продолжить',
    nextQuestionBtn: 'Следующий вопрос',
    finishExamBtn: 'Завершить и узнать результат',
    feedbackCorrect: 'Верно (+50 б.)',
    feedbackWrong: 'Неверно (-10 б.)',
    feedbackBlank: 'Пропущено (+10 б.)',
    summaryTitle: 'Пробный экзамен завершён',
    summaryTotalRow: 'Итоговый балл',
    retakeExamBtn: 'Пройти снова',
    closeExamBtn: 'Закрыть',
    openLeaderboardBtn: 'Рейтинг месяца',
    leaderboardTitle: 'Ежемесячный рейтинг пробных экзаменов',
    leaderboardSubtitle: 'В конце каждого месяца участники ранжируются по сумме баллов под своими именами пользователей.',
    leaderboardCountdownLabel: 'До итогов месяца: {days}д {hours}ч',
    leaderboardRankCol: 'Место',
    leaderboardUserCol: 'Имя пользователя',
    leaderboardScoreCol: 'Баллы за месяц',
    leaderboardTimeCol: 'Время',
    leaderboardExamsCol: 'Экзамены',
    leaderboardCorrectCol: 'Верно',
    leaderboardPeakCol: 'Макс. ур.',
    summaryTimeRow: 'Время прохождения',
    summaryStartEndRow: 'Начало → Окончание',
    leaderboardTieBreakNote:
      'При равенстве баллов выше в рейтинге располагается участник, завершивший тест быстрее.',
    leaderboardRefreshBtn: 'Обновить',
    leaderboardParticipantsUnit: 'участников',
    pointsUnit: 'б.',
  },
  ar: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'اختبار تكيفي من 20 سؤالاً · الترتيب الشهري',
    cardTitle: 'اختبار تجريبي تكيفي (20 سؤالاً)',
    cardSubtitle:
      'متوافق مع موضوع هذا المقال. يبدأ سهلاً وتزداد الصعوبة بعد كل إجابة صحيحة وتقل عند الخطأ (+50 صحيح، +10 فارغ، -10 خطأ). يمكنك الانسحاب في أي وقت وتُحسب الأسئلة المتبقية فارغة.',
    startExamBtn: 'ابدأ الاختبار (20 سؤالاً)',
    continueExamBtn: 'متابعة الاختبار',
    ruleCorrect: '+50 صحيح',
    ruleBlank: '+10 فارغ',
    ruleWrong: '-10 خطأ',
    ruleAdaptive: 'صعوبة تكيفية (1–10)',
    ruleDuration: '15 دقيقة',
    ruleEarlyExit: 'انسحاب بأي وقت (المتبقي = +10)',
    usernameGateTitle: 'اختر اسم مستخدم فريد قبل الاختبار',
    usernameGateSubtitle: 'سيُستخدم هذا الاسم في الترتيب الشهري لنقاط الاختبارات.',
    usernameInputLabel: 'اسم المستخدم',
    usernamePlaceholder: 'مثال: bahith_ilm',
    usernameSubmitBtn: 'تأكيد الاسم والبدء',
    usernameTakenWarning:
      'اسم المستخدم هذا محجوز بالفعل لمن اختاره أولاً. اختر أحد الأسماء المقترحة المتاحة أدناه أو اكتب اسماً مختلفاً.',
    usernameSuggestionsLabel: 'اقتراحات مشابهة متاحة:',
    usernameCustomOptionLabel: 'أو اكتب اسم مستخدم مخصصاً آخر في الأعلى:',
    usernameActiveLabel: 'المشارك',
    usernameChangeBtn: 'تغيير الاسم',
    questionLabel: 'سؤال',
    difficultyLabel: 'الصعوبة',
    timeRemainingLabel: 'الوقت المتبقي',
    liveScoreLabel: 'النقاط',
    leaveBlankBtn: 'ترك فارغاً (+10)',
    exitExamBtn: 'مغادرة الاختبار',
    exitConfirmTitle: 'هل تريد مغادرة الاختبار الآن؟',
    exitConfirmBody: 'يتبقى {remaining} سؤال/أسئلة وستُحتسب جميعها فارغة (+{bonus} نقطة).',
    exitConfirmYesBtn: 'نعم، غادر واحتسب المتبقي فارغاً',
    exitConfirmNoBtn: 'متابعة الاختبار',
    nextQuestionBtn: 'السؤال التالي',
    finishExamBtn: 'إنهاء وعرض النتيجة',
    feedbackCorrect: 'إجابة صحيحة (+50 نقطة)',
    feedbackWrong: 'إجابة خاطئة (-10 نقاط)',
    feedbackBlank: 'متروك فارغاً (+10 نقاط)',
    summaryTitle: 'اكتمل الاختبار التكيفي',
    summaryTotalRow: 'مجموع النقاط',
    retakeExamBtn: 'إعادة المحاولة',
    closeExamBtn: 'إغلاق',
    openLeaderboardBtn: 'الترتيب الشهري',
    leaderboardTitle: 'الترتيب الشهري للاختبارات التجريبية',
    leaderboardSubtitle: 'في نهاية كل شهر يتم ترتيب المشاركين حسب مجموع نقاطهم باستخدام أسماء المستخدمين الخاصة بهم.',
    leaderboardCountdownLabel: 'متبقي لنهاية الشهر: {days}ي {hours}س',
    leaderboardRankCol: 'المركز',
    leaderboardUserCol: 'اسم المستخدم',
    leaderboardScoreCol: 'نقاط الشهر',
    leaderboardTimeCol: 'المدة',
    leaderboardExamsCol: 'الاختبارات',
    leaderboardCorrectCol: 'صحيح',
    leaderboardPeakCol: 'أعلى مستوى',
    summaryTimeRow: 'مدة الإنجاز',
    summaryStartEndRow: 'البداية → النهاية',
    leaderboardTieBreakNote:
      'عند تساوي النقاط، يتقدم في الترتيب المشارك الذي أنهى الاختبار في وقت أقل.',
    leaderboardRefreshBtn: 'تحديث',
    leaderboardParticipantsUnit: 'مشارك',
    pointsUnit: 'نقطة',
  },
  zh: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: '20题自适应限时模拟考试 · 月度排行榜',
    cardTitle: '20题自适应模拟考试',
    cardSubtitle:
      '紧密围绕本文主题。由易到难，答对递增难度，未答对则降低难度（答对+50、留空+10、答错-10）。可随时退出，剩余题目均按留空计分。',
    startExamBtn: '开始20题模拟考试',
    continueExamBtn: '继续考试',
    ruleCorrect: '答对 +50',
    ruleBlank: '留空 +10',
    ruleWrong: '答错 -10',
    ruleAdaptive: '自适应难度 (1–10)',
    ruleDuration: '15分钟限时',
    ruleEarlyExit: '随时退出（余题=+10）',
    usernameGateTitle: '考试前请设置唯一用户名',
    usernameGateSubtitle: '月末将按各用户累计模拟考试得分进行排名，并展示此用户名。',
    usernameInputLabel: '用户名',
    usernamePlaceholder: '例如 science_star',
    usernameSubmitBtn: '确认用户名并开始',
    usernameTakenWarning: '该用户名已被首位注册者占用。请选择下方可用的相似建议，或输入其他自定义用户名。',
    usernameSuggestionsLabel: '相似可用用户名建议（点击选择）：',
    usernameCustomOptionLabel: '或在上方输入您自己想要的其他用户名：',
    usernameActiveLabel: '考生',
    usernameChangeBtn: '切换',
    questionLabel: '第',
    difficultyLabel: '难度',
    timeRemainingLabel: '剩余时间',
    liveScoreLabel: '当前得分',
    leaveBlankBtn: '留空 (+10分)',
    exitExamBtn: '退出考试',
    exitConfirmTitle: '确认提前退出考试？',
    exitConfirmBody: '还有 {remaining} 道未作答题目，将全部按留空计分（+{bonus}分）并立即结算成绩。',
    exitConfirmYesBtn: '确认退出并结算',
    exitConfirmNoBtn: '继续答题',
    nextQuestionBtn: '下一题',
    finishExamBtn: '完成并查看成绩',
    feedbackCorrect: '回答正确 (+50分)',
    feedbackWrong: '回答错误 (-10分)',
    feedbackBlank: '已留空 (+10分)',
    summaryTitle: '20题自适应考试完成',
    summaryTotalRow: '本次总分',
    retakeExamBtn: '再次挑战',
    closeExamBtn: '关闭',
    openLeaderboardBtn: '月度排行榜',
    leaderboardTitle: '月度模拟考试排行榜',
    leaderboardSubtitle: '每月底根据用户在所有文章模拟考试中的累计得分与用户名进行排名。',
    leaderboardCountdownLabel: '距本月结算还有 {days}天 {hours}小时',
    leaderboardRankCol: '排名',
    leaderboardUserCol: '用户名',
    leaderboardScoreCol: '月度总分',
    leaderboardTimeCol: '用时',
    leaderboardExamsCol: '场次',
    leaderboardCorrectCol: '答对',
    leaderboardPeakCol: '最高难度',
    summaryTimeRow: '完成用时',
    summaryStartEndRow: '开始 → 结束',
    leaderboardTieBreakNote: '同分规则：积分相同时，完成用时更短的用户排名靠前。',
    leaderboardRefreshBtn: '刷新',
    leaderboardParticipantsUnit: '位参与者',
    pointsUnit: '分',
  },
  ja: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: '20問適応型タイムトライアル模試 · 月間ランキング',
    cardTitle: '20問 適応型模擬試験',
    cardSubtitle:
      'この記事のテーマに沿った20問。易しい問題から始まり、正解で難化・不正解で易化します（正解+50、無回答+10、不正解-10）。いつでも退出可能で残問は無回答として採点されます。',
    startExamBtn: '20問模試を開始',
    continueExamBtn: '試験を再開',
    ruleCorrect: '正解 +50',
    ruleBlank: '無回答 +10',
    ruleWrong: '不正解 -10',
    ruleAdaptive: '適応難易度 (1–10)',
    ruleDuration: '制限15分',
    ruleEarlyExit: '途中退出可（残問=+10）',
    usernameGateTitle: '受験前にユーザー名を設定してください',
    usernameGateSubtitle: '毎月末にユーザー名と獲得スコアでランキングを集計します。',
    usernameInputLabel: 'ユーザー名',
    usernamePlaceholder: '例: quantum_reader',
    usernameSubmitBtn: 'ユーザー名を確定して開始',
    usernameTakenWarning:
      'このユーザー名は先着の別ユーザーが利用中です。下の未使用候補から選ぶか、別の名前を入力してください。',
    usernameSuggestionsLabel: '利用可能な類似候補（クリックで選択）：',
    usernameCustomOptionLabel: 'または上に別の希望ユーザー名を入力してください：',
    usernameActiveLabel: '受験者',
    usernameChangeBtn: '変更',
    questionLabel: '問題',
    difficultyLabel: '難易度',
    timeRemainingLabel: '残り時間',
    liveScoreLabel: '得点',
    leaveBlankBtn: '無回答で進む (+10)',
    exitExamBtn: '試験を退出',
    exitConfirmTitle: '途中で退出しますか？',
    exitConfirmBody: '残り {remaining} 問はすべて無回答（+{bonus}点）として採点されます。',
    exitConfirmYesBtn: 'はい、退出して採点する',
    exitConfirmNoBtn: '試験を続ける',
    nextQuestionBtn: '次の問題',
    finishExamBtn: '終了して結果を見る',
    feedbackCorrect: '正解 (+50点)',
    feedbackWrong: '不正解 (-10点)',
    feedbackBlank: '無回答 (+10点)',
    summaryTitle: '20問模擬試験が完了しました',
    summaryTotalRow: '合計スコア',
    retakeExamBtn: 'もう一度挑戦',
    closeExamBtn: '閉じる',
    openLeaderboardBtn: '月間ランキング',
    leaderboardTitle: '月間模擬試験ランキング',
    leaderboardSubtitle: '毎月末に記事模試の獲得ポイント合計に基づきユーザー名で順位を発表します。',
    leaderboardCountdownLabel: '月末締切まで {days}日 {hours}時間',
    leaderboardRankCol: '順位',
    leaderboardUserCol: 'ユーザー名',
    leaderboardScoreCol: '月間スコア',
    leaderboardTimeCol: '所要時間',
    leaderboardExamsCol: '受験数',
    leaderboardCorrectCol: '正解数',
    leaderboardPeakCol: '最高難度',
    summaryTimeRow: '解答時間',
    summaryStartEndRow: '開始 → 終了',
    leaderboardTieBreakNote: '同点の場合、より短い時間で完了した参加者が上位になります。',
    leaderboardRefreshBtn: '更新',
    leaderboardParticipantsUnit: '名',
    pointsUnit: '点',
  },
  pt: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Simulado Adaptativo de 20 Questões · Ranking Mensal',
    cardTitle: 'Simulado Adaptativo (20 Questões)',
    cardSubtitle:
      'Alinhado a este artigo. Começa fácil e ajusta o nível a cada resposta (+50 acerto, +10 em branco, -10 erro). Saia quando quiser; as restantes contam como em branco.',
    startExamBtn: 'Iniciar Simulado (20 Questões)',
    usernameGateTitle: 'Escolha seu Nome de Usuário',
    usernameInputLabel: 'Nome de usuário',
    usernameSubmitBtn: 'Confirmar e Iniciar',
    usernameTakenWarning:
      'Este nome de usuário já está em uso por quem o escolheu primeiro. Escolha uma sugestão livre abaixo ou digite outro nome.',
    usernameSuggestionsLabel: 'Sugestões disponíveis semelhantes:',
    usernameCustomOptionLabel: 'Ou digite outro nome personalizado acima:',
    questionLabel: 'Questão',
    difficultyLabel: 'Nível',
    timeRemainingLabel: 'Tempo',
    liveScoreLabel: 'Pontos',
    leaveBlankBtn: 'Deixar em branco (+10)',
    exitExamBtn: 'Sair do simulado',
    exitConfirmYesBtn: 'Sim, sair e pontuar restantes em branco',
    exitConfirmNoBtn: 'Continuar',
    nextQuestionBtn: 'Próxima questão',
    finishExamBtn: 'Finalizar e ver nota',
    leaderboardTitle: 'Ranking Mensal de Simulados',
    leaderboardTimeCol: 'Tempo',
    summaryTimeRow: 'Tempo de conclusão',
    summaryStartEndRow: 'Início → Fim',
    leaderboardTieBreakNote: 'Desempate: em caso de pontos iguais, quem concluiu em menos tempo fica acima.',
    leaderboardRefreshBtn: 'Atualizar',
    pointsUnit: 'pts',
  },
  it: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Esame Adattivo 20 Domande · Classifica Mensile',
    cardTitle: 'Esame Simulato Adattivo (20 Domande)',
    cardSubtitle:
      'Allineato a questo articolo. Inizia facile e adatta la difficoltà dopo ogni risposta (+50 giusta, +10 vuota, -10 errata). Puoi uscire quando vuoi; le restanti valgono come vuote.',
    startExamBtn: 'Avvia Esame (20 Domande)',
    usernameGateTitle: 'Scegli il tuo Nome Utente',
    usernameInputLabel: 'Nome utente',
    usernameSubmitBtn: 'Conferma e Inizia',
    usernameTakenWarning:
      'Questo nome utente è già in uso dal primo registrato. Scegli un suggerimento libero qui sotto o inseriscine uno personalizzato.',
    usernameSuggestionsLabel: 'Suggerimenti simili disponibili:',
    usernameCustomOptionLabel: 'Oppure inserisci un altro nome utente sopra:',
    questionLabel: 'Domanda',
    difficultyLabel: 'Livello',
    timeRemainingLabel: 'Tempo',
    liveScoreLabel: 'Punti',
    leaveBlankBtn: 'Lascia in bianco (+10)',
    exitExamBtn: 'Esci dall’esame',
    exitConfirmYesBtn: 'Sì, esci e valuta le restanti in bianco',
    exitConfirmNoBtn: 'Continua',
    nextQuestionBtn: 'Prossima domanda',
    finishExamBtn: 'Termina e vedi punteggio',
    leaderboardTitle: 'Classifica Mensile degli Esami',
    leaderboardTimeCol: 'Tempo',
    summaryTimeRow: 'Tempo di completamento',
    summaryStartEndRow: 'Inizio → Fine',
    leaderboardTieBreakNote: 'A parità di punteggio, chi completa in meno tempo si posiziona più in alto.',
    leaderboardRefreshBtn: 'Aggiorna',
    pointsUnit: 'pti',
  },
  ko: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: '20문항 적응형 시간제한 모의고사 · 월간 순위',
    cardTitle: '20문항 적응형 모의고사',
    cardSubtitle:
      '이 논문 주제에 맞춘 20문항. 쉽게 시작해 정답 시 난이도 상승, 오답/미응답 시 하향됩니다(정답+50, 공백+10, 오답-10). 언제든 종료 가능하며 남은 문항은 공백 처리됩니다.',
    startExamBtn: '20문항 모의고사 시작',
    usernameGateTitle: '응시 전 고유 사용자 이름 설정',
    usernameInputLabel: '사용자 이름',
    usernameSubmitBtn: '이름 확정 후 시작',
    usernameTakenWarning:
      '이 사용자 이름은 먼저 등록한 사용자가 사용 중입니다. 아래 사용 가능한 추천 이름 중 선택하거나 다른 이름을 직접 입력하세요.',
    usernameSuggestionsLabel: '사용 가능한 유사 추천 이름:',
    usernameCustomOptionLabel: '또는 위 입력란에 원하는 다른 사용자 이름을 입력하세요:',
    questionLabel: '문항',
    difficultyLabel: '난이도',
    timeRemainingLabel: '남은 시간',
    liveScoreLabel: '점수',
    leaveBlankBtn: '건너뛰기 (+10점)',
    exitExamBtn: '시험 종료',
    exitConfirmYesBtn: '예, 종료하고 남은 문항 공백 처리',
    exitConfirmNoBtn: '계속 풀기',
    nextQuestionBtn: '다음 문항',
    finishExamBtn: '완료 및 점수 확인',
    leaderboardTitle: '월간 모의고사 순위표',
    leaderboardTimeCol: '소요 시간',
    summaryTimeRow: '완료 시간',
    summaryStartEndRow: '시작 → 종료',
    leaderboardTieBreakNote: '동점 시 더 짧은 시간에 완료한 참가자가 상위 순위에 배정됩니다.',
    leaderboardRefreshBtn: '새로고침',
    pointsUnit: '점',
  },
  no: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Adaptiv 20-spørsmåls prøve · Månedlig rangering',
    cardTitle: 'Adaptiv Prøveeksamen (20 Spørsmål)',
    cardSubtitle:
      'Tilpasset denne artikkelen. Starter lett og justerer vanskelighetsgrad etter hvert svar (+50 riktig, +10 blank, -10 feil). Avslutt når som helst; gjenstående teller som blanke.',
    startExamBtn: 'Start 20-spørsmåls prøve',
    usernameGateTitle: 'Velg ditt unike brukernavn',
    usernameInputLabel: 'Brukernavn',
    usernameSubmitBtn: 'Reserver og start',
    usernameTakenWarning:
      'Dette brukernavnet er allerede tatt av den første som valgte det. Velg et ledig forslag nedenfor eller skriv et annet navn.',
    usernameSuggestionsLabel: 'Ledige lignende forslag:',
    usernameCustomOptionLabel: 'Eller skriv inn ditt eget brukernavn ovenfor:',
    questionLabel: 'Spørsmål',
    difficultyLabel: 'Nivå',
    timeRemainingLabel: 'Tid igjen',
    liveScoreLabel: 'Poeng',
    leaveBlankBtn: 'La stå blank (+10)',
    exitExamBtn: 'Avslutt prøve',
    exitConfirmYesBtn: 'Ja, avslutt og tell resten som blanke',
    exitConfirmNoBtn: 'Fortsett',
    nextQuestionBtn: 'Neste spørsmål',
    finishExamBtn: 'Fullfør og se poeng',
    leaderboardTitle: 'Månedlig Prøverangering',
    leaderboardTimeCol: 'Tid',
    summaryTimeRow: 'Fullføringstid',
    summaryStartEndRow: 'Start → Slutt',
    leaderboardTieBreakNote: 'Ved lik poengsum rangeres deltakeren med kortest fullføringstid høyest.',
    leaderboardRefreshBtn: 'Oppdater',
    pointsUnit: 'p',
  },
  is: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Aðlögunarhæft 20 spurninga próf · Mánaðarleg röðun',
    cardTitle: 'Aðlögunarhæft æfingapróf (20 spurningar)',
    startExamBtn: 'Hefja 20 spurninga próf',
    usernameGateTitle: 'Veldu einstakt notandanafn',
    usernameInputLabel: 'Notandanafn',
    usernameSubmitBtn: 'Staðfesta og hefja',
    usernameTakenWarning:
      'Þetta notandanafn er þegar í notkun. Veldu eina af lausu tillögunum hér að neðan eða sláðu inn annað nafn.',
    usernameSuggestionsLabel: 'Lausar svipaðar tillögur:',
    questionLabel: 'Spurning',
    difficultyLabel: 'Erfiðleiki',
    timeRemainingLabel: 'Tími eftir',
    liveScoreLabel: 'Stig',
    leaveBlankBtn: 'Skilja autt (+10)',
    exitExamBtn: 'Hætta í prófi',
    leaderboardTitle: 'Mánaðarleg stigatafla prófa',
    leaderboardTimeCol: 'Tími',
    summaryTimeRow: 'Lokatími',
    leaderboardTieBreakNote: 'Ef stig eru jöfn raðast sá hærra sem lauk prófinu á skemmri tíma.',
    pointsUnit: 'stig',
  },
  da: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Adaptiv 20-spørgsmåls prøve · Månedlig rangliste',
    cardTitle: 'Adaptiv Øvelsesprøve (20 Spørgsmål)',
    startExamBtn: 'Start 20-spørgsmåls prøve',
    usernameGateTitle: 'Vælg dit unikke brugernavn',
    usernameInputLabel: 'Brugernavn',
    usernameSubmitBtn: 'Bekræft og start',
    usernameTakenWarning:
      'Dette brugernavn er allerede optaget af den første bruger. Vælg et ledigt forslag herunder eller indtast et andet navn.',
    usernameSuggestionsLabel: 'Ledige lignende forslag:',
    questionLabel: 'Spørgsmål',
    difficultyLabel: 'Niveau',
    timeRemainingLabel: 'Tid tilbage',
    liveScoreLabel: 'Point',
    leaveBlankBtn: 'Lad stå blank (+10)',
    exitExamBtn: 'Afslut prøve',
    leaderboardTitle: 'Månedlig Prøverangliste',
    leaderboardTimeCol: 'Tid',
    summaryTimeRow: 'Gennemførelsestid',
    leaderboardTieBreakNote: 'Ved pointlighed rangerer deltageren med kortest gennemførelsestid højest.',
    pointsUnit: 'p',
  },
  sv: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Adaptivt 20-frågors prov · Månadsrankning',
    cardTitle: 'Adaptivt Övningsprov (20 Frågor)',
    startExamBtn: 'Starta 20-frågors prov',
    usernameGateTitle: 'Välj ditt unika användarnamn',
    usernameInputLabel: 'Användarnamn',
    usernameSubmitBtn: 'Bekräfta och starta',
    usernameTakenWarning:
      'Detta användarnamn används redan av den som valde det först. Välj ett ledigt förslag nedan eller ange ett eget namn.',
    usernameSuggestionsLabel: 'Lediga liknande förslag:',
    questionLabel: 'Fråga',
    difficultyLabel: 'Nivå',
    timeRemainingLabel: 'Tid kvar',
    liveScoreLabel: 'Poäng',
    leaveBlankBtn: 'Lämna blank (+10)',
    exitExamBtn: 'Avsluta prov',
    leaderboardTitle: 'Månatlig Provrankning',
    leaderboardTimeCol: 'Tid',
    summaryTimeRow: 'Genomförandetid',
    leaderboardTieBreakNote: 'Vid lika poäng placeras deltagaren med kortast tid högre.',
    pointsUnit: 'p',
  },
  nl: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Adaptieve Toets van 20 Vragen · Maandranglijst',
    cardTitle: 'Adaptief Oefenexamen (20 Vragen)',
    startExamBtn: 'Start 20-vragen examen',
    usernameGateTitle: 'Kies je unieke gebruikersnaam',
    usernameInputLabel: 'Gebruikersnaam',
    usernameSubmitBtn: 'Bevestig en start',
    usernameTakenWarning:
      'Deze gebruikersnaam is al in gebruik door de eerste gebruiker. Kies een vrije suggestie hieronder of voer een andere naam in.',
    usernameSuggestionsLabel: 'Beschikbare vergelijkbare suggesties:',
    questionLabel: 'Vraag',
    difficultyLabel: 'Niveau',
    timeRemainingLabel: 'Resterende tijd',
    liveScoreLabel: 'Score',
    leaveBlankBtn: 'Open laten (+10)',
    exitExamBtn: 'Examen verlaten',
    leaderboardTitle: 'Maandelijkse Examenranglijst',
    leaderboardTimeCol: 'Tijd',
    summaryTimeRow: 'Voltooiingstijd',
    leaderboardTieBreakNote: 'Bij gelijke score staat de deelnemer met de kortste voltooiingstijd hoger.',
    pointsUnit: 'ptn',
  },
  fi: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Mukautuva 20 kysymyksen koe · Kuukausisijoitus',
    cardTitle: 'Mukautuva Harjoituskoe (20 Kysymystä)',
    startExamBtn: 'Aloita 20 kysymyksen koe',
    usernameGateTitle: 'Valitse yksilöllinen käyttäjänimi',
    usernameInputLabel: 'Käyttäjänimi',
    usernameSubmitBtn: 'Vahvista ja aloita',
    usernameTakenWarning:
      'Tämä käyttäjänimi on jo varattu ensimmäiselle käyttäjälle. Valitse vapaa ehdotus alta tai kirjoita toinen nimi.',
    usernameSuggestionsLabel: 'Vapaat samankaltaiset ehdotukset:',
    questionLabel: 'Kysymys',
    difficultyLabel: 'Taso',
    timeRemainingLabel: 'Aikaa jäljellä',
    liveScoreLabel: 'Pisteet',
    leaveBlankBtn: 'Jätä tyhjäksi (+10)',
    exitExamBtn: 'Poistu kokeesta',
    leaderboardTitle: 'Kuukausittainen Koeranking',
    leaderboardTimeCol: 'Aika',
    summaryTimeRow: 'Suoritusaika',
    leaderboardTieBreakNote: 'Tasapisteissä nopeammin kokeen suorittanut sijoittuu ylemmäksi.',
    pointsUnit: 'p',
  },
  ga: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Scrúdú Oiriúnaitheach 20 Ceist · Rangú Míosúil',
    cardTitle: 'Scrúdú Cleachtaidh Oiriúnaitheach (20 Ceist)',
    startExamBtn: 'Tosaigh Scrúdú 20 Ceist',
    usernameGateTitle: 'Roghnaigh d’Ainm Úsáideora Uathúil',
    usernameInputLabel: 'Ainm úsáideora',
    usernameSubmitBtn: 'Deimhnigh agus Tosaigh',
    usernameTakenWarning:
      'Tá an t-ainm úsáideora seo tógtha cheana féin. Roghnaigh moladh saor thíos nó cuir ainm eile isteach.',
    usernameSuggestionsLabel: 'Moltaí cosúla atá ar fáil:',
    questionLabel: 'Ceist',
    difficultyLabel: 'Leibhéal',
    timeRemainingLabel: 'Am fágtha',
    liveScoreLabel: 'Scór',
    leaveBlankBtn: 'Fág bán (+10)',
    exitExamBtn: 'Fág an scrúdú',
    leaderboardTitle: 'Rangú Míosúil na Scrúduithe',
    leaderboardTimeCol: 'Am',
    summaryTimeRow: 'Am críochnaithe',
    leaderboardTieBreakNote: 'Ar chomhscór, rangaítear an rannpháirtí leis an am is giorra níos airde.',
    pointsUnit: 'pt',
  },
  lb: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Adaptiven 20-Froen-Test · Mountsrangliste',
    cardTitle: 'Adaptiven Übungstest (20 Froen)',
    startExamBtn: '20-Froen-Test starten',
    usernameGateTitle: 'Wielt Ären eenzegaartege Benotzernumm',
    usernameInputLabel: 'Benotzernumm',
    usernameSubmitBtn: 'Bestätegen & starten',
    usernameTakenWarning:
      'Dëse Benotzernumm ass scho verginn. Wielt e fräie Virschlag hei ënnen oder gitt en aneren Numm an.',
    usernameSuggestionsLabel: 'Fräi ähnlech Virschléi:',
    questionLabel: 'Fro',
    difficultyLabel: 'Niveau',
    timeRemainingLabel: 'Reschtzäit',
    liveScoreLabel: 'Punkten',
    leaveBlankBtn: 'Eidel loossen (+10)',
    exitExamBtn: 'Test verloossen',
    leaderboardTitle: 'Mountsrangliste vun den Tester',
    leaderboardTimeCol: 'Zäit',
    summaryTimeRow: 'Zäit gebraucht',
    leaderboardTieBreakNote: 'Bei gläiche Punkte kënnt dee mat der méi kuerzer Zäit méi héich.',
    pointsUnit: 'Pkt',
  },
  rm: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Examen Adaptiv 20 Dumondas · Rangaziun Mensila',
    cardTitle: 'Examen da Pratica Adaptiv (20 Dumondas)',
    startExamBtn: 'Cumenzar l’examen (20 dumondas)',
    usernameGateTitle: 'Tscherner in num d’utilisader unic',
    usernameInputLabel: 'Num d’utilisader',
    usernameSubmitBtn: 'Confermar e cumenzar',
    usernameTakenWarning:
      'Quest num d’utilisader è gia occupà. Tscherna ina proposta libra sutvart u scriva in auter num.',
    usernameSuggestionsLabel: 'Propostas sumegliantas libras:',
    questionLabel: 'Dumonda',
    difficultyLabel: 'Nivel',
    timeRemainingLabel: 'Temp restant',
    liveScoreLabel: 'Puncts',
    leaveBlankBtn: 'Laschar vid (+10)',
    exitExamBtn: 'Bandunar l’examen',
    leaderboardTitle: 'Rangaziun Mensila dals Examens',
    leaderboardTimeCol: 'Temp',
    summaryTimeRow: 'Temp da terminaziun',
    leaderboardTieBreakNote: 'Cun ils medems puncts sa plazzescha il pli aut tgi che terminescha pli spert.',
    pointsUnit: 'pts',
  },
  ms: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: 'Peperiksaan Adaptif 20 Soalan · Kedudukan Bulanan',
    cardTitle: 'Peperiksaan Latihan Adaptif (20 Soalan)',
    startExamBtn: 'Mula Peperiksaan 20 Soalan',
    usernameGateTitle: 'Pilih Nama Pengguna Unik Anda',
    usernameInputLabel: 'Nama pengguna',
    usernameSubmitBtn: 'Sahkan & Mula',
    usernameTakenWarning:
      'Nama pengguna ini sudah digunakan oleh pendaftar pertama. Pilih cadangan tersedia di bawah atau masukkan nama lain.',
    usernameSuggestionsLabel: 'Cadangan serupa yang tersedia:',
    questionLabel: 'Soalan',
    difficultyLabel: 'Tahap',
    timeRemainingLabel: 'Masa berbaki',
    liveScoreLabel: 'Markah',
    leaveBlankBtn: 'Tinggal kosong (+10)',
    exitExamBtn: 'Keluar peperiksaan',
    leaderboardTitle: 'Kedudukan Bulanan Peperiksaan Latihan',
    leaderboardTimeCol: 'Masa',
    summaryTimeRow: 'Masa Siap',
    leaderboardTieBreakNote: 'Jika markah sama, peserta dengan masa siap lebih singkat berada di kedudukan lebih tinggi.',
    pointsUnit: 'mata',
  },
  ta: {
    ...ENGLISH_EXAM_UI,
    badgeTitle: '20 கேள்வி தகவமைப்புத் தேர்வு · மாதாந்திர தரவரிசை',
    cardTitle: '20 கேள்வி தகவமைப்பு மாதிரித் தேர்வு',
    startExamBtn: '20 கேள்வி தேர்வைத் தொடங்கு',
    usernameGateTitle: 'தனித்துவமான பயனர் பெயரைத் தேர்ந்தெடுக்கவும்',
    usernameInputLabel: 'பயனர் பெயர்',
    usernameSubmitBtn: 'உறுதிசெய்து தொடங்கு',
    usernameTakenWarning:
      'இந்தப் பயனர் பெயர் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது. கீழே உள்ள கிடைக்கும் பரிந்துரையைத் தேர்வுசெய்யவும் அல்லது வேறு பெயரை உள்ளிடவும்.',
    usernameSuggestionsLabel: 'கிடைக்கும் ஒத்த பரிந்துரைகள்:',
    questionLabel: 'கேள்வி',
    difficultyLabel: 'நிலை',
    timeRemainingLabel: 'மீதமுள்ள நேரம்',
    liveScoreLabel: 'மதிப்பெண்',
    leaveBlankBtn: 'காலியாக விடு (+10)',
    exitExamBtn: 'தேர்விலிருந்து வெளியேறு',
    leaderboardTitle: 'மாதாந்திர மாதிரித் தேர்வு தரவரிசை',
    leaderboardTimeCol: 'நேரம்',
    summaryTimeRow: 'நிறைவு நேரம்',
    leaderboardTieBreakNote: 'சம மதிப்பெண் பெற்றால், குறைந்த நேரத்தில் முடித்தவர் மேல் இடத்தைப் பெறுவார்.',
    pointsUnit: 'புள்ளி',
  },
};

export function getExamUiStrings(lang: LanguageCode): ExamUiStrings {
  return EXAM_UI_23_LANGS[lang] || EXAM_UI_23_LANGS.en;
}

export function formatExamDurationMs(durationMs: number, showTenths = false): string {
  const safeMs = Math.max(0, Math.round(Number(durationMs) || 0));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const tenths = Math.floor((safeMs % 1000) / 100);

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  const base = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return showTenths ? `${base}.${tenths}` : base;
}

// Deterministic lightweight hash for per-article reproducible shuffling
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleWithCorrect(
  correctOption: string,
  distractors: string[],
  seedStr: string
): { options: string[]; correctIndex: number } {
  const uniquePool: string[] = [correctOption];
  for (const d of distractors) {
    const clean = d.trim();
    if (clean && !uniquePool.some((x) => x.toLowerCase() === clean.toLowerCase())) {
      uniquePool.push(clean);
    }
    if (uniquePool.length === 4) break;
  }
  while (uniquePool.length < 4) {
    uniquePool.push(`Alternative interpretation #${uniquePool.length + 1}`);
  }
  const indices = [0, 1, 2, 3];
  let seed = hashString(seedStr);
  for (let i = indices.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }
  const options = indices.map((idx) => uniquePool[idx]);
  const correctIndex = indices.indexOf(0);
  return { options, correctIndex };
}

function truncateText(text: string, maxLen = 140): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trimEnd() + '…';
}

function extractSentences(paragraphs: string[], abstract: string): string[] {
  const joined = [abstract, ...paragraphs].join(' ');
  const raw = joined
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length >= 35 && s.length <= 240);
  return Array.from(new Set(raw));
}

function extractKeyTerms(title: string, subtitle: string, abstract: string, findings: string[]): string[] {
  const stopWords = new Set([
    've', 'ile', 'bir', 'bu', 'için', 'olarak', 'olan', 'gibi', 'daha', 'üzerine', 'kadar', 'nasıl',
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'about', 'what', 'when', 'where',
    'which', 'their', 'there', 'through', 'between', 'under', 'over', 'does', 'have', 'been',
  ]);
  const text = `${title} ${subtitle} ${abstract} ${findings.join(' ')}`;
  const words = text
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 5 && !stopWords.has(w.toLowerCase()));
  const freq = new Map<string, { word: string; count: number }>();
  for (const w of words) {
    const key = w.toLowerCase();
    const cur = freq.get(key);
    if (cur) cur.count += 1;
    else freq.set(key, { word: w, count: 1 });
  }
  return Array.from(freq.values())
    .sort((a, b) => b.count - a.count)
    .map((x) => x.word)
    .slice(0, 12);
}

interface DomainDistractorPack {
  domainNameTr: string;
  domainNameEn: string;
  otherDomainsTr: string[];
  otherDomainsEn: string[];
  falseClaimsTr: string[];
  falseClaimsEn: string[];
  methodFlawsTr: string[];
  methodFlawsEn: string[];
  deepPrincipleTr: string;
  deepPrincipleEn: string;
}

const DOMAIN_PACKS: Record<SimulationType, DomainDistractorPack> = {
  quantum: {
    domainNameTr: 'Kuantum Fiziği ve Ölçüm Kuramı',
    domainNameEn: 'Quantum Physics & Measurement Theory',
    otherDomainsTr: ['Klasik Tarım Ekonomisi', 'Antik Mimari Restorasyon', 'Denizcilik Hukuku'],
    otherDomainsEn: ['Classical Agricultural Economics', 'Ancient Architectural Restoration', 'Maritime Commercial Law'],
    falseClaimsTr: [
      'Kuantum süperpozisyon yalnızca çıplak gözle görülen makroskobik taşlarda oluşur ve olasılık içermez.',
      'Ölçüm süreci sistemin durum vektöründen tamamen bağımsızdır ve hiçbir etkileşim yaratmaz.',
      'Dalga-parçacık ikiliği modern deneylerde çürütülmüş ve tamamen klasik mekaniğe indirgenmiştir.',
    ],
    falseClaimsEn: [
      'Quantum superposition occurs only in macroscopic stones without probability amplitudes.',
      'Measurement is completely decoupled from the state vector and involves zero interaction.',
      'Wave-particle duality was disproved and fully reduced to classical rigid-body mechanics.',
    ],
    methodFlawsTr: [
      'Deneysel gözlem sınırlarını yok sayıp yalnızca tek bir sabit sayı ile tüm dalga fonksiyonunu açıklamak',
      'Olasılık genliklerini ihmal edip klasik deterministik yörünge varsayımını koşulsuz dayatmak',
      'Matematiksel tutarlılığı test etmeden kavramsal metaforları doğrudan fiziksel yasa saymak',
    ],
    methodFlawsEn: [
      'Ignoring experimental bounds and claiming a single static constant explains the full wave function',
      'Discarding probability amplitudes and enforcing strictly classical trajectories unconditionally',
      'Treating informal metaphors as physical laws without formal or empirical consistency checks',
    ],
    deepPrincipleTr:
      'Gözlem etkileşimi, bilgi aktarımı ve olasılık genlikleri arasındaki yapısal bağlamı koruyarak kuramsal tutarlılığı test etmek',
    deepPrincipleEn:
      'Preserving structural consistency across observation interaction, information transfer, and probability amplitudes',
  },
  higgs: {
    domainNameTr: 'Parçacık Fiziği ve Alan Etkileşimleri',
    domainNameEn: 'Particle Physics & Field Interactions',
    otherDomainsTr: ['Orta Çağ Dilbilimi', 'Botanik Sınıflandırma', 'Şehir Trafik Planlaması'],
    otherDomainsEn: ['Medieval Linguistics', 'Botanical Taxonomy', 'Urban Traffic Engineering'],
    falseClaimsTr: [
      'Temel parçacıklar kütleyi yalnızca Dünya’nın yerçekimi atmosferinden alır.',
      'Kuantum alanları boş uzayda sıfır enerji ve sıfır simetri yapısına sahiptir.',
      'Simetri kırılması parçacık etkileşimlerinde hiçbir gözlenebilir sonuç üretmez.',
    ],
    falseClaimsEn: [
      'Elementary particles acquire rest mass solely from Earth’s atmospheric pressure.',
      'Quantum fields possess zero vacuum structure and no symmetry properties in empty space.',
      'Spontaneous symmetry breaking produces no observable consequences in particle collisions.',
    ],
    methodFlawsTr: [
      'Alan etkileşim enerjisini ve simetri koşullarını göz ardı ederek kütleyi statik bir etiket saymak',
      'Yüksek enerji ölçeklerindeki geçerlilik sınırlarını kontrol etmeden modeli tüm ölçeklere genellemek',
      'Deneysel çarpıştırıcı verileriyle karşılaştırma yapmadan sonuçları kesin kabul etmek',
    ],
    methodFlawsEn: [
      'Ignoring field coupling and symmetry conditions by treating mass as an uncoupled static label',
      'Extrapolating a model across all energy scales without checking high-energy boundary limits',
      'Declaring theoretical conclusions final without testing against collider observations',
    ],
    deepPrincipleTr:
      'Simetri kırılması ve alan bağlaşım katsayılarının parçacık kütlesi ile etkileşim ölçeğini nasıl belirlediğini ortaya koymak',
    deepPrincipleEn:
      'Clarifying how symmetry breaking and field coupling constants govern particle mass and interaction scales',
  },
  holographic: {
    domainNameTr: 'Kozmoloji, Bilgi Kuramı ve Holografik İlke',
    domainNameEn: 'Cosmology, Information Theory & Holographic Principle',
    otherDomainsTr: ['Geleneksel Tekstil Dokumacılığı', 'Klasik Bankacılık Muhasebesi', 'Jeolojik Maden Arama'],
    otherDomainsEn: ['Traditional Textile Weaving', 'Classical Banking Accounting', 'Geological Ore Mining'],
    falseClaimsTr: [
      'Bir bölgedeki maksimum bilgi kapasitesi yalnızca kütle ağırlığına bağlıdır ve yüzey alanıyla ilgisizdir.',
      'Holografik ilke uzay-zamanın tamamen bir optik kamera projeksiyonu olduğunu kanıtlamıştır.',
      'Kara delik entropisi sıfırdır ve bilgi evrende hiçbir korunum ilkesine tabi değildir.',
    ],
    falseClaimsEn: [
      'Maximum information capacity depends solely on object weight and is unrelated to boundary area.',
      'The holographic principle proves spacetime is literally a cinema projector screen.',
      'Black hole entropy is strictly zero and quantum information follows no conservation bounds.',
    ],
    methodFlawsTr: [
      'Sınır yüzeyi (alan) ile hacim (bulk) arasındaki matematiksel eşleşmeyi görmezden gelmek',
      'Entropi ve bilgi yoğunluğu sınırlarını kontrol etmeden sınırsız veri depolama varsaymak',
      'Kozmolojik ölçek ile kuantum bilgi ölçeği arasındaki geçiş mekanizmasını atlamak',
    ],
    methodFlawsEn: [
      'Ignoring the mathematical duality mapping between boundary area and bulk volume',
      'Assuming unbounded information density while disregarding entropy area bounds',
      'Skipping the scale-bridging mechanism between quantum information and cosmological geometry',
    ],
    deepPrincipleTr:
      'Sınır yüzeyindeki bilgi kodlaması ile hacimsel fiziksel dinamikler arasındaki entropi ve eşleniklik ilişkisini değerlendirmek',
    deepPrincipleEn:
      'Evaluating the entropy and duality correspondence between boundary information encoding and bulk dynamics',
  },
  spacetime: {
    domainNameTr: 'Zaman Felsefesi ve Görelilik Fiziği',
    domainNameEn: 'Philosophy of Time & Relativistic Physics',
    otherDomainsTr: ['Endüstriyel Gıda Paketleme', 'Klasik Müzik Nota Basımı', 'Orman Yangını Lojistiği'],
    otherDomainsEn: ['Industrial Food Packaging', 'Sheet Music Publishing', 'Forestry Logistics'],
    falseClaimsTr: [
      'Zaman evrenin her noktasında tüm hız ve kütleçekim alanlarında kesinlikle aynı hızla akar.',
      'Işık hızı gözlemcinin hareket hızına bağlı olarak sınırsız biçimde artar veya azalır.',
      'Kütleçekimi yalnızca düz çizgide çekim yapar ve uzay-zaman geometrisini hiç etkilemez.',
    ],
    falseClaimsEn: [
      'Time ticks at an identical absolute rate everywhere regardless of velocity or gravity.',
      'The speed of light in vacuum grows arbitrarily when added to the observer’s speed.',
      'Gravity acts exclusively in flat Euclidean space with zero spacetime curvature.',
    ],
    methodFlawsTr: [
      'Referans çerçeveleri arasındaki göreli eşzamanlılık farkını yok saymak',
      'Öz-zaman (proper time) ile koordinat zamanını birbirine karıştırmak',
      'Yüksek kütleçekimi veya göreli hızlarda klasik Newton yaklaşımını mutlak kabul etmek',
    ],
    methodFlawsEn: [
      'Ignoring relativity of simultaneity across distinct inertial reference frames',
      'Conflating proper time measured along a worldline with global coordinate time',
      'Treating low-velocity Newtonian approximations as exact at relativistic speeds or strong gravity',
    ],
    deepPrincipleTr:
      'Referans çerçevesi, nedensellik konisi ve kütleçekimsel zaman genişlemesi arasındaki geometrik bütünlüğü korumak',
    deepPrincipleEn:
      'Preserving the geometric unity of reference frames, causal light cones, and gravitational time dilation',
  },
  consciousness: {
    domainNameTr: 'Zihin Felsefesi, Bilinç ve Epistemoloji',
    domainNameEn: 'Philosophy of Mind, Consciousness & Epistemology',
    otherDomainsTr: ['Köprü İnşaat Statiği', 'Tarımsal Sulama Mekanizması', 'Havacılık Yakıt Kimyası'],
    otherDomainsEn: ['Bridge Structural Statics', 'Agricultural Irrigation Mechanics', 'Aviation Fuel Chemistry'],
    falseClaimsTr: [
      'Bilinçli deneyim yalnızca tek bir nöronun elektrik sinyaliyle tamamen açıklanıp kapanmıştır.',
      'Öznel deneyim (qualia) ile üçüncü tekil şahıs fiziksel ölçümü arasında hiçbir kavramsal fark yoktur.',
      'Felsefi sorgulama bilimsel hipotez üretimine hiçbir kavramsal netlik katmaz.',
    ],
    falseClaimsEn: [
      'Subjective conscious experience has been completely solved by measuring a single isolated neuron.',
      'There is zero conceptual gap between first-person qualia and third-person physical telemetry.',
      'Philosophical inquiry contributes no conceptual precision to scientific hypothesis framing.',
    ],
    methodFlawsTr: [
      'Korelasyon (eşzamanlı nöral aktivite) ile nedensel/ontolojik özdeşliği ayrıştırmadan eşitlemek',
      'Öznel farkındalık katmanını yok sayıp yalnızca dışsal davranış çıktısına indirgemek',
      'Kavramsal tanımları netleştirmeden farklı disiplinlerin terimlerini birbirinin yerine kullanmak',
    ],
    methodFlawsEn: [
      'Equating neural correlation directly with ontological identity without explanatory bridging',
      'Reducing subjective awareness purely to external input-output behavior without examination',
      'Mixing incompatible disciplinary terms without clarifying conceptual definitions first',
    ],
    deepPrincipleTr:
      'Öznel bilinç deneyimi, bilgi bütünleşmesi ve bilimsel gözlem sınırlarını indirgemecilik tuzağına düşmeden analiz etmek',
    deepPrincipleEn:
      'Analyzing subjective consciousness, information integration, and scientific observability without naive reductionism',
  },
  chaos: {
    domainNameTr: 'Epistemoloji, Karmaşık Sistemler ve Kaos Kuramı',
    domainNameEn: 'Epistemology, Complex Systems & Chaos Theory',
    otherDomainsTr: ['Klasik Kütüphane Ciltçiliği', 'Müzik Aleti Akort Sanatı', 'Geleneksel Seramik Boyama'],
    otherDomainsEn: ['Classical Bookbinding', 'Musical Instrument Tuning', 'Traditional Ceramic Glazing'],
    falseClaimsTr: [
      'Kaos kuramı doğada hiçbir matematiksel kural olmadığını ve her şeyin tamamen rastgele olduğunu savunur.',
      'Başlangıç koşullarındaki küçük sapmalar doğrusal olmayan sistemlerde zamanla sıfırlanır.',
      'Karmaşık sistemler yalnızca tek bir parçanın incelenmesiyle eksiksiz öngörülebilir.',
    ],
    falseClaimsEn: [
      'Chaos theory claims nature has zero mathematical rules and is purely structureless randomness.',
      'Tiny initial-condition differences always decay to zero in nonlinear chaotic systems.',
      'Complex adaptive systems can be predicted exhaustively by isolating a single component.',
    ],
    methodFlawsTr: [
      'Doğrusal olmayan geri besleme döngülerini basit doğrusal orantı gibi modellemek',
      'Başlangıç koşullarına duyarlılığı ve öngörü ufkunu göz ardı etmek',
      'Deterministik kaos ile saf gürültü (rastgelelik) arasındaki yapısal farkı karıştırmak',
    ],
    methodFlawsEn: [
      'Modeling nonlinear feedback loops as simple linear proportions across long horizons',
      'Disregarding sensitive dependence on initial conditions and finite predictability horizons',
      'Confusing deterministic chaotic attractors with structureless random noise',
    ],
    deepPrincipleTr:
      'Deterministik kurallar, başlangıç duyarlılığı ve ortaya çıkan (emergent) düzen arasındaki epistemik dengeyi kavramak',
    deepPrincipleEn:
      'Grasping the epistemic balance between deterministic laws, initial sensitivity, and emergent order',
  },
  software: {
    domainNameTr: 'Yazılım Mühendisliği, Hesaplama ve Dijital Sistemler',
    domainNameEn: 'Software Engineering, Computation & Digital Systems',
    otherDomainsTr: ['Antik Heykelcilik', 'Klasik Botanik İllüstrasyon', 'Kırsal Hayvancılık Yönetimi'],
    otherDomainsEn: ['Ancient Sculpture', 'Botanical Illustration', 'Rural Livestock Management'],
    falseClaimsTr: [
      'Yazılım sistemleri ölçek büyüdükçe hiçbir mimari veya doğrulama katmanına ihtiyaç duymaz.',
      'Algoritmik karmaşıklık ile hesaplama maliyeti arasında hiçbir pratik ilişki yoktur.',
      'Veri bütünlüğü ve güvenlik yalnızca arayüz rengiyle garanti altına alınır.',
    ],
    falseClaimsEn: [
      'Software systems require zero architectural modularity or verification as scale increases.',
      'Algorithmic complexity has no practical relationship to latency or compute cost.',
      'Data integrity and security are guaranteed solely through visual styling.',
    ],
    methodFlawsTr: [
      'Uç durumları (edge cases) ve veri doğrulama sınırlarını test etmeden sistemi yayına almak',
      'Performans darboğazlarını ölçmeden varsayımsal optimizasyon yapmak',
      'Kullanıcı güvenliği ve veri gizliliğini sonradan eklenecek bir detay olarak görmek',
    ],
    methodFlawsEn: [
      'Deploying systems without testing boundary edge cases and input validation guarantees',
      'Applying speculative optimizations without measuring actual latency or resource bottlenecks',
      'Treating security and privacy boundaries as optional afterthoughts',
    ],
    deepPrincipleTr:
      'Ölçeklenebilir mimari, doğrulanabilir veri bütünlüğü ve hesaplama verimliliğini bütünleşik olarak optimize etmek',
    deepPrincipleEn:
      'Jointly optimizing scalable architecture, verifiable data integrity, and computational efficiency',
  },
};

// Localized prompt templates for clean 23-language question generation
interface PromptTemplates {
  isTr: boolean;
  qMainSubject: (title: string) => string;
  qDomain: (title: string) => string;
  qAuthorScope: (title: string) => string;
  qTermMatch: (term: string, title: string) => string;
  qFindingDirect: (idx: number, title: string) => string;
  qParamRole: (paramLabel: string, unit: string, title: string) => string;
  qModelFormula: (title: string, eq: string) => string;
  qScientistLink: (scientist: string, era: string, title: string) => string;
  qMethodFlaw: (title: string) => string;
  qFalseClaimElim: (title: string) => string;
  qDeepSynthesis: (title: string, aspect: number) => string;
  qCompareThinkers: (s1: string, s2: string, title: string) => string;
  qBoundaryCondition: (paramLabel: string, min: number, max: number, unit: string, title: string) => string;
  qCriticalEval: (finding: string, title: string) => string;
  expBase: (reason: string) => string;
}

function getPromptTemplates(lang: LanguageCode): PromptTemplates {
  if (lang === 'tr') {
    return {
      isTr: true,
      qMainSubject: (title) => `“${title}” başlıklı makalenin temel odak noktası aşağıdakilerden hangisidir?`,
      qDomain: (title) => `“${title}” çalışması öncelikle hangi bilimsel/felsefi araştırma alanıyla ilişkilidir?`,
      qAuthorScope: (title) => `Emre Pelit’in “${title}” makalesi okuyucuya ne tür bir bütüncül çerçeve sunar?`,
      qTermMatch: (term, title) => `“${title}” makalesi bağlamında “${term}” kavramı hangi bilimsel rolü üstlenir?`,
      qFindingDirect: (idx, title) => `“${title}” makalesinin ${idx}. temel bulgusu olarak öne çıkan çıkarım hangisidir?`,
      qParamRole: (p, u, title) => `“${title}” makalesinin etkileşimli modelindeki “${p}” (${u || 'birimsiz'}) parametresi neyi temsil eder?`,
      qModelFormula: (title, eq) => `“${title}” çalışmasında yer alan "${eq}" kuramsal bağıntısının kavramsal işlevi nedir?`,
      qScientistLink: (sc, era, title) => `${sc} (${era}) yaklaşımı, “${title}” makalesinin ele aldığı problemle nasıl bağlantılıdır?`,
      qMethodFlaw: (title) => `“${title}” makalesinin yöntembilimine göre aşağıdaki yaklaşımlardan hangisi hatalı bir metodolojik kusur sayılır?`,
      qFalseClaimElim: (title) => `“${title}” makalesinin bilimsel sınırları dikkate alındığında, aşağıdaki yargılardan hangisi DOĞRUDAN desteklenir?`,
      qDeepSynthesis: (title, aspect) =>
        aspect % 2 === 0
          ? `İleri Düzey Sentez (#${aspect}): “${title}” makalesindeki kuramsal yapı ile ampirik doğrulanabilirlik arasındaki en tutarlı köprü hangisidir?`
          : `Akademik Değerlendirme (#${aspect}): “${title}” tezini indirgemeci itirazlara karşı güçlendiren temel yapısal ilke nedir?`,
      qCompareThinkers: (s1, s2, title) =>
        `${s1} ile ${s2} yaklaşımları “${title}” makalesinin çerçevesinde karşılaştırıldığında hangi sentez öne çıkar?`,
      qBoundaryCondition: (p, min, max, u, title) =>
        `“${title}” modelinde “${p}” parametresi [${min} – ${max}${u ? ' ' + u : ''}] sınır aralığında uç değere yaklaştığında bilimsel analiz açısından ne beklenir?`,
      qCriticalEval: (finding, title) =>
        `“${title}” makalesindeki “${truncateText(finding, 105)}” önermesi epistemolojik açıdan nasıl değerlendirilmelidir?`,
      expBase: (r) => `Açıklama: ${r}`,
    };
  }
  return {
    isTr: false,
    qMainSubject: (title) => `What is the central focus of the article "${title}"?`,
    qDomain: (title) => `Which primary scientific or philosophical domain does "${title}" investigate?`,
    qAuthorScope: (title) => `What overarching analytical framework does Emre Pelit present in "${title}"?`,
    qTermMatch: (term, title) => `Within "${title}", what conceptual role does "${term}" play?`,
    qFindingDirect: (idx, title) => `Which statement accurately reflects key finding #${idx} of "${title}"?`,
    qParamRole: (p, u, title) => `In the interactive model of "${title}", what does the parameter "${p}" (${u || 'dimensionless'}) govern?`,
    qModelFormula: (title, eq) => `What is the conceptual function of the formal relation "${eq}" used in "${title}"?`,
    qScientistLink: (sc, era, title) => `How does the historical work of ${sc} (${era}) connect to the inquiry in "${title}"?`,
    qMethodFlaw: (title) => `According to the methodology of "${title}", which approach represents a methodological flaw to avoid?`,
    qFalseClaimElim: (title) => `Considering the scientific bounds of "${title}", which statement is rigorously supported?`,
    qDeepSynthesis: (title, aspect) =>
      aspect % 2 === 0
        ? `Advanced Synthesis (#${aspect}): Which principle best bridges theoretical formalism and empirical testability in "${title}"?`
        : `Master Evaluation (#${aspect}): What structural insight best defends the thesis of "${title}" against naive reductionism?`,
    qCompareThinkers: (s1, s2, title) =>
      `Comparing ${s1} and ${s2} within the framework of "${title}", which interdisciplinary synthesis emerges?`,
    qBoundaryCondition: (p, min, max, u, title) =>
      `When "${p}" approaches the boundary of [${min} – ${max}${u ? ' ' + u : ''}] in "${title}", what does rigorous analysis require?`,
    qCriticalEval: (finding, title) =>
      `How should the claim "${truncateText(finding, 105)}" from "${title}" be evaluated epistemologically?`,
    expBase: (r) => `Explanation: ${r}`,
  };
}

/**
 * Generates a rich, 60-question adaptive pool tailored specifically to ONE article,
 * covering Difficulty Levels 1..10 (10 questions at L1, 5 each at L2..L9, 10 at L10),
 * so even a 20-question extreme streak never repeats any question.
 */
export function buildAdaptiveExamQuestionPool(
  article: Article,
  lang: LanguageCode,
  translatedArticle?: TranslatedArticleContent | null
): AdaptiveExamQuestion[] {
  const ui = getExamUiStrings(lang);
  const tpl = getPromptTemplates(lang);
  const simType: SimulationType = article.simulation?.type || 'quantum';
  const pack = DOMAIN_PACKS[simType] || DOMAIN_PACKS.quantum;

  const title = (translatedArticle?.title || getLocalizedText(article.title, lang) || article.slug).trim();
  const subtitle = (translatedArticle?.subtitle || getLocalizedText(article.subtitle, lang) || '').trim();
  const abstract = (translatedArticle?.abstract || getLocalizedText(article.abstract, lang) || '').trim();
  const findings = (
    translatedArticle?.keyFindings && translatedArticle.keyFindings.length > 0
      ? translatedArticle.keyFindings
      : getLocalizedArray(article.keyFindings, lang)
  ).filter(Boolean);
  const paragraphs = (
    translatedArticle?.contentParagraphs && translatedArticle.contentParagraphs.length > 0
      ? translatedArticle.contentParagraphs
      : getLocalizedArray(article.contentParagraphs, lang)
  ).filter(Boolean);
  const methodNote = (
    translatedArticle?.methodologyNote ||
    getLocalizedText(article.simulation?.methodologyNote, lang) ||
    ''
  ).trim();
  const simTitle = getLocalizedText(article.simulation?.title, lang) || title;
  const equation = (article.simulation?.equationLatex || 'f(x, t) = \\Delta S').trim();
  const params = article.simulation?.parameters || [];

  const scientistsPack = getHistoricalScientistsForTheme(simType, lang);
  const scientists = scientistsPack.thinkers || [];
  const sentences = extractSentences(paragraphs, abstract);
  const keyTerms = extractKeyTerms(title, subtitle, abstract, findings);

  const domainName = tpl.isTr ? pack.domainNameTr : pack.domainNameEn;
  const otherDomains = tpl.isTr ? pack.otherDomainsTr : pack.otherDomainsEn;
  const falseClaims = tpl.isTr ? pack.falseClaimsTr : pack.falseClaimsEn;
  const methodFlaws = tpl.isTr ? pack.methodFlawsTr : pack.methodFlawsEn;
  const deepPrinciple = tpl.isTr ? pack.deepPrincipleTr : pack.deepPrincipleEn;

  const pool: AdaptiveExamQuestion[] = [];
  const addQ = (
    id: string,
    difficulty: number,
    topicTag: string,
    prompt: string,
    correct: string,
    distractors: string[],
    explanation: string
  ) => {
    const { options, correctIndex } = shuffleWithCorrect(
      correct,
      distractors,
      `${article.id}::${lang}::${id}`
    );
    pool.push({
      id: `${article.id}-${id}`,
      difficulty,
      topicTag,
      prompt,
      options,
      correctIndex,
      explanation: tpl.expBase(explanation),
    });
  };

  // --- LEVEL 1 (10 distinct Starter questions so even 20 consecutive misses have fresh starter material) ---
  addQ(
    'L1-1',
    1,
    ui.topicTags.core,
    tpl.qMainSubject(title),
    truncateText(subtitle || abstract || `${title} — ${domainName}`, 145),
    falseClaims,
    truncateText(abstract || subtitle || domainName, 160)
  );
  addQ(
    'L1-2',
    1,
    ui.topicTags.core,
    tpl.qDomain(title),
    domainName,
    otherDomains,
    tpl.isTr
      ? `Bu makale doğrudan ${domainName} ekseninde yapılandırılmıştır.`
      : `This article is directly situated within ${domainName}.`
  );
  addQ(
    'L1-3',
    1,
    ui.topicTags.core,
    tpl.qAuthorScope(title),
    tpl.isTr
      ? `“${truncateText(title, 65)}” ekseninde kuramsal analiz, görsel model (${truncateText(simTitle, 45)}) ve kavramsal sorgulamayı birleştiren bütüncül bir çerçeve`
      : `An integrated framework uniting theoretical analysis, interactive modeling (${truncateText(simTitle, 45)}), and conceptual inquiry around "${truncateText(title, 65)}"`,
    tpl.isTr
      ? [
          'Yalnızca kanıtsız kişisel tahminlerden oluşan rastgele bir günlük notu',
          'Matematiksel ve bilimsel kavramlardan tamamen arındırılmış ticari bir broşür',
          'Yalnızca tek bir tarihsel anekdotu tekrar eden kuramsız bir özet',
        ]
      : [
          'A casual diary entry lacking conceptual structure or scientific grounding',
          'A purely commercial brochure unrelated to scientific inquiry',
          'A single historical anecdote with no theoretical model or findings',
        ],
    tpl.isTr
      ? `Makale hem kavramsal argümanı hem de ${simTitle} modelini birlikte sunar.`
      : `The paper integrates both conceptual argumentation and the ${simTitle} model.`
  );

  for (let i = 0; i < 7; i++) {
    const term = keyTerms[i] || title.split(' ')[i % Math.max(1, title.split(' ').length)] || domainName;
    const findingSnippet = truncateText(
      findings[i % Math.max(1, findings.length)] || sentences[i % Math.max(1, sentences.length)] || abstract || domainName,
      135
    );
    addQ(
      `L1-${i + 4}`,
      1,
      ui.topicTags.core,
      tpl.qTermMatch(term, title),
      tpl.isTr
        ? `Makalenin ${domainName} çerçevesindeki temel kavramlarından biri olarak şu bulguyu destekler: ${findingSnippet}`
        : `Serves as a foundational concept in ${domainName}, supporting: ${findingSnippet}`,
      falseClaims,
      findingSnippet
    );
  }

  // --- LEVEL 2 (5 Basic questions: Direct Findings & Core Statements) ---
  for (let i = 0; i < 5; i++) {
    const fText = truncateText(
      findings[i % Math.max(1, findings.length)] || sentences[(i + 1) % Math.max(1, sentences.length)] || abstract,
      145
    );
    addQ(
      `L2-${i + 1}`,
      2,
      ui.topicTags.finding,
      tpl.qFindingDirect(i + 1, title),
      fText,
      falseClaims,
      fText
    );
  }

  // --- LEVEL 3 (5 Elementary questions: Parameters & Simulation Model) ---
  for (let i = 0; i < 5; i++) {
    const p = params[i % Math.max(1, params.length)];
    const pLabel = p ? getLocalizedText(p.label, lang) || p.key : simTitle;
    const pUnit = p?.unit || '';
    addQ(
      `L3-${i + 1}`,
      3,
      ui.topicTags.parameter,
      tpl.qParamRole(pLabel, pUnit, title),
      tpl.isTr
        ? `“${simTitle}” modelinde [${p ? `${p.min} – ${p.max}` : 'kontrollü aralık'}] ölçeğinde sistem davranışını ve denge çıktısını ayarlayan temel değişkeni`
        : `The core control variable adjusting system dynamics and equilibrium output across [${p ? `${p.min} – ${p.max}` : 'calibrated bounds'}] in "${simTitle}"`,
      tpl.isTr
        ? [
            'Yalnızca sayfa arka plan rengini değiştiren görsel bir süs değerini',
            'Makalenin konusuyla ilgisiz sabit bir takvim yılını',
            'Hiçbir fiziksel veya kavramsal karşılığı olmayan rastgele bir etiketi',
          ]
        : [
            'A purely cosmetic value that only alters page background colors',
            'An unrelated calendar date with no impact on the model',
            'A random label with no physical or conceptual meaning',
          ],
      tpl.isTr
        ? `${pLabel} parametresi, ${simTitle} kuramsal simülasyonunun temel girdilerindendir.`
        : `${pLabel} is a core parameter driving the ${simTitle} conceptual simulation.`
    );
  }

  // --- LEVEL 4 (5 Lower-Intermediate questions: Core Premises & False-Claim Filtering) ---
  for (let i = 0; i < 5; i++) {
    const sent = truncateText(
      sentences[(i + 2) % Math.max(1, sentences.length)] || findings[i % Math.max(1, findings.length)] || abstract,
      145
    );
    addQ(
      `L4-${i + 1}`,
      4,
      ui.topicTags.finding,
      tpl.qFalseClaimElim(title),
      sent,
      falseClaims,
      sent
    );
  }

  // --- LEVEL 5 (5 Intermediate questions: Historical Scientists & Scientific Lineage) ---
  for (let i = 0; i < 5; i++) {
    const sc = scientists[i % Math.max(1, scientists.length)];
    if (sc) {
      addQ(
        `L5-${i + 1}`,
        5,
        ui.topicTags.history,
        tpl.qScientistLink(sc.name, sc.era, title),
        truncateText(`${sc.coreThought} — ${sc.bridgeToArticle}`, 155),
        falseClaims,
        `${sc.name} (${sc.era}): ${sc.coreThought}`
      );
    } else {
      addQ(
        `L5-${i + 1}`,
        5,
        ui.topicTags.history,
        tpl.qModelFormula(title, equation),
        deepPrinciple,
        falseClaims,
        deepPrinciple
      );
    }
  }

  // --- LEVEL 6 (5 Analytical questions: Equation Formalism & Parameter Sensitivity) ---
  for (let i = 0; i < 5; i++) {
    const p = params[i % Math.max(1, params.length)];
    const pLabel = p ? getLocalizedText(p.label, lang) || p.key : domainName;
    const pMin = p?.min ?? 0;
    const pMax = p?.max ?? 100;
    const pUnit = p?.unit || '';
    addQ(
      `L6-${i + 1}`,
      6,
      ui.topicTags.model,
      i % 2 === 0 ? tpl.qModelFormula(title, equation) : tpl.qBoundaryCondition(pLabel, pMin, pMax, pUnit, title),
      i % 2 === 0
        ? truncateText(methodNote || deepPrinciple, 150)
        : tpl.isTr
          ? `Uç değerlerde modelin geçerlilik sınırları, ölçek etkileri ve ${domainName} ilkeleriyle uyumu yeniden sınanmalıdır.`
          : `At boundary extremes, model validity limits, scaling regimes, and consistency with ${domainName} principles must be re-verified.`,
      methodFlaws,
      truncateText(methodNote || deepPrinciple, 160)
    );
  }

  // --- LEVEL 7 (5 Challenging questions: Methodological Flaw Identification) ---
  for (let i = 0; i < 5; i++) {
    const targetFlaw = methodFlaws[i % methodFlaws.length];
    const validPractices = [
      deepPrinciple,
      truncateText(findings[0] || abstract, 120),
      truncateText(methodNote || (tpl.isTr ? 'Ölçüm sınırlarını ve kavramsal tanımları açıkça belirtmek' : 'Explicitly stating observational bounds and conceptual definitions'), 120),
      tpl.isTr
        ? 'Önceki bilim insanlarının kanıtlarını yeni kuramsal çerçeveyle karşılaştırmalı biçimde sınamak'
        : 'Testing prior scientific evidence comparatively against the new conceptual framework',
    ];
    addQ(
      `L7-${i + 1}`,
      7,
      ui.topicTags.method,
      tpl.qMethodFlaw(title),
      targetFlaw,
      validPractices.slice(0, 3),
      tpl.isTr
        ? `Bu yaklaşım bilimsel geçerlilik sınırlarını ihlal eder; doğru yöntem: ${deepPrinciple}.`
        : `This approach violates methodological rigor; sound practice requires: ${deepPrinciple}.`
    );
  }

  // --- LEVEL 8 (5 Advanced questions: Comparative Historical Synthesis) ---
  for (let i = 0; i < 5; i++) {
    const s1 = scientists[i % Math.max(1, scientists.length)];
    const s2 = scientists[(i + 1) % Math.max(1, scientists.length)];
    if (s1 && s2 && s1.name !== s2.name) {
      addQ(
        `L8-${i + 1}`,
        8,
        ui.topicTags.critique,
        tpl.qCompareThinkers(s1.name, s2.name, title),
        tpl.isTr
          ? `${s1.name} ile ${s2.name} mirasını birbirini dışlayan dogmalar olarak değil, “${truncateText(title, 55)}” bağlamında tamamlayıcı kavramsal katmanlar olarak sentezlemek`
          : `Synthesizing ${s1.name} and ${s2.name} not as mutually exclusive dogmas, but as complementary analytical layers informing "${truncateText(title, 55)}"`,
        methodFlaws,
        `${s1.name}: ${truncateText(s1.coreThought, 75)} | ${s2.name}: ${truncateText(s2.coreThought, 75)}`
      );
    } else {
      addQ(
        `L8-${i + 1}`,
        8,
        ui.topicTags.critique,
        tpl.qDeepSynthesis(title, i + 1),
        deepPrinciple,
        methodFlaws,
        deepPrinciple
      );
    }
  }

  // --- LEVEL 9 (5 Expert questions: Epistemological & Critical Evaluation of Key Findings) ---
  for (let i = 0; i < 5; i++) {
    const finding = findings[i % Math.max(1, findings.length)] || sentences[i % Math.max(1, sentences.length)] || abstract;
    addQ(
      `L9-${i + 1}`,
      9,
      ui.topicTags.critique,
      tpl.qCriticalEval(finding, title),
      tpl.isTr
        ? `Yanlışlanabilir sınır koşulları, kavramsal tutarlılık ve ${domainName} verileri ışığında test edilebilir bir bilimsel-felsefi çıkarım olarak`
        : `As a testable scientific-philosophical inference evaluated through falsifiable boundary conditions, conceptual coherence, and ${domainName} evidence`,
      methodFlaws,
      deepPrinciple
    );
  }

  // --- LEVEL 10 (10 Master questions so even a 20/20 perfect run never runs out of L10 challenges) ---
  for (let i = 0; i < 10; i++) {
    const sent = truncateText(
      sentences[(i + 3) % Math.max(1, sentences.length)] || findings[i % Math.max(1, findings.length)] || deepPrinciple,
      120
    );
    addQ(
      `L10-${i + 1}`,
      10,
      ui.topicTags.synthesis,
      tpl.qDeepSynthesis(title, i + 1),
      tpl.isTr
        ? `${deepPrinciple} — özellikle şu çıkarımla bütünleştirerek: ${sent}`
        : `${deepPrinciple} — integrated specifically with: ${sent}`,
      [
        methodFlaws[i % methodFlaws.length],
        falseClaims[i % falseClaims.length],
        tpl.isTr
          ? `“${truncateText(title, 45)}” konusundaki tüm deneysel ve felsefi tartışmaları tek bir yüzeysel sloganla kapatmak`
          : `Collapsing all empirical and philosophical nuances of "${truncateText(title, 45)}" into a single untested slogan`,
      ],
      `${deepPrinciple}.`
    );
  }

  return pool;
}

/**
 * Selects the next unasked question closest to targetDifficulty (preferring exact match).
 */
export function selectNextAdaptiveQuestion(
  pool: AdaptiveExamQuestion[],
  targetDifficulty: number,
  askedIds: Set<string>
): AdaptiveExamQuestion | null {
  const clamped = Math.max(EXAM_MIN_DIFFICULTY, Math.min(EXAM_MAX_DIFFICULTY, Math.round(targetDifficulty)));
  const available = pool.filter((q) => !askedIds.has(q.id));
  if (available.length === 0) return null;

  // Prefer exact difficulty first, then nearest difficulty distance
  const exact = available.find((q) => q.difficulty === clamped);
  if (exact) return exact;

  available.sort((a, b) => Math.abs(a.difficulty - clamped) - Math.abs(b.difficulty - clamped));
  return available[0];
}

/**
 * Computes exact exam score breakdown (+50 correct, +10 blank/remaining, -10 wrong).
 * When exiting early, all remaining questions up to EXAM_TOTAL_QUESTIONS are scored as blank (+10 each).
 */
export function computeExamScoreBreakdown(
  records: AdaptiveExamAnswerRecord[],
  totalQuestions = EXAM_TOTAL_QUESTIONS
): ExamScoreBreakdown {
  let correctCount = 0;
  let skippedBlankCount = 0;
  let exitBlankCount = 0;
  let wrongCount = 0;
  let peakDifficulty = EXAM_MIN_DIFFICULTY;
  let diffSum = 0;

  for (const r of records) {
    if (r.difficulty > peakDifficulty) peakDifficulty = r.difficulty;
    diffSum += r.difficulty;
    if (r.outcome === 'correct') correctCount += 1;
    else if (r.outcome === 'wrong') wrongCount += 1;
    else if (r.outcome === 'unanswered_exit') exitBlankCount += 1;
    else skippedBlankCount += 1;
  }

  // Ensure any remaining unrecorded questions up to totalQuestions count as exit blanks (+10 each)
  const recordedTotal = correctCount + skippedBlankCount + exitBlankCount + wrongCount;
  if (recordedTotal < totalQuestions) {
    exitBlankCount += totalQuestions - recordedTotal;
  }

  const totalBlankCount = skippedBlankCount + exitBlankCount;
  const totalScore =
    correctCount * EXAM_POINTS_CORRECT +
    totalBlankCount * EXAM_POINTS_BLANK +
    wrongCount * EXAM_POINTS_WRONG;

  return {
    correctCount,
    skippedBlankCount,
    exitBlankCount,
    totalBlankCount,
    wrongCount,
    totalQuestions,
    totalScore,
    peakDifficulty,
    averageDifficulty: records.length > 0 ? Number((diffSum / records.length).toFixed(1)) : 1,
  };
}
