import json
import re
from typing import List, Dict

# =========================================================
# CONFIG
# =========================================================

MANDATORY_SECTIONS = [
    "WHEN TO USE THIS GUIDE",
    "IMMEDIATE PRIORITIES",
    "IMMEDIATE DANGERS",
    "STEP-BY-STEP",
    "VITAL SIGNS TO CHECK",
    "WHEN PROFESSIONAL HELP IS UNAVAILABLE",
    "LONG-TERM CARE",
    "PREVENTION",
    "REALISTIC EXPECTATIONS",
    "DO NOT"
]

MIN_DO_NOT_ITEMS = 5

SEVERITY_KEYWORDS = {
    "life-threatening": [
        "life-threatening", "can kill", "minutes", "immediate",
        "death", "brain damage"
    ],
    "serious": [
        "serious", "risk", "monitor closely", "can worsen"
    ],
    "mild": [
        "mild", "usually safe", "self-limiting"
    ]
}

MYTH_REJECTION_KEYWORDS = [
    "false", "myth", "not safe", "do not", "incorrect"
]

LIMITATION_KEYWORDS = [
    "may not", "cannot", "limited", "no guarantee",
    "depends on", "risk remains"
]

PANIC_KEYWORDS = [
    "i don't know", "help", "not responding",
    "breathing weird", "something wrong"
]

# =========================================================
# TEST CASES
# =========================================================

TEST_CASES = [
    {
        "name": "Massive bleeding – arterial",
        "query": "Blood spurting from leg, person dizzy and pale",
        "expected_primary_rag": "medical",
        "required_triggers": ["shock", "tourniquet"],
        "severity": "life-threatening"
    },
    {
        "name": "Food poisoning + dehydration",
        "query": "Vomiting and diarrhea after drinking river water",
        "expected_primary_rag": "food_and_water_safety",
        "required_triggers": ["medical", "dehydration"],
        "severity": "serious"
    },
    {
        "name": "Hypothermia exposure",
        "query": "Cold rain all night, shivering, slurred speech",
        "expected_primary_rag": "shelter_and_environmental_survival",
        "required_triggers": ["medical"],
        "severity": "life-threatening"
    },
    {
        "name": "Myth test – urine wound cleaning",
        "query": "Can I clean wounds with urine?",
        "expected_primary_rag": "medical",
        "must_reject_myth": True
    },
    {
        "name": "Panic ambiguity test",
        "query": "I don't know what's wrong, person breathing weird and not responding",
        "expected_primary_rag": "medical",
        "severity": "life-threatening",
        "panic_test": True
    }
]

# =========================================================
# RAG INTERFACE (REPLACE WITH REAL ONE)
# =========================================================

def rag_query(query: str) -> Dict:
    """
    REQUIRED RETURN FORMAT:
    {
        "retrieved_files": ["medical/bleeding.md", ...],
        "answer": "full generated response"
    }
    """
    return {
        "retrieved_files": ["medical/emergency.md"],
        "answer": """
WHEN TO USE THIS GUIDE
Use when life-threatening symptoms are present.

IMMEDIATE PRIORITIES
Ensure airway, breathing, circulation.

IMMEDIATE DANGERS
This condition is life-threatening and can kill in minutes.

STEP-BY-STEP
Act immediately. Call for help. Begin emergency care.

VITAL SIGNS TO CHECK
Breathing rate, pulse, skin color, consciousness.

WHEN PROFESSIONAL HELP IS UNAVAILABLE
Continue emergency care knowing outcomes are limited.

LONG-TERM CARE
Recovery may be incomplete.

PREVENTION
Early recognition reduces risk.

REALISTIC EXPECTATIONS
Survival is not guaranteed and depends on rapid action.

DO NOT
Do not delay.
Do not give fluids.
Do not leave alone.
Do not assume recovery.
Do not stop monitoring.
"""
    }

# =========================================================
# VALIDATORS
# =========================================================

def text_contains_any(text: str, keywords: List[str]) -> bool:
    t = text.lower()
    return any(k.lower() in t for k in keywords)


def validate_primary_rag(files, expected):
    return any(expected in f.lower() for f in files)


def validate_triggers(answer, triggers):
    return all(t.lower() in answer.lower() for t in triggers)


def validate_severity(answer, severity):
    return text_contains_any(answer, SEVERITY_KEYWORDS.get(severity, []))


def extract_section(text, section):
    pattern = rf"{section}(.+?)(\n[A-Z][A-Z ]+\n|$)"
    match = re.search(pattern, text, re.S | re.I)
    return match.group(1).strip() if match else ""


def validate_mandatory_sections(answer):
    missing = []
    upper = answer.upper()
    for s in MANDATORY_SECTIONS:
        if s not in upper:
            missing.append(s)
    return missing


def validate_do_not(answer):
    section = extract_section(answer, "DO NOT")
    items = [l for l in section.splitlines() if l.strip().startswith("Do not")]
    return len(items) >= MIN_DO_NOT_ITEMS


def validate_limitations(answer):
    section = extract_section(answer, "REALISTIC EXPECTATIONS")
    return text_contains_any(section, LIMITATION_KEYWORDS)


def validate_myth_rejection(answer):
    return text_contains_any(answer, MYTH_REJECTION_KEYWORDS)

# =========================================================
# TEST RUNNER
# =========================================================

def run_tests():
    results = []
    coverage_hits = 0

    for test in TEST_CASES:
        print(f"\n=== TEST: {test['name']} ===")
        out = rag_query(test["query"])
        answer = out.get("answer", "")
        files = out.get("retrieved_files", [])

        passed = True
        errors = []

        if "expected_primary_rag" in test:
            if validate_primary_rag(files, test["expected_primary_rag"]):
                coverage_hits += 1
            else:
                passed = False
                errors.append("Wrong primary RAG")

        if "required_triggers" in test:
            if validate_triggers(answer, test["required_triggers"]):
                coverage_hits += 1
            else:
                passed = False
                errors.append("Missing cross-RAG trigger")

        if "severity" in test:
            if validate_severity(answer, test["severity"]):
                coverage_hits += 1
            else:
                passed = False
                errors.append("Severity escalation missing")

        missing_sections = validate_mandatory_sections(answer)
        if missing_sections:
            passed = False
            errors.append(f"Missing sections: {missing_sections}")
        else:
            coverage_hits += 1

        if not validate_do_not(answer):
            passed = False
            errors.append("DO NOT section too weak")

        if not validate_limitations(answer):
            passed = False
            errors.append("REALISTIC EXPECTATIONS lacks limitations")

        if test.get("must_reject_myth"):
            if not validate_myth_rejection(answer):
                passed = False
                errors.append("Myth not explicitly rejected")

        results.append({
            "test": test["name"],
            "passed": passed,
            "errors": errors,
            "retrieved_files": files
        })

        print("RESULT:", "PASSED" if passed else "FAILED")
        for e in errors:
            print(" -", e)

    coverage_score = round((coverage_hits / (len(TEST_CASES) * 4)) * 100, 2)

    return results, coverage_score

# =========================================================
# ENTRY
# =========================================================

if __name__ == "__main__":
    results, coverage = run_tests()

    print("\n=========== SUMMARY ===========")
    print(f"Total tests: {len(results)}")
    print(f"Passed: {len([r for r in results if r['passed']])}")
    print(f"Failed: {len([r for r in results if not r['passed']])}")
    print(f"Coverage score: {coverage}%")

    with open("rag_test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    if coverage < 80:
        raise SystemExit("❌ Coverage below acceptable threshold")

    print("✅ RAG system passed critical tests")
