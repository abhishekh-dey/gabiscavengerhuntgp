# GABI Scavenger Hunt

A beautiful, interactive scavenger hunt website with riddles, unique keys, and winner tracking.

## Features

- 🔑 **Unique Key System**: 10 unique keys that can only be used once
- 🧩 **Custom Riddles**: Each key unlocks a unique riddle
- 🎉 **Animations & Confetti**: Beautiful animations and celebration effects
- 🏆 **Winner Tracking**: Database storage and display of all winners
- 📱 **Responsive Design**: Works perfectly on all devices
- 🎨 **Modern UI**: Glassmorphism design with gradient backgrounds

## Configuration

### Editing Unique Keys and Riddles

All game configuration is centralized in `src/config/gameConfig.ts`. This file contains:

#### Unique Keys
```typescript
export const UNIQUE_KEYS = [
  'GABI2024HUNT01',
  'GABI2024HUNT02', 
  // ... add up to 10 keys
];
```

#### Riddles
```typescript
export const RIDDLES: RiddleData[] = [
  {
    riddle: "Your riddle question here...",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2 // Index of correct answer (0-3)
  },
  // ... add riddles for each key
];
```

### Important Rules

1. **Exactly 10 Keys**: You must have exactly 10 unique keys
2. **Exactly 10 Riddles**: You must have exactly 10 riddles (one for each key)
3. **4 Options Each**: Each riddle must have exactly 4 multiple choice options
4. **Correct Answer Index**: Use 0-3 to indicate which option is correct (0 = first option, 3 = last option)

### Validation

The system automatically validates your configuration on startup. Check the browser console for any configuration errors.

## Database Setup

This project uses Supabase for data storage. You'll need to:

1. Click the "Connect to Supabase" button in the top right
2. The database schema will be automatically created with these tables:
   - `used_keys`: Tracks which unique keys have been used
   - `winners`: Stores information about successful participants

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AnimatedBackground.tsx
│   ├── ConfettiEffect.tsx
│   ├── KeyEntry.tsx
│   ├── RiddleForm.tsx
│   └── WinnersList.tsx
├── config/
│   └── gameConfig.ts    # 🔧 EDIT THIS FILE for keys and riddles
├── lib/
│   └── supabase.ts      # Database configuration
└── App.tsx              # Main application component
```

## Customization Tips

### Adding More Keys/Riddles
1. Edit `UNIQUE_KEYS` array in `gameConfig.ts`
2. Add corresponding riddles to `RIDDLES` array
3. Ensure arrays have the same length

### Changing Styling
- Colors and animations can be modified in the component files
- Tailwind CSS classes are used throughout
- Gradient backgrounds and glassmorphism effects in `App.tsx`

### Modifying Database Schema
- Database migrations are in `supabase/migrations/`
- Current schema supports the contest requirements
- Add new migrations for schema changes

## Security Notes

- Each unique key can only be used once
- Database has Row Level Security (RLS) enabled
- Public read/write access is allowed for contest participation
- No authentication required (by design for easy participation)

## Support

For configuration help or issues:
1. Check browser console for validation errors
2. Verify Supabase connection
3. Ensure all arrays in `gameConfig.ts` have correct lengths