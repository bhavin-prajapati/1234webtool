REPOSITORY_OWNER="bhavin-prajapati"
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-actions-provider"
PROJECT_ID="webtool-493515"
ISSUER_URI="https://token.actions.githubusercontent.com"

echo "Setting up Workload Identity Federation in GCP..."
echo "Project ID: ${PROJECT_ID}"
echo "Pool Name: ${POOL_NAME}"
echo "Provider Name: ${PROVIDER_NAME}"
echo "Issuer URI: ${ISSUER_URI}"

# Grant the necessary permissions to the user
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="user:bhavin.prajapati@gmail.com" \
  --role="roles/iam.workloadIdentityPoolAdmin"

gcloud projects add-iam-policy-binding 1234webtool \
    --member="user:bhavin.prajapati@gmail.com" \
    --role="roles/iam.workloadIdentityPoolAdmin"

# Create the Pool
gcloud iam workload-identity-pools create "${POOL_NAME}" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --display-name="${POOL_NAME}"

# Create the Provider
gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_NAME}" \
    --project="${PROJECT_ID}" \
    --location="global" \
    --workload-identity-pool="${POOL_NAME}" \
    --issuer-uri="${ISSUER_URI}" \
    --attribute-mapping="google.subject=assertion.sub" \
    --attribute-condition="assertion.repository_owner=='${REPOSITORY_OWNER}' && assertion.ref=='refs/heads/main'"
