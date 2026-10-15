# Cloudflare Pages build configuration
# Connect repo at: https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
#
# Build settings to enter in the Cloudflare Pages dashboard:
#   Framework preset:   Next.js (Static HTML Export)
#   Build command:      npm run build
#   Build output dir:   out
#   Root directory:     (leave empty — project is at repo root)
#
# Environment Variables (add in Cloudflare Pages → Settings → Environment Variables):
#   NEXT_PUBLIC_SUPABASE_URL      = https://telhpmszmasybazaifdq.supabase.co
#   NEXT_PUBLIC_SUPABASE_ANON_KEY = <your anon key — NOT service_role>
#
# ⚠️  Never add service_role key, DB password, or JWT secret to Cloudflare env vars
#     for a Pages (client-side) project.
