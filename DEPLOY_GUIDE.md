# HabitFlow — Deploy to Vercel (Step-by-Step)

You don't need to understand code. Just follow these steps exactly.

---

## One-time setup (10 minutes)

### Step 1: Create accounts (if you don't have them)
1. Go to **github.com** → Sign up (free)
2. Go to **vercel.com** → Sign up with your GitHub account (free)

### Step 2: Install Git + Node.js on your laptop
- **Node.js**: Go to https://nodejs.org → Download the LTS version → Install it
- **Git**: Go to https://git-scm.com → Download → Install (accept all defaults)

To check both installed, open Terminal (Mac) or Command Prompt (Windows) and type:
```
node --version
git --version
```
Both should show a version number. If they do, you're set.

---

## Deploy the app (15 minutes)

### Step 3: Unzip the project
Unzip the `habitflow.zip` file you downloaded. You'll get a folder called `habitflow`.

### Step 4: Push to GitHub
Open Terminal/Command Prompt, then type these commands one by one:

```bash
cd path/to/habitflow
```
(Replace `path/to/habitflow` with the actual folder path. On Mac you can drag the folder into Terminal to paste the path.)

```bash
git init
git add .
git commit -m "HabitFlow initial commit"
```

Now go to **github.com** → Click the **+** icon (top right) → **New repository**:
- Name: `habitflow`
- Keep it Public or Private (either works)
- Do NOT check "Add a README"
- Click **Create repository**

GitHub will show you commands. Find the section that says **"push an existing repository"** and run those two lines. They look like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/habitflow.git
git branch -M main
git push -u origin main
```

### Step 5: Deploy on Vercel
1. Go to **vercel.com/new**
2. Click **Import** next to your `habitflow` repository
3. Vercel auto-detects it's a Vite project — don't change any settings
4. Click **Deploy**
5. Wait ~60 seconds

Done! Vercel gives you a URL like **habitflow-abc123.vercel.app**

---

## Share with friends

Just send them the Vercel URL. It works on any phone or laptop browser. Each person's habits are saved privately on their own device.

---

## Optional: Custom domain

If you ever want `habitflow.in` or similar:
1. Buy a domain on **Namecheap** or **GoDaddy** (~₹500–800/year for .in)
2. In Vercel dashboard → Your project → Settings → Domains → Add your domain
3. Vercel will tell you exactly which DNS records to set — just copy-paste them in your domain provider's settings

---

## Making changes later

Want to update the app? Just ask Claude to modify the code, replace the file, then:

```bash
cd path/to/habitflow
git add .
git commit -m "Updated the app"
git push
```

Vercel auto-deploys within 30 seconds. Your friends see the new version immediately.
