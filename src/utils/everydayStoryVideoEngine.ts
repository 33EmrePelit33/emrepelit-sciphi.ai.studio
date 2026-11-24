import { LanguageCode, SimulationType } from '../types';

/**
 * Everyday-Life Narrative Plot & Symbolic Illustrated Figure Engine
 *
 * Strictly KVKK (6698) & EU GDPR (2016/679) compliant:
 * - Zero real-person photographs, portraits, or biometric likenesses.
 * - All human characters are purely stylized geometric/editorial symbolic illustrations.
 * - Every article receives a cohesive 8-chapter everyday-life story plot featuring
 *   recognizable daily objects (teacup, pocket watch, desk lamp, window blinds,
 *   mirror, open notebook, brass balance scale, glass jar, folded postcard, paper
 *   boats, pendulum clock, kitchen fruit bowl, train window) tied to the article's theme.
 */

export interface EverydayStoryAct {
  actIndex: number;
  settingLabel: string;
  everydayObjects: string[];
  storyBeat: string;
  narrationCue: string;
  characterPose: 'observing' | 'measuring' | 'pointing' | 'reflecting' | 'discovering' | 'concluding';
}

export interface EverydayStoryProfile {
  theme: SimulationType;
  storyTitle: string;
  objectsSummary: string;
  symbolicFigureNotice: string;
  acts: EverydayStoryAct[];
}

const SYMBOLIC_NOTICE_12_LANGS: Record<LanguageCode, string> = {
  tr: 'Olay Kurgulu Günlük Hayat Anlatımı · Temsili Çizim İnsan Figürleri (Gerçek Kişi Fotoğrafı/Biyometrik Veri Yok · KVKK 6698 & GDPR 2016/679 Uyumlu)',
  en: 'Everyday-Life Story Plot · Strictly Symbolic Illustrated Figures (Zero Real-Person Photos/Biometrics · KVKK 6698 & EU GDPR 2016/679 Compliant)',
  es: 'Trama Cotidiana · Figuras Humanas Simbólicas Ilustradas (Sin Personas Reales · Cumple KVKK y GDPR)',
  de: 'Alltagsgeschichte · Rein Symbolische Figuren-Illustrationen (Keine Echten Personen · KVKK- & DSGVO-konform)',
  fr: 'Scénario du Quotidien · Figures Humaines Symboliques Illustrées (Aucune Personne Réelle · Conforme KVKK & RGPD)',
  ru: 'Повседневный сюжет · Символические рисованные фигуры (Без реальных людей · Соответствует KVKK и GDPR)',
  ar: 'حبكة من الحياة اليومية · شخصيات رمزية مرسومة فقط (بدون أشخاص حقيقيين · متوافق مع KVKK وGDPR)',
  zh: '日常生活故事情节 · 纯象征性插画人物（不含真实人物影像 · 符合 KVKK 与 GDPR）',
  ja: '日常の物語構成 · 象徴的イラスト人物のみ（実在人物の写真なし · KVKK・GDPR準拠）',
  pt: 'Enredo do Cotidiano · Figuras Humanas Simbólicas Ilustradas (Sem Pessoas Reais · Conforme KVKK e GDPR)',
  it: 'Trama di Vita Quotidiana · Figure Umane Simboliche Illustrate (Nessuna Persona Reale · Conforme KVKK e GDPR)',
  ko: '일상 스토리 전개 · 상징적 일러스트 인물만 사용 (실제 인물 사진 없음 · KVKK 및 GDPR 준수)',
  no: 'Hverdagshistorie · Kun symbolske illustrerte figurer (Ingen ekte personbilder · KVKK & GDPR)',
  is: 'Hversdagssaga · Aðeins táknrænar teiknaðar fígúrur (Engar myndir af raunverulegu fólki · KVKK & GDPR)',
  da: 'Hverdagshistorie · Kun symbolske illustrerede figurer (Ingen ægte personfotos · KVKK & GDPR)',
  sv: 'Vardagsberättelse · Endast symboliska illustrerade figurer (Inga riktiga personfoton · KVKK & GDPR)',
  nl: 'Alledaags verhaal · Uitsluitend symbolische geïllustreerde figuren (Geen echte persoonsfoto’s · KVKK & AVG)',
  fi: 'Arjen tarina · Vain symboliset piirroshahmot (Ei oikeiden henkilöiden kuvia · KVKK & GDPR)',
  ga: 'Scéal Laethúil · Fíoracha Siombalacha Léirithe Amháin (Gan Grianghraif Fíordhaoine · KVKK & GDPR)',
  lb: 'Alldagsgeschicht · Nëmme symbolesch illustréiert Figuren (Keng Fotoe vu richtege Leit · KVKK & GDPR)',
  rm: 'Istorgia dal mintgadi · Mo figuras simbolicas illustradas (Naginas fotografias da persunas realas · KVKK & GDPR)',
  ms: 'Jalan Cerita Harian · Hanya Figura Ilustrasi Simbolik (Tiada Foto Individu Sebenar · Patuh KVKK & GDPR)',
  ta: 'அன்றாட வாழ்க்கைக் கதை · குறியீட்டு ஓவிய உருவங்கள் மட்டுமே (உண்மையான நபர் புகைப்படங்கள் இல்லை · KVKK & GDPR)',
};

export function getSymbolicFigureKvkkNotice(lang: LanguageCode): string {
  return SYMBOLIC_NOTICE_12_LANGS[lang] || SYMBOLIC_NOTICE_12_LANGS.en;
}

export interface HistoricalScientistPerspective {
  /** Symbolic monogram initials only — strictly zero real-person photographs */
  monogram: string;
  name: string;
  era: string;
  accentColor: string;
  coreThought: string;
  bridgeToArticle: string;
}

export interface HistoricalScientistsPack {
  sectionTitle: string;
  narrationIntro: string;
  thinkers: [HistoricalScientistPerspective, HistoricalScientistPerspective, HistoricalScientistPerspective];
}

const HISTORICAL_SCIENTISTS_TR: Record<SimulationType, HistoricalScientistsPack> = {
  quantum: {
    sectionTitle: 'Önceki Bilim İnsanları Bu Konuda Ne Düşündü?',
    narrationIntro: 'Bu konuyu daha berrak kavramak için önceki bilim insanlarının ne düşündüğüne bakalım:',
    thinkers: [
      {
        monogram: 'NB',
        name: 'Niels Bohr',
        era: '1885–1962',
        accentColor: '#38BDF8',
        coreThought: 'Kuantum sistemlerinin ölçüm aygıtından bağımsız tek bir klasik durumu olmadığını, tamamlayıcılık ilkesiyle hem dalga hem parçacık yönünün bağlama göre ortaya çıktığını savundu.',
        bridgeToArticle: 'Makale, gözlemci ve ölçüm bağlamının olasılık desenini nasıl şekillendirdiğini bu miras üzerinden derinleştirir.',
      },
      {
        monogram: 'AE',
        name: 'Albert Einstein',
        era: '1879–1955',
        accentColor: '#FBBF24',
        coreThought: 'Kuantum mekaniğinin eksik olabileceğini düşünerek “yerel gerçekçilik” ilkesini savundu ve uzaktan anlık etkileşimi sorgulayan EPR düşünce deneyini ortaya attı.',
        bridgeToArticle: 'Makaledeki nedensellik ve gerçeklik sorgulaması, Bohr ile Einstein arasındaki bu tarihi tartışmayı yeni kuramsal araçlarla inceler.',
      },
      {
        monogram: 'JB',
        name: 'John Stewart Bell',
        era: '1928–1990',
        accentColor: '#34D399',
        coreThought: 'Yerel gizli değişken kuramlarının deneyle test edilebileceğini gösteren Bell eşitsizliklerini türetti; sonraki deneyler kuantum dolanıklığını doğruladı.',
        bridgeToArticle: 'Çalışma, ölçülebilir korelasyonlar ve dekoherans sınırları üzerinden yerel-olmayan kuantum bağlantıları somutlaştırır.',
      },
    ],
  },
  spacetime: {
    sectionTitle: 'Önceki Bilim İnsanları Bu Konuda Ne Düşündü?',
    narrationIntro: 'Zaman ve uzay kavramının nasıl evrildiğini görmek için önceki bilim insanlarının görüşlerine bakalım:',
    thinkers: [
      {
        monogram: 'IN',
        name: 'Isaac Newton',
        era: '1643–1727',
        accentColor: '#F59E0B',
        coreThought: 'Uzayı ve zamanı evrendeki tüm gözlemciler için aynı hızda akan, değişmez ve mutlak bir arka plan sahnesi olarak tanımladı.',
        bridgeToArticle: 'Makale, günlük sezgiye yakın bu mutlak saat fikrinin yüksek hız ve kütleçekimde neden kırıldığını karşılaştırmalı gösterir.',
      },
      {
        monogram: 'HM',
        name: 'Hermann Minkowski & Albert Einstein',
        era: '1864–1955',
        accentColor: '#38BDF8',
        coreThought: 'Uzay ile zamanı dört boyutlu tek bir uzay-zaman dokusunda birleştirdiler; kütle-enerjinin bu geometriyi büktüğünü ve hareketli saatlerin farklı aktığını gösterdiler.',
        bridgeToArticle: 'Makaledeki öz-zaman, ışık konisi ve metrik eğrilik analizi doğrudan bu göreli geometri üzerine kuruludur.',
      },
      {
        monogram: 'SH',
        name: 'Stephen Hawking',
        era: '1942–2018',
        accentColor: '#A78BFA',
        coreThought: 'Olay ufukları, zaman oku ve kara delik termodinamiği üzerinden genel görelilik ile kuantum mekaniğinin kesişim sınırlarını araştırdı.',
        bridgeToArticle: 'Çalışma, zamanın yönü ve kozmolojik nedensellik sınırlarını bu çağdaş ufukla birleştirir.',
      },
    ],
  },
  consciousness: {
    sectionTitle: 'Önceki Bilim İnsanları & Düşünürler Ne Düşündü?',
    narrationIntro: 'Zihin, bilinç ve hesaplama sorusunu daha iyi anlamak için önceki düşünür ve bilim insanlarının yaklaşımlarına bakalım:',
    thinkers: [
      {
        monogram: 'RD',
        name: 'René Descartes',
        era: '1596–1650',
        accentColor: '#F59E0B',
        coreThought: 'Düşünen özne ile maddesel beden arasında keskin bir ayrım (düalizm) önererek öznel farkındalığın yalnızca mekanik saat düzenine indirgenemeyeceğini ileri sürdü.',
        bridgeToArticle: 'Makale, modern fizik ve enformasyon kuramı ışığında bu zihin-madde ayrımını yeniden yorumlar.',
      },
      {
        monogram: 'AT',
        name: 'Alan Turing',
        era: '1912–1954',
        accentColor: '#38BDF8',
        coreThought: '“Makineler düşünebilir mi?” sorusunu hesaplanabilirlik ve taklit oyunu (Turing testi) üzerinden bilimsel bir çerçeveye taşıdı.',
        bridgeToArticle: 'Çalışma, algoritmik sembol işleme ile bilinçli anlamlandırma arasındaki yapısal farkı netleştirir.',
      },
      {
        monogram: 'GT',
        name: 'Giulio Tononi & Roger Penrose',
        era: 'Çağdaş',
        accentColor: '#34D399',
        coreThought: 'Tononi bilinci bütünleşik enformasyon (Φ) ile ölçmeye çalışırken, Penrose insan kavrayışının salt algoritmik kuralları aşan fiziksel bir boyutu olabileceğini tartıştı.',
        bridgeToArticle: 'Makale, nedensel bütünleşme ve öznel deneyim (qualia) ilişkisini açık ve sınanabilir bir senteze taşır.',
      },
    ],
  },
  higgs: {
    sectionTitle: 'Önceki Bilim İnsanları Bu Konuda Ne Düşündü?',
    narrationIntro: 'Kütle ve simetri kırılımı fikrinin tarihsel gelişimini görmek için önceki fizikçilerin ne düşündüğüne bakalım:',
    thinkers: [
      {
        monogram: 'EN',
        name: 'Emmy Noether',
        era: '1882–1935',
        accentColor: '#F59E0B',
        coreThought: 'Fizik yasalarındaki her sürekli simetrinin bir korunum yasasına karşılık geldiğini kanıtlayarak modern alan kuramının matematiksel temelini attı.',
        bridgeToArticle: 'Makaledeki ayar simetrisi ve korunum analizi Noether’in bu evrensel teoremine dayanır.',
      },
      {
        monogram: 'PA',
        name: 'Yoichiro Nambu & Philip Anderson',
        era: '1921–2020',
        accentColor: '#38BDF8',
        coreThought: 'Süperiletkenlikten esinlenerek temel yasalar simetrik kalsa bile sistemin taban durumunun simetriyi kendiliğinden kırabileceğini gösterdiler.',
        bridgeToArticle: 'Makale, bu kendiliğinden simetri kırılımı fikrini evrensel vakum potansiyeline bağlar.',
      },
      {
        monogram: 'PH',
        name: 'Peter Higgs, François Englert & Robert Brout',
        era: '1929–2024',
        accentColor: '#34D399',
        coreThought: 'Tüm uzayı dolduran skaler bir alanla etkileşen temel parçacıkların kütle kazanacağını öngördüler; 2012 CERN keşfi bu mekanizmayı doğruladı.',
        bridgeToArticle: 'Çalışma, kütlenin içkin bir ağırlık değil alanla kurulan etkileşim sonucu olduğunu anlaşılır kılar.',
      },
    ],
  },
  holographic: {
    sectionTitle: 'Önceki Bilim İnsanları Bu Konuda Ne Düşündü?',
    narrationIntro: 'Bilgi, entropi ve holografik gerçeklik fikrinin köklerini anlamak için önceki bilim insanlarının görüşlerine bakalım:',
    thinkers: [
      {
        monogram: 'JB',
        name: 'Jacob Bekenstein & Stephen Hawking',
        era: '1947–2018',
        accentColor: '#F59E0B',
        coreThought: 'Bir kara deliğin entropisinin hacmiyle değil olay ufkunun yüzey alanıyla orantılı olduğunu bularak bilginin yüzeyde kodlandığına dair ilk büyük ipucunu verdiler.',
        bridgeToArticle: 'Makaledeki alan-yasası ve enformasyon sınırı doğrudan bu temel keşiften doğar.',
      },
      {
        monogram: 'GH',
        name: 'Gerard ’t Hooft & Leonard Susskind',
        era: 'Çağdaş',
        accentColor: '#38BDF8',
        coreThought: 'Üç boyutlu bir uzay hacminde gerçekleşen tüm fiziksel süreçlerin, onu çevreleyen iki boyutlu bir sınır yüzeyinde eksiksiz tanımlanabileceğini (Holografik İlke) öne sürdüler.',
        bridgeToArticle: 'Makale, sınır ile hacim arasındaki bilgi denkliğini gündelik analojilerle görünür kılar.',
      },
      {
        monogram: 'JM',
        name: 'Juan Maldacena',
        era: 'Çağdaş',
        accentColor: '#34D399',
        coreThought: 'AdS/CFT eşlenikliğini formüle ederek hacim içi kütleçekim kuramı ile sınır düzeyindeki kuantum alan kuramı arasında kesin bir matematiksel sözlük kurdu.',
        bridgeToArticle: 'Çalışma, uzay-zaman geometrisinin kuantum dolanıklık ve enformasyondan nasıl doğabileceğini irdeler.',
      },
    ],
  },
  chaos: {
    sectionTitle: 'Önceki Bilim İnsanları Bu Konuda Ne Düşündü?',
    narrationIntro: 'Determinizm ve öngörülemezlik ilişkisini daha iyi kavramak için önceki bilim insanlarının düşüncelerine bakalım:',
    thinkers: [
      {
        monogram: 'PL',
        name: 'Pierre-Simon Laplace',
        era: '1749–1827',
        accentColor: '#F59E0B',
        coreThought: 'Evrendeki tüm parçacıkların anlık konumu ve hızı bilinseydi, geleceğin ve geçmişin kesin biçimde hesaplanabileceğini (Laplace’ın Cini) savundu.',
        bridgeToArticle: 'Makale, bu klasik mutlak öngörü hayalinin doğrusal olmayan sistemlerde nasıl sınırlandığını gösterir.',
      },
      {
        monogram: 'HP',
        name: 'Henri Poincaré',
        era: '1854–1912',
        accentColor: '#38BDF8',
        coreThought: 'Üç cisim problemini incelerken başlangıç koşullarındaki küçücük bir belirsizliğin zamanla devasa yörünge ayrışmalarına yol açtığını ilk kez keşfetti.',
        bridgeToArticle: 'Makaledeki faz uzayı kıvrımları ve hassas bağlılık Poincaré’nin bu öncü sezgisine dayanır.',
      },
      {
        monogram: 'EL',
        name: 'Edward Lorenz',
        era: '1917–2008',
        accentColor: '#34D399',
        coreThought: 'Atmosfer modellerinde ondalık yuvarlama farkının hava tahminini tamamen değiştirdiğini keşfederek “Kelebek Etkisi” ve garip çeker kavramlarını bilime kazandırdı.',
        bridgeToArticle: 'Çalışma, katı kuralların rastgelelik olmadan nasıl yaratıcı ve açık bir gelecek ürettiğini somutlaştırır.',
      },
    ],
  },
  software: {
    sectionTitle: 'Önceki Bilim İnsanları Bu Konuda Ne Düşündü?',
    narrationIntro: 'Akıllı yazılım, enformasyon ve karar sistemlerinin kökenini anlamak için önceki öncülerin ne düşündüğüne bakalım:',
    thinkers: [
      {
        monogram: 'AT',
        name: 'Alan Turing',
        era: '1912–1954',
        accentColor: '#F59E0B',
        coreThought: 'Evrensel hesaplama makinesi kavramıyla her mantıksal sürecin açık, doğrulanabilir algoritmik adımlarla modellenebileceğini gösterdi.',
        bridgeToArticle: 'Makaledeki modüler işlem hattı ve doğrulanabilir algoritma yaklaşımı Turing’in temel ilkesine dayanır.',
      },
      {
        monogram: 'CS',
        name: 'Claude Shannon',
        era: '1916–2001',
        accentColor: '#38BDF8',
        coreThought: 'Enformasyon kuramını kurarak verinin gürültüden ayrıştırılması, bit düzeyinde ölçülmesi ve güvenilir biçimde iletilmesi için matematiksel yasalar geliştirdi.',
        bridgeToArticle: 'Çalışma, ham gürültülü veriden güvenilir karar çıktısı üretme adımlarını Shannon’ın bilgi ilkeleriyle ilişkilendirir.',
      },
      {
        monogram: 'NW',
        name: 'Norbert Wiener',
        era: '1894–1964',
        accentColor: '#34D399',
        coreThought: 'Sibernetik alanında geri bildirim döngülerinin hem biyolojik hem dijital sistemlerde denge, uyum ve insan yararına rehberlik sağladığını ortaya koydu.',
        bridgeToArticle: 'Makale, insan merkezli geri bildirim ve günlük yaşam dengesini bu sibernetik temel üzerine inşa eder.',
      },
    ],
  },
};

const HISTORICAL_SCIENTISTS_EN: Record<SimulationType, HistoricalScientistsPack> = {
  quantum: {
    sectionTitle: 'What Previous Scientists Thought About This Topic',
    narrationIntro: 'To make this topic even clearer, let us see what earlier scientists thought about it:',
    thinkers: [
      {
        monogram: 'NB',
        name: 'Niels Bohr',
        era: '1885–1962',
        accentColor: '#38BDF8',
        coreThought: 'Argued through complementarity that quantum systems hold no fixed classical path prior to measurement—wave and particle traits emerge relative to the experimental setup.',
        bridgeToArticle: 'This essay builds on Bohr’s insight to clarify how observation reshapes probability patterns.',
      },
      {
        monogram: 'AE',
        name: 'Albert Einstein',
        era: '1879–1955',
        accentColor: '#FBBF24',
        coreThought: 'Defended local realism and formulated the EPR paradox, questioning whether quantum mechanics was incomplete and doubting instantaneous action at a distance.',
        bridgeToArticle: 'The article revisits the historic Bohr–Einstein debate through modern causality and information lenses.',
      },
      {
        monogram: 'JB',
        name: 'John Stewart Bell',
        era: '1928–1990',
        accentColor: '#34D399',
        coreThought: 'Proved with Bell’s inequalities that local hidden variables could be tested experimentally—subsequent experiments confirmed genuine quantum entanglement.',
        bridgeToArticle: 'The study connects testable correlations and decoherence thresholds directly to Bell’s breakthrough.',
      },
    ],
  },
  spacetime: {
    sectionTitle: 'What Previous Scientists Thought About This Topic',
    narrationIntro: 'To clarify how our view of space and time evolved, let us hear what earlier scientists thought:',
    thinkers: [
      {
        monogram: 'IN',
        name: 'Isaac Newton',
        era: '1643–1727',
        accentColor: '#F59E0B',
        coreThought: 'Treated space and time as an absolute, universal stage ticking identically for every observer everywhere in the cosmos.',
        bridgeToArticle: 'The article contrasts this intuitive classical clock against relativistic motion and gravity.',
      },
      {
        monogram: 'HM',
        name: 'Hermann Minkowski & Albert Einstein',
        era: '1864–1955',
        accentColor: '#38BDF8',
        coreThought: 'Unified space and time into a four-dimensional curved spacetime fabric where mass bends trajectories and moving clocks tick slower.',
        bridgeToArticle: 'Proper time, light cones, and metric curvature in this essay stand directly on their geometric revolution.',
      },
      {
        monogram: 'SH',
        name: 'Stephen Hawking',
        era: '1942–2018',
        accentColor: '#A78BFA',
        coreThought: 'Probed event horizons, the arrow of time, and black hole thermodynamics at the frontier where relativity meets quantum physics.',
        bridgeToArticle: 'The essay weaves these cosmological and causal boundaries into a unified philosophical perspective.',
      },
    ],
  },
  consciousness: {
    sectionTitle: 'What Previous Scientists & Thinkers Thought',
    narrationIntro: 'To make the question of mind and awareness clearer, let us review what earlier scientists and thinkers proposed:',
    thinkers: [
      {
        monogram: 'RD',
        name: 'René Descartes',
        era: '1596–1650',
        accentColor: '#F59E0B',
        coreThought: 'Separated conscious subjective mind from mechanical matter, arguing inner experience cannot be reduced to simple clockwork gears.',
        bridgeToArticle: 'The essay re-examines this classic mind–body question using modern physics and information theory.',
      },
      {
        monogram: 'AT',
        name: 'Alan Turing',
        era: '1912–1954',
        accentColor: '#38BDF8',
        coreThought: 'Reframed “Can machines think?” into a rigorous scientific inquiry through computability and the imitation game.',
        bridgeToArticle: 'The article sharpens the distinction between formal symbol computation and lived conscious awareness.',
      },
      {
        monogram: 'GT',
        name: 'Giulio Tononi & Roger Penrose',
        era: 'Contemporary',
        accentColor: '#34D399',
        coreThought: 'Tononi modeled consciousness through Integrated Information (Φ), while Penrose explored whether human understanding transcends purely algorithmic rules.',
        bridgeToArticle: 'The study synthesizes causal integration and subjective qualia into an open, testable framework.',
      },
    ],
  },
  higgs: {
    sectionTitle: 'What Previous Scientists Thought About This Topic',
    narrationIntro: 'To illuminate how symmetry and mass were understood before, let us look at earlier physicists:',
    thinkers: [
      {
        monogram: 'EN',
        name: 'Emmy Noether',
        era: '1882–1935',
        accentColor: '#F59E0B',
        coreThought: 'Proved that every continuous symmetry in physical laws corresponds to a fundamental conservation law, anchoring modern field theory.',
        bridgeToArticle: 'The essay’s gauge-symmetry and conservation logic rests directly on Noether’s theorem.',
      },
      {
        monogram: 'PA',
        name: 'Yoichiro Nambu & Philip Anderson',
        era: '1921–2020',
        accentColor: '#38BDF8',
        coreThought: 'Demonstrated through superconductivity that a system’s ground state can spontaneously break symmetry even when underlying equations stay symmetric.',
        bridgeToArticle: 'The article translates spontaneous symmetry breaking into an intuitive everyday balance analogy.',
      },
      {
        monogram: 'PH',
        name: 'Peter Higgs, François Englert & Robert Brout',
        era: '1929–2024',
        accentColor: '#34D399',
        coreThought: 'Proposed that fundamental particles acquire mass by interacting with a pervasive scalar field—confirmed experimentally at CERN in 2012.',
        bridgeToArticle: 'The study clarifies mass as an interactive field relationship rather than static intrinsic weight.',
      },
    ],
  },
  holographic: {
    sectionTitle: 'What Previous Scientists Thought About This Topic',
    narrationIntro: 'To clarify how the holographic principle emerged, let us review what earlier physicists discovered:',
    thinkers: [
      {
        monogram: 'JB',
        name: 'Jacob Bekenstein & Stephen Hawking',
        era: '1947–2018',
        accentColor: '#F59E0B',
        coreThought: 'Discovered that black hole entropy scales with horizon surface area rather than interior volume, signaling that information is encoded on boundaries.',
        bridgeToArticle: 'The article’s area-law entropy analysis grows straight out of this landmark insight.',
      },
      {
        monogram: 'GH',
        name: 'Gerard ’t Hooft & Leonard Susskind',
        era: 'Contemporary',
        accentColor: '#38BDF8',
        coreThought: 'Formulated the Holographic Principle: all physics inside a 3D volume can be completely encoded on its surrounding 2D boundary.',
        bridgeToArticle: 'The essay brings boundary–bulk equivalence to life through accessible everyday geometry.',
      },
      {
        monogram: 'JM',
        name: 'Juan Maldacena',
        era: 'Contemporary',
        accentColor: '#34D399',
        coreThought: 'Established the AdS/CFT correspondence, creating an exact mathematical dictionary between bulk gravity and boundary quantum field theory.',
        bridgeToArticle: 'The study explores how spacetime geometry itself may emerge from quantum entanglement and information.',
      },
    ],
  },
  chaos: {
    sectionTitle: 'What Previous Scientists Thought About This Topic',
    narrationIntro: 'To clarify determinism and unpredictability, let us look at what earlier scientists thought:',
    thinkers: [
      {
        monogram: 'PL',
        name: 'Pierre-Simon Laplace',
        era: '1749–1827',
        accentColor: '#F59E0B',
        coreThought: 'Imagined an intellect (“Laplace’s Demon”) that could predict the entire future with certainty if given the exact initial positions and velocities of every particle.',
        bridgeToArticle: 'The essay shows why nonlinear sensitivity places real limits on Laplace’s ideal of infinite prediction.',
      },
      {
        monogram: 'HP',
        name: 'Henri Poincaré',
        era: '1854–1912',
        accentColor: '#38BDF8',
        coreThought: 'Studying the three-body gravitational problem, Poincaré first noticed that tiny initial uncertainties can grow into drastically different orbits.',
        bridgeToArticle: 'Phase-space divergence in this article directly echoes Poincaré’s pioneering discovery.',
      },
      {
        monogram: 'EL',
        name: 'Edward Lorenz',
        era: '1917–2008',
        accentColor: '#34D399',
        coreThought: 'Found that rounding a single weather variable completely altered forecasts, introducing the Butterfly Effect and strange attractors.',
        bridgeToArticle: 'The study reveals how deterministic laws still yield rich, open-ended structure without pure randomness.',
      },
    ],
  },
  software: {
    sectionTitle: 'What Previous Scientists Thought About This Topic',
    narrationIntro: 'To make intelligent software and feedback systems clearer, let us see what earlier pioneers thought:',
    thinkers: [
      {
        monogram: 'AT',
        name: 'Alan Turing',
        era: '1912–1954',
        accentColor: '#F59E0B',
        coreThought: 'Defined universal computation, showing that structured logical tasks can be expressed as clear, verifiable algorithmic steps.',
        bridgeToArticle: 'The essay’s modular validation architecture builds directly on Turing’s computational rigor.',
      },
      {
        monogram: 'CS',
        name: 'Claude Shannon',
        era: '1916–2001',
        accentColor: '#38BDF8',
        coreThought: 'Founded information theory, establishing mathematical laws to filter noise and transmit reliable information bit by bit.',
        bridgeToArticle: 'Turning noisy daily inputs into dependable decisions directly mirrors Shannon’s signal-to-noise principles.',
      },
      {
        monogram: 'NW',
        name: 'Norbert Wiener',
        era: '1894–1964',
        accentColor: '#34D399',
        coreThought: 'Pioneered cybernetics, proving that continuous feedback loops keep both biological organisms and engineered systems balanced and human-centered.',
        bridgeToArticle: 'The study applies cybernetic feedback to make everyday digital tools calm, transparent, and empowering.',
      },
    ],
  },
};

export function getHistoricalScientistsForTheme(
  theme: SimulationType,
  lang: LanguageCode
): HistoricalScientistsPack {
  const bank = lang === 'tr' ? HISTORICAL_SCIENTISTS_TR : HISTORICAL_SCIENTISTS_EN;
  return bank[theme] || bank.quantum;
}

const STORY_TEMPLATES_TR: Record<SimulationType, Omit<EverydayStoryProfile, 'theme' | 'symbolicFigureNotice'>> = {
  quantum: {
    storyTitle: 'Pencere Önündeki Çay Bardağı ve İki Işık Çizgisi',
    objectsSummary: 'Ahşap masa · Buharlı çay bardağı · Jaluzi pencere · Cep aynası · Açık not defteri',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · SABAH MASASI & PENCERE',
        everydayObjects: ['Çay Bardağı', 'Jaluzi Pencere', 'Not Defteri'],
        storyBeat: 'Temsili gözlemci figürü sabah masasında çay bardağındaki dalgaları ve jaluziden süzülen iki ışık çizgisini fark eder.',
        narrationCue: 'Hikâyemiz sabah güneşi alan sade bir çalışma masasında başlar: temsili gözlemcimiz, jaluzinin iki dar aralığından geçip çay bardağının yüzeyinde dalga desenleri oluşturan ışığa dikkat kesilir.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · İKİ ARALIK & BEKLENMEDİK DESEN',
        everydayObjects: ['Jaluzi Aralıkları', 'Güneş Işığı', 'Porselen Fincan'],
        storyBeat: 'Işık iki aralıktan birden geçince duvarda tek şerit yerine iç içe geçmiş dalga halkaları oluşur.',
        narrationCue: 'Gözlemci defterini kenara koyup baktığında, iki aralıktan gelen ışık dalgalarının masadaki fincanın çevresinde girişim halkaları çizdiğini görür.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · CEP AYNASIYLA ÖLÇÜM ANI',
        everydayObjects: ['Cep Aynası', 'Masa Lambası', 'Çay Kaşığı'],
        storyBeat: 'Temsili figür küçük bir cep aynasıyla ışığın hangi aralıktan geçtiğini kontrol ettiği anda desen değişir.',
        narrationCue: 'Kırılma anı, temsili karakterin cebinden küçük bir ayna çıkarıp ışığın yolunu ölçmeye çalışmasıyla yaşanır: bakışın kendisi dalga davranışını tek bir iz hâline dönüştürür.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · DEFTERDE MODEL KURULUMU',
        everydayObjects: ['Dolma Kalem', 'Kareli Defter', 'Cam Prizma'],
        storyBeat: 'Temsili figür kareli defterine dalga genliğini ve cam prizmadan kırılan ışığın oranlarını çizer.',
        narrationCue: 'Şimdi masadaki cam prizma ve dolma kalem devreye girer; günlük deney, makaledeki matematiksel olasılık modeline bağlanır.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · ÇAY YÜZEYİNDEKİ DERİN EŞLEŞME',
        everydayObjects: ['Çay Bardağı', 'Buhar Dalgaları', 'Pusula'],
        storyBeat: 'Fincandaki her küçük titreşim, uzaktaki bir pusula iğnesiyle eşzamanlı kavramsal bağı simgeler.',
        narrationCue: 'Masadaki sıcak çay bardağının titreşimleri, makalenin derin analiz bölümündeki etkileşim ve bağlam ilişkisini somutlaştırır.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · İKİ NOT SAYFASININ KARŞILAŞTIRILMASI',
        everydayObjects: ['İki Defter Sayfası', 'Büyüteç', 'Masa Lambası'],
        storyBeat: 'Temsili araştırmacı büyüteçle iki ayrı ölçüm sayfasını yan yana koyup temel bulguları doğrular.',
        narrationCue: 'Büyüteç altında iki ayrı gözlem notu karşılaştırılır; makalenin temel bulguları günlük hayattaki neden-sonuç zinciriyle netleşir.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · PENCEREDEN GENİŞ BAKIŞ',
        everydayObjects: ['Açık Pencere', 'Güneş Işını', 'Kapalı Cep Aynası'],
        storyBeat: 'Temsili figür cep aynasını masaya bırakır; güneş ışığı tekrar tüm odaya bütüncül bir desen yayar.',
        narrationCue: 'Hikâye çözüme ulaşırken cep aynası masaya bırakılır ve tüm parçalar makalenin bütüncül sonucuna kavuşur.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · DEFTERİN KAPANMASI & YENİ SORU',
        everydayObjects: ['Not Defteri', 'Fincan', 'Pencere Manzarası'],
        storyBeat: 'Temsili figür defterini kapatıp yeni sorular için pencereden gökyüzüne bakar.',
        narrationCue: 'Sabah masasında başlayan bu günlük gözlem, okurun kendi düşünceleriyle sürdüreceği yeni bir bilimsel merakla tamamlanır.',
        characterPose: 'concluding',
      },
    ],
  },
  spacetime: {
    storyTitle: 'Tren Penceresi, İstasyon Saati ve İki Cep Saati',
    objectsSummary: 'İstasyon duvar saati · Pirinç cep saati · Tren penceresi · Kahve termosu · Pusula',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · İSTASYON PERONUNDA KARŞILAŞMA',
        everydayObjects: ['İstasyon Saati', 'İki Cep Saati', 'Kahve Bardağı'],
        storyBeat: 'İki temsili çizim figür, istasyon saatinin altında cep saatlerini aynı saniyeye ayarlar.',
        narrationCue: 'Olay kurgumuz sakin bir tren istasyonunda başlar: iki temsili yolcu, pirinç cep saatlerini perondaki büyük duvar saatine göre eşitler.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · TREN HAREKET EDİYOR',
        everydayObjects: ['Tren Penceresi', 'Sokak Lambaları', 'Cep Saati'],
        storyBeat: 'Birinci figür trene binerken ikinci figür elinde kahvesiyle peronda kalır; mesafe ve hız açılır.',
        narrationCue: 'Tren hareket ettiğinde pencereden akan ışık direkleri, hareketli gözlemci ile durgun gözlemci arasındaki zaman farkının ilk işaretini verir.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · EĞİLEN MASA ÖRTÜSÜ & AĞIR KÜRE',
        everydayObjects: ['Masa Örtüsü', 'Ağır Cam Küre', 'Misket'],
        storyBeat: 'Temsili figür gergin bir masa örtüsünün ortasına ağır bir küre koyduğunda yuvarlanan misketin yolu bükülür.',
        narrationCue: 'Vagon masasındaki basit bir deneyle, uzay-zamanın ağır bir cisim çevresinde nasıl büküldüğü gündelik nesnelerle görünür hâle gelir.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · İKİ SAATİN FARKLI RİTMİ',
        everydayObjects: ['Hızlı Saat', 'Yavaşlayan Cep Saati', 'Cetvel'],
        storyBeat: 'Perondaki duvar saati hızlı dönerken trendeki cep saatinin akrebi daha sakin ilerler.',
        narrationCue: 'İki saatin ritmi yan yana ölçüldüğünde makalenin uzay-zaman ve görelilik modeli somut bir zaman farkına dönüşür.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · GECE PENCERESİNDEN IŞIK KONİSİ',
        everydayObjects: ['El Feneri', 'Tren Camı', 'Harita'],
        storyBeat: 'El fenerinin camdan yayılan ışığı, geçmiş ile gelecek arasındaki nedensellik sınırını çizer.',
        narrationCue: 'Karanlık tren camında yansıyan el feneri ışığı, evrendeki bilgi ve nedensellik hızının aşılamaz sınırını canlandırır.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · YOLCULUK DEFTERİNDEKİ KAYITLAR',
        everydayObjects: ['Seyahat Defteri', 'Bilet', 'Pirinç Pusula'],
        storyBeat: 'Temsili yolcu iki saatin gösterdiği dakikaları biletin arkasına not ederek bulguları doğrular.',
        narrationCue: 'Yolculuk defterine kaydedilen her zaman damgası, makalenin temel çıkarımlarını tek tek doğrular.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · İSTASYONA DÖNÜŞ & KARŞILAŞTIRMA',
        everydayObjects: ['İki Cep Saati', 'Peron Bankı', 'Termos'],
        storyBeat: 'İki temsili figür yeniden buluşup cep saatlerini yan yana tuttuğunda geçen sürenin farklılığını görür.',
        narrationCue: 'İstasyonda yeniden yan yana gelen iki cep saati, zamanın mutlak değil ilişkisel olduğunu hikâyenin doruk noktasında gösterir.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · UFKA AÇILAN YENİ ROTA',
        everydayObjects: ['Pusula', 'Harita', 'İstasyon Lambası'],
        storyBeat: 'Temsili figür haritasını katlayıp yeni bir kavramsal yolculuğa hazırlanır.',
        narrationCue: 'İki cep saatiyle başlayan bu gündelik hikâye, zamanın doğası üzerine derin bir tefekkürle son bulur.',
        characterPose: 'concluding',
      },
    ],
  },
  consciousness: {
    storyTitle: 'Masa Lambası, Ayna ve Açık Günlük Defteri',
    objectsSummary: 'Sıcak masa lambası · Masa aynası · Açık günlük defteri · Dolma kalem · Kurmalı saat mekanizması',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · ÇALIŞMA MASASINDA SESSİZ AKŞAM',
        everydayObjects: ['Masa Lambası', 'Açık Defter', 'Kahve Fincanı'],
        storyBeat: 'Temsili çizim düşünür, sıcak masa lambasının altında defterine ilk soruyu yazar.',
        narrationCue: 'Hikâyemiz akşam lambası yanan bir çalışma masasında açılır: temsili düşünürümüz açık bir günlük defteri, bir masa aynası ve küçük bir kurmalı saat arasında düşünceye dalar.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · KURMALI OYUNCAK İLE AYNA KARŞILAŞMASI',
        everydayObjects: ['Kurmalı Dişli', 'Masa Aynası', 'Not Kâğıtları'],
        storyBeat: 'Kurmalı dişli tek sıra hâlinde mekanik hareket ederken, ayna karşısındaki temsili figür kendi düşüncesini sorgular.',
        narrationCue: 'Masanın solundaki kurmalı mekanizma yalnızca tek yönlü komutları tekrarlar; oysa temsili figür aynaya bakıp kendi iç deneyimini fark eder.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · NOT KÂĞITLARININ BİRBİRİNE BAĞLANMASI',
        everydayObjects: ['Renkli Not Kâğıtları', 'İp Bağlantıları', 'Dolma Kalem'],
        storyBeat: 'Masadaki ayrı not kâğıtları ışık çizgileriyle birleşerek bütüncül bir anlam ağı kurar.',
        narrationCue: 'Temsili karakter dağınık not kâğıtlarını birbirine bağladıkça, tekil verilerin değil bütüncül bağlantının anlam ürettiği ortaya çıkar.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · BÜTÜNLEŞİK BİLGİ ÖLÇÜMÜ',
        everydayObjects: ['Metronom', 'Not Defteri', 'Masa Lambası'],
        storyBeat: 'Metronomun ritmiyle birlikte masadaki tüm not düğümleri eşzamanlı parlayarak zihin bütünlüğünü gösterir.',
        narrationCue: 'Metronomun düzenli ritmi altında makaledeki kavramsal model, parçaların toplamından fazlasını anlatır.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · KİTAPLIK & SATRANÇ TAHTASI',
        everydayObjects: ['Satranç Taşı', 'Kitaplık', 'Gözlük'],
        storyBeat: 'Satranç tahtasındaki stratejik hamle ile bilinçli sezgi arasındaki ince fark masada canlanır.',
        narrationCue: 'Masadaki satranç tahtası üzerinden kural tabanlı hesaplama ile bilinçli anlamlandırma arasındaki derin ayrım incelenir.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · KALEMLE ALTINI ÇİZME ANI',
        everydayObjects: ['Dolma Kalem', 'İşaretli Sayfa', 'Ayna'],
        storyBeat: 'Temsili figür defterdeki temel bulguların altını çizerek zihin ve gerçeklik bağını özetler.',
        narrationCue: 'Defterde altı çizilen her satır, makalenin temel bulgularını günlük hayat deneyimiyle pekiştirir.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · LAMBA IŞIĞINDA BÜTÜNCÜL SENTETİK BAKIŞ',
        everydayObjects: ['Masa Lambası', 'Birleşmiş Defter', 'Fincan'],
        storyBeat: 'Masadaki tüm nesneler tek bir sıcak ışık çemberinde birleşir; hikâye ana sonuca ulaşır.',
        narrationCue: 'Akşam lambasının aydınlattığı çalışma masasında tüm sorular tek bir berrak sonuca kavuşur.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · AÇIK KİTAP & DEVAM EDEN DİYALOG',
        everydayObjects: ['Açık Kitap', 'Kalem', 'Pencere Yıldızları'],
        storyBeat: 'Temsili figür kalemini bırakır; pencerenin dışındaki gece göğü yeni fikirleri çağırır.',
        narrationCue: 'Çalışma masasında başlayan bu içsel keşif, okurun kendi zihninde devam edecek açık bir tefekkürle kapanır.',
        characterPose: 'concluding',
      },
    ],
  },
  higgs: {
    storyTitle: 'Mutfak Terazisi, Bal Kavanozu ve Düşen Tüy',
    objectsSummary: 'Pirinç mutfak terazisi · Cam bal kavanozu · Cam bilye · Beyaz tüy · El feneri',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · TEZGÂHTA TERAZİ VE İKİ NESNE',
        everydayObjects: ['Pirinç Terazi', 'Cam Bilye', 'Tüy'],
        storyBeat: 'Temsili çizim karakter mutfak tezgâhında pirinç teraziye bir cam bilye ve hafif bir tüy koyar.',
        narrationCue: 'Olay kurgumuz güneşli bir tezgâhta başlar: temsili karakterimiz bir pirinç terazi, bir cam bilye ve bir tüy ile kütlenin sırrını sorgular.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · CAM KAVANOZDA DİRENÇ HİSSİ',
        everydayObjects: ['Cam Bal Kavanozu', 'Bilye', 'Tahta Kaşık'],
        storyBeat: 'Bilye yoğun bal kavanozuna bırakıldığında yavaşlarken, dışarıdaki ışık huzmesi hiç yavaşlamadan geçer.',
        narrationCue: 'Bilye cam kavanozdaki yoğun ortama girdiğinde direnç kazanır; tıpkı alanla etkileşen parçacıkların kütle kazanması gibi.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · DENGE TEPSİSİNİN EĞİLME ANI',
        everydayObjects: ['Eğilen Terazi', 'Ağırlık Taşı', 'Masa Lambası'],
        storyBeat: 'Simetrik duran terazi, küçük bir tetiklemeyle tek yana eğilip yeni bir denge noktasına oturur.',
        narrationCue: 'Temsili figür terazinin kefesine hafifçe dokunduğunda kusursuz simetri kırılır ve cisimler yeni bir denge çukurunda kararlılık kazanır.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · CETVEL VE KAVANOZ ÖLÇÜMÜ',
        everydayObjects: ['Ahşap Cetvel', 'Kronometre', 'Cam Kavanoz'],
        storyBeat: 'Temsili figür cetvel ve kronometreyle bilyenin iniş hızını ölçerek alan etkileşimini modeller.',
        narrationCue: 'Cetvel ve kronometre ile yapılan basit ölçüm, makaledeki simetri kırılması ve etkileşim denklemini somutlaştırır.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · IŞIK HUZMESİ İLE AĞIR CİSİM KARŞILAŞTIRMASI',
        everydayObjects: ['El Feneri', 'Prizma', 'Ağır Bilye'],
        storyBeat: 'El fenerinin kütlesiz ışığı kavanozu anında geçerken bilye çevresindeki ortamı kendine çeker.',
        narrationCue: 'El fenerinden çıkan ışık engellenmeden ilerlerken ağır bilye ortamla güçlü bir bağ kurar.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · DEFTERDE KARŞILAŞTIRMA TABLOSU',
        everydayObjects: ['Not Defteri', 'Terazi', 'Kalem'],
        storyBeat: 'Temsili karakter gözlem sonuçlarını deftere işleyip temel bulguları sıralar.',
        narrationCue: 'Tezgâhtaki tüm gözlemler defterde yan yana geldiğinde makalenin temel çıkarımları billurlaşır.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · YENİ DENGE NOKTASINDA BÜTÜNLEŞME',
        everydayObjects: ['Dengelenmiş Terazi', 'Cam Kavanoz', 'Işık'],
        storyBeat: 'Terazi yeni kararlı dengesinde durur; ağırlığın gizemi günlük bir deneyle anlaşılır.',
        narrationCue: 'Mutfak terazisinden evrenin temel yapı taşlarına uzanan bu benzetme makalenin ana sonucunu tamamlar.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · TEZGÂHIN TOPLANMASI & MERAK',
        everydayObjects: ['Defter', 'El Feneri', 'Terazi'],
        storyBeat: 'Temsili figür deney malzemelerini toplar ve yeni bilimsel keşifler için defterini açık bırakır.',
        narrationCue: 'Gündelik bir terazi ve cam kavanozla başlayan hikâyemiz, maddenin özüne dair kalıcı bir kavrayışla biter.',
        characterPose: 'concluding',
      },
    ],
  },
  holographic: {
    storyTitle: 'Katlanan Kartpostal, Pencere Camı ve Masa Küresi',
    objectsSummary: 'Pul yapıştırılmış kartpostal · Masa lambası · Cam pencere · Kâğıt küp · Dünya küresi',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · MASADA DÜZ BİR KARTPOSTAL',
        everydayObjects: ['Kartpostal', 'Masa Lambası', 'Kitap'],
        storyBeat: 'Temsili çizim figür masanın üstünde duran ince bir kartpostala ve onun duvardaki uzun gölgesine bakar.',
        narrationCue: 'Hikâyemiz bir çalışma masasındaki düz bir kartpostalla başlar: temsili karakterimiz iki boyutlu bir yüzeyin nasıl derinlikli bir sahne taşıyabileceğini merak eder.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · LAMBA IŞIĞIYLA DERİNLİK YANSIMASI',
        everydayObjects: ['Masa Lambası', 'Delikli Kart', 'Masa Yüzeyi'],
        storyBeat: 'Kartpostal lambanın önüne tutulduğunda masanın ortasında üç boyutlu parlak bir küre gölgesi belirir.',
        narrationCue: 'Kartpostal masa lambasının önüne getirildiğinde, yalnızca yüzey kenarındaki çizgiler odanın ortasında hacimli bir şekil oluşturur.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · PENCERE ÇERÇEVESİNDE BİLGİ SINIRI',
        everydayObjects: ['Pencere Çerçevesi', 'İp Ağı', 'Kâğıt Küp'],
        storyBeat: 'Pencere çerçevesinin kenarlarından uzanan ince ipler merkezdeki kâğıt küpü havada dengede tutar.',
        narrationCue: 'Çerçevenin kenarındaki her düğüm, iç hacimdeki bir noktayla eşleşir; tıpkı holografik sınır-hacim ilkesinde olduğu gibi.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · KÜÇÜK KARELİ ŞEFFAF CETVEL',
        everydayObjects: ['Şeffaf Izgara', 'Masa Küresi', 'Kalem'],
        storyBeat: 'Temsili karakter yüzeydeki küçük kareleri sayarak alan ile bilgi kapasitesi arasındaki oranı ölçer.',
        narrationCue: 'Şeffaf ızgara ile sayılan küçük yüzey kareleri, makalenin entropi ve bilgi yoğunluğu modelini gözler önüne serer.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · KÂĞIT HARİTADAN DÜNYA KÜRESİNE',
        everydayObjects: ['Katlı Harita', 'Masa Küresi', 'Büyüteç'],
        storyBeat: 'Düz bir kâğıt haritanın kıvrılıp masa küresini sarması, bilginin geometrik dönüşümünü anlatır.',
        narrationCue: 'Düz harita küreye sarılırken makalenin derin analiz bölümündeki bilgi korunumu fikri canlanır.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · ZARF VE KARTPOSTAL DOĞRULAMASI',
        everydayObjects: ['Zarf', 'Kartpostal', 'Not Defteri'],
        storyBeat: 'Temsili figür zarfın üzerindeki satırlarla içindeki çizimi eşleştirerek temel bulguları özetler.',
        narrationCue: 'Zarfın dışındaki kısa kodlar içindeki tam hikâyeyi korur; böylece makalenin temel bulguları netleşir.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · TEK BİR ÇERÇEVEDE TÜM EVREN',
        everydayObjects: ['Masa Küresi', 'Pencere Işığı', 'Kartpostal'],
        storyBeat: 'Pencereden süzülen ışık küre ile kartpostalı aynı sahnede birleştirerek hikâyeyi çözüme kavuşturur.',
        narrationCue: 'Sade bir kartpostal ve masa lambasıyla başlayan bu hikâye, evrenin bilgi dokusuna dair bütüncül sonuca ulaşır.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · DEFTERE KOYULAN KARTPOSTAL',
        everydayObjects: ['Kapalı Defter', 'Kartpostal', 'Lamba'],
        storyBeat: 'Temsili figür kartpostalı defterinin arasına ayraç olarak yerleştirip yeni bir soruya geçer.',
        narrationCue: 'Masadaki kartpostal şimdi yeni okumalar için bir ayraçtır; keşif okurun zihninde sürer.',
        characterPose: 'concluding',
      },
    ],
  },
  chaos: {
    storyTitle: 'Yağmur Damlası, Sarkaçlı Saat ve İki Kâğıt Gemi',
    objectsSummary: 'Sarkaçlı duvar saati · İki kâğıt gemi · Su dolu bahçe teknesi · Ahşap domino taşları · Şemsiye',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · BAHÇE MASASINDA İKİ KÂĞIT GEMİ',
        everydayObjects: ['İki Kâğıt Gemi', 'Su Teknesi', 'Sarkaçlı Saat'],
        storyBeat: 'Temsili çizim figür iki özdeş kâğıt gemiyi su dolu geniş bir teknenin kenarına yan yana bırakır.',
        narrationCue: 'Hikâyemiz yağmur öncesi sakin bir bahçe masasında başlar: temsili karakterimiz iki özdeş kâğıt gemiyi suyun üzerine yan yana bırakır.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · TEK BİR YAĞMUR DAMLASI',
        everydayObjects: ['Yağmur Damlası', 'Su Dalgaları', 'İki Kâğıt Gemi'],
        storyBeat: 'Birinci geminin hemen yanına düşen minik bir yağmur damlası yalnızca bir milimetrelik fark yaratır.',
        narrationCue: 'Olay kurgusunun kırılma anı tek bir yağmur damlasıyla gelir: gemilerden biri milimetrik bir sapma yaşar.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · DOMİNO TAŞLARI VE AYRILAN YOLLAR',
        everydayObjects: ['Ahşap Domino', 'Kâğıt Gemiler', 'Yaprak'],
        storyBeat: 'Başta yan yana yüzen iki gemi, akıntı kıvrıldıkça bambaşka köşelere sürüklenir; domino zinciri hızlanır.',
        narrationCue: 'Küçük başlangıç farkı suyun kıvrımlarında büyür ve iki kâğıt gemiyi tamamen farklı rotalara taşır.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · SARKAÇLI SAATİN DÜZENLİ RİTMİ',
        everydayObjects: ['Sarkaçlı Saat', 'Cetvel', 'Defter'],
        storyBeat: 'Sarkaç belirli yasalarla sallanırken iki gemi arasındaki mesafe katlanarak artar.',
        narrationCue: 'Sarkaçlı saat yasaların kesinliğini hatırlatırken, gemilerin ayrışması deterministik kaos modelini gözler önüne serer.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · KELEBEK DESENLİ SU GİRDABI',
        everydayObjects: ['Su Girdabı', 'İki Gemi', 'Şemsiye'],
        storyBeat: 'Gemiler suyun içinde rastgele dağılmaz; kelebek kanadını andıran düzenli bir çeker yörünge çizer.',
        narrationCue: 'Karmaşanın içinde gizli bir geometri belirir; makalenin derin analizindeki düzen-kaos dengesi ortaya çıkar.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · BAHÇE DEFTERİNDE ROTA ÇİZİMİ',
        everydayObjects: ['Çizim Defteri', 'İki Renkli Kalem', 'Domino'],
        storyBeat: 'Temsili karakter iki renkli kalemle gemilerin izini çizip makalenin temel bulgularını özetler.',
        narrationCue: 'İki renkli kalemle çizilen rotalar, küçük seçimlerin büyük sonuçlara nasıl yol açtığını net biçimde kanıtlar.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · YAĞMUR DİNERKEN BÜTÜNCÜL KAVRAYIŞ',
        everydayObjects: ['Şemsiye', 'Durgun Su', 'İki Kâğıt Gemi'],
        storyBeat: 'Yağmur diner, su durulur; determinizm ile öngörülemezlik arasındaki ince bağ hikâyeyi çözüme kavuşturur.',
        narrationCue: 'Yağmur dindiğinde, yasalı düzenin içinde bile geleceğin neden yaratıcı ve açık kaldığı bütün netliğiyle görülür.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · YENİ BİR KÂĞIT GEMİ KATLAMAK',
        everydayObjects: ['Kâğıt', 'Sarkaçlı Saat', 'Pencere'],
        storyBeat: 'Temsili figür yeni bir kâğıt gemi katlayarak okuru kendi seçimlerini düşünmeye davet eder.',
        narrationCue: 'İki kâğıt gemiyle başlayan bu günlük hikâye, sorumluluk ve özgür düşünce üzerine yeni sorularla tamamlanır.',
        characterPose: 'concluding',
      },
    ],
  },
  software: {
    storyTitle: 'Mutfak Masası, Meyve Kâsesi ve Akıllı Günlük Planlayıcı',
    objectsSummary: 'Taze meyve kâsesi · Su bardağı · Mutfak zamanlayıcısı · Dizüstü bilgisayar · Günlük defter',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'SAHNE 1 · GÜNEŞLİ MUTFAK MASASINDA BAŞLANGIÇ',
        everydayObjects: ['Meyve Kâsesi', 'Su Bardağı', 'Dizüstü Bilgisayar'],
        storyBeat: 'Temsili çizim karakter güneşli mutfak masasında taze bir kâse, su bardağı ve planlayıcı ekranla güne başlar.',
        narrationCue: 'Hikâyemiz düzenli bir mutfak masasında açılır: temsili karakterimiz günlük alışkanlıklarını sade bir yazılım planlayıcıyla takip etmeye karar verir.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'SAHNE 2 · GÜNLÜK ÖLÇÜM & BESİN DENGESİ',
        everydayObjects: ['Mutfak Terazisi', 'Kâse & Kaşık', 'Not Listesi'],
        storyBeat: 'Mutfak masasındaki her öğün ve su bardağı, ekrandaki net denge çubuklarına yansır.',
        narrationCue: 'Her su bardağı ve dengeli öğün, karmaşık verileri anlaşılır günlük kararlara dönüştürür.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'SAHNE 3 · AKILLI VERİ AKIŞI & ZAMANLAYICI',
        everydayObjects: ['Mutfak Zamanlayıcısı', 'Dizüstü Ekranı', 'Defter'],
        storyBeat: 'Zamanlayıcı çaldığında sistem kişisel hedefe göre sade bir hatırlatma ve öneri üretir.',
        narrationCue: 'Günlük zamanlayıcı ve ekran arasındaki akış, makaledeki yazılım mimarisini gündelik hayata taşır.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'SAHNE 4 · DENGELİ MODELİN ÇALIŞMASI',
        everydayObjects: ['Denge Grafiği', 'Su Bardağı', 'Kâse'],
        storyBeat: 'Temsili figür beslenme ve sağlık adımlarını dört düzenli aşamada test eder.',
        narrationCue: 'Dört aşamalı veri işleme modeli, gündelik yaşam kalitesini ölçülebilir adımlarla destekler.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'SAHNE 5 · ANORMALLİK FARK EDİLDİĞİNDE DÜZELTME',
        everydayObjects: ['Uyarı Kartı', 'Meyve Kâsesi', 'Su Sürahisi'],
        storyBeat: 'Eksik su veya dengesiz öğün anında ekranda görünür ve temsili figür dengesini hemen düzeltir.',
        narrationCue: 'Küçük dengesizlikler erkenden fark edilip günlük rutin içinde kolayca düzeltilir.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'SAHNE 6 · HAFTALIK KONTROL LİSTESİ',
        everydayObjects: ['Onay Listesi', 'Kalem', 'Dizüstü'],
        storyBeat: 'Temsili karakter haftalık onay kutularına bakarak makalenin temel kazanımlarını doğrular.',
        narrationCue: 'Tamamlanan günlük adımlar, makalenin temel uygulama sonuçlarını somut biçimde doğrular.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'SAHNE 7 · SÜRDÜRÜLEBİLİR GÜNLÜK DENGE',
        everydayObjects: ['Taze Kâse', 'Su Bardağı', 'Açık Pencere'],
        storyBeat: 'Mutfak masası sade ve dengeli bir düzene kavuşur; teknoloji günlük hayata hizmet eder.',
        narrationCue: 'Teknolojinin insanın günlük yaşamını sadeleştirmesiyle hikâyemiz ana sonucuna ulaşır.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'SAHNE 8 · YENİ GÜNE HAZIRLIK',
        everydayObjects: ['Planlayıcı', 'Kahve Fincanı', 'Güneş Işığı'],
        storyBeat: 'Temsili figür dizüstü ekranını kapatır ve sağlıklı bir güne adım atar.',
        narrationCue: 'Mutfak masasındaki bu günlük hikâye, bilinçli ve dengeli bir yaşam davetiyle tamamlanır.',
        characterPose: 'concluding',
      },
    ],
  },
};

const STORY_TEMPLATES_EN: Record<SimulationType, Omit<EverydayStoryProfile, 'theme' | 'symbolicFigureNotice'>> = {
  quantum: {
    storyTitle: 'The Morning Teacup & Two Sunbeams Through the Blinds',
    objectsSummary: 'Wooden desk · Steaming teacup · Window blinds · Pocket mirror · Open notebook',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · MORNING DESK & WINDOW BLINDS',
        everydayObjects: ['Teacup', 'Window Blinds', 'Notebook'],
        storyBeat: 'A symbolic illustrated observer notices sunlight passing through two narrow blind slits onto a steaming teacup.',
        narrationCue: 'Our story opens at a sunlit wooden desk: our symbolic observer watches two narrow beams of morning light ripple across a teacup.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · TWO SLITS & INTERFERENCE RIPPLES',
        everydayObjects: ['Sunlight Beams', 'Teacup Ripples', 'Desk Surface'],
        storyBeat: 'Instead of two simple lines, overlapping wave rings form across the desk and teacup surface.',
        narrationCue: 'With both blind slits open, the light forms alternating bright and quiet bands—turning an everyday breakfast table into a wave puzzle.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · THE POCKET MIRROR TURNING POINT',
        everydayObjects: ['Pocket Mirror', 'Desk Lamp', 'Teaspoon'],
        storyBeat: 'The moment the illustrated figure holds up a pocket mirror to check which slit light took, the ripple pattern shifts.',
        narrationCue: 'The turning point arrives when our symbolic figure lifts a small pocket mirror to trace one path: the act of measuring reshapes the pattern.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · SKETCHING THE MODEL IN A NOTEBOOK',
        everydayObjects: ['Fountain Pen', 'Grid Notebook', 'Glass Prism'],
        storyBeat: 'With a fountain pen and glass prism, the everyday scene connects directly to the article’s mathematical wave model.',
        narrationCue: 'Using a glass prism and grid notebook on the table, the everyday observation translates into the formal model of the essay.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · COUPLED RIPPLES & COMPASS NEEDLE',
        everydayObjects: ['Teacup', 'Steam Waves', 'Brass Compass'],
        storyBeat: 'Subtle ripples in the cup stay paired with a small brass compass needle across the desk.',
        narrationCue: 'Across the tabletop, paired ripples illustrate the deeper analytical argument of the paper.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · COMPARING TWO NOTEBOOK PAGES',
        everydayObjects: ['Open Pages', 'Magnifying Glass', 'Lamp'],
        storyBeat: 'The symbolic character compares both recorded pages under a magnifying glass to verify the key findings.',
        narrationCue: 'Comparing both notebook pages side by side brings the article’s core findings into focus.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · SETTING THE MIRROR DOWN',
        everydayObjects: ['Open Window', 'Sunlight', 'Pocket Mirror'],
        storyBeat: 'Placing the pocket mirror back on the desk restores the unified wave harmony across the room.',
        narrationCue: 'As the pocket mirror rests on the desk again, all threads unite into the essay’s overarching conclusion.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · CLOSING THE NOTEBOOK & NEW WONDER',
        everydayObjects: ['Notebook', 'Teacup', 'Window Sky'],
        storyBeat: 'The illustrated figure closes the notebook and looks out the window toward new questions.',
        narrationCue: 'What began with a simple teacup and morning light concludes with an open invitation to keep questioning.',
        characterPose: 'concluding',
      },
    ],
  },
  spacetime: {
    storyTitle: 'The Train Window, Station Clock & Two Pocket Watches',
    objectsSummary: 'Station wall clock · Two brass pocket watches · Train window · Coffee flask · Compass',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · SYNCING TWO WATCHES ON THE PLATFORM',
        everydayObjects: ['Station Clock', 'Two Pocket Watches', 'Coffee Cup'],
        storyBeat: 'Two symbolic illustrated travelers set their brass pocket watches to the exact same second under the station clock.',
        narrationCue: 'Our story begins on a quiet railway platform where two symbolic figures synchronize their brass pocket watches.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · THE TRAIN PULLS AWAY',
        everydayObjects: ['Train Window', 'Platform Lamps', 'Pocket Watch'],
        storyBeat: 'One figure boards the departing train while the other stays on the platform with a warm coffee cup.',
        narrationCue: 'As the train glides past glowing lamps, motion separates the two observers and sets the stage for relative time.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · CURVED TABLECLOTH & HEAVY MARBLE',
        everydayObjects: ['Tablecloth', 'Heavy Glass Sphere', 'Marble'],
        storyBeat: 'A heavy sphere placed on a stretched tablecloth bends the path of a rolling marble across the dining car table.',
        narrationCue: 'On the train table, a heavy glass sphere dips a stretched cloth and gently curves a rolling marble’s trajectory.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · TWO CLOCKS, TWO RHYTHMS',
        everydayObjects: ['Station Clock', 'Traveler Watch', 'Ruler'],
        storyBeat: 'The stationary clock ticks briskly while the moving traveler’s pocket watch sweeps at a calmer cadence.',
        narrationCue: 'Side by side, the two everyday timepieces make the article’s spacetime model immediately tangible.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · FLASHLIGHT BEAM IN THE NIGHT WINDOW',
        everydayObjects: ['Pocket Flashlight', 'Train Glass', 'Folded Map'],
        storyBeat: 'A flashlight cone reflected in the night window outlines the causal boundary between past and future.',
        narrationCue: 'A flashlight cone against the evening window illustrates the universal speed limit of light and causality.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · RECORDING TIMESTAMPS ON A TICKET',
        everydayObjects: ['Travel Journal', 'Train Ticket', 'Compass'],
        storyBeat: 'The illustrated traveler logs both watch readings on the back of a paper ticket to verify key findings.',
        narrationCue: 'Writing down the measured intervals on a ticket anchors the essay’s key findings in lived experience.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · REUNION AT THE STATION BENCH',
        everydayObjects: ['Two Pocket Watches', 'Bench', 'Thermos'],
        storyBeat: 'Reunited at the station bench, the two symbolic figures hold their watches side by side and see the elapsed difference.',
        narrationCue: 'Holding both pocket watches side by side reveals the story’s resolution: time is woven into motion and space.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · FOLDING THE MAP FOR THE NEXT JOURNEY',
        everydayObjects: ['Compass', 'Map', 'Station Lamp'],
        storyBeat: 'The symbolic traveler folds the map under the station lamp, ready for the next inquiry.',
        narrationCue: 'From two everyday pocket watches to the architecture of spacetime, the journey ends with fresh curiosity.',
        characterPose: 'concluding',
      },
    ],
  },
  consciousness: {
    storyTitle: 'The Desk Lamp, Table Mirror & Open Diary',
    objectsSummary: 'Warm desk lamp · Table mirror · Open diary · Fountain pen · Wind-up gear toy',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · QUIET EVENING STUDY DESK',
        everydayObjects: ['Desk Lamp', 'Open Diary', 'Coffee Mug'],
        storyBeat: 'A symbolic illustrated thinker sits under a warm desk lamp beside an open diary, mirror, and wind-up clockwork toy.',
        narrationCue: 'Our story opens at a quiet study desk bathed in warm lamplight, with a diary, a small mirror, and a wind-up clockwork toy.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · CLOCKWORK GEARS VS. THE MIRROR',
        everydayObjects: ['Wind-up Gears', 'Table Mirror', 'Sticky Notes'],
        storyBeat: 'Mechanical gears turn in a single fixed chain, whereas the illustrated figure gazes into the mirror and reflects.',
        narrationCue: 'On the left, a wind-up gear chain repeats fixed steps; on the right, our symbolic figure looks in the mirror and questions inner experience.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · CONNECTING PAPER NOTES INTO A WEB',
        everydayObjects: ['Paper Notes', 'Connecting Threads', 'Fountain Pen'],
        storyBeat: 'Separate paper notes across the desk link together with glowing threads into a unified web of meaning.',
        narrationCue: 'Linking scattered desk notes shows how integrated relationships—not isolated parts—create coherent meaning.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · METRONOME & UNIFIED RHYTHM',
        everydayObjects: ['Wooden Metronome', 'Notebook', 'Desk Lamp'],
        storyBeat: 'In sync with a wooden metronome, every linked note illuminates together to express integrated awareness.',
        narrationCue: 'Guided by a tabletop metronome, the essay’s formal model illustrates unified information flow.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · CHESS PIECE & BOOKSHELF',
        everydayObjects: ['Chess Knight', 'Bookshelf', 'Reading Glasses'],
        storyBeat: 'A wooden chess piece beside reading glasses contrasts rule-based computation with lived understanding.',
        narrationCue: 'Beside a wooden chess piece and open books, the story explores the boundary between calculation and conscious insight.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · UNDERLINING KEY INSIGHTS',
        everydayObjects: ['Fountain Pen', 'Highlighted Page', 'Mirror'],
        storyBeat: 'The symbolic thinker underlines the core findings in the diary, bridging reflection and evidence.',
        narrationCue: 'Each underlined sentence in the diary crystallizes the article’s key findings.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · ONE CIRCLE OF WARM LAMPLIGHT',
        everydayObjects: ['Desk Lamp', 'Open Diary', 'Warm Mug'],
        storyBeat: 'Every object on the desk gathers inside one warm pool of light as the story reaches its conclusion.',
        narrationCue: 'Under one steady circle of lamplight, the puzzle of mind, machines, and awareness reaches its holistic synthesis.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · STARLIT WINDOW & OPEN DIALOGUE',
        everydayObjects: ['Open Book', 'Pen', 'Window Stars'],
        storyBeat: 'Setting the fountain pen down, the illustrated figure gazes out at the night sky.',
        narrationCue: 'The evening study concludes with an open book and an enduring invitation to independent reflection.',
        characterPose: 'concluding',
      },
    ],
  },
  higgs: {
    storyTitle: 'The Brass Balance Scale, Honey Jar & Floating Feather',
    objectsSummary: 'Brass balance scale · Glass honey jar · Glass marble · White feather · Flashlight',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · THE BALANCE SCALE ON THE COUNTER',
        everydayObjects: ['Brass Scale', 'Glass Marble', 'Feather'],
        storyBeat: 'A symbolic illustrated figure places a glass marble and a light feather on a brass balance scale.',
        narrationCue: 'Our story opens at a bright wooden counter where a symbolic figure weighs a glass marble against a feather on a brass scale.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · DROPPING A MARBLE INTO A HONEY JAR',
        everydayObjects: ['Glass Honey Jar', 'Marble', 'Wooden Spoon'],
        storyBeat: 'Dropped into a clear honey jar, the marble slows down through resistance while a beam of light passes freely.',
        narrationCue: 'Inside a clear jar of warm honey, the marble meets gentle drag—a vivid everyday picture of how field interaction grants inertia.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · WHEN THE BALANCED SCALE TILTS',
        everydayObjects: ['Tilting Scale', 'Brass Weight', 'Table Lamp'],
        storyBeat: 'A slight nudge tips the symmetrical scale into a new, stable resting tilt.',
        narrationCue: 'One gentle touch breaks the perfect balance, guiding the system into a stable new ground state.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · RULER & STOPWATCH MEASUREMENT',
        everydayObjects: ['Wooden Ruler', 'Stopwatch', 'Glass Jar'],
        storyBeat: 'Measuring the marble’s descent with a ruler and stopwatch mirrors the article’s formal symmetry model.',
        narrationCue: 'A wooden ruler and stopwatch connect this tabletop experiment directly to the formal physics model.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · FLASHLIGHT BEAM VS. HEAVY MARBLE',
        everydayObjects: ['Flashlight', 'Glass Prism', 'Heavy Marble'],
        storyBeat: 'Light glides untouched through the jar while the marble gathers ripples of resistance around it.',
        narrationCue: 'Massless light glides effortlessly while coupled particles gather inertial weight.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · LOGGING RESULTS IN THE NOTEBOOK',
        everydayObjects: ['Notebook', 'Balance Scale', 'Pen'],
        storyBeat: 'The symbolic figure records both trials in a table, confirming the article’s core findings.',
        narrationCue: 'Recording both trials side by side distills the paper’s key findings.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · STABILITY IN THE NEW BALANCE',
        everydayObjects: ['Settled Scale', 'Honey Jar', 'Warm Light'],
        storyBeat: 'The balance scale settles calmly, showing how subtle hidden fields shape everyday weight.',
        narrationCue: 'Through a humble balance scale and honey jar, the essay’s central conclusion becomes clear.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · TIDYING THE WORKBENCH',
        everydayObjects: ['Notebook', 'Flashlight', 'Scale'],
        storyBeat: 'The illustrated figure tidies the counter and leaves the notebook open for further study.',
        narrationCue: 'Everyday weight and light leave us with a fresh window into the foundations of matter.',
        characterPose: 'concluding',
      },
    ],
  },
  holographic: {
    storyTitle: 'The Folded Postcard, Window Frame & Desk Globe',
    objectsSummary: 'Stamped postcard · Desk lamp · Window frame · Paper cube · Tabletop globe',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · A FLAT POSTCARD ON THE DESK',
        everydayObjects: ['Stamped Postcard', 'Desk Lamp', 'Book'],
        storyBeat: 'A symbolic illustrated explorer inspects a flat postcard and its sweeping 3D shadow across the desk.',
        narrationCue: 'Our story starts with a flat stamped postcard on a desk, raising an intriguing question: how can a flat surface encode a full three-dimensional world?',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · PROJECTING DEPTH WITH A DESK LAMP',
        everydayObjects: ['Desk Lamp', 'Cutout Card', 'Tabletop'],
        storyBeat: 'Held in front of a desk lamp, patterns on the flat card cast a rich 3D globe silhouette into the room.',
        narrationCue: 'Shining a warm desk lamp through the card projects volume and depth straight from a flat boundary.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · STRINGS ON A WINDOW FRAME',
        everydayObjects: ['Window Frame', 'Taut Strings', 'Paper Cube'],
        storyBeat: 'Strings tied to the outer window frame suspend a paper cube cleanly at the center.',
        narrationCue: 'Every knot along the window border governs a point inside, mirroring boundary-to-bulk correspondence.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · COUNTING SQUARES ON A TRANSPARENT GRID',
        everydayObjects: ['Transparent Grid', 'Desk Globe', 'Pencil'],
        storyBeat: 'Counting tiny squares across the surface illustrates how boundary area limits information.',
        narrationCue: 'A simple transparent grid on the globe brings the entropy-area principle down to earth.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · WRAPPING A FLAT MAP AROUND A GLOBE',
        everydayObjects: ['Folded Map', 'Tabletop Globe', 'Magnifier'],
        storyBeat: 'Wrapping a flat paper map around a desk globe dramatizes geometric encoding of information.',
        narrationCue: 'Folding a flat map around a sphere shows how information stays preserved across dimensions.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · ENVELOPE LABELS & CORE FINDINGS',
        everydayObjects: ['Envelope', 'Postcard', 'Notebook'],
        storyBeat: 'Matching the envelope markings with the inner sketch confirms the essay’s key findings.',
        narrationCue: 'Just as an envelope’s boundary lines organize its contents, the article’s key findings lock together.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · ONE WINDOW, ONE UNIFIED PICTURE',
        everydayObjects: ['Desk Globe', 'Sunlight', 'Postcard'],
        storyBeat: 'Sunlight joins postcard and globe in one frame as the narrative reaches its conclusion.',
        narrationCue: 'From a flat postcard to a full tabletop globe, the story reaches the article’s unified conclusion.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · POSTCARD AS A BOOKMARK',
        everydayObjects: ['Closed Book', 'Postcard', 'Lamp'],
        storyBeat: 'The illustrated figure tucks the postcard into a book as a bookmark for the next exploration.',
        narrationCue: 'Tucked safely inside a book, our everyday postcard marks the start of the reader’s own inquiry.',
        characterPose: 'concluding',
      },
    ],
  },
  chaos: {
    storyTitle: 'One Raindrop, a Pendulum Clock & Two Paper Boats',
    objectsSummary: 'Pendulum clock · Two folded paper boats · Water basin · Wooden dominoes · Umbrella',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · TWO PAPER BOATS ON A GARDEN BASIN',
        everydayObjects: ['Two Paper Boats', 'Water Basin', 'Pendulum Clock'],
        storyBeat: 'A symbolic illustrated figure places two identical folded paper boats side by side on a calm water basin.',
        narrationCue: 'Our story begins beside a garden table where our symbolic figure launches two identical paper boats side by side.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · A SINGLE RAINDROP NUDGE',
        everydayObjects: ['Raindrop', 'Water Ripples', 'Paper Boats'],
        storyBeat: 'One tiny raindrop lands near the first boat, shifting it by barely a millimeter.',
        narrationCue: 'The turning point is almost invisible: a single raindrop nudges one paper boat by a single millimeter.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · DOMINOES & DIVERGING PATHS',
        everydayObjects: ['Wooden Dominoes', 'Paper Boats', 'Leaf'],
        storyBeat: 'As ripples curl across the basin, the two boats drift toward opposite corners while wooden dominoes cascade.',
        narrationCue: 'That millimeter difference snowballs into two completely distinct trajectories—just like a cascading row of dominoes.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · STEADY PENDULUM, WILD PATHS',
        everydayObjects: ['Pendulum Clock', 'Ruler', 'Sketchbook'],
        storyBeat: 'Even while the pendulum clock ticks by strict law, the distance between the two boats multiplies rapidly.',
        narrationCue: 'Beside a steady pendulum clock, we see how strict rules can still produce sensitive, unpredictable paths.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · BUTTERFLY PATTERNS IN THE WATER',
        everydayObjects: ['Water Swirl', 'Two Paper Boats', 'Umbrella'],
        storyBeat: 'Rather than pure disorder, the boats trace graceful double-looped currents shaped like butterfly wings.',
        narrationCue: 'Inside apparent turbulence hides structured geometry—capturing the essay’s deeper complexity analysis.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · TRACING BOTH ROUTES IN TWO COLORS',
        everydayObjects: ['Sketchbook', 'Two Pencils', 'Domino'],
        storyBeat: 'The symbolic figure sketches both boat paths in blue and amber pencil to highlight the key findings.',
        narrationCue: 'Tracing both diverging paths side by side highlights the article’s core findings.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · AFTER THE RAIN CLEARS',
        everydayObjects: ['Umbrella', 'Calm Water', 'Two Boats'],
        storyBeat: 'As the rain clears, order and openness harmonize into the story’s concluding insight.',
        narrationCue: 'When the rain settles, the harmony between lawful order and an open future completes the story.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · FOLDING A NEW PAPER BOAT',
        everydayObjects: ['Folded Paper', 'Pendulum Clock', 'Window'],
        storyBeat: 'The illustrated figure folds a fresh paper boat, inviting the viewer to reflect on small choices.',
        narrationCue: 'From two paper boats and one raindrop, the inquiry continues in everyday decisions.',
        characterPose: 'concluding',
      },
    ],
  },
  software: {
    storyTitle: 'The Kitchen Table, Fruit Bowl & Daily Smart Planner',
    objectsSummary: 'Fresh fruit bowl · Water glass · Kitchen timer · Laptop checklist · Daily notebook',
    acts: [
      {
        actIndex: 0,
        settingLabel: 'ACT 1 · SUNLIT KITCHEN TABLE START',
        everydayObjects: ['Fruit Bowl', 'Water Glass', 'Laptop'],
        storyBeat: 'A symbolic illustrated person begins the morning at a sunlit kitchen table with a fresh fruit bowl, water glass, and planner.',
        narrationCue: 'Our story starts at a sunlit kitchen table where our symbolic figure organizes daily nutrition and wellbeing with a calm digital planner.',
        characterPose: 'observing',
      },
      {
        actIndex: 1,
        settingLabel: 'ACT 2 · MEASURING DAILY BALANCE',
        everydayObjects: ['Kitchen Scale', 'Bowl & Spoon', 'Checklist'],
        storyBeat: 'Each glass of water and balanced bowl updates clean visual balance meters on the tabletop laptop.',
        narrationCue: 'Everyday kitchen choices map smoothly into clear, actionable balance indicators.',
        characterPose: 'pointing',
      },
      {
        actIndex: 2,
        settingLabel: 'ACT 3 · KITCHEN TIMER & SMART FLOW',
        everydayObjects: ['Kitchen Timer', 'Laptop Screen', 'Notebook'],
        storyBeat: 'When the kitchen timer chimes, the planner offers a simple, personalized next step.',
        narrationCue: 'An everyday kitchen timer illustrates how adaptive software supports sustainable daily habits.',
        characterPose: 'measuring',
      },
      {
        actIndex: 3,
        settingLabel: 'ACT 4 · FOUR-STAGE WELLNESS MODEL',
        everydayObjects: ['Balance Chart', 'Water Glass', 'Fruit Bowl'],
        storyBeat: 'The illustrated character walks through four tidy stages from daily input to mindful feedback.',
        narrationCue: 'Four structured stages turn everyday observations into steady, measurable guidance.',
        characterPose: 'measuring',
      },
      {
        actIndex: 4,
        settingLabel: 'ACT 5 · SPOTTING A SMALL IMBALANCE EARLY',
        everydayObjects: ['Reminder Card', 'Fruit Bowl', 'Water Pitcher'],
        storyBeat: 'A missed glass of water lights up gently on screen, prompting an effortless adjustment.',
        narrationCue: 'Spotting small gaps early makes healthy balance easy to maintain without stress.',
        characterPose: 'discovering',
      },
      {
        actIndex: 5,
        settingLabel: 'ACT 6 · WEEKLY CHECKLIST REVIEW',
        everydayObjects: ['Checklist', 'Pen', 'Laptop'],
        storyBeat: 'Reviewing completed checkboxes confirms the essay’s practical takeaways.',
        narrationCue: 'A glance at the weekly checklist confirms how practical design serves real everyday life.',
        characterPose: 'pointing',
      },
      {
        actIndex: 6,
        settingLabel: 'ACT 7 · SUSTAINABLE EVERYDAY HARMONY',
        everydayObjects: ['Fresh Bowl', 'Water Glass', 'Open Window'],
        storyBeat: 'The kitchen table radiates calm balance—technology serving human wellbeing quietly.',
        narrationCue: 'The story concludes with calm harmony between everyday objects and thoughtful software.',
        characterPose: 'reflecting',
      },
      {
        actIndex: 7,
        settingLabel: 'ACT 8 · STEPPING INTO A BRIGHT DAY',
        everydayObjects: ['Planner', 'Coffee Cup', 'Morning Sun'],
        storyBeat: 'The illustrated figure closes the laptop and steps toward a balanced day.',
        narrationCue: 'With the planner closed and the day underway, the insights carry directly into daily life.',
        characterPose: 'concluding',
      },
    ],
  },
};

export function getEverydayStoryProfile(
  simType: SimulationType,
  language: LanguageCode
): EverydayStoryProfile {
  const base =
    language === 'tr'
      ? STORY_TEMPLATES_TR[simType] || STORY_TEMPLATES_TR.consciousness
      : STORY_TEMPLATES_EN[simType] || STORY_TEMPLATES_EN.consciousness;
  return {
    theme: simType,
    storyTitle: base.storyTitle,
    objectsSummary: base.objectsSummary,
    symbolicFigureNotice: getSymbolicFigureKvkkNotice(language),
    acts: base.acts,
  };
}

/**
 * Draws a strictly non-photographic, stylized geometric editorial illustration
 * of a symbolic human figure (ZERO real-person likeness or biometrics — KVKK/GDPR safe).
 */
export function drawSymbolicHumanFigure(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  pose: EverydayStoryAct['characterPose'],
  phase: number,
  coatColor = '#38BDF8',
  accentColor = '#FBBF24'
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const breathe = Math.sin(phase * 1.9) * 1.8;
  const headTilt =
    pose === 'observing'
      ? Math.sin(phase * 1.2) * 0.08
      : pose === 'discovering'
        ? -0.07 + Math.sin(phase * 2.2) * 0.05
        : pose === 'reflecting'
          ? 0.06
          : 0;

  // Soft ground shadow
  ctx.fillStyle = 'rgba(2, 6, 23, 0.42)';
  ctx.beginPath();
  ctx.ellipse(0, 56, 22, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (simple stylized editorial lines)
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-7, 26);
  ctx.lineTo(-10, 53);
  ctx.moveTo(7, 26);
  ctx.lineTo(10, 53);
  ctx.stroke();

  // Stylized geometric torso / coat (symbolic silhouette)
  ctx.fillStyle = coatColor;
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-16, 28 + breathe * 0.4);
  ctx.quadraticCurveTo(-17, -4 + breathe, 0, -8 + breathe);
  ctx.quadraticCurveTo(17, -4 + breathe, 16, 28 + breathe * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Scarf / collar accent
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.roundRect(-10, -8 + breathe, 20, 6, 3);
  ctx.fill();

  // Animated articulated arms based on story pose
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 3.8;
  ctx.lineCap = 'round';
  // Back/left arm
  ctx.beginPath();
  ctx.moveTo(-12, 2 + breathe);
  if (pose === 'reflecting' || pose === 'concluding') {
    ctx.lineTo(-22, 16 + breathe);
    ctx.lineTo(-12, 20 + breathe);
  } else {
    ctx.lineTo(-23, 18 + breathe);
  }
  ctx.stroke();

  // Front/right gesture arm
  const wave = Math.sin(phase * 2.4) * 4;
  ctx.beginPath();
  ctx.moveTo(12, 2 + breathe);
  if (pose === 'pointing') {
    ctx.lineTo(28, -4 + breathe + wave * 0.4);
    ctx.lineTo(40, -10 + breathe + wave * 0.5);
  } else if (pose === 'measuring') {
    ctx.lineTo(26, 8 + breathe);
    ctx.lineTo(36, 2 + breathe + wave * 0.35);
  } else if (pose === 'discovering') {
    ctx.lineTo(25, -14 + breathe + wave * 0.4);
    ctx.lineTo(32, -24 + breathe + wave * 0.4);
  } else if (pose === 'concluding') {
    ctx.lineTo(24, 14 + breathe);
    ctx.lineTo(18, 22 + breathe);
  } else {
    ctx.lineTo(25, 10 + breathe);
    ctx.lineTo(32, 6 + breathe + wave * 0.25);
  }
  ctx.stroke();

  // Stylized geometric symbolic head (pure minimalist illustration, NO photorealistic face)
  ctx.save();
  ctx.translate(0, -23 + breathe);
  ctx.rotate(headTilt);

  ctx.fillStyle = '#FDE68A';
  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 12.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Simple stylized hair cap arc (non-identifiable storybook illustration)
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(0, -2, 12.2, Math.PI * 1.05, Math.PI * 1.98);
  ctx.closePath();
  ctx.fill();

  // Minimalist illustrated glasses/gaze dots (symbolic only)
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(3.5, 1, 3.2, 0, Math.PI * 2);
  ctx.stroke();

  // Thought spark on discovery scenes
  if (pose === 'discovering' || pose === 'pointing') {
    const sparkAlpha = (0.55 + 0.45 * Math.sin(phase * 3.5)).toFixed(2);
    ctx.strokeStyle = `rgba(251, 191, 36, ${sparkAlpha})`;
    ctx.lineWidth = 1.6;
    for (let k = 0; k < 4; k++) {
      const a = -Math.PI * 0.75 + k * 0.35;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 16, Math.sin(a) * 16);
      ctx.lineTo(Math.cos(a) * 22, Math.sin(a) * 22);
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.restore();
}

/**
 * Draws a compact symbolic figure emblem inside the circular avatar slot
 * (completely replaces any real-person photograph).
 */
export function drawSymbolicAvatarEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  phase: number
): void {
  ctx.save();
  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#10B981';
  ctx.fill();

  // Clipped illustrated scene inside circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const bg = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
  bg.addColorStop(0, '#0F172A');
  bg.addColorStop(1, '#1E3A8A');
  ctx.fillStyle = bg;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  // Subtle illustrated lamp glow
  const glow = ctx.createRadialGradient(cx + 12, cy - 12, 2, cx + 12, cy - 12, 26);
  glow.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
  glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  // Stylized symbolic figure bust (non-photographic)
  drawSymbolicHumanFigure(ctx, cx - 2, cy + 12, 0.56, 'observing', phase, '#38BDF8', '#FBBF24');

  // Tiny open book icon at bottom right
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(cx + 6, cy + 12, 14, 9);
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + 13, cy + 12);
  ctx.lineTo(cx + 13, cy + 21);
  ctx.stroke();

  ctx.restore();
}

function drawSteamingCup(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number, label?: string) {
  ctx.save();
  // Saucer
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.ellipse(x, y + 14, 18, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Cup body
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x - 13, y - 6, 26, 19, [2, 2, 8, 8]);
  ctx.fill();
  ctx.stroke();
  // Handle
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x + 13, y + 3, 5.5, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Tea/coffee surface
  ctx.fillStyle = '#B45309';
  ctx.beginPath();
  ctx.ellipse(x, y - 5, 11, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Animated rising steam curls
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
  ctx.lineWidth = 1.4;
  for (let s = -1; s <= 1; s++) {
    const offset = Math.sin(phase * 2.4 + s * 1.4) * 3.5;
    ctx.beginPath();
    ctx.moveTo(x + s * 5, y - 10);
    ctx.quadraticCurveTo(x + s * 5 + offset, y - 19, x + s * 5 - offset * 0.7, y - 28);
    ctx.stroke();
  }
  if (label) {
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + 27);
  }
  ctx.restore();
}

function drawDeskLamp(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number) {
  ctx.save();
  // Warm light cone
  const pulse = 0.16 + 0.04 * Math.sin(phase * 2);
  const cone = ctx.createLinearGradient(x - 14, y - 34, x - 34, y + 54);
  cone.addColorStop(0, `rgba(253, 224, 71, ${(pulse + 0.14).toFixed(2)})`);
  cone.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 28);
  ctx.lineTo(x - 68, y + 48);
  ctx.lineTo(x + 12, y + 48);
  ctx.lineTo(x - 4, y - 28);
  ctx.closePath();
  ctx.fill();

  // Base
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.roundRect(x - 12, y + 34, 28, 7, 3);
  ctx.fill();
  // Arm
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 34);
  ctx.lineTo(x + 10, y - 4);
  ctx.lineTo(x - 10, y - 32);
  ctx.stroke();
  // Lamp shade
  ctx.fillStyle = '#F59E0B';
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x - 20, y - 24);
  ctx.lineTo(x - 4, y - 36);
  ctx.lineTo(x + 2, y - 26);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawOpenNotebook(ctx: CanvasRenderingContext2D, x: number, y: number, phase: number) {
  ctx.save();
  // Cover
  ctx.fillStyle = '#1E3A8A';
  ctx.fillRect(x - 32, y - 14, 64, 30);
  // Left & right pages
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(x - 29, y - 12, 27, 25);
  ctx.fillRect(x + 2, y - 12, 27, 25);
  // Animated written lines
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.2;
  const lineReveal = Math.floor((phase * 1.4) % 5) + 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 25, y - 7 + i * 5);
    ctx.lineTo(x - 6, y - 7 + i * 5);
    ctx.stroke();
    if (i < lineReveal) {
      ctx.strokeStyle = i === 1 ? '#0284C7' : '#64748B';
      ctx.beginPath();
      ctx.moveTo(x + 6, y - 7 + i * 5);
      ctx.lineTo(x + 24, y - 7 + i * 5);
      ctx.stroke();
      ctx.strokeStyle = '#64748B';
    }
  }
  ctx.restore();
}

function drawWallOrPocketClock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  angle: number,
  rimColor: string,
  label?: string
) {
  ctx.save();
  ctx.fillStyle = '#0F172A';
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Clock ticks
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.55)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r - 4), y + Math.sin(a) * (r - 4));
    ctx.lineTo(x + Math.cos(a) * (r - 1.5), y + Math.sin(a) * (r - 1.5));
    ctx.stroke();
  }
  // Minute & hour hands
  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle - Math.PI / 2) * (r - 5), y + Math.sin(angle - Math.PI / 2) * (r - 5));
  ctx.stroke();
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle * 0.25 - Math.PI / 2) * (r - 9), y + Math.sin(angle * 0.25 - Math.PI / 2) * (r - 9));
  ctx.stroke();
  if (label) {
    ctx.fillStyle = rimColor;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + r + 12);
  }
  ctx.restore();
}

function drawPaperBoat(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, tilt: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 1.2;
  // Hull
  ctx.beginPath();
  ctx.moveTo(-16, 0);
  ctx.lineTo(16, 0);
  ctx.lineTo(10, 8);
  ctx.lineTo(-10, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Sail triangle
  ctx.beginPath();
  ctx.moveTo(-9, 0);
  ctx.lineTo(0, -13);
  ctx.lineTo(9, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * Renders an animated everyday-life narrative stage containing recognizable
 * daily objects + stylized symbolic human figures (ZERO real-person photos).
 */
export function drawEverydayNarrativeStage(params: {
  ctx: CanvasRenderingContext2D;
  simType: SimulationType;
  sceneIndex: number;
  stageX: number;
  stageY: number;
  stageW: number;
  animH: number;
  phase: number;
  sceneProgress: number;
  probeBoost: number;
  act: EverydayStoryAct;
  chips: string[];
  language?: LanguageCode;
}): void {
  const {
    ctx,
    simType,
    sceneIndex,
    stageX,
    stageY,
    stageW,
    animH,
    phase,
    sceneProgress,
    probeBoost,
    act,
    chips,
    language = 'tr',
  } = params;

  const cx = stageX + stageW / 2;
  const tableY = stageY + animH - 54;
  const chip0 = chips[0] || act.everydayObjects[0] || '';
  const chip1 = chips[1] || act.everydayObjects[1] || '';

  ctx.save();

  // Warm illustrated indoor/window wall backdrop
  const roomGrad = ctx.createLinearGradient(stageX, stageY + 26, stageX, stageY + animH);
  roomGrad.addColorStop(0, '#121E36');
  roomGrad.addColorStop(0.68, '#192946');
  roomGrad.addColorStop(1, '#1E293B');
  ctx.fillStyle = roomGrad;
  ctx.fillRect(stageX + 3, stageY + 26, stageW - 6, animH - 26);

  // Wooden tabletop / floor horizon across all everyday scenes
  const woodGrad = ctx.createLinearGradient(stageX, tableY, stageX, stageY + animH);
  woodGrad.addColorStop(0, '#47362A');
  woodGrad.addColorStop(1, '#2B211A');
  ctx.fillStyle = woodGrad;
  ctx.fillRect(stageX + 3, tableY, stageW - 6, stageY + animH - tableY);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(stageX + 3, tableY);
  ctx.lineTo(stageX + stageW - 3, tableY);
  ctx.stroke();

  // Everyday object chips strip along top of stage
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.fillRect(stageX + 8, stageY + 30, stageW - 16, 18);
  ctx.fillStyle = '#FCD34D';
  ctx.font = 'bold 9.5px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `${act.settingLabel}  ·  ${act.everydayObjects.join(' · ')}`.slice(0, 74),
    stageX + 14,
    stageY + 42
  );

  if (simType === 'quantum') {
    // Sunlit window with Venetian blinds on left casting two light beams onto teacup & notebook
    const winX = stageX + 24;
    const winY = stageY + 56;
    ctx.fillStyle = '#0C4A6E';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.fillRect(winX, winY, 74, 96);
    ctx.strokeRect(winX, winY, 74, 96);

    // Blinds slats leaving 2 bright slits
    ctx.fillStyle = '#334155';
    for (let s = 0; s < 6; s++) {
      if (s === 2 || s === 4) continue;
      ctx.fillRect(winX + 2, winY + 4 + s * 15, 70, 10);
    }

    const mirrorActive = sceneIndex >= 2 && sceneIndex <= 5;
    // Two warm sunbeams passing through the 2 blind slits
    const beamAlpha = mirrorActive ? 0.24 : 0.18 + 0.05 * Math.sin(phase * 2);
    ctx.fillStyle = `rgba(253, 224, 71, ${beamAlpha.toFixed(2)})`;
    ctx.beginPath();
    ctx.moveTo(winX + 74, winY + 34);
    ctx.lineTo(stageX + 295, tableY - 4);
    ctx.lineTo(stageX + 245, tableY + 4);
    ctx.lineTo(winX + 74, winY + 48);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(winX + 74, winY + 64);
    ctx.lineTo(stageX + 325, tableY - 2);
    ctx.lineTo(stageX + 275, tableY + 6);
    ctx.lineTo(winX + 74, winY + 78);
    ctx.closePath();
    ctx.fill();

    // Ripple rings on the teacup & desk surface
    const cupX = stageX + 258;
    const cupY = tableY - 8;
    for (let r = 0; r < 4; r++) {
      const rr = 14 + ((phase * 18 + r * 14) % 52) + probeBoost * 10;
      const alpha = Math.max(0.05, 0.55 - rr / 110);
      ctx.strokeStyle = mirrorActive
        ? `rgba(251, 191, 36, ${alpha.toFixed(2)})`
        : `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(cupX, cupY - 4, rr, rr * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    drawSteamingCup(ctx, cupX, cupY, phase, act.everydayObjects[0]);
    drawOpenNotebook(ctx, stageX + 160, tableY + 8, phase);

    // Glass prism on desk
    ctx.fillStyle = 'rgba(125, 211, 252, 0.45)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(stageX + 318, tableY + 12);
    ctx.lineTo(stageX + 336, tableY - 16);
    ctx.lineTo(stageX + 354, tableY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Symbolic illustrated observer figure on right side of desk
    drawSymbolicHumanFigure(ctx, stageX + 412, tableY - 12, 0.96, act.characterPose, phase, '#0284C7', '#FBBF24');

    // Pocket mirror held up during turning-point scenes
    if (mirrorActive) {
      ctx.save();
      ctx.translate(stageX + 368, tableY - 30 + Math.sin(phase * 2) * 3);
      ctx.rotate(-0.25);
      ctx.fillStyle = '#E0F2FE';
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  } else if (simType === 'spacetime') {
    // Illustrated train carriage window with gliding city/station lamps outside
    const winX = stageX + 26;
    const winY = stageY + 56;
    const winW = 240;
    const winH = 92;
    ctx.fillStyle = '#0B1120';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(winX, winY, winW, winH, 8);
    ctx.fill();
    ctx.stroke();

    // Moving night lamps & horizon outside train window
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(winX + 2, winY + 2, winW - 4, winH - 4, 6);
    ctx.clip();
    const speed = sceneIndex >= 1 && sceneIndex <= 5 ? 48 : 12;
    for (let i = 0; i < 6; i++) {
      const lx = winX + winW - (((phase * speed + i * 52) % (winW + 40)) - 20);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, winY + winH);
      ctx.lineTo(lx, winY + 30);
      ctx.stroke();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(lx, winY + 28, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Stretched tablecloth dip & marble in center
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let px = -75; px <= 75; px += 5) {
      const dip = Math.exp(-(px * px) / 950) * (16 + probeBoost * 8);
      if (px === -75) ctx.moveTo(stageX + 145 + px, tableY + 4 + dip);
      else ctx.lineTo(stageX + 145 + px, tableY + 4 + dip);
    }
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(stageX + 145, tableY + 12, 9, 0, Math.PI * 2);
    ctx.fill();

    // Two everyday clocks: Station wall clock (faster) vs Traveler pocket watch (slower)
    drawWallOrPocketClock(ctx, stageX + 318, stageY + 96, 22, phase * 2.4, '#38BDF8', chip0.slice(0, 12));
    drawWallOrPocketClock(ctx, stageX + 372, tableY - 4, 17, phase * 0.9, '#34D399', chip1.slice(0, 12));

    drawSteamingCup(ctx, stageX + 64, tableY - 6, phase);
    // Two symbolic illustrated travelers (platform friend + train traveler)
    drawSymbolicHumanFigure(ctx, stageX + 298, tableY - 10, 0.88, act.characterPose, phase, '#0EA5E9', '#FBBF24');
    drawSymbolicHumanFigure(ctx, stageX + 422, tableY - 10, 0.94, sceneIndex >= 6 ? 'reflecting' : 'observing', phase + 1.1, '#10B981', '#FDE68A');
  } else if (simType === 'consciousness') {
    // Desk lamp illuminating open diary, table mirror, wind-up gear toy, and linked paper notes
    drawDeskLamp(ctx, stageX + 440, tableY - 34, phase);

    // Wind-up mechanical gears on left (contrast)
    const gearX = stageX + 70;
    const gearY = tableY - 30;
    for (let g = 0; g < 2; g++) {
      const gx = gearX + g * 26;
      const gy = gearY + g * 12;
      const rot = phase * (g === 0 ? 1.5 : -1.5);
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(rot);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.stroke();
      for (let t = 0; t < 6; t++) {
        const a = (t / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 11, Math.sin(a) * 11);
        ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Floating linked paper notes above the desk forming a glowing web of meaning
    const notePts = [
      { x: stageX + 165, y: stageY + 86 },
      { x: stageX + 235, y: stageY + 74 },
      { x: stageX + 290, y: stageY + 102 },
      { x: stageX + 205, y: stageY + 126 },
      { x: stageX + 265, y: stageY + 138 },
    ];
    for (let i = 0; i < notePts.length; i++) {
      for (let j = i + 1; j < notePts.length; j++) {
        const alpha = 0.22 + 0.45 * Math.abs(Math.sin(phase * 1.3 + i + j));
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(2)})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(notePts[i].x, notePts[i].y);
        ctx.lineTo(notePts[j].x, notePts[j].y);
        ctx.stroke();
      }
    }
    notePts.forEach((p, idx) => {
      const lit = Math.floor(phase * 1.8) % notePts.length === idx;
      ctx.fillStyle = lit ? '#FDE68A' : '#E2E8F0';
      ctx.strokeStyle = lit ? '#F59E0B' : '#64748B';
      ctx.lineWidth = 1.4;
      ctx.fillRect(p.x - 10, p.y - 8, 20, 16);
      ctx.strokeRect(p.x - 10, p.y - 8, 20, 16);
    });

    // Standing tabletop mirror
    ctx.fillStyle = 'rgba(186, 230, 253, 0.72)';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(stageX + 334, tableY - 24, 15, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(stageX + 334, tableY);
    ctx.lineTo(stageX + 334, tableY + 12);
    ctx.moveTo(stageX + 322, tableY + 12);
    ctx.lineTo(stageX + 346, tableY + 12);
    ctx.stroke();

    drawOpenNotebook(ctx, stageX + 240, tableY + 6, phase);
    drawSteamingCup(ctx, stageX + 148, tableY - 4, phase);
    drawSymbolicHumanFigure(ctx, stageX + 394, tableY - 12, 0.96, act.characterPose, phase, '#6366F1', '#FBBF24');
  } else if (simType === 'higgs') {
    // Brass kitchen balance scale + clear glass honey jar with sinking marble + flashlight beam
    const scaleX = stageX + 126;
    const scaleBaseY = tableY + 10;
    const tilt = sceneIndex >= 2 ? 0.24 + Math.sin(phase * 1.4) * 0.05 : Math.sin(phase * 1.2) * 0.06;

    // Scale pillar
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(scaleX - 24, scaleBaseY);
    ctx.lineTo(scaleX + 24, scaleBaseY);
    ctx.moveTo(scaleX, scaleBaseY);
    ctx.lineTo(scaleX, scaleBaseY - 72);
    ctx.stroke();

    // Tilting beam & pans
    ctx.save();
    ctx.translate(scaleX, scaleBaseY - 68);
    ctx.rotate(tilt);
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-48, 0);
    ctx.lineTo(48, 0);
    ctx.stroke();
    // Left pan (feather)
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-48, 0);
    ctx.lineTo(-48, 28);
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-62, 28, 28, 5);
    // Feather glyph
    ctx.strokeStyle = '#E0F2FE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-56, 25);
    ctx.quadraticCurveTo(-48, 12, -39, 23);
    ctx.stroke();
    // Right pan (marble)
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(48, 0);
    ctx.lineTo(48, 28);
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(34, 28, 28, 5);
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(48, 21, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Clear glass jar filled with warm golden honey
    const jarX = stageX + 266;
    const jarY = tableY - 66;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.32)';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(jarX - 28, jarY, 56, 76, 8);
    ctx.fill();
    ctx.stroke();
    // Jar lid
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(jarX - 22, jarY - 9, 44, 9);
    // Slowly sinking glass marble inside honey jar
    const dropFrac = (phase * 0.22 + sceneProgress * 0.5) % 1;
    const mY = jarY + 14 + dropFrac * 50;
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(jarX, mY, 8, 0, Math.PI * 2);
    ctx.fill();
    // Flashlight beam passing effortlessly above jar
    const beamX = stageX + 22 + ((phase * 85) % 290);
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(beamX, stageY + 64);
    ctx.lineTo(beamX + 34, stageY + 64);
    ctx.stroke();

    drawOpenNotebook(ctx, stageX + 340, tableY + 8, phase);
    drawSymbolicHumanFigure(ctx, stageX + 414, tableY - 12, 0.96, act.characterPose, phase, '#0D9488', '#FBBF24');
  } else if (simType === 'holographic') {
    // Desk lamp projecting a flat stamped postcard into a glowing 3D tabletop globe
    drawDeskLamp(ctx, stageX + 58, tableY - 34, phase);

    // Flat postcard held upright on stand
    const cardX = stageX + 138;
    const cardY = tableY - 36;
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.fillRect(cardX - 18, cardY - 26, 36, 50);
    ctx.strokeRect(cardX - 18, cardY - 26, 36, 50);
    // Stamp corner on postcard
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(cardX + 4, cardY - 22, 10, 10);

    // Projection rays from flat postcard to 3D globe
    const globeX = stageX + 278;
    const globeY = tableY - 40;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.beginPath();
    ctx.moveTo(cardX + 18, cardY - 24);
    ctx.lineTo(globeX, globeY - 42);
    ctx.lineTo(globeX, globeY + 42);
    ctx.lineTo(cardX + 18, cardY + 22);
    ctx.closePath();
    ctx.fill();

    // Tabletop globe with rotating longitude curves
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(globeX, globeY, 38 + probeBoost * 4, 0, Math.PI * 2);
    ctx.stroke();
    for (let k = -2; k <= 2; k++) {
      const rx = Math.max(4, Math.abs(Math.cos(phase * 0.4 + k * 0.55)) * 36);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(globeX, globeY, rx, 37, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Globe stand
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(globeX, globeY + 38);
    ctx.lineTo(globeX, tableY + 8);
    ctx.moveTo(globeX - 18, tableY + 8);
    ctx.lineTo(globeX + 18, tableY + 8);
    ctx.stroke();

    drawOpenNotebook(ctx, stageX + 198, tableY + 8, phase);
    drawSymbolicHumanFigure(ctx, stageX + 404, tableY - 12, 0.96, act.characterPose, phase, '#0284C7', '#34D399');
  } else if (simType === 'chaos') {
    // Wall pendulum clock + garden water basin with two diverging paper boats + falling raindrop + dominoes
    const clockX = stageX + 66;
    const clockY = stageY + 84;
    drawWallOrPocketClock(ctx, clockX, clockY, 18, phase * 1.4, '#FBBF24');
    // Swinging pendulum bob below clock
    const swing = Math.sin(phase * 2.4) * 0.38;
    const bobX = clockX + Math.sin(swing) * 38;
    const bobY = clockY + 18 + Math.cos(swing) * 38;
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(clockX, clockY + 18);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Water basin on garden table
    const basinX = stageX + 230;
    const basinY = tableY - 12;
    ctx.fillStyle = '#0C4A6E';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(basinX, basinY, 108, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Falling raindrop creating ripple on left boat
    const dropY = stageY + 54 + ((phase * 70) % 78);
    ctx.fillStyle = '#7DD3FC';
    ctx.beginPath();
    ctx.arc(basinX - 30, dropY, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Two diverging folded paper boats
    const diverge = Math.min(1, 0.15 + sceneIndex * 0.13 + probeBoost * 0.25);
    const boat1X = basinX - 18 - diverge * 54 + Math.sin(phase * 1.5) * 6;
    const boat1Y = basinY - 4 - diverge * 10 + Math.cos(phase * 2) * 3;
    const boat2X = basinX + 14 + diverge * 58 + Math.cos(phase * 1.4) * 6;
    const boat2Y = basinY + 2 + diverge * 10 + Math.sin(phase * 1.8) * 3;

    // Dashed separation line between the two boats
    ctx.strokeStyle = 'rgba(251, 113, 133, 0.72)';
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(boat1X, boat1Y);
    ctx.lineTo(boat2X, boat2Y);
    ctx.stroke();
    ctx.setLineDash([]);

    drawPaperBoat(ctx, boat1X, boat1Y, '#38BDF8', Math.sin(phase * 2) * 0.12);
    drawPaperBoat(ctx, boat2X, boat2Y, '#FBBF24', Math.cos(phase * 2.2) * 0.14);

    // Row of small wooden dominoes on right front
    for (let d = 0; d < 4; d++) {
      const dx = stageX + 332 + d * 12;
      const tiltDom = sceneIndex >= 2 ? 0.35 + d * 0.08 : 0;
      ctx.save();
      ctx.translate(dx, tableY + 8);
      ctx.rotate(tiltDom);
      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(-3, -18, 6, 18);
      ctx.restore();
    }

    drawSymbolicHumanFigure(ctx, stageX + 416, tableY - 12, 0.96, act.characterPose, phase, '#0EA5E9', '#FB7185');
  } else {
    // Software / Healthy Nutrition everyday kitchen table: laptop planner, fruit bowl, water glass, kitchen timer
    // Laptop on tabletop
    const lapX = stageX + 116;
    const lapY = tableY - 4;
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.fillRect(lapX - 44, lapY - 56, 88, 54);
    ctx.strokeRect(lapX - 44, lapY - 56, 88, 54);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(lapX - 54, lapY - 2, 108, 7);
    // Live wellness progress bars inside laptop screen
    for (let b = 0; b < 3; b++) {
      const barW = 28 + Math.round(((Math.sin(phase * 1.4 + b) + 1) / 2) * 40);
      ctx.fillStyle = b === 0 ? '#34D399' : b === 1 ? '#38BDF8' : '#FBBF24';
      ctx.fillRect(lapX - 34, lapY - 46 + b * 14, barW, 8);
    }

    // Fresh fruit bowl on table
    const bowlX = stageX + 236;
    const bowlY = tableY - 4;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(bowlX - 10, bowlY - 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(bowlX + 6, bowlY - 14, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.arc(bowlX - 1, bowlY - 20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(bowlX, bowlY - 10, 24, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Clear water glass
    const glX = stageX + 296;
    const glY = tableY - 22;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.fillRect(glX - 8, glY + 6, 16, 22);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(glX - 9, glY, 18, 28);

    // Kitchen timer
    drawWallOrPocketClock(ctx, stageX + 344, tableY - 16, 16, phase * 1.6, '#34D399');

    drawSymbolicHumanFigure(ctx, stageX + 414, tableY - 12, 0.96, act.characterPose, phase, '#10B981', '#FBBF24');
  }

  // On Chapter 2 (sceneIndex === 1) or Chapter 3 (sceneIndex === 2), overlay a crisp symbolic
  // "Previous Scientists' Perspectives" medallion ribbon (zero real-person photos)
  if (sceneIndex === 1 || sceneIndex === 2) {
    const hist = getHistoricalScientistsForTheme(simType, language);
    const ribbonX = stageX + 10;
    const ribbonY = stageY + 46;
    const ribbonW = stageW - 20;
    const ribbonH = 44;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.86)';
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(ribbonX, ribbonY, ribbonW, ribbonH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 8.5px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(
      language === 'tr' ? '★ ÖNCEKİ BİLİM İNSANLARI NE DÜŞÜNDÜ?' : '★ WHAT PREVIOUS SCIENTISTS THOUGHT',
      ribbonX + 10,
      ribbonY + 13
    );

    const colW = (ribbonW - 20) / 3;
    hist.thinkers.forEach((t, ti) => {
      const cx = ribbonX + 10 + ti * colW;
      // Symbolic initials medallion (pure geometric circle, zero real photos)
      ctx.fillStyle = t.accentColor;
      ctx.beginPath();
      ctx.arc(cx + 10, ribbonY + 29, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.monogram, cx + 10, ribbonY + 32);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.textAlign = 'left';
      const shortName = t.name.length > 18 ? `${t.name.slice(0, 17)}…` : t.name;
      ctx.fillText(shortName, cx + 23, ribbonY + 28);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '7.5px monospace';
      ctx.fillText(t.era, cx + 23, ribbonY + 38);
    });
  }

  // Subtle symbolic-illustration footer tag inside stage corner (KVKK & GDPR transparent)
  ctx.fillStyle = 'rgba(2, 6, 23, 0.78)';
  ctx.fillRect(stageX + 8, stageY + animH - 22, 232, 16);
  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    language === 'tr'
      ? '✦ TEMSİLİ ÇİZİM FİGÜR · GÜNLÜK NESNELER'
      : '✦ SYMBOLIC ILLUSTRATION · EVERYDAY OBJECTS',
    stageX + 14,
    stageY + animH - 11
  );

  ctx.restore();
}
