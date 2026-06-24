import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI client successfully initialized with API key.");
  } catch (error) {
    console.error("Failed to initialize Gemini AI client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY environment variable found. Server running in Demo/Local Template fallback mode.");
}

// ---------------- Fallback Static Data Templates ----------------
const FALLBACK_QUEST_TEMPLATES: Record<string, any> = {
  learning: {
    mainQuest: "Become a Frontend Master",
    category: "Learning",
    narrativeIntro: "Greetings, Apprentice! You have crossed the threshold of the Grand Web Library. To master the arts of React and Modern Web Craft, you must build solid foundational blocks. Keep your focus high, and your coding fingers ready!",
    quests: [
      {
        id: "fb_learn_1",
        title: "Master HTML5 & Semantic Elements",
        difficulty: "Easy",
        xp: 20,
        completed: false,
        description: "Study structural tags to lay down the skeleton of great web creations."
      },
      {
        id: "fb_learn_2",
        title: "Conquer CSS Grid and Flexbox",
        difficulty: "Easy",
        xp: 25,
        completed: false,
        description: "Control the space of your visual layout with modern layouts."
      },
      {
        id: "fb_learn_3",
        title: "Learn JavaScript ES6+ Features",
        difficulty: "Medium",
        xp: 50,
        completed: false,
        description: "Unlock arrow functions, destructuring, promises, and module imports."
      },
      {
        id: "fb_learn_4",
        title: "Build and State Manage a React App",
        difficulty: "Hard",
        xp: 80,
        completed: false,
        description: "Implement interactive interfaces using hooks like useState and useEffect."
      }
    ],
    bossBattle: {
      title: "Build and Deploy a Full Portfolio Site",
      description: "Combine all your lessons to craft and publish a stunning web portfolio site showcasing interactive widgets and custom animations.",
      xp: 500,
      badge: "Frontend Hero",
      bossName: "The Redux Kraken",
      bossHealth: 100,
      maxBossHealth: 100,
      completed: false
    }
  },
  fitness: {
    mainQuest: "Awaken Your Physical Peak",
    category: "Fitness",
    narrativeIntro: "Welcome to the training grounds, Warrior! Your physical vessel is the ultimate instrument of your life's quests. This campaign will build physical endurance, muscle memory, and indomitable consistency.",
    quests: [
      {
        id: "fb_fit_1",
        title: "Complete a 20-minute morning stretch routine",
        difficulty: "Easy",
        xp: 20,
        completed: false,
        description: "Prepare your muscles and boost initial circulation for the daily climb."
      },
      {
        id: "fb_fit_2",
        title: "Run a continuous 2-kilometer sprint",
        difficulty: "Easy",
        xp: 30,
        completed: false,
        description: "Train your cardio vessel and unlock higher endurance parameters."
      },
      {
        id: "fb_fit_3",
        title: "Engage in a 40-minute resistance training",
        difficulty: "Medium",
        xp: 60,
        completed: false,
        description: "Build deep tissue strength with push-ups, squats, or free weight exercises."
      },
      {
        id: "fb_fit_4",
        title: "Track your meals and stay hydrated for 5 straight days",
        difficulty: "Hard",
        xp: 90,
        completed: false,
        description: "Fuel the biological machine with optimal nutrients and clean hydration."
      }
    ],
    bossBattle: {
      title: "Run a full 10K Endurance Trial",
      description: "Push past your perceived biological limitations to complete a legendary 10-kilometer run.",
      xp: 500,
      badge: "Titan of Speed",
      bossName: "The Gravity Titan",
      bossHealth: 100,
      maxBossHealth: 100,
      completed: false
    }
  },
  productivity: {
    mainQuest: "Banish the Procrastination Specter",
    category: "Productivity",
    narrativeIntro: "Greetings, Tactician. The greatest adversary you will face is not external; it is the silent thief of time known as Procrastination. To reclaim control of your domain, you must optimize your focus rituals and routines.",
    quests: [
      {
        id: "fb_prod_1",
        title: "Create a distraction-free physical workspace",
        difficulty: "Easy",
        xp: 20,
        completed: false,
        description: "Clear your desk, silence non-essential notifications, and establish your sanctuary."
      },
      {
        id: "fb_prod_2",
        title: "Complete 2 complete Pomodoro deep-work blocks",
        difficulty: "Easy",
        xp: 30,
        completed: false,
        description: "Execute 25 minutes of complete concentration followed by a 5-minute break."
      },
      {
        id: "fb_prod_3",
        title: "Organize your upcoming week in an Eisenhower Matrix",
        difficulty: "Medium",
        xp: 50,
        completed: false,
        description: "Classify tasks by urgency and importance to plan your actions with precision."
      },
      {
        id: "fb_prod_4",
        title: "Maintain a flawless 3-day deep-focus journal",
        difficulty: "Hard",
        xp: 80,
        completed: false,
        description: "Log your daily achievements and note distraction patterns to optimize."
      }
    ],
    bossBattle: {
      title: "Achieve an uninterrupted 4-hour Deep Focus Block",
      description: "Ascend to high focus flow state by completing a legendary 4-hour productivity raid.",
      xp: 500,
      badge: "Focus Sovereign",
      bossName: "The Procrastination Golem",
      bossHealth: 100,
      maxBossHealth: 100,
      completed: false
    }
  },
  career: {
    mainQuest: "Ascend the Career Citadel",
    category: "Career",
    narrativeIntro: "Welcome, Candidate! The Professional Arena is highly competitive, but with structural preparation, you can unlock rare positions and secure vast bounties. Let's hone your professional arsenal.",
    quests: [
      {
        id: "fb_car_1",
        title: "Update and clean your master Resume structure",
        difficulty: "Easy",
        xp: 25,
        completed: false,
        description: "Format your accomplishments into impact-driven metrics and action verbs."
      },
      {
        id: "fb_car_2",
        title: "Polishing your professional online profile",
        difficulty: "Easy",
        xp: 30,
        completed: false,
        description: "Write an engaging headline and bio, and add your latest achievements."
      },
      {
        id: "fb_car_3",
        title: "Practice 5 common behavioral interview questions",
        difficulty: "Medium",
        xp: 50,
        completed: false,
        description: "Use the STAR technique (Situation, Task, Action, Result) to state your victories."
      },
      {
        id: "fb_car_4",
        title: "Submit applications to 3 high-tier target organizations",
        difficulty: "Hard",
        xp: 90,
        completed: false,
        description: "Tailor your cover letters and transmit your credentials to the recruiters."
      }
    ],
    bossBattle: {
      title: "Conquer a Mock Technical/Behavioral Trial",
      description: "Engage in a grueling mock interview simulation representing the final trial of recruiter screening.",
      xp: 500,
      badge: "Elite Profession",
      bossName: "The Corporate Chimera",
      bossHealth: 100,
      maxBossHealth: 100,
      completed: false
    }
  },
  personal: {
    mainQuest: "Awaken Your Social & Inner Sovereignty",
    category: "Personal Development",
    narrativeIntro: "Greetings, Philosopher. True growth stems from within and reflects in how you communicate with the outside world. This questline will expand your social footprint, refine public speaking, and build inner mindfulness.",
    quests: [
      {
        id: "fb_pers_1",
        title: "Practice a 10-minute mindfulness breathing loop",
        difficulty: "Easy",
        xp: 20,
        completed: false,
        description: "Anchor your thoughts and reduce cortisol levels for ultimate focus."
      },
      {
        id: "fb_pers_2",
        title: "Read 2 chapters of a non-fiction growth book",
        difficulty: "Easy",
        xp: 25,
        completed: false,
        description: "Absorb structured paradigms from historical thinkers and modern researchers."
      },
      {
        id: "fb_pers_3",
        title: "Engage in an active conversation with a new colleague",
        difficulty: "Medium",
        xp: 50,
        completed: false,
        description: "Break the ice, apply empathetic listening, and discover shared interests."
      },
      {
        id: "fb_pers_4",
        title: "Prepare and practice a 3-minute pitch about a passion",
        difficulty: "Hard",
        xp: 80,
        completed: false,
        description: "Refine vocal tone, body language, and pacing to captivate any audience."
      }
    ],
    bossBattle: {
      title: "Speak in front of a live group of 5+ people",
      description: "Face down the ancient fear of public evaluation by speaking eloquently before a live audience.",
      xp: 500,
      badge: "Sovereign Speaker",
      bossName: "The Anxiety Phantom",
      bossHealth: 100,
      maxBossHealth: 100,
      completed: false
    }
  }
};

// Return a smart generic fallback template when keywords do not match cleanly
function getFallbackTemplate(goal: string, category: string): any {
  const catKey = (category || "").toLowerCase();
  let baseTemplate;

  if (catKey.includes("learn") || catKey.includes("acad") || catKey.includes("study") || catKey.includes("math")) {
    baseTemplate = FALLBACK_QUEST_TEMPLATES.learning;
  } else if (catKey.includes("fit") || catKey.includes("health") || catKey.includes("weight") || catKey.includes("run")) {
    baseTemplate = FALLBACK_QUEST_TEMPLATES.fitness;
  } else if (catKey.includes("career") || catKey.includes("job") || catKey.includes("place") || catKey.includes("work")) {
    baseTemplate = FALLBACK_QUEST_TEMPLATES.career;
  } else if (catKey.includes("personal") || catKey.includes("social") || catKey.includes("mind") || catKey.includes("speak")) {
    baseTemplate = FALLBACK_QUEST_TEMPLATES.personal;
  } else {
    baseTemplate = FALLBACK_QUEST_TEMPLATES.productivity;
  }

  // Deep clone and customize titles based on goal
  const customized = JSON.parse(JSON.stringify(baseTemplate));
  customized.mainQuest = goal.length > 50 ? goal.substring(0, 47) + "..." : goal;
  
  // Try to sprinkle keywords in the quests
  if (goal) {
    const words = goal.split(" ").filter(w => w.length > 4);
    if (words.length > 0) {
      const keyword = words[0];
      customized.quests[0].title = `${customized.quests[0].title} (Focus: ${keyword})`;
      customized.quests[customized.quests.length - 1].title = `Master your goal: ${goal.substring(0, 30)}`;
    }
  }
  
  return customized;
}

// ---------------- API ENDPOINTS ----------------

// 1. Generate Quests
app.post("/api/quest/generate", async (req, res) => {
  const { goal, category } = req.body;
  if (!goal) {
    return res.status(400).json({ error: "Goal is required to generate quests." });
  }

  console.log(`Generating quests for goal: "${goal}" (Category: ${category})`);

  // If Gemini client is not initialized, use localized high-quality templates
  if (!ai) {
    const data = getFallbackTemplate(goal, category);
    return res.json({
      ...data,
      isDemo: true,
      message: "Using offline Quest Weaver templates. To experience tailored generative AI quests, configure your GEMINI_API_KEY in the Secrets panel!"
    });
  }

  try {
    const prompt = `You are the ultimate RPG Game Master and Productivity Oracle for LifeQuest AI.
The user has specified a real-life goal: "${goal}" within the category: "${category}".
Create an epic, highly customized RPG-themed Questline.
The user's goal should be translated into exactly 4 to 5 sub-quests that are sequential, highly action-oriented, realistic, and productive.
Also create an epic "bossBattle" representing the ultimate milestone of this goal.

Ensure the narrative is highly immersive, styled like an RPG fantasy narrator, and encouraging.

Return the JSON strictly matching this schema. Avoid any extra keys:
- mainQuest: A short epic title of the goal
- category: "${category}" or a suitable classification
- narrativeIntro: Welcome narration from the RPG Game Master
- quests: Array of objects with properties:
  - id: string (unique)
  - title: string
  - difficulty: string ("Easy", "Medium", "Hard")
  - xp: integer (rewards: Easy is 15-25 XP, Medium is 35-50 XP, Hard is 70-90 XP)
  - description: string (brief helpful guidance)
- bossBattle: Object representing the final project/milestone:
  - title: string
  - description: string (detailed final challenge, e.g. "Create and publish a public project")
  - xp: integer (always 300 to 500 XP)
  - badge: string (epic title of the badge unlocked, e.g. "Frontend Hero", "Iron Runner")
  - bossName: string (creative boss name related to the goal, e.g., "The Redux Kraken", "The Procrastination Behemoth")
  - bossHealth: integer (always 100)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainQuest: { type: Type.STRING },
            category: { type: Type.STRING },
            narrativeIntro: { type: Type.STRING },
            quests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  xp: { type: Type.INTEGER },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "difficulty", "xp", "description"]
              }
            },
            bossBattle: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                xp: { type: Type.INTEGER },
                badge: { type: Type.STRING },
                bossName: { type: Type.STRING },
                bossHealth: { type: Type.INTEGER }
              },
              required: ["title", "description", "xp", "badge", "bossName", "bossHealth"]
            }
          },
          required: ["mainQuest", "category", "narrativeIntro", "quests", "bossBattle"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty text returned from Gemini API");
    }

    const questData = JSON.parse(text.trim());
    return res.json({
      ...questData,
      isDemo: false
    });
  } catch (err: any) {
    console.error("Gemini quest generation error:", err);
    // Graceful degradation
    const fallbackData = getFallbackTemplate(goal, category);
    return res.json({
      ...fallbackData,
      isDemo: true,
      error: err.message,
      message: "The Quest Weaver experienced an ether disturbance. Reverting to highly precise localized template spells!"
    });
  }
});

// 2. RPG Game Master Comment on Action
app.post("/api/quest/comment", async (req, res) => {
  const { action, detail, characterState } = req.body;
  
  const stateStr = characterState ? `Level ${characterState.level} ${characterState.rank || "Adventurer"} (XP: ${characterState.xp}, Streak: ${characterState.streak} days)` : "an aspiring Adventurer";

  console.log(`Requesting Game Master feedback for action: "${action}" - "${detail}"`);

  if (!ai) {
    // Return high-quality pre-baked RPG dialogue
    let defaultMsg = `The stars align, Adventurer! You have completed a valiant task: "${detail}". Your power grows, and the guild watches your progress with great anticipation. Keep pushing forward!`;
    if (action === "complete_boss") {
      defaultMsg = `Huzzah! The ground trembles as you land the final blow. You have defeated the mighty Boss and unlocked your legendary badge! Level up is imminent. The tavern songs will sing of your consistency!`;
    } else if (action === "streak_gained") {
      defaultMsg = `Unbelievable focus! Your flame burns brighter with a ${detail} streak. The fire within lights your dark paths and strikes fear into the heart of Procrastination!`;
    } else if (action === "level_up") {
      defaultMsg = `⚡ A brilliant light envelops your character! You have reached a new height of capability. The Guild grants you new titles and authority. Forge ahead, hero!`;
    }
    return res.json({ message: defaultMsg, isDemo: true });
  }

  try {
    const prompt = `You are the RPG Game Master narrator in LifeQuest AI. The user is currently: ${stateStr}.
They just performed this action in real life: "${action}" (Additional details: "${detail}").

Provide a highly thematic, immersive, 2 to 3 sentence RPG game-style narration commenting on this victory.
Instead of dry productivity jargon, use terms like: 'Adventurer', 'The Tavern of Focus', 'spells of learning', 'biological stats', 'guild tasks', 'mana', 'exp'.
Ensure it is warm, epic, and highly motivational! Keep it brief (under 80 words total).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    const text = response.text;
    return res.json({
      message: text ? text.trim() : "The guild registers your achievements. Excellent progress, Adventurer!",
      isDemo: false
    });
  } catch (err: any) {
    console.error("Gemini commenting error:", err);
    return res.json({
      message: `The Guild honors your achievement: "${detail}". Your character feels a surge of ambient energy!`,
      isDemo: true
    });
  }
});

// 3. Adaptive Quest Generation
app.post("/api/quest/adapt", async (req, res) => {
  const { currentQuests, performance, goal } = req.body;
  
  if (!ai) {
    // Generate a quick localized adaptation
    const narrativeMessage = performance === "advancing" 
      ? "Sensing your immense potential and swift sword-arm, the Guild has upgraded your active campaign with more challenging, higher-XP training runs!" 
      : "The path is steep, and every champion stumbles. The Game Master has adjusted the quest parameters, reducing friction to help you rebuild momentum!";
    
    // Modify quests slightly
    const modifiedQuests = (currentQuests || []).map((q: any) => {
      if (performance === "advancing") {
        return {
          ...q,
          title: q.title + " (Elite Level)",
          xp: Math.round(q.xp * 1.3),
          description: "Earn extra bounty for completing this advanced variant of your training."
        };
      } else {
        return {
          ...q,
          title: "Simplified: " + q.title.replace("Simplified: ", ""),
          xp: Math.max(15, Math.round(q.xp * 0.75)),
          description: "A focused, bite-sized step. Rebuild your streak with simple execution!"
        };
      }
    });

    return res.json({
      narrativeMessage,
      newQuests: modifiedQuests,
      isDemo: true
    });
  }

  try {
    const prompt = `You are the RPG Game Master for LifeQuest AI.
The user is working on the goal: "${goal}".
Their current sub-quests are: ${JSON.stringify(currentQuests)}.
Their current progress is: "${performance === "advancing" ? "Succeeding rapidly (needs harder, advanced, higher-XP challenges)" : "Struggling or falling behind (needs smaller, bite-sized, easier tasks to build confidence and reduce procrastination)"}".

Please adapt their active quests. Provide:
1. narrativeMessage: A thematic, highly encouraging explanation of why fate/the-game-master has altered their quests (RPG themed, e.g., 'The Guild rewards your quick mind...' or 'The Master adjusts your training weights...').
2. newQuests: An array of adapted quests that replace the incomplete ones.
Ensure the returned JSON exactly matches this schema:
- narrativeMessage: string
- newQuests: array of objects with properties:
  - id: string (keep original id or make new ones)
  - title: string
  - difficulty: string ("Easy", "Medium", "Hard")
  - xp: integer
  - description: string
  - completed: boolean (must be false)
Keep it highly engaging and perfectly aligned with the user's progress.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrativeMessage: { type: Type.STRING },
            newQuests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  xp: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN }
                },
                required: ["id", "title", "difficulty", "xp", "description", "completed"]
              }
            }
          },
          required: ["narrativeMessage", "newQuests"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini API during quest adaptation");
    return res.json({
      ...JSON.parse(text.trim()),
      isDemo: false
    });
  } catch (err: any) {
    console.error("Gemini quest adaptation error:", err);
    return res.json({
      narrativeMessage: "The Game Master weaves an protection charm, adapting your trials to match your active energy parameters.",
      newQuests: currentQuests,
      isDemo: true
    });
  }
});

// 4. Daily AI Challenge generator
app.post("/api/quest/daily-challenge", async (req, res) => {
  const { category } = req.body;
  const categories = ["Learning", "Fitness", "Productivity", "Career", "Personal Development"];
  const chosenCategory = category || categories[Math.floor(Math.random() * categories.length)];

  if (!ai) {
    const defaultChallenges: Record<string, any> = {
      "Learning": { title: "Scroll of Wisdom Reading", description: "Read any educational article or documentation page for 15 minutes.", xp: 30 },
      "Fitness": { title: "Cardio Speed Run", description: "Perform 50 jumping jacks and a 1-minute plank challenge.", xp: 35 },
      "Productivity": { title: "The Sanctuary Cleanse", description: "Dedicate 10 minutes to decluttering your desk and prioritizing tomorrow's quest.", xp: 25 },
      "Career": { title: "Guild Liaison Update", description: "Browse or bookmark 3 potential jobs or networking prospects online.", xp: 30 },
      "Personal Development": { title: "The Breathing Ritual", description: "Engage in 5 minutes of focused silent meditation or gratitude journaling.", xp: 25 }
    };

    const chal = defaultChallenges[chosenCategory] || defaultChallenges["Productivity"];
    return res.json({
      ...chal,
      category: chosenCategory,
      isDemo: true
    });
  }

  try {
    const prompt = `You are the RPG Game Master for LifeQuest AI.
Generate a creative, highly interactive, RPG-themed 'Daily Challenge' for the category: "${chosenCategory}".
This should be a simple, bite-sized daily task that can be completed in under 20 minutes in real life.
E.g., for Learning: "Read standard documentation or educational chapter for 15 minutes."
Give it an exciting, epic RPG-themed name!

Return JSON matching this schema:
- title: string (epic name of daily challenge)
- description: string (realistic action statement)
- xp: integer (always between 25 and 40 XP)
- category: string ("${chosenCategory}")`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            xp: { type: Type.INTEGER },
            category: { type: Type.STRING }
          },
          required: ["title", "description", "xp", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty daily challenge response");
    return res.json({
      ...JSON.parse(text.trim()),
      isDemo: false
    });
  } catch (err: any) {
    console.error("Gemini daily challenge error:", err);
    return res.json({
      title: "The Sanctuary Cleanse",
      description: "Dedicate 10 minutes to clean your workspace and schedule your key quest.",
      xp: 25,
      category: "Productivity",
      isDemo: true
    });
  }
});

// ---------------- VITE DEV SERVER / STATIC SERVING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA Fallback for client side routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifeQuest AI server running on http://localhost:${PORT}`);
  });
}

startServer();
