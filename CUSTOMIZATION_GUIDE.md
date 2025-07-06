# GABI Scavenger Hunt - Customization Guide

## 🔧 How to Customize Unique Keys and Riddles

All game configuration is centralized in the `src/config/gameConfig.ts` file. This makes it easy to modify the contest without touching any other code.

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
- Each key can only be used once
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

### ✅ Validation

The system automatically validates your configuration when the app starts. Check the browser console for any errors if something isn't working.

Common validation errors:
- Wrong number of keys (must be exactly 10)
- Wrong number of riddles (must be exactly 10)
- Wrong number of options per riddle (must be exactly 4)
- Invalid `correctAnswer` value (must be 0, 1, 2, or 3)
- Missing or empty `PURGE_PASSWORD`

### 📋 Example Configuration

Here's a complete example of a custom configuration:

```typescript
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

### 🗑️ Purge Functionality

The Winners page now includes a secure "Purge" button that:
- Requires admin password authentication before proceeding
- Deletes all winner records from the database
- Resets all unique keys so they can be used again
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

1. ✅ Edit `UNIQUE_KEYS` array with your 10 custom keys
2. ✅ Edit `RIDDLES` array with your 10 custom riddles
3. ✅ Set `PURGE_PASSWORD` to a secure admin password
4. ✅ Ensure each riddle has 4 options and correct answer index
5. ✅ Save the file and refresh your browser
6. ✅ Check browser console for any validation errors
7. ✅ Test with one of your unique keys
8. ✅ Test the purge functionality with your admin password

### 💡 Pro Tips

- **Theme your keys**: Use a consistent naming pattern (e.g., `EVENT2024_01`, `EVENT2024_02`)
- **Difficulty progression**: Start with easier riddles and increase difficulty
- **Clear options**: Make sure answer choices are distinct and unambiguous
- **Test thoroughly**: Try each key and riddle before the actual event
- **Backup**: Keep a copy of your configuration before making changes
- **Secure password**: Use a strong, unique password for purge functionality
- **Password management**: Consider using a password manager to generate and store the admin password

That's it! Your GABI Scavenger Hunt is now fully customizable with secure admin controls and ready for your event.