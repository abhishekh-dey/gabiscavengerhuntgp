// GABI Scavenger Hunt Configuration
// Edit this file to modify unique keys, riddles, and answers

export interface RiddleData {
  riddle: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-3)
}

// Contest Configuration
export const CONTEST_START_DATE = new Date('2025-07-08T17:00:00+05:30'); // July 8th, 2025 5:00 PM IST
export const RIDDLE_TIME_LIMIT = 45; // 90 seconds per riddle

// 10 Unique Keys - Each can only be used once
export const UNIQUE_KEYS = [
  'GABI2025HUNT20',
  'GABI2025HUNT27', 
  'GABI2025HUNT56',
  'GABI2025HUNT99',
  'GABI2025HUNT87',
  'GABI2025HUNT67',
  'GABI2025HUNT49',
  'GABI2025HUNT69',
  'GABI2025HUNT59',
  'GABI2025HUNT09'
];

// Riddles for each unique key (in same order as UNIQUE_KEYS)
export const RIDDLES: RiddleData[] = [
  {
    riddle: "Without a mouth, I share what I know,Connecting you to knowledge, to help your tasks flow. I look up answers when things aren't in sight,Which tool am I, that brings articles to light?",
    options: ["domainStatus", "getKnowledge", "m365Check", "advancedSupport"],
    correctAnswer: 1
  },
  {
    riddle: "When the path gets rocky and you need a hand, I guide you to experts who understand.What tool am I, that links you to others,To solve complex issues with our GoDaddy brothers?",
    options: ["retrieveDNS", "whoIsLookup", "advancedSupport", "ticketStatus"],
    correctAnswer: 2
  },
  {
    riddle: "I'm not a crystal ball, but I see the past, I tell the tale of support that's cast. I share the progress, the ups and downs, Which tool am I, that helps track tickets around?",
    options: ["domainStatus", "ticketStatus", "m365Check", "getKnowledge"],
    correctAnswer: 1
  },
  {
    riddle: "When a domain's fate is unclear, I provide insights, never fear. I reveal its journey, its current stand, What tool am I, that gives you a hand?",
    options: ["domainStatus", "whoIsLookup", "advancedSupport", "ticketStatus"],
    correctAnswer: 0
  },
  {
    riddle: "In the realm of purchases and refunds anew, Some things aren't easy and need a review. What process am I, that needs supervisor sight, To grant exceptions, when things aren't right?",
    options: ["OOPR Submission", "Chargeback Request", "Domain Transfer", "Ticket Creation"],
    correctAnswer: 0
  },
  {
    riddle: "I craft words with ease, for responses so neat, Templates that help, to make emails complete. Which capability am I, that saves you time, For messages sent in rhythm and rhyme?",
    options: ["Ticket Status Checker", "Email Template Generation", "DNS Management", "PHP"],
    correctAnswer: 1
  },
  {
    riddle: "Need a summary or a statement to declare, I compose with clarity, beyond compare. Which skill am I, that helps you explain, The essence of matters, with words so plain?",
    options: ["Statement Assistance", "Domain Status", "RetrieveDNS", "Two-Factor Authentication"],
    correctAnswer: 0
  },
  {
    riddle: "In the world of AI, I lend a hand, With tasks and queries, I understand. What ability am I, that aids your quest, With smart solutions that are truly the best?",
    options: ["Manual Lookup", "Quick Assistance", "Manual Escalation", "Direct Human Transfer"],
    correctAnswer: 1
  },
  {
    riddle: "I'm a cloud computing platform owned by Amazon. Developers use me to host websites and applications. GoDaddy uses me for all the back-end hosting zones, What am I?",
    options: ["Google Cloud", "Microsoft Azure", "AWS", "DigitalOcean"],
    correctAnswer: 2
  },
  {
    riddle: "I help you know what GoDaddy sells, From domains to hosting, I ring all the bells. What's my role?",
    options: ["Confluence", "Cheatsheet", "CRM Tools Dashboard", "Products Summary - CRM"],
    correctAnswer: 1
  }
];

// Admin password for purge functionality
// Change this to your desired password
export const PURGE_PASSWORD = 'hgjikmnerDmAn@27Lz9';

// Validation function to ensure configuration is correct
export const validateConfig = (): boolean => {
  if (UNIQUE_KEYS.length !== 10) {
    console.error('UNIQUE_KEYS must contain exactly 10 keys');
    return false;
  }
  
  if (RIDDLES.length !== 10) {
    console.error('RIDDLES must contain exactly 10 riddles');
    return false;
  }
  
  for (let i = 0; i < RIDDLES.length; i++) {
    const riddle = RIDDLES[i];
    if (riddle.options.length !== 4) {
      console.error(`Riddle ${i + 1} must have exactly 4 options`);
      return false;
    }
    if (riddle.correctAnswer < 0 || riddle.correctAnswer > 3) {
      console.error(`Riddle ${i + 1} correctAnswer must be between 0 and 3`);
      return false;
    }
  }
  
  if (!PURGE_PASSWORD || PURGE_PASSWORD.trim().length === 0) {
    console.error('PURGE_PASSWORD must be set');
    return false;
  }
  
  return true;
};