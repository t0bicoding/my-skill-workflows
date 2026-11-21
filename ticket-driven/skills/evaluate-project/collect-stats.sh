#!/usr/bin/env bash
# Collects repository statistics for /evaluate-project.
# Read-only: uses git and the tracked files only; writes nothing, needs no network.
# Usage: bash collect-stats.sh [path]   (path narrows the scope; default: whole repo)

set -u

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Not a git repository."; exit 1; }
cd "$root" || exit 1
scope="${1:-.}"
if [ -z "$(git ls-files -- "$scope" | head -n 1)" ]; then
  echo "No tracked files under '$scope'."; exit 1
fi

# Files that are generated or vendored: counted separately, never as own code.
GENERATED='(^|/)(package-lock[.]json|npm-shrinkwrap[.]json|yarn[.]lock|pnpm-lock[.]yaml|bun[.]lockb|Cargo[.]lock|poetry[.]lock|uv[.]lock|Pipfile[.]lock|composer[.]lock|Gemfile[.]lock|go[.]sum|packages[.]lock[.]json)$|[.]min[.](js|css)$|[.]map$|(^|/)(dist|build|out|vendor|third_party|node_modules|[.]venv|venv|target|coverage)/'
TESTPATH='(^|/)(tests?|__tests__|spec|specs|e2e|testing)/|[.](test|spec)[.][^/]+$|(^|/)test_[^/]+[.]py$|_test[.](py|go|rs|exs?)$|Tests?[.](cs|java|kt|swift)$|(^|/)conftest[.]py$'
CODEEXT='^(py|pyi|js|jsx|mjs|cjs|ts|tsx|mts|cts|vue|svelte|rs|go|java|kt|kts|scala|cs|fs|vb|c|h|cc|cpp|cxx|hpp|hh|m|mm|swift|rb|php|dart|lua|ex|exs|erl|clj|hs|ml|r|jl|pl|sh|bash|ps1|psm1|sql)$'
# Pathspecs for marker searches: code files only, the tool's own folders excluded.
CODESPEC=("$scope" ':(exclude).claude/**' ':(exclude)**/node_modules/**')

section() { printf '\n## %s\n' "$1"; }

section "Repository"
echo "root: $(basename "$root")"
echo "scope: $scope"
echo "branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
echo "head: $(git log -1 --format='%h %as %s' 2>/dev/null)"
if [ "$(git rev-parse --is-shallow-repository 2>/dev/null)" = "true" ]; then
  echo "WARNING: shallow clone — history figures are incomplete."
fi
first=$(git rev-list --max-parents=0 HEAD 2>/dev/null | tail -n 1)
[ -n "$first" ] && echo "first commit: $(git log -1 --format=%as "$first")"
echo "last commit: $(git log -1 --format=%as 2>/dev/null)"
echo "tags: $(git tag | wc -l | tr -d ' ')  latest: $(git describe --tags --abbrev=0 2>/dev/null || echo '-')"
echo "uncommitted changes: $(git status --porcelain -- "$scope" | grep -vc '^??')  untracked: $(git status --porcelain -- "$scope" | grep -c '^??')"

section "Activity (commits touching scope)"
echo "total: $(git rev-list --count HEAD -- "$scope")  (merges: $(git rev-list --count --merges HEAD -- "$scope"))"
for span in "30 days" "90 days" "365 days"; do
  echo "last $span: $(git rev-list --count --since="$span ago" HEAD -- "$scope")"
done
echo "active days (distinct commit dates): $(git log --format=%as -- "$scope" | sort -u | wc -l | tr -d ' ')"
echo "per month, last 12 months:"
git log --since="12 months ago" --format=%ad --date=format:%Y-%m -- "$scope" | sort | uniq -c | awk '{printf "  %s %5d\n", $2, $1}'

section "Contributors (commits, no merges)"
echo "count: $(git shortlog -sn --no-merges HEAD -- "$scope" | wc -l | tr -d ' ')"
git shortlog -sn --no-merges HEAD -- "$scope" | head -n 10

section "Commit messages"
total_nm=$(git rev-list --count --no-merges HEAD -- "$scope")
conv=$(git log --no-merges --format=%s -- "$scope" | grep -cE '^(feat|fix|docs|chore|refactor|test|tests|perf|build|ci|style|revert)(\([^)]*\))?!?: ')
echo "conventional-commit share: $conv / $total_nm"
echo "type distribution:"
git log --no-merges --format=%s -- "$scope" | sed -nE 's/^([a-z]+)(\([^)]*\))?!?: .*/\1/p' | sort | uniq -c | sort -rn | head -n 12

# One pass over all tracked text files: "<lines> <path>".
counts=$(git grep -I -c '' -- "$scope" 2>/dev/null | awk '{ n=$0; sub(/.*:/, "", n); p=substr($0, 1, length($0)-length(n)-1); print n, p }')

section "Size"
echo "tracked files: $(git ls-files -- "$scope" | wc -l | tr -d ' ')  (binary or empty: $(( $(git ls-files -- "$scope" | wc -l) - $(printf '%s\n' "$counts" | grep -c .) )))"
# Own text files as "<lines> <ext> <path>"; generated ones as "<lines> GENERATED <path>".
classified=$(printf '%s\n' "$counts" | awk -v gen="$GENERATED" 'NF >= 2 {
    n=$1; p=substr($0, length($1)+2)
    if (p ~ gen) { print n, "GENERATED", p; next }
    f=p; sub(/.*\//, "", f); e=(index(f, ".") > 0) ? tolower(f) : "(none)"; sub(/.*[.]/, "", e)
    print n, e, p }')
printf '%s\n' "$classified" | awk -v test="$TESTPATH" -v code="$CODEEXT" 'NF >= 3 {
    n=$1; e=$2; p=substr($0, length($1)+length($2)+3)
    if (e == "GENERATED") { gl+=n; gf++; next }
    tl+=n; tf++
    if (e ~ code) { if (p ~ test) { tsl+=n; tsf++ } else { srcl+=n; srcf++ } }
  }
  END {
    printf "text lines (own): %d in %d files\n", tl, tf
    printf "generated/vendored/lockfiles: %d lines in %d files (excluded)\n", gl, gf
    printf "code, production: %d lines in %d files\n", srcl, srcf
    printf "code, tests:      %d lines in %d files\n", tsl, tsf
    if (srcl > 0) printf "test-to-production line ratio: %.2f\n", tsl/srcl
  }'
echo "by extension (lines, files, ext), top 15:"
printf '%s\n' "$classified" | awk 'NF >= 3 && $2 != "GENERATED" { l[$2]+=$1; f[$2]++ } END { for (e in l) printf "%9d %6d  %s\n", l[e], f[e], e }' | sort -rn | head -n 15

section "Largest own files (lines)"
printf '%s\n' "$classified" | awk 'NF >= 3 && $2 != "GENERATED" { print $1, substr($0, length($1)+length($2)+3) }' | sort -rn | head -n 15

section "Hotspots: most-changed files, last 12 months (still tracked)"
git log --since="12 months ago" --no-merges --name-only --format= -- "$scope" | grep -v '^$' | grep -vE "$GENERATED" \
  | sort | uniq -c | sort -rn \
  | while read -r n p; do [ -e "$p" ] && printf '%5d %s\n' "$n" "$p"; done | head -n 15

section "Markers in code (TODO/FIXME/HACK)"
mk=$(git grep -I -w -c -E 'TODO|FIXME|HACK' -- "${CODESPEC[@]}" 2>/dev/null | awk -v code="$CODEEXT" '{
    n=$0; sub(/.*:/, "", n); p=substr($0, 1, length($0)-length(n)-1)
    f=p; sub(/.*\//, "", f); e=tolower(f); sub(/.*[.]/, "", e)
    if (index(f, ".") > 0 && e ~ code) print n, p }')
echo "total: $(printf '%s\n' "$mk" | awk '{s+=$1} END {print s+0}') in $(printf '%s\n' "$mk" | grep -c .) files"
printf '%s\n' "$mk" | sort -rn | head -n 8

section "Suppressions (lint/type/test)"
supp() { git grep -I -c -E "$2" -- "${CODESPEC[@]}" 2>/dev/null | awk -v label="$1" '{ n=$0; sub(/.*:/, "", n); s+=n; f++ } END { printf "%-22s %5d in %d files\n", label, s+0, f+0 }'; }
supp "lint disabled"   'eslint-disable|# *noqa|pylint: *disable|#\[allow\(|@SuppressWarnings|//nolint|rubocop:disable|biome-ignore'
supp "type check off"  '@ts-ignore|@ts-expect-error|@ts-nocheck|# *type: *ignore|: *any\b|as any\b'
supp "skipped tests"   '\.skip\(|\bxit\(|\bxdescribe\(|\.todo\(|@pytest\.mark\.(skip|xfail)|pytest\.skip\(|@Ignore|@Disabled|#\[ignore\]|t\.Skip\('
supp "panics/unwrap"   '\.unwrap\(\)|\.expect\("|panic!\('
supp "bare except"     'except *:|except Exception *:|catch *\( *\w* *\) *\{ *\}'

section "Infrastructure files present"
git ls-files -- "$scope" | grep -vE "$GENERATED" | grep -iE '(^|/)(\.github/workflows/[^/]+|\.gitlab-ci\.yml|azure-pipelines\.yml|Jenkinsfile|\.circleci/config\.yml|bitbucket-pipelines\.yml|\.pre-commit-config\.yaml|\.husky/[^/_]+|\.githooks/[^/]+|lefthook\.ya?ml|package\.json|pyproject\.toml|setup\.py|setup\.cfg|requirements[^/]*\.(txt|in)|Pipfile|Cargo\.toml|go\.mod|pom\.xml|build\.gradle(\.kts)?|[^/]+\.(csproj|sln)|Gemfile|composer\.json|Dockerfile[^/]*|docker-compose[^/]*\.ya?ml|compose\.ya?ml|Makefile|justfile|README[^/]*|LICEN[CS]E[^/]*|CHANGELOG[^/]*|CONTRIBUTING[^/]*|SECURITY[^/]*|CLAUDE\.md|AGENTS\.md|tsconfig[^/]*\.json|eslint\.config\.[^/]+|\.eslintrc[^/]*|\.prettierrc[^/]*|biome\.json|ruff\.toml|\.ruff\.toml|mypy\.ini|pytest\.ini|tox\.ini|vitest\.config\.[^/]+|jest\.config\.[^/]+|playwright\.config\.[^/]+|\.editorconfig|clippy\.toml|rustfmt\.toml|\.golangci\.ya?ml|renovate\.json5?|dependabot\.ya?ml|\.env\.example)$' \
  | grep -v '/node_modules/' | head -n 60
echo "lockfiles:"
git ls-files -- "$scope" | grep -E '(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb|Cargo\.lock|poetry\.lock|uv\.lock|Pipfile\.lock|composer\.lock|Gemfile\.lock|go\.sum)$' | sed 's/^/  /'

section "Documentation"
echo "markdown files: $(git ls-files -- "$scope" | grep -ciE '\.(md|mdx|rst|adoc)$')"
echo "ADR-like files: $(git ls-files -- "$scope" | grep -ciE '(^|/)(adr|adrs|decisions)/[^/]+\.(md|rst)$')"

section "Possible secrets in tracked files (names only)"
git ls-files -- "$scope" | grep -iE '(^|/)(\.env(\.[^/]*)?|[^/]*\.(pem|key|p12|pfx|jks|keystore)|id_rsa[^/]*|credentials[^/]*|secrets?\.[^/]+)$' | grep -viE '\.(example|sample|template|dist)$|\.pub$' | head -n 20
echo "(end)"
