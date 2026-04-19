# Seed Database Without Shell Access (Render Free Tier)

## Two Solutions Available

### Solution 1: Enable Seeding via Deployment (Simple)
### Solution 2: Use API Seeding Endpoint (Flexible) ⭐ Recommended

---

## Solution 1: Enable Seeding via Deployment

### Step 1: Enable Seeding in Render

1. Go to Render dashboard: https://dashboard.render.com
2. Click on your service: `student-data-profiling-memsilogko`
3. Click **"Environment"** tab on the left
4. Find `SEED_DATABASE` variable
5. Change value from `false` to `true`
6. Click **"Save Changes"**

This will automatically trigger a new deployment.

### Step 2: Monitor Deployment

1. Go to **"Logs"** tab
2. Watch for these messages:
   ```
   Running database seeders...
   ⚠️  Events already exist, skipping Event seeding.
   Successfully created X academic records!
   Successfully created X student affiliations!
   ```

3. Wait for: `Your service is live 🎉`

**Expected time:** 3-5 minutes (includes seeding)

### Step 3: Disable Seeding (Important!)

After seeding completes:

1. Go back to **"Environment"** tab
2. Change `SEED_DATABASE` back to `false`
3. Click **"Save Changes"**

This prevents seeders from running on every future deployment.

---

## Solution 2: API Seeding Endpoint ⭐ Recommended

This allows you to seed the database anytime via a secure URL, without redeploying!

### Step 1: Set Environment Variables in Render

Add these two new variables:

1. Go to Render dashboard → Environment tab
2. Add:
   ```
   ALLOW_API_SEEDING=true
   SEEDING_SECRET_KEY=your-random-secret-key-here-12345
   ```
   
   **Important:** Replace `your-random-secret-key-here-12345` with a strong random string!
   
3. Click **"Save Changes"** (will trigger deployment)

### Step 2: Wait for Deployment

Wait for the service to redeploy (~2-3 minutes)

### Step 3: Use the Seeding Endpoints

Once deployed, you can use these URLs in your browser:

#### A. Check Database Status
```
https://student-data-profiling-memsilogko.onrender.com/api/seed/status?secret=your-random-secret-key-here-12345
```

**Response:**
```json
{
  "success": true,
  "message": "Database statistics retrieved successfully.",
  "data": {
    "users": 0,
    "admins": 0,
    "faculty": 0,
    "students": 0,
    "events": 0,
    "academic_records": 0,
    "affiliations": 0
  }
}
```

#### B. List Available Seeders
```
https://student-data-profiling-memsilogko.onrender.com/api/seed/list?secret=your-random-secret-key-here-12345
```

**Response:**
```json
{
  "success": true,
  "message": "Available seeders",
  "seeders": {
    "Database\\Seeders\\DatabaseSeeder": "Full database seed (all tables)",
    "Database\\Seeders\\ProductionSeeder": "Essential accounts only (fast)",
    "Database\\Seeders\\StudentAccountSeeder": "Student accounts only",
    ...
  }
}
```

#### C. Seed Full Database
```
https://student-data-profiling-memsilogko.onrender.com/api/seed?secret=your-random-secret-key-here-12345
```

**Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully!",
  "output": "Seeding output here...",
  "seeder": "Database\\Seeders\\DatabaseSeeder"
}
```

#### D. Seed Specific Seeder
```
https://student-data-profiling-memsilogko.onrender.com/api/seed?secret=your-random-secret-key-here-12345&seeder=Database\Seeders\ProductionSeeder
```

### Step 4: Verify Data

After seeding, check status again:
```
https://student-data-profiling-memsilogko.onrender.com/api/seed/status?secret=your-random-secret-key-here-12345
```

Should show counts > 0 for all tables.

### Step 5: Disable API Seeding (Optional, for security)

After seeding is complete, you can disable the API:

1. Go to Render → Environment
2. Change `ALLOW_API_SEEDING=false`
3. Save

---

## Quick Reference

### Available Seeders

| Seeder | Description | Speed |
|--------|-------------|-------|
| `Database\Seeders\DatabaseSeeder` | Everything | 2-3 min |
| `Database\Seeders\ProductionSeeder` | Essential accounts only | 5 sec |
| `Database\Seeders\EventSeeder` | Events only | 10 sec |
| `Database\Seeders\StudentAccountSeeder` | Students only | 30 sec |
| `Database\Seeders\StudentAcademicRecordSeeder` | Academic records | 1 min |
| `Database\Seeders\StudentAffiliationSeeder` | Affiliations | 30 sec |

### URL Template

```
https://student-data-profiling-memsilogko.onrender.com/api/seed?secret=YOUR_SECRET&seeder=SEEDER_CLASS
```

Replace:
- `YOUR_SECRET` with your `SEEDING_SECRET_KEY`
- `SEEDER_CLASS` with seeder from table above (optional)

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Keep your secret key private** - Don't share it publicly
2. **Use a strong random string** - At least 32 characters
3. **Disable after seeding** - Set `ALLOW_API_SEEDING=false` when done
4. **Don't commit secrets** - Never add secret to git

### Generate a Strong Secret

Use one of these methods:

**Online:**
- https://randomkeygen.com/ (use "Fort Knox Passwords")

**Command line:**
```bash
# Linux/Mac
openssl rand -base64 32

# Or
head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32
```

---

## Troubleshooting

### "API seeding is disabled"
- Set `ALLOW_API_SEEDING=true` in Render environment
- Redeploy and try again

### "Invalid or missing secret key"
- Check your `SEEDING_SECRET_KEY` in Render environment
- Make sure you're using the exact same value in the URL
- URL encode special characters if needed

### "Seeding failed"
- Check the error message in the response
- Verify database connection is working
- Check Render logs for detailed errors

### Seeding takes too long
- Use specific seeders instead of DatabaseSeeder
- Start with ProductionSeeder (fastest)
- Then add data incrementally

---

## Recommended Workflow

1. **Deploy with API seeding enabled**
   ```
   ALLOW_API_SEEDING=true
   SEEDING_SECRET_KEY=your-strong-secret-here
   SEED_DATABASE=false
   ```

2. **Check current status**
   ```
   /api/seed/status?secret=...
   ```

3. **Seed essential accounts first**
   ```
   /api/seed?secret=...&seeder=Database\Seeders\ProductionSeeder
   ```

4. **Seed full database**
   ```
   /api/seed?secret=...
   ```

5. **Verify data**
   ```
   /api/seed/status?secret=...
   ```

6. **Disable API seeding**
   ```
   ALLOW_API_SEEDING=false
   ```

---

## Files Created

- ✅ `server/app/Http/Controllers/SeedController.php` - Seeding controller
- ✅ `server/routes/api.php` - Added seeding routes
- ✅ `server/.env.example` - Added seeding variables

**Ready to use after next deployment!**

