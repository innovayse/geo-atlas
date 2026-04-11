#!/usr/bin/env python3
"""
Translate missing hy country names in atlas.json using Claude CLI.
"""

import json
import os
import re
import subprocess

DATA_FILE = os.path.join(os.path.dirname(__file__), "../src/data/atlas.json")
BATCH_SIZE = 50


def translate_batch(names: list[str], target_lang: str) -> dict[str, str]:
    lang_name = "Armenian" if target_lang == "hy" else "Russian"
    prompt = (
        f"Translate the following country names to {lang_name}. "
        f"Return ONLY a JSON object where keys are the original English names and values are the {lang_name} translations. "
        f"Use official/standard names as used on maps and in official documents. "
        f"Do not add any explanation, just the JSON.\n\n"
        f"Countries:\n" + "\n".join(names)
    )
    try:
        result = subprocess.run(
            ["claude", "-p", prompt, "--model", "claude-haiku-4-5-20251001"],
            capture_output=True, text=True, timeout=120
        )
        text = result.stdout.strip()
    except Exception as e:
        print(f"  [WARN] CLI error: {e}")
        return {}

    code_block = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if code_block:
        text = code_block.group(1)
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        print(f"  [WARN] No JSON in response")
        return {}
    try:
        return json.loads(text[start:end])
    except json.JSONDecodeError as e:
        print(f"  [WARN] JSON parse error: {e}")
        return {}


def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        data = json.load(f)

    missing_hy = []
    for country in data:
        if not country.get("translations", {}).get("hy"):
            missing_hy.append(country["name"])

    print(f"Countries missing hy translation: {len(missing_hy)}")

    hy_translations = {}
    for i in range(0, len(missing_hy), BATCH_SIZE):
        batch = missing_hy[i:i + BATCH_SIZE]
        print(f"  Translating batch {i//BATCH_SIZE + 1}/{(len(missing_hy)+BATCH_SIZE-1)//BATCH_SIZE}...")
        result = translate_batch(batch, "hy")
        hy_translations.update(result)

    updated = 0
    for country in data:
        name = country["name"]
        if not country.get("translations", {}).get("hy") and name in hy_translations:
            if "translations" not in country:
                country["translations"] = {}
            country["translations"]["hy"] = hy_translations[name]
            updated += 1

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Done. Updated {updated} countries with hy translations.")


if __name__ == "__main__":
    main()
