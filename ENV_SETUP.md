# Environment Configuration Templates

## For Local Development

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## For Production (Vercel)

After deploying your backend, add this environment variable in Vercel dashboard:

**Variable Name**: `NEXT_PUBLIC_API_URL`
**Value**: `https://your-backend-url.onrender.com` (replace with actual URL)

Or create `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Then commit and push to trigger Vercel redeploy.
