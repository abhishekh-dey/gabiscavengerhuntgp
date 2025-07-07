# GABI Scavenger Hunt - Customization Guide

## 🔧 How to Customize Contest Settings, Unique Keys and Riddles

All game configuration is centralized in the `src/config/gameConfig.ts` file. This makes it easy to modify the contest without touching any other code.

### ⏰ Contest Start Date & Timer Settings

To customize when the contest begins and riddle time limits:

1. Open `src/config/gameConfig.ts`
2. Find the contest configuration section:

```typescript
// Contest Configuration
export const CONTEST_START_DATE = new Date('2025-07-08T17:00:00+05:30'); // July 8th, 2025 5:00 PM IST
export const RIDDLE_TIME_LIMIT = 90; // 90 seconds per riddle
```

**Contest Start Date:**
- Format: `'YYYY-MM-DDTHH:mm:ss+05:30'` (IST timezone)
- Example: `'2025-07-08T17:00:00+05:30'` = July 8th, 2025 at 5:00 PM IST
- The countdown timer will show until this date/time
- After this time, users can access the contest

**Riddle Time Limit:**
- Set in seconds (90 = 1 minute 30 seconds)
- Each riddle will have this time limit
- When time runs out, users can retry with the same key

### 📝 Editing Unique Keys

To customize the unique keys that participants will use:

1. Open `src/config/gameConfig.ts`
2. Find the `UNIQUE_KEYS` array
3. Replace the existing keys with your own:

```typescript
export const UNIQUE_KEYS = [
  'YOUR_CUSTOM_KEY_01',
  'YOUR_CUSTOM_KEY_02', 
  'YOUR_CUSTOM_KEY_03',
  'YOUR_CUSTOM_KEY_04',
  'YOUR_CUSTOM_KEY_05',
  'YOUR_CUSTOM_KEY_06',
  'YOUR_CUSTOM_KEY_07',
  'YOUR_CUSTOM_KEY_08',
  'YOUR_CUSTOM_KEY_09',
  'YOUR_CUSTOM_KEY_10'
];
```

**Important Rules:**
- You must have exactly **10 unique keys**
- Keys are case-insensitive (automatically converted to uppercase)
- Each key can only be used once after successful completion
- Keys can be reused if time runs out (no penalty for timeout)
- Make keys memorable but not easily guessable

### 🧩 Editing Riddles

To customize the riddles for each unique key:

1. Open `src/config/gameConfig.ts`
2. Find the `RIDDLES` array
3. Modify each riddle object:

```typescript
export const RIDDLES: RiddleData[] = [
  {
    riddle: "Your custom riddle question goes here...",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2 // Index of correct answer (0 = A, 1 = B, 2 = C, 3 = D)
  },
  // ... add 9 more riddles
];
```

**Important Rules:**
- You must have exactly **10 riddles** (one for each unique key)
- Each riddle must have exactly **4 multiple choice options**
- `correctAnswer` must be a number from 0-3:
  - `0` = First option (A)
  - `1` = Second option (B)
  - `2` = Third option (C)
  - `3` = Fourth option (D)

### 🔐 Setting Admin Password

To customize the admin password for purge functionality:

1. Open `src/config/gameConfig.ts`
2. Find the `PURGE_PASSWORD` constant
3. Replace with your desired password:

```typescript
export const PURGE_PASSWORD = 'YOUR_SECURE_PASSWORD';
```

**Important Notes:**
- Choose a strong, unique password
- This password is required to access the purge functionality
- The password is stored in plain text in the source code, so keep it secure
- Change this password before deploying to production

### 🔄 Key-Riddle Mapping

The riddles are mapped to unique keys by their position in the arrays:
- `UNIQUE_KEYS[0]` → `RIDDLES[0]`
- `UNIQUE_KEYS[1]` → `RIDDLES[1]`
- And so on...

### ⏱️ Timer Behavior

**Contest Countdown Timer:**
- Shows before contest start date
- Displays days, hours, minutes, seconds remaining
- Automatically switches to contest mode when time reaches zero

**Riddle Timer:**
- Each riddle has a 90-second timer (configurable)
- Timer shows progress bar and remaining time
- Changes color as time runs low (green → orange → red)
- When time expires:
  - Shows "Time's Up" animation
  - Key remains valid for retry
  - User can attempt the same riddle again
  - No penalty for timeout

**Key Usage Rules:**
- Keys are blocked only after wrong answers, not timeouts
- Timeouts allow unlimited retries with the same key
- Wrong answers block the key permanently
- Successful completion marks the key as used

### ✅ Validation

The system automatically validates your configuration when the app starts. Check the browser console for any errors if something isn't working.

Common validation errors:
- Wrong number of keys (must be exactly 10)
- Wrong number of riddles (must be exactly 10)
- Wrong number of options per riddle (must be exactly 4)
- Invalid `correctAnswer` value (must be 0, 1, 2, or 3)
- Missing or empty `PURGE_PASSWORD`
- Invalid contest start date format

### 🗑️ Purge Functionality

The Winners page now includes a secure "Purge" button that:
- Requires admin password authentication before proceeding
- Deletes all winner records from the database
- Resets all unique keys so they can be used again
- Clears all wrong attempt records
- Requires confirmation after password verification
- Is only visible when there are winners to purge

**Security Features:**
- Password prompt with show/hide toggle
- Clear error messages for incorrect passwords
- Two-step confirmation process (password + confirmation)
- Secure modal overlays that prevent accidental clicks

This is useful for:
- Testing the system
- Running multiple rounds of the contest
- Resetting everything for a new event
- Administrative maintenance

### 🚀 Quick Start Checklist

1. ✅ Set `CONTEST_START_DATE` to your desired contest start time
2. ✅ Adjust `RIDDLE_TIME_LIMIT` if needed (default: 90 seconds)
3. ✅ Edit `UNIQUE_KEYS` array with your 10 custom keys
4. ✅ Edit `RIDDLES` array with your 10 custom riddles
5. ✅ Set `PURGE_PASSWORD` to a secure admin password
6. ✅ Ensure each riddle has 4 options and correct answer index
7. ✅ Save the file and refresh your browser
8. ✅ Check browser console for any validation errors
9. ✅ Test the countdown timer (you can set a near-future date for testing)
10. ✅ Test with one of your unique keys after contest starts
11. ✅ Test the riddle timer functionality
12. ✅ Test the purge functionality with your admin password

### 📋 Example Configuration

Here's a complete example of a custom configuration:

```typescript
// Contest Configuration
export const CONTEST_START_DATE = new Date('2025-07-08T17:00:00+05:30'); // July 8th, 2025 5:00 PM IST
export const RIDDLE_TIME_LIMIT = 120; // 2 minutes per riddle

export const UNIQUE_KEYS = [
  'TECH2024QUEST01',
  'TECH2024QUEST02',
  'TECH2024QUEST03',
  'TECH2024QUEST04',
  'TECH2024QUEST05',
  'TECH2024QUEST06',
  'TECH2024QUEST07',
  'TECH2024QUEST08',
  'TECH2024QUEST09',
  'TECH2024QUEST10'
];

export const RIDDLES: RiddleData[] = [
  {
    riddle: "What programming language is known as the 'language of the web'?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1
  },
  {
    riddle: "Which company created the React JavaScript library?",
    options: ["Google", "Microsoft", "Facebook", "Apple"],
    correctAnswer: 2
  },
  // ... add 8 more riddles
];

export const PURGE_PASSWORD = 'MySecureAdminPassword2024!';
```

### 💡 Pro Tips

- **Test timing**: Set contest start date to a few minutes in the future for testing
- **Theme your keys**: Use a consistent naming pattern (e.g., `EVENT2024_01`, `EVENT2024_02`)
- **Difficulty progression**: Start with easier riddles and increase difficulty
- **Clear options**: Make sure answer choices are distinct and unambiguous
- **Appropriate timing**: 90 seconds is usually good, but adjust based on riddle complexity
- **Test thoroughly**: Try each key and riddle before the actual event
- **Backup**: Keep a copy of your configuration before making changes
- **Secure password**: Use a strong, unique password for purge functionality
- **Password management**: Consider using a password manager to generate and store the admin password
- **Time zones**: Make sure to set the correct timezone for your contest start date

### 🌍 Time Zone Reference

The contest start date uses IST (Indian Standard Time) by default. To use different time zones:

- **UTC**: `'2025-07-08T11:30:00Z'`
- **EST**: `'2025-07-08T06:30:00-05:00'`
- **PST**: `'2025-07-08T03:30:00-08:00'`
- **GMT**: `'2025-07-08T11:30:00+00:00'`
- **IST**: `'2025-07-08T17:00:00+05:30'` (default)

That's it! Your GABI Scavenger Hunt is now fully customizable with countdown timer, riddle timers, secure admin controls and ready for your event.