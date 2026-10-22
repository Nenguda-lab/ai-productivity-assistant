# AI Productivity assistant

Build AI Workplace Productivity Assistant, a modern, responsive SaaS web app with a clean purple-and-white theme, professional typography, rounded cards, subtle shadows, and a collapsible sidebar. Use React, Tailwind CSS, and Lucide icons.

Dashboard: Welcome header, productivity overview, quick actions, and navigation for Dashboard, Email Generator, Task Planner, Research Assistant, and Settings.

1. Smart Email Generator: Inputs for recipient, subject, purpose, key points, and tone (Formal, Friendly, Persuasive). Generate personalized, professional emails with editable output and Copy/Regenerate buttons.

2. AI Task Planner: Enter tasks, deadlines, priorities, and available hours. Generate realistic daily or weekly schedules with prioritized tasks, time blocks, and editable checklists.

3. AI Research Assistant: Accept a topic, pasted article, or URL. Generate structured summaries, key insights, recommendations, and action points. Clearly disclose when URLs cannot be accessed.

AI functionality: Use structured, task-specific prompts with an actual AI API integration point. Never present hardcoded templates as AI-generated results. Since this is a frontend-only app, provide an optional user-supplied API key configuration or clearly labeled demo mode. Never embed private API keys.

Technical requirements: No backend, database, or authentication. Use localStorage for saving preferences and editable results. Ensure all controls work, outputs are editable, and layouts adapt to mobile, tablet, and desktop.

Responsible AI: Display a disclaimer that AI outputs may contain errors and should be reviewed before professional use. Keep the UI accessible, intuitive, and production-quality.

Keep the implementation simple and suitable for a lovable free account with limited credits.

Do not over-engineer the application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/671a8255-d5f1-4cf6-a2d3-b06dcf960126).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
