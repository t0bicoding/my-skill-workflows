#!/usr/bin/env bash
# Collects refactoring hotspots for /refactor-audit.
# Read-only: uses git and the tracked files only; writes nothing, needs no network.
# Usage: bash collect-hotspots.sh [path] [months]
#   path    narrows the scope (default: whole repo)
#   months  history window for churn and coupling (default: 12)

set -u

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Not a git repository."; exit 1; }
cd "$root" || exit 1
scope="${1:-.}"
months="${2:-12}"
if [ -z "$(git ls-files -- "$scope" | head -n 1)" ]; then
  echo "No tracked files under '$scope'."; exit 1
fi

# Files that are generated, vendored, migration history or throwaway: never own code to refactor.
GENERATED='(^|/)(package-lock[.]json|npm-shrinkwrap[.]json|yarn[.]lock|pnpm-lock[.]yaml|bun[.]lockb|Cargo[.]lock|poetry[.]lock|uv[.]lock|Pipfile[.]lock|composer[.]lock|Gemfile[.]lock|go[.]sum|packages[.]lock[.]json)$|[.]min[.](js|css)$|[.]map$|(^|/)(dist|build|out|vendor|third_party|node_modules|[.]venv|venv|target|coverage|migrations|alembic/versions|prototypes?|prototypen)/|[.]generated[.]|_pb2[.]py$|[.]d[.]ts$'
TESTPATH='(^|/)(tests?|__tests__|spec|specs|e2e|testing)/|[.](test|spec)[.][^/]+$|(^|/)test_[^/]+[.]py$|_test[.](py|go|rs|exs?)$|Tests?[.](cs|java|kt|swift)$|(^|/)conftest[.]py$'
CODEEXT='^(py|pyi|js|jsx|mjs|cjs|ts|tsx|mts|cts|vue|svelte|rs|go|java|kt|kts|scala|cs|fs|vb|c|h|cc|cpp|cxx|hpp|hh|m|mm|swift|rb|php|dart|lua|ex|exs|erl|clj|hs|ml|r|jl|pl|sh|bash|ps1|psm1|sql)$'
# Commits touching more own code files than this are mass edits (rename, format, upgrade): left out of churn and coupling.
# Docs, configs and lockfiles don't count towards it, so a feature commit with its tickets stays in.
BIGCOMMIT=30
# A pair of files counts as coupled from this many shared commits on.
MINSHARED=3
TOP=25

section() { printf '\n## %s\n' "$1"; }

section "Scope"
echo "root: $(basename "$root")"
echo "scope: $scope"
echo "history window: last $months months"
echo "head: $(git log -1 --format='%h %as %s' 2>/dev/null)"
if [ "$(git rev-parse --is-shallow-repository 2>/dev/null)" = "true" ]; then
  echo "WARNING: shallow clone — churn and coupling are incomplete."
fi

# Own code files: "<lines> <prod|test> <path>".
files=$(git grep -I -c '' -- "$scope" ':(exclude).claude/**' 2>/dev/null | awk -v gen="$GENERATED" -v test="$TESTPATH" -v code="$CODEEXT" '{
    n=$0; sub(/.*:/, "", n); p=substr($0, 1, length($0)-length(n)-1)
    if (p ~ gen) next
    f=p; sub(/.*\//, "", f); if (index(f, ".") == 0) next
    e=tolower(f); sub(/.*[.]/, "", e); if (e !~ code) next
    print n, (p ~ test ? "test" : "prod"), p }')
if [ -z "$files" ]; then echo "No own code files under '$scope'."; exit 1; fi

# Commit log as "@@<hash>" lines followed by the touched paths.
log=$(git log --since="$months months ago" --no-merges --format='@@%h' --name-only -- "$scope")

# One pass: churn per file and shared commits per pair. Emits tagged rows:
#   F <score> <lines> <changes> <kind> <path>     per own code file (score = lines x changes)
#   P <shared> <degree%> <a> TAB <b>              per coupled pair
#   S <key> <value>                               summary counts
rows=$(awk -v big="$BIGCOMMIT" -v minshared="$MINSHARED" '
  function flush(   i, j, a, b, k) {
    if (tot > big) { skipped++ }
    else if (tot > 0) {
      counted++
      for (i = 1; i <= m; i++) ch[cur[i]]++
      for (i = 1; i <= m; i++) for (j = i + 1; j <= m; j++) {
        a = cur[i]; b = cur[j]
        if (a > b) { k = a; a = b; b = k }
        pair[a "\t" b]++
      }
    }
    m = 0; tot = 0
  }
  FNR == NR {
    n = $1; k = $2; p = substr($0, length($1) + length($2) + 3)
    lines[p] = n; kind[p] = k; next
  }
  /^@@/ { flush(); next }
  $0 in lines { tot++; cur[++m] = $0 }
  END {
    flush()
    for (p in lines) printf "F %d %d %d %s %s\n", lines[p] * (ch[p] + 0), lines[p], ch[p] + 0, kind[p], p
    for (k in pair) if (pair[k] >= minshared) {
      split(k, ab, "\t"); lo = ch[ab[1]] < ch[ab[2]] ? ch[ab[1]] : ch[ab[2]]
      printf "P %d %d %s\n", pair[k], (lo > 0 ? int(100 * pair[k] / lo) : 0), k
    }
    printf "S counted %d\nS skipped %d\n", counted, skipped
  }' <(printf '%s\n' "$files") <(printf '%s\n' "$log"))

# Path of an F row: everything after its first five fields.
FPATH='function fpath() { return substr($0, length($1)+length($2)+length($3)+length($4)+length($5)+6) }'

field() { printf '%s\n' "$rows" | awk -v k="$1" '$1 == "S" && $2 == k { print $3 }'; }
echo "commits in window: $(field counted) counted, $(field skipped) mass edits over $BIGCOMMIT files left out"

section "Size distribution (lines per own code file)"
for kind in prod test; do
  printf '%s\n' "$files" | awk -v k="$kind" '$2 == k { print $1 }' | sort -n | awk -v k="$kind" '
    function at(q,   i) { i = int(NR * q); if (i < 1) i = 1; return v[i] }
    { v[NR] = $1 }
    END { if (NR > 0) printf "%s: %d files  median: %d  p90: %d  p99: %d  max: %d\n", k, NR, at(0.5), at(0.9), at(0.99), v[NR] }'
done

section "Hotspots: lines x changes in window, top $TOP (score lines changes kind path)"
printf '%s\n' "$rows" | awk "$FPATH"' $1 == "F" && $4 > 0 { printf "%d %d %d %s %s\n", $2, $3, $4, $5, fpath() }' \
  | sort -rn | head -n "$TOP" \
  | awk '{ printf "%8d %6d %4d  %-4s %s\n", $1, $2, $3, $4, substr($0, length($1)+length($2)+length($3)+length($4)+5) }'

section "Largest production files untouched in window (size without change cost — usually no finding)"
printf '%s\n' "$rows" | awk "$FPATH"' $1 == "F" && $4 == 0 && $5 == "prod" { print $3, fpath() }' \
  | sort -rn | head -n 10 | awk '{ printf "%6d  %s\n", $1, substr($0, length($1)+2) }'

section "Change coupling: pairs changed together in >= $MINSHARED commits, top $TOP (shared degree% a <-> b)"
echo "(degree = shared commits / changes of the less-changed file; a file with its own test is expected)"
printf '%s\n' "$rows" | awk '$1 == "P" { print substr($0, 3) }' | sort -k1,1rn -k2,2rn | head -n "$TOP" \
  | awk -F'\t' '{ split($1, h, " "); a = substr($1, length(h[1])+length(h[2])+3); printf "%4d %4d%%  %s <-> %s\n", h[1], h[2], a, $2 }'

section "Test fit for the top production hotspots"
echo "(per file: lines/changes; tests by name with lines/changes; tests by co-change with shared commits."
echo " Both are heuristics: no match is not proof that no test covers the file)"
printf '%s\n' "$rows" | awk "$FPATH"'
  function stem(p,   f) {
    f = p; sub(/.*\//, "", f); f = tolower(f)
    sub(/[.][^.]*$/, "", f)
    sub(/[.](test|spec)$/, "", f); sub(/^test_/, "", f); sub(/_test$/, "", f); sub(/tests?$/, "", f)
    gsub(/[-_.]/, "", f)
    return f
  }
  $1 == "F" {
    p = fpath()
    if ($5 == "test") { s = stem(p); byname[s] = byname[s] sprintf("|%s (%d/%d)", p, $3, $4); istest[p] = 1 }
    else if ($4 > 0) { n++; prod[n] = p; score[n] = $2; label[n] = sprintf("%s (%d/%d)", p, $3, $4) }
    next
  }
  $1 == "P" {
    split($0, ab, "\t"); split(ab[1], h, " ")
    a = substr(ab[1], length(h[1])+length(h[2])+length(h[3])+4); b = ab[2]
    paired[a] = paired[a] sprintf("|%s\t%d", b, h[2]); paired[b] = paired[b] sprintf("|%s\t%d", a, h[2])
  }
  END {
    for (i = 1; i <= n; i++) {
      p = prod[i]; co = ""
      m = split(paired[p], q, "|")
      for (j = 2; j <= m; j++) { split(q[j], r, "\t"); if (r[1] in istest) co = co sprintf("|%s (%d shared)", r[1], r[2]) }
      printf "%d\t%s\t%s\t%s\n", score[i], label[i], byname[stem(p)], co
    }
  }' | sort -rn | head -n 15 | awk -F'\t' '{
    print $2
    if ($3 == "" && $4 == "") { print "      -> no test by name or co-change"; next }
    n = split($3, a, "|"); for (i = 2; i <= n && i <= 4; i++) print "      name:      " a[i]
    n = split($4, a, "|"); for (i = 2; i <= n && i <= 4; i++) print "      co-change: " a[i]
  }'

section "Largest test files (lines changes path)"
printf '%s\n' "$rows" | awk "$FPATH"' $1 == "F" && $5 == "test" { print $3, $4, fpath() }' \
  | sort -rn | head -n 10 | awk '{ printf "%6d %4d  %s\n", $1, $2, substr($0, length($1)+length($2)+3) }'

echo
echo "(end)"
