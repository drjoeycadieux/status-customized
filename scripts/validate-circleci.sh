#!/bin/bash

# CircleCI Configuration Validator
# Run this script to validate your CircleCI config locally

echo "🔍 Validating CircleCI Configuration..."

# Check if CircleCI CLI is installed
if ! command -v circleci &> /dev/null; then
    echo "❌ CircleCI CLI not found. Install it with:"
    echo "   curl -fLSs https://raw.githubusercontent.com/CircleCI-Public/circleci-cli/master/install.sh | bash"
    echo "   Or visit: https://circleci.com/docs/local-cli/"
    exit 1
fi

# Validate configuration
echo "📋 Validating .circleci/config.yml..."
circleci config validate

if [ $? -eq 0 ]; then
    echo "✅ CircleCI configuration is valid!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect repository to CircleCI"
    echo "3. Set environment variables:"
    echo "   - NETLIFY_AUTH_TOKEN"
    echo "   - NETLIFY_SITE_ID"
    echo "4. Trigger first build"
else
    echo "❌ CircleCI configuration has errors. Please fix them before proceeding."
    exit 1
fi

echo ""
echo "📚 For detailed setup instructions, see: CIRCLECI_SETUP.md"
