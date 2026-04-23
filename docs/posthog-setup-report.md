<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router project (Pokemon DB). PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and server-side via a shared `posthog-node` client in `src/libs/posthog-server.ts`. A reverse proxy was configured in `next.config.ts` to route PostHog requests through `/ingest/*`, reducing the chance of events being blocked by ad blockers. User identification is handled on both the client side (via `posthog.identify()` in `useLogin.ts`) and the server side (via `posthog.identify()` in the auth API routes). Users are de-identified on logout via `posthog.reset()`.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Server-side: fired when a new user successfully registers. Includes `email`. Also calls `posthog.identify()` to link the user. | `src/app/api/auth/sign-up/route.ts` |
| `user_logged_in` | Server-side: fired when a user successfully logs in. Includes `email`. Also calls `posthog.identify()`. Client-side `posthog.identify()` is also called in `useLogin.ts`. | `src/app/api/auth/login/route.ts`, `src/hooks/api/useLogin.ts` |
| `user_logged_out` | Server-side: fired when a user logs out. Uses `userId` as distinct ID. Client-side `posthog.reset()` is called in `useLogout.ts`. | `src/app/api/auth/logout/route.ts`, `src/hooks/api/useLogout.ts` |
| `bookmark_toggled` | Client-side: fired when a user clicks the bookmark (heart) icon on a Pokemon card. Includes `pokemon_id`, `pokemon_name`, and `bookmarked` (true/false). | `src/components/PokemonCard.tsx` |
| `ai_search_submitted` | Client-side: fired when a user submits a query to the AI Pokemon search form. Includes `query`. | `src/components/AISearchForm.tsx` |
| `speed_quiz_started` | Client-side: fired when a user starts a speed quiz game. Includes `difficulty` (EASY/MEDIUM/HARD). | `src/components/speed-quiz/SpeedQuizIdle.tsx` |
| `speed_quiz_completed` | Client-side: fired when a speed quiz game ends. Includes `difficulty`, `total_rounds`, and `correct_count`. | `src/app/speed-quiz/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/381075/dashboard/1500124
- **User Sign-ups Over Time** (line chart, last 30 days): https://us.posthog.com/project/381075/insights/pUawcpFi
- **Bookmark Engagement Trend** (line chart, last 30 days): https://us.posthog.com/project/381075/insights/NvufecM2
- **Sign-up to Login Conversion Funnel**: https://us.posthog.com/project/381075/insights/MrkbXocR
- **AI Search Usage Trend** (bar chart, last 30 days): https://us.posthog.com/project/381075/insights/Kcl5F2Wt
- **Speed Quiz: Start to Completion Funnel**: https://us.posthog.com/project/381075/insights/ym5pOm4W

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
