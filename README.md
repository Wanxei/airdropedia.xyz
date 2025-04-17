# Airdropedia

A directory of crypto airdrops, similar to Futurepedia but specifically for crypto airdrops.

## Features

- List of all submitted airdrop projects
- Add new airdrop projects
- Authentication with Supabase (Email + Google Auth)
- Donation page with Solana wallet address
- Modern, responsive design with TailwindCSS

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS
- Backend: Supabase (Database + Authentication)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create a new Supabase project
2. Create a table called `airdrops` with the following columns:
   - id (uuid, primary key)
   - project_name (text)
   - blockchain (text)
   - ticker (text)
   - cost (text)
   - funding (text)
   - steps (text)
   - media_url (text, nullable)
   - referral_link (text)
   - created_at (timestamp with time zone)

## Contributing

Feel free to submit issues and enhancement requests. 