#!/usr/bin/env bash
# Pins an image tag in deployment/kustomization.yaml of lost-university/backend and
# pushes it to main, where Flux picks it up.
# Usage: deploy.sh <image> <tag>, run from a checkout of lost-university/backend
set -euo pipefail

image=$1
tag=$2

git config user.name "lost-university-release[bot]"
git config user.email "359380922+lost-university-release[bot]@users.noreply.github.com"

for attempt in 1 2 3 4 5; do
  # start from the latest main on every attempt, so a concurrent deploy of the other image is kept
  git fetch -q origin main
  git reset -q --hard origin/main

  current=$(image=$image yq '.images[] | select(.name == env(image)) | .newTag' deployment/kustomization.yaml)
  # a release whose tests finished after a newer one must not roll the newer one back
  if [ "$current" != main ] && [ "$(printf '%s\n' "$current" "$tag" | sort -V | tail -n1)" != "$tag" ]; then
    echo "$image is already at $current, not deploying $tag"
    exit 0
  fi

  (cd deployment && kustomize edit set image "$image:$tag")
  if git diff --quiet; then
    echo "$image is already at $tag"
    exit 0
  fi

  git commit -qam "Deploy ${image##*/} $tag"
  if git push -q origin HEAD:main; then
    echo "Deployed $image:$tag"
    exit 0
  fi
  sleep $((attempt * 5))
done

echo "Could not push the deploy commit after 5 attempts" >&2
exit 1
