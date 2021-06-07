#!/bin/bash

# See:
# https://vercel.com/docs/platform/projects#ignored-build-step
# https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel
# https://github.com/vercel/vercel/issues/3166

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "dev"  ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi