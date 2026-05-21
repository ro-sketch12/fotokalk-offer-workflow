#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXT_EXTENSIONS = {
    ".md",
    ".mjs",
    ".js",
    ".ts",
    ".tsx",
    ".json",
    ".yml",
    ".yaml",
    ".py",
    ".txt",
}

SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{20,}"),
    re.compile(r"gh[pousr]_[A-Za-z0-9_]{20,}"),
    re.compile(r"AIza[0-9A-Za-z\-_]{35}"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(r"(?i)(password|secret|api[_-]?key)\s*=\s*['\"][^'\"]{8,}['\"]"),
]

EMAIL_PATTERN = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_PATTERN = re.compile(r"\b(?:\+49|0049|0)[\s-]?(?:\d[\s-]?){8,}\b")

SKIP_DIRS = {".git", "node_modules", "dist", "build", ".next", "coverage"}


def iter_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file() and path.suffix in TEXT_EXTENSIONS:
            files.append(path)
    return files


def main() -> int:
    findings: list[str] = []

    for env_file in ROOT.rglob(".env*"):
        if env_file.is_file() and not any(part in SKIP_DIRS for part in env_file.parts):
            findings.append(f"env file present: {env_file.relative_to(ROOT)}")

    for path in iter_files():
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pattern in SECRET_PATTERNS:
            for match in pattern.finditer(text):
                findings.append(f"secret-like value in {path.relative_to(ROOT)}: {match.group(0)[:24]}...")
        for match in EMAIL_PATTERN.finditer(text):
            findings.append(f"email-like value in {path.relative_to(ROOT)}: {match.group(0)}")
        for match in PHONE_PATTERN.finditer(text):
            findings.append(f"phone-like value in {path.relative_to(ROOT)}: {match.group(0)}")

    if findings:
        print("Public-safety scan failed:")
        for finding in findings:
            print(f"- {finding}")
        return 1

    print("Public-safety scan passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
