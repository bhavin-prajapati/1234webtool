REPOSITORY_OWNER="bhavin-prajapati"
SERVICE_ACCOUNT_EMAIL="webtool-service-account@webtool-493515.iam.gserviceaccount.com"
PROJECT_ID="webtool-493515"
PROJECT_NUMBER="1053952427712"
ISSUER_URI="https://token.actions.githubusercontent.com"
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-actions-provider"
BUCKET_NAME="1234webtool"

echo "Setting up Workload Identity Federation in GCP..."
echo "Project ID: ${PROJECT_ID}"
echo "Pool Name: ${POOL_NAME}"
echo "Provider Name: ${PROVIDER_NAME}"
echo "Issuer URI: ${ISSUER_URI}"

# Grant the necessary permissions to the user
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="user:bhavin.prajapati@gmail.com" \
  --role="roles/iam.workloadIdentityPoolAdmin"

# Grant the Workload Identity User role to the service account
gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}"

# Grant the Service Account User role to the service account
gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
  --project="${PROJECT_ID}" \
  --role="roles/iam.serviceAccountUser" \
  --member=serviceAccount:${SERVICE_ACCOUNT_EMAIL}

# Grant the Service Account Token Creator role to the service account
gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
  --project="${PROJECT_ID}" \
  --role="roles/iam.serviceAccountTokenCreator" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_NAME}/*"

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

gcloud storage buckets create gs://${BUCKET_NAME} --location=US --project=${PROJECT_ID}

echo "Setup complete! You can now use the service account ${SERVICE_ACCOUNT_EMAIL} with Workload Identity Federation in your GitHub Actions workflow."