# Product Specification: "The Ton" (Working Title)

🌐 **Live App:** [https://the-ton.vercel.app/login](https://the-ton.vercel.app/login)  
📖 **Medium Story:** [I Built a Bridgerton-Inspired Social App for Friend Groups](https://medium.com/ai-deep-dives-and-developments-in-computer-science/i-built-a-bridgerton-inspired-social-app-for-friend-groups-and-you-can-use-it-b0803c60ec05?postPublishedType=repub)

## 🖋️ 1. The Soul & Purpose (The Vibe)

At its core, this app transforms the mundane daily group chat into an exclusive, highly anticipated ritual of connection and playful mystery. Dripping in Regency-era elegance—think heavy parchment, wax seals, and quill-penned aesthetics—the platform offers a secure, phone-verified haven for intimate circles of up to ten friends.

The mechanics are beautifully simple: throughout the day, friends secretly "spill the tea" by submitting anonymous, sweet, or slightly spicy whispers about one another. Then, like clockwork the next morning, an AI-powered Lady Whistledown weaves these raw observations into a single, cryptic, and uplifting society letter, delivering a daily dose of customized drama and elegant affirmation directly to the group.

---

## ⚙️ 2. Core Functional Requirements

### Authentication & Onboarding

* **Phone-Only Login:** Users enter their phone number and receive an SMS OTP to log in. No email or social logins allowed. This guarantees real humans and prevents burner accounts.
* **Profile Creation:**
  * **Required:** First Name (or "Moniker").
  * **Optional:** Bio (e.g., "A diamond of the first water") and Interests (e.g., "Matcha, reality TV, ignoring emails"). *The AI will secretly use these interests to add flavor to the letters.*
* **Backend Storage:** The phone number is securely stored for verification but strictly hidden from all other users.

### Group Mechanics ("The Drawing Room")

* **Creation:** A user creates a group and optionally selects a dynamic (Office Friends, Family, College, Besties).
* **The Limit:** Strictly capped at 10 members per group to maintain intimacy and artificial scarcity.
* **Joining:** Invite-only via a unique, shareable deep-link. There is no public search function.

### The Input ("Spilling the Tea" / "Whispers")

* **The Action:** Users open the app and submit a "Whisper" about themselves, their day, or someone in the group.
* **Anonymity:** The front-end guarantees the group will not know who wrote the whisper.
* **Simplicity:** A plain text box with a strict character limit (e.g., 280 characters).

---

## 🌍 3. Time Zone & Delivery Logic (The 7:00 AM Rule)

Since friends might live in different time zones (e.g., London and New York), the letter delivery must feel magical and perfectly timed for everyone's morning routine.

* **The Cutoff:** The group operates on a "Home Time Zone" (set by the person who creates the group). At midnight (Home Time), the "Whisper Box" locks for the day.
* **The AI Generation:** At 12:01 AM (Home Time), the AI generates **one single letter** for the entire group using that day's whispers.
* **The Local Delivery:** The app schedules the push notification and unlocks the letter at **7:00 AM strictly in the user's local time zone**.

---

## 🛡️ 4. Guardrails & Trust

* **Accountable Anonymity:** Whispers are anonymous to the friends, but the database logs exactly which phone number submitted which Whisper.
* **AI Vibe-Check (Pre-computation):** Before a Whisper is saved, it passes through a fast AI filter. If it detects hate speech, severe bullying, or explicit content, it rejects the input with: *"Dearest reader, one must keep their words fit for polite society. Please revise."*
* **Anti-Spam Limit:** Users are limited to submitting a maximum of 3 Whispers per day per group.

---

## 🎨 5. Design Requirements & Page Templates

The color palette: wisteria purple, duck egg blue, and gold. Classic serif fonts (Garamond or Playfair Display).

### A. The Home Page (The Foyer)
* Countdown timer to local 7:00 AM delivery
* Active Groups as "Calling Cards"
* Floating quill action button to "Spill the Tea"

### B. The Profile Page (The Calling Card)
* 19th-century calling card design
* Circular cameo frame avatar
* Name, Bio, Interests

### C. The Group Page (The Drawing Room)
* Group Name + dynamic label
* Horizontal scroll of member cameo avatars (max 10)
* "Invite a Confidant" button (hidden at 10/10)
* Letter archive as sealed envelopes with dates

### D. The Whisper Page (The Writing Desk)
* Parchment texture background
* Large text area with placeholder text
* "Seal & Send" button

### E. The Lady Whistledown Letter Template
* Wax seal breaking animation reveal
* Sweeping cursive script header; readable serif body
* Structure: Salutation → Hook → Tea → Sign-off
* **PDF Download** capability
