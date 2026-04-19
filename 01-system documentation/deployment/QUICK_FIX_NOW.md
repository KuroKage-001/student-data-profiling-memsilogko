# Quick Fix - Stop Failing Deployments

## The Problem
Seeding is too heavy for Render free tier deployment timeouts.

## The Solution
Disable seeding during deployment, use API endpoint after.

---

## Do This Right Now:

### 1. Disable Seeding (2 minutes)

Go to Render → Environment → Change:
```
SEED_DATABASE=false
```
Click Save → Wait for deployment → ✅ Will succeed!

### 2. Add API Seeding (2 minutes)

After step 1 succeeds, add these in Render → Environment:
```
ALLOW_API_SEEDING=true
SEEDING_SECRET_KEY=MyRandomSecret123
```
Click Save → Wait for deployment → ✅ Will succeed!

### 3. Seed via Browser (30 seconds)

Visit this URL in your browser:
```
https://student-data-profiling-memsilogko.onrender.com/api/seed?secret=MyRandomSecret123
```

✅ Done! Database is seeded.

---

## Why This Works

| Method | Timeout | Success Rate |
|--------|---------|--------------|
| During Deployment | 60 sec | ❌ Fails |
| Via API | No limit | ✅ Works |

---

## Check Your Data

After seeding, visit:
```
https://student-data-profiling-memsilogko.onrender.com/api/seed/status?secret=MyRandomSecret123
```

Should show:
```json
{
  "users": 100+,
  "students": 90+,
  "academic_records": 200+,
  "affiliations": 100+
}
```

---

**Start with Step 1 now!** Set `SEED_DATABASE=false` in Render.
