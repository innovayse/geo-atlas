#!/usr/bin/env python3
"""
Translate missing ru/hy city names in geo-atlas using Claude API.
Processes cities in batches of 150 names per API call.
"""

import json
import os
import time
import anthropic

API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GEO_DIR = os.path.join(os.path.dirname(__file__), "../src/data/countries")
BATCH_SIZE = 150

client = anthropic.Anthropic(api_key=API_KEY)


def translate_batch(names: list[str], target_lang: str) -> dict[str, str]:
    """Translate a batch of city names to target language using Claude."""
    lang_name = "Russian" if target_lang == "ru" else "Armenian"
    lang_code = "ru" if target_lang == "ru" else "hy"

    prompt = (
        f"Translate the following city names to {lang_name}. "
        f"Return ONLY a JSON object where keys are the original English names and values are the {lang_name} translations. "
        f"Use standard transliteration/translation as used on maps and in official documents. "
        f"Do not add any explanation, just the JSON.\n\n"
        f"Cities:\n" + "\n".join(names)
    )

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.content[0].text.strip()
    # Try to extract JSON from code block first, then bare JSON
    import re
    # Remove markdown code blocks
    code_block = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if code_block:
        text = code_block.group(1)

    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        print(f"  [WARN] No JSON in response for {lang_code}, retrying...")
        # Retry once
        time.sleep(1)
        response2 = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=4096,
            messages=[
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": "{"}
            ]
        )
        text2 = "{" + response2.content[0].text.strip()
        start = text2.find("{")
        end = text2.rfind("}") + 1
        if start == -1 or end == 0:
            return {}
        text = text2

    try:
        return json.loads(text[start:end])
    except json.JSONDecodeError as e:
        print(f"  [WARN] JSON parse error: {e}")
        return {}


def process_country(filepath: str, iso2: str):
    """Process a single country file, adding missing ru/hy translations."""
    with open(filepath, encoding="utf-8") as f:
        data = json.load(f)

    # Collect cities missing ru or hy
    missing_ru = []
    missing_hy = []

    for state in data.get("states", []):
        for city in state.get("cities", []):
            t = city.get("translations", {})
            name = city["name"]
            if not t.get("ru"):
                missing_ru.append(name)
            if not t.get("hy"):
                # For Armenian cities use native field if available
                if iso2 == "am" and city.get("native"):
                    pass  # will handle below
                else:
                    missing_hy.append(name)

    if not missing_ru and not missing_hy:
        return False  # nothing to do

    # Deduplicate
    missing_ru = list(dict.fromkeys(missing_ru))
    missing_hy = list(dict.fromkeys(missing_hy))

    ru_translations = {}
    hy_translations = {}

    # Translate RU in batches
    if missing_ru:
        print(f"  Translating {len(missing_ru)} cities to RU...")
        for i in range(0, len(missing_ru), BATCH_SIZE):
            batch = missing_ru[i:i + BATCH_SIZE]
            result = translate_batch(batch, "ru")
            ru_translations.update(result)
            if i + BATCH_SIZE < len(missing_ru):
                time.sleep(0.5)

    # Translate HY in batches
    if missing_hy:
        print(f"  Translating {len(missing_hy)} cities to HY...")
        for i in range(0, len(missing_hy), BATCH_SIZE):
            batch = missing_hy[i:i + BATCH_SIZE]
            result = translate_batch(batch, "hy")
            hy_translations.update(result)
            if i + BATCH_SIZE < len(missing_hy):
                time.sleep(0.5)

    # Apply translations back to data
    changed = False
    for state in data.get("states", []):
        for city in state.get("cities", []):
            name = city["name"]
            if "translations" not in city:
                city["translations"] = {}

            if not city["translations"].get("ru") and name in ru_translations:
                city["translations"]["ru"] = ru_translations[name]
                changed = True

            if not city["translations"].get("hy"):
                # Armenian cities: use native field
                if iso2 == "am" and city.get("native"):
                    city["translations"]["hy"] = city["native"]
                    changed = True
                elif name in hy_translations:
                    city["translations"]["hy"] = hy_translations[name]
                    changed = True

    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

    return changed


def main():
    files = sorted([f for f in os.listdir(GEO_DIR) if f.endswith(".json")])
    total = len(files)
    updated = 0

    print(f"Processing {total} country files...\n")

    for i, fname in enumerate(files, 1):
        iso2 = fname.replace(".json", "").lower()
        filepath = os.path.join(GEO_DIR, fname)

        with open(filepath, encoding="utf-8") as f:
            data = json.load(f)

        # Quick check if anything is missing
        needs_work = False
        for state in data.get("states", []):
            for city in state.get("cities", []):
                t = city.get("translations", {})
                if not t.get("ru") or not t.get("hy"):
                    needs_work = True
                    break
            if needs_work:
                break

        if not needs_work:
            print(f"[{i}/{total}] {fname} — OK, skipping")
            continue

        print(f"[{i}/{total}] {fname} — processing...")
        changed = process_country(filepath, iso2)
        if changed:
            updated += 1
            print(f"  ✓ Updated")

    print(f"\nDone. Updated {updated}/{total} files.")


if __name__ == "__main__":
    main()
