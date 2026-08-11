#!/usr/bin/env python3
"""Print SHA-256 hex digest for auth secrets used in site-config.js.

Usage:
  python scripts/hash_auth_secret.py "your-password"
  python scripts/hash_auth_secret.py "invite-token"
"""
from __future__ import annotations

import hashlib
import sys


def main() -> int:
    if len(sys.argv) < 2 or not str(sys.argv[1]).strip():
        print("Usage: python scripts/hash_auth_secret.py \"secret\"", file=sys.stderr)
        return 1
    secret = sys.argv[1]
    print(hashlib.sha256(secret.encode("utf-8")).hexdigest())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
