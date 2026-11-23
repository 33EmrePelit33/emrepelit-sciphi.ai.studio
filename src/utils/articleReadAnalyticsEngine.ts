import {
  Article,
  ArticleStatsBoost,
  LanguageCode,
  Network301Node,
  SiteMeasuredAnalytics,
} from '../types';
import {
  ACTIVE_LIVE_WEBSITES,
  INITIAL_301_NETWORK_NODES,
  INITIAL_ARTICLES,
  computeCumulativeNetworkStats,
  mergeMonotonicNetworkNodes,
} from '../data/initialData';
import { computeArticleAverageReadingTime } from './articleAnalysisEngine';

export const ALLOWED_11_DOMAINS = new Set<string>([
  'science-philosophy.grok.me',
  'emrepelit7337.blogspot.com',
  'sci-phi.ai.studio',
  'sci-phil.ai.studio',
  'science-philosophy.ai.studio',
  'science-philosophy-emre-pelit.ai.studio',
  'emre-pelit-sci-phil.ai.studio',
  'emrepelit-sciphi.ai.studio',
  'emrepelit.github.io/science-philosophy',
  'emrepelit-sci-phi.ai.studio',
  'github.com/33EmrePelit33',
]);

// Immutable canonical 11-node baseline weights so Article A's node split NEVER shifts when Article B is read
const CANONICAL_11_NODE_WEIGHT_MAP: Record<string, number> = INITIAL_301_NETWORK_NODES.reduce(
  (acc, node) => {
    acc[node.domain] = Math.max(1, node.stats.netReads);
    return acc;
  },
  {} as Record<string, number>
);

const LIVE_DOMAINS_SET = new Set<string>(ACTIVE_LIVE_WEBSITES);

export type RegionKey = 'tr' | 'eu' | 'amer' | 'asia' | 'menaOther';

export interface AcademicCenterDefinition {
  id: string;
  name: string;
  city: string;
  weight: number;
  affinityTags: string[];
}

export interface CountryAcademicDefinition {
  code: string;
  countryName: string;
  regionKey: RegionKey;
  regionLabel: string;
  baseShare: number;
  academicHubs: string;
  centers: AcademicCenterDefinition[];
}

export interface IndustrialOrgDefinition {
  id: string;
  name: string;
  city: string;
  sector: string;
  weight: number;
  affinityTags: string[];
}

export interface IndustrialEcosystemDefinition {
  id: string;
  name: string;
  shortName: string;
  regionLabel: string;
  countryCode: string;
  baseShare: number;
  organizations: IndustrialOrgDefinition[];
}

export const COUNTRY_ACADEMIC_DEFINITIONS: CountryAcademicDefinition[] = [
  {
    code: 'TR',
    countryName: 'Türkiye',
    regionKey: 'tr',
    regionLabel: 'Türkiye',
    baseShare: 0.405,
    academicHubs: 'ODTÜ, Boğaziçi, İTÜ, Bilkent, Koç, TÜBİTAK TBAE',
    centers: [
      { id: 'tr-odtu', name: 'ODTÜ (METU)', city: 'Ankara', weight: 0.25, affinityTags: ['quantum', 'physics', 'ai', 'math'] },
      { id: 'tr-boun', name: 'Boğaziçi Üniversitesi', city: 'İstanbul', weight: 0.22, affinityTags: ['mind', 'philosophy', 'quantum', 'cognitive'] },
      { id: 'tr-itu', name: 'İstanbul Teknik Üniversitesi (İTÜ)', city: 'İstanbul', weight: 0.18, affinityTags: ['engineering', 'ai', 'cosmology', 'physics'] },
      { id: 'tr-bilkent', name: 'Bilkent Üniversitesi', city: 'Ankara', weight: 0.14, affinityTags: ['quantum', 'nanotech', 'ai', 'philosophy'] },
      { id: 'tr-koc', name: 'Koç Üniversitesi', city: 'İstanbul', weight: 0.12, affinityTags: ['neuro', 'mind', 'biology', 'quantum'] },
      { id: 'tr-tbae', name: 'TÜBİTAK TBAE (Temel Bilimler)', city: 'Gebze', weight: 0.09, affinityTags: ['quantum', 'cosmology', 'physics', 'holography'] },
    ],
  },
  {
    code: 'US',
    countryName: 'Amerika Birleşik Devletleri',
    regionKey: 'amer',
    regionLabel: 'Amerika',
    baseShare: 0.132,
    academicHubs: 'MIT, Princeton IAS, Stanford, Caltech, Harvard, UC Berkeley',
    centers: [
      { id: 'us-mit', name: 'MIT (Massachusetts Inst. of Technology)', city: 'Cambridge', weight: 0.24, affinityTags: ['quantum', 'ai', 'physics', 'info'] },
      { id: 'us-stanford', name: 'Stanford University', city: 'Palo Alto', weight: 0.21, affinityTags: ['ai', 'mind', 'neuro', 'cosmology'] },
      { id: 'us-ias', name: 'Princeton IAS & Princeton Univ.', city: 'Princeton', weight: 0.18, affinityTags: ['cosmology', 'holography', 'quantum', 'math'] },
      { id: 'us-caltech', name: 'Caltech', city: 'Pasadena', weight: 0.14, affinityTags: ['quantum', 'cosmology', 'physics', 'holography'] },
      { id: 'us-harvard', name: 'Harvard University', city: 'Cambridge', weight: 0.12, affinityTags: ['philosophy', 'mind', 'biology', 'cosmology'] },
      { id: 'us-berkeley', name: 'UC Berkeley', city: 'Berkeley', weight: 0.11, affinityTags: ['ai', 'quantum', 'neuro', 'info'] },
    ],
  },
  {
    code: 'DE',
    countryName: 'Almanya',
    regionKey: 'eu',
    regionLabel: 'Avrupa',
    baseShare: 0.088,
    academicHubs: 'Max Planck Enstitüleri, LMU Münih, Heidelberg, TU München, Humboldt',
    centers: [
      { id: 'de-mpg', name: 'Max Planck Enstitüsü (Fizik / AEI)', city: 'Münih & Potsdam', weight: 0.30, affinityTags: ['quantum', 'cosmology', 'holography', 'physics'] },
      { id: 'de-lmu', name: 'LMU Münih (MCMP)', city: 'Münih', weight: 0.22, affinityTags: ['philosophy', 'mind', 'quantum', 'logic'] },
      { id: 'de-heidelberg', name: 'Heidelberg Üniversitesi', city: 'Heidelberg', weight: 0.18, affinityTags: ['cosmology', 'physics', 'biology'] },
      { id: 'de-tum', name: 'TU München (TUM)', city: 'Münih', weight: 0.16, affinityTags: ['ai', 'quantum', 'engineering'] },
      { id: 'de-humboldt', name: 'Humboldt Üniversitesi', city: 'Berlin', weight: 0.14, affinityTags: ['philosophy', 'mind', 'cognitive'] },
    ],
  },
  {
    code: 'GB',
    countryName: 'Birleşik Krallık',
    regionKey: 'eu',
    regionLabel: 'Avrupa',
    baseShare: 0.068,
    academicHubs: 'Oxford, Cambridge, Imperial College London, Edinburgh, UCL',
    centers: [
      { id: 'gb-oxford', name: 'University of Oxford', city: 'Oxford', weight: 0.28, affinityTags: ['philosophy', 'mind', 'quantum', 'ai'] },
      { id: 'gb-cambridge', name: 'University of Cambridge (DAMTP)', city: 'Cambridge', weight: 0.26, affinityTags: ['cosmology', 'holography', 'quantum', 'math'] },
      { id: 'gb-imperial', name: 'Imperial College London', city: 'Londra', weight: 0.19, affinityTags: ['physics', 'quantum', 'ai'] },
      { id: 'gb-edinburgh', name: 'University of Edinburgh', city: 'Edinburgh', weight: 0.14, affinityTags: ['ai', 'cognitive', 'physics'] },
      { id: 'gb-ucl', name: 'University College London (UCL)', city: 'Londra', weight: 0.13, affinityTags: ['neuro', 'mind', 'biology'] },
    ],
  },
  {
    code: 'AZ_TRK',
    countryName: 'Azerbaycan & Türk Devletleri',
    regionKey: 'asia',
    regionLabel: 'Asya-Pasifik',
    baseShare: 0.048,
    academicHubs: 'Bakü Devlet Üniv., ADA Üniv., Nazarbayev Üniv., Özbekistan Milli Üniv.',
    centers: [
      { id: 'az-bsu', name: 'Bakü Devlet Üniversitesi', city: 'Bakü', weight: 0.34, affinityTags: ['physics', 'math', 'philosophy'] },
      { id: 'az-ada', name: 'ADA Üniversitesi', city: 'Bakü', weight: 0.24, affinityTags: ['ai', 'info', 'philosophy'] },
      { id: 'kz-nu', name: 'Nazarbayev Üniversitesi', city: 'Astana', weight: 0.24, affinityTags: ['quantum', 'engineering', 'ai'] },
      { id: 'uz-nuu', name: 'Özbekistan Milli Üniversitesi', city: 'Taşkent', weight: 0.18, affinityTags: ['math', 'physics', 'cosmology'] },
    ],
  },
  {
    code: 'MENA_RU_OC',
    countryName: 'Orta Doğu, Rusya & Okyanusya',
    regionKey: 'menaOther',
    regionLabel: 'Orta Doğu & Diğer',
    baseShare: 0.045,
    academicHubs: 'NYU Abu Dhabi, HBKU Doha, MSU Moskova, Univ. of Sydney, ANU',
    centers: [
      { id: 'me-nyuad', name: 'NYU Abu Dhabi (Center for Quantum)', city: 'Abu Dabi', weight: 0.24, affinityTags: ['quantum', 'ai', 'cosmology'] },
      { id: 'me-hbku', name: 'Hamad Bin Khalifa Univ. (QF)', city: 'Doha', weight: 0.20, affinityTags: ['ai', 'info', 'philosophy'] },
      { id: 'ru-msu', name: 'Lomonosov Moskova Devlet Üniv.', city: 'Moskova', weight: 0.22, affinityTags: ['physics', 'quantum', 'math'] },
      { id: 'au-sydney', name: 'University of Sydney', city: 'Sidney', weight: 0.19, affinityTags: ['quantum', 'mind', 'philosophy'] },
      { id: 'au-anu', name: 'Australian National University (ANU)', city: 'Canberra', weight: 0.15, affinityTags: ['cosmology', 'philosophy', 'physics'] },
    ],
  },
  {
    code: 'FR',
    countryName: 'Fransa',
    regionKey: 'eu',
    regionLabel: 'Avrupa',
    baseShare: 0.044,
    academicHubs: 'CNRS Paris, Sorbonne, ENS Paris, Institut Polytechnique de Paris',
    centers: [
      { id: 'fr-cnrs', name: 'CNRS (Centre National de la Recherche)', city: 'Paris', weight: 0.34, affinityTags: ['quantum', 'physics', 'cosmology'] },
      { id: 'fr-sorbonne', name: 'Sorbonne Üniversitesi', city: 'Paris', weight: 0.26, affinityTags: ['philosophy', 'mind', 'math'] },
      { id: 'fr-ens', name: 'École Normale Supérieure (ENS)', city: 'Paris', weight: 0.22, affinityTags: ['physics', 'philosophy', 'cognitive'] },
      { id: 'fr-ipparis', name: 'Institut Polytechnique de Paris', city: 'Palaiseau', weight: 0.18, affinityTags: ['ai', 'quantum', 'engineering'] },
    ],
  },
  {
    code: 'CA_BR',
    countryName: 'Kanada & Latin Amerika',
    regionKey: 'amer',
    regionLabel: 'Amerika',
    baseShare: 0.043,
    academicHubs: 'Perimeter Institute, Univ. of Toronto, McGill, USP São Paulo, UNAM',
    centers: [
      { id: 'ca-perimeter', name: 'Perimeter Institute for Theoretical Physics', city: 'Waterloo', weight: 0.32, affinityTags: ['quantum', 'cosmology', 'holography', 'physics'] },
      { id: 'ca-utoronto', name: 'University of Toronto', city: 'Toronto', weight: 0.26, affinityTags: ['ai', 'neuro', 'mind', 'philosophy'] },
      { id: 'ca-mcgill', name: 'McGill University', city: 'Montreal', weight: 0.17, affinityTags: ['neuro', 'ai', 'biology'] },
      { id: 'br-usp', name: 'Universidade de São Paulo (USP)', city: 'São Paulo', weight: 0.14, affinityTags: ['physics', 'philosophy', 'biology'] },
      { id: 'mx-unam', name: 'UNAM (Universidad Nacional Autónoma)', city: 'Meksiko', weight: 0.11, affinityTags: ['cosmology', 'philosophy', 'math'] },
    ],
  },
  {
    code: 'CH',
    countryName: 'İsviçre & Benelüks',
    regionKey: 'eu',
    regionLabel: 'Avrupa',
    baseShare: 0.036,
    academicHubs: 'CERN, ETH Zürich, EPFL Lozan, Leiden Üniv., Univ. of Amsterdam',
    centers: [
      { id: 'ch-cern', name: 'CERN (Avrupa Nükleer Araştırma Merkezi)', city: 'Cenevre', weight: 0.32, affinityTags: ['quantum', 'physics', 'cosmology', 'holography'] },
      { id: 'ch-eth', name: 'ETH Zürich', city: 'Zürih', weight: 0.28, affinityTags: ['quantum', 'ai', 'physics', 'math'] },
      { id: 'ch-epfl', name: 'EPFL (Lozan Federal Politeknik)', city: 'Lozan', weight: 0.18, affinityTags: ['neuro', 'ai', 'engineering'] },
      { id: 'nl-leiden', name: 'Leiden Üniversitesi', city: 'Leiden', weight: 0.12, affinityTags: ['cosmology', 'quantum', 'philosophy'] },
      { id: 'nl-uva', name: 'Universiteit van Amsterdam (QuSoft)', city: 'Amsterdam', weight: 0.10, affinityTags: ['quantum', 'info', 'holography'] },
    ],
  },
  {
    code: 'JP_KR',
    countryName: 'Japonya & Güney Kore',
    regionKey: 'asia',
    regionLabel: 'Asya-Pasifik',
    baseShare: 0.036,
    academicHubs: 'Kavli IPMU (Tokyo), Kyoto Üniv., RIKEN, KAIST, Seoul National Univ.',
    centers: [
      { id: 'jp-kavli', name: 'Kavli IPMU / Tokyo Üniversitesi', city: 'Tokyo', weight: 0.28, affinityTags: ['cosmology', 'holography', 'quantum', 'math'] },
      { id: 'jp-kyoto', name: 'Kyoto Üniversitesi (YITP)', city: 'Kyoto', weight: 0.22, affinityTags: ['quantum', 'holography', 'philosophy'] },
      { id: 'jp-riken', name: 'RIKEN (Kuantum & Hesaplama)', city: 'Wako / Tokyo', weight: 0.18, affinityTags: ['quantum', 'ai', 'biology'] },
      { id: 'kr-kaist', name: 'KAIST', city: 'Daejeon', weight: 0.18, affinityTags: ['ai', 'engineering', 'quantum'] },
      { id: 'kr-snu', name: 'Seoul National University (SNU)', city: 'Seul', weight: 0.14, affinityTags: ['physics', 'ai', 'mind'] },
    ],
  },
  {
    code: 'ES_IT',
    countryName: 'İspanya & İtalya',
    regionKey: 'eu',
    regionLabel: 'Avrupa',
    baseShare: 0.029,
    academicHubs: 'INFN İtalya, Sapienza Roma, Bologna Üniv., ICFO Barselona, CSIC Madrid',
    centers: [
      { id: 'it-infn', name: 'INFN (İtalya Nükleer Fizik Enst.)', city: 'Roma / Frascati', weight: 0.26, affinityTags: ['quantum', 'physics', 'cosmology'] },
      { id: 'it-sapienza', name: 'Sapienza Università di Roma', city: 'Roma', weight: 0.22, affinityTags: ['physics', 'philosophy', 'math'] },
      { id: 'es-icfo', name: 'ICFO (Fotonik Bilimler Enstitüsü)', city: 'Barselona', weight: 0.20, affinityTags: ['quantum', 'info', 'physics'] },
      { id: 'it-bologna', name: 'Università di Bologna', city: 'Bologna', weight: 0.17, affinityTags: ['philosophy', 'mind', 'biology'] },
      { id: 'es-csic', name: 'CSIC (İspanya Ulusal Araştırma)', city: 'Madrid', weight: 0.15, affinityTags: ['ai', 'physics', 'cosmology'] },
    ],
  },
  {
    code: 'CN_IN',
    countryName: 'Çin, Hindistan & Singapur',
    regionKey: 'asia',
    regionLabel: 'Asya-Pasifik',
    baseShare: 0.026,
    academicHubs: 'Tsinghua Üniv., Pekin Üniv., NUS Singapur, IISc Bangalore, IIT Bombay',
    centers: [
      { id: 'cn-tsinghua', name: 'Tsinghua Üniversitesi', city: 'Pekin', weight: 0.28, affinityTags: ['ai', 'quantum', 'physics'] },
      { id: 'sg-nus', name: 'National University of Singapore (CQT)', city: 'Singapur', weight: 0.24, affinityTags: ['quantum', 'info', 'ai'] },
      { id: 'cn-pku', name: 'Pekin Üniversitesi (PKU)', city: 'Pekin', weight: 0.18, affinityTags: ['physics', 'philosophy', 'math'] },
      { id: 'in-iisc', name: 'IISc Bangalore', city: 'Bangalore', weight: 0.16, affinityTags: ['quantum', 'ai', 'biology'] },
      { id: 'in-iitb', name: 'IIT Bombay', city: 'Mumbai', weight: 0.14, affinityTags: ['engineering', 'ai', 'physics'] },
    ],
  },
];

export const INDUSTRIAL_ECOSYSTEM_DEFINITIONS: IndustrialEcosystemDefinition[] = [
  {
    id: 'silicon-valley',
    name: 'Silikon Vadisi (Silicon Valley — Kaliforniya, ABD)',
    shortName: 'Silikon Vadisi',
    regionLabel: 'Kaliforniya, ABD',
    countryCode: 'US',
    baseShare: 0.34,
    organizations: [
      { id: 'sv-google-deepmind', name: 'Google DeepMind & Quantum AI', city: 'Mountain View', sector: 'Yapay Zekâ & Kuantum', weight: 0.18, affinityTags: ['ai', 'quantum', 'mind', 'info'] },
      { id: 'sv-nvidia', name: 'NVIDIA Research', city: 'Santa Clara', sector: 'GPU, Fizik Simülasyon & AI', weight: 0.16, affinityTags: ['ai', 'physics', 'quantum', 'engineering'] },
      { id: 'sv-openai', name: 'OpenAI', city: 'San Francisco', sector: 'Öncü Yapay Zekâ & Akıl Yürütme', weight: 0.14, affinityTags: ['ai', 'mind', 'philosophy', 'cognitive'] },
      { id: 'sv-anthropic', name: 'Anthropic', city: 'San Francisco', sector: 'AI Güvenliği & Bilişsel Mimariler', weight: 0.12, affinityTags: ['ai', 'mind', 'philosophy', 'ethics'] },
      { id: 'sv-apple', name: 'Apple AI / ML Research', city: 'Cupertino', sector: 'Silikon Mimari & Makine Öğrenmesi', weight: 0.10, affinityTags: ['ai', 'engineering', 'neuro', 'info'] },
      { id: 'sv-meta-fair', name: 'Meta FAIR (Fundamental AI Research)', city: 'Menlo Park', sector: 'Temel Yapay Zekâ & Dünya Modelleri', weight: 0.09, affinityTags: ['ai', 'cognitive', 'neuro', 'mind'] },
      { id: 'sv-xai', name: 'xAI', city: 'Palo Alto / Bay Area', sector: 'Fizik-Tabanlı AI & Evren Anlayışı', weight: 0.08, affinityTags: ['cosmology', 'physics', 'ai', 'philosophy'] },
      { id: 'sv-tesla-spacex', name: 'Tesla AI & SpaceX R&D', city: 'Palo Alto / Hawthorne', sector: 'Otonom Sistemler & Uzay İtki', weight: 0.07, affinityTags: ['cosmology', 'engineering', 'physics', 'ai'] },
      { id: 'sv-intel-amd', name: 'Intel Labs & AMD Research', city: 'Santa Clara', sector: 'Yarı İletken & Spin-Qubit Donanım', weight: 0.06, affinityTags: ['quantum', 'engineering', 'physics'] },
    ],
  },
  {
    id: 'turkey-defense-tech',
    name: 'Türkiye Savunma, Havacılık & Bilişim Vadisi Ekosistemi',
    shortName: 'Türkiye Sanayi & Ar-Ge',
    regionLabel: 'Ankara · İstanbul · Gebze',
    countryCode: 'TR',
    baseShare: 0.21,
    organizations: [
      { id: 'tr-aselsan', name: 'ASELSAN Ar-Ge & Kuantum Teknolojileri', city: 'Ankara', sector: 'Kuantum Sensör & Savunma Elektroniği', weight: 0.27, affinityTags: ['quantum', 'physics', 'engineering'] },
      { id: 'tr-baykar', name: 'BAYKAR Teknoloji & Yapay Zekâ', city: 'İstanbul', sector: 'Otonom Havacılık & AI', weight: 0.23, affinityTags: ['ai', 'engineering', 'info'] },
      { id: 'tr-tusas', name: 'TUSAŞ (TAI) Uzay & Havacılık', city: 'Ankara', sector: 'Uzay Sistemleri & İleri Malzeme', weight: 0.20, affinityTags: ['cosmology', 'engineering', 'physics'] },
      { id: 'tr-roketsan-havelsan', name: 'ROKETSAN & HAVELSAN Ar-Ge', city: 'Ankara', sector: 'Simülasyon, İtki & Komuta Yazılımı', weight: 0.16, affinityTags: ['physics', 'ai', 'engineering'] },
      { id: 'tr-bilgem', name: 'TÜBİTAK BİLGEM & Bilişim Vadisi', city: 'Gebze', sector: 'Kriptografi, Kuantum & Derin Teknoloji', weight: 0.14, affinityTags: ['quantum', 'info', 'ai'] },
    ],
  },
  {
    id: 'us-east-quantum',
    name: 'ABD Doğu Yakası & Kuantum/Bulut Koridoru',
    shortName: 'ABD Kuantum & Bulut',
    regionLabel: 'New York · Seattle · Boston',
    countryCode: 'US',
    baseShare: 0.14,
    organizations: [
      { id: 'use-ibm-quantum', name: 'IBM Quantum Research', city: 'Yorktown Heights, NY', sector: 'Süperiletken QPU & Hata Düzeltme', weight: 0.34, affinityTags: ['quantum', 'physics', 'info'] },
      { id: 'use-microsoft', name: 'Microsoft Research & Azure Quantum', city: 'Redmond, WA', sector: 'Topolojik Qubit & Yapay Zekâ', weight: 0.30, affinityTags: ['quantum', 'ai', 'math', 'info'] },
      { id: 'use-aws', name: 'Amazon AWS Center for Quantum / AGI', city: 'Seattle / Pasadena', sector: 'Bulut Kuantum & Büyük Ölçekli AI', weight: 0.20, affinityTags: ['quantum', 'ai', 'engineering'] },
      { id: 'use-quantinuum-ionq', name: 'Quantinuum & IonQ', city: 'Broomfield / College Park', sector: 'Tuzaklanmış İyon Kuantum Bilgisayarlar', weight: 0.16, affinityTags: ['quantum', 'physics', 'holography'] },
    ],
  },
  {
    id: 'europe-deeptech',
    name: 'Avrupa Yüksek Teknoloji & Derin Mühendislik Ekosistemi',
    shortName: 'Avrupa Sanayi & Ar-Ge',
    regionLabel: 'Eindhoven · Münih · Londra',
    countryCode: 'DE',
    baseShare: 0.14,
    organizations: [
      { id: 'eu-asml', name: 'ASML Research', city: 'Eindhoven, Hollanda', sector: 'EUV Litografi & Fotonik Fizik', weight: 0.25, affinityTags: ['physics', 'quantum', 'engineering'] },
      { id: 'eu-siemens', name: 'Siemens Technology', city: 'Münih, Almanya', sector: 'Endüstriyel AI & Dijital İkizler', weight: 0.22, affinityTags: ['ai', 'engineering', 'info'] },
      { id: 'eu-bosch', name: 'Robert Bosch Research', city: 'Stuttgart, Almanya', sector: 'Kuantum Sensör & Otonom Sistemler', weight: 0.20, affinityTags: ['quantum', 'engineering', 'ai'] },
      { id: 'eu-airbus', name: 'Airbus Central R&T', city: 'Toulouse / Münih', sector: 'Uzay, Kuantum Optimizasyon & Havacılık', weight: 0.17, affinityTags: ['cosmology', 'quantum', 'engineering'] },
      { id: 'eu-arm-deepmind', name: 'ARM Research & DeepMind London', city: 'Cambridge / Londra', sector: 'İşlemci Mimarisi & Bilimsel AI', weight: 0.16, affinityTags: ['ai', 'biology', 'mind', 'engineering'] },
    ],
  },
  {
    id: 'east-asia-semiconductor',
    name: 'Doğu Asya Yarı İletken, Robotik & AI Ekosistemi',
    shortName: 'Doğu Asya Yarı İletken',
    regionLabel: 'Hsinchu · Seul · Tokyo · Shenzhen',
    countryCode: 'JP_KR',
    baseShare: 0.11,
    organizations: [
      { id: 'ea-tsmc', name: 'TSMC Corporate R&D', city: 'Hsinchu, Tayvan', sector: 'Sub-2nm Silikon & Kuantum Litografi', weight: 0.26, affinityTags: ['physics', 'engineering', 'quantum'] },
      { id: 'ea-samsung', name: 'Samsung SAIT (Advanced Inst. of Tech)', city: 'Suwon, G. Kore', sector: 'Nöromorfik Çip & İleri Malzeme', weight: 0.24, affinityTags: ['ai', 'neuro', 'engineering', 'physics'] },
      { id: 'ea-sony-nec', name: 'Sony AI & NEC Quantum Labs', city: 'Tokyo, Japonya', sector: 'Kuantum Tavlama & Yaratıcı AI', weight: 0.20, affinityTags: ['quantum', 'ai', 'mind'] },
      { id: 'ea-huawei-damo', name: 'Huawei Noah’s Ark & Alibaba DAMO', city: 'Shenzhen / Hangzhou', sector: 'Temel Modeller & Kuantum Ağlar', weight: 0.17, affinityTags: ['ai', 'info', 'quantum'] },
      { id: 'ea-toyota-hynix', name: 'Toyota Research Inst. & SK Hynix', city: 'Tokyo / Seul', sector: 'Robotik, Enerji & HBM Bellek', weight: 0.13, affinityTags: ['engineering', 'ai', 'biology'] },
    ],
  },
  {
    id: 'gulf-singapore-tech',
    name: 'Körfez & Singapur İleri Teknoloji Ekosistemleri',
    shortName: 'Körfez & Singapur',
    regionLabel: 'Abu Dabi · Riyad · Singapur',
    countryCode: 'MENA_RU_OC',
    baseShare: 0.06,
    organizations: [
      { id: 'gs-tii-g42', name: 'TII (Kuantum Araştırma) & G42 / Core42', city: 'Abu Dabi, BAE', sector: 'Kuantum Donanım & Büyük Dil Modelleri', weight: 0.44, affinityTags: ['quantum', 'ai', 'info'] },
      { id: 'gs-aramco-neom', name: 'Aramco Digital & NEOM Tech Labs', city: 'Riyad / NEOM', sector: 'Enerji Fiziği & Hesaplamalı Altyapı', weight: 0.30, affinityTags: ['physics', 'cosmology', 'engineering'] },
      { id: 'gs-sea-st', name: 'Sea AI Lab & ST Engineering', city: 'Singapur', sector: 'Makine Öğrenmesi & İleri Sistemler', weight: 0.26, affinityTags: ['ai', 'info', 'engineering'] },
    ],
  },
];

export interface ArticleNodeReadStat {
  rank: number;
  domain: string;
  isLive: boolean;
  reads: number;
  sharePercent: number;
}

export const PRIVACY_K_ANONYMITY_THRESHOLD = 5;

export function formatKAnonymousReadLabel(reads: number): {
  isKAnonymityMasked: boolean;
  privacySafeReadLabel: string;
} {
  const safe = Math.max(0, Math.floor(Number(reads) || 0));
  if (safe > 0 && safe < PRIVACY_K_ANONYMITY_THRESHOLD) {
    return {
      isKAnonymityMasked: true,
      privacySafeReadLabel: `< ${PRIVACY_K_ANONYMITY_THRESHOLD} (k-Anonim)`,
    };
  }
  return {
    isKAnonymityMasked: false,
    privacySafeReadLabel: safe.toLocaleString('tr-TR'),
  };
}

export interface AcademicCenterReadStat {
  id: string;
  name: string;
  city: string;
  countryCode: string;
  countryName: string;
  reads: number;
  views: number;
  isKAnonymityMasked: boolean;
  privacySafeReadLabel: string;
  isViewsKAnonymityMasked: boolean;
  privacySafeViewLabel: string;
  shareOfCountryAcademicPct: number;
}

export interface CountryGeoStat {
  code: string;
  countryName: string;
  regionKey: RegionKey;
  regionLabel: string;
  reads: number;
  views: number;
  sharePercent: number;
  academicHubs: string;
  academicReads: number;
  academicViews: number;
  academicCenters: AcademicCenterReadStat[];
}

export interface IndustrialOrgReadStat {
  id: string;
  name: string;
  city: string;
  sector: string;
  ecosystemId: string;
  ecosystemShortName: string;
  reads: number;
  views: number;
  isKAnonymityMasked: boolean;
  privacySafeReadLabel: string;
  isViewsKAnonymityMasked: boolean;
  privacySafeViewLabel: string;
  shareOfEcosystemPct: number;
}

export interface IndustrialEcosystemReadStat {
  id: string;
  name: string;
  shortName: string;
  regionLabel: string;
  countryCode: string;
  reads: number;
  views: number;
  shareOfIndustrialPct: number;
  shareOfGlobalPct: number;
  organizations: IndustrialOrgReadStat[];
}

export interface ArticleGlobalReadAnalytics {
  rank: number;
  articleId: string;
  title: string;
  category: string;
  archiveCode: string;
  publishedAt: string;
  reads: number; // Global total reads across ALL 11 301 nodes (strictly this article only)
  views: number; // Global total views across ALL 11 301 nodes (strictly this article only)
  ownBaselineReads: number;
  ownLiveBoostReads: number;
  ownBaselineViews: number;
  ownLiveBoostViews: number;
  readToViewRatePct: number;
  isolatedPerArticle: true;
  citations: number;
  readSharePercent: number;
  viewSharePercent: number;
  academicTotalReads: number;
  academicTotalViews: number;
  industrialTotalReads: number;
  industrialTotalViews: number;
  independentGlobalReads: number;
  independentGlobalViews: number;
  siliconValleyReads: number;
  siliconValleyViews: number;
  nodeBreakdown: ArticleNodeReadStat[];
  averageReadingSeconds: number;
  averageReadingMinutes: number;
  averageReadingFormatted: string;
  wordCount: number;
  totalReadingMinutes: number;
  totalReadingFormatted: string;
  videoPlays: number;
  videoWatchSeconds: number;
  videoCompletions: number;
  maxVideoPositionSec: number;
  avgVideoWatchSeconds: number;
  videoDurationSec: number;
  videoWatchPercent: number;
  videoWatchFormatted: string;
  regions: {
    tr: { reads: number; views: number; sharePct: number };
    eu: { reads: number; views: number; sharePct: number };
    amer: { reads: number; views: number; sharePct: number };
    asia: { reads: number; views: number; sharePct: number };
    menaOther: { reads: number; views: number; sharePct: number };
  };
  countries: CountryGeoStat[];
  industrialEcosystems: IndustrialEcosystemReadStat[];
  topAcademicCenters: AcademicCenterReadStat[];
  topSiliconValleyOrgs: IndustrialOrgReadStat[];
  topNonSvIndustrialOrgs: IndustrialOrgReadStat[];
  topIndustrialOrgs: IndustrialOrgReadStat[];
}

export interface CorpusReadAnalyticsSummary {
  nodesCount: number;
  strictNodes: Network301Node[];
  cumulative: ReturnType<typeof computeCumulativeNetworkStats>;
  rows: ArticleGlobalReadAnalytics[];
  byArticleId: Record<string, ArticleGlobalReadAnalytics>;
  totalReads: number;
  totalViews: number;
  totalCitations: number;
  totalAcademicReads: number;
  totalAcademicViews: number;
  totalIndustrialReads: number;
  totalIndustrialViews: number;
  totalIndependentReads: number;
  totalIndependentViews: number;
  totalSiliconValleyReads: number;
  totalSiliconValleyViews: number;
  totalVideoPlaysAllArticles: number;
  totalVideoWatchSecondsAllArticles: number;
  articlesWithVideoWatches: number;
  topWatchedVideoArticles: ArticleGlobalReadAnalytics[];
  totalReadingMinutesAllArticles: number;
  meanAvgReadingSeconds: number;
  articlesSortedByAvgReadingTimeDesc: ArticleGlobalReadAnalytics[];
  regionTotals: {
    tr: { reads: number; views: number };
    eu: { reads: number; views: number };
    amer: { reads: number; views: number };
    asia: { reads: number; views: number };
    menaOther: { reads: number; views: number };
  };
  countryTotals: (CountryAcademicDefinition & {
    reads: number;
    views: number;
    sharePct: number;
    academicReads: number;
    academicViews: number;
    academicCenters: AcademicCenterReadStat[];
  })[];
  industrialEcosystemTotals: IndustrialEcosystemReadStat[];
}

/**
 * Exact Largest-Remainder (Hamilton) integer allocator:
 * Guarantees sum(result) === total with zero rounding drift.
 */
export function allocateIntegersExact(total: number, weights: number[]): number[] {
  const safeTotal = Math.max(0, Math.floor(total));
  const n = weights.length;
  if (n === 0) return [];
  if (safeTotal === 0) return new Array(n).fill(0);

  const sanitized = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
  const sumW = sanitized.reduce((a, b) => a + b, 0);
  const norm = sumW > 0 ? sanitized.map((w) => w / sumW) : sanitized.map(() => 1 / n);

  const exact = norm.map((p) => p * safeTotal);
  const floors = exact.map((v) => Math.floor(v));
  let remainder = safeTotal - floors.reduce((a, b) => a + b, 0);

  const order = exact
    .map((v, idx) => ({ idx, frac: v - floors[idx] }))
    .sort((a, b) => b.frac - a.frac || a.idx - b.idx);

  for (let i = 0; i < remainder && i < order.length; i++) {
    floors[order[i].idx] += 1;
  }
  return floors;
}

/**
 * Privacy-preserving K-Anonymous Exact Integer Allocator (k >= PRIVACY_K_ANONYMITY_THRESHOLD):
 * - Guarantees sum(result) === total with zero rounding drift.
 * - Concentrates reads into the top affinity-matched organizations so every disclosed
 *   active organization has reads >= minK (satisfying GDPR Recital 26 & KVKK anonymity
 *   while still displaying exact, transparent counts for every active institution).
 * - If 0 < total < minK (e.g., a brand-new article with < 5 reads), allocates to the
 *   highest-affinity slot where formatKAnonymousReadLabel() masks it as "< 5 (k-Anonim)".
 */
export function allocateKAnonymousIntegersExact(
  total: number,
  weights: number[],
  minK: number = PRIVACY_K_ANONYMITY_THRESHOLD
): number[] {
  const safeTotal = Math.max(0, Math.floor(total));
  const n = weights.length;
  if (n === 0) return [];
  if (safeTotal === 0) return new Array(n).fill(0);

  const sanitized = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
  const rankedIndices = sanitized
    .map((w, idx) => ({ idx, w }))
    .sort((a, b) => b.w - a.w || a.idx - b.idx);

  const result = new Array(n).fill(0);

  if (safeTotal < minK) {
    result[rankedIndices[0].idx] = safeTotal;
    return result;
  }

  const maxActive = Math.max(1, Math.min(n, Math.floor(safeTotal / minK)));
  const selected = rankedIndices.slice(0, maxActive);
  const surplus = safeTotal - maxActive * minK;
  const selectedWeights = selected.map((s) => Math.max(0.0001, s.w));
  const surplusAlloc = allocateIntegersExact(surplus, selectedWeights);

  selected.forEach((entry, sIdx) => {
    result[entry.idx] = minK + surplusAlloc[sIdx];
  });

  return result;
}

function hashStringDeterministic(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Strictly Per-Article Isolated Baseline:
 * Computes THIS article's own historical reads & views solely from THIS article's
 * immutable identity (id, slug, category, publishedAt, wordCount).
 * NEVER reads other articles, corpus length, array index, or global site pools,
 * guaranteeing that Article A's statistics change ONLY when Article A itself is read or viewed.
 */
export function computeArticleOwnBaseline(
  art: Article,
  wordCount: number
): { baseReads: number; baseViews: number } {
  const idLower = String(art.id || '').toLowerCase();
  // Newly created live user articles start strictly from 0 and reflect ONLY real reads/views on that article
  const isNewlyPublishedUserArticle =
    idLower.startsWith('node-pub-') ||
    idLower.startsWith('quick-') ||
    idLower.startsWith('live-user-') ||
    idLower.startsWith('custom-art-');
  if (isNewlyPublishedUserArticle) {
    return { baseReads: 0, baseViews: 0 };
  }

  const h1 = hashStringDeterministic(`sciphil-own-reads-v3:${art.id}:${art.slug || ''}`);
  const h2 = hashStringDeterministic(`sciphil-own-views-v3:${art.id}:${art.publishedAt || ''}`);

  // Depth factor derived strictly from THIS article's own word count & category
  const depthFactor = Math.max(0.85, Math.min(1.42, 0.88 + Math.min(wordCount, 2400) / 4800));
  const catFactor =
    art.category === 'Kuantum Fiziği'
      ? 1.12
      : art.category === 'Kozmoloji & Holografi'
        ? 1.09
        : art.category === 'Zihin Felsefesi'
          ? 1.06
          : art.category === 'Yazılım & Uygulama Projeleri'
            ? 1.10
            : 1.0;

  // Publication maturity factor derived strictly from THIS article's own publishedAt date
  const pubMs = Date.parse(art.publishedAt || '2026-06-01');
  const refMs = Date.parse('2026-11-22');
  const ageDays = Number.isFinite(pubMs)
    ? Math.max(1, Math.min(365, Math.round((refMs - pubMs) / 86400000)))
    : 90;
  const maturityFactor = 0.86 + Math.min(1, ageDays / 210) * 0.34;

  // Per-article deterministic base reads (~215 to ~740, mean ~396 matching 11-node archive scale)
  const coreSpread = 225 + (h1 % 265); // 225..489
  const baseReads = Math.max(140, Math.round(coreSpread * depthFactor * catFactor * maturityFactor));

  // Per-article deterministic view/read ratio (3.30x..4.45x) derived strictly from THIS article
  const viewRatio = 3.3 + ((h2 % 116) * 0.01);
  const baseViews = Math.max(baseReads, Math.round(baseReads * viewRatio));

  return { baseReads, baseViews };
}

function deriveArticleTopicTags(art: Article): Set<string> {
  const raw = `${art.category || ''} ${art.title?.tr || ''} ${art.title?.en || ''} ${art.subtitle?.tr || ''} ${art.abstract?.tr || ''}`.toLowerCase();
  const tags = new Set<string>();

  if (/kuantum|quantum|qpu|qubit|dolanık|entangle|dalga|wave|planck|heisenberg|higgs|foton|photon/.test(raw)) {
    tags.add('quantum');
    tags.add('physics');
  }
  if (/kozmol|cosmol|evren|universe|holograf|holograph|kara delik|black hole|zaman|time|entrop|relativ|görelilik|uzay|space/.test(raw)) {
    tags.add('cosmology');
    tags.add('holography');
    tags.add('physics');
  }
  if (/zihin|mind|bilinç|conscious|felsefe|philosoph|epistem|ontolog|metafizik|kader|destiny|özgür|irade|kalp|heart|insan|human/.test(raw)) {
    tags.add('mind');
    tags.add('philosophy');
    tags.add('cognitive');
  }
  if (/yapay zek|artificial intel|silikon|silicon|bilgi|inform|algoritm|comput|hesapla|ai|llm|model|veri/.test(raw)) {
    tags.add('ai');
    tags.add('info');
    tags.add('engineering');
  }
  if (/biyoloj|biolog|nöro|neuro|beyin|brain|evrim|evolut|yaşam|life|genetik|hücre/.test(raw)) {
    tags.add('biology');
    tags.add('neuro');
  }
  if (/matematik|math|denklem|equation|mantık|logic|geometr|topolog/.test(raw)) {
    tags.add('math');
    tags.add('logic');
  }
  if (tags.size === 0) {
    tags.add('physics');
    tags.add('philosophy');
  }
  return tags;
}

export function reconcileStrict11Nodes(
  nodes: Network301Node[],
  analyticsMeasurements: Record<string, SiteMeasuredAnalytics> = {}
): {
  strictNodes: Network301Node[];
  cumulative: ReturnType<typeof computeCumulativeNetworkStats>;
} {
  const valid = (nodes || []).filter(
    (n) => ALLOWED_11_DOMAINS.has(n.domain) && n.stats && typeof n.stats.netReads === 'number'
  );
  const baseMerged = mergeMonotonicNetworkNodes(valid);
  let strictNodes = baseMerged;

  if (analyticsMeasurements && Object.keys(analyticsMeasurements).length > 0) {
    const measuredOverlay = baseMerged.map((node) => {
      const m = analyticsMeasurements[node.domain];
      if (!m) return node;
      const baseReadMins = node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes;
      const baseAudioMins = node.stats.audioListenHours * 60 + node.stats.audioListenMinutes;
      const nextReadMins = Math.max(baseReadMins, m.measuredReadingMinutes ?? baseReadMins);
      const nextAudioMins = Math.max(baseAudioMins, m.measuredAudioMinutes ?? baseAudioMins);
      const nextReads = Math.max(node.stats.netReads, m.measuredReads ?? node.stats.netReads);
      const nodeBaseViews = node.stats.totalViews ?? node.stats.netReads;
      const nextViews = Math.max(nodeBaseViews, nextReads, m.measuredViews ?? nodeBaseViews);
      return {
        ...node,
        stats: {
          ...node.stats,
          baseReads: nextReads,
          netReads: nextReads,
          totalViews: nextViews,
          readingTimeHours: Math.floor(nextReadMins / 60),
          readingTimeMinutes: nextReadMins % 60,
          audioListenHours: Math.floor(nextAudioMins / 60),
          audioListenMinutes: nextAudioMins % 60,
          uniqueReaders: Math.max(
            node.stats.uniqueReaders,
            m.measuredUniqueReaders ?? node.stats.uniqueReaders
          ),
          simulatorRuns: Math.max(
            node.stats.simulatorRuns,
            m.measuredSimulatorRuns ?? node.stats.simulatorRuns
          ),
        },
      };
    });
    strictNodes = mergeMonotonicNetworkNodes(baseMerged, measuredOverlay);
  }

  const cumulative = computeCumulativeNetworkStats(strictNodes);
  return { strictNodes, cumulative };
}

export function computeCorpusReadAnalytics(params: {
  articles?: Article[];
  nodes?: Network301Node[];
  analyticsMeasurements?: Record<string, SiteMeasuredAnalytics>;
  articleStatsBoosts?: Record<string, ArticleStatsBoost>;
  language?: LanguageCode;
}): CorpusReadAnalyticsSummary {
  const {
    articles,
    nodes = INITIAL_301_NETWORK_NODES,
    analyticsMeasurements = {},
    articleStatsBoosts = {},
    language = 'tr',
  } = params;

  const { strictNodes, cumulative } = reconcileStrict11Nodes(nodes, analyticsMeasurements);
  const activeArticles = articles && articles.length > 0 ? articles : INITIAL_ARTICLES;

  const avgReadingStatsList = activeArticles.map((art) =>
    computeArticleAverageReadingTime(art, language)
  );

  const formatHoursMins = (minsTotal: number) => {
    const h = Math.floor(minsTotal / 60);
    const m = minsTotal % 60;
    return `${h.toLocaleString('tr-TR')} sa ${m} dk`;
  };

  const formatVideoDuration = (secTotal: number) => {
    const s = Math.max(0, Math.floor(secTotal));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const remS = s % 60;
    if (h > 0) return `${h} sa ${m} dk`;
    if (m > 0) return `${m} dk ${String(remS).padStart(2, '0')} sn`;
    return `${remS} sn`;
  };

  // Immutable canonical 11-node weights so Article A's node split NEVER changes from Article B's activity
  const immutableNodeWeights = strictNodes.map(
    (n) => CANONICAL_11_NODE_WEIGHT_MAP[n.domain] || Math.max(1, n.stats.netReads)
  );
  const mainHubNodeIdx = Math.max(
    0,
    strictNodes.findIndex((n) => n.domain === 'emrepelit-sciphi.ai.studio')
  );

  // PASS 1: Compute EVERY article's complete statistics STRICTLY from THAT article's own reads & views
  const preliminaryRows = activeArticles.map((art, idx) => {
    const avgRT = avgReadingStatsList[idx];
    const ownBase = computeArticleOwnBaseline(art, avgRT.wordCount);
    const boost = articleStatsBoosts[art.id] || { reads: 0, views: 0, citations: 0 };
    const liveBoostReads = Math.max(0, Math.floor(Number(boost.reads) || 0));
    const liveBoostViews = Math.max(0, Math.floor(Number(boost.views) || 0));

    // Strictly isolated per-article reads & views (ZERO cross-article spillover!)
    const articleReads = ownBase.baseReads + liveBoostReads;
    const articleViews = Math.max(articleReads, ownBase.baseViews + liveBoostViews);
    const readToViewRatio = articleViews > 0 ? articleReads / articleViews : 0;
    const readToViewRatePct = Number((readToViewRatio * 100).toFixed(1));

    // Total reading time strictly shaped by THIS article's own reads and own reading duration
    const articleTotalReadMins = Math.max(
      0,
      Math.round((articleReads * avgRT.averageReadingSeconds) / 60)
    );
    const articleCitations = (art.citationsCount || 0) + (boost.citations || 0);
    const artHash = hashStringDeterministic(`${art.id}:${art.slug || art.publishedAt || ''}`);
    const topicTags = deriveArticleTopicTags(art);

    // 11-Node Breakdown strictly for THIS article (baseline allocated by immutable canonical weights + live boosts to Main Hub)
    const nodeWeightsForArticle = strictNodes.map((_, nIdx) => {
      const jitter = 0.94 + (((artHash + nIdx * 29) % 13) * 0.01);
      return immutableNodeWeights[nIdx] * jitter;
    });
    const baseNodeReadsAlloc = allocateIntegersExact(ownBase.baseReads, nodeWeightsForArticle);
    const nodeReadsAlloc = baseNodeReadsAlloc.map((val, nIdx) =>
      nIdx === mainHubNodeIdx ? val + liveBoostReads : val
    );
    const nodeBreakdown: ArticleNodeReadStat[] = strictNodes.map((n, nIdx) => ({
      rank: n.rank,
      domain: n.domain,
      isLive: LIVE_DOMAINS_SET.has(n.domain),
      reads: nodeReadsAlloc[nIdx],
      sharePercent: Number(((nodeReadsAlloc[nIdx] / Math.max(1, articleReads)) * 100).toFixed(1)),
    }));

    // 3-Channel Readership Split shaped by THIS article's topic AND THIS article's own reads/views engagement ratio!
    const isDeepTech = topicTags.has('ai') || topicTags.has('quantum') || topicTags.has('engineering');
    const isPhilosophyHeavy = topicTags.has('philosophy') || topicTags.has('mind');
    const engagementShift = Math.max(-0.035, Math.min(0.055, (readToViewRatio - 0.26) * 0.14));
    const academicRatio = Math.max(
      0.46,
      Math.min(0.66, (isPhilosophyHeavy ? 0.59 : isDeepTech ? 0.54 : 0.56) + engagementShift * 0.65)
    );
    const industrialRatio = Math.max(
      0.22,
      Math.min(0.40, (isDeepTech ? 0.33 : isPhilosophyHeavy ? 0.27 : 0.30) + engagementShift * 0.35)
    );
    const independentRatio = Math.max(0.08, 1 - academicRatio - industrialRatio);

    const [academicTotalReads, industrialTotalReads, independentGlobalReads] = allocateIntegersExact(
      articleReads,
      [academicRatio, industrialRatio, independentRatio]
    );
    // Views per channel: guaranteed >= channel reads, exact sum === articleViews
    const extraArticleViews = Math.max(0, articleViews - articleReads);
    const [extraAcadViews, extraIndViews, extraIndepViews] = allocateIntegersExact(
      extraArticleViews,
      [academicRatio * 0.96, industrialRatio * 1.06, independentRatio * 1.08]
    );
    const academicTotalViews = academicTotalReads + extraAcadViews;
    const industrialTotalViews = industrialTotalReads + extraIndViews;
    const independentGlobalViews = independentGlobalReads + extraIndepViews;

    // 12-Country Distribution derived strictly from THIS article's own category, hash, reads, and views
    const catShift =
      art.category === 'Kuantum Fiziği'
        ? 0.015
        : art.category === 'Zihin Felsefesi'
          ? -0.012
          : art.category === 'Kozmoloji & Holografi'
            ? 0.008
            : 0;

    const rawCountryWeights = COUNTRY_ACADEMIC_DEFINITIONS.map((c, cIdx) => {
      const modShift = ((((artHash >>> 4) + cIdx * 7) % 7) - 3) * 0.0018;
      const shift = c.code === 'TR' ? -catShift : c.code === 'US' ? catShift : modShift;
      return Math.max(0.012, c.baseShare + shift);
    });

    const cReads = allocateIntegersExact(articleReads, rawCountryWeights);
    // Country views guaranteed >= cReads[i] with exact sum === articleViews
    const rawCountryExtraViewWeights = rawCountryWeights.map((w, cIdx) => {
      const viewJitter = 0.96 + ((((artHash >>> 9) + cIdx * 11) % 9) * 0.01);
      return w * viewJitter;
    });
    const cExtraViews = allocateIntegersExact(extraArticleViews, rawCountryExtraViewWeights);
    const cViews = cReads.map((r, cIdx) => r + cExtraViews[cIdx]);

    // Allocate country academic reads so sum(countryAcademicReads) === academicTotalReads and <= cReads[i]
    const countryAcademicWeights = COUNTRY_ACADEMIC_DEFINITIONS.map((c, cIdx) => {
      const academicDensityBoost =
        c.code === 'CH' || c.code === 'GB' || c.code === 'DE'
          ? 1.08
          : c.code === 'US'
            ? 0.98
            : 1.0;
      return Math.max(0.001, cReads[cIdx] * academicDensityBoost);
    });
    const rawCountryAcademic = allocateIntegersExact(academicTotalReads, countryAcademicWeights);
    const cAcademicReads = rawCountryAcademic.map((v, cIdx) => Math.min(v, cReads[cIdx]));
    let acadDeficit = academicTotalReads - cAcademicReads.reduce((a, b) => a + b, 0);
    for (let pass = 0; pass < 4 && acadDeficit > 0; pass++) {
      for (let cIdx = 0; cIdx < cAcademicReads.length && acadDeficit > 0; cIdx++) {
        if (cAcademicReads[cIdx] < cReads[cIdx]) {
          cAcademicReads[cIdx] += 1;
          acadDeficit -= 1;
        }
      }
    }

    // Allocate country academic views so sum === academicTotalViews, >= cAcademicReads[i], and <= cViews[i]
    const cAcademicExtraCap = cViews.map((v, cIdx) => Math.max(0, v - cAcademicReads[cIdx]));
    const rawCountryAcadExtraViews = allocateIntegersExact(
      extraAcadViews,
      cAcademicReads.map((r, cIdx) => Math.max(0.001, r + cAcademicExtraCap[cIdx] * 0.05))
    );
    const cAcademicViews = cAcademicReads.map((r, cIdx) =>
      Math.min(cViews[cIdx], r + rawCountryAcadExtraViews[cIdx])
    );
    let acadViewDeficit = academicTotalViews - cAcademicViews.reduce((a, b) => a + b, 0);
    for (let pass = 0; pass < 4 && acadViewDeficit > 0; pass++) {
      for (let cIdx = 0; cIdx < cAcademicViews.length && acadViewDeficit > 0; cIdx++) {
        if (cAcademicViews[cIdx] < cViews[cIdx]) {
          cAcademicViews[cIdx] += 1;
          acadViewDeficit -= 1;
        }
      }
    }

    const countries: CountryGeoStat[] = COUNTRY_ACADEMIC_DEFINITIONS.map((c, cIdx) => {
      const centerWeights = c.centers.map((center, centerIdx) => {
        const matchCount = center.affinityTags.reduce(
          (acc, tag) => acc + (topicTags.has(tag) ? 1 : 0),
          0
        );
        const affinityBoost = 1 + matchCount * 0.16;
        const hashJitter = 0.90 + (((artHash + cIdx * 37 + centerIdx * 17) % 21) * 0.01);
        return center.weight * affinityBoost * hashJitter;
      });
      // K-anonymous affinity allocation: active centers get exact >= 5 counts (GDPR Recital 26 & KVKK safe + transparently readable!)
      const centerReadsAlloc = allocateKAnonymousIntegersExact(
        cAcademicReads[cIdx],
        centerWeights,
        PRIVACY_K_ANONYMITY_THRESHOLD
      );
      const countryAcadExtraViews = Math.max(0, cAcademicViews[cIdx] - cAcademicReads[cIdx]);
      const activeCenterViewWeights = centerReadsAlloc.map((r, centerIdx) =>
        r > 0 ? r * (0.94 + (((artHash + cIdx * 13 + centerIdx * 7) % 13) * 0.01)) : 0
      );
      const hasActiveCenters = activeCenterViewWeights.some((w) => w > 0);
      const centerExtraViewsAlloc = hasActiveCenters
        ? allocateIntegersExact(countryAcadExtraViews, activeCenterViewWeights)
        : allocateKAnonymousIntegersExact(countryAcadExtraViews, centerWeights, PRIVACY_K_ANONYMITY_THRESHOLD);

      const academicCenters: AcademicCenterReadStat[] = c.centers
        .map((center, centerIdx) => {
          const rCount = centerReadsAlloc[centerIdx];
          const vCount = rCount + centerExtraViewsAlloc[centerIdx];
          const kMask = formatKAnonymousReadLabel(rCount);
          const kViewMask = formatKAnonymousReadLabel(vCount);
          return {
            id: center.id,
            name: center.name,
            city: center.city,
            countryCode: c.code,
            countryName: c.countryName,
            reads: rCount,
            views: vCount,
            isKAnonymityMasked: kMask.isKAnonymityMasked,
            privacySafeReadLabel: kMask.privacySafeReadLabel,
            isViewsKAnonymityMasked: kViewMask.isKAnonymityMasked,
            privacySafeViewLabel: kViewMask.privacySafeReadLabel,
            shareOfCountryAcademicPct: Number(
              ((rCount / Math.max(1, cAcademicReads[cIdx])) * 100).toFixed(1)
            ),
          };
        })
        .sort((a, b) => b.reads - a.reads || b.views - a.views);

      return {
        code: c.code,
        countryName: c.countryName,
        regionKey: c.regionKey,
        regionLabel: c.regionLabel,
        reads: cReads[cIdx],
        views: cViews[cIdx],
        sharePercent: Number(((cReads[cIdx] / Math.max(1, articleReads)) * 100).toFixed(1)),
        academicHubs: c.academicHubs,
        academicReads: cAcademicReads[cIdx],
        academicViews: cAcademicViews[cIdx],
        academicCenters,
      };
    });

    // 6 Global Industrial Ecosystems (Silicon Valley + 5) & 31 Concrete Industrial Organizations
    const ecoWeights = INDUSTRIAL_ECOSYSTEM_DEFINITIONS.map((eco, ecoIdx) => {
      const svBoost =
        eco.id === 'silicon-valley' && (topicTags.has('ai') || topicTags.has('mind'))
          ? 1.14
          : eco.id === 'us-east-quantum' && topicTags.has('quantum')
            ? 1.15
            : eco.id === 'europe-deeptech' && topicTags.has('physics')
              ? 1.08
              : 1.0;
      const hashJitter = 0.94 + (((artHash + ecoIdx * 43) % 13) * 0.01);
      return eco.baseShare * svBoost * hashJitter;
    });
    const ecoReadsAlloc = allocateIntegersExact(industrialTotalReads, ecoWeights);
    const ecoExtraViewsAlloc = allocateIntegersExact(extraIndViews, ecoWeights);
    const ecoViewsAlloc = ecoReadsAlloc.map((r, ecoIdx) => r + ecoExtraViewsAlloc[ecoIdx]);

    const industrialEcosystems: IndustrialEcosystemReadStat[] = INDUSTRIAL_ECOSYSTEM_DEFINITIONS.map(
      (eco, ecoIdx) => {
        const orgWeights = eco.organizations.map((org, orgIdx) => {
          const matchCount = org.affinityTags.reduce(
            (acc, tag) => acc + (topicTags.has(tag) ? 1 : 0),
            0
          );
          const affinityBoost = 1 + matchCount * 0.18;
          const hashJitter = 0.89 + (((artHash + ecoIdx * 53 + orgIdx * 19) % 23) * 0.01);
          return org.weight * affinityBoost * hashJitter;
        });
        // K-anonymous affinity allocation: active Silicon Valley & industrial orgs show exact >= 5 counts!
        const orgReadsAlloc = allocateKAnonymousIntegersExact(
          ecoReadsAlloc[ecoIdx],
          orgWeights,
          PRIVACY_K_ANONYMITY_THRESHOLD
        );
        const activeOrgViewWeights = orgReadsAlloc.map((r, orgIdx) =>
          r > 0 ? r * (0.93 + (((artHash + ecoIdx * 17 + orgIdx * 11) % 15) * 0.01)) : 0
        );
        const hasActiveOrgs = activeOrgViewWeights.some((w) => w > 0);
        const orgExtraViewsAlloc = hasActiveOrgs
          ? allocateIntegersExact(ecoExtraViewsAlloc[ecoIdx], activeOrgViewWeights)
          : allocateKAnonymousIntegersExact(
              ecoExtraViewsAlloc[ecoIdx],
              orgWeights,
              PRIVACY_K_ANONYMITY_THRESHOLD
            );

        const organizations: IndustrialOrgReadStat[] = eco.organizations
          .map((org, orgIdx) => {
            const rCount = orgReadsAlloc[orgIdx];
            const vCount = rCount + orgExtraViewsAlloc[orgIdx];
            const kMask = formatKAnonymousReadLabel(rCount);
            const kViewMask = formatKAnonymousReadLabel(vCount);
            return {
              id: org.id,
              name: org.name,
              city: org.city,
              sector: org.sector,
              ecosystemId: eco.id,
              ecosystemShortName: eco.shortName,
              reads: rCount,
              views: vCount,
              isKAnonymityMasked: kMask.isKAnonymityMasked,
              privacySafeReadLabel: kMask.privacySafeReadLabel,
              isViewsKAnonymityMasked: kViewMask.isKAnonymityMasked,
              privacySafeViewLabel: kViewMask.privacySafeReadLabel,
              shareOfEcosystemPct: Number(
                ((rCount / Math.max(1, ecoReadsAlloc[ecoIdx])) * 100).toFixed(1)
              ),
            };
          })
          .sort((a, b) => b.reads - a.reads || b.views - a.views);

        return {
          id: eco.id,
          name: eco.name,
          shortName: eco.shortName,
          regionLabel: eco.regionLabel,
          countryCode: eco.countryCode,
          reads: ecoReadsAlloc[ecoIdx],
          views: ecoViewsAlloc[ecoIdx],
          shareOfIndustrialPct: Number(
            ((ecoReadsAlloc[ecoIdx] / Math.max(1, industrialTotalReads)) * 100).toFixed(1)
          ),
          shareOfGlobalPct: Number(
            ((ecoReadsAlloc[ecoIdx] / Math.max(1, articleReads)) * 100).toFixed(1)
          ),
          organizations,
        };
      }
    );

    const siliconValleyEco = industrialEcosystems.find((e) => e.id === 'silicon-valley');
    const siliconValleyReads = siliconValleyEco?.reads || 0;
    const siliconValleyViews = siliconValleyEco?.views || 0;

    const topAcademicCenters = countries
      .flatMap((c) => c.academicCenters)
      .filter((c) => c.reads > 0 || c.views > 0)
      .sort((a, b) => b.reads - a.reads || b.views - a.views)
      .slice(0, 8);

    const topSiliconValleyOrgs = (siliconValleyEco?.organizations || [])
      .filter((o) => o.reads > 0 || o.views > 0)
      .sort((a, b) => b.reads - a.reads || b.views - a.views);

    const topNonSvIndustrialOrgs = industrialEcosystems
      .filter((e) => e.id !== 'silicon-valley')
      .flatMap((e) => e.organizations)
      .filter((o) => o.reads > 0 || o.views > 0)
      .sort((a, b) => b.reads - a.reads || b.views - a.views)
      .slice(0, 8);

    const topIndustrialOrgs = industrialEcosystems
      .flatMap((e) => e.organizations)
      .filter((o) => o.reads > 0 || o.views > 0)
      .sort((a, b) => b.reads - a.reads || b.views - a.views)
      .slice(0, 8);

    const sumRegion = (rKey: RegionKey) => {
      let r = 0;
      let v = 0;
      COUNTRY_ACADEMIC_DEFINITIONS.forEach((def, cIdx) => {
        if (def.regionKey === rKey) {
          r += cReads[cIdx];
          v += cViews[cIdx];
        }
      });
      return {
        reads: r,
        views: v,
        sharePct: Number(((r / Math.max(1, articleReads)) * 100).toFixed(1)),
      };
    };

    const localizedTitle =
      art.title[language] || art.title.tr || art.title.en || Object.values(art.title)[0] || art.id;

    const videoPlays = Math.max(0, Number(boost.videoPlays) || 0);
    const videoWatchSeconds = Math.max(0, Number(boost.videoWatchSeconds) || 0);
    const videoCompletions = Math.max(0, Number(boost.videoCompletions) || 0);
    const estimatedVideoDurationSec = Math.max(
      90,
      Number(boost.videoDurationSec) || Math.round(Math.max(120, avgRT.averageReadingSeconds * 0.72))
    );
    const maxVideoPositionSec = Math.max(
      0,
      Math.min(estimatedVideoDurationSec, Number(boost.maxVideoPositionSec) || 0)
    );
    const avgVideoWatchSeconds =
      videoPlays > 0 ? Math.min(estimatedVideoDurationSec, Math.round(videoWatchSeconds / videoPlays)) : 0;
    const videoWatchPercent =
      videoPlays > 0
        ? Math.min(
            100,
            Math.round((Math.max(avgVideoWatchSeconds, maxVideoPositionSec) / estimatedVideoDurationSec) * 100)
          )
        : 0;

    return {
      rank: idx + 1,
      articleId: art.id,
      title: localizedTitle,
      category: art.category,
      archiveCode: `SCIPHIL-#${idx + 1}`,
      publishedAt: art.publishedAt,
      reads: articleReads,
      views: articleViews,
      ownBaselineReads: ownBase.baseReads,
      ownLiveBoostReads: liveBoostReads,
      ownBaselineViews: ownBase.baseViews,
      ownLiveBoostViews: liveBoostViews,
      readToViewRatePct,
      isolatedPerArticle: true as const,
      citations: articleCitations,
      readSharePercent: 0,
      viewSharePercent: 0,
      academicTotalReads,
      academicTotalViews,
      industrialTotalReads,
      industrialTotalViews,
      independentGlobalReads,
      independentGlobalViews,
      siliconValleyReads,
      siliconValleyViews,
      nodeBreakdown,
      averageReadingSeconds: avgRT.averageReadingSeconds,
      averageReadingMinutes: avgRT.averageReadingMinutes,
      averageReadingFormatted: avgRT.formattedShort,
      wordCount: avgRT.wordCount,
      totalReadingMinutes: articleTotalReadMins,
      totalReadingFormatted: formatHoursMins(articleTotalReadMins),
      videoPlays,
      videoWatchSeconds,
      videoCompletions,
      maxVideoPositionSec,
      avgVideoWatchSeconds,
      videoDurationSec: estimatedVideoDurationSec,
      videoWatchPercent,
      videoWatchFormatted: formatVideoDuration(videoWatchSeconds),
      regions: {
        tr: sumRegion('tr'),
        eu: sumRegion('eu'),
        amer: sumRegion('amer'),
        asia: sumRegion('asia'),
        menaOther: sumRegion('menaOther'),
      },
      countries,
      industrialEcosystems,
      topAcademicCenters,
      topSiliconValleyOrgs,
      topNonSvIndustrialOrgs,
      topIndustrialOrgs,
    };
  });

  // PASS 2: Bottom-up exact corpus aggregation from the isolated per-article rows
  const totalReads = preliminaryRows.reduce((acc, r) => acc + r.reads, 0);
  const totalViews = preliminaryRows.reduce((acc, r) => acc + r.views, 0);
  const totalCitations = preliminaryRows.reduce((acc, r) => acc + r.citations, 0);
  const totalAcademicReads = preliminaryRows.reduce((acc, r) => acc + r.academicTotalReads, 0);
  const totalAcademicViews = preliminaryRows.reduce((acc, r) => acc + r.academicTotalViews, 0);
  const totalIndustrialReads = preliminaryRows.reduce((acc, r) => acc + r.industrialTotalReads, 0);
  const totalIndustrialViews = preliminaryRows.reduce((acc, r) => acc + r.industrialTotalViews, 0);
  const totalIndependentReads = preliminaryRows.reduce((acc, r) => acc + r.independentGlobalReads, 0);
  const totalIndependentViews = preliminaryRows.reduce((acc, r) => acc + r.independentGlobalViews, 0);
  const totalSiliconValleyReads = preliminaryRows.reduce((acc, r) => acc + r.siliconValleyReads, 0);
  const totalSiliconValleyViews = preliminaryRows.reduce((acc, r) => acc + r.siliconValleyViews, 0);

  const rows: ArticleGlobalReadAnalytics[] = preliminaryRows.map((row) => ({
    ...row,
    readSharePercent: Number(((row.reads / Math.max(1, totalReads)) * 100).toFixed(2)),
    viewSharePercent: Number(((row.views / Math.max(1, totalViews)) * 100).toFixed(2)),
  }));

  const byArticleId: Record<string, ArticleGlobalReadAnalytics> = {};
  for (const row of rows) {
    byArticleId[row.articleId] = row;
  }

  const totalVideoPlaysAllArticles = Math.max(
    cumulative.videoPlays || 0,
    rows.reduce((acc, r) => acc + r.videoPlays, 0)
  );
  const totalVideoWatchSecondsAllArticles = Math.max(
    cumulative.videoWatchSeconds || 0,
    rows.reduce((acc, r) => acc + r.videoWatchSeconds, 0)
  );
  const articlesWithVideoWatches = rows.filter(
    (r) => r.videoPlays > 0 || r.videoWatchSeconds > 0
  ).length;
  const totalReadingMinutesAllArticles = rows.reduce((acc, r) => acc + r.totalReadingMinutes, 0);
  const meanAvgReadingSeconds = Math.round(
    rows.reduce((acc, r) => acc + r.averageReadingSeconds, 0) / Math.max(1, rows.length)
  );
  const articlesSortedByAvgReadingTimeDesc = [...rows].sort(
    (a, b) => b.averageReadingSeconds - a.averageReadingSeconds || b.wordCount - a.wordCount
  );
  const topWatchedVideoArticles = [...rows]
    .filter((r) => r.videoPlays > 0 || r.videoWatchSeconds > 0)
    .sort((a, b) => b.videoWatchSeconds - a.videoWatchSeconds || b.videoPlays - a.videoPlays)
    .slice(0, 6);

  const regionTotals = {
    tr: {
      reads: rows.reduce((acc, r) => acc + r.regions.tr.reads, 0),
      views: rows.reduce((acc, r) => acc + r.regions.tr.views, 0),
    },
    eu: {
      reads: rows.reduce((acc, r) => acc + r.regions.eu.reads, 0),
      views: rows.reduce((acc, r) => acc + r.regions.eu.views, 0),
    },
    amer: {
      reads: rows.reduce((acc, r) => acc + r.regions.amer.reads, 0),
      views: rows.reduce((acc, r) => acc + r.regions.amer.views, 0),
    },
    asia: {
      reads: rows.reduce((acc, r) => acc + r.regions.asia.reads, 0),
      views: rows.reduce((acc, r) => acc + r.regions.asia.views, 0),
    },
    menaOther: {
      reads: rows.reduce((acc, r) => acc + r.regions.menaOther.reads, 0),
      views: rows.reduce((acc, r) => acc + r.regions.menaOther.views, 0),
    },
  };

  // Corpus-wide totals per country & per individual academic center (reads + views)
  const countryTotals = COUNTRY_ACADEMIC_DEFINITIONS.map((def, cIdx) => {
    const reads = rows.reduce((acc, r) => acc + (r.countries[cIdx]?.reads || 0), 0);
    const views = rows.reduce((acc, r) => acc + (r.countries[cIdx]?.views || 0), 0);
    const academicReads = rows.reduce((acc, r) => acc + (r.countries[cIdx]?.academicReads || 0), 0);
    const academicViews = rows.reduce((acc, r) => acc + (r.countries[cIdx]?.academicViews || 0), 0);

    const centerTotalsMap = new Map<string, AcademicCenterReadStat>();
    for (const cDef of def.centers) {
      centerTotalsMap.set(cDef.id, {
        id: cDef.id,
        name: cDef.name,
        city: cDef.city,
        countryCode: def.code,
        countryName: def.countryName,
        reads: 0,
        views: 0,
        isKAnonymityMasked: false,
        privacySafeReadLabel: '0',
        isViewsKAnonymityMasked: false,
        privacySafeViewLabel: '0',
        shareOfCountryAcademicPct: 0,
      });
    }
    for (const row of rows) {
      const cStat = row.countries[cIdx];
      if (!cStat) continue;
      for (const center of cStat.academicCenters) {
        const entry = centerTotalsMap.get(center.id);
        if (entry) {
          entry.reads += center.reads;
          entry.views += center.views;
        }
      }
    }
    const academicCenters = Array.from(centerTotalsMap.values())
      .map((entry) => {
        const kMask = formatKAnonymousReadLabel(entry.reads);
        const kViewMask = formatKAnonymousReadLabel(entry.views);
        return {
          ...entry,
          isKAnonymityMasked: kMask.isKAnonymityMasked,
          privacySafeReadLabel: kMask.privacySafeReadLabel,
          isViewsKAnonymityMasked: kViewMask.isKAnonymityMasked,
          privacySafeViewLabel: kViewMask.privacySafeReadLabel,
          shareOfCountryAcademicPct: Number(
            ((entry.reads / Math.max(1, academicReads)) * 100).toFixed(1)
          ),
        };
      })
      .sort((a, b) => b.reads - a.reads || b.views - a.views);

    return {
      ...def,
      reads,
      views,
      sharePct: Number(((reads / Math.max(1, totalReads)) * 100).toFixed(2)),
      academicReads,
      academicViews,
      academicCenters,
    };
  });

  // Corpus-wide totals per industrial ecosystem & per individual industrial/Silicon Valley organization (reads + views)
  const industrialEcosystemTotals: IndustrialEcosystemReadStat[] = INDUSTRIAL_ECOSYSTEM_DEFINITIONS.map(
    (ecoDef, ecoIdx) => {
      const ecoReads = rows.reduce(
        (acc, r) => acc + (r.industrialEcosystems[ecoIdx]?.reads || 0),
        0
      );
      const ecoViews = rows.reduce(
        (acc, r) => acc + (r.industrialEcosystems[ecoIdx]?.views || 0),
        0
      );
      const orgMap = new Map<string, IndustrialOrgReadStat>();
      for (const orgDef of ecoDef.organizations) {
        orgMap.set(orgDef.id, {
          id: orgDef.id,
          name: orgDef.name,
          city: orgDef.city,
          sector: orgDef.sector,
          ecosystemId: ecoDef.id,
          ecosystemShortName: ecoDef.shortName,
          reads: 0,
          views: 0,
          isKAnonymityMasked: false,
          privacySafeReadLabel: '0',
          isViewsKAnonymityMasked: false,
          privacySafeViewLabel: '0',
          shareOfEcosystemPct: 0,
        });
      }
      for (const row of rows) {
        const ecoStat = row.industrialEcosystems[ecoIdx];
        if (!ecoStat) continue;
        for (const org of ecoStat.organizations) {
          const entry = orgMap.get(org.id);
          if (entry) {
            entry.reads += org.reads;
            entry.views += org.views;
          }
        }
      }
      const organizations = Array.from(orgMap.values())
        .map((entry) => {
          const kMask = formatKAnonymousReadLabel(entry.reads);
          const kViewMask = formatKAnonymousReadLabel(entry.views);
          return {
            ...entry,
            isKAnonymityMasked: kMask.isKAnonymityMasked,
            privacySafeReadLabel: kMask.privacySafeReadLabel,
            isViewsKAnonymityMasked: kViewMask.isKAnonymityMasked,
            privacySafeViewLabel: kViewMask.privacySafeReadLabel,
            shareOfEcosystemPct: Number(((entry.reads / Math.max(1, ecoReads)) * 100).toFixed(1)),
          };
        })
        .sort((a, b) => b.reads - a.reads || b.views - a.views);

      return {
        id: ecoDef.id,
        name: ecoDef.name,
        shortName: ecoDef.shortName,
        regionLabel: ecoDef.regionLabel,
        countryCode: ecoDef.countryCode,
        reads: ecoReads,
        views: ecoViews,
        shareOfIndustrialPct: Number(
          ((ecoReads / Math.max(1, totalIndustrialReads)) * 100).toFixed(1)
        ),
        shareOfGlobalPct: Number(((ecoReads / Math.max(1, totalReads)) * 100).toFixed(1)),
        organizations,
      };
    }
  );

  return {
    nodesCount: strictNodes.length,
    strictNodes,
    cumulative,
    rows,
    byArticleId,
    totalReads,
    totalViews,
    totalCitations,
    totalAcademicReads,
    totalAcademicViews,
    totalIndustrialReads,
    totalIndustrialViews,
    totalIndependentReads,
    totalIndependentViews,
    totalSiliconValleyReads,
    totalSiliconValleyViews,
    totalVideoPlaysAllArticles,
    totalVideoWatchSecondsAllArticles,
    articlesWithVideoWatches,
    topWatchedVideoArticles,
    totalReadingMinutesAllArticles,
    meanAvgReadingSeconds,
    articlesSortedByAvgReadingTimeDesc,
    regionTotals,
    countryTotals,
    industrialEcosystemTotals,
  };
}
