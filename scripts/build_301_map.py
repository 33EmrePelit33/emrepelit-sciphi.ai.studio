#!/usr/bin/env python3
"""
Stage 2: 301 Consolidation Map Builder (build_301_map.py)
Generates complete blogger-301.json and cloudflare-bulk-redirects.csv
covering ALL 316+ articles with sole canonical destination:
  SITE = https://emrepelit-sciphi.ai.studio
"""
import json
import os
import re
import urllib.request
from pathlib import Path

SITE = os.environ.get("SITE_URL", "https://emrepelit-sciphi.ai.studio").rstrip("/")
BLOGGER_ORIGIN = os.environ.get("BLOGGER_URL", "https://emrepelit7337.blogspot.com").rstrip("/")

ROOT_DIR = Path(__file__).resolve().parent.parent
SNAPSHOT_PATH = ROOT_DIR / "public" / "data" / "corpus-snapshot.json"
OUT_JSON_PATH = ROOT_DIR / "public" / "blogger-301.json"
OUT_CSV_PATH = ROOT_DIR / "public" / "cloudflare-bulk-redirects.csv"

RETIRED_DOMAINS = [
    "science-philosophy.grok.me",
    "sci-phi.ai.studio",
    "sci-phil.ai.studio",
    "science-philosophy.ai.studio",
    "science-philosophy-emre-pelit.ai.studio",
    "emre-pelit-sci-phil.ai.studio",
    "emrepelit.github.io/science-philosophy",
    "emrepelit-sci-phi.ai.studio",
]

LANG_SEGMENT_MAP = {
    "tr": "makale",
    "en": "article",
    "es": "articulo",
    "de": "artikel",
    "fr": "article",
    "ru": "statya",
    "ar": "maqal",
    "zh": "wenzhang",
    "ja": "ronbun",
    "pt": "artigo",
    "it": "articolo",
    "ko": "nonmun",
}

STOPWORDS_7LANG = {
    "tr": {
        "ve", "bir", "bu", "için", "ile", "olan", "olarak", "gibi", "daha", "değil",
        "ancak", "fakat", "üzerine", "nedir", "neden", "kadar", "mi", "mı", "mu", "mü",
        "evren", "zaman", "bilinç", "gerçek", "yoksa", "var", "yok", "veya", "ama",
    },
    "en": {
        "the", "and", "of", "to", "in", "is", "that", "it", "for", "as", "with",
        "on", "this", "are", "not", "but", "from", "by", "or", "we", "be", "what",
        "when", "why", "how", "an", "universe", "time", "consciousness",
    },
    "es": {
        "el", "la", "los", "las", "de", "del", "en", "un", "una", "que", "por",
        "para", "con", "como", "sobre", "más", "pero", "entre", "desde", "todo",
        "cuando", "qué", "si", "es", "son", "tiempo", "universo",
    },
    "de": {
        "der", "die", "das", "und", "in", "von", "zu", "mit", "auf", "für", "ist",
        "ein", "eine", "nicht", "als", "auch", "des", "dem", "den", "sich", "über",
        "wie", "oder", "zeit", "universum", "bewusstsein", "warum",
    },
    "fr": {
        "le", "la", "les", "de", "des", "du", "un", "une", "et", "dans", "pour",
        "que", "qui", "est", "en", "par", "sur", "avec", "plus", "pas", "ce",
        "cette", "nous", "vous", "mais", "comme", "temps", "univers", "conscience",
        "si", "qu", "jusqu",
    },
    "pt": {
        "o", "a", "os", "as", "do", "da", "dos", "das", "em", "um", "uma", "para",
        "com", "não", "como", "mais", "mas", "sobre", "entre", "tempo",
    },
    "it": {
        "il", "lo", "la", "gli", "le", "di", "del", "della", "nel", "nella", "con",
        "per", "che", "non", "come", "più", "tempo", "universo", "coscienza",
    },
}


def detect_lang(title: str, abstract: str = "") -> str:
    sample = f"{title or ''} {(abstract or '')[:1000]}"
    if len(re.findall(r"[\u0600-\u06FF]", sample)) > 12:
        return "ar"
    if len(re.findall(r"[\u0400-\u04FF]", sample)) > 12:
        return "ru"
    ja_matches = len(re.findall(r"[\u3040-\u30FF]", sample))
    if ja_matches > 6:
        return "ja"
    if len(re.findall(r"[\uAC00-\uD7AF]", sample)) > 6:
        return "ko"
    if len(re.findall(r"[\u4E00-\u9FFF]", sample)) > 12 and ja_matches == 0:
        return "zh"

    scores = {"tr": 0, "en": 0, "es": 0, "de": 0, "fr": 0, "pt": 0, "it": 0}
    scores["tr"] += len(re.findall(r"[ğşıİĞŞ]", sample)) * 16
    scores["de"] += len(re.findall(r"[äÄß]", sample)) * 16
    scores["es"] += len(re.findall(r"[¿¡ñÑ]", sample)) * 16
    scores["pt"] += len(re.findall(r"[ãõÃÕ]", sample)) * 16
    scores["fr"] += len(re.findall(r"[œŒæÆàâêîôùûÀÂÊÎÔÙÛçÇ]", sample)) * 6
    scores["it"] += len(re.findall(r"[ìòÌÒ]", sample)) * 6

    words = re.findall(r"[A-Za-zÀ-ÖØ-öø-ÿĀ-ž]+", sample.lower())
    for w in words:
        for lang_key, sw in STOPWORDS_7LANG.items():
            if w in sw:
                scores[lang_key] += 5

    best_lang = "tr"
    best_score = -1
    for lang_key in ("tr", "en", "es", "de", "fr", "pt", "it"):
        if scores[lang_key] > best_score:
            best_score = scores[lang_key]
            best_lang = lang_key
    return best_lang if best_score > 0 else "tr"


def slugify(title: str, post_id: str, post_number: int) -> str:
    tr_map = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")
    cleaned = re.sub(r"[^a-z0-9]+", "-", title.translate(tr_map).lower()).strip("-")
    if len(cleaned) > 68:
        cleaned = cleaned[:68].rstrip("-")
    if not cleaned:
        cleaned = f"sciphil-article-{post_number}"
    short_id = re.sub(r"^blogger-", "", str(post_id))[-18:]
    if short_id and not cleaned.endswith(short_id):
        cleaned = f"{cleaned}-{short_id}"
    return cleaned


def load_entries() -> list[dict]:
    if SNAPSHOT_PATH.exists():
        data = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
        articles = data.get("articles") or []
        if articles:
            return articles

    collected = []
    for start_index in (1, 151, 301, 451):
        url = f"{BLOGGER_ORIGIN}/feeds/posts/default?alt=json&start-index={start_index}&max-results=150"
        with urllib.request.urlopen(url, timeout=15) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
        raw = payload.get("feed", {}).get("entry") or []
        if not raw:
            break
        collected.extend(raw)
        if len(raw) < 150:
            break

    total = len(collected)
    entries = []
    for idx, raw in enumerate(collected):
        id_str = str(raw.get("id", {}).get("$t", ""))
        m = re.search(r"post-(\d+)", id_str)
        pid = m.group(1) if m else str(total - idx)
        title = str(raw.get("title", {}).get("$t", f"Article #{total - idx}")).strip()
        alt = next((l.get("href") for l in raw.get("link", []) if l.get("rel") == "alternate"), "")
        entries.append(
            {
                "id": f"blogger-{pid}",
                "bloggerPostId": pid,
                "postNumber": total - idx,
                "title": title,
                "bloggerUrl": alt,
                "abstract": "",
            }
        )
    return entries


def build() -> dict:
    entries = load_entries()
    rules = []
    csv_lines = [
        "source_url,target_url,status_code,preserve_query_string,include_subdomains,subpath_matching"
    ]

    for retired_host in RETIRED_DOMAINS:
        csv_lines.append(f"https://{retired_host}/*,{SITE}/$1,301,true,false,true")

    total = len(entries)
    for idx, entry in enumerate(entries):
        art_id = str(entry.get("id") or f"blogger-post-{total - idx}")
        pid = str(entry.get("bloggerPostId") or re.sub(r"^blogger-", "", art_id))
        post_num = int(entry.get("postNumber") or (total - idx))
        title = str(entry.get("title") or f"Makale #{post_num}")
        abstract = str(entry.get("abstract") or "")
        lang = str(entry.get("sourceLang") or detect_lang(title, abstract))
        if lang not in LANG_SEGMENT_MAP:
            lang = "en"
        slug = str(entry.get("slug") or slugify(title, art_id, post_num))
        seg = LANG_SEGMENT_MAP[lang]
        canonical_path = f"/{lang}/{seg}/{slug}"
        canonical_url = f"{SITE}{canonical_path}"

        blogger_url = str(entry.get("bloggerUrl") or "")
        blogger_path = "/"
        if blogger_url.startswith("http"):
            blogger_path = "/" + blogger_url.split("/", 3)[-1].lstrip("/")

        rules.append(
            {
                "postNumber": post_num,
                "id": art_id,
                "bloggerPostId": pid,
                "sourceLang": lang,
                "slug": slug,
                "title": title,
                "bloggerUrl": blogger_url,
                "legacyQueryPath": f"/?article={art_id}",
                "canonicalPath": canonical_path,
                "canonicalUrl": canonical_url,
                "statusCode": 301,
                "localizedUrls": {
                    l: f"{SITE}/{l}/{s}/{slug}" for l, s in LANG_SEGMENT_MAP.items()
                },
            }
        )

        if blogger_path and blogger_path != "/":
            csv_lines.append(f"https://science-philosophy.grok.me{blogger_path},{canonical_url},301,false,false,false")
            csv_lines.append(f"https://sci-phi.ai.studio{blogger_path},{canonical_url},301,false,false,false")

    output = {
        "schemaVersion": "2026.11.301-CONSOLIDATION-V2",
        "site": SITE,
        "bloggerOrigin": BLOGGER_ORIGIN,
        "liveWebsites": [
            "emrepelit-sciphi.ai.studio",
            "emrepelit7337.blogspot.com",
        ],
        "retiredDomains": RETIRED_DOMAINS,
        "totalArticles": len(rules),
        "rules": rules,
    }

    OUT_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    OUT_CSV_PATH.write_text("\n".join(csv_lines) + "\n", encoding="utf-8")
    return output


if __name__ == "__main__":
    result = build()
    print(
        f"[build_301_map.py] Built {result['totalArticles']} canonical 301 rules -> {result['site']} "
        f"({OUT_JSON_PATH.name}, {OUT_CSV_PATH.name})"
    )
