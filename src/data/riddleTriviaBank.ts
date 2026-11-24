import type { LanguageCode } from '../types';

export type ArenaItemType = 'riddle' | 'qa';

export interface ArenaItemLocalizedContent {
  category: string;
  prompt: string;
  clue: string;
  options: [string, string, string, string];
  explanation: string;
}

export interface ArenaQuestionItem {
  id: string;
  type: ArenaItemType;
  difficulty: 'medium';
  correctIndex: 0 | 1 | 2 | 3;
  relatedKeyword: string;
  content: Partial<Record<LanguageCode, ArenaItemLocalizedContent>>;
}

export const ARENA_SCORING = {
  CORRECT: 50,
  BLANK: 20,
  WRONG: -20,
} as const;

export const ARENA_QUESTION_BANK: ArenaQuestionItem[] = [
  {
    id: 'rid-01-entropy-cost',
    type: 'riddle',
    difficulty: 'medium',
    correctIndex: 1,
    relatedKeyword: 'entropi',
    content: {
      tr: {
        category: 'Bilmece · Termodinamik & Bilgi',
        prompt:
          'İki kapalı odada düzensizlik durmadan büyür; bir cin kapıyı açıp yalnızca hızlı parçacıkları ayırır, ancak hafızasını silmek istediğinde evrene ısı borcunu öder. Ben hangi fiziksel ilkeyim?',
        clue: '1961 yılında bilginin silinmesiyle minimum ısı yayılımını (kT ln 2) ilişkilendiren ilke.',
        options: [
          'Heisenberg Belirsizlik İlkesi',
          'Landauer Bilgi Silme İlkesi',
          'Pauli Dışlama İlkesi',
          'Mach Eylemsizlik İlkesi',
        ],
        explanation:
          'Landauer İlkesi, 1 bitlik bilgiyi silmenin en az kT ln(2) kadar enerjiyi ısıya dönüştürdüğünü gösterir; entropik akıştan bilgi çıkarmanın daima termodinamik bir bedeli vardır.',
      },
      en: {
        category: 'Riddle · Thermodynamics & Information',
        prompt:
          'Disorder keeps growing across two sealed chambers; a demon sorts only the fast particles, yet the moment it erases its memory it must pay a heat debt to the universe. Which physical principle am I?',
        clue: 'Formulated in 1961, linking bit erasure to a minimum heat dissipation of kT ln 2.',
        options: [
          'Heisenberg Uncertainty Principle',
          "Landauer's Principle of Information Erasure",
          'Pauli Exclusion Principle',
          "Mach's Principle of Inertia",
        ],
        explanation:
          "Landauer's Principle shows that erasing a single bit of information dissipates at least kT ln(2) of heat, proving that extracting and resetting information in an entropic world carries an unavoidable physical cost.",
      },
      es: {
        category: 'Acertijo · Termodinámica e Información',
        prompt:
          'El desorden crece sin pausa en dos cámaras cerradas; un demonio separa solo las partículas rápidas, pero al borrar su memoria debe pagar una deuda de calor al universo. ¿Qué principio físico soy?',
        clue: 'Formulado en 1961, relaciona borrar un bit con un mínimo de calor kT ln 2.',
        options: [
          'Principio de incertidumbre de Heisenberg',
          'Principio de Landauer sobre el borrado de información',
          'Principio de exclusión de Pauli',
          'Principio de inercia de Mach',
        ],
        explanation:
          'El principio de Landauer demuestra que borrar un bit libera al menos kT ln(2) en calor, confirmando el coste termodinámico de manejar información.',
      },
      de: {
        category: 'Rätsel · Thermodynamik & Information',
        prompt:
          'In zwei geschlossenen Kammern wächst die Unordnung stetig; ein Dämon sortiert schnelle Teilchen, doch beim Löschen seines Gedächtnisses zahlt er dem Universum eine Wärmeschuld. Welches physikalische Prinzip bin ich?',
        clue: '1961 formuliert: Das Löschen eines Bits erzeugt mindestens kT ln 2 Wärme.',
        options: [
          'Heisenbergsche Unschärferelation',
          'Landauer-Prinzip der Informationslöschung',
          'Pauli-Ausschlussprinzip',
          'Machsches Prinzip',
        ],
        explanation:
          'Das Landauer-Prinzip zeigt, dass das Löschen eines Bits mindestens kT ln(2) an Wärme freisetzt – Information hat einen realen energetischen Preis.',
      },
      fr: {
        category: 'Énigme · Thermodynamique & Information',
        prompt:
          'Le désordre grandit dans deux chambres closes ; un démon trie les particules rapides, mais dès qu’il efface sa mémoire il paie une dette thermique à l’univers. Quel principe physique suis-je ?',
        clue: 'Énoncé en 1961, il relie l’effacement d’un bit à une dissipation minimale kT ln 2.',
        options: [
          "Principe d'incertitude de Heisenberg",
          "Principe de Landauer sur l'effacement d'information",
          "Principe d'exclusion de Pauli",
          'Principe de Mach',
        ],
        explanation:
          "Le principe de Landauer établit qu'effacer un bit dissipe au moins kT ln(2) de chaleur : extraire et gérer l'information a toujours un coût entropique.",
      },
      ru: {
        category: 'Загадка · Термодинамика и Информация',
        prompt:
          'В двух закрытых камерах растёт беспорядок; демон пропускает лишь быстрые частицы, но, стирая свою память, вынужден отдать Вселенной тепловой долг. Какой я физический принцип?',
        clue: 'Сформулирован в 1961 году и связывает стирание 1 бита с выделением тепла kT ln 2.',
        options: [
          'Принцип неопределённости Гейзенберга',
          'Принцип Ландауэра о стирании информации',
          'Принцип запрета Паули',
          'Принцип Маха',
        ],
        explanation:
          'Принцип Ландауэра показывает, что стирание одного бита информации выделяет не менее kT ln(2) тепла, связывая энтропию и информацию.',
      },
      ar: {
        category: 'لغز · الديناميكا الحرارية والمعلومات',
        prompt:
          'في حجرتين مغلقتين يزداد الاضطراب باستمرار؛ يفصل كائن افتراضي الجسيمات السريعة فقط، لكنه حين يمسح ذاكرته يدفع ضريبة حرارية للكون. ما هو هذا المبدأ الفيزيائي؟',
        clue: 'صيغ عام 1961 ويربط محو بت واحد بانبعاث حرارة لا تقل عن kT ln 2.',
        options: [
          'مبدأ عدم اليقين لهايزنبرغ',
          'مبدأ لانداور لمحو المعلومات',
          'مبدأ الاستبعاد لباولي',
          'مبدأ ماخ للقصور الذاتي',
        ],
        explanation:
          'يثبت مبدأ لانداور أن محو بت واحد من المعلومات يبدد طاقة حرارية لا تقل عن kT ln(2)، مما يؤكد التكلفة الفيزيائية الحتمية للمعلومات.',
      },
      zh: {
        category: '谜题 · 热力学与信息',
        prompt:
          '在两个密闭容器中混乱不断增加；一位小妖只放行高速粒子，但当它清除记忆时必须向宇宙支付热量代价。我是哪一条物理原理？',
        clue: '1961年提出，将擦除1比特信息与至少 kT ln 2 的热耗散联系起来。',
        options: [
          '海森堡不确定性原理',
          '兰道尔信息擦除原理',
          '泡利不相容原理',
          '马赫惯性原理',
        ],
        explanation:
          '兰道尔原理表明擦除1比特信息至少会释放 kT ln(2) 的热量，说明在熵增宇宙中获取和处理信息必然付出热力学代价。',
      },
      ja: {
        category: '謎解き · 熱力学と情報',
        prompt:
          '二つの密閉された部屋で無秩序が増え続け、悪魔が速い粒子だけを選別しても、記憶を消去する瞬間に宇宙へ熱の代償を払わねばならない。私はどの物理原理でしょう？',
        clue: '1961年に提唱され、1ビット消去と最小発熱量 kT ln 2 を結びつけます。',
        options: [
          'ハイゼンベルクの不確定性原理',
          'ランダウアーの情報消去の原理',
          'パウリの排他原理',
          'マッハの原理',
        ],
        explanation:
          'ランダウアーの原理は1ビットの情報消去に最低 kT ln(2) の熱発生が伴うことを示し、情報の取得と消去に不可避な物理コストがあることを証明します。',
      },
      pt: {
        category: 'Enigma · Termodinâmica e Informação',
        prompt:
          'A desordem cresce sem cessar em duas câmaras fechadas; um demônio separa apenas partículas rápidas, mas ao apagar sua memória precisa pagar uma dívida de calor ao universo. Que princípio físico sou eu?',
        clue: 'Formulado em 1961, associa o apagamento de 1 bit a pelo menos kT ln 2 de calor.',
        options: [
          'Princípio da Incerteza de Heisenberg',
          'Princípio de Landauer do Apagamento de Informação',
          'Princípio da Exclusão de Pauli',
          'Princípio de Mach',
        ],
        explanation:
          'O Princípio de Landauer mostra que apagar um bit dissipa pelo menos kT ln(2) em calor, ligando informação e entropia.',
      },
      it: {
        category: 'Indovinello · Termodinamica e Informazione',
        prompt:
          'In due camere chiuse il disordine cresce sempre; un demone separa solo le particelle veloci, ma quando cancella la memoria deve pagare un debito termico all’universo. Quale principio fisico sono?',
        clue: 'Formulato nel 1961, lega la cancellazione di 1 bit a un calore minimo kT ln 2.',
        options: [
          'Principio di indeterminazione di Heisenberg',
          'Principio di Landauer sulla cancellazione dell’informazione',
          'Principio di esclusione di Pauli',
          'Principio di Mach',
        ],
        explanation:
          'Il principio di Landauer dimostra che cancellare un bit dissipa almeno kT ln(2) di calore, confermando il costo termodinamico dell’informazione.',
      },
      ko: {
        category: '수수께끼 · 열역학과 정보',
        prompt:
          '닫힌 두 방에서 무질서가 계속 커지는데, 한 악마가 빠른 입자만 골라내더라도 기억을 지우는 순간 우주에 열 대가를 치러야 합니다. 나는 어떤 물리 원리일까요?',
        clue: '1961년 제시되었으며 1비트 정보 삭제와 최소 열 방출량 kT ln 2를 연결합니다.',
        options: [
          '하이젠베르크 불확정성 원리',
          '란다우어 정보 삭제 원리',
          '파울리 배타 원리',
          '마흐의 원리',
        ],
        explanation:
          '란다우어 원리는 1비트의 정보를 지울 때 최소 kT ln(2)의 열이 발생함을 보여 주며, 정보 처리에 필연적 열역학 비용이 따름을 증명합니다.',
      },
    },
  },
  {
    id: 'rid-02-quantum-superposition',
    type: 'riddle',
    difficulty: 'medium',
    correctIndex: 2,
    relatedKeyword: 'kuantum',
    content: {
      tr: {
        category: 'Bilmece · Kuantum Mekaniği',
        prompt:
          'Bana bakmadığın sürece iki kapıdan aynı anda geçer, kendi kendimle girişim deseni çizerim; ama hangi kapıdan geçtiğimi kaydettiğin an dalga dansım tek bir noktaya çöker. Ben neyim?',
        clue: 'Çift yarık deneyinde gözlemle ortadan kalkan kuantum durumu.',
        options: [
          'Klasik Kinetik Momentum',
          'Termodinamik Isıl Denge',
          'Kuantum Süperpozisyon ve Eşevrelilik',
          'Kütleçekimsel Merceklenme',
        ],
        explanation:
          'Çift yarık deneyinde parçacık ölçülmeden önce yol süperpozisyonu ve faz eşevreliliği sergiler; yol bilgisi kaydedildiğinde eşevrelilik bozulur (dekoherens) ve girişim deseni kaybolur.',
      },
      en: {
        category: 'Riddle · Quantum Mechanics',
        prompt:
          'As long as you do not watch me, I pass through two doors at once and paint an interference pattern with myself; the moment you record which door I took, my wave dance collapses to a single spot. What am I?',
        clue: 'The quantum property destroyed by which-path measurement in the double-slit experiment.',
        options: [
          'Classical Kinetic Momentum',
          'Thermodynamic Equilibrium',
          'Quantum Superposition and Coherence',
          'Gravitational Lensing',
        ],
        explanation:
          'Before measurement, a quantum system maintains phase coherence across superposed paths; acquiring which-path information induces decoherence and erases the interference fringes.',
      },
      es: {
        category: 'Acertijo · Mecánica Cuántica',
        prompt:
          'Mientras no me observes paso por dos puertas a la vez y dibujo franjas de interferencia conmigo mismo; en cuanto registras mi camino, mi danza ondulatoria colapsa en un solo punto. ¿Qué soy?',
        clue: 'Propiedad cuántica que desaparece al medir la trayectoria en la doble rendija.',
        options: [
          'Momento cinético clásico',
          'Equilibrio termodinámico',
          'Superposición y coherencia cuántica',
          'Lente gravitacional',
        ],
        explanation:
          'En el experimento de la doble rendija, la superposición coherente produce interferencia; medir el camino rompe la coherencia (decoherencia).',
      },
      de: {
        category: 'Rätsel · Quantenmechanik',
        prompt:
          'Solange du nicht hinsiehst, gehe ich durch zwei Türen zugleich und zeichne ein Interferenzmuster; sobald du meinen Weg misst, fällt mein Wellentanz auf einen einzigen Punkt zusammen. Was bin ich?',
        clue: 'Die Quanteneigenschaft im Doppelspaltexperiment, die durch Wegmessung verschwindet.',
        options: [
          'Klassischer kinetischer Impuls',
          'Thermodynamisches Gleichgewicht',
          'Quantensuperposition und Kohärenz',
          'Gravitationslinseneffekt',
        ],
        explanation:
          'Vor der Messung überlagern sich die Pfade kohärent; eine Weginformation verursacht Dekohärenz und löscht das Interferenzmuster aus.',
      },
      fr: {
        category: 'Énigme · Mécanique Quantique',
        prompt:
          'Tant que tu ne me regardes pas, je franchis deux portes à la fois et trace des franges d’interférence ; dès que tu enregistres mon passage, ma danse ondulatoire se réduit à un point unique. Que suis-je ?',
        clue: 'Propriété quantique détruite par la mesure du chemin dans l’expérience des fentes d’Young.',
        options: [
          'Quantité de mouvement classique',
          'Équilibre thermodynamique',
          'Superposition et cohérence quantiques',
          'Lentille gravitationnelle',
        ],
        explanation:
          'La superposition cohérente crée les franges d’interférence ; l’obtention de l’information de chemin provoque la décohérence.',
      },
      ru: {
        category: 'Загадка · Квантовая Механика',
        prompt:
          'Пока ты не смотришь, я прохожу сразу через две двери и рисую интерференционную картину; но стоит записать мой путь, как волновой танец схлопывается в одну точку. Что я?',
        clue: 'Квантовое свойство, исчезающее при измерении траектории в опыте с двумя щелями.',
        options: [
          'Классический импульс',
          'Термодинамическое равновесие',
          'Квантовая суперпозиция и когерентность',
          'Гравитационное линзирование',
        ],
        explanation:
          'Когерентная суперпозиция создаёт интерференцию, а получение информации о пути разрушает когерентность (декогеренция).',
      },
      ar: {
        category: 'لغز · ميكانيكا الكم',
        prompt:
          'ما دمت لا تراقبني أعبر بابين في آنٍ واحد وأرسم نمط تداخل مع نفسي؛ وحالما تسجّل أي باب عبرتُ، تنهار رقصتي الموجية إلى نقطة واحدة. من أنا؟',
        clue: 'الخاصية الكمومية التي تختفي عند قياس المسار في تجربة الشق المزدوج.',
        options: [
          'الزخم الحركي الكلاسيكي',
          'الاتزان الحراري',
          'التراكب والتماسك الكمومي',
          'التعدس الثقالي',
        ],
        explanation:
          'يولّد التراكب المتماسك نمط التداخل، وعند تسجيل معلومة المسار يحدث فك التماسك وتختفي أهداب التداخل.',
      },
      zh: {
        category: '谜题 · 量子力学',
        prompt:
          '只要你不观测我，我便同时穿过两扇门并与自己绘出干涉条纹；一旦你记录下我走过的路径，我的波动之舞便坍缩为一个点。我是什么？',
        clue: '双缝实验中因路径测量而被破坏的量子特性。',
        options: [
          '经典动能动量',
          '热力学平衡态',
          '量子叠加与相干性',
          '引力透镜效应',
        ],
        explanation:
          '双缝实验中相干叠加产生干涉条纹；获取路径信息会引发退相干，使干涉图案消失。',
      },
      ja: {
        category: '謎解き · 量子力学',
        prompt:
          '観測されない限り二つの扉を同時に通り抜けて干渉縞を描くが、どちらを通ったか記録した瞬間に波の舞は一点へ収束する。私は何でしょう？',
        clue: '二重スリット実験で経路観測により失われる量子的性質。',
        options: [
          '古典的運動量',
          '熱平衡状態',
          '量子重ね合わせとコヒーレンス',
          '重力レンズ効果',
        ],
        explanation:
          '経路の重ね合わせと位相コヒーレンスが干渉縞を生み、経路情報を得るとデコヒーレンスにより干渉が消えます。',
      },
      pt: {
        category: 'Enigma · Mecânica Quântica',
        prompt:
          'Enquanto você não me observa, passo por duas portas ao mesmo tempo e desenho um padrão de interferência; no instante em que registra meu caminho, minha dança ondulatória colapsa num único ponto. O que sou eu?',
        clue: 'Propriedade quântica destruída ao medir o caminho na fenda dupla.',
        options: [
          'Momento cinético clássico',
          'Equilíbrio termodinâmico',
          'Superposição e coerência quântica',
          'Lente gravitacional',
        ],
        explanation:
          'A superposição coerente gera interferência; medir o caminho causa decoerência e faz o padrão desaparecer.',
      },
      it: {
        category: 'Indovinello · Meccanica Quantistica',
        prompt:
          'Finché non mi osservi attraverso due porte insieme e disegno frange di interferenza; appena registri quale porta ho scelto, la mia danza ondulatoria collassa in un solo punto. Che cosa sono?',
        clue: 'Proprietà quantistica che svanisce misurando il percorso nella doppia fenditura.',
        options: [
          'Quantità di moto classica',
          'Equilibrio termodinamico',
          'Sovrapposizione e coerenza quantistica',
          'Lente gravitazionale',
        ],
        explanation:
          'La sovrapposizione coerente produce interferenza; rilevare il percorso induce decoerenza e cancella le frange.',
      },
      ko: {
        category: '수수께끼 · 양자역학',
        prompt:
          '나를 관찰하지 않는 동안은 두 문을 동시에 통과해 간섭무늬를 그리지만, 어느 문을 지났는지 기록하는 순간 파동의 춤은 한 점으로 붕괴합니다. 나는 무엇일까요?',
        clue: '이중 슬릿 실험에서 경로 측정 시 사라지는 양자 특성.',
        options: [
          '고전적 운동량',
          '열역학적 평형',
          '양자 중첩과 결맞음',
          '중력 렌즈 효과',
        ],
        explanation:
          '결맞은 중첩이 간섭무늬를 만들며, 경로 정보를 기록하면 결어긋남(데코히어런스)이 일어나 간섭이 사라집니다.',
      },
    },
  },
  {
    id: 'rid-03-qualia-consciousness',
    type: 'riddle',
    difficulty: 'medium',
    correctIndex: 0,
    relatedKeyword: 'bilinç',
    content: {
      tr: {
        category: 'Bilmece · Zihin Felsefesi',
        prompt:
          'Renklerin tüm dalga boylarını, foton enerjilerini ve beyindeki sinirsel ateşlemeleri ezbere bilen bir bilim insanı, siyah-beyaz odadan ilk kez çıktığında hâlâ yeni bir şey öğrenir. O eksik deneyim parçası nedir?',
        clue: 'Frank Jackson’ın "Mary’nin Odası" düşünce deneyinde vurgulanan öznel deneyim niteliği.',
        options: [
          'Qualia (Öznel Deneyim Nitelikleri)',
          'Klasik Koşullanma Refleksi',
          'Oksipital Kırılma İndisi',
          'Sembolik Sözdizimi Kuralları',
        ],
        explanation:
          'Qualia, kırmızıyı "kırmızı gibi" hissetmek gibi birinci şahıs öznel deneyim niteliklerini ifade eder; zihin felsefesinde bilincin zor probleminin merkezindedir.',
      },
      en: {
        category: 'Riddle · Philosophy of Mind',
        prompt:
          'A scientist who knows every wavelength, photon energy, and neural firing behind color still learns something genuinely new the first time she leaves her black-and-white room. What is that missing experiential element?',
        clue: "The subjective quality of experience highlighted in Frank Jackson's 'Mary's Room' thought experiment.",
        options: [
          'Qualia (Subjective Experiential Qualities)',
          'Classical Conditioning Reflex',
          'Optical Refractive Index',
          'Symbolic Syntax Rules',
        ],
        explanation:
          'Qualia are the first-person "what-it-is-like" qualities of conscious experience, standing at the heart of the hard problem of consciousness.',
      },
      es: {
        category: 'Acertijo · Filosofía de la Mente',
        prompt:
          'Una científica que conoce todas las longitudes de onda y señales neuronales del color aprende aún algo nuevo al salir por primera vez de su cuarto en blanco y negro. ¿Qué elemento experiencial faltaba?',
        clue: 'Cualidad subjetiva destacada en el experimento mental de "La habitación de Mary".',
        options: [
          'Qualia (cualidades subjetivas de la experiencia)',
          'Reflejo de condicionamiento clásico',
          'Índice de refracción óptico',
          'Reglas de sintaxis simbólica',
        ],
        explanation:
          'Los qualia designan el carácter subjetivo de cómo se siente experimentar algo en primera persona.',
      },
      de: {
        category: 'Rätsel · Philosophie des Geistes',
        prompt:
          'Eine Forscherin kennt jede Wellenlänge und jedes neuronale Signal der Farbe, doch wenn sie erstmals ihr Schwarz-Weiß-Zimmer verlässt, erfährt sie etwas Neues. Was ist dieses fehlende Erlebnismerkmal?',
        clue: 'Die subjektive Erlebnisqualität aus Frank Jacksons Gedankenexperiment „Marys Zimmer“.',
        options: [
          'Qualia (subjektive Erlebnisqualitäten)',
          'Klassischer Konditionierungsreflex',
          'Optischer Brechungsindex',
          'Symbolische Syntaxregeln',
        ],
        explanation:
          'Qualia bezeichnen das subjektive „Wie-es-sich-anfühlt“ bewusster Erfahrung im Zentrum des Bewusstseinsproblems.',
      },
      fr: {
        category: 'Énigme · Philosophie de l’Esprit',
        prompt:
          'Une chercheuse qui connaît chaque longueur d’onde et chaque décharge neuronale de la couleur apprend encore quelque chose en sortant de sa chambre noir et blanc. Quel est cet élément manquant ?',
        clue: 'Qualité subjective mise en avant par l’expérience de pensée « La chambre de Mary ».',
        options: [
          'Les qualia (qualités subjectives vécues)',
          'Le réflexe conditionné classique',
          "L'indice de réfraction optique",
          'Les règles de syntaxe symbolique',
        ],
        explanation:
          'Les qualia désignent l’effet ressenti en première personne d’une expérience consciente, au cœur du problème difficile de la conscience.',
      },
      ru: {
        category: 'Загадка · Философия Сознания',
        prompt:
          'Учёная знает все длины волн и нейронные сигналы цвета, но, впервые выйдя из чёрно-белой комнаты, всё равно узнаёт нечто новое. Что это за субъективный элемент опыта?',
        clue: 'Субъективное качество переживания из мысленного эксперимента «Комната Мэри».',
        options: [
          'Квалиа (субъективные качества опыта)',
          'Классический условный рефлекс',
          'Показатель преломления света',
          'Правила символьного синтаксиса',
        ],
        explanation:
          'Квалиа — это субъективное переживание от первого лица («каково это — видеть красный»), ключевое понятие трудной проблемы сознания.',
      },
      ar: {
        category: 'لغز · فلسفة العقل',
        prompt:
          'عالمة تعرف كل الأطوال الموجية والإشارات العصبية للألوان، لكنها حين تخرج لأول مرة من غرفتها بالأبيض والأسود تتعلم شيئاً جديداً بالفعل. ما هو هذا العنصر التجريبي المفقود؟',
        clue: 'الصفة الذاتية للخبرة الواعية في تجربة «غرفة ماري» الفكرية.',
        options: [
          'الكواليا (الكيفيات الذاتية للخبرة)',
          'المنعكس الشرطي الكلاسيكي',
          'معامل الانكسار البصري',
          'قواعد النحو الرمزي',
        ],
        explanation:
          'تشير الكواليا إلى الطابع الذاتي المباشر للتجربة الواعية، وهي في صميم المسألة الصعبة للوعي.',
      },
      zh: {
        category: '谜题 · 心灵哲学',
        prompt:
          '一位熟知颜色全部波长与神经脉冲的科学家，第一次走出黑白房间时仍然学到了全新的东西。这个缺失的主观体验要素是什么？',
        clue: '弗兰克·杰克逊“玛丽的房间”思想实验所强调的主观体验质感。',
        options: [
          '感质（Qualia，主观体验品质）',
          '经典条件反射',
          '光学折射率',
          '符号句法规则',
        ],
        explanation:
          '感质指第一人称主观体验的“感受起来是什么样”，是意识难题的核心概念。',
      },
      ja: {
        category: '謎解き · 心の哲学',
        prompt:
          '色の波長も神経発火もすべて知り尽くした科学者が、白黒の部屋を初めて出た瞬間にまだ新しい何かを学ぶ。その欠けていた主観的要素は何でしょう？',
        clue: '「メアリーの部屋」の思考実験で示される主観的な体験の質。',
        options: [
          'クオリア（主観的体験の質）',
          '古典的条件反射',
          '光学屈折率',
          '記号統語規則',
        ],
        explanation:
          'クオリアとは「赤く感じられること」のような一人称の主観的質感であり、意識のハードプロブレムの中心です。',
      },
      pt: {
        category: 'Enigma · Filosofia da Mente',
        prompt:
          'Uma cientista que conhece todos os comprimentos de onda e disparos neurais das cores ainda aprende algo novo ao sair de sua sala em preto e branco. Qual é esse elemento experiencial?',
        clue: 'A qualidade subjetiva destacada no experimento mental "O Quarto de Mary".',
        options: [
          'Qualia (qualidades subjetivas da experiência)',
          'Reflexo de condicionamento clássico',
          'Índice de refração óptico',
          'Regras de sintaxe simbólica',
        ],
        explanation:
          'Qualia são as qualidades subjetivas sentidas em primeira pessoa, centrais ao problema difícil da consciência.',
      },
      it: {
        category: 'Indovinello · Filosofia della Mente',
        prompt:
          'Una scienziata che conosce tutte le lunghezze d’onda e i segnali neurali del colore impara comunque qualcosa di nuovo uscendo dalla sua stanza in bianco e nero. Qual è questo elemento?',
        clue: 'La qualità soggettiva dell’esperienza nell’esperimento mentale "La stanza di Mary".',
        options: [
          'Qualia (qualità soggettive dell’esperienza)',
          'Riflesso condizionato classico',
          'Indice di rifrazione ottico',
          'Regole di sintassi simbolica',
        ],
        explanation:
          'I qualia rappresentano il carattere soggettivo in prima persona dell’esperienza cosciente.',
      },
      ko: {
        category: '수수께끼 · 심리철학',
        prompt:
          '색의 모든 파장과 신경 신호를 완벽히 아는 과학자라도 흑백 방에서 처음 나오는 순간 새로운 무언가를 깨닫습니다. 빠졌던 그 주관적 경험 요소는 무엇일까요?',
        clue: '‘메리의 방’ 사고실험에서 강조되는 주관적 체험의 질.',
        options: [
          '감각질(Qualia, 주관적 경험의 질)',
          '고전적 조건 반사',
          '광학 굴절률',
          '기호 구문 규칙',
        ],
        explanation:
          '감각질(퀄리아)은 1인칭 시점에서 느껴지는 주관적 체험의 질을 뜻하며, 의식의 어려운 문제의 핵심입니다.',
      },
    },
  },
  {
    id: 'rid-04-event-horizon',
    type: 'riddle',
    difficulty: 'medium',
    correctIndex: 3,
    relatedKeyword: 'karadelik',
    content: {
      tr: {
        category: 'Bilmece · Kozmoloji & Görelilik',
        prompt:
          'İçime düşen astronot bana ulaştığında özel bir duvar görmez, ama uzaktaki gözlemciye göre zamanım donmuş gibi ağırlaşır ve benden dışarı tek bir ışık demeti bile kaçamaz. Ben neyim?',
        clue: 'Schwarzschild yarıçapıyla tanımlanan tek yönlü uzay-zaman sınırı.',
        options: [
          'Oort Bulutu Sınırı',
          'Kuiper Kuşağı Düzlemi',
          'Van Allen Radyasyon Kuşağı',
          'Olay Ufku (Event Horizon)',
        ],
        explanation:
          'Olay ufku, kaçış hızının ışık hızına ulaştığı uzay-zaman sınırıdır; kütleçekimsel zaman genişlemesi nedeniyle uzak gözlemci için düşen saat ufkun kıyısında durmuş gibi görünür.',
      },
      en: {
        category: 'Riddle · Cosmology & Relativity',
        prompt:
          'An infalling astronaut feels no solid wall upon crossing me, yet to a distant observer time appears to freeze at my edge and not even a single beam of light can escape back out. What am I?',
        clue: 'The one-way spacetime boundary defined by the Schwarzschild radius.',
        options: [
          'The Oort Cloud Boundary',
          'The Kuiper Belt Plane',
          'The Van Allen Radiation Belt',
          'The Event Horizon',
        ],
        explanation:
          'An event horizon is the spacetime threshold where escape velocity equals the speed of light; due to gravitational time dilation, distant observers see infalling clocks slow to a halt near it.',
      },
      es: {
        category: 'Acertijo · Cosmología y Relatividad',
        prompt:
          'Un astronauta que cae no siente ningún muro al cruzarme, pero para un observador lejano el tiempo parece congelarse en mi borde y ni un rayo de luz logra escapar. ¿Qué soy?',
        clue: 'Frontera unidireccional del espacio-tiempo definida por el radio de Schwarzschild.',
        options: [
          'Límite de la nube de Oort',
          'Plano del cinturón de Kuiper',
          'Cinturón de radiación de Van Allen',
          'Horizonte de sucesos',
        ],
        explanation:
          'El horizonte de sucesos es la frontera donde la velocidad de escape iguala la velocidad de la luz y la dilatación temporal gravitatoria se vuelve extrema.',
      },
      de: {
        category: 'Rätsel · Kosmologie & Relativität',
        prompt:
          'Ein hineinfallender Astronaut spürt beim Überqueren keine feste Wand, doch für entfernte Beobachter scheint die Zeit an meinem Rand einzufrieren und kein Lichtstrahl entkommt mir. Was bin ich?',
        clue: 'Die Einbahnstraßen-Grenze der Raumzeit beim Schwarzschild-Radius.',
        options: [
          'Grenze der Oortschen Wolke',
          'Ebene des Kuipergürtels',
          'Van-Allen-Strahlungsgürtel',
          'Ereignishorizont',
        ],
        explanation:
          'Der Ereignishorizont ist die Raumzeitgrenze eines Schwarzen Lochs, jenseits derer selbst Licht nicht mehr entkommen kann.',
      },
      fr: {
        category: 'Énigme · Cosmologie & Relativité',
        prompt:
          'Un astronaute en chute libre ne heurte aucun mur en me traversant, mais pour un observateur lointain le temps semble se figer à mon bord et nul rayon lumineux ne s’échappe. Que suis-je ?',
        clue: 'Frontière à sens unique définie par le rayon de Schwarzschild.',
        options: [
          'Frontière du nuage d’Oort',
          'Plan de la ceinture de Kuiper',
          'Ceinture de Van Allen',
          'Horizon des événements',
        ],
        explanation:
          'L’horizon des événements marque la limite spatio-temporelle où la vitesse de libération atteint celle de la lumière.',
      },
      ru: {
        category: 'Загадка · Космология и Относительность',
        prompt:
          'Падающий астронавт не встречает твёрдой стены, пересекая меня, но для далёкого наблюдателя время у моего края словно застывает, и ни один луч света не может вырваться наружу. Что я?',
        clue: 'Односторонняя граница пространства-времени на радиусе Шварцшильда.',
        options: [
          'Граница облака Оорта',
          'Плоскость пояса Койпера',
          'Радиационный пояс Ван Аллена',
          'Горизонт событий',
        ],
        explanation:
          'Горизонт событий — граница вокруг чёрной дыры, которую не способен покинуть даже свет.',
      },
      ar: {
        category: 'لغز · علم الكونيات والنسبية',
        prompt:
          'لا يصطدم رائد الفضاء الساقط بجدار صلب عند عبوري، لكن الزمن يبدو متجمداً عند حافتي بالنسبة لمراقب بعيد ولا يستطيع حتى شعاع ضوء واحد الإفلات مني. ما أنا؟',
        clue: 'الحد أحادي الاتجاه في الزمكان المعرّف بنصف قطر شوارزشيلد.',
        options: [
          'حدود سحابة أورت',
          'مستوى حزام كايبر',
          'حزام فان ألين الإشعاعي',
          'أفق الحدث',
        ],
        explanation:
          'أفق الحدث هو الحد الزمكاني الذي تبلغ عنده سرعة الإفلات سرعة الضوء، فيبدو الزمن متوقفاً عنده للمراقب البعيد.',
      },
      zh: {
        category: '谜题 · 宇宙学与相对论',
        prompt:
          '坠入其中的宇航员跨越我时不会撞上实体墙壁，但在遥远观测者看来时间在我边缘仿佛凝固，连一束光也无法逃脱。我是什么？',
        clue: '由史瓦西半径定义的单向时空边界。',
        options: [
          '奥尔特云边界',
          '柯伊伯带平面',
          '范艾伦辐射带',
          '事件视界',
        ],
        explanation:
          '事件视界是逃逸速度达到光速的时空边界，由于引力时间膨胀，远方观测者会看到坠落时钟在边缘趋近停滞。',
      },
      ja: {
        category: '謎解き · 宇宙論と相対性理論',
        prompt:
          '落ち込む宇宙飛行士は私を越えても壁を感じないが、遠くの観測者には私の縁で時間が止まったように見え、一筋の光すら外へ逃げられない。私は何でしょう？',
        clue: 'シュヴァルツシルト半径で定義される一方通行の時空境界。',
        options: [
          'オールトの雲の境界',
          'カイパーベルト面',
          'ヴァン・アレン帯',
          '事象の地平面（イベントホライズン）',
        ],
        explanation:
          '事象の地平面は脱出速度が光速に達する時空境界で、重力時間遅れにより遠方観測者には時間が停止するように見えます。',
      },
      pt: {
        category: 'Enigma · Cosmologia e Relatividade',
        prompt:
          'Um astronauta em queda não sente muro algum ao me cruzar, mas para um observador distante o tempo parece congelar na minha borda e nem mesmo a luz escapa. O que sou eu?',
        clue: 'Fronteira unidirecional do espaço-tempo definida pelo raio de Schwarzschild.',
        options: [
          'Limite da Nuvem de Oort',
          'Plano do Cinturão de Kuiper',
          'Cinturão de Radiação de Van Allen',
          'Horizonte de Eventos',
        ],
        explanation:
          'O horizonte de eventos é o limite onde a velocidade de escape iguala a velocidade da luz.',
      },
      it: {
        category: 'Indovinello · Cosmologia e Relatività',
        prompt:
          'Un astronauta in caduta non avverte alcun muro nell’attraversarmi, ma per un osservatore lontano il tempo sembra fermarsi sul mio bordo e nemmeno la luce può fuggire. Che cosa sono?',
        clue: 'Il confine unidirezionale dello spaziotempo definito dal raggio di Schwarzschild.',
        options: [
          'Confine della Nube di Oort',
          'Piano della Fascia di Kuiper',
          'Fascia di radiazioni di Van Allen',
          'Orizzonte degli eventi',
        ],
        explanation:
          'L’orizzonte degli eventi è la soglia oltre la quale la velocità di fuga supera quella della luce.',
      },
      ko: {
        category: '수수께끼 · 우주론과 상대성이론',
        prompt:
          '떨어지는 우주비행사는 나를 넘을 때 벽을 느끼지 않지만, 먼 관측자에게는 내 경계에서 시간이 멈춘 듯 보이고 빛조차 빠져나오지 못합니다. 나는 무엇일까요?',
        clue: '슈바르츠실트 반지름으로 정의되는 일방향 시공간 경계.',
        options: [
          '오르트 구름 경계',
          '카이퍼 벨트 평면',
          '밴 앨런 방사선대',
          '사건의 지평선',
        ],
        explanation:
          '사건의 지평선은 탈출 속도가 빛의 속도에 도달하는 시공간 경계로, 중력 시간 지연이 극대화됩니다.',
      },
    },
  },
  {
    id: 'rid-05-godel-incompleteness',
    type: 'riddle',
    difficulty: 'medium',
    correctIndex: 1,
    relatedKeyword: 'mantık',
    content: {
      tr: {
        category: 'Bilmece · Mantık & Epistemoloji',
        prompt:
          'Aritmetiği kapsayan ne kadar güçlü ve tutarlı bir aksiyom kalesi kurarsan kur, kendi dilinde "Ben bu sistem içinde kanıtlanamam" diyen doğru bir önermeyi duvarlarının arasında mutlaka bırakırım. Hangi teoremim?',
        clue: '1931’de biçimsel sistemlerin hem tam hem tutarlı olamayacağını ispatlayan teorem.',
        options: [
          'Pisagor Geometrik Orantı Teoremi',
          'Gödel Eksiklik Teoremi',
          'Bayes Koşullu Olasılık Teoremi',
          'Noether Simetri Teoremi',
        ],
        explanation:
          'Kurt Gödel’in Eksiklik Teoremi, temel aritmetiği içeren hiçbir tutarlı aksiyom sisteminin kendi içindeki tüm doğru önermeleri kanıtlayamayacağını gösterir.',
      },
      en: {
        category: 'Riddle · Logic & Epistemology',
        prompt:
          'No matter how strong and consistent an axiom fortress you build around arithmetic, I always slip a true statement inside its own language saying "I cannot be proved within this system." Which theorem am I?',
        clue: 'Proved in 1931, showing formal arithmetic systems cannot be both complete and consistent.',
        options: [
          'Pythagorean Theorem',
          "Gödel's Incompleteness Theorem",
          "Bayes' Conditional Probability Theorem",
          "Noether's Symmetry Theorem",
        ],
        explanation:
          "Gödel's Incompleteness Theorem proves that any consistent formal system capable of expressing arithmetic contains true propositions that cannot be proven within the system itself.",
      },
      es: {
        category: 'Acertijo · Lógica y Epistemología',
        prompt:
          'Por muy fuerte y consistente que sea la fortaleza axiomática que construyas para la aritmética, siempre dejo dentro un enunciado verdadero que dice «No puedo demostrarse en este sistema». ¿Qué teorema soy?',
        clue: 'Demostrado en 1931 sobre los límites de los sistemas formales.',
        options: [
          'Teorema de Pitágoras',
          'Teorema de incompletitud de Gödel',
          'Teorema de Bayes',
          'Teorema de Noether',
        ],
        explanation:
          'El teorema de incompletitud de Gödel demuestra que ningún sistema formal consistente con aritmética puede probar todas las verdades expresables en él.',
      },
      de: {
        category: 'Rätsel · Logik & Erkenntnistheorie',
        prompt:
          'Wie stark und widerspruchsfrei deine Axiomenfestung für die Arithmetik auch sei, ich lasse stets eine wahre Aussage zurück: „Ich bin in diesem System unbeweisbar.“ Welcher Satz bin ich?',
        clue: '1931 bewiesener Grenzwertsatz formaler Systeme.',
        options: [
          'Satz des Pythagoras',
          'Gödelscher Unvollständigkeitssatz',
          'Satz von Bayes',
          'Noether-Theorem',
        ],
        explanation:
          'Gödels Unvollständigkeitssatz zeigt, dass jedes widerspruchsfreie formale System der Arithmetik wahre, aber unbeweisbare Aussagen enthält.',
      },
      fr: {
        category: 'Énigme · Logique & Épistémologie',
        prompt:
          'Quelle que soit la solidité cohérente de ta forteresse d’axiomes arithmétiques, j’y glisse toujours un énoncé vrai affirmant : « Je ne suis pas démontrable dans ce système. » Quel théorème suis-je ?',
        clue: 'Démontré en 1931 sur les limites intrinsèques des systèmes formels.',
        options: [
          'Théorème de Pythagore',
          "Théorème d'incomplétude de Gödel",
          'Théorème de Bayes',
          'Théorème de Noether',
        ],
        explanation:
          "Le théorème d'incomplétude de Gödel établit que tout système formel cohérent contenant l'arithmétique comporte des vérités indémontrables en son sein.",
      },
      ru: {
        category: 'Загадка · Логика и Эпистемология',
        prompt:
          'Какую бы прочную и непротиворечивую крепость аксиом арифметики ты ни построил, я всегда оставлю внутри истинное утверждение: «Меня нельзя доказать в этой системе». Какая я теорема?',
        clue: 'Доказана в 1931 году о принципиальной неполноте формальных систем.',
        options: [
          'Теорема Пифагора',
          'Теорема Гёделя о неполноте',
          'Теорема Байеса',
          'Теорема Нётер',
        ],
        explanation:
          'Теорема Гёделя о неполноте показывает, что в любой непротиворечивой формальной арифметике существуют истинные, но недоказуемые утверждения.',
      },
      ar: {
        category: 'لغز · المنطق ونظرية المعرفة',
        prompt:
          'مهما بنيتَ قلعة متسقة وقوية من المسلمات الحسابية، سأترك داخلها عبارة صحيحة تقول بلغتها: «لا يمكن إثباتي داخل هذا النظام». أي مبرهنة أنا؟',
        clue: 'أُثبتت عام 1931 حول حدود الأنظمة الصورية المتسقة.',
        options: [
          'مبرهنة فيثاغورس',
          'مبرهنة عدم الاكتمال لغودل',
          'مبرهنة بايز للاحتمال الشرطي',
          'مبرهنة نويثر للتماثل',
        ],
        explanation:
          'تثبت مبرهنة غودل لعدم الاكتمال أن أي نظام صوري متسق يشمل الحساب يحتوي بالضرورة على قضايا صحيحة غير قابلة للبرهان داخله.',
      },
      zh: {
        category: '谜题 · 逻辑与认识论',
        prompt:
          '无论你为算术建起多么坚固且自洽的公理堡垒，我总会用它自己的语言留下一句真命题：“我无法在该系统内被证明。”我是哪一条定理？',
        clue: '1931年证明，揭示形式系统无法同时完备又一致。',
        options: [
          '勾股定理',
          '哥德尔不完备定理',
          '贝叶斯条件概率定理',
          '诺特定理',
        ],
        explanation:
          '哥德尔不完备定理证明任何包含基本算术的一致形式系统都存在无法在系统内证明的真命题。',
      },
      ja: {
        category: '謎解き · 論理学と認識論',
        prompt:
          '算術を含むどれほど堅固で無矛盾な公理の城を築いても、私はその言語で「私はこの体系内で証明できない」と語る真の命題を必ず残す。私はどの定理でしょう？',
        clue: '1931年に証明された形式体系の限界を示す定理。',
        options: [
          'ピタゴラスの定理',
          'ゲーデルの不完全性定理',
          'ベイズの定理',
          'ネーターの定理',
        ],
        explanation:
          'ゲーデルの不完全性定理は、算術を含む無矛盾な形式体系には体系内で証明できない真の命題が必ず存在することを示します。',
      },
      pt: {
        category: 'Enigma · Lógica e Epistemologia',
        prompt:
          'Por mais forte e consistente que seja a fortaleza axiomática da aritmética que você erguer, sempre deixo lá dentro uma frase verdadeira dizendo: "Não posso ser provada neste sistema." Que teorema sou eu?',
        clue: 'Demonstrado em 1931 sobre os limites de sistemas formais.',
        options: [
          'Teorema de Pitágoras',
          'Teorema da Incompletude de Gödel',
          'Teorema de Bayes',
          'Teorema de Noether',
        ],
        explanation:
          'O Teorema da Incompletude de Gödel prova que todo sistema formal consistente com aritmética contém verdades indemonstráveis dentro dele.',
      },
      it: {
        category: 'Indovinello · Logica ed Epistemologia',
        prompt:
          'Per quanto forte e coerente sia la fortezza di assiomi aritmetici che costruisci, vi lascio sempre un enunciato vero che dice: «Non sono dimostrabile in questo sistema». Quale teorema sono?',
        clue: 'Dimostrato nel 1931 sui limiti dei sistemi formali.',
        options: [
          'Teorema di Pitagora',
          'Teorema di incompletezza di Gödel',
          'Teorema di Bayes',
          'Teorema di Noether',
        ],
        explanation:
          'Il teorema di incompletezza di Gödel dimostra che ogni sistema formale coerente abbastanza potente contiene verità indimostrabili al suo interno.',
      },
      ko: {
        category: '수수께끼 · 논리학과 인식론',
        prompt:
          '산술을 품은 아무리 견고하고 모순 없는 공리 성채를 쌓아도, 나는 그 언어로 “나는 이 체계 안에서 증명될 수 없다”고 말하는 참 명제를 반드시 남깁니다. 나는 어떤 정리일까요?',
        clue: '1931년 증명된 형식 체계의 근본적 한계에 관한 정리.',
        options: [
          '피타고라스 정리',
          '괴델의 불완전성 정리',
          '베이즈 정리',
          '뇌터의 대칭성 정리',
        ],
        explanation:
          '괴델의 불완전성 정리는 산술을 표현하는 어떤 무모순 형식 체계에도 체계 내에서 증명 불가능한 참 명제가 존재함을 입증합니다.',
      },
    },
  },
  {
    id: 'rid-06-entanglement',
    type: 'riddle',
    difficulty: 'medium',
    correctIndex: 2,
    relatedKeyword: 'dolanıklık',
    content: {
      tr: {
        category: 'Bilmece · Kuantum İletişim',
        prompt:
          'İki ikiz parçacığı galaksinin iki ucuna gönder; birinin spinini ölçtüğünde diğerinin korelasyonunu anında bilirsin, ama yine de benden ışıktan hızlı mesaj göndermek için yararlanamazsın. Ben neyim?',
        clue: 'Bell eşitsizliklerini ihlal eden, ancak nedenselliği (ışıktan hızlı iletişimi) bozmayan bağ.',
        options: [
          'Elektromanyetik İndüksiyon',
          'Klasik Akustik Rezonans',
          'Kuantum Dolanıklık (Entanglement)',
          'Fotoelektrik Eşik Etkisi',
        ],
        explanation:
          'Kuantum dolanıklık uzak parçacıklar arasında güçlü korelasyonlar kurar; fakat ölçüm sonuçları rastgele olduğundan tek başına ışıktan hızlı sinyal iletemez (no-communication teoremi).',
      },
      en: {
        category: 'Riddle · Quantum Information',
        prompt:
          'Send two twin particles to opposite ends of a galaxy; measure the spin of one and you instantly know the correlation of the other, yet you still cannot use me to send faster-than-light messages. What am I?',
        clue: 'The link that violates Bell inequalities while still respecting the no-communication theorem.',
        options: [
          'Electromagnetic Induction',
          'Classical Acoustic Resonance',
          'Quantum Entanglement',
          'Photoelectric Threshold Effect',
        ],
        explanation:
          'Quantum entanglement produces non-classical correlations across arbitrary distances, yet local outcomes remain random so no faster-than-light signal can be transmitted.',
      },
      es: {
        category: 'Acertijo · Información Cuántica',
        prompt:
          'Envía dos partículas gemelas a extremos opuestos de la galaxia; al medir el espín de una conoces al instante la correlación de la otra, pero aun así no puedes enviarme como mensaje más rápido que la luz. ¿Qué soy?',
        clue: 'Vínculo que viola las desigualdades de Bell sin romper la causalidad relativista.',
        options: [
          'Inducción electromagnética',
          'Resonancia acústica clásica',
          'Entrelazamiento cuántico',
          'Efecto fotoeléctrico',
        ],
        explanation:
          'El entrelazamiento cuántico correlaciona partículas a distancia sin permitir transmisión de señales superlumínicas.',
      },
      de: {
        category: 'Rätsel · Quanteninformation',
        prompt:
          'Schicke zwei Zwillingsteilchen ans andere Ende der Galaxis; misst du den Spin des einen, kennst du sofort die Korrelation des anderen, doch überlichtschnelle Nachrichten erlaubt mein Band nicht. Was bin ich?',
        clue: 'Verletzt Bellsche Ungleichungen, wahrt jedoch das No-Communication-Theorem.',
        options: [
          'Elektromagnetische Induktion',
          'Klassische akustische Resonanz',
          'Quantenverschränkung',
          'Photoelektrischer Effekt',
        ],
        explanation:
          'Quantenverschränkung erzeugt nichtklassische Korrelationen, erlaubt wegen zufälliger Einzelergebnisse jedoch keine Überlichtkommunikation.',
      },
      fr: {
        category: 'Énigme · Information Quantique',
        prompt:
          'Envoie deux particules jumelles aux confins de la galaxie ; mesure le spin de l’une et tu connais aussitôt la corrélation de l’autre, sans pouvoir pourtant transmettre de message plus vite que la lumière. Que suis-je ?',
        clue: 'Lien qui viole les inégalités de Bell tout en respectant la causalité.',
        options: [
          'Induction électromagnétique',
          'Résonance acoustique classique',
          'Intrication quantique',
          'Effet photoélectrique',
        ],
        explanation:
          'L’intrication quantique crée des corrélations non locales sans jamais permettre l’envoi d’information supraluminique.',
      },
      ru: {
        category: 'Загадка · Квантовая Информация',
        prompt:
          'Отправь две частицы-близнеца на разные края галактики; измерив спин одной, мгновенно узнаешь корреляцию другой, но передать через меня сигнал быстрее света всё равно нельзя. Что я?',
        clue: 'Связь, нарушающая неравенства Белла, но не нарушающая принцип причинности.',
        options: [
          'Электромагнитная индукция',
          'Классический акустический резонанс',
          'Квантовая запутанность',
          'Фотоэлектрический эффект',
        ],
        explanation:
          'Квантовая запутанность создаёт нелокальные корреляции, но случайность локальных исходов запрещает сверхсветовую связь.',
      },
      ar: {
        category: 'لغز · المعلومات الكمومية',
        prompt:
          'أرسل جسيمين توأمين إلى طرفي المجرة؛ بقياس لفّ أحدهما تعرف فوراً ارتباط الآخر، ومع ذلك لا يمكنك استخدامي لإرسال رسائل أسرع من الضوء. ما أنا؟',
        clue: 'الرابط الذي يخالف متباينات بيل دون أن يكسر مبدأ السببية.',
        options: [
          'الحث الكهرومغناطيسي',
          'الرنين الصوتي الكلاسيكي',
          'التشابك الكمومي',
          'التأثير الكهروضوئي',
        ],
        explanation:
          'يُنتج التشابك الكمومي ارتباطات قوية عبر المسافات، لكن عشوائية القياس المحلي تمنع نقل إشارات أسرع من الضوء.',
      },
      zh: {
        category: '谜题 · 量子信息',
        prompt:
          '把一对孪生粒子送到银河两端；测出其中一个的自旋便立刻知道另一个的关联状态，但你依然无法借我传递超光速消息。我是什么？',
        clue: '违背贝尔不等式却依然遵守不可超光速通信定理的量子关联。',
        options: [
          '电磁感应',
          '经典声学共振',
          '量子纠缠',
          '光电效应',
        ],
        explanation:
          '量子纠缠在任意距离上形成非经典关联，但由于单端测量结果随机，不能用于超光速传递信息。',
      },
      ja: {
        category: '謎解き · 量子情報',
        prompt:
          '双子の粒子を銀河の両端へ送り、片方のスピンを測ればもう一方の相関が即座にわかるのに、私を使って光速を超える通信はできない。私は何でしょう？',
        clue: 'ベルの不等式を破りつつ、非通信定理を守る量子相関。',
        options: [
          '電磁誘導',
          '古典的音響共鳴',
          '量子もつれ（エンタングルメント）',
          '光電効果',
        ],
        explanation:
          '量子もつれは遠隔相関を生みますが、個々の測定結果が確率的であるため超光速通信はできません。',
      },
      pt: {
        category: 'Enigma · Informação Quântica',
        prompt:
          'Envie duas partículas gêmeas para extremos opostos da galáxia; ao medir o spin de uma, você sabe na hora a correlação da outra, mas ainda não consegue enviar mensagens mais rápidas que a luz. O que sou eu?',
        clue: 'Vínculo que viola desigualdades de Bell sem quebrar a causalidade.',
        options: [
          'Indução eletromagnética',
          'Ressonância acústica clássica',
          'Emaranhamento quântico',
          'Efeito fotoelétrico',
        ],
        explanation:
          'O emaranhamento quântico gera correlações não locais sem permitir comunicação acima da velocidade da luz.',
      },
      it: {
        category: 'Indovinello · Informazione Quantistica',
        prompt:
          'Spedisci due particelle gemelle ai capi opposti della galassia; misurando lo spin di una conosci subito la correlazione dell’altra, ma non puoi comunque usarmi per inviare messaggi più veloci della luce. Che cosa sono?',
        clue: 'Legame che viola le disuguaglianze di Bell rispettando il teorema di non-comunicazione.',
        options: [
          'Induzione elettromagnetica',
          'Risonanza acustica classica',
          'Entanglement quantistico',
          'Effetto fotoelettrico',
        ],
        explanation:
          'L’entanglement crea correlazioni non locali ma l’esito casuale delle misure impedisce segnali superluminali.',
      },
      ko: {
        category: '수수께끼 · 양자 정보',
        prompt:
          '쌍둥이 입자를 은하 양끝으로 보내 한쪽 스핀을 측정하면 다른 쪽 상관을 즉시 알 수 있지만, 여전히 빛보다 빠른 메시지를 보낼 수는 없습니다. 나는 무엇일까요?',
        clue: '벨 부등식을 위배하면서도 초광속 통신 금지 정리를 지키는 연결.',
        options: [
          '전자기 유도',
          '고전적 음향 공명',
          '양자 얽힘',
          '광전 효과',
        ],
        explanation:
          '양자 얽힘은 원거리 비고전 상관을 만들지만 개별 측정이 무작위이므로 초광속 신호 전송은 불가능합니다.',
      },
    },
  },
  {
    id: 'qa-07-time-dilation',
    type: 'qa',
    difficulty: 'medium',
    correctIndex: 0,
    relatedKeyword: 'zaman',
    content: {
      tr: {
        category: 'Soru-Cevap · Özel Görelilik',
        prompt:
          'Özel görelilikte ışık hızının %80’iyle (v = 0,8c) hareket eden bir uzay aracındaki saat, Dünya’daki hareketsiz bir gözlemciye göre nasıl işler?',
        clue: 'Lorentz faktörü γ = 1 / √(1 − v²/c²) formülünde v = 0,8c için √(1 − 0,64) = 0,6 olur.',
        options: [
          'Dünya’daki saate göre yaklaşık %40 daha yavaş (γ = 1,67) işler',
          'Dünya’daki saate göre %67 daha hızlı işler',
          'Hız sabit olduğu için Dünya’daki saatle tamamen aynı işler',
          'Zaman yalnızca kütleçekim alanında değişir, hızla değişmez',
        ],
        explanation:
          'v = 0,8c için Lorentz faktörü γ = 1 / 0,6 ≈ 1,67’dir; yani Dünya’da 100 dakika geçerken araçtaki saat yaklaşık 60 dakika ilerler.',
      },
      en: {
        category: 'Q&A · Special Relativity',
        prompt:
          'In special relativity, how does a clock aboard a spacecraft traveling at 80% of the speed of light (v = 0.8c) tick as observed from Earth?',
        clue: 'Compute the Lorentz factor γ = 1 / √(1 − 0.8²), where √0.36 = 0.6.',
        options: [
          'About 40% slower than Earth clocks (Lorentz factor γ ≈ 1.67)',
          'About 67% faster than Earth clocks',
          'At the exact same rate because velocity is constant',
          'Time only changes in gravity, not with velocity',
        ],
        explanation:
          'At v = 0.8c, γ = 1 / 0.6 ≈ 1.67, meaning 60 minutes pass on the spacecraft for every 100 minutes on Earth.',
      },
      es: {
        category: 'Preguntas · Relatividad Especial',
        prompt:
          'En relatividad especial, ¿cómo marca el tiempo un reloj en una nave que viaja al 80 % de la velocidad de la luz (v = 0,8c) visto desde la Tierra?',
        clue: 'Usa el factor de Lorentz γ = 1 / √(1 − 0,64) = 1 / 0,6.',
        options: [
          'Un 40 % más lento que en la Tierra (γ ≈ 1,67)',
          'Un 67 % más rápido que en la Tierra',
          'Exactamente al mismo ritmo por ser velocidad constante',
          'El tiempo solo cambia por gravedad, nunca por velocidad',
        ],
        explanation:
          'Para v = 0,8c el factor γ ≈ 1,67: mientras pasan 100 minutos en la Tierra, en la nave transcurren 60.',
      },
      de: {
        category: 'Frage & Antwort · Spezielle Relativität',
        prompt:
          'Wie geht eine Uhr an Bord eines Raumschiffs bei 80 % der Lichtgeschwindigkeit (v = 0,8c) aus Sicht eines ruhenden Erdbeobachters?',
        clue: 'Lorentzfaktor γ = 1 / √(1 − 0,64) = 1 / 0,6 ≈ 1,67.',
        options: [
          'Etwa 40 % langsamer als Erduhren (γ ≈ 1,67)',
          'Etwa 67 % schneller als Erduhren',
          'Genau gleich schnell, da die Geschwindigkeit konstant ist',
          'Zeit ändert sich nur durch Gravitation, nicht durch Geschwindigkeit',
        ],
        explanation:
          'Bei v = 0,8c beträgt γ ≈ 1,67; vergehen auf der Erde 100 Minuten, zeigt die Borduhr nur 60 Minuten.',
      },
      fr: {
        category: 'Questions · Relativité Restreinte',
        prompt:
          'En relativité restreinte, comment bat une horloge à bord d’un vaisseau voyageant à 80 % de la vitesse de la lumière (v = 0,8c) vue depuis la Terre ?',
        clue: 'Calcule le facteur de Lorentz γ = 1 / √(1 − 0,64) = 1 / 0,6.',
        options: [
          'Environ 40 % plus lentement que sur Terre (γ ≈ 1,67)',
          'Environ 67 % plus rapidement que sur Terre',
          'Au même rythme car la vitesse est constante',
          'Le temps ne varie qu’avec la gravité, jamais la vitesse',
        ],
        explanation:
          'À v = 0,8c, γ ≈ 1,67 : 60 minutes s’écoulent dans le vaisseau pour 100 minutes sur Terre.',
      },
      ru: {
        category: 'Вопрос-Ответ · Специальная Относительность',
        prompt:
          'В специальной теории относительности как идут часы на корабле, летящем со скоростью 0,8c, с точки зрения наблюдателя на Земле?',
        clue: 'Фактор Лоренца γ = 1 / √(1 − 0,64) = 1 / 0,6 ≈ 1,67.',
        options: [
          'Примерно на 40 % медленнее земных часов (γ ≈ 1,67)',
          'Примерно на 67 % быстрее земных часов',
          'С той же скоростью, так как движение равномерное',
          'Время зависит только от гравитации, а не от скорости',
        ],
        explanation:
          'При v = 0,8c фактор γ ≈ 1,67: за 100 земных минут на корабле проходит 60 минут.',
      },
      ar: {
        category: 'سؤال وجواب · النسبية الخاصة',
        prompt:
          'في النسبية الخاصة، كيف تعمل ساعة داخل مركبة تسير بسرعة 80% من سرعة الضوء (v = 0.8c) بالنسبة لمراقب على الأرض؟',
        clue: 'معامل لورنتز γ = 1 / √(1 − 0.64) = 1 / 0.6 ≈ 1.67.',
        options: [
          'أبطأ بنحو 40% من ساعات الأرض (γ ≈ 1.67)',
          'أسرع بنحو 67% من ساعات الأرض',
          'بنفس المعدل تماماً لأن السرعة ثابتة',
          'يتغير الزمن بالجاذبية فقط ولا يتأثر بالسرعة',
        ],
        explanation:
          'عند 0.8c يكون معامل لورنتز نحو 1.67، أي تمر 60 دقيقة في المركبة مقابل كل 100 دقيقة على الأرض.',
      },
      zh: {
        category: '问答 · 狭义相对论',
        prompt:
          '在狭义相对论中，从地球观察一艘以 80% 光速（v = 0.8c）飞行的飞船，船上的时钟走动情况如何？',
        clue: '洛伦兹因子 γ = 1 / √(1 − 0.64) = 1 / 0.6 ≈ 1.67。',
        options: [
          '比地球时钟慢约 40%（γ ≈ 1.67）',
          '比地球时钟快约 67%',
          '因匀速运动，与地球时钟完全一致',
          '时间只受引力影响，与速度无关',
        ],
        explanation:
          '在 v = 0.8c 时 γ ≈ 1.67，地球过去 100 分钟时飞船时钟只走过 60 分钟。',
      },
      ja: {
        category: 'Q&A · 特殊相対性理論',
        prompt:
          '特殊相対性理論では、光速の80%（v = 0.8c）で飛行する宇宙船の時計は地球の観測者からどう見えますか？',
        clue: 'ローレンツ因子 γ = 1 / √(1 − 0.64) = 1 / 0.6 ≈ 1.67。',
        options: [
          '地球の時計より約40%遅く進む（γ ≈ 1.67）',
          '地球の時計より約67%速く進む',
          '等速運動なので地球とまったく同じ速さで進む',
          '時間は重力でのみ変化し速度では変わらない',
        ],
        explanation:
          'v = 0.8c で γ ≈ 1.67 となり、地球で100分経つ間に船内では60分しか進みません。',
      },
      pt: {
        category: 'Perguntas · Relatividade Especial',
        prompt:
          'Na relatividade especial, como funciona um relógio em uma nave viajando a 80% da velocidade da luz (v = 0,8c) observado da Terra?',
        clue: 'Calcule o fator de Lorentz γ = 1 / √(1 − 0,64) = 1 / 0,6.',
        options: [
          'Cerca de 40% mais devagar que na Terra (γ ≈ 1,67)',
          'Cerca de 67% mais rápido que na Terra',
          'No mesmo ritmo porque a velocidade é constante',
          'O tempo só muda com gravidade, não com velocidade',
        ],
        explanation:
          'Para v = 0,8c, γ ≈ 1,67: 60 minutos na nave equivalem a 100 minutos na Terra.',
      },
      it: {
        category: 'Domande · Relatività Ristretta',
        prompt:
          'Nella relatività ristretta, come scorre un orologio su un’astronave che viaggia all’80% della velocità della luce (v = 0,8c) visto dalla Terra?',
        clue: 'Fattore di Lorentz γ = 1 / √(1 − 0,64) = 1 / 0,6 ≈ 1,67.',
        options: [
          'Circa il 40% più lentamente rispetto alla Terra (γ ≈ 1,67)',
          'Circa il 67% più velocemente rispetto alla Terra',
          'Allo stesso ritmo perché la velocità è costante',
          'Il tempo cambia solo con la gravità, mai con la velocità',
        ],
        explanation:
          'A v = 0,8c, γ ≈ 1,67: mentre sulla Terra passano 100 minuti, sull’astronave ne passano 60.',
      },
      ko: {
        category: '질문과 답 · 특수 상대성이론',
        prompt:
          '특수 상대성이론에서 빛의 속도의 80%(v = 0.8c)로 비행하는 우주선의 시계는 지구 관측자에게 어떻게 보일까요?',
        clue: '로런츠 인자 γ = 1 / √(1 − 0.64) = 1 / 0.6 ≈ 1.67입니다.',
        options: [
          '지구 시계보다 약 40% 느리게 간다 (γ ≈ 1.67)',
          '지구 시계보다 약 67% 빠르게 간다',
          '등속 운동이므로 지구 시계와 완전히 같다',
          '시간은 중력에만 영향을 받고 속도에는 무관하다',
        ],
        explanation:
          'v = 0.8c일 때 γ ≈ 1.67이므로 지구에서 100분이 흐를 때 우주선에서는 60분이 흐릅니다.',
      },
    },
  },
  {
    id: 'qa-08-falsifiability',
    type: 'qa',
    difficulty: 'medium',
    correctIndex: 2,
    relatedKeyword: 'bilim felsefesi',
    content: {
      tr: {
        category: 'Soru-Cevap · Bilim Felsefesi',
        prompt:
          'Karl Popper’a göre bir kuramı bilimsel kılan temel ayırt edici ölçüt (sınır koyma ilkesi) aşağıdakilerden hangisidir?',
        clue: 'Kuramın hangi gözlem veya deneyle çürütülebileceğini önceden açıkça belirtmesi gerekir.',
        options: [
          'Hiçbir deneyle çürütülememesi ve her olguyu açıklaması',
          'Yalnızca çoğunluğun oyuyla kabul edilmesi',
          'Yanlışlanabilir olması (riskli ve sınanabilir öngörüler üretmesi)',
          'Tümüyle matematiksel sembollerden arınmış olması',
        ],
        explanation:
          'Popper’ın yanlışlanabilirlik ölçütüne göre bilimsel bir kuram, gözlemle çürütülme riskini taşıyan sınanabilir öngörüler sunmalıdır.',
      },
      en: {
        category: 'Q&A · Philosophy of Science',
        prompt:
          'According to Karl Popper, what is the primary demarcation criterion that distinguishes a scientific theory from non-science?',
        clue: 'A theory must state in advance what observation or experiment could refute it.',
        options: [
          'Being impossible to refute and able to explain every possible outcome',
          'Receiving majority approval in a public vote',
          'Falsifiability (making risky, testable predictions that could prove it wrong)',
          'Avoiding mathematical notation completely',
        ],
        explanation:
          'Popper argued that genuine scientific theories expose themselves to empirical refutation through bold, falsifiable predictions.',
      },
      es: {
        category: 'Preguntas · Filosofía de la Ciencia',
        prompt:
          'Según Karl Popper, ¿cuál es el criterio fundamental que distingue a una teoría científica?',
        clue: 'Debe especificar qué experimento u observación podría refutarla.',
        options: [
          'Ser imposible de refutar y explicarlo todo',
          'Ser aprobada únicamente por mayoría de votos',
          'La falsabilidad (hacer predicciones comprobables y refutables)',
          'Evitar por completo las matemáticas',
        ],
        explanation:
          'Para Popper, la falsabilidad exige que una teoría científica formule predicciones arriesgadas susceptibles de refutación empírica.',
      },
      de: {
        category: 'Frage & Antwort · Wissenschaftstheorie',
        prompt:
          'Was ist laut Karl Popper das zentrale Abgrenzungskriterium einer wissenschaftlichen Theorie?',
        clue: 'Eine Theorie muss angeben, welche Beobachtung sie widerlegen könnte.',
        options: [
          'Unwiderlegbar zu sein und jedes Ergebnis nachträglich zu erklären',
          'Durch bloße Mehrheitsabstimmung bestätigt zu werden',
          'Falsifizierbarkeit (riskante, empirisch widerlegbare Vorhersagen)',
          'Auf mathematische Formeln zu verzichten',
        ],
        explanation:
          'Nach Popper zeichnet sich Wissenschaft dadurch aus, dass Hypothesen durch Beobachtung grundsätzlich falsifiziert werden können.',
      },
      fr: {
        category: 'Questions · Philosophie des Sciences',
        prompt:
          'Selon Karl Popper, quel est le critère essentiel de démarcation d’une théorie scientifique ?',
        clue: 'Elle doit indiquer quelle expérience pourrait la réfuter.',
        options: [
          'Être irréfutable et tout expliquer après coup',
          'Être validée uniquement par un vote majoritaire',
          'La réfutabilité (formuler des prédictions testables et risquées)',
          'Écarter totalement les mathématiques',
        ],
        explanation:
          'Pour Popper, la réfutabilité (falsifiabilité) distingue la science : une théorie doit prendre le risque d’être contredite par l’expérience.',
      },
      ru: {
        category: 'Вопрос-Ответ · Философия Науки',
        prompt:
          'Каков, по Карлу Попперу, главный критерий демаркации, отличающий научную теорию?',
        clue: 'Теория должна допускать эксперимент, способный её опровергнуть.',
        options: [
          'Невозможность опровержения при любых наблюдениях',
          'Принятие простым большинством голосов',
          'Фальсифицируемость (принципиальная проверяемость и опровержимость)',
          'Полный отказ от математического языка',
        ],
        explanation:
          'Критерий фальсифицируемости Поппера требует, чтобы научная теория делала смелые предсказания, которые опыт может опровергнуть.',
      },
      ar: {
        category: 'سؤال وجواب · فلسفة العلم',
        prompt:
          'وفقاً لكارل بوبر، ما المعيار الأساسي الذي يميز النظرية العلمية عن غير العلمية؟',
        clue: 'يجب أن تحدد النظرية سلفاً أي ملاحظة أو تجربة يمكن أن تدحضها.',
        options: [
          'استحالة دحضها وقدرتها على تفسير كل شيء',
          'اعتمادها بتصويت الأغلبية فقط',
          'القابلية للتكذيب (تقديم تنبؤات قابلة للاختبار والدحض)',
          'خلوّها تماماً من المعادلات الرياضية',
        ],
        explanation:
          'يرى بوبر أن القابلية للتكذيب هي معيار العلمية، إذ تعرض النظرية نفسها لاختبار تجريبي قد يثبت خطأها.',
      },
      zh: {
        category: '问答 · 科学哲学',
        prompt:
          '根据卡尔·波普尔的观点，区分科学理论与非科学的核心划界标准是什么？',
        clue: '理论必须明确指出什么样的观察或实验可以反驳它。',
        options: [
          '永远无法被推翻且能解释一切结果',
          '仅凭多数人投票通过',
          '可证伪性（提出可检验且可能被反驳的预测）',
          '完全不使用数学符号',
        ],
        explanation:
          '波普尔认为可证伪性是科学的核心特征：科学理论必须提出可接受经验检验甚至反驳的预测。',
      },
      ja: {
        category: 'Q&A · 科学哲学',
        prompt:
          'カール・ポパーによれば、科学理論と非科学を分ける最も基本的な基準は何ですか？',
        clue: 'どのような観測や実験で誤りと示され得るかを明示できること。',
        options: [
          'どんな実験でも否定できず何でも説明できること',
          '多数決で合意されること',
          '反証可能性（検証・反証され得る予測を立てること）',
          '数式を一切使わないこと',
        ],
        explanation:
          'ポパーは、経験的観測によって誤りだと反証され得る「反証可能性」を科学理論の核心基準としました。',
      },
      pt: {
        category: 'Perguntas · Filosofia da Ciência',
        prompt:
          'Segundo Karl Popper, qual é o critério fundamental que distingue uma teoria científica?',
        clue: 'A teoria deve indicar qual experimento poderia refutá-la.',
        options: [
          'Ser irrefutável e explicar qualquer resultado',
          'Ser aprovada apenas por maioria de votos',
          'Falseabilidade (fazer previsões testáveis e refutáveis)',
          'Evitar totalmente a matemática',
        ],
        explanation:
          'Para Popper, uma teoria científica precisa ser falseável, expondo-se a testes empíricos capazes de refutá-la.',
      },
      it: {
        category: 'Domande · Filosofia della Scienza',
        prompt:
          'Secondo Karl Popper, qual è il criterio fondamentale che distingue una teoria scientifica?',
        clue: 'Deve indicare quale osservazione potrebbe confutarla.',
        options: [
          'Essere inconfutabile e spiegare ogni evento',
          'Essere approvata solo a maggioranza',
          'La falsificabilità (formulare previsioni verificabili e confutabili)',
          'Rinunciare completamente alla matematica',
        ],
        explanation:
          'Per Popper, la falsificabilità distingue la scienza: una teoria deve esporsi al rischio della confutazione empirica.',
      },
      ko: {
        category: '질문과 답 · 과학철학',
        prompt:
          '칼 포퍼에 따르면 과학 이론을 비과학과 구분하는 핵심 기준은 무엇인가요?',
        clue: '어떤 관측이나 실험으로 틀렸음을 보일 수 있는지 제시해야 합니다.',
        options: [
          '어떤 실험으로도 반박할 수 없고 모든 현상을 설명함',
          '단순 다수결 투표로 승인됨',
          '반증 가능성 (경험적으로 시험·반박될 수 있는 예측 제시)',
          '수학적 기호를 전혀 사용하지 않음',
        ],
        explanation:
          '포퍼는 경험적 실험으로 반박될 위험을 감수하는 반증 가능성을 과학의 핵심 기준으로 제시했습니다.',
      },
    },
  },
  {
    id: 'qa-09-robot-ethics',
    type: 'qa',
    difficulty: 'medium',
    correctIndex: 3,
    relatedKeyword: 'robot',
    content: {
      tr: {
        category: 'Soru-Cevap · Otonom Robotik & Etik',
        prompt:
          'Otonom robotlar ve gelişmiş yapay zekâ sistemleri için evrensel bağlayıcı kurallar neden istisnasız biçimde tasarlanmalıdır?',
        clue: 'Arşivdeki robot etiği metinleri "hiç kimsenin muaf tutulmaması" ilkesini vurgular.',
        options: [
          'Sadece donanım pil ömrünü uzatmak için',
          'Yalnızca belirli şirketlerin rekabet avantajı kazanması için',
          'Robotların hızını sabitlemek için, güvenlik ikincildir',
          'Tek taraflı kötüye kullanımı önlemek ve insan güvenliğini herkes için eşit korumak için',
        ],
        explanation:
          'İstisnasız küresel etik ve güvenlik kuralları, otonom sistemlerin asimetrik biçimde kötüye kullanılmasını engeller ve insan haklarını evrensel olarak güvence altına alır.',
      },
      en: {
        category: 'Q&A · Autonomous Robotics & Ethics',
        prompt:
          'Why must binding ethical and safety rules for autonomous robots and advanced AI apply universally without exemptions?',
        clue: 'The robotics ethics essays in the archive stress that no actor on Earth should be exempt.',
        options: [
          'Solely to extend hardware battery life',
          'Only to give select corporations a market monopoly',
          'Merely to cap movement speed while treating safety as secondary',
          'To prevent asymmetric misuse and protect human safety equally for everyone',
        ],
        explanation:
          'Universal, exemption-free governance prevents dangerous arms races and asymmetric misuse while safeguarding human agency and safety globally.',
      },
      es: {
        category: 'Preguntas · Robótica Autónoma y Ética',
        prompt:
          '¿Por qué las normas éticas y de seguridad para robots autónomos e IA avanzada deben aplicarse universalmente sin excepciones?',
        clue: 'Los ensayos del archivo insisten en que nadie debe quedar exento.',
        options: [
          'Solo para prolongar la batería del hardware',
          'Únicamente para favorecer monopolios corporativos',
          'Solo para limitar la velocidad física',
          'Para evitar abusos asimétricos y proteger la seguridad humana por igual',
        ],
        explanation:
          'Reglas universales sin excepciones impiden carreras peligrosas y protegen los derechos humanos de forma equitativa.',
      },
      de: {
        category: 'Frage & Antwort · Autonome Robotik & Ethik',
        prompt:
          'Warum müssen verbindliche Ethik- und Sicherheitsregeln für autonome Roboter und KI weltweit ohne Ausnahmen gelten?',
        clue: 'Die Robotik-Essays im Archiv betonen, dass niemand davon ausgenommen sein darf.',
        options: [
          'Nur um die Akkulaufzeit zu verlängern',
          'Nur für Wettbewerbsvorteile einzelner Konzerne',
          'Lediglich zur Begrenzung der Fahrgeschwindigkeit',
          'Um asymmetrischen Missbrauch zu verhindern und menschliche Sicherheit gleichberechtigt zu schützen',
        ],
        explanation:
          'Ausnahmefreie globale Regeln verhindern gefährlichen Missbrauch und schützen die Sicherheit aller Menschen gleichermaßen.',
      },
      fr: {
        category: 'Questions · Robotique Autonome & Éthique',
        prompt:
          'Pourquoi les règles éthiques et de sécurité encadrant les robots autonomes et l’IA doivent-elles s’appliquer sans exception ?',
        clue: 'Les essais du corpus soulignent qu’aucun acteur sur Terre ne doit en être exempté.',
        options: [
          'Uniquement pour prolonger la batterie',
          'Seulement pour avantager quelques entreprises',
          'Juste pour limiter la vitesse mécanique',
          'Pour éviter tout abus asymétrique et protéger équitablement la sécurité humaine',
        ],
        explanation:
          'Des règles universelles sans exemption préviennent les dérives asymétriques et protègent la sécurité humaine à l’échelle mondiale.',
      },
      ru: {
        category: 'Вопрос-Ответ · Автономная Робототехника и Этика',
        prompt:
          'Почему обязательные этические и защитные правила для автономных роботов и ИИ должны действовать без исключений?',
        clue: 'В статьях архива подчёркивается, что никто на Земле не должен быть освобождён от этих правил.',
        options: [
          'Только ради экономии заряда батарей',
          'Лишь ради монополии отдельных компаний',
          'Только чтобы ограничить скорость движения',
          'Чтобы исключить асимметричное злоупотребление и равно защитить безопасность людей',
        ],
        explanation:
          'Единые правила без исключений предотвращают опасное злоупотребление и защищают права и безопасность всех людей.',
      },
      ar: {
        category: 'سؤال وجواب · الروبوتات الذاتية والأخلاقيات',
        prompt:
          'لماذا يجب أن تُطبّق قواعد الأخلاق والسلامة للروبوتات الذاتية والذكاء الاصطناعي عالمياً دون استثناءات؟',
        clue: 'تشدد مقالات الأرشيف على ألا يُستثنى أي طرف على وجه الأرض.',
        options: [
          'فقط لإطالة عمر البطارية',
          'لمنح شركات محددة احتكاراً سوقياً فقط',
          'فقط لتقييد السرعة الميكانيكية',
          'لمنع إساءة الاستخدام غير المتكافئ وحماية سلامة البشر بالتساوي',
        ],
        explanation:
          'القواعد الملزمة بلا استثناء تمنع سباقات خطيرة وسوء استخدام غير متكافئ وتحمي سلامة الجميع.',
      },
      zh: {
        category: '问答 · 自主机器人与伦理',
        prompt:
          '为什么针对自主机器人和先进人工智能的安全与伦理规则必须普遍适用且不设例外？',
        clue: '档案中的机器人伦理文章强调地球上任何人都不得豁免。',
        options: [
          '仅仅为了延长电池续航',
          '只为少数企业建立市场垄断',
          '仅仅为了限制移动速度',
          '防止不对称滥用并平等保护全人类的安全',
        ],
        explanation:
          '无例外的普遍安全规则可防止危险的不对称滥用，并在全球范围内平等维护人类安全与尊严。',
      },
      ja: {
        category: 'Q&A · 自律ロボティクスと倫理',
        prompt:
          '自律ロボットや高度なAIに対する倫理・安全ルールが例外なく普遍的に適用されるべき理由は何ですか？',
        clue: 'アーカイブの論文は地球上の誰にも例外を認めるべきではないと強調しています。',
        options: [
          'バッテリー寿命を延ばすためだけ',
          '特定企業の独占利益のためだけ',
          '移動速度を制限するためだけ',
          '非対称な悪用を防ぎ、すべての人の安全を平等に守るため',
        ],
        explanation:
          '例外のない普遍的ルールは危険な悪用を防ぎ、人類全体の安全と権利を公平に保護します。',
      },
      pt: {
        category: 'Perguntas · Robótica Autônoma e Ética',
        prompt:
          'Por que regras éticas e de segurança para robôs autônomos e IA avançada devem valer universalmente sem exceções?',
        clue: 'Os ensaios do arquivo destacam que ninguém na Terra deve ficar isento.',
        options: [
          'Apenas para economizar bateria',
          'Somente para beneficiar monopólios corporativos',
          'Apenas para limitar velocidade mecânica',
          'Para evitar abusos assimétricos e proteger igualmente a segurança humana',
        ],
        explanation:
          'Regras universais sem isenções evitam usos indevidos assimétricos e protegem a segurança de toda a humanidade.',
      },
      it: {
        category: 'Domande · Robotica Autonoma ed Etica',
        prompt:
          'Perché le regole etiche e di sicurezza per robot autonomi e IA avanzata devono valere universalmente senza eccezioni?',
        clue: 'I saggi dell’archivio sottolineano che nessuno sulla Terra dovrebbe esserne esentato.',
        options: [
          'Solo per allungare la durata della batteria',
          'Solo per favorire monopoli commerciali',
          'Solo per limitare la velocità fisica',
          'Per impedire abusi asimmetrici e tutelare equamente la sicurezza umana',
        ],
        explanation:
          'Norme universali prive di esenzioni prevengono abusi asimmetrici e salvaguardano la sicurezza di tutti.',
      },
      ko: {
        category: '질문과 답 · 자율 로보틱스와 윤리',
        prompt:
          '자율 로봇과 고도 인공지능에 대한 윤리·안전 규칙이 예외 없이 보편적으로 적용되어야 하는 이유는 무엇인가요?',
        clue: '아카이브의 로봇 윤리 글은 지구상 누구도 예외가 되어서는 안 된다고 강조합니다.',
        options: [
          '배터리 수명만 늘리기 위해',
          '특정 기업의 독점 이익을 위해서만',
          '기계적 이동 속도만 제한하기 위해',
          '비대칭적 오남용을 막고 모든 인류의 안전을 평등하게 보호하기 위해',
        ],
        explanation:
          '예외 없는 보편 규범은 위험한 오남용을 예방하고 모든 사람의 안전과 권리를 동등하게 지킵니다.',
      },
    },
  },
  {
    id: 'qa-10-qubit-decoherence',
    type: 'qa',
    difficulty: 'medium',
    correctIndex: 1,
    relatedKeyword: 'kübit',
    content: {
      tr: {
        category: 'Soru-Cevap · Kuantum Hesaplama',
        prompt:
          'Bir kuantum işlemcide kübitlerin çevreyle istenmeyen etkileşime girerek süperpozisyon faz bilgisini hızla kaybetmesine ne ad verilir ve neden temel mühendislik engelidir?',
        clue: 'Mikro-saniyeler içinde hesaplama hatalarına yol açan eşevrelilik kaybı süreci.',
        options: [
          'Klasik Termal Genleşme — yalnızca kabloları uzatır',
          'Kuantum Dekoherens — hesaplama bitmeden kuantum durumunu bozar',
          'Doppler Kırmızıya Kayma — yalnız yıldız ışıklarında görülür',
          'Statik Sürtünme — mekanik dişlileri yavaşlatır',
        ],
        explanation:
          'Kuantum dekoherens, kübitlerin dış gürültü ve ısıyla dolanarak faz eşevreliliğini yitirmesidir; bu yüzden kriyojenik soğutma ve kuantum hata düzeltme kodları kritik önemdedir.',
      },
      en: {
        category: 'Q&A · Quantum Computing',
        prompt:
          'In a quantum processor, what is the rapid loss of superposition phase information caused by unwanted environmental interaction, and why is it a core engineering hurdle?',
        clue: 'The coherence breakdown process that triggers computational errors within microseconds.',
        options: [
          'Classical Thermal Expansion — only stretches wiring',
          'Quantum Decoherence — corrupts the quantum state before computation finishes',
          'Doppler Redshift — occurs only in starlight',
          'Static Friction — slows mechanical gears',
        ],
        explanation:
          'Quantum decoherence arises when qubits interact with thermal or electromagnetic noise, destroying coherence and requiring cryogenic isolation and error-correction codes.',
      },
      es: {
        category: 'Preguntas · Computación Cuántica',
        prompt:
          'En un procesador cuántico, ¿cómo se llama la pérdida rápida de fase de superposición por interacción con el entorno?',
        clue: 'Proceso de ruptura de coherencia que obliga a usar enfriamiento criogénico y corrección de errores.',
        options: [
          'Dilatación térmica clásica',
          'Decoherencia cuántica — altera el estado antes de terminar el cálculo',
          'Corrimiento al rojo Doppler',
          'Fricción estática mecánica',
        ],
        explanation:
          'La decoherencia cuántica destruye la coherencia de los cúbits al interactuar con el ruido ambiental.',
      },
      de: {
        category: 'Frage & Antwort · Quantencomputing',
        prompt:
          'Wie heißt der rasche Verlust der Phasen-Kohärenz von Qubits durch unerwünschte Umwelteinflüsse in einem Quantenprozessor?',
        clue: 'Der Kohärenzverlust, der kryogene Kühlung und Quantenfehlerkorrektur nötig macht.',
        options: [
          'Klassische Wärmeausdehnung',
          'Quantendekohärenz — zerstört den Quantenzustand vor Abschluss der Rechnung',
          'Doppler-Rotverschiebung',
          'Haftreibung',
        ],
        explanation:
          'Quantendekohärenz entsteht durch Kopplung an Umgebungsrauschen und begrenzt die nutzbare Rechenzeit von Qubits.',
      },
      fr: {
        category: 'Questions · Informatique Quantique',
        prompt:
          'Dans un processeur quantique, comment appelle-t-on la perte rapide de cohérence de phase des qubits due à l’environnement ?',
        clue: 'Phénomène qui impose le refroidissement cryogénique et la correction d’erreurs.',
        options: [
          'Dilatation thermique classique',
          'Décohérence quantique — altère l’état avant la fin du calcul',
          'Décalage vers le rouge Doppler',
          'Frottement statique',
        ],
        explanation:
          'La décohérence quantique provient du bruit thermique et électromagnétique, détruisant la superposition des qubits.',
      },
      ru: {
        category: 'Вопрос-Ответ · Квантовые Вычисления',
        prompt:
          'Как называется быстрая потеря фазовой когерентности кубитов из-за взаимодействия со средой в квантовом процессоре?',
        clue: 'Явление, требующее криогенного охлаждения и квантовой коррекции ошибок.',
        options: [
          'Классическое тепловое расширение',
          'Квантовая декогеренция — разрушает состояние до конца вычисления',
          'Доплеровское красное смещение',
          'Статическое трение',
        ],
        explanation:
          'Квантовая декогеренция разрушает суперпозицию кубитов из-за шумов среды и является главным инженерным вызовом.',
      },
      ar: {
        category: 'سؤال وجواب · الحوسبة الكمومية',
        prompt:
          'في المعالج الكمومي، ما اسم الفقدان السريع لتماسك طور الكيوبتات بسبب التفاعل غير المرغوب مع البيئة؟',
        clue: 'الظاهرة التي تفرض التبريد الفائق وأكواد تصحيح الأخطاء الكمومية.',
        options: [
          'التمدد الحراري الكلاسيكي',
          'فك التماسك الكمومي — يفسد الحالة الكمومية قبل إتمام الحساب',
          'الانزياح الأحمر لدوبلر',
          'الاحتكاك السكوني',
        ],
        explanation:
          'ينشأ فك التماسك الكمومي عن الضوضاء الحرارية والكهرومغناطيسية، مما يدمّر التراكب سريعاً.',
      },
      zh: {
        category: '问答 · 量子计算',
        prompt:
          '在量子处理器中，量子比特因与环境发生非预期相互作用而迅速丧失叠加相位信息的现象称为什么？',
        clue: '需要极低温冷却和量子纠错码来应对的核心障碍。',
        options: [
          '经典热膨胀',
          '量子退相干 — 在计算完成前破坏量子态',
          '多普勒红移',
          '静摩擦力',
        ],
        explanation:
          '量子退相干源于环境噪声与热扰动，会迅速瓦解量子比特的相干叠加态。',
      },
      ja: {
        category: 'Q&A · 量子コンピュータ',
        prompt:
          '量子プロセッサで、環境との不要な相互作用により量子ビットの位相情報が急速に失われる現象は何と呼ばれますか？',
        clue: '極低温冷却や量子誤り訂正が必要になる根本的障壁。',
        options: [
          '古典的熱膨張',
          '量子デコヒーレンス — 計算完了前に量子状態を壊す',
          'ドップラー赤方偏移',
          '静止摩擦',
        ],
        explanation:
          '量子デコヒーレンスは外部ノイズにより重ね合わせのコヒーレンスが崩れる現象で、量子計算の最大の課題です。',
      },
      pt: {
        category: 'Perguntas · Computação Quântica',
        prompt:
          'Em um processador quântico, como se chama a perda rápida de coerência de fase dos qubits causada pelo ambiente?',
        clue: 'Fenômeno que exige resfriamento criogênico e correção de erros quânticos.',
        options: [
          'Expansão térmica clássica',
          'Decoerência quântica — corrompe o estado antes do fim do cálculo',
          'Desvio para o vermelho Doppler',
          'Atrito estático',
        ],
        explanation:
          'A decoerência quântica ocorre quando o ruído ambiental destrói a superposição dos qubits.',
      },
      it: {
        category: 'Domande · Calcolo Quantistico',
        prompt:
          'In un processore quantistico, come si chiama la rapida perdita di coerenza di fase dei qubit dovuta all’ambiente?',
        clue: 'Il fenomeno che impone raffreddamento criogenico e correzione degli errori.',
        options: [
          'Dilatazione termica classica',
          'Decoerenza quantistica — corrompe lo stato prima del termine del calcolo',
          'Redshift Doppler',
          'Attrito statico',
        ],
        explanation:
          'La decoerenza quantistica nasce dal rumore ambientale che distrugge la sovrapposizione dei qubit.',
      },
      ko: {
        category: '질문과 답 · 양자 컴퓨팅',
        prompt:
          '양자 프로세서에서 큐비트가 환경과 원치 않게 상호작용해 중첩 위상 정보를 빠르게 잃는 현상은 무엇인가요?',
        clue: '극저온 냉각과 양자 오류 정정이 필요한 핵심 공학적 장애물입니다.',
        options: [
          '고전적 열팽창',
          '양자 결어긋남(데코히어런스) — 계산 완료 전에 양자 상태를 붕괴시킴',
          '도플러 적색편이',
          '정지 마찰',
        ],
        explanation:
          '양자 결어긋남은 외부 열·전자기 잡음이 큐비트의 결맞음을 파괴하는 현상으로 양자컴퓨터의 핵심 난제입니다.',
      },
    },
  },
  {
    id: 'qa-11-cosmic-expansion',
    type: 'qa',
    difficulty: 'medium',
    correctIndex: 0,
    relatedKeyword: 'kozmoloji',
    content: {
      tr: {
        category: 'Soru-Cevap · Kozmoloji',
        prompt:
          'Uzak galaksilerden gelen ışığın spektrumunda gözlemlenen kozmolojik kırmızıya kaymanın (redshift) temel fiziksel nedeni nedir?',
        clue: 'Galaksilerin uzay içinde tekil fırlaması değil, aralarındaki uzay dokusunun kendisinin genişlemesi.',
        options: [
          'Işık yol alırken uzay-zaman dokusunun genişlemesiyle dalga boyunun uzaması',
          'Fotonların kütle kazanarak uzayda yavaşlayıp durması',
          'Yıldızlararası tozun tüm fotonları maviye çevirmesi',
          'Samanyolu’nun kendi ekseni etrafında dönmesinin durması',
        ],
        explanation:
          'Kozmolojik kırmızıya kayma, genişleyen evrende yolculuk eden ışığın dalga boyunun uzayın ölçek faktörüyle birlikte esnemesinden doğar.',
      },
      en: {
        category: 'Q&A · Cosmology',
        prompt:
          'What is the primary physical cause of cosmological redshift observed in the spectra of distant galaxies?',
        clue: 'It is not galaxies flying through static space, but the fabric of space itself stretching.',
        options: [
          'The expansion of spacetime stretching light wavelengths as photons travel',
          'Photons gaining rest mass and slowing to a stop',
          'Interstellar dust shifting all photons toward blue',
          'The Milky Way halting its rotation',
        ],
        explanation:
          'Cosmological redshift happens because the metric expansion of space stretches the wavelength of light in flight in proportion to the cosmic scale factor.',
      },
      es: {
        category: 'Preguntas · Cosmología',
        prompt:
          '¿Cuál es la causa física principal del corrimiento al rojo cosmológico en galaxias lejanas?',
        clue: 'El propio tejido del espacio se expande mientras viaja la luz.',
        options: [
          'La expansión del espacio-tiempo estira la longitud de onda de la luz',
          'Los fotones ganan masa en reposo y se detienen',
          'El polvo interestelar vuelve azul toda la luz',
          'La Vía Láctea deja de rotar',
        ],
        explanation:
          'Al expandirse el espacio, la longitud de onda de los fotones en viaje se estira hacia el rojo.',
      },
      de: {
        category: 'Frage & Antwort · Kosmologie',
        prompt:
          'Was ist die physikalische Hauptursache der kosmologischen Rotverschiebung ferner Galaxien?',
        clue: 'Der Raum selbst dehnt sich aus, während das Licht unterwegs ist.',
        options: [
          'Die Ausdehnung der Raumzeit dehnt die Wellenlänge des reisenden Lichts',
          'Photonen gewinnen Ruhemasse und bleiben stehen',
          'Interstellarer Staub färbt alle Photonen blau',
          'Die Milchstraße hört auf zu rotieren',
        ],
        explanation:
          'Durch die metrische Expansion des Raumes wird die Wellenlänge des Lichts während seiner Reise gedehnt.',
      },
      fr: {
        category: 'Questions · Cosmologie',
        prompt:
          'Quelle est la cause physique principale du décalage vers le rouge cosmologique des galaxies lointaines ?',
        clue: 'C’est le tissu même de l’espace qui s’étire pendant le trajet de la lumière.',
        options: [
          "L'expansion de l'espace-temps étire la longueur d'onde de la lumière en voyage",
          'Les photons acquièrent une masse au repos et s’arrêtent',
          'La poussière interstellaire rend tous les photons bleus',
          'La Voie lactée cesse de tourner',
        ],
        explanation:
          "L'expansion métrique de l'univers allonge la longueur d'onde des photons au cours de leur propagation.",
      },
      ru: {
        category: 'Вопрос-Ответ · Космология',
        prompt:
          'Какова главная физическая причина космологического красного смещения света далёких галактик?',
        clue: 'Растягивается сама ткань пространства во время полёта фотонов.',
        options: [
          'Расширение пространства-времени растягивает длину волны летящего света',
          'Фотоны приобретают массу покоя и останавливаются',
          'Межзвёздная пыль сдвигает весь свет в синюю область',
          'Млечный Путь прекращает вращение',
        ],
        explanation:
          'При расширении Вселенной длина волны распространяющихся фотонов пропорционально увеличивается.',
      },
      ar: {
        category: 'سؤال وجواب · علم الكونيات',
        prompt:
          'ما السبب الفيزيائي الرئيس للانزياح الأحمر الكوني المرصود في أطياف المجرات البعيدة؟',
        clue: 'تمدد نسيج الفضاء نفسه أثناء سفر الضوء عبره.',
        options: [
          'تمدد الزمكان يؤدي إلى إطالة الطول الموجي للضوء أثناء سفره',
          'اكتساب الفوتونات كتلة سكون وتوقفها',
          'تحويل الغبار النجمي لكل الفوتونات إلى اللون الأزرق',
          'توقف مجرة درب التبانة عن الدوران',
        ],
        explanation:
          'يتمدد الطول الموجي للفوتونات أثناء رحلتها بسبب التمدد المتري للكون نفسه.',
      },
      zh: {
        category: '问答 · 宇宙学',
        prompt:
          '在遥远星系光谱中观测到的宇宙学红移，其主要物理原因是什么？',
        clue: '空间结构本身在光子传播过程中不断膨胀拉伸。',
        options: [
          '时空膨胀在光子传播过程中拉长了光的波长',
          '光子获得静止质量并减速停下',
          '星际尘埃使所有光子蓝移',
          '银河系停止自转',
        ],
        explanation:
          '宇宙度规膨胀会按比例拉伸穿行其中光子的波长，形成宇宙学红移。',
      },
      ja: {
        category: 'Q&A · 宇宙論',
        prompt:
          '遠方銀河のスペクトルに観測される宇宙論的赤方偏移の主な物理的原因は何ですか？',
        clue: '光が進む間に空間そのものが膨張して波長を引き伸ばします。',
        options: [
          '光が進む間に時空が膨張し、光の波長が引き伸ばされるため',
          '光子が静止質量を得て減速停止するため',
          '星間塵がすべての光を青方偏移させるため',
          '天の川銀河の自転が止まるため',
        ],
        explanation:
          '宇宙の計量膨張により、伝播中の光の波長がスケール因子に比例して引き伸ばされます。',
      },
      pt: {
        category: 'Perguntas · Cosmologia',
        prompt:
          'Qual é a principal causa física do desvio cosmológico para o vermelho em galáxias distantes?',
        clue: 'O próprio tecido do espaço se expande enquanto a luz viaja.',
        options: [
          'A expansão do espaço-tempo alonga o comprimento de onda da luz',
          'Os fótons ganham massa de repouso e param',
          'A poeira interestelar desloca toda a luz para o azul',
          'A Via Láctea para de girar',
        ],
        explanation:
          'A expansão métrica do espaço estica o comprimento de onda dos fótons durante sua jornada.',
      },
      it: {
        category: 'Domande · Cosmologia',
        prompt:
          'Qual è la causa fisica principale del redshift cosmologico osservato nelle galassie lontane?',
        clue: 'Lo spaziotempo stesso si espande mentre la luce viaggia.',
        options: [
          'L’espansione dello spaziotempo allunga la lunghezza d’onda della luce',
          'I fotoni acquistano massa a riposo e si fermano',
          'La polvere interstellare sposta tutti i fotoni verso il blu',
          'La Via Lattea smette di ruotare',
        ],
        explanation:
          'L’espansione metrica dell’universo stiracchia la lunghezza d’onda dei fotoni in volo.',
      },
      ko: {
        category: '질문과 답 · 우주론',
        prompt:
          '먼 은하의 스펙트럼에서 관측되는 우주론적 적색편이의 주된 물리적 원인은 무엇인가요?',
        clue: '빛이 이동하는 동안 시공간 자체의 직물이 팽창합니다.',
        options: [
          '광자가 이동하는 동안 시공간이 팽창하며 빛의 파장이 늘어나기 때문',
          '광자가 정지 질량을 얻어 멈추기 때문',
          '성간 먼지가 모든 빛을 청색편이시키기 때문',
          '우리은하가 자전을 멈추기 때문',
        ],
        explanation:
          '우주 공간의 계량 팽창이 이동 중인 광자의 파장을 비례적으로 늘려 적색편이가 나타납니다.',
      },
    },
  },
  {
    id: 'qa-12-epistemic-humility',
    type: 'qa',
    difficulty: 'medium',
    correctIndex: 1,
    relatedKeyword: 'düşünce',
    content: {
      tr: {
        category: 'Soru-Cevap · Eleştirel Düşünce & Epistemoloji',
        prompt:
          'Tek yönlü zihinden kurtulmanın ve rasyonel bilgiyi büyütmenin epistemolojik temeli aşağıdakilerden hangisidir?',
        clue: 'Her şeyi bilmek mümkün olmasa da, bilebildiğinin en fazlasını çok yönlü sorgulamayla aramak.',
        options: [
          'İlk duyulan iddiayı sorgulamadan mutlak doğru kabul etmek',
          'Karşıt argümanları incelemek, kanıtla güncellemek ve bilebildiğinin en fazlasını aramak',
          'Yalnızca kendi görüşünü onaylayan kaynakları okumak',
          'Belirsizlik karşısında tüm bilimsel araştırmayı durdurmak',
        ],
        explanation:
          'Epistemik olgunluk, tek yönlü dogmatizmden sıyrılıp karşıt kanıtları sınamayı, yanlışlamaya açık olmayı ve bilgiyi sürekli derinleştirmeyi gerektirir.',
      },
      en: {
        category: 'Q&A · Critical Thinking & Epistemology',
        prompt:
          'What is the epistemological foundation for breaking free from a one-track mind and expanding reliable knowledge?',
        clue: 'Even if knowing everything is impossible, strive to know the maximum you can through multi-angle inquiry.',
        options: [
          'Accepting the first claim heard as absolute truth without questioning',
          'Examining counterarguments, updating with evidence, and seeking the widest possible understanding',
          'Reading only sources that confirm existing beliefs',
          'Halting all scientific inquiry whenever uncertainty appears',
        ],
        explanation:
          'Epistemic maturity requires moving beyond one-sided thinking, testing competing hypotheses against evidence, and staying open to revision.',
      },
      es: {
        category: 'Preguntas · Pensamiento Crítico y Epistemología',
        prompt:
          '¿Cuál es la base epistemológica para liberarse de una mente unidireccional y ampliar el conocimiento riguroso?',
        clue: 'Aunque no podamos saberlo todo, debemos buscar el máximo conocimiento con mente crítica.',
        options: [
          'Aceptar sin cuestionar la primera afirmación',
          'Examinar contraargumentos, actualizar con evidencia y buscar el máximo saber posible',
          'Leer solo fuentes que confirmen nuestras ideas previas',
          'Detener la investigación ante cualquier incertidumbre',
        ],
        explanation:
          'La madurez epistémica implica contrastar hipótesis rivales con pruebas y revisar nuestras creencias racionalmente.',
      },
      de: {
        category: 'Frage & Antwort · Kritisches Denken & Erkenntnistheorie',
        prompt:
          'Worin besteht das erkenntnistheoretische Fundament, um einseitiges Denken zu überwinden und verlässliches Wissen zu erweitern?',
        clue: 'Auch wenn man nicht alles wissen kann, sollte man das Maximum kritisch erschließen.',
        options: [
          'Die erste Behauptung ungeprüft als absolut wahr annehmen',
          'Gegenargumente prüfen, anhand von Belegen korrigieren und möglichst umfassend forschen',
          'Nur Quellen lesen, die eigene Vorurteile bestätigen',
          'Bei jeder Unsicherheit die Forschung abbrechen',
        ],
        explanation:
          'Epistemische Reife verlangt, Gegenargumente ernst zu nehmen, Evidenz zu prüfen und Erkenntnisse laufend zu verbessern.',
      },
      fr: {
        category: 'Questions · Esprit Critique & Épistémologie',
        prompt:
          'Quel est le fondement épistémologique pour s’affranchir d’un esprit à sens unique et accroître le savoir fiable ?',
        clue: 'Savoir le maximum de ce qu’on peut savoir, même si l’on ne peut pas tout savoir.',
        options: [
          'Accepter la première affirmation sans jamais douter',
          'Examiner les contre-arguments, réviser selon les preuves et élargir au maximum son savoir',
          'Ne lire que les sources confirmant ses propres préjugés',
          'Arrêter la science dès qu’une incertitude survient',
        ],
        explanation:
          'La rigueur épistémique consiste à confronter les thèses aux preuves et à rester ouvert à la révision critique.',
      },
      ru: {
        category: 'Вопрос-Ответ · Критическое Мышление и Эпистемология',
        prompt:
          'В чём заключается эпистемологическая основа освобождения от одностороннего мышления и роста надёжного знания?',
        clue: 'Даже если невозможно знать всё, важно стремиться узнать максимум через проверку аргументов.',
        options: [
          'Принимать первое услышанное утверждение без проверки',
          'Изучать контраргументы, обновлять взгляды по фактам и стремиться к максимуму знаний',
          'Читать только источники, подтверждающие собственное мнение',
          'Прекращать исследования при любой неопределённости',
        ],
        explanation:
          'Эпистемическая зрелость требует анализа альтернативных доводов, опоры на доказательства и готовности уточнять выводы.',
      },
      ar: {
        category: 'سؤال وجواب · التفكير النقدي ونظرية المعرفة',
        prompt:
          'ما الأساس المعرفي للتحرر من التفكير أحادي الاتجاه وتوسيع المعرفة الموثوقة؟',
        clue: 'السعي لمعرفة أقصى ما يمكن معرفته عبر فحص الحجج المتقابلة بالأدلة.',
        options: [
          'قبول أول ادعاء دون تمحيص',
          'فحص الحجج المضادة وتحديث الفهم بالأدلة والسعي لأوسع معرفة ممكنة',
          'قراءة المصادر المؤيدة للرأي المسبق فقط',
          'إيقاف البحث العلمي عند أول حالة عدم يقين',
        ],
        explanation:
          'يتطلب النضج المعرفي تجاوز النظرة الأحادية واختبار الفرضيات المتنافسة أمام الأدلة.',
      },
      zh: {
        category: '问答 · 批判性思维与认识论',
        prompt:
          '摆脱单向思维、不断拓展可靠知识的认识论基础是什么？',
        clue: '即便无法知晓一切，也要通过多角度求证去掌握力所能及的最大知识。',
        options: [
          '不加质疑地把最先听到的观点当成绝对真理',
          '审视反方论据、依据证据更新认知并力求最大程度地理解',
          '只阅读迎合既有偏见的来源',
          '一遇到不确定性就停止一切科学研究',
        ],
        explanation:
          '认识论成熟度要求跳出单向教条，用证据检验对立假说并持续修正认知。',
      },
      ja: {
        category: 'Q&A · 批判的思考と認識論',
        prompt:
          '一方向的な思考から脱却し、確かな知識を広げるための認識論的基盤は何ですか？',
        clue: 'すべては知れなくとも、知り得る最大限を多角的に検証して学ぶ姿勢。',
        options: [
          '最初に聞いた主張を疑わず絶対視すること',
          '反論を吟味し、証拠で更新しながら知り得る最大限を追求すること',
          '自説を肯定する情報源だけを読むこと',
          '不確実さがあれば直ちに研究を止めること',
        ],
        explanation:
          '認識論的成熟には、対立仮説を証拠で検証し、常に修正へ開かれた批判的探究が不可欠です。',
      },
      pt: {
        category: 'Perguntas · Pensamento Crítico e Epistemologia',
        prompt:
          'Qual é a base epistemológica para se libertar da mente unilateral e ampliar o conhecimento confiável?',
        clue: 'Mesmo sem saber tudo, buscar o máximo possível por meio de análise crítica e evidências.',
        options: [
          'Aceitar a primeira afirmação sem questionar',
          'Examinar contra-argumentos, atualizar com evidências e buscar o máximo de saber',
          'Ler apenas fontes que confirmem crenças prévias',
          'Parar toda pesquisa diante de qualquer incerteza',
        ],
        explanation:
          'A maturidade epistêmica exige testar argumentos contrários com evidências e revisar ideias racionalmente.',
      },
      it: {
        category: 'Domande · Pensiero Critico ed Epistemologia',
        prompt:
          'Qual è la base epistemologica per liberarsi da una mente a senso unico ed espandere la conoscenza affidabile?',
        clue: 'Anche non potendo sapere tutto, cercare il massimo possibile attraverso il confronto critico.',
        options: [
          'Accettare la prima affermazione senza mai dubitare',
          'Esaminare controargomenti, aggiornarsi con le prove e cercare la massima comprensione',
          'Leggere solo fonti che confermano le proprie convinzioni',
          'Interrompere la ricerca davanti a ogni incertezza',
        ],
        explanation:
          'La maturità epistemica richiede di mettere alla prova ipotesi rivali con le evidenze e restare aperti alla revisione.',
      },
      ko: {
        category: '질문과 답 · 비판적 사고와 인식론',
        prompt:
          '일방적인 사고에서 벗어나 신뢰할 수 있는 지식을 넓히기 위한 인식론적 토대는 무엇인가요?',
        clue: '모든 것을 알 수는 없더라도 다각적 검증으로 알 수 있는 최대한을 탐구하는 태도.',
        options: [
          '처음 들은 주장을 의심 없이 절대 진리로 수용하기',
          '반대 논거를 검토하고 증거로 갱신하며 알 수 있는 최대한을 탐구하기',
          '기존 신념을 확인해 주는 출처만 읽기',
          '불확실성이 보이면 모든 과학 탐구를 중단하기',
        ],
        explanation:
          '인식론적 성숙은 편향에서 벗어나 대립 가설을 증거로 검증하고 합리적으로 생각을 갱신하는 데 있습니다.',
      },
    },
  },
];

export interface ArenaUiStrings {
  sectionKicker: string;
  title: string;
  subtitle: string;
  scoringRuleLabel: string;
  correctPts: string;
  blankPts: string;
  wrongPts: string;
  modeAll: string;
  modeRiddles: string;
  modeQa: string;
  displayLangLabel: string;
  startBtn: string;
  playAgainBtn: string;
  clueBtn: string;
  skipBlankBtn: string;
  nextBtn: string;
  finishBtn: string;
  questionProgress: string;
  scoreLabel: string;
  correctLabel: string;
  blankLabel: string;
  wrongLabel: string;
  leaderboardTitle: string;
  leaderboardSubtitle: string;
  weekLabel: string;
  currentWeekLabel: string;
  rankCol: string;
  playerCol: string;
  scoreCol: string;
  breakdownCol: string;
  emptyLeaderboard: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  consentLabel: string;
  publishScoreBtn: string;
  publishedNotice: string;
  eraseMyEntryBtn: string;
  erasedNotice: string;
  openParticipationNote: string;
  mediumDifficultyLabel: string;
  soundOn: string;
  soundOff: string;
  riddleTag: string;
  qaTag: string;
  summaryTitle: string;
  privateOnlyNote: string;
}

export const ARENA_UI_STRINGS: Partial<Record<LanguageCode, ArenaUiStrings>> & { tr: ArenaUiStrings; en: ArenaUiStrings } = {
  tr: {
    sectionKicker: 'Etkileşimli Bilim & Felsefe Arenası · Herkese Açık',
    title: 'Bilmece-Bulmaca & Soru-Cevap Oyunu ve Haftalık İlk 5',
    subtitle:
      'Külliyattaki kuantum fiziği, kozmoloji, bilinç felsefesi, mantık ve robotik etiği temalarına dayalı orta zorlukta bilmece ve sorular. İsteyen herkes giriş yapmadan oynayabilir ve dilediği dilde görüntüleyebilir.',
    scoringRuleLabel: 'Puanlama Kuralı',
    correctPts: 'Doğru: +50',
    blankPts: 'Boş: +20',
    wrongPts: 'Yanlış: -20',
    modeAll: 'Karma Tur (12 Soru)',
    modeRiddles: 'Bilmece & Bulmacalar (6)',
    modeQa: 'Soru-Cevap Oyunu (6)',
    displayLangLabel: 'Soru & Cevap Dili',
    startBtn: 'Oyuna Başla',
    playAgainBtn: 'Yeni Tur Başlat',
    clueBtn: 'İpucu Göster',
    skipBlankBtn: 'Boş Bırak (+20 Puan)',
    nextBtn: 'Sonraki Soru →',
    finishBtn: 'Turu Tamamla & Puanı Gör',
    questionProgress: 'Soru',
    scoreLabel: 'Anlık Puan',
    correctLabel: 'Doğru',
    blankLabel: 'Boş',
    wrongLabel: 'Yanlış',
    leaderboardTitle: 'Haftalık İlk 5 Sıralaması',
    leaderboardSubtitle: 'Her hafta (Pazartesi–Pazar) en yüksek puanı alan ilk 5 katılımcı',
    weekLabel: 'Hafta Seçimi',
    currentWeekLabel: 'Bu Hafta',
    rankCol: 'Sıra',
    playerCol: 'Katılımcı (Takma Ad)',
    scoreCol: 'Puan',
    breakdownCol: 'D / B / Y',
    emptyLeaderboard: 'Bu hafta henüz puan kaydedilmedi. İlk sıraya yerleşen siz olun!',
    nicknameLabel: 'Haftalık Liste İçin Takma Ad (Gerçek isim veya e-posta girmeyiniz)',
    nicknamePlaceholder: 'Örn. KuantumGezgini',
    consentLabel:
      'KVKK (6698) & AB GDPR m.6(1)(a) kapsamında yalnızca seçtiğim takma adın ve oyun puanımın haftalık İlk 5 listesinde yayınlanmasına açık rıza veriyorum (istediğim an tek tıkla silebilirim).',
    publishScoreBtn: 'Haftalık Listeye Kaydet',
    publishedNotice: 'Puanınız sunucu doğrulamasıyla haftalık sıralamaya eklendi.',
    eraseMyEntryBtn: 'Kaydımı Listeden Sil (KVKK/GDPR)',
    erasedNotice: 'Kaydınız haftalık listeden kalıcı olarak silindi.',
    openParticipationNote: 'Üyelik gerekmez · Herkese açık · Sunucu doğrulamalı puanlama',
    mediumDifficultyLabel: 'Orta Zorluk',
    soundOn: 'Ses Açık',
    soundOff: 'Ses Kapalı',
    riddleTag: 'Bilmece-Bulmaca',
    qaTag: 'Soru-Cevap',
    summaryTitle: 'Tur Tamamlandı — Puan Özeti',
    privateOnlyNote: 'Listeye kaydetmeden de puanınızı gizlice görebilir ve tekrar oynayabilirsiniz.',
  },
  en: {
    sectionKicker: 'Interactive Science & Philosophy Arena · Open to Everyone',
    title: 'Riddles, Puzzles & Q&A Game + Weekly Top 5',
    subtitle:
      'Medium-difficulty riddles and Q&A aligned with quantum physics, cosmology, philosophy of mind, logic, and robotics ethics. Open to everyone with no login required, viewable in any of 12 languages.',
    scoringRuleLabel: 'Scoring Rules',
    correctPts: 'Correct: +50',
    blankPts: 'Blank: +20',
    wrongPts: 'Wrong: -20',
    modeAll: 'Mixed Round (12)',
    modeRiddles: 'Riddles & Puzzles (6)',
    modeQa: 'Q&A Challenge (6)',
    displayLangLabel: 'Question & Answer Language',
    startBtn: 'Start Game',
    playAgainBtn: 'Play Again',
    clueBtn: 'Show Clue',
    skipBlankBtn: 'Leave Blank (+20 pts)',
    nextBtn: 'Next Question →',
    finishBtn: 'Finish & See Score',
    questionProgress: 'Question',
    scoreLabel: 'Current Score',
    correctLabel: 'Correct',
    blankLabel: 'Blank',
    wrongLabel: 'Wrong',
    leaderboardTitle: 'Weekly Top 5 Leaderboard',
    leaderboardSubtitle: 'Top 5 highest-scoring participants each week (Mon–Sun)',
    weekLabel: 'Select Week',
    currentWeekLabel: 'Current Week',
    rankCol: 'Rank',
    playerCol: 'Participant (Alias)',
    scoreCol: 'Score',
    breakdownCol: 'C / B / W',
    emptyLeaderboard: 'No entries recorded for this week yet. Claim the #1 spot!',
    nicknameLabel: 'Pseudonymous Alias for Weekly List (Do not enter real name or email)',
    nicknamePlaceholder: 'e.g. QuantumWalker',
    consentLabel:
      'Under GDPR Art. 6(1)(a) & KVKK, I consent to publishing only my chosen alias and game score on the public weekly Top 5 list (erasable anytime with one click).',
    publishScoreBtn: 'Submit to Weekly List',
    publishedNotice: 'Your server-verified score has been recorded on the weekly leaderboard.',
    eraseMyEntryBtn: 'Erase My Entry (GDPR/KVKK)',
    erasedNotice: 'Your entry has been permanently erased from the weekly leaderboard.',
    openParticipationNote: 'No account needed · Open to all · Server-verified scoring',
    mediumDifficultyLabel: 'Medium Difficulty',
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
    riddleTag: 'Riddle / Puzzle',
    qaTag: 'Q&A',
    summaryTitle: 'Round Complete — Score Summary',
    privateOnlyNote: 'You can keep your score private and replay anytime without submitting to the public list.',
  },
  es: {
    sectionKicker: 'Arena Interactiva de Ciencia y Filosofía · Abierta a Todos',
    title: 'Acertijos, Rompecabezas y Preguntas + Top 5 Semanal',
    subtitle:
      'Acertijos y preguntas de dificultad media sobre física cuántica, cosmología, filosofía de la mente y ética robótica. Cualquiera puede jugar sin registro y en cualquiera de los 12 idiomas.',
    scoringRuleLabel: 'Puntuación',
    correctPts: 'Correcta: +50',
    blankPts: 'En blanco: +20',
    wrongPts: 'Incorrecta: -20',
    modeAll: 'Ronda Mixta (12)',
    modeRiddles: 'Acertijos (6)',
    modeQa: 'Preguntas y Respuestas (6)',
    displayLangLabel: 'Idioma de Preguntas',
    startBtn: 'Comenzar Juego',
    playAgainBtn: 'Jugar de Nuevo',
    clueBtn: 'Ver Pista',
    skipBlankBtn: 'Dejar en Blanco (+20)',
    nextBtn: 'Siguiente →',
    finishBtn: 'Finalizar y Ver Puntos',
    questionProgress: 'Pregunta',
    scoreLabel: 'Puntuación',
    correctLabel: 'Correctas',
    blankLabel: 'En blanco',
    wrongLabel: 'Incorrectas',
    leaderboardTitle: 'Top 5 Semanal',
    leaderboardSubtitle: 'Los 5 mejores participantes de cada semana (Lun–Dom)',
    weekLabel: 'Semana',
    currentWeekLabel: 'Semana Actual',
    rankCol: '#',
    playerCol: 'Participante (Alias)',
    scoreCol: 'Puntos',
    breakdownCol: 'C / B / I',
    emptyLeaderboard: 'Aún no hay puntuaciones esta semana. ¡Sé el primero!',
    nicknameLabel: 'Alias para la lista semanal (sin nombre real ni correo)',
    nicknamePlaceholder: 'Ej. ViajeroCuantico',
    consentLabel:
      'Conforme al RGPD y KVKK, consiento publicar únicamente mi alias y puntuación en el Top 5 semanal (eliminable en un clic).',
    publishScoreBtn: 'Publicar en Top 5',
    publishedNotice: 'Tu puntuación verificada se ha añadido a la clasificación semanal.',
    eraseMyEntryBtn: 'Eliminar Mi Registro (RGPD)',
    erasedNotice: 'Tu registro fue eliminado permanentemente.',
    openParticipationNote: 'Sin registro · Abierto a todos · Puntuación verificada',
    mediumDifficultyLabel: 'Dificultad Media',
    soundOn: 'Sonido Sí',
    soundOff: 'Sonido No',
    riddleTag: 'Acertijo',
    qaTag: 'Pregunta',
    summaryTitle: 'Ronda Completada — Resumen',
    privateOnlyNote: 'También puedes jugar de forma privada sin publicar tu puntuación.',
  },
  de: {
    sectionKicker: 'Interaktive Wissenschafts- & Philosophie-Arena · Für Alle Offen',
    title: 'Rätsel, Knobelaufgaben & Quiz + Wöchentliche Top 5',
    subtitle:
      'Mittelschwere Rätsel und Fragen zu Quantenphysik, Kosmologie, Bewusstsein und Robotik-Ethik. Ohne Anmeldung spielbar und in allen 12 Sprachen verfügbar.',
    scoringRuleLabel: 'Punktesystem',
    correctPts: 'Richtig: +50',
    blankPts: 'Leer: +20',
    wrongPts: 'Falsch: -20',
    modeAll: 'Gemischte Runde (12)',
    modeRiddles: 'Rätsel (6)',
    modeQa: 'Frage & Antwort (6)',
    displayLangLabel: 'Sprache der Fragen',
    startBtn: 'Spiel Starten',
    playAgainBtn: 'Erneut Spielen',
    clueBtn: 'Hinweis',
    skipBlankBtn: 'Überspringen (+20)',
    nextBtn: 'Weiter →',
    finishBtn: 'Abschließen',
    questionProgress: 'Frage',
    scoreLabel: 'Punkte',
    correctLabel: 'Richtig',
    blankLabel: 'Leer',
    wrongLabel: 'Falsch',
    leaderboardTitle: 'Wöchentliche Top 5',
    leaderboardSubtitle: 'Die 5 punktbesten Teilnehmenden jeder Woche (Mo–So)',
    weekLabel: 'Woche',
    currentWeekLabel: 'Aktuelle Woche',
    rankCol: 'Rang',
    playerCol: 'Alias',
    scoreCol: 'Punkte',
    breakdownCol: 'R / L / F',
    emptyLeaderboard: 'Diese Woche noch keine Einträge. Hol dir Platz 1!',
    nicknameLabel: 'Pseudonym für die Wochenliste (kein Klarname / keine E-Mail)',
    nicknamePlaceholder: 'z.B. QuantenDenker',
    consentLabel:
      'Gemäß DSGVO Art. 6(1)(a) & KVKK willige ich ein, nur mein Pseudonym und meinen Punktestand in den Top 5 anzuzeigen (jederzeit löschbar).',
    publishScoreBtn: 'In Top 5 Eintragen',
    publishedNotice: 'Dein servergeprüfter Punktestand wurde eingetragen.',
    eraseMyEntryBtn: 'Eintrag Löschen (DSGVO)',
    erasedNotice: 'Dein Eintrag wurde dauerhaft gelöscht.',
    openParticipationNote: 'Ohne Login · Für alle offen · Servergeprüft',
    mediumDifficultyLabel: 'Mittlere Schwierigkeit',
    soundOn: 'Ton An',
    soundOff: 'Ton Aus',
    riddleTag: 'Rätsel',
    qaTag: 'Quiz',
    summaryTitle: 'Runde Beendet — Auswertung',
    privateOnlyNote: 'Du kannst dein Ergebnis auch privat ansehen, ohne es zu veröffentlichen.',
  },
  fr: {
    sectionKicker: 'Arène Interactive Science & Philosophie · Ouverte à Tous',
    title: 'Énigmes, Casse-têtes & Quiz + Top 5 Hebdomadaire',
    subtitle:
      'Énigmes et questions de difficulté moyenne liées au corpus (quantique, cosmologie, conscience, logique). Jouable sans compte dans les 12 langues.',
    scoringRuleLabel: 'Barème',
    correctPts: 'Correct : +50',
    blankPts: 'Vide : +20',
    wrongPts: 'Erreur : -20',
    modeAll: 'Manche Mixte (12)',
    modeRiddles: 'Énigmes (6)',
    modeQa: 'Questions-Réponses (6)',
    displayLangLabel: 'Langue des Questions',
    startBtn: 'Démarrer',
    playAgainBtn: 'Rejouer',
    clueBtn: 'Indice',
    skipBlankBtn: 'Passer (+20 pts)',
    nextBtn: 'Suivant →',
    finishBtn: 'Terminer',
    questionProgress: 'Question',
    scoreLabel: 'Score',
    correctLabel: 'Correct',
    blankLabel: 'Vide',
    wrongLabel: 'Faux',
    leaderboardTitle: 'Top 5 Hebdomadaire',
    leaderboardSubtitle: 'Les 5 meilleurs scores de la semaine (Lun–Dim)',
    weekLabel: 'Semaine',
    currentWeekLabel: 'Semaine en Cours',
    rankCol: 'Rang',
    playerCol: 'Pseudonyme',
    scoreCol: 'Score',
    breakdownCol: 'C / V / F',
    emptyLeaderboard: 'Aucun score cette semaine. Prenez la 1re place !',
    nicknameLabel: 'Pseudonyme pour le classement (pas de vrai nom ni e-mail)',
    nicknamePlaceholder: 'Ex. EspritQuantique',
    consentLabel:
      'Conformément au RGPD et au KVKK, j’accepte de publier uniquement mon pseudonyme et mon score dans le Top 5 hebdomadaire (effaçable en un clic).',
    publishScoreBtn: 'Publier mon Score',
    publishedNotice: 'Votre score vérifié a été ajouté au classement hebdomadaire.',
    eraseMyEntryBtn: 'Effacer mon Entrée (RGPD)',
    erasedNotice: 'Votre entrée a été supprimée définitivement.',
    openParticipationNote: 'Sans inscription · Ouvert à tous · Score vérifié',
    mediumDifficultyLabel: 'Difficulté Moyenne',
    soundOn: 'Son Activé',
    soundOff: 'Son Coupé',
    riddleTag: 'Énigme',
    qaTag: 'Quiz',
    summaryTitle: 'Manche Terminée — Bilan',
    privateOnlyNote: 'Vous pouvez aussi jouer en privé sans publier votre score.',
  },
  ru: {
    sectionKicker: 'Интерактивная Арена Науки и Философии · Открыто для Всех',
    title: 'Загадки, Головоломки, Вопрос-Ответ и Топ-5 Недели',
    subtitle:
      'Загадки и вопросы средней сложности по темам квантовой физики, космологии, сознания и логики. Доступно каждому без регистрации на 12 языках.',
    scoringRuleLabel: 'Правила Очков',
    correctPts: 'Верно: +50',
    blankPts: 'Пропуск: +20',
    wrongPts: 'Ошибка: -20',
    modeAll: 'Смешанный тур (12)',
    modeRiddles: 'Загадки (6)',
    modeQa: 'Вопрос-Ответ (6)',
    displayLangLabel: 'Язык Вопросов',
    startBtn: 'Начать Игру',
    playAgainBtn: 'Сыграть Снова',
    clueBtn: 'Подсказка',
    skipBlankBtn: 'Оставить пустым (+20)',
    nextBtn: 'Далее →',
    finishBtn: 'Завершить',
    questionProgress: 'Вопрос',
    scoreLabel: 'Счёт',
    correctLabel: 'Верно',
    blankLabel: 'Пусто',
    wrongLabel: 'Ошибки',
    leaderboardTitle: 'Топ-5 Недели',
    leaderboardSubtitle: '5 лучших участников за каждую неделю (Пн–Вс)',
    weekLabel: 'Неделя',
    currentWeekLabel: 'Текущая Неделя',
    rankCol: '№',
    playerCol: 'Псевдоним',
    scoreCol: 'Очки',
    breakdownCol: 'В / П / О',
    emptyLeaderboard: 'На этой неделе пока нет записей. Станьте первым!',
    nicknameLabel: 'Псевдоним для рейтинга (без имени и email)',
    nicknamePlaceholder: 'Напр. КвантМысли',
    consentLabel:
      'Согласно GDPR и KVKK, даю согласие на публикацию только псевдонима и результата в недельном Топ-5 (удаляется в один клик).',
    publishScoreBtn: 'Сохранить в Топ-5',
    publishedNotice: 'Ваш проверенный результат добавлен в недельный рейтинг.',
    eraseMyEntryBtn: 'Удалить Запись (GDPR)',
    erasedNotice: 'Ваша запись безвозвратно удалена.',
    openParticipationNote: 'Без входа · Открыто всем · Проверка сервером',
    mediumDifficultyLabel: 'Средняя Сложность',
    soundOn: 'Звук Вкл',
    soundOff: 'Звук Выкл',
    riddleTag: 'Загадка',
    qaTag: 'Вопрос',
    summaryTitle: 'Тур Завершён — Итог',
    privateOnlyNote: 'Вы можете видеть результат приватно без публикации в списке.',
  },
  ar: {
    sectionKicker: 'ساحة العلوم والفلسفة التفاعلية · متاحة للجميع',
    title: 'الألغاز والأسئلة التفاعلية وقائمة أفضل 5 أسبوعياً',
    subtitle:
      'ألغاز وأسئلة متوسطة الصعوبة متوافقة مع محتوى الفيزياء الكمومية والكونيات والوعي والمنطق. متاحة للجميع بلا تسجيل وبأي من اللغات الـ12.',
    scoringRuleLabel: 'نظام النقاط',
    correctPts: 'صحيح: +50',
    blankPts: 'فارغ: +20',
    wrongPts: 'خطأ: -20',
    modeAll: 'جولة مختلطة (12)',
    modeRiddles: 'ألغاز وأحاجي (6)',
    modeQa: 'سؤال وجواب (6)',
    displayLangLabel: 'لغة الأسئلة والأجوبة',
    startBtn: 'ابدأ اللعب',
    playAgainBtn: 'العب مجدداً',
    clueBtn: 'إظهار تلميح',
    skipBlankBtn: 'تركه فارغاً (+20)',
    nextBtn: 'التالي ←',
    finishBtn: 'إنهاء وعرض النتيجة',
    questionProgress: 'السؤال',
    scoreLabel: 'النقاط',
    correctLabel: 'صحيح',
    blankLabel: 'فارغ',
    wrongLabel: 'خطأ',
    leaderboardTitle: 'أفضل 5 مشاركين أسبوعياً',
    leaderboardSubtitle: 'أعلى 5 درجات خلال الأسبوع (الاثنين–الأحد)',
    weekLabel: 'الأسبوع',
    currentWeekLabel: 'الأسبوع الحالي',
    rankCol: 'الترتيب',
    playerCol: 'الاسم المستعار',
    scoreCol: 'النقاط',
    breakdownCol: 'ص / ف / خ',
    emptyLeaderboard: 'لا توجد نتائج هذا الأسبوع بعد. كن الأول!',
    nicknameLabel: 'اسم مستعار للقائمة الأسبوعية (لا تُدخل اسماً حقيقياً أو بريداً)',
    nicknamePlaceholder: 'مثال: باحث_الكم',
    consentLabel:
      'وفقاً لـ GDPR وKVKK، أوافق على نشر اسمي المستعار ودرجتي فقط في قائمة أفضل 5 أسبوعياً (مع إمكانية الحذف الفوري).',
    publishScoreBtn: 'حفظ في القائمة الأسبوعية',
    publishedNotice: 'تمت إضافة نتيجتك الموثّقة إلى الترتيب الأسبوعي.',
    eraseMyEntryBtn: 'حذف سجلّي (GDPR/KVKK)',
    erasedNotice: 'تم حذف سجلّك نهائياً من القائمة.',
    openParticipationNote: 'دون تسجيل دخول · مفتوح للجميع · تحقق خادمي',
    mediumDifficultyLabel: 'صعوبة متوسطة',
    soundOn: 'الصوت مفعل',
    soundOff: 'الصوت صامت',
    riddleTag: 'لغز',
    qaTag: 'سؤال وجواب',
    summaryTitle: 'اكتملت الجولة — ملخص النقاط',
    privateOnlyNote: 'يمكنك اللعب بخصوصية دون نشر نتيجتك في القائمة العامة.',
  },
  zh: {
    sectionKicker: '互动科学与哲学竞技场 · 向所有人开放',
    title: '谜题益智与问答游戏 · 每周前5名榜单',
    subtitle:
      '紧扣量子物理、宇宙学、意识哲学与逻辑伦理的中等难度谜题与问答。无需登录即可参与，支持12种语言随时切换。',
    scoringRuleLabel: '计分规则',
    correctPts: '答对：+50',
    blankPts: '留空：+20',
    wrongPts: '答错：-20',
    modeAll: '综合挑战 (12题)',
    modeRiddles: '谜题益智 (6题)',
    modeQa: '知识问答 (6题)',
    displayLangLabel: '题目语言',
    startBtn: '开始游戏',
    playAgainBtn: '再玩一局',
    clueBtn: '查看提示',
    skipBlankBtn: '留空跳过 (+20分)',
    nextBtn: '下一题 →',
    finishBtn: '完成并查看得分',
    questionProgress: '题目',
    scoreLabel: '当前分数',
    correctLabel: '正确',
    blankLabel: '留空',
    wrongLabel: '错误',
    leaderboardTitle: '每周前5名排行榜',
    leaderboardSubtitle: '每周（周一至周日）得分最高的前5位参与者',
    weekLabel: '选择周次',
    currentWeekLabel: '本周',
    rankCol: '排名',
    playerCol: '参与者（昵称）',
    scoreCol: '分数',
    breakdownCol: '对/空/错',
    emptyLeaderboard: '本周尚无上榜记录，快来抢占第一名！',
    nicknameLabel: '上榜昵称（请勿填写真实姓名或邮箱）',
    nicknamePlaceholder: '例如：量子行者',
    consentLabel:
      '依据 GDPR 与 KVKK，我同意仅在每周前5名榜单公开我的昵称与得分（可随时一键删除）。',
    publishScoreBtn: '提交到每周榜单',
    publishedNotice: '经服务器验证的得分已加入每周排行榜。',
    eraseMyEntryBtn: '删除我的记录 (GDPR)',
    erasedNotice: '您的记录已永久删除。',
    openParticipationNote: '免登录 · 全员可玩 · 服务器验分',
    mediumDifficultyLabel: '中等难度',
    soundOn: '音效开',
    soundOff: '音效关',
    riddleTag: '谜题',
    qaTag: '问答',
    summaryTitle: '本轮完成 — 得分汇总',
    privateOnlyNote: '您也可以不提交榜单，仅私下查看成绩并继续挑战。',
  },
  ja: {
    sectionKicker: '対話型 科学・哲学アリーナ · 誰でも参加可能',
    title: '謎解きパズル＆Q&Aゲーム ＋ 週間トップ5',
    subtitle:
      '量子力学・宇宙論・意識哲学・論理学に連動した中難度の謎解き＆Q&A。ログイン不要で誰でも参加でき、12言語で表示できます。',
    scoringRuleLabel: '採点ルール',
    correctPts: '正解: +50',
    blankPts: '無回答: +20',
    wrongPts: '不正解: -20',
    modeAll: '総合ラウンド (12問)',
    modeRiddles: '謎解きパズル (6問)',
    modeQa: 'Q&Aクイズ (6問)',
    displayLangLabel: '表示言語',
    startBtn: 'ゲーム開始',
    playAgainBtn: 'もう一度遊ぶ',
    clueBtn: 'ヒントを見る',
    skipBlankBtn: '無回答で次へ (+20点)',
    nextBtn: '次の問題 →',
    finishBtn: '終了して結果を見る',
    questionProgress: '問題',
    scoreLabel: '現在スコア',
    correctLabel: '正解',
    blankLabel: '無回答',
    wrongLabel: '不正解',
    leaderboardTitle: '週間トップ5ランキング',
    leaderboardSubtitle: '毎週（月〜日）の上位5名を表示',
    weekLabel: '週を選択',
    currentWeekLabel: '今週',
    rankCol: '順位',
    playerCol: 'ニックネーム',
    scoreCol: 'スコア',
    breakdownCol: '正/空/誤',
    emptyLeaderboard: '今週はまだ記録がありません。1位を狙いましょう！',
    nicknameLabel: 'ランキング用ニックネーム（本名・メール不可）',
    nicknamePlaceholder: '例：量子旅人',
    consentLabel:
      'GDPRおよびKVKKに基づき、ニックネームとスコアのみを週間トップ5へ掲載することに同意します（いつでも削除可能）。',
    publishScoreBtn: '週間ランキングに登録',
    publishedNotice: 'サーバー検証済みスコアが週間ランキングに登録されました。',
    eraseMyEntryBtn: '登録を削除 (GDPR)',
    erasedNotice: '登録は完全に削除されました。',
    openParticipationNote: 'ログイン不要 · 誰でも参加可 · サーバー検証済',
    mediumDifficultyLabel: '中難度',
    soundOn: '効果音オン',
    soundOff: '効果音オフ',
    riddleTag: '謎解き',
    qaTag: 'Q&A',
    summaryTitle: 'ラウンド終了 — スコア集計',
    privateOnlyNote: 'ランキング登録せず結果だけ確認することもできます。',
  },
  pt: {
    sectionKicker: 'Arena Interativa de Ciência e Filosofia · Aberta a Todos',
    title: 'Enigmas, Quebra-Cabeças e Perguntas + Top 5 Semanal',
    subtitle:
      'Enigmas e perguntas de dificuldade média sobre física quântica, cosmologia, consciência e ética robótica. Sem login e em 12 idiomas.',
    scoringRuleLabel: 'Pontuação',
    correctPts: 'Correta: +50',
    blankPts: 'Em branco: +20',
    wrongPts: 'Errada: -20',
    modeAll: 'Rodada Mista (12)',
    modeRiddles: 'Enigmas (6)',
    modeQa: 'Perguntas e Respostas (6)',
    displayLangLabel: 'Idioma das Perguntas',
    startBtn: 'Iniciar Jogo',
    playAgainBtn: 'Jogar Novamente',
    clueBtn: 'Ver Dica',
    skipBlankBtn: 'Deixar em Branco (+20)',
    nextBtn: 'Próxima →',
    finishBtn: 'Finalizar',
    questionProgress: 'Questão',
    scoreLabel: 'Pontos',
    correctLabel: 'Corretas',
    blankLabel: 'Branco',
    wrongLabel: 'Erradas',
    leaderboardTitle: 'Top 5 Semanal',
    leaderboardSubtitle: 'Os 5 melhores participantes da semana (Seg–Dom)',
    weekLabel: 'Semana',
    currentWeekLabel: 'Semana Atual',
    rankCol: '#',
    playerCol: 'Apelido',
    scoreCol: 'Pontos',
    breakdownCol: 'C / B / E',
    emptyLeaderboard: 'Nenhuma pontuação esta semana ainda. Seja o #1!',
    nicknameLabel: 'Apelido para o ranking (não informe nome real nem e-mail)',
    nicknamePlaceholder: 'Ex. ViajanteQuantico',
    consentLabel:
      'Conforme GDPR e KVKK, autorizo publicar apenas meu apelido e pontuação no Top 5 semanal (removível em um clique).',
    publishScoreBtn: 'Salvar no Top 5',
    publishedNotice: 'Sua pontuação verificada foi registrada no ranking semanal.',
    eraseMyEntryBtn: 'Apagar Meu Registro (GDPR)',
    erasedNotice: 'Seu registro foi excluído permanentemente.',
    openParticipationNote: 'Sem cadastro · Aberto a todos · Verificado no servidor',
    mediumDifficultyLabel: 'Dificuldade Média',
    soundOn: 'Som Ligado',
    soundOff: 'Som Desligado',
    riddleTag: 'Enigma',
    qaTag: 'Pergunta',
    summaryTitle: 'Rodada Concluída — Resumo',
    privateOnlyNote: 'Você também pode jogar de forma privada sem enviar ao ranking.',
  },
  it: {
    sectionKicker: 'Arena Interattiva di Scienza e Filosofia · Aperta a Tutti',
    title: 'Indovinelli, Rompicapi e Quiz + Top 5 Settimanale',
    subtitle:
      'Indovinelli e domande di media difficoltà su fisica quantistica, cosmologia, coscienza e logica. Senza accesso obbligatorio, in tutte le 12 lingue.',
    scoringRuleLabel: 'Punteggio',
    correctPts: 'Corretta: +50',
    blankPts: 'In bianco: +20',
    wrongPts: 'Errata: -20',
    modeAll: 'Turno Misto (12)',
    modeRiddles: 'Indovinelli (6)',
    modeQa: 'Domande e Risposte (6)',
    displayLangLabel: 'Lingua delle Domande',
    startBtn: 'Inizia Gioco',
    playAgainBtn: 'Gioca Ancora',
    clueBtn: 'Suggerimento',
    skipBlankBtn: 'Lascia in Bianco (+20)',
    nextBtn: 'Successiva →',
    finishBtn: 'Termina',
    questionProgress: 'Domanda',
    scoreLabel: 'Punti',
    correctLabel: 'Corrette',
    blankLabel: 'Bianco',
    wrongLabel: 'Errate',
    leaderboardTitle: 'Top 5 Settimanale',
    leaderboardSubtitle: 'I migliori 5 partecipanti di ogni settimana (Lun–Dom)',
    weekLabel: 'Settimana',
    currentWeekLabel: 'Settimana Corrente',
    rankCol: '#',
    playerCol: 'Pseudonimo',
    scoreCol: 'Punti',
    breakdownCol: 'C / B / E',
    emptyLeaderboard: 'Nessun punteggio questa settimana. Conquista il 1° posto!',
    nicknameLabel: 'Pseudonimo per la classifica (nessun nome reale o email)',
    nicknamePlaceholder: 'Es. MenteQuantica',
    consentLabel:
      'Ai sensi del GDPR e KVKK, acconsento a pubblicare solo pseudonimo e punteggio nella Top 5 settimanale (cancellabile con un clic).',
    publishScoreBtn: 'Pubblica in Top 5',
    publishedNotice: 'Il tuo punteggio verificato è stato inserito in classifica.',
    eraseMyEntryBtn: 'Cancella Voce (GDPR)',
    erasedNotice: 'La tua voce è stata cancellata definitivamente.',
    openParticipationNote: 'Senza login · Aperto a tutti · Verifica server',
    mediumDifficultyLabel: 'Difficoltà Media',
    soundOn: 'Audio On',
    soundOff: 'Audio Off',
    riddleTag: 'Indovinello',
    qaTag: 'Quiz',
    summaryTitle: 'Turno Completato — Riepilogo',
    privateOnlyNote: 'Puoi anche consultare il punteggio privatamente senza pubblicarlo.',
  },
  ko: {
    sectionKicker: '인터랙티브 과학·철학 아레나 · 누구나 참여 가능',
    title: '수수께끼·퍼즐 & 문답 게임 · 주간 TOP 5',
    subtitle:
      '양자역학, 우주론, 의식 철학, 논리 및 로봇 윤리에 맞춘 중급 난이도의 수수께끼와 Q&A. 로그인 없이 누구나 12개 언어로 즐길 수 있습니다.',
    scoringRuleLabel: '채점 규칙',
    correctPts: '정답: +50',
    blankPts: '빈칸: +20',
    wrongPts: '오답: -20',
    modeAll: '종합 라운드 (12문항)',
    modeRiddles: '수수께끼·퍼즐 (6문항)',
    modeQa: '질문과 답 (6문항)',
    displayLangLabel: '문제 언어 선택',
    startBtn: '게임 시작',
    playAgainBtn: '다시 도전',
    clueBtn: '힌트 보기',
    skipBlankBtn: '빈칸으로 넘기기 (+20점)',
    nextBtn: '다음 문항 →',
    finishBtn: '완료 및 점수 보기',
    questionProgress: '문항',
    scoreLabel: '현재 점수',
    correctLabel: '정답',
    blankLabel: '빈칸',
    wrongLabel: '오답',
    leaderboardTitle: '주간 TOP 5 리더보드',
    leaderboardSubtitle: '매주(월~일) 최고 득점 상위 5명',
    weekLabel: '주차 선택',
    currentWeekLabel: '이번 주',
    rankCol: '순위',
    playerCol: '닉네임',
    scoreCol: '점수',
    breakdownCol: '정/빈/오',
    emptyLeaderboard: '이번 주 기록이 아직 없습니다. 1위에 도전해 보세요!',
    nicknameLabel: '주간 순위용 닉네임 (실명·이메일 입력 금지)',
    nicknamePlaceholder: '예: 양자탐험가',
    consentLabel:
      'GDPR 및 KVKK에 따라 선택한 닉네임과 게임 점수만 주간 TOP 5에 공개하는 데 동의합니다(언제든 즉시 삭제 가능).',
    publishScoreBtn: '주간 순위 등록',
    publishedNotice: '서버 검증 점수가 주간 리더보드에 등록되었습니다.',
    eraseMyEntryBtn: '내 기록 삭제 (GDPR)',
    erasedNotice: '기록이 영구적으로 삭제되었습니다.',
    openParticipationNote: '로그인 불필요 · 누구나 참여 · 서버 검증 채점',
    mediumDifficultyLabel: '중급 난이도',
    soundOn: '효과음 켬',
    soundOff: '효과음 끔',
    riddleTag: '수수께끼',
    qaTag: 'Q&A',
    summaryTitle: '라운드 완료 — 점수 요약',
    privateOnlyNote: '순위표에 등록하지 않고 비공개로 점수만 확인할 수도 있습니다.',
  },
};

export const ARENA_NAV_SHORTCUT_LABELS: Record<LanguageCode, string> = {
  tr: 'Bilmece & Arena',
  en: 'Riddles & Arena',
  es: 'Acertijos y Arena',
  de: 'Rätsel & Arena',
  fr: 'Énigmes & Arène',
  ru: 'Загадки и Арена',
  ar: 'ألغاز وساحة',
  zh: '谜题与竞技场',
  ja: '謎解きアリーナ',
  pt: 'Enigmas e Arena',
  it: 'Enigmi e Arena',
  ko: '수수께끼 아레나',
  no: 'Gåter & Arena',
  is: 'Gátur & Leikvangur',
  da: 'Gåder & Arena',
  sv: 'Gåtor & Arena',
  nl: 'Raadsels & Arena',
  fi: 'Arvoitukset & Areena',
  ga: 'Tomhas & Airéine',
  lb: 'Rätselen & Arena',
  rm: 'Indovinels & Arena',
  ms: 'Teka-teki & Arena',
  ta: 'புதிர் அரங்கம்',
};

export interface ArenaAuthStrings {
  openPracticeAuthBoardNote: string;
  signInRequiredTitle: string;
  signInRequiredDesc: string;
  signInToJoinTop5Btn: string;
  signedInCustomNameNote: string;
  customUsernameLabel: string;
  customUsernamePlaceholder: string;
  myStandingLabel: string;
  leaderboardVerifiedOnlyNote: string;
  keptBestScoreNotice: string;
}

export const ARENA_AUTH_STRINGS: Partial<Record<LanguageCode, ArenaAuthStrings>> & { tr: ArenaAuthStrings; en: ArenaAuthStrings } = {
  tr: {
    openPracticeAuthBoardNote: 'Herkes giriş yapmadan deneyebilir · Haftalık İlk 5 yalnızca giriş yapanların seçtiği kullanıcı adları içindir',
    signInRequiredTitle: 'Haftalık İlk 5’e Kendi Kullanıcı Adınızla Katılın',
    signInRequiredDesc:
      'Arenada herkes giriş yapmadan kendini özgürce deneyebilir. Puanınızı ve kendi belirleyeceğiniz kullanıcı adınızı Haftalık İlk 5 listesinde göstermek için Google ile giriş yapın (mevcut tur puanınız korunur).',
    signInToJoinTop5Btn: 'Google ile Giriş Yap & Kullanıcı Adı Seç',
    signedInCustomNameNote: 'Oturum açık — Listede görünmek için kendi belirleyeceğiniz kullanıcı adını girin (e-posta adresiniz asla kamuya açılmaz).',
    customUsernameLabel: 'Listede Görünecek Kullanıcı Adınız (2–24 karakter)',
    customUsernamePlaceholder: 'Örn. KuantumGezgini',
    myStandingLabel: 'Bu Haftaki Kaydınız',
    leaderboardVerifiedOnlyNote: 'İlk 5 listesinde yalnızca giriş yaparak oynayan kullanıcıların kendi belirledikleri kullanıcı adları yer alır.',
    keptBestScoreNotice: 'Kullanıcı adınız güncellendi; bu haftaki daha yüksek en iyi puanınız korundu.',
  },
  en: {
    openPracticeAuthBoardNote: 'Anyone can practice freely · Weekly Top 5 shows custom usernames of signed-in players only',
    signInRequiredTitle: 'Join the Weekly Top 5 with Your Custom Username',
    signInRequiredDesc:
      'Anyone can practice in the Arena without signing in. To publish your verified score and custom chosen username to the Weekly Top 5, sign in with Google (your current round score is preserved).',
    signInToJoinTop5Btn: 'Sign in with Google & Choose Username',
    signedInCustomNameNote: 'Signed in — Choose any custom username for the public Top 5 (your Google email is never shown publicly).',
    customUsernameLabel: 'Your Chosen Public Username (2–24 characters)',
    customUsernamePlaceholder: 'e.g. QuantumThinker',
    myStandingLabel: 'Your Current Weekly Entry',
    leaderboardVerifiedOnlyNote: 'Only signed-in players appear in the Weekly Top 5 with their own chosen usernames.',
    keptBestScoreNotice: 'Your custom username was updated while keeping your higher best score for this week.',
  },
  es: {
    openPracticeAuthBoardNote: 'Cualquiera puede practicar · El Top 5 semanal muestra solo nombres elegidos por usuarios autenticados',
    signInRequiredTitle: 'Únete al Top 5 Semanal con tu Nombre de Usuario',
    signInRequiredDesc:
      'Cualquiera puede probar la Arena sin iniciar sesión. Para publicar tu puntuación y tu nombre de usuario personalizado en el Top 5 semanal, inicia sesión con Google.',
    signInToJoinTop5Btn: 'Entrar con Google y Elegir Nombre',
    signedInCustomNameNote: 'Sesión iniciada — Elige tu propio nombre de usuario público (tu correo nunca se muestra).',
    customUsernameLabel: 'Tu Nombre de Usuario Elegido (2–24 caracteres)',
    customUsernamePlaceholder: 'Ej. ViajeroCuantico',
    myStandingLabel: 'Tu Registro de Esta Semana',
    leaderboardVerifiedOnlyNote: 'Solo los usuarios que inician sesión aparecen en el Top 5 semanal con su nombre elegido.',
    keptBestScoreNotice: 'Se actualizó tu nombre de usuario conservando tu mejor puntuación de la semana.',
  },
  de: {
    openPracticeAuthBoardNote: 'Jeder kann frei üben · Die Top 5 zeigen nur selbst gewählte Benutzernamen angemeldeter Spieler',
    signInRequiredTitle: 'Mit eigenem Benutzernamen in die wöchentlichen Top 5',
    signInRequiredDesc:
      'Jeder kann die Arena ohne Anmeldung ausprobieren. Um mit deinem selbst gewählten Benutzernamen in den wöchentlichen Top 5 zu erscheinen, melde dich mit Google an.',
    signInToJoinTop5Btn: 'Mit Google anmelden & Namen wählen',
    signedInCustomNameNote: 'Angemeldet — Wähle deinen eigenen öffentlichen Benutzernamen (deine E-Mail bleibt geheim).',
    customUsernameLabel: 'Dein gewählter Benutzername (2–24 Zeichen)',
    customUsernamePlaceholder: 'z.B. QuantenDenker',
    myStandingLabel: 'Dein aktueller Wocheneintrag',
    leaderboardVerifiedOnlyNote: 'In den Top 5 erscheinen ausschließlich angemeldete Nutzer mit ihrem selbst gewählten Benutzernamen.',
    keptBestScoreNotice: 'Dein Benutzername wurde aktualisiert; dein höherer Wochenrekord blieb erhalten.',
  },
  fr: {
    openPracticeAuthBoardNote: 'Essai libre pour tous · Le Top 5 affiche uniquement les pseudos des joueurs connectés',
    signInRequiredTitle: 'Rejoignez le Top 5 avec Votre Nom d’Utilisateur',
    signInRequiredDesc:
      'Chacun peut s’essayer librement dans l’Arène. Pour afficher votre score et le nom d’utilisateur de votre choix dans le Top 5 hebdomadaire, connectez-vous avec Google.',
    signInToJoinTop5Btn: 'Connexion Google & Choisir un Pseudo',
    signedInCustomNameNote: 'Connecté — Choisissez le nom d’utilisateur public de votre choix (votre e-mail n’est jamais affiché).',
    customUsernameLabel: 'Votre Nom d’Utilisateur Choisi (2–24 caractères)',
    customUsernamePlaceholder: 'Ex. EspritQuantique',
    myStandingLabel: 'Votre Entrée de la Semaine',
    leaderboardVerifiedOnlyNote: 'Seuls les joueurs connectés apparaissent dans le Top 5 avec le nom d’utilisateur qu’ils ont choisi.',
    keptBestScoreNotice: 'Votre nom d’utilisateur a été mis à jour tout en conservant votre meilleur score de la semaine.',
  },
  ru: {
    openPracticeAuthBoardNote: 'Тренировка открыта всем · В Топ-5 попадают только авторизованные игроки со своим ником',
    signInRequiredTitle: 'Войдите, чтобы попасть в Топ-5 со своим ником',
    signInRequiredDesc:
      'Каждый может свободно проверить себя на Арене. Чтобы ваш результат и выбранное имя пользователя отобразились в недельном Топ-5, войдите через Google.',
    signInToJoinTop5Btn: 'Войти через Google и выбрать ник',
    signedInCustomNameNote: 'Вы вошли — введите желаемое имя пользователя для рейтинга (email никогда не публикуется).',
    customUsernameLabel: 'Ваше имя пользователя (2–24 символа)',
    customUsernamePlaceholder: 'Напр. КвантМысли',
    myStandingLabel: 'Ваша запись на этой неделе',
    leaderboardVerifiedOnlyNote: 'В Топ-5 отображаются только вошедшие пользователи с выбранными ими именами.',
    keptBestScoreNotice: 'Имя пользователя обновлено; сохранён ваш более высокий результат недели.',
  },
  ar: {
    openPracticeAuthBoardNote: 'التجربة متاحة للجميع · تظهر في قائمة أفضل 5 أسماء المستخدمين المختارة للمسجلين فقط',
    signInRequiredTitle: 'انضم لقائمة أفضل 5 باسم المستخدم الذي تختاره',
    signInRequiredDesc:
      'يمكن للجميع تجربة الساحة بحرية دون تسجيل. لعرض نتيجتك واسم المستخدم الذي تختاره في قائمة أفضل 5 أسبوعياً، سجّل الدخول عبر Google.',
    signInToJoinTop5Btn: 'الدخول عبر Google واختيار اسم مستخدم',
    signedInCustomNameNote: 'تم تسجيل الدخول — اختر اسم المستخدم العام الذي تريده (لا يُعرض بريدك أبداً).',
    customUsernameLabel: 'اسم المستخدم الذي تختاره (2–24 حرفاً)',
    customUsernamePlaceholder: 'مثال: باحث_الكم',
    myStandingLabel: 'ترتيبك هذا الأسبوع',
    leaderboardVerifiedOnlyNote: 'تضم قائمة أفضل 5 فقط المستخدمين المسجلين بأسماء المستخدمين التي يختارونها بأنفسهم.',
    keptBestScoreNotice: 'تم تحديث اسم المستخدم مع الاحتفاظ بأعلى درجة حققتها هذا الأسبوع.',
  },
  zh: {
    openPracticeAuthBoardNote: '所有人均可免登录体验 · 每周前5名仅展示已登录玩家自选的用户名',
    signInRequiredTitle: '登录并以自选用户名登上每周前5名',
    signInRequiredDesc:
      '任何人都无需登录即可在竞技场自由挑战。如需将您的分数与自选用户名展示在每周前5名榜单中，请使用 Google 登录（当前回合得分将保留）。',
    signInToJoinTop5Btn: '使用 Google 登录并设置用户名',
    signedInCustomNameNote: '已登录 — 请设置要在榜单显示的自选用户名（绝不公开邮箱）。',
    customUsernameLabel: '您的自选公开用户名（2–24个字符）',
    customUsernamePlaceholder: '例如：量子行者',
    myStandingLabel: '您本周的记录',
    leaderboardVerifiedOnlyNote: '每周前5名仅显示已登录玩家自行设定的用户名。',
    keptBestScoreNotice: '用户名已更新，同时保留了您本周更高的最佳得分。',
  },
  ja: {
    openPracticeAuthBoardNote: '誰でも自由に挑戦可能 · 週間トップ5はログイン済みプレイヤーの希望ユーザー名のみ表示',
    signInRequiredTitle: 'ログインして希望ユーザー名で週間トップ5へ',
    signInRequiredDesc:
      '誰でもログイン不要でアリーナを試せます。スコアとご自身で決めたユーザー名を週間トップ5に掲載するには Google でログインしてください。',
    signInToJoinTop5Btn: 'Googleでログインしてユーザー名を設定',
    signedInCustomNameNote: 'ログイン済み — トップ5に表示する希望ユーザー名を入力してください（メールは非公開）。',
    customUsernameLabel: '表示するユーザー名（2〜24文字）',
    customUsernamePlaceholder: '例：量子旅人',
    myStandingLabel: '今週のあなたの記録',
    leaderboardVerifiedOnlyNote: '週間トップ5にはログイン済みユーザーが自ら設定したユーザー名のみが表示されます。',
    keptBestScoreNotice: 'ユーザー名を更新し、今週のより高いベストスコアを維持しました。',
  },
  pt: {
    openPracticeAuthBoardNote: 'Todos podem praticar livremente · O Top 5 exibe apenas nomes escolhidos por usuários autenticados',
    signInRequiredTitle: 'Entre no Top 5 Semanal com Seu Nome de Usuário',
    signInRequiredDesc:
      'Qualquer pessoa pode praticar na Arena sem entrar. Para exibir sua pontuação e o nome de usuário escolhido por você no Top 5 semanal, entre com o Google.',
    signInToJoinTop5Btn: 'Entrar com Google e Escolher Nome',
    signedInCustomNameNote: 'Conectado — Escolha o nome de usuário público que preferir (seu e-mail nunca é exibido).',
    customUsernameLabel: 'Seu Nome de Usuário Escolhido (2–24 caracteres)',
    customUsernamePlaceholder: 'Ex. ViajanteQuantico',
    myStandingLabel: 'Seu Registro desta Semana',
    leaderboardVerifiedOnlyNote: 'Apenas usuários autenticados aparecem no Top 5 semanal com o nome de usuário escolhido por eles.',
    keptBestScoreNotice: 'Seu nome de usuário foi atualizado mantendo sua maior pontuação desta semana.',
  },
  it: {
    openPracticeAuthBoardNote: 'Prova libera per tutti · La Top 5 mostra solo i nomi utente scelti dagli utenti autenticati',
    signInRequiredTitle: 'Entra nella Top 5 Settimanale con il Tuo Nome Utente',
    signInRequiredDesc:
      'Chiunque può mettersi alla prova nell’Arena senza accedere. Per mostrare il tuo punteggio e il nome utente scelto da te nella Top 5 settimanale, accedi con Google.',
    signInToJoinTop5Btn: 'Accedi con Google e Scegli Nome',
    signedInCustomNameNote: 'Accesso effettuato — Scegli il nome utente pubblico che preferisci (la tua email resta privata).',
    customUsernameLabel: 'Il Tuo Nome Utente Scelto (2–24 caratteri)',
    customUsernamePlaceholder: 'Es. MenteQuantica',
    myStandingLabel: 'La Tua Posizione Settimanale',
    leaderboardVerifiedOnlyNote: 'Nella Top 5 compaiono solo gli utenti che giocano dopo l’accesso con il nome utente scelto da loro.',
    keptBestScoreNotice: 'Nome utente aggiornato mantenendo il tuo miglior punteggio della settimana.',
  },
  ko: {
    openPracticeAuthBoardNote: '누구나 로그인 없이 체험 가능 · 주간 TOP 5에는 로그인 사용자가 직접 정한 닉네임만 표시',
    signInRequiredTitle: '로그인하고 직접 정한 사용자명으로 주간 TOP 5 도전',
    signInRequiredDesc:
      '누구나 로그인 없이 아레나에서 자유롭게 도전할 수 있습니다. 점수와 직접 지정한 사용자명을 주간 TOP 5에 등록하려면 Google로 로그인하세요.',
    signInToJoinTop5Btn: 'Google 로그인 및 사용자명 설정',
    signedInCustomNameNote: '로그인됨 — 순위표에 표시할 사용자명을 직접 입력하세요(이메일은 절대 공개되지 않습니다).',
    customUsernameLabel: '표시할 사용자명 (2–24자)',
    customUsernamePlaceholder: '예: 양자탐험가',
    myStandingLabel: '이번 주 내 기록',
    leaderboardVerifiedOnlyNote: '주간 TOP 5에는 로그인 후 참여한 사용자가 직접 지정한 사용자명만 표시됩니다.',
    keptBestScoreNotice: '사용자명이 업데이트되었으며 이번 주 최고 점수가 유지되었습니다.',
  },
};

