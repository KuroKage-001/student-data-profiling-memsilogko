# Faculty Seeder Duplicate Email Fix

## Issue
When running the faculty seeders, duplicate email addresses were being generated, causing a database constraint violation error:

```
SQLSTATE[23000]: Integrity constraint violation: 1062 
Duplicate entry 'john.mitchell.cs@ccs.edu.ph' for key 'faculty_email_unique'
```

## Root Cause
The random name generation could create duplicate first name + last name combinations, resulting in duplicate email addresses since emails are generated from names.

## Solution
Implemented email uniqueness tracking within each seeder to prevent duplicates:

### Changes Made

#### 1. CS Faculty Seeder
**File**: `server/database/seeders/CSFacultySeeder.php`

Added:
- `$usedEmails` array to track generated emails
- Do-while loop to ensure unique email generation
- Fallback mechanism: adds counter suffix after 50 attempts

```php
$usedEmails = []; // Track used emails to prevent duplicates

// Generate unique name and email combination
$attempts = 0;
do {
    $firstName = $firstNames[array_rand($firstNames)];
    $lastName = $lastNames[array_rand($lastNames)];
    $emailBase = strtolower($firstName . '.' . $lastName);
    $email = $emailBase . '.cs@ccs.edu.ph';
    $attempts++;
    
    // If we've tried too many times, add a number suffix
    if ($attempts > 50) {
        $email = $emailBase . $counter . '.cs@ccs.edu.ph';
        break;
    }
} while (in_array($email, $usedEmails));

$usedEmails[] = $email;
```

#### 2. IT Faculty Seeder
**File**: `server/database/seeders/ITFacultySeeder.php`

Applied the same fix with IT-specific email format:
```php
$email = $emailBase . '@ccs.edu.ph';
// Fallback: $emailBase . $counter . '@ccs.edu.ph'
```

## How It Works

1. **Email Tracking**: Each seeder maintains a `$usedEmails` array
2. **Uniqueness Check**: Before using an email, checks if it already exists in the array
3. **Retry Logic**: If duplicate found, generates a new random name combination
4. **Fallback**: After 50 attempts, adds the faculty counter as a suffix to guarantee uniqueness
5. **Registration**: Once unique email is confirmed, adds it to the tracking array

## Benefits

- ✅ Prevents duplicate email errors
- ✅ Maintains realistic names (no numbers in most cases)
- ✅ Guaranteed uniqueness with fallback mechanism
- ✅ No database queries needed for checking
- ✅ Fast execution with in-memory tracking

## Testing

### Clear Existing Data (Optional)
```bash
cd server
php artisan migrate:fresh
```

### Run Seeders
```bash
# Run all seeders
php artisan db:seed

# Or run individually
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
```

### Expected Output
```
✅ Successfully seeded 100 IT Faculty members
   - Professors: 15
   - Associate Professors: 25
   - Assistant Professors: 35
   - Instructors: 20
   - Lecturers: 5
   - Active: ~85, On Leave: ~10, Inactive: ~5

✅ Successfully seeded 100 CS Faculty members
   - Professors: 15
   - Associate Professors: 25
   - Assistant Professors: 35
   - Instructors: 20
   - Lecturers: 5
   - Active: ~85, On Leave: ~10, Inactive: ~5
```

## Verification

After seeding, verify no duplicates exist:

```sql
-- Check for duplicate emails in faculty table
SELECT email, COUNT(*) as count 
FROM faculty 
GROUP BY email 
HAVING count > 1;

-- Should return 0 rows
```

## Alternative Solutions Considered

### 1. Sequential Numbering
- **Approach**: Use counter in all emails (e.g., john.mitchell1.cs@ccs.edu.ph)
- **Rejected**: Less realistic, all emails would have numbers

### 2. Database Check
- **Approach**: Query database before inserting each record
- **Rejected**: Slower performance, unnecessary database calls

### 3. UUID in Email
- **Approach**: Add UUID to email addresses
- **Rejected**: Unrealistic email format

### 4. Larger Name Pool
- **Approach**: Increase first/last name arrays
- **Rejected**: Still possible to get duplicates with 100 records

## Notes

- The fix is applied per seeder run, not across multiple runs
- If you run the same seeder twice without clearing data, you'll still get duplicate errors (expected behavior)
- Use `migrate:fresh` before re-seeding to avoid this
- The 50-attempt threshold is configurable if needed
- Email uniqueness is enforced at database level with `faculty_email_unique` constraint

## Files Modified

1. `server/database/seeders/ITFacultySeeder.php` - Added email uniqueness tracking
2. `server/database/seeders/CSFacultySeeder.php` - Added email uniqueness tracking

---

**Issue**: Duplicate email constraint violation  
**Status**: Fixed ✅  
**Date**: April 9, 2026  
**Impact**: All faculty seeders now run without errors
