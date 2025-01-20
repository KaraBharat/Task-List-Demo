This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tools used to build this project

- Next.js
- React
- Tanstack Query
- Zustand
- Shadcn UI
- TypeScript
- TailwindCSS
- HonoJs
- Zod
- DrizzleORM
- Neon
- PostgreSQL

- ⚠️ No authentication and user management added yet

## Getting Started

First, run the development server:

## Create account and database on Neon

Go to [Neon](https://neon.tech/) and create an account.

Create a new project and select the free tier.

## Install Package

```bash
npm install
```

## Set database connection URL

Create a `.env` file and set the database connection URL.

```bash
DATABASE_URL='postgresql://xxxxxxx-xxxxxx:xxxxxxx-xxxxxx@xxxxxxx-xxxxxx.db.neon.tech/xxxxxxx-xxxxxx?sslmode=require'
```

## Generate Database

```bash
npm run db:generate
```

## Migrate Database

```bash
npm run db:migrate
```

## Run Studio

```bash
npm run db:studio
```

## Run Server

```bash
npm run dev
```

## Database sample data script path

```bash
src/database/Sample-Data-Script/
```

## Run sample data script using Neon SQL Editor

Go to [Neon Studio](https://studio.neon.tech/) and run the sample data script.

```sql
\i src/database/Sample-Data-Script/sample-data-script.sql
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/bharatkara)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
