# LifeQuest AI ⚔️🛡️

**LifeQuest AI** is a fully-featured, full-stack RPG productivity companion that gamifies real-world endeavors. By translating daily struggles, fitness commitments, learning targets, and career campaigns into structured questlines, levels, stats, and colossal boss fights, LifeQuest AI turns self-improvement into an immersive fantasy campaign.

Designed with a high-contrast, high-density tactical RPG aesthetic, it provides players with an incredibly polished interface to forge their habits, log their achievements, and slay their procrastination.

---

## 🎨 Visual & Aesthetic Identity
LifeQuest AI embraces a custom **Tactical Dark "High Density" RPG Theme**:
* **The Canvas**: Deep obsidian dark fields (`#0a0b0e` and `#14161c`) accented with subtle gold borders (`#facc15`), providing a warm, tactile, premium aesthetic.
* **Typography**: Elegant editorial headlines using **Playfair Display** paired with precise, high-density monospaced data indicators utilizing **JetBrains Mono**.
* **Micro-interactions**: Hand-crafted layout transitions and state reactions powered by `motion/react`, complete with status bands, subtle background glows, and screen tremors upon battling campaign bosses.

---

## ⚔️ Key Features
1. **Avatar Awakening (Character Creation)**: Forge your heroic name and choose from five customized RPG classes (Warrior, Mage, Rogue, Cleric, Scholar) with distinctive base attributes (Strength, Intelligence, Agility, Focus, Harmony).
2. **AI Quest Weaver**: Powered server-side by the **Gemini 2.5 Flash** model, input any real-world goal (e.g. *"Lose 5kg in 3 months with daily workouts"*) and watch the AI Game Master organize it into structured, category-specific questlines with custom difficulties.
3. **Colossal Boss Encounters**: Every grand campaign culminates in an epic boss battle. Slay your ultimate challenges by completing all sub-quests to break the boss's shields and deliver the vanquishing blow!
4. **Adaptive Campaign Difficulty**: Ask the Oracle to automatically adapt your quests based on whether you are *struggling* or *advancing*, tailoring the experience dynamically.
5. **Guild Hall Daily Challenges**: Walk the tavern to take on randomized, community-minded daily challenges that offer bonus experience points.
6. **Ethereal Adventure Journal**: A real-time chronological log of your deeds, victories, and milestones, acting as a historical tracker of your personal expansion.
7. **Interactive Milestones & Level-ups**: Unlock beautiful achievement badges and experience stateful Level-Up animations when crossing crucial XP thresholds.

---

## 🛠️ Tech Stack & Architecture
* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, and Motion (`motion/react`) for smooth, immersive animations.
* **Backend**: Express server (`server.ts`) acting as a secure proxy to interact with Google's Gemini API, keeping API keys securely cached server-side.
* **Compilation & Bundling**: Custom unified build system compiling the Express middleware and React assets seamlessly via `esbuild` to guarantee ultra-fast, zero-overhead production starts.

---

## 📂 Project Structure
```text
├── metadata.json           # Application settings and platform permissions
├── server.ts               # Full-stack Express backend with Vite middleware
├── package.json            # Managed scripts and npm package declarations
├── index.html              # HTML entrypoint
└── src/
    ├── main.tsx            # Main client-side rendering entry point
    ├── App.tsx             # Central application logic, state manager, and UI
    ├── index.css           # Global custom CSS and Tailwind RPG definitions
    └── assets/             # Vector icons and visual templates
```

---

*“Your willpower grows, and the focus spells cast are of immense magnitude!”*  
Enjoy your campaign with **LifeQuest AI**!


# You can View the deployed project right here through the link

https://lifequest-ai-21571711207.asia-southeast1.run.app
