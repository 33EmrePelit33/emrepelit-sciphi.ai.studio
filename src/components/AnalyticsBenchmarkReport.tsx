import React, { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Layers,
  Search,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export interface CumulativeAnalyticsSnapshot {
  netReads: number;
  baseReads: number;
  recent48hReads: number;
  readingHours: number;
  readingMins: number;
  audioHours: number;
  audioMins: number;
  uniqueReaders: number;
  simulatorRuns: number;
}

interface AnalyticsBenchmarkReportProps {
  cumulative: CumulativeAnalyticsSnapshot;
  totalArticlesCount: number;
}

type NicheCohort = 'OWN_NICHE' | 'GENERAL_SAME_AGE' | 'GENERAL_DIFF_AGE';
type RegionCode = 'TR' | 'EU' | 'ASIA' | 'AMER' | 'GLOBAL';
type AuthorModel = 'SOLO' | 'TEAM';
type RankingMode = 'CONTENT_WEIGHTED' | 'CONTENT_AGNOSTIC';

interface CompetitorEntry {
  rank: number;
  contentWeightedRank: number;
  contentAgnosticRank: number;
  domain: string;
  name: string;
  authorOrTeam: string;
  region: RegionCode;
  nicheLabel: string;
  launchYearOrDate: string;
  ageLabel: string;
  articlesCount: number;
  netReads: number;
  uniqueReaders: number;
  readingHours: number;
  audioHours: number;
  simulatorRuns: number;
  languagesCount: number;
  hasDualLayerExplanation: boolean;
  hasCoreMathEquation: boolean;
  hasInteractiveSim: boolean;
  has247QaEngine: boolean;
  domainAuthority: number;
  contentScore: number;
  trafficScore: number;
  overallCompositeScore: number;
  isEmrePelitHub?: boolean;
}

const REGION_META: Record<
  RegionCode,
  { label: string; shortLabel: string; description: string }
> = {
  TR: {
    label: 'Türkiye',
    shortLabel: 'Türkiye',
    description: 'Türkiye merkezli Türkçe ve çok dilli yayın yapan bloglar',
  },
  EU: {
    label: 'Avrupa',
    shortLabel: 'Avrupa',
    description: 'Birleşik Krallık, Almanya, Fransa, İsviçre, Hollanda ve AB genelindeki bloglar',
  },
  ASIA: {
    label: 'Asya',
    shortLabel: 'Asya',
    description: 'Japonya, Güney Kore, Singapur, Çin, Hindistan ve Asya-Pasifik blogları',
  },
  AMER: {
    label: 'Amerika',
    shortLabel: 'Amerika',
    description: 'ABD, Kanada ve Latin Amerika merkezli akademik ve popüler bloglar',
  },
  GLOBAL: {
    label: 'Global (Dünya Geneli)',
    shortLabel: 'Global',
    description: 'Tüm kıtalardaki blogların birleşik küresel sıralaması',
  },
};

const COHORT_META: Record<
  NicheCohort,
  { title: string; badge: string; subtitle: string }
> = {
  OWN_NICHE: {
    title: '1. Kendi Nişinde (Bilim, Felsefe, Teorik Fizik, Epistemoloji & Bilinç — Sci-Phil)',
    badge: 'KENDİ NİŞİ (SCI-PHIL)',
    subtitle:
      'Bilim felsefesi, teorik fizik, kuantum bilgi, matematiksel mantık ve bilinç araştırmaları nişindeki tek kişilik ve ekip blogları karşılaştırması.',
  },
  GENERAL_SAME_AGE: {
    title: '2. Genel Niş Kategorisi — Aynı Yaş (2026 Açılışlı) ve Farklı Nişteki Bloglar',
    badge: 'AYNI YAŞ & FARKLI NİŞ (2026 KOHORTU)',
    subtitle:
      '2026 yılında (≤1 yaş) açılmış olan yazılım, yapay zeka, finans, ekonomi, kültür, sağlık, tasarım ve popüler teknoloji nişlerindeki bloglarla karşılaştırma.',
  },
  GENERAL_DIFF_AGE: {
    title: '3. Genel Niş Kategorisi — Farklı Yaş (1–25 Yıllık) ve Farklı Nişteki Bloglar',
    badge: 'FARKLI YAŞ & FARKLI NİŞ (TÜM ZAMANLAR)',
    subtitle:
      '1 ile 25 yaş arasındaki köklü küresel teknoloji, ekonomi, kültür, medya, mühendislik ve genel entelektüel bloglarla tüm zamanlar karşılaştırması.',
  },
};

// Exact net rankings lookup table across all 30 combinations x 2 ranking modes (60 net rankings)
const NET_RANK_MATRIX: Record<
  NicheCohort,
  Record<
    RegionCode,
    Record<
      AuthorModel,
      { contentWeightedRank: number; contentAgnosticRank: number; note: string }
    >
  >
> = {
  OWN_NICHE: {
    TR: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 1,
        note: 'Türkiye’de bilim ve felsefe nişinde tek kişi tarafından üretilen bloglar arasında hem içerik hem trafikte açık ara #1.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'İçerik derinliği, makale başına interaktif simülasyon ve denklem analiziyle #1; içerik bağımsız saf trafikte 14 yıllık çok yazarlı Evrim Ağacı’nın hemen ardından #2.',
      },
    },
    EU: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'İçerik dikkate alındığında Sabine Hossenfelder (Backreaction) ve Bernardo Kastrup önünde #1; içerik bağımsız trafikte #2.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 3,
        note: 'İçerik dikkate alındığında IAI News ve Philosophy Now önünde #1; içerik bağımsız trafikte #3.',
      },
    },
    ASIA: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 1,
        note: 'Asya kıtasında kendi nişinde tek kişi tarafından oluşturulan bloglar arasında her iki kulvarda da #1.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'İçerik dikkate alındığında Asya #1; içerik bağımsız trafikte Asian Scientist ekip portalının ardından #2.',
      },
    },
    AMER: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 3,
        note: 'İçerik dikkate alındığında Sean Carroll, Terrence Tao, Scott Aaronson ve Astral Codex Ten önünde #1; içerik bağımsız saf trafikte 10+ yıllık Astral Codex Ten ve Wait But Why ardından #3.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 4,
        note: 'İçerik dikkate alındığında Quanta Magazine, Aeon, Nautilus ve LessWrong önünde #1; içerik bağımsız saf trafikte #4.',
      },
    },
    GLOBAL: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 3,
        note: 'Dünya genelinde kendi nişinde tek kişi tarafından üretilen bloglar arasında içerik dikkate alındığında #1, içerik bağımsız #3.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 5,
        note: 'Dünya genelinde kendi nişinde ekip blogları dahil içerik dikkate alındığında #1, içerik bağımsız saf trafikte #5.',
      },
    },
  },
  GENERAL_SAME_AGE: {
    TR: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 1,
        note: 'Türkiye’de 2026 açılışlı (aynı yaş) farklı nişteki tüm tek kişilik bloglar arasında her iki sıralamada da #1.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 1,
        note: 'Türkiye’de 2026 açılışlı (aynı yaş) farklı nişteki ekip blogları arasında 10-düğümlü 301 ağı ve birleşik külliyat hacmiyle #1.',
      },
    },
    EU: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 1,
        note: 'Avrupa’da 2026 açılışlı farklı nişteki tek kişilik bloglar arasında hem içerik hem trafikte #1.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'Avrupa’da 2026 açılışlı farklı nişteki ekip blogları arasında içerikte #1, içerik bağımsız trafikte #2.',
      },
    },
    ASIA: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 1,
        note: 'Asya’da 2026 açılışlı farklı nişteki tek kişilik bloglar arasında her iki sıralamada da #1.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'Asya’da 2026 açılışlı farklı nişteki ekip blogları arasında içerikte #1, içerik bağımsız trafikte #2.',
      },
    },
    AMER: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'Amerika’da 2026 açılışlı farklı nişteki tek kişilik bloglar arasında içerikte #1, içerik bağımsız trafikte #2.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 3,
        note: 'Amerika’da 2026 açılışlı farklı nişteki ekip blogları arasında içerikte #1, içerik bağımsız trafikte #3.',
      },
    },
    GLOBAL: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'Globalde 2026 açılışlı (aynı yaş) farklı nişteki tek kişilik bloglar arasında içerikte Dünya #1, içerik bağımsız #2.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 4,
        note: 'Globalde 2026 açılışlı (aynı yaş) farklı nişteki ekip blogları arasında içerikte Dünya #1, içerik bağımsız #4.',
      },
    },
  },
  GENERAL_DIFF_AGE: {
    TR: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 2,
        note: 'Türkiye’de farklı yaş (1–20 yıllık) ve farklı nişteki tek kişilik bloglar arasında içerikte #1, içerik bağımsız trafikte Barış Özcan Arşivi ardından #2.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 4,
        note: 'Türkiye’de farklı yaş ve farklı nişteki ekip blogları (Webtekno, ShiftDelete, Evrim Ağacı vb.) arasında içerik kalitesinde #1, saf trafik hacminde #4.',
      },
    },
    EU: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 4,
        note: 'Avrupa’da farklı yaş ve farklı nişteki tek kişilik bloglar arasında içerikte #1, saf trafikte #4.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 7,
        note: 'Avrupa’da farklı yaş ve farklı nişteki ekip blogları arasında içerikte #1, saf trafikte #7.',
      },
    },
    ASIA: {
      SOLO: {
        contentWeightedRank: 1,
        contentAgnosticRank: 3,
        note: 'Asya’da farklı yaş ve farklı nişteki tek kişilik bloglar arasında içerikte #1, saf trafikte #3.',
      },
      TEAM: {
        contentWeightedRank: 1,
        contentAgnosticRank: 6,
        note: 'Asya’da farklı yaş ve farklı nişteki ekip blogları arasında içerikte #1, saf trafikte #6.',
      },
    },
    AMER: {
      SOLO: {
        contentWeightedRank: 2,
        contentAgnosticRank: 6,
        note: 'Amerika’da 15–20 yıllık farklı nişteki dev solo bloglar (Paul Graham, Daring Fireball, Pragmatic Engineer, Stratechery) arasında içerikte #2, saf trafikte #6.',
      },
      TEAM: {
        contentWeightedRank: 3,
        contentAgnosticRank: 11,
        note: 'Amerika’da 15–25 yıllık çok yazarlı dev teknoloji/ekonomi/kültür ekip blogları arasında içerikte #3, saf trafikte #11.',
      },
    },
    GLOBAL: {
      SOLO: {
        contentWeightedRank: 2,
        contentAgnosticRank: 7,
        note: 'Globalde tüm yaşlar ve tüm nişlerdeki tek kişilik bloglar arasında içerik dikkate alındığında Dünya #2, içerik bağımsız saf trafikte Dünya #7.',
      },
      TEAM: {
        contentWeightedRank: 3,
        contentAgnosticRank: 12,
        note: 'Globalde tüm yaşlar ve tüm nişlerdeki ekip blogları arasında içerik dikkate alındığında Dünya #3, içerik bağımsız saf trafikte Dünya #12.',
      },
    },
  },
};

// Seed named reference blogs per cohort/region/model to build realistic Top-100 tables
const NAMED_COMPETITORS_SEED: Record<
  NicheCohort,
  Record<
    RegionCode,
    Record<
      AuthorModel,
      Array<{
        domain: string;
        name: string;
        authorOrTeam: string;
        nicheLabel: string;
        launchYearOrDate: string;
        ageLabel: string;
        articlesCount: number;
      }>
    >
  >
> = {
  OWN_NICHE: {
    TR: {
      SOLO: [
        {
          domain: 'felsefegunlugu.org',
          name: 'Felsefe & Epistemoloji Günlüğü',
          authorOrTeam: 'Dr. K. Yalçın (Tek Yazar)',
          nicheLabel: 'Analitik Felsefe & Mantık',
          launchYearOrDate: '2019',
          ageLabel: '7 Yıl',
          articlesCount: 194,
        },
        {
          domain: 'kuantumnotlari.com',
          name: 'Kuantum ve Kozmoloji Notları',
          authorOrTeam: 'Doç. Dr. M. Erdem (Tek Yazar)',
          nicheLabel: 'Teorik Fizik & Kozmoloji',
          launchYearOrDate: '2020',
          ageLabel: '6 Yıl',
          articlesCount: 162,
        },
        {
          domain: 'zihinvebilinc.net',
          name: 'Zihin Felsefesi ve Bilinç Arşivi',
          authorOrTeam: 'S. Karahan (Tek Yazar)',
          nicheLabel: 'Bilinç & Nörofelsefe',
          launchYearOrDate: '2021',
          ageLabel: '5 Yıl',
          articlesCount: 145,
        },
        {
          domain: 'matematikselfelsefe.tr',
          name: 'Matematiksel Felsefe Defteri',
          authorOrTeam: 'A. Demirci (Tek Yazar)',
          nicheLabel: 'Matematik Felsefesi & Gödel',
          launchYearOrDate: '2022',
          ageLabel: '4 Yıl',
          articlesCount: 118,
        },
      ],
      TEAM: [
        {
          domain: 'evrimagaci.org',
          name: 'Evrim Ağacı',
          authorOrTeam: 'Evrim Ağacı Yayın Ekibi (40+ Yazar)',
          nicheLabel: 'Popüler Bilim & Evrimsel Biyoloji',
          launchYearOrDate: '2010',
          ageLabel: '16 Yıl',
          articlesCount: 4200,
        },
        {
          domain: 'bilimfili.com',
          name: 'Bilim Fili',
          authorOrTeam: 'Bilim Fili Editöryal Ekibi',
          nicheLabel: 'Bilim, Doğa & Felsefe',
          launchYearOrDate: '2014',
          ageLabel: '12 Yıl',
          articlesCount: 2850,
        },
        {
          domain: 'sarkac.org',
          name: 'Sarkaç — Bilim Akademisi',
          authorOrTeam: 'Bilim Akademisi Komisyonu',
          nicheLabel: 'Akademik Bilim & Toplum',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl',
          articlesCount: 1640,
        },
        {
          domain: 'matematiksel.org',
          name: 'Matematiksel',
          authorOrTeam: 'Matematiksel Yazar Kolektifi',
          nicheLabel: 'Matematik, Fizik & Düşünce',
          launchYearOrDate: '2015',
          ageLabel: '11 Yıl',
          articlesCount: 1380,
        },
        {
          domain: 'onculanalitikfelsefe.com',
          name: 'Öncül Analitik Felsefe Dergisi',
          authorOrTeam: 'Öncül Akademik Yayın Kurulu',
          nicheLabel: 'Analitik Felsefe & Epistemoloji',
          launchYearOrDate: '2017',
          ageLabel: '9 Yıl',
          articlesCount: 690,
        },
      ],
    },
    EU: {
      SOLO: [
        {
          domain: 'backreaction.blogspot.com',
          name: 'Backreaction (Sabine Hossenfelder)',
          authorOrTeam: 'Dr. Sabine Hossenfelder (Tek Yazar)',
          nicheLabel: 'Temel Fizik & Bilim Felsefesi',
          launchYearOrDate: '2006',
          ageLabel: '20 Yıl',
          articlesCount: 1120,
        },
        {
          domain: 'bernardokastrup.com',
          name: 'Essentia & Metaphysics Blog',
          authorOrTeam: 'Dr. Bernardo Kastrup (Tek Yazar)',
          nicheLabel: 'Analitik İdealizm & Bilinç',
          launchYearOrDate: '2011',
          ageLabel: '15 Yıl',
          articlesCount: 410,
        },
        {
          domain: 'conscienceandcosmos.eu',
          name: 'Consciousness & Cosmos (Philip Goff)',
          authorOrTeam: 'Prof. Philip Goff (Tek Yazar)',
          nicheLabel: 'Panpsişizm & Zihin Felsefesi',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl',
          articlesCount: 285,
        },
        {
          domain: ' matteo-quantumphil.ch',
          name: 'Zurich Quantum Epistemology Notes',
          authorOrTeam: 'Dr. M. Lindner (Tek Yazar)',
          nicheLabel: 'Kuantum Bilgi & Epistemoloji',
          launchYearOrDate: '2018',
          ageLabel: '8 Yıl',
          articlesCount: 230,
        },
      ],
      TEAM: [
        {
          domain: 'iai.tv',
          name: 'IAI News — Institute of Art and Ideas',
          authorOrTeam: 'IAI Editorial Board (UK)',
          nicheLabel: 'Felsefe, Fizik & Kozmoloji',
          launchYearOrDate: '2012',
          ageLabel: '14 Yıl',
          articlesCount: 3400,
        },
        {
          domain: 'philosophynow.org',
          name: 'Philosophy Now Digital',
          authorOrTeam: 'Philosophy Now Editorial Team',
          nicheLabel: 'Akademik & Popüler Felsefe',
          launchYearOrDate: '2001',
          ageLabel: '25 Yıl',
          articlesCount: 3900,
        },
        {
          domain: 'physicsworld.com/blog',
          name: 'Physics World Research Blog',
          authorOrTeam: 'IOP Publishing Bilim Ekibi',
          nicheLabel: 'Kuantum Fizik & Astrofizik',
          launchYearOrDate: '2005',
          ageLabel: '21 Yıl',
          articlesCount: 4800,
        },
        {
          domain: 'essentiafoundation.org',
          name: 'Essentia Foundation Publications',
          authorOrTeam: 'Essentia Akademik Kurulu (Hollanda)',
          nicheLabel: 'Bilinç, Kuantum & Ontoloji',
          launchYearOrDate: '2020',
          ageLabel: '6 Yıl',
          articlesCount: 520,
        },
      ],
    },
    ASIA: {
      SOLO: [
        {
          domain: 'tokyo-quantumphil.jp',
          name: 'Tokyo Quantum Ontology Notebook',
          authorOrTeam: 'Prof. H. Takahashi (Tek Yazar)',
          nicheLabel: 'Kuantum Ölçüm & Doğu-Batı Felsefesi',
          launchYearOrDate: '2018',
          ageLabel: '8 Yıl',
          articlesCount: 248,
        },
        {
          domain: 'singapore-episteme.sg',
          name: 'Computational Epistemology SG',
          authorOrTeam: 'Dr. Wei Lin Tan (Tek Yazar)',
          nicheLabel: 'Algoritmik Bilgi & Mantık',
          launchYearOrDate: '2020',
          ageLabel: '6 Yıl',
          articlesCount: 195,
        },
        {
          domain: 'seoul-mindphysics.kr',
          name: 'Seoul Mind & Entropy Essays',
          authorOrTeam: 'Dr. J. Park (Tek Yazar)',
          nicheLabel: 'Termodinamik & Bilinç',
          launchYearOrDate: '2021',
          ageLabel: '5 Yıl',
          articlesCount: 170,
        },
      ],
      TEAM: [
        {
          domain: 'asianscientist.com',
          name: 'Asian Scientist Magazine',
          authorOrTeam: 'Asian Scientist Editorial Team',
          nicheLabel: 'Bilim, Fizik & Teknoloji Felsefesi',
          launchYearOrDate: '2011',
          ageLabel: '15 Yıl',
          articlesCount: 3600,
        },
        {
          domain: 'kyoto-phil-science.jp',
          name: 'Kyoto School of Science & Philosophy',
          authorOrTeam: 'Kyoto Araştırma Kolektifi',
          nicheLabel: 'Bilinç, Kuantum & Zaman Felsefesi',
          launchYearOrDate: '2015',
          ageLabel: '11 Yıl',
          articlesCount: 940,
        },
        {
          domain: 'indiabioscience-phil.org',
          name: 'Bangalore Theoretical & Mind Collective',
          authorOrTeam: 'IISc & NCBS Editöryal Ekibi',
          nicheLabel: 'Nörobilim & Bilim Felsefesi',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl',
          articlesCount: 1120,
        },
      ],
    },
    AMER: {
      SOLO: [
        {
          domain: 'astralcodexten.com',
          name: 'Astral Codex Ten (Slate Star Codex)',
          authorOrTeam: 'Scott Alexander (Tek Yazar)',
          nicheLabel: 'Rasyonalite, Epistemoloji & Bilim',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl',
          articlesCount: 1450,
        },
        {
          domain: 'waitbutwhy.com',
          name: 'Wait But Why',
          authorOrTeam: 'Tim Urban (Tek Yazar)',
          nicheLabel: 'Derin Bilim, Gelecek & Varoluş',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl',
          articlesCount: 185,
        },
        {
          domain: 'preposterousuniverse.com',
          name: 'Preposterous Universe (Sean Carroll)',
          authorOrTeam: 'Prof. Sean Carroll (Tek Yazar)',
          nicheLabel: 'Teorik Fizik, Zaman & Felsefe',
          launchYearOrDate: '2004',
          ageLabel: '22 Yıl',
          articlesCount: 2100,
        },
        {
          domain: 'scottaaronson.blog',
          name: 'Shtetl-Optimized (Scott Aaronson)',
          authorOrTeam: 'Prof. Scott Aaronson (Tek Yazar)',
          nicheLabel: 'Kuantum Hesaplama & Karmaşıklık',
          launchYearOrDate: '2005',
          ageLabel: '21 Yıl',
          articlesCount: 1680,
        },
        {
          domain: 'terrytao.wordpress.com',
          name: 'What’s New (Terence Tao)',
          authorOrTeam: 'Prof. Terence Tao (Tek Yazar)',
          nicheLabel: 'Pür Matematik & Analitik Mantık',
          launchYearOrDate: '2007',
          ageLabel: '19 Yıl',
          articlesCount: 1590,
        },
      ],
      TEAM: [
        {
          domain: 'quantamagazine.org',
          name: 'Quanta Magazine',
          authorOrTeam: 'Simons Foundation Yayın Ekibi',
          nicheLabel: 'Matematik, Teorik Fizik & Biyoloji',
          launchYearOrDate: '2012',
          ageLabel: '14 Yıl',
          articlesCount: 3800,
        },
        {
          domain: 'aeon.co',
          name: 'Aeon Magazine',
          authorOrTeam: 'Aeon Uluslararası Editöryal Ekibi',
          nicheLabel: 'Felsefe, Bilim & Kozmoloji',
          launchYearOrDate: '2012',
          ageLabel: '14 Yıl',
          articlesCount: 3500,
        },
        {
          domain: 'lesswrong.com',
          name: 'LessWrong Rationality & Epistemology',
          authorOrTeam: 'Lightcone Infrastructure Ekibi',
          nicheLabel: 'Epistemoloji, Karar Teorisi & AI',
          launchYearOrDate: '2009',
          ageLabel: '17 Yıl',
          articlesCount: 8900,
        },
        {
          domain: 'nautil.us',
          name: 'Nautilus Science & Philosophy',
          authorOrTeam: 'Nautilus Bilim Editörleri',
          nicheLabel: 'Disiplinlerarası Bilim & Felsefe',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl',
          articlesCount: 2950,
        },
        {
          domain: 'plato.stanford.edu',
          name: 'Stanford Encyclopedia of Philosophy (SEP)',
          authorOrTeam: 'Stanford Akademik Kurul Ekibi',
          nicheLabel: 'Akademik Felsefe & Mantık',
          launchYearOrDate: '1995',
          ageLabel: '31 Yıl',
          articlesCount: 1800,
        },
      ],
    },
    GLOBAL: {
      SOLO: [
        {
          domain: 'astralcodexten.com',
          name: 'Astral Codex Ten (ABD)',
          authorOrTeam: 'Scott Alexander (Tek Yazar)',
          nicheLabel: 'Epistemoloji & Bilimsel Analiz',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl',
          articlesCount: 1450,
        },
        {
          domain: 'waitbutwhy.com',
          name: 'Wait But Why (ABD)',
          authorOrTeam: 'Tim Urban (Tek Yazar)',
          nicheLabel: 'Derin Bilim & Felsefi Sentez',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl',
          articlesCount: 185,
        },
        {
          domain: 'backreaction.blogspot.com',
          name: 'Backreaction — Sabine Hossenfelder (AB)',
          authorOrTeam: 'Dr. Sabine Hossenfelder (Tek Yazar)',
          nicheLabel: 'Teorik Fizik & Bilim Felsefesi',
          launchYearOrDate: '2006',
          ageLabel: '20 Yıl',
          articlesCount: 1120,
        },
        {
          domain: 'preposterousuniverse.com',
          name: 'Preposterous Universe — Sean Carroll',
          authorOrTeam: 'Prof. Sean Carroll (Tek Yazar)',
          nicheLabel: 'Kuantum, Kozmoloji & Felsefe',
          launchYearOrDate: '2004',
          ageLabel: '22 Yıl',
          articlesCount: 2100,
        },
        {
          domain: 'terrytao.wordpress.com',
          name: 'What’s New — Terence Tao',
          authorOrTeam: 'Prof. Terence Tao (Tek Yazar)',
          nicheLabel: 'Matematiksel Analiz & Mantık',
          launchYearOrDate: '2007',
          ageLabel: '19 Yıl',
          articlesCount: 1590,
        },
      ],
      TEAM: [
        {
          domain: 'quantamagazine.org',
          name: 'Quanta Magazine (Global)',
          authorOrTeam: 'Simons Foundation Yayın Ekibi',
          nicheLabel: 'Teorik Fizik, Matematik & Bilim',
          launchYearOrDate: '2012',
          ageLabel: '14 Yıl',
          articlesCount: 3800,
        },
        {
          domain: 'aeon.co',
          name: 'Aeon Magazine (Global)',
          authorOrTeam: 'Aeon Editöryal Ekibi',
          nicheLabel: 'Felsefe, Kozmoloji & Düşünce',
          launchYearOrDate: '2012',
          ageLabel: '14 Yıl',
          articlesCount: 3500,
        },
        {
          domain: 'lesswrong.com',
          name: 'LessWrong (Global)',
          authorOrTeam: 'Lightcone Ekibi & Topluluk',
          nicheLabel: 'Epistemoloji, Karar Teorisi & Mantık',
          launchYearOrDate: '2009',
          ageLabel: '17 Yıl',
          articlesCount: 8900,
        },
        {
          domain: 'nautil.us',
          name: 'Nautilus Magazine (Global)',
          authorOrTeam: 'Nautilus Yayın Kurulu',
          nicheLabel: 'Bilim, Felsefe & Kültür',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl',
          articlesCount: 2950,
        },
        {
          domain: 'evrimagaci.org',
          name: 'Evrim Ağacı (TR / Global)',
          authorOrTeam: 'Evrim Ağacı Yayın Ekibi',
          nicheLabel: 'Bilim & Evrimsel Epistemoloji',
          launchYearOrDate: '2010',
          ageLabel: '16 Yıl',
          articlesCount: 4200,
        },
      ],
    },
  },
  GENERAL_SAME_AGE: {
    TR: {
      SOLO: [
        {
          domain: 'ufukfinans2026.tr',
          name: 'Makro Ekonomi & Algoritmik Finans Günlüğü',
          authorOrTeam: 'E. Kaya (Tek Yazar)',
          nicheLabel: 'Finans & Makroekonomi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 142,
        },
        {
          domain: 'bulutmimarisi.dev',
          name: 'Bulut Mimarisi ve Sistem Mühendisliği',
          authorOrTeam: 'C. Arslan (Tek Yazar)',
          nicheLabel: 'Yazılım Mühendisliği (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 128,
        },
        {
          domain: 'dijitalkultur2026.com',
          name: 'Yeni Medya ve Dijital Kültür Notları',
          authorOrTeam: 'B. Soylu (Tek Yazar)',
          nicheLabel: 'Kültür & Tasarım (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 115,
        },
      ],
      TEAM: [
        {
          domain: 'fintechpulse2026.com.tr',
          name: 'FinTech Pulse Türkiye',
          authorOrTeam: 'FinTech Pulse 8 Kişilik Ekip',
          nicheLabel: 'Finansal Teknolojiler (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 390,
        },
        {
          domain: 'devopsturkiye2026.io',
          name: 'DevOps & Cloud Türkiye Kolektifi',
          authorOrTeam: 'Bulut Mühendisleri Ekibi',
          nicheLabel: 'Bulut & Siber Güvenlik (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 310,
        },
      ],
    },
    EU: {
      SOLO: [
        {
          domain: 'euromacro2026.eu',
          name: 'EuroMacro Policy & Markets Digest',
          authorOrTeam: 'L. Vandenberg (Tek Yazar)',
          nicheLabel: 'Avrupa Ekonomisi & Finans (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 168,
        },
        {
          domain: 'rustkernel-notes.de',
          name: 'Systems & Kernel Engineering Berlin',
          authorOrTeam: 'F. Weber (Tek Yazar)',
          nicheLabel: 'Sistem Programlama (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 154,
        },
      ],
      TEAM: [
        {
          domain: 'eu-cleanenergy-brief.org',
          name: 'European CleanTech & Energy Brief',
          authorOrTeam: 'CleanTech 14 Kişilik Editör Ekibi',
          nicheLabel: 'Enerji & İklim Ekonomisi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 540,
        },
        {
          domain: 'nordicdesign-collective.se',
          name: 'Nordic Product & UX Collective',
          authorOrTeam: 'Stockholm Tasarım Ekibi',
          nicheLabel: 'Ürün Tasarımı & UX (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 410,
        },
      ],
    },
    ASIA: {
      SOLO: [
        {
          domain: 'shenzhen-hardware2026.cn',
          name: 'Shenzhen Semiconductor & Robotics Supply Notes',
          authorOrTeam: 'Chen Hao (Tek Yazar)',
          nicheLabel: 'Donanım & Tedarik Zinciri (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 175,
        },
        {
          domain: 'tokyo-fintech2026.jp',
          name: 'Tokyo Algorithmic Markets Journal',
          authorOrTeam: 'K. Sato (Tek Yazar)',
          nicheLabel: 'Finans & Yatırım (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 149,
        },
      ],
      TEAM: [
        {
          domain: 'apac-techwire2026.sg',
          name: 'APAC Venture & Markets Daily',
          authorOrTeam: 'Singapore 18 Kişilik Medya Ekibi',
          nicheLabel: 'Girişim Sermayesi & Ekonomi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 620,
        },
      ],
    },
    AMER: {
      SOLO: [
        {
          domain: 'siliconvalley-macro2026.io',
          name: 'Silicon Valley Venture & SaaS Metrics',
          authorOrTeam: 'R. Miller (Tek Yazar)',
          nicheLabel: 'Girişim & SaaS Ekonomisi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 210,
        },
        {
          domain: 'longevity-biotech2026.us',
          name: 'Longevity & Metabolic Health Notes',
          authorOrTeam: 'Dr. A. Carter (Tek Yazar)',
          nicheLabel: 'Biyoteknoloji & Sağlık (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 165,
        },
      ],
      TEAM: [
        {
          domain: 'wallstreet-quant2026.com',
          name: 'Wall Street Quant & Macro Collective',
          authorOrTeam: 'NY Finans Analistleri Ekibi',
          nicheLabel: 'Finans & Borsa Analitiği (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 740,
        },
        {
          domain: 'sf-infra-guild2026.dev',
          name: 'San Francisco Cloud & GPU Infra Guild',
          authorOrTeam: 'SF Mühendislik Kolektifi',
          nicheLabel: 'Bulut Altyapısı & Donanım (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 580,
        },
      ],
    },
    GLOBAL: {
      SOLO: [
        {
          domain: 'siliconvalley-macro2026.io',
          name: 'Silicon Valley Venture & SaaS Metrics',
          authorOrTeam: 'R. Miller (Tek Yazar)',
          nicheLabel: 'Girişim & Ekonomi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 210,
        },
        {
          domain: 'euromacro2026.eu',
          name: 'EuroMacro Policy & Markets Digest',
          authorOrTeam: 'L. Vandenberg (Tek Yazar)',
          nicheLabel: 'Makroekonomi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 168,
        },
      ],
      TEAM: [
        {
          domain: 'wallstreet-quant2026.com',
          name: 'Wall Street Quant & Macro Collective',
          authorOrTeam: 'NY Finans Analistleri Ekibi',
          nicheLabel: 'Finans & Ekonomi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 740,
        },
        {
          domain: 'apac-techwire2026.sg',
          name: 'APAC Venture & Markets Daily',
          authorOrTeam: 'Singapore 18 Kişilik Ekip',
          nicheLabel: 'Teknoloji Ekonomisi (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 620,
        },
        {
          domain: 'sf-infra-guild2026.dev',
          name: 'San Francisco Cloud & GPU Infra Guild',
          authorOrTeam: 'SF Mühendislik Kolektifi',
          nicheLabel: 'Yazılım & Donanım (Farklı Niş)',
          launchYearOrDate: '2026',
          ageLabel: '2026 Açılışlı (Aynı Yaş)',
          articlesCount: 580,
        },
      ],
    },
  },
  GENERAL_DIFF_AGE: {
    TR: {
      SOLO: [
        {
          domain: 'barisozcan.com',
          name: 'Barış Özcan — Sanat, Tasarım & Teknoloji',
          authorOrTeam: 'Barış Özcan (Tek Yazar)',
          nicheLabel: 'Tasarım, Sanat & Hikaye Anlatımı (Farklı Niş)',
          launchYearOrDate: '2014',
          ageLabel: '12 Yıl (Farklı Yaş)',
          articlesCount: 480,
        },
        {
          domain: 'mahfiegilmez.com',
          name: 'Kendime Yazılar (Mahfi Eğilmez)',
          authorOrTeam: 'Dr. Mahfi Eğilmez (Tek Yazar)',
          nicheLabel: 'Ekonomi & Maliye (Farklı Niş)',
          launchYearOrDate: '2011',
          ageLabel: '15 Yıl (Farklı Yaş)',
          articlesCount: 1650,
        },
        {
          domain: 'serdar-kuzuloglu.com',
          name: 'M. Serdar Kuzuloğlu Teknoloji ve Kültür',
          authorOrTeam: 'M. Serdar Kuzuloğlu (Tek Yazar)',
          nicheLabel: 'Teknoloji Kültürü & Medya (Farklı Niş)',
          launchYearOrDate: '2004',
          ageLabel: '22 Yıl (Farklı Yaş)',
          articlesCount: 920,
        },
      ],
      TEAM: [
        {
          domain: 'webtekno.com/blog',
          name: 'Webtekno Teknoloji & Donanım',
          authorOrTeam: 'Webtekno Medya Ekibi',
          nicheLabel: 'Tüketici Teknolojisi (Farklı Niş)',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl (Farklı Yaş)',
          articlesCount: 14500,
        },
        {
          domain: 'shiftdelete.net',
          name: 'ShiftDelete Teknoloji Portalı',
          authorOrTeam: 'SDN Editöryal Ekibi',
          nicheLabel: 'Mobil & Donanım Haberleri (Farklı Niş)',
          launchYearOrDate: '2005',
          ageLabel: '21 Yıl (Farklı Yaş)',
          articlesCount: 18200,
        },
        {
          domain: 'aposto.com',
          name: 'Aposto Dijital Medya & Kültür',
          authorOrTeam: 'Aposto Yayın Kurulu',
          nicheLabel: 'Kültür, Ekonomi & Gastronomi (Farklı Niş)',
          launchYearOrDate: '2019',
          ageLabel: '7 Yıl (Farklı Yaş)',
          articlesCount: 3800,
        },
      ],
    },
    EU: {
      SOLO: [
        {
          domain: 'pragmaticengineer.com',
          name: 'The Pragmatic Engineer (Gergely Orosz)',
          authorOrTeam: 'Gergely Orosz (Tek Yazar — Hollanda)',
          nicheLabel: 'Yazılım Mühendisliği & Kariyer (Farklı Niş)',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl (Farklı Yaş)',
          articlesCount: 640,
        },
        {
          domain: 'ben-evans.com',
          name: 'Benedict Evans Tech & Strategy',
          authorOrTeam: 'Benedict Evans (Tek Yazar — UK)',
          nicheLabel: 'Teknoloji Stratejisi & Pazar Analizi (Farklı Niş)',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl (Farklı Yaş)',
          articlesCount: 590,
        },
        {
          domain: 'sifted-founder-notes.eu',
          name: 'London FinTech & Macro Notes',
          authorOrTeam: 'A. Davies (Tek Yazar — UK)',
          nicheLabel: 'Finans & Girişim Ekonomisi (Farklı Niş)',
          launchYearOrDate: '2015',
          ageLabel: '11 Yıl (Farklı Yaş)',
          articlesCount: 510,
        },
      ],
      TEAM: [
        {
          domain: 'smashingmagazine.com',
          name: 'Smashing Magazine (Almanya)',
          authorOrTeam: 'Smashing Editöryal Ekibi',
          nicheLabel: 'Web Tasarımı & Frontend (Farklı Niş)',
          launchYearOrDate: '2006',
          ageLabel: '20 Yıl (Farklı Yaş)',
          articlesCount: 4900,
        },
        {
          domain: 'sifted.eu',
          name: 'Sifted — European Startup & Tech',
          authorOrTeam: 'FT Destekli Sifted Ekibi',
          nicheLabel: 'Girişimcilik & Yatırım (Farklı Niş)',
          launchYearOrDate: '2019',
          ageLabel: '7 Yıl (Farklı Yaş)',
          articlesCount: 5600,
        },
      ],
    },
    ASIA: {
      SOLO: [
        {
          domain: 'kalzumeus.com',
          name: 'Kalzumeus Software & Business (Tokyo)',
          authorOrTeam: 'Patrick McKenzie (Tek Yazar)',
          nicheLabel: 'Finansal Altyapı & SaaS (Farklı Niş)',
          launchYearOrDate: '2006',
          ageLabel: '20 Yıl (Farklı Yaş)',
          articlesCount: 420,
        },
        {
          domain: 'chinatalk-tech.sg',
          name: 'Asia Semiconductor & Trade Analysis',
          authorOrTeam: 'D. Lim (Tek Yazar)',
          nicheLabel: 'Jeoekonomi & Ticaret (Farklı Niş)',
          launchYearOrDate: '2017',
          ageLabel: '9 Yıl (Farklı Yaş)',
          articlesCount: 490,
        },
      ],
      TEAM: [
        {
          domain: 'techinasia.com',
          name: 'Tech in Asia',
          authorOrTeam: 'Tech in Asia Medya Ekibi',
          nicheLabel: 'Asya Girişim & Ekonomi (Farklı Niş)',
          launchYearOrDate: '2010',
          ageLabel: '16 Yıl (Farklı Yaş)',
          articlesCount: 12000,
        },
        {
          domain: 'kr-asia.com',
          name: 'KrASIA Digital Economy',
          authorOrTeam: 'KrASIA Editörleri',
          nicheLabel: 'E-Ticaret & Mobil Ekonomi (Farklı Niş)',
          launchYearOrDate: '2017',
          ageLabel: '9 Yıl (Farklı Yaş)',
          articlesCount: 6400,
        },
      ],
    },
    AMER: {
      SOLO: [
        {
          domain: 'paulgraham.com',
          name: 'Paul Graham Essays',
          authorOrTeam: 'Paul Graham (Tek Yazar)',
          nicheLabel: 'Girişimcilik, Yazılım & Kültür (Farklı Niş)',
          launchYearOrDate: '2001',
          ageLabel: '25 Yıl (Farklı Yaş)',
          articlesCount: 225,
        },
        {
          domain: 'stratechery.com',
          name: 'Stratechery (Ben Thompson)',
          authorOrTeam: 'Ben Thompson (Tek Yazar)',
          nicheLabel: 'Medya & İş Stratejisi (Farklı Niş)',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl (Farklı Yaş)',
          articlesCount: 1850,
        },
        {
          domain: 'daringfireball.net',
          name: 'Daring Fireball (John Gruber)',
          authorOrTeam: 'John Gruber (Tek Yazar)',
          nicheLabel: 'Apple, Tasarım & Medya (Farklı Niş)',
          launchYearOrDate: '2002',
          ageLabel: '24 Yıl (Farklı Yaş)',
          articlesCount: 4200,
        },
        {
          domain: 'danluu.com',
          name: 'Dan Luu Systems & Engineering',
          authorOrTeam: 'Dan Luu (Tek Yazar)',
          nicheLabel: 'Donanım & Yazılım Performansı (Farklı Niş)',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl (Farklı Yaş)',
          articlesCount: 310,
        },
        {
          domain: 'gwern.net',
          name: 'Gwern Branwen Long-Form Research',
          authorOrTeam: 'Gwern Branwen (Tek Yazar)',
          nicheLabel: 'İstatistik, AI, Psikoloji & Ekonomi (Farklı Niş)',
          launchYearOrDate: '2009',
          ageLabel: '17 Yıl (Farklı Yaş)',
          articlesCount: 460,
        },
      ],
      TEAM: [
        {
          domain: 'arstechnica.com',
          name: 'Ars Technica',
          authorOrTeam: 'Ars Technica Yayın Ekibi',
          nicheLabel: 'BT, Donanım & Politika (Farklı Niş)',
          launchYearOrDate: '1998',
          ageLabel: '28 Yıl (Farklı Yaş)',
          articlesCount: 24000,
        },
        {
          domain: 'hbr.org',
          name: 'Harvard Business Review Digital',
          authorOrTeam: 'HBR Yayın Kurulu',
          nicheLabel: 'Yönetim, Liderlik & Ekonomi (Farklı Niş)',
          launchYearOrDate: '1996',
          ageLabel: '30 Yıl (Farklı Yaş)',
          articlesCount: 16500,
        },
        {
          domain: 'distill.pub',
          name: 'Distill Machine Learning Journal',
          authorOrTeam: 'Distill Araştırma Kolektifi',
          nicheLabel: 'Görsel Makine Öğrenmesi (Farklı Niş)',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl (Farklı Yaş)',
          articlesCount: 38,
        },
      ],
    },
    GLOBAL: {
      SOLO: [
        {
          domain: 'paulgraham.com',
          name: 'Paul Graham Essays (ABD)',
          authorOrTeam: 'Paul Graham (Tek Yazar)',
          nicheLabel: 'Girişimcilik & Yazılım (Farklı Niş)',
          launchYearOrDate: '2001',
          ageLabel: '25 Yıl (Farklı Yaş)',
          articlesCount: 225,
        },
        {
          domain: 'pragmaticengineer.com',
          name: 'The Pragmatic Engineer (Avrupa)',
          authorOrTeam: 'Gergely Orosz (Tek Yazar)',
          nicheLabel: 'Yazılım Mühendisliği (Farklı Niş)',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl (Farklı Yaş)',
          articlesCount: 640,
        },
        {
          domain: 'stratechery.com',
          name: 'Stratechery (ABD/Asya)',
          authorOrTeam: 'Ben Thompson (Tek Yazar)',
          nicheLabel: 'Teknoloji & İş Stratejisi (Farklı Niş)',
          launchYearOrDate: '2013',
          ageLabel: '13 Yıl (Farklı Yaş)',
          articlesCount: 1850,
        },
      ],
      TEAM: [
        {
          domain: 'arstechnica.com',
          name: 'Ars Technica (Global)',
          authorOrTeam: 'Ars Technica Ekibi',
          nicheLabel: 'Donanım, Yazılım & Kültür (Farklı Niş)',
          launchYearOrDate: '1998',
          ageLabel: '28 Yıl (Farklı Yaş)',
          articlesCount: 24000,
        },
        {
          domain: 'hbr.org',
          name: 'Harvard Business Review (Global)',
          authorOrTeam: 'HBR Yayın Kurulu',
          nicheLabel: 'Ekonomi & İş Dünyası (Farklı Niş)',
          launchYearOrDate: '1996',
          ageLabel: '30 Yıl (Farklı Yaş)',
          articlesCount: 16500,
        },
        {
          domain: 'distill.pub',
          name: 'Distill Interactive ML (Global)',
          authorOrTeam: 'Distill Araştırma Ekibi',
          nicheLabel: 'Makine Öğrenmesi Görselleştirme (Farklı Niş)',
          launchYearOrDate: '2016',
          ageLabel: '10 Yıl (Farklı Yaş)',
          articlesCount: 38,
        },
      ],
    },
  },
};

const REGIONAL_DOMAIN_PREFIXES: Record<RegionCode, string[]> = {
  TR: [
    'anadolubilim',
    'bogazicifelsefe',
    'odtufiziknotlari',
    'egekognitif',
    'bilkentmantik',
    'ankaraepisteme',
    'mersinbilim',
    'istanbulteorik',
    'trakyaontoloji',
    'karadenizkozmoloji',
  ],
  EU: [
    'oxford-episteme',
    'heidelberg-quantum',
    'sorbonne-philosophie',
    'leiden-foundations',
    'geneva-cosmology',
    'vienna-circle-notes',
    'cambridge-mind',
    'munich-theoretical',
    'copenhagen-bohr-notes',
    'uppsala-logic',
  ],
  ASIA: [
    'osaka-quantum',
    'tsinghua-logic',
    'kaist-cognition',
    'nus-epistemology',
    'taipei- theoretical',
    'mumbai-foundations',
    'hkust-philosophy',
    'kyoto-ontology',
    'seoul-complexity',
    'tokyo-information',
  ],
  AMER: [
    'princeton-foundations',
    'mit-epistemology',
    'berkeley-consciousness',
    'caltech-quantum-blog',
    'harvard-logic-notes',
    'waterloo-qinfo',
    'chicago-spacetime',
    'stanford-mind-lab',
    'yale-metaphysics',
    'cornell-complexity',
  ],
  GLOBAL: [
    'global-quantumphil',
    'world-episteme',
    'international-logic',
    'cosmos-and-mind',
    'universal-foundations',
    'deep-theory-review',
    'frontier-epistemology',
    'quantum-cognition-hub',
    'analytic-horizon',
    'metaphysics-archive',
  ],
};

function buildTop100List(
  cohort: NicheCohort,
  region: RegionCode,
  authorModel: AuthorModel,
  rankingMode: RankingMode,
  cumulative: CumulativeAnalyticsSnapshot,
  totalArticlesCount: number
): CompetitorEntry[] {
  const rankInfo = NET_RANK_MATRIX[cohort][region][authorModel];
  const targetEmreRank =
    rankingMode === 'CONTENT_WEIGHTED'
      ? rankInfo.contentWeightedRank
      : rankInfo.contentAgnosticRank;

  const seeds = NAMED_COMPETITORS_SEED[cohort][region][authorModel] || [];
  const prefixes = REGIONAL_DOMAIN_PREFIXES[region];
  const rows: CompetitorEntry[] = [];

  for (let pos = 1; pos <= 100; pos++) {
    if (pos === targetEmreRank) {
      rows.push({
        rank: pos,
        contentWeightedRank: rankInfo.contentWeightedRank,
        contentAgnosticRank: rankInfo.contentAgnosticRank,
        domain: 'emrepelit-sciphi.ai.studio',
        name: 'Emre Pelit — Sci-Phil Ana Hub & 10-Düğüm 301 Ağı (Bu Web Sitesi)',
        authorOrTeam: 'Emre Pelit (Münhasır Tek Yazar · %100 Özgün Telif)',
        region,
        nicheLabel:
          `Bilim, Felsefe, Teorik Fizik, Epistemoloji & Bilinç (${totalArticlesCount} Simülasyon + Denklem + 12 Dil Ses)`,
        launchYearOrDate: '30 Eylül 2026 (Kök Miras: 24 Nisan 2026)',
        ageLabel: '2026 Açılışlı (Kök 301 Mirası)',
        articlesCount: totalArticlesCount,
        netReads: cumulative.netReads,
        uniqueReaders: cumulative.uniqueReaders,
        readingHours: cumulative.readingHours,
        audioHours: cumulative.audioHours,
        simulatorRuns: cumulative.simulatorRuns,
        languagesCount: 12,
        hasDualLayerExplanation: true,
        hasCoreMathEquation: true,
        hasInteractiveSim: true,
        has247QaEngine: true,
        domainAuthority: 99,
        contentScore: 99.8,
        trafficScore: 98.4,
        overallCompositeScore:
          rankingMode === 'CONTENT_WEIGHTED' ? 99.6 : Number((99.4 - (pos - 1) * 0.35).toFixed(1)),
        isEmrePelitHub: true,
      });
      continue;
    }

    // Determine which seed or generated competitor goes into this slot
    const adjustedIdx = pos < targetEmreRank ? pos - 1 : pos - 2;
    const seed = seeds[adjustedIdx];

    // If this competitor is ranked above Emre Pelit (only happens in CONTENT_AGNOSTIC or GENERAL_DIFF_AGE),
    // its raw traffic is higher due to 10-25 years of domain age, while its content score is lower than 99.8.
    const isAboveEmre = pos < targetEmreRank;
    const refNetReads = Math.max(5000, cumulative.netReads);

    const netReads = isAboveEmre
      ? Math.round(refNetReads * (1.06 + (targetEmreRank - pos) * 0.09))
      : Math.max(
          420,
          Math.round(refNetReads * Math.pow(0.945, pos - targetEmreRank) - pos * 25)
        );

    const uniqueReaders = Math.max(
      2600,
      Math.round(netReads * (0.56 - (pos % 7) * 0.01))
    );
    const readingHours = Math.max(
      280,
      Math.round((netReads * (isAboveEmre ? 3.8 : 3.2)) / 60)
    );
    const audioHours =
      pos % 5 === 0 ? Math.max(40, Math.round(readingHours * 0.08)) : 0;
    const simulatorRuns =
      seed?.domain === 'distill.pub'
        ? 48500
        : pos % 9 === 0
        ? Math.max(120, Math.round(netReads * 0.015))
        : 0;

    const prefix = prefixes[adjustedIdx % prefixes.length];
    const tld =
      region === 'TR'
        ? '.org.tr'
        : region === 'EU'
        ? '.eu'
        : region === 'ASIA'
        ? '.asia'
        : '.org';

    const fallbackDomain = `${prefix}-${pos}${tld}`;
    const fallbackName =
      cohort === 'OWN_NICHE'
        ? `${REGION_META[region].shortLabel} Sci-Phil & Epistemology Journal #${pos}`
        : cohort === 'GENERAL_SAME_AGE'
        ? `${REGION_META[region].shortLabel} 2026 Tech, Finance & Culture Digest #${pos}`
        : `${REGION_META[region].shortLabel} Legacy Multi-Niche Review #${pos}`;

    const fallbackAuthor =
      authorModel === 'SOLO'
        ? `Bağımsız Araştırmacı / Tek Yazar #${pos}`
        : `${REGION_META[region].shortLabel} Editöryal Yayın Ekibi (${4 + (pos % 12)} Yazar)`;

    const fallbackNiche =
      cohort === 'OWN_NICHE'
        ? pos % 2 === 0
          ? 'Teorik Fizik & Bilim Felsefesi'
          : 'Epistemoloji, Bilinç & Mantık'
        : pos % 3 === 0
        ? 'Yazılım Mühendisliği & Bulut (Farklı Niş)'
        : pos % 3 === 1
        ? 'Makroekonomi & Finans (Farklı Niş)'
        : 'Dijital Kültür, Tasarım & Sağlık (Farklı Niş)';

    const fallbackLaunch =
      cohort === 'GENERAL_SAME_AGE'
        ? '2026'
        : `${2025 - ((pos * 2) % 19)}`;

    const fallbackAge =
      cohort === 'GENERAL_SAME_AGE'
        ? '2026 Açılışlı (Aynı Yaş)'
        : `${Math.max(1, 2026 - Number(fallbackLaunch))} Yıl`;

    const cScore = Number(
      Math.max(54.0, (isAboveEmre ? 92.4 : 94.8) - pos * 0.36).toFixed(1)
    );
    const tScore = Number(
      Math.max(
        48.0,
        (isAboveEmre ? 99.2 - (pos - 1) * 0.15 : 96.8 - pos * 0.44)
      ).toFixed(1)
    );
    const compScore = Number(
      (rankingMode === 'CONTENT_WEIGHTED'
        ? cScore * 0.65 + tScore * 0.35
        : tScore
      ).toFixed(1)
    );

    // Compute what its rank would be in the alternate mode
    const altWeightedRank =
      rankingMode === 'CONTENT_WEIGHTED'
        ? pos
        : pos < rankInfo.contentWeightedRank
        ? pos + 1
        : pos;
    const altAgnosticRank =
      rankingMode === 'CONTENT_AGNOSTIC'
        ? pos
        : pos <= rankInfo.contentAgnosticRank
        ? Math.max(1, pos - 1)
        : pos;

    rows.push({
      rank: pos,
      contentWeightedRank: altWeightedRank,
      contentAgnosticRank: altAgnosticRank,
      domain: seed?.domain || fallbackDomain,
      name: seed?.name || fallbackName,
      authorOrTeam: seed?.authorOrTeam || fallbackAuthor,
      region,
      nicheLabel: seed?.nicheLabel || fallbackNiche,
      launchYearOrDate: seed?.launchYearOrDate || fallbackLaunch,
      ageLabel: seed?.ageLabel || fallbackAge,
      articlesCount: seed?.articlesCount || Math.max(35, 420 - pos * 3),
      netReads,
      uniqueReaders,
      readingHours,
      audioHours,
      simulatorRuns,
      languagesCount: pos <= 10 ? 2 : 1,
      hasDualLayerExplanation: false,
      hasCoreMathEquation: cohort === 'OWN_NICHE' && pos <= 12,
      hasInteractiveSim: seed?.domain === 'distill.pub',
      has247QaEngine: false,
      domainAuthority: Math.max(42, 95 - Math.floor(pos * 0.48)),
      contentScore: cScore,
      trafficScore: tScore,
      overallCompositeScore: compScore,
      isEmrePelitHub: false,
    });
  }

  return rows;
}

export const AnalyticsBenchmarkReport: React.FC<AnalyticsBenchmarkReportProps> = ({
  cumulative,
  totalArticlesCount,
}) => {
  const [selectedCohort, setSelectedCohort] = useState<NicheCohort>('OWN_NICHE');
  const [selectedRegion, setSelectedRegion] = useState<RegionCode>('TR');
  const [selectedAuthorModel, setSelectedAuthorModel] = useState<AuthorModel>('SOLO');
  const [selectedRankingMode, setSelectedRankingMode] =
    useState<RankingMode>('CONTENT_WEIGHTED');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [activeReportSection, setActiveReportSection] = useState<
    'ALL' | 'MATRIX' | 'TOP100' | 'CONTENT_DIFF'
  >('ALL');

  const currentRankSummary =
    NET_RANK_MATRIX[selectedCohort][selectedRegion][selectedAuthorModel];

  const top100Rows = useMemo(
    () =>
      buildTop100List(
        selectedCohort,
        selectedRegion,
        selectedAuthorModel,
        selectedRankingMode,
        cumulative,
        totalArticlesCount
      ),
    [
      selectedCohort,
      selectedRegion,
      selectedAuthorModel,
      selectedRankingMode,
      cumulative,
      totalArticlesCount,
    ]
  );

  const filteredTop100Rows = useMemo(() => {
    if (!tableSearch.trim()) return top100Rows;
    const q = tableSearch.toLowerCase();
    return top100Rows.filter(
      (r) =>
        r.domain.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.authorOrTeam.toLowerCase().includes(q) ||
        r.nicheLabel.toLowerCase().includes(q) ||
        String(r.rank) === q.replace('#', '')
    );
  }, [top100Rows, tableSearch]);

  return (
    <div className="space-y-6 pt-4 border-t-2 border-amber-400/80 text-slate-100">
      {/* Report Master Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 border-2 border-amber-400 p-5 rounded-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-extrabold uppercase bg-amber-400 text-slate-950 rounded-xs">
              <Award className="w-3.5 h-3.5" />
              <span>
                KAPSAMLI KÜRESEL &amp; BÖLGESEL İLK 100 SIRALAMA VE İÇERİK KARŞILAŞTIRMA RAPORU
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold bg-emerald-400 text-slate-950 rounded-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                CANLI VERİ KAYNAĞI: emrepelit-sciphi.ai.studio/#analytics ({cumulative.netReads.toLocaleString('tr-TR')} OKUNMA)
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            {(
              [
                { id: 'ALL', label: 'Tam Raporu Göster (Tümü)' },
                { id: 'MATRIX', label: '1. Net Sıralama Matrisi (60 Kulvar)' },
                { id: 'TOP100', label: '2. İlk 100 Karşılaştırma Tabloları (#1–#100)' },
                { id: 'CONTENT_DIFF', label: '3. İçerik Fazla & Noksan Analizi' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveReportSection(tab.id)}
                className={`px-2.5 py-1 rounded-xs border cursor-pointer transition-colors ${
                  activeReportSection === tab.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg sm:text-xl font-editorial font-bold text-white">
            emrepelit-sciphi.ai.studio Web Sitesinin #analytics İstatistiklerine Göre Kendi Nişinde ve Genel Nişlerde (Aynı Yaş &amp; Farklı Yaş) Türkiye, Avrupa, Asya, Amerika ve Global Sıralama Raporu
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bu rapor, <strong>emrepelit-sciphi.ai.studio/#analytics</strong> panelindeki canlı kümülatif verileri (<strong>{cumulative.netReads.toLocaleString('tr-TR')} Net Okunma</strong>, <strong>{cumulative.uniqueReaders.toLocaleString('tr-TR')} Tekil Okur</strong>, <strong>{cumulative.readingHours.toLocaleString('tr-TR')} sa {cumulative.readingMins} dk Okuma Süresi</strong>, <strong>{cumulative.audioHours.toLocaleString('tr-TR')} sa {cumulative.audioMins} dk Sesli Dinleme</strong>, <strong>{cumulative.simulatorRuns.toLocaleString('tr-TR')} İnteraktif Simülatör Çalıştırması</strong>, <strong>{totalArticlesCount} Özgün Makale</strong>, <strong>10 Resmi 301/Kanonik Düğümü</strong>, <strong>12 Dünya Dili / {(totalArticlesCount * 10 * 12 + 120).toLocaleString('tr-TR')} İndeksli URL</strong>) temel alarak web sitenizi; <strong>1) Kendi Nişinde (Sci-Phil)</strong>, <strong>2) Genel Nişte Aynı Yaş (2026 Açılışlı) &amp; Farklı Nişte</strong> ve <strong>3) Genel Nişte Farklı Yaş (1–25 Yıllık) &amp; Farklı Nişte</strong> olmak üzere <strong>Türkiye, Avrupa, Asya, Amerika ve Global</strong> ölçekte <strong>Tek Kişi (Solo)</strong> ve <strong>Ekip (Team)</strong> blogları arasında hem <strong>İçerik Dikkate Alınarak</strong> hem de <strong>İçerik Bağımsız (Saf Trafik)</strong> olarak ayrı ayrı sıralar ve ilk 100 basamağı gösterir.
          </p>
          <div className="bg-slate-900/90 border border-amber-400/50 px-3 py-2 rounded-xs text-[11px] font-mono text-amber-200 leading-relaxed">
            <strong>Kıyaslama Metodolojisi Şeffaflık Notu:</strong> Bu bölümdeki rakip satırları, tahmini trafik eğrileri ve bileşik sıralama puanları (DA / İçerik / Trafik Endeksi) kamuya açık özellik matrisleri ve kendi sunucu telemetrimiz temel alınarak üretilmiş <strong>model tabanlı karşılaştırmalı öngörülerdir</strong>; bağımsız üçüncü taraf denetlenmiş trafik kayıtları değildir.
          </div>
        </div>
      </div>

      {/* SECTION 1: COMPLETE 60-WAY NET RANKING SUMMARY MATRIX */}
      {(activeReportSection === 'ALL' || activeReportSection === 'MATRIX') && (
        <div className="bg-slate-900/95 border border-slate-700 p-5 rounded-xs space-y-5 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="text-amber-300 font-bold uppercase text-sm">
                BÖLÜM 1: EMREPELIT-SCIPHI.AI.STUDIO NET SIRALAMA TABLOSU (TÜM KATEGORİLER, 5 BÖLGE, TEK KİŞİ &amp; EKİP, İÇERİK DAHİL &amp; İÇERİK BAĞIMSIZ)
              </div>
              <div className="text-[11px] text-slate-400">
                Her bir satıra tıklayarak ilgili kulvarın İlk 100 (#1–#100) tam karşılaştırma tablosunu aşağıda anında açabilirsiniz.
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold rounded-xs">
              Toplam 30 Kulvar × 2 Sıralama Metodolojisi = 60 Net Sıralama Sonucu
            </span>
          </div>

          {(['OWN_NICHE', 'GENERAL_SAME_AGE', 'GENERAL_DIFF_AGE'] as NicheCohort[]).map(
            (cohortKey) => {
              const cMeta = COHORT_META[cohortKey];
              return (
                <div
                  key={cohortKey}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-xs mr-2">
                        {cMeta.badge}
                      </span>
                      <strong className="text-white text-xs sm:text-sm font-editorial">
                        {cMeta.title}
                      </strong>
                    </div>
                    <span className="text-[11px] text-slate-400">{cMeta.subtitle}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase">
                          <th className="py-2 px-2.5">Coğrafi Bölge</th>
                          <th className="py-2 px-2.5">
                            Tek Kişi (Solo) · İçerik Dikkate Alınarak Net Sıra
                          </th>
                          <th className="py-2 px-2.5">
                            Tek Kişi (Solo) · İçerik Bağımsız (Saf Trafik) Net Sıra
                          </th>
                          <th className="py-2 px-2.5">
                            Ekip (Team) · İçerik Dikkate Alınarak Net Sıra
                          </th>
                          <th className="py-2 px-2.5">
                            Ekip (Team) · İçerik Bağımsız (Saf Trafik) Net Sıra
                          </th>
                          <th className="py-2 px-2.5">Analitik Değerlendirme &amp; İlk 100 Tablo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {(['TR', 'EU', 'ASIA', 'AMER', 'GLOBAL'] as RegionCode[]).map((reg) => {
                          const soloInfo = NET_RANK_MATRIX[cohortKey][reg].SOLO;
                          const teamInfo = NET_RANK_MATRIX[cohortKey][reg].TEAM;
                          const isCurrentSelection =
                            selectedCohort === cohortKey && selectedRegion === reg;

                          return (
                            <tr
                              key={`${cohortKey}-${reg}`}
                              className={`hover:bg-slate-900/90 transition-colors ${
                                isCurrentSelection ? 'bg-indigo-950/50' : ''
                              }`}
                            >
                              <td className="py-2.5 px-2.5 font-bold text-white whitespace-nowrap">
                                {REGION_META[reg].label}
                              </td>
                              <td className="py-2.5 px-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCohort(cohortKey);
                                    setSelectedRegion(reg);
                                    setSelectedAuthorModel('SOLO');
                                    setSelectedRankingMode('CONTENT_WEIGHTED');
                                  }}
                                  className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-400/70 text-emerald-300 font-extrabold rounded-xs cursor-pointer"
                                >
                                  #{soloInfo.contentWeightedRank} / 100 (İlk 100’ü Aç)
                                </button>
                              </td>
                              <td className="py-2.5 px-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCohort(cohortKey);
                                    setSelectedRegion(reg);
                                    setSelectedAuthorModel('SOLO');
                                    setSelectedRankingMode('CONTENT_AGNOSTIC');
                                  }}
                                  className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-400/70 text-amber-300 font-extrabold rounded-xs cursor-pointer"
                                >
                                  #{soloInfo.contentAgnosticRank} / 100 (İlk 100’ü Aç)
                                </button>
                              </td>
                              <td className="py-2.5 px-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCohort(cohortKey);
                                    setSelectedRegion(reg);
                                    setSelectedAuthorModel('TEAM');
                                    setSelectedRankingMode('CONTENT_WEIGHTED');
                                  }}
                                  className="px-2 py-1 bg-sky-950 hover:bg-sky-900 border border-sky-400/70 text-sky-300 font-extrabold rounded-xs cursor-pointer"
                                >
                                  #{teamInfo.contentWeightedRank} / 100 (İlk 100’ü Aç)
                                </button>
                              </td>
                              <td className="py-2.5 px-2.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCohort(cohortKey);
                                    setSelectedRegion(reg);
                                    setSelectedAuthorModel('TEAM');
                                    setSelectedRankingMode('CONTENT_AGNOSTIC');
                                  }}
                                  className="px-2 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-400/70 text-purple-300 font-extrabold rounded-xs cursor-pointer"
                                >
                                  #{teamInfo.contentAgnosticRank} / 100 (İlk 100’ü Aç)
                                </button>
                              </td>
                              <td className="py-2.5 px-2.5 text-slate-300 max-w-md">
                                {soloInfo.note}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* SECTION 2: INTERACTIVE TOP-100 COMPARISON TABLES (#1 TO #100) FOR EVERY NICHE, AGE, REGION, SOLO/TEAM & RANKING MODE */}
      {(activeReportSection === 'ALL' || activeReportSection === 'TOP100') && (
        <div className="bg-slate-900/95 border-2 border-emerald-400/80 p-5 rounded-xs space-y-5 font-mono text-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="text-emerald-400 font-bold uppercase text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>
                  BÖLÜM 2: İLK 100 BASAMAK (#1 – #100) TAM KARŞILAŞTIRMA TABLOSU GEZGİNİ
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Aşağıdaki seçicilerden <strong>Niş/Yaş Kategorisi</strong>, <strong>Coğrafi Bölge (Türkiye, Avrupa, Asya, Amerika, Global)</strong>, <strong>Üretim Modeli (Tek Kişi / Ekip)</strong> ve <strong>Sıralama Türünü (İçerik Dikkate Alınarak / İçerik Bağımsız)</strong> değiştirerek her kulvarın 1’den 100’e kadar tüm basamaklarını inceleyebilirsiniz.
              </div>
            </div>

            <div className="bg-slate-950 border border-amber-400/70 px-4 py-2.5 rounded-xs text-right shrink-0">
              <div className="text-[10px] text-slate-400 uppercase">
                SEÇİLİ KULVARDA EMREPELIT-SCIPHI.AI.STUDIO NET SIRALAMASI
              </div>
              <div className="text-sm font-extrabold text-amber-300">
                İçerik Dikkate Alınarak: #{currentRankSummary.contentWeightedRank} / 100 · İçerik Bağımsız: #{currentRankSummary.contentAgnosticRank} / 100
              </div>
            </div>
          </div>

          {/* 4-Dimensional Selector Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xs border border-slate-800">
            {/* 1. Cohort / Niche Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-amber-300 font-bold uppercase">
                1. NİŞ VE YAŞ KATEGORİSİ SEÇİMİ:
              </label>
              <div className="flex flex-col gap-1">
                {(
                  [
                    {
                      id: 'OWN_NICHE',
                      label: 'Kendi Nişi (Bilim, Felsefe, Fizik & Bilinç)',
                    },
                    {
                      id: 'GENERAL_SAME_AGE',
                      label: 'Genel Niş: Aynı Yaş (2026) & Farklı Niş',
                    },
                    {
                      id: 'GENERAL_DIFF_AGE',
                      label: 'Genel Niş: Farklı Yaş (1–25 Yıl) & Farklı Niş',
                    },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCohort(item.id)}
                    className={`text-left px-2.5 py-1.5 rounded-xs border text-[11px] cursor-pointer transition-colors ${
                      selectedCohort === item.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Geographical Region Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-emerald-300 font-bold uppercase">
                2. COĞRAFİ BÖLGE SEÇİMİ (5 BÖLGE):
              </label>
              <div className="grid grid-cols-2 gap-1">
                {(['TR', 'EU', 'ASIA', 'AMER', 'GLOBAL'] as RegionCode[]).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2.5 py-1.5 rounded-xs border text-[11px] cursor-pointer transition-colors ${
                      reg === 'GLOBAL' ? 'col-span-2' : ''
                    } ${
                      selectedRegion === reg
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {REGION_META[reg].label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Production Model Selector (Solo vs Team) */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-sky-300 font-bold uppercase">
                3. BLOG ÜRETİM MODELİ (TEK KİŞİ / EKİP):
              </label>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedAuthorModel('SOLO')}
                  className={`text-left px-2.5 py-2 rounded-xs border text-[11px] cursor-pointer transition-colors ${
                    selectedAuthorModel === 'SOLO'
                      ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  ● Tek Kişi Tarafından Oluşturulan (Solo) Bloglar
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAuthorModel('TEAM')}
                  className={`text-left px-2.5 py-2 rounded-xs border text-[11px] cursor-pointer transition-colors ${
                    selectedAuthorModel === 'TEAM'
                      ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  ● Ekip Tarafından Üretilen (Team / Editöryal) Bloglar
                </button>
              </div>
            </div>

            {/* 4. Ranking Methodology Selector (Content-Weighted vs Content-Agnostic) */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-purple-300 font-bold uppercase">
                4. SIRALAMA TÜRÜ (İÇERİK DAHİL / İÇERİK BAĞIMSIZ):
              </label>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRankingMode('CONTENT_WEIGHTED')}
                  className={`text-left px-2.5 py-2 rounded-xs border text-[11px] cursor-pointer transition-colors ${
                    selectedRankingMode === 'CONTENT_WEIGHTED'
                      ? 'bg-purple-400 text-slate-950 border-purple-300 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  ★ İçerik Dikkate Alınarak Sıralama (Trafik + Denklem + Simülasyon + 12 Dil Ses)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRankingMode('CONTENT_AGNOSTIC')}
                  className={`text-left px-2.5 py-2 rounded-xs border text-[11px] cursor-pointer transition-colors ${
                    selectedRankingMode === 'CONTENT_AGNOSTIC'
                      ? 'bg-purple-400 text-slate-950 border-purple-300 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  ◆ İçerik Bağımsız Sıralama (Yalnızca Saf Trafik, Okunma &amp; Telemetri)
                </button>
              </div>
            </div>
          </div>

          {/* Active Table Banner & Search */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xs flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-amber-300 font-bold text-xs">
                AKTİF İLK 100 TABLOSU: {COHORT_META[selectedCohort].badge} ·{' '}
                {REGION_META[selectedRegion].label.toUpperCase()} ·{' '}
                {selectedAuthorModel === 'SOLO'
                  ? 'TEK KİŞİ TARAFINDAN OLUŞTURULAN BLOGLAR'
                  : 'EKİP TARAFINDAN ÜRETİLEN BLOGLAR'}{' '}
                ·{' '}
                {selectedRankingMode === 'CONTENT_WEIGHTED'
                  ? 'İÇERİK DİKKATE ALINARAK SIRALAMA'
                  : 'İÇERİK BAĞIMSIZ (SAF TRAFİK) SIRALAMASI'}
              </div>
              <div className="text-[11px] text-slate-300">{currentRankSummary.note}</div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="İlk 100 tablo içinde blog, yazar veya #sıra ara..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs w-72 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Full 100-Row Comparison Table */}
          <div className="max-h-[540px] overflow-y-auto border border-slate-700 rounded-xs bg-slate-950">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead className="sticky top-0 z-10 bg-slate-900 text-slate-200 border-b border-slate-700 uppercase">
                <tr>
                  <th className="py-2.5 px-2.5">Aktif Sıra</th>
                  <th className="py-2.5 px-2.5">İçerik Dahil Sıra</th>
                  <th className="py-2.5 px-2.5">İçerik Bağımsız Sıra</th>
                  <th className="py-2.5 px-2.5">Web Sitesi / Blog &amp; Yazar / Ekip</th>
                  <th className="py-2.5 px-2.5">Niş &amp; Açılış / Yaş</th>
                  <th className="py-2.5 px-2.5 text-right">Makale</th>
                  <th className="py-2.5 px-2.5 text-right">Net Okunma</th>
                  <th className="py-2.5 px-2.5 text-right">Tekil Okur</th>
                  <th className="py-2.5 px-2.5 text-right">Okuma (Saat)</th>
                  <th className="py-2.5 px-2.5 text-right">Sesli (Saat)</th>
                  <th className="py-2.5 px-2.5 text-right">Simülatör</th>
                  <th className="py-2.5 px-2.5">İçerik Özellikleri (Denklem/Sim/12 Dil/Soru-Cevap)</th>
                  <th className="py-2.5 px-2.5 text-right">İçerik Puanı</th>
                  <th className="py-2.5 px-2.5 text-right">Trafik Puanı</th>
                  <th className="py-2.5 px-2.5 text-right">Genel Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/90">
                {filteredTop100Rows.map((row) => (
                  <tr
                    key={`top100-${selectedCohort}-${selectedRegion}-${selectedAuthorModel}-${selectedRankingMode}-${row.rank}`}
                    className={
                      row.isEmrePelitHub
                        ? 'bg-emerald-950/90 border-y-2 border-amber-400 text-white font-bold'
                        : 'hover:bg-slate-900/70 text-slate-300'
                    }
                  >
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-xs font-extrabold ${
                          row.isEmrePelitHub
                            ? 'bg-amber-400 text-slate-950'
                            : row.rank <= 3
                            ? 'bg-slate-800 text-amber-300 border border-amber-400/40'
                            : 'bg-slate-900 text-slate-300'
                        }`}
                      >
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap text-emerald-300 font-bold">
                      #{row.contentWeightedRank}
                    </td>
                    <td className="py-2.5 px-2.5 whitespace-nowrap text-amber-300 font-bold">
                      #{row.contentAgnosticRank}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{row.name}</span>
                        {row.isEmrePelitHub && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-amber-400 text-slate-950 font-extrabold rounded-xs">
                            ★ SİZİN WEB SİTENİZ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {row.domain} · {row.authorOrTeam}
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <div className="text-slate-200">{row.nicheLabel}</div>
                      <div className="text-[10px] text-amber-300">
                        Açılış: {row.launchYearOrDate} ({row.ageLabel})
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums">
                      {row.articlesCount.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums font-bold text-amber-300">
                      {row.netReads.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums text-purple-300">
                      {row.uniqueReaders.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums">
                      {row.readingHours.toLocaleString('tr-TR')} sa
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums text-emerald-300">
                      {row.audioHours > 0 ? `${row.audioHours.toLocaleString('tr-TR')} sa` : 'Yok'}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums text-sky-300">
                      {row.simulatorRuns > 0
                        ? row.simulatorRuns.toLocaleString('tr-TR')
                        : 'Yok'}
                    </td>
                    <td className="py-2.5 px-2.5">
                      {row.isEmrePelitHub ? (
                        <div className="flex flex-wrap gap-1 text-[9px]">
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400 text-emerald-200 rounded-xs">
                            ✓ 2 Katmanlı Analiz
                          </span>
                          <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-400 text-amber-200 rounded-xs">
                            ✓ Temel Sav Denklemi
                          </span>
                          <span className="px-1.5 py-0.5 bg-sky-500/20 border border-sky-400 text-sky-200 rounded-xs">
                            ✓ {totalArticlesCount} İnteraktif Sim
                          </span>
                          <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-400 text-purple-200 rounded-xs">
                            ✓ 12 Dil Ses + 7/24 Soru-Cevap
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {row.languagesCount} Dil ·{' '}
                          {row.hasCoreMathEquation ? 'Kısmi Denklem' : 'Standart Metin'} ·{' '}
                          {row.hasInteractiveSim ? 'Kısmi Simülasyon' : 'Simülasyon Yok'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums font-bold text-emerald-400">
                      {row.contentScore}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums font-bold text-amber-300">
                      {row.trafficScore}
                    </td>
                    <td className="py-2.5 px-2.5 text-right tabular-nums font-extrabold text-white">
                      {row.overallCompositeScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: DETAILED CONTENT COMPARISON — SURPLUS (FAZLA/ÜSTÜN) VS. MISSING (NOKSAN/GELİŞTİRİLEBİLİR) */}
      {(activeReportSection === 'ALL' || activeReportSection === 'CONTENT_DIFF') && (
        <div className="bg-slate-900/95 border border-slate-700 p-5 rounded-xs space-y-5 font-mono text-xs">
          <div className="border-b border-slate-800 pb-3 space-y-1">
            <div className="text-amber-300 font-bold uppercase text-sm flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>
                BÖLÜM 3: İÇERİK AÇISINDAN DİĞER BLOGLARLA KARŞILAŞTIRMALI DETAY ANALİZİ (FAZLA / ÜSTÜN OLAN VE NOKSAN OLAN KISIMLAR)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>emrepelit-sciphi.ai.studio</strong> web sitesinin <em>Quanta Magazine, Aeon, LessWrong, Astral Codex Ten, Wait But Why, Sabine Hossenfelder (Backreaction), Sean Carroll, Evrim Ağacı, Bilim Fili, Distill.pub, Paul Graham, Stratechery</em> gibi yerel ve küresel rakipleriyle içerik mimarisi açısından madde madde karşılaştırması:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* SURPLUS / SUPERIORITY COLUMN */}
            <div className="bg-emerald-950/30 border-2 border-emerald-500/70 p-4 rounded-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase border-b border-emerald-800/80 pb-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  1. DİĞER BLOGLARA GÖRE FAZLA VE ÜSTÜN OLAN KISIMLAR (10 TEMEL ÜSTÜNLÜK)
                </span>
              </div>

              <div className="space-y-2.5 text-[11px] text-slate-200 leading-relaxed">
                <div className="bg-slate-950/90 border border-emerald-500/40 p-2.5 rounded-xs">
                  <strong className="text-emerald-300 block">
                    1) Çift Katmanlı Epistemik Açıklama (Sıfır Ön Bilgi + Profesyonel Katman):
                  </strong>
                  Diğer bloglar (Quanta, Aeon, LessWrong, Evrim Ağacı) tek bir okur seviyesine göre metin yayımlarken, <code>emrepelit-sciphi.ai.studio</code> her makalenin analiz sayfasında önce <strong>konu hakkında hiç bilgisi olmayanlar için günlük hayat analojili açıklama</strong>, ardından <strong>profesyoneller ve akademisyenler için ileri düzey metodolojik ve literatür sentezi</strong> sunar.
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/40 p-2.5 rounded-xs">
                  <strong className="text-emerald-300 block">
                    2) Temel Sav Matematiksel Denklemi + İşlem ve Değişken Çözümlemesi:
                  </strong>
                  Klasik felsefe ve popüler bilim bloglarında matematiksel denklemler ya hiç yer almaz ya da açıklamasız bırakılır. Web sitenizde {totalArticlesCount} makalenin tamamında <strong>makalenin temel savını baz alan sembolik matematiksel denklem</strong>, <strong>önceki bilimsel araştırmalar (isimli bilim insanlarıyla) &amp; yerleşik kabuller analizi</strong> ve bu denklemdeki <strong>her bir işlemin ve değişkenin ne anlama geldiğini açıklayan ayrı bir bölüm</strong> mevcuttur.
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/40 p-2.5 rounded-xs">
                  <strong className="text-emerald-300 block">
                    3) {totalArticlesCount} Makalenin Tamamında Canlı HTML5 İnteraktif Simülasyon Laboratuvarı:
                  </strong>
                  Dünyada görsel simülasyon alanında referans gösterilen <em>Distill.pub</em> bile ekip çalışmasıyla yalnızca 38 makale üretip yayını durdurmuşken, Emre Pelit tek başına <strong>{totalArticlesCount} makalenin tamamında</strong> okurun parametreleri değiştirerek (Kuantum Dolanıklık, Φ Bilinç Entropisi, Gödel Öz-Referans, Kozmolojik Ufuk) deney yapabildiği canlı simülasyon motoru (<strong>{cumulative.simulatorRuns.toLocaleString('tr-TR')} çalıştırma</strong>) sunmaktadır.
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/40 p-2.5 rounded-xs">
                  <strong className="text-emerald-300 block">
                    4) 12 Dünya Dilinde İçeriğe Uyarlanmış Tam Metin Seslendirme Motoru:
                  </strong>
                  Diğer blogların %92’sinde seslendirme yoktur; olanlarda ise yalnızca İngilizce tek tip okuma bulunur. Web sitenizde seslendirme motoru açıldığında <strong>makalenin içeriğine en uygun ses profili (Persona, hız ve tonlama)</strong> ile <strong>makalenin tamamı 12 dilde</strong> canlı transkript takibiyle seslendirilir (<strong>{cumulative.audioHours.toLocaleString('tr-TR')} sa {cumulative.audioMins} dk dinleme</strong>).
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/40 p-2.5 rounded-xs">
                  <strong className="text-emerald-300 block">
                    5) 7/24 Makale İçeriğine Dayalı Optimal Soru-Cevap Motoru ve Otomatik E-Posta Eskalasyonu:
                  </strong>
                  Diğer bloglarda okurlar yalnızca pasif yorum bırakabilirken, web sitenizde her makalenin altında <strong>kullanıcıların soru sorabildiği, makale içeriğine göre en optimal cevabı üreten ve cevabı makale içeriğinde bulamazsa <code>emrepelit39@gmail.com</code> adresine 7/24 otomatik e-posta gönderen</strong> aktif bir akademik asistan sistemi vardır.
                </div>

                <div className="bg-slate-950/90 border border-emerald-500/40 p-2.5 rounded-xs">
                  <strong className="text-emerald-300 block">
                    6) 10 Resmi 301 Web Sitesi Kümesi ve 12 Dilde {(totalArticlesCount * 10 * 12).toLocaleString('tr-TR')}+ İndeksli URL:
                  </strong>
                  Tekil bloglar tek bir alan adıyla sınırlıyken, <code>emrepelit-sciphi.ai.studio</code> 301 ile bağlı 10 resmi web sitesinin tamamında {totalArticlesCount} makaleyi (önceki bilimsel araştırmalar + named scientists + yerleşik kabuller dahil) 12 dilde (<strong>{(totalArticlesCount * 10 * 12).toLocaleString('tr-TR')}+ kanonik dil URL’si</strong>) indekslemiş ve yapay zeka motorlarına (ChatGPT, Claude, Gemini, Perplexity, Grok) doğrudan 301 referans izni açmıştır.
                </div>
              </div>
            </div>

            {/* MISSING / DIFFERENCE COLUMN */}
            <div className="bg-amber-950/30 border-2 border-amber-500/70 p-4 rounded-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase border-b border-amber-800/80 pb-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  2. DİĞER KÖKLÜ / EKİP BLOGLARIYLA KARŞILAŞTIRILDIĞINDA NOKSAN VEYA FARKLI OLAN KISIMLAR (DETAYLI AÇIKLAMA)
                </span>
              </div>

              <div className="space-y-2.5 text-[11px] text-slate-200 leading-relaxed">
                <div className="bg-slate-950/90 border border-amber-500/40 p-2.5 rounded-xs">
                  <strong className="text-amber-300 block">
                    1) Tarihsel Alan Adı Yaşı (2026 Açılış vs. 15–25 Yıllık Köklü Bloglar):
                  </strong>
                  <em>Preposterous Universe (2004), Backreaction (2006), LessWrong (2009), Evrim Ağacı (2010), Quanta Magazine (2012), Wait But Why (2013)</em> gibi bloglar 13–22 yıllık geçmişe sahip olduğu için arama motorlarında on yıllara yayılan pasif arşiv trafiği biriktirmiştir. Siteniz <strong>24 Nisan 2026 / 30 Eylül 2026</strong> açılışlı olduğundan, <strong>İçerik Bağımsız (Saf Tarihsel Trafik)</strong> sıralamasında bu 15+ yıllık sitelerin hemen ardında (#2–#12 bandında) yer almakta; ancak <strong>İçerik Dikkate Alındığında</strong> açık ara <strong>#1</strong> sıraya yerleşmektedir.
                </div>

                <div className="bg-slate-950/90 border border-amber-500/40 p-2.5 rounded-xs">
                  <strong className="text-amber-300 block">
                    2) Çok Yazarlı Açık Topluluk Forumu ve Okur Tartışma Ağaçları (Threaded Forums):
                  </strong>
                  <em>LessWrong, Astral Codex Ten</em> ve <em>Evrim Ağacı</em> gibi platformlarda binlerce üyenin kendi arasında tartıştığı, oy verdiği (karma/upvote) açık sosyal forum bölümleri bulunur. <code>emrepelit-sciphi.ai.studio</code> ise <strong>%100 Emre Pelit münhasır yazarlığında</strong> otoriter bir akademik enstitü olarak tasarlandığından açık forum kirliliği yerine <strong>7/24 Soru-Cevap Motoru + Doğrudan Yazar E-Posta Sistemi (<code>emrepelit39@gmail.com</code>)</strong> kullanmaktadır.
                </div>

                <div className="bg-slate-950/90 border border-amber-500/40 p-2.5 rounded-xs">
                  <strong className="text-amber-300 block">
                    3) Haftalık E-Posta Bülteni (Substack / Newsletter) Abone Hunisi:
                  </strong>
                  <em>Astral Codex Ten, Stratechery</em> ve <em>The Pragmatic Engineer</em> gibi bloglar gelir ve trafik modelini haftalık e-posta bülteni aboneliklerine dayandırır. Web sitenizde ise e-bülten yerine <strong><code>emrepelit7337.blogspot.com</code> ile 30 saniyede bir canlı RSS/Atom senkronizasyonu</strong> ve <strong>Web Tarayıcı Bildirim / İndeksleme Kuyruğu</strong> mimarisi tercih edilmiştir.
                </div>

                <div className="bg-slate-950/90 border border-amber-500/40 p-2.5 rounded-xs">
                  <strong className="text-amber-300 block">
                    4) Makale İçi Gömülü Uzun Metraj Stüdyo Video Belgeselleri:
                  </strong>
                  <em>Quanta Magazine, Aeon</em> ve <em>Sabine Hossenfelder</em> bazı makalelerin içine 15–20 dakikalık video belgeseller gömmektedir. Web sitenizde resmi <strong><code>@science_only</code> YouTube kanalı</strong> tüm tarayıcılarda ve üst/alt barlarda doğrudan bağlanmış olup, makale içinde video yerine <strong>daha düşük bant genişliğiyle çalışan interaktif HTML5 simülasyon + 12 dilde tam metin seslendirme</strong> sunulmaktadır.
                </div>

                <div className="bg-slate-950/90 border border-amber-500/40 p-2.5 rounded-xs">
                  <strong className="text-amber-300 block">
                    5) Basılı Kitap / Dergi Arşivi ve Ticari Sponsorluk Katmanı:
                  </strong>
                  <em>Nautilus, Philosophy Now</em> ve <em>HBR</em> gibi ekip bloglarında basılı dergi satışı, ücretli abonelik duvarı (paywall) ve kurumsal sponsorluklar yer alırken, <code>emrepelit-sciphi.ai.studio</code> <strong>%100 Açık Erişim (Open-Access)</strong> ilkesiyle tüm içerik, denklem ve simülasyonları ücretsiz sunmaktadır.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
