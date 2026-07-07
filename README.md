# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URL` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/3.x/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
# Cloudflare Turnstile

The contact form already supports optional Cloudflare Turnstile.

To enable it, add:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_public_site_key
TURNSTILE_SECRET_KEY=your_private_secret_key
```

You also need to configure the allowed site hostnames in the client's Cloudflare Turnstile widget.

## Vercel setup

Recommended setup:

### Preview / testing on Vercel

Use Cloudflare Turnstile test keys in the Vercel `Preview` environment:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

These test keys work on any domain, including temporary preview URLs.

### Production

Use the real client keys only in the Vercel `Production` environment:

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_real_site_key
TURNSTILE_SECRET_KEY=your_real_secret_key
```

In the Cloudflare Turnstile widget, allow the real production hostnames, for example:

- `dentalsulyhan.com`
- `www.dentalsulyhan.com`

If needed, you can also add a staging hostname there later.

# Cloudflare R2

The project is prepared for optional Cloudflare R2 media storage.

If the following environment variables are set, the `media` collection will store files in R2 instead of local `public/media`:

```env
R2_BUCKET=your-bucket-name
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_REGION=auto
R2_PUBLIC_BASE_URL=https://cdn.example.com
```

Optional:

```env
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Notes:

- `R2_PUBLIC_BASE_URL` should be the public bucket URL or a custom CDN/domain that serves your media files.
- `R2_ENDPOINT` must be the account S3 API endpoint only, without bucket name in the path.
- If the full R2 env set is not present, the project continues to use local storage.
- No database migration is required for switching media storage.
## Deploy and migrations

Vercel should deploy application code only. Do not run Payload migrations automatically during `build` when the same Supabase database has also been used from local `payload dev`, because Payload may pause for confirmation after detecting dev-mode schema pushes.

Recommended workflow:

1. Create or update the Payload schema locally.
2. Create a migration if needed:
   `npm run migrate:create -- <name>`
3. Run migrations manually against the target Supabase database:
   `npm run migrate`
4. Verify the database and admin panel.
5. Push code and let Vercel deploy without running migrations in `build`.

Recommended database separation:

- Local development: separate database
- Vercel preview/staging: separate database
- Production/VPS: separate database

Avoid pointing local `payload dev` at the same database used by deployed environments.

## Plerdy

Plerdy can be enabled independently from GTM through an environment variable. This is useful when the client's GTM container is managed by someone else and you want to control Plerdy yourself.

Set one of these variables in the target environment:

```env
PLERDY_SCRIPT_URL=https://cdn.plerdy.com/your-plerdy-script.js
```

or

```env
NEXT_PUBLIC_PLERDY_SCRIPT_URL=https://cdn.plerdy.com/your-plerdy-script.js
```

Notes:

- Use only one Plerdy installation path: either direct script envs here or via GTM, not both.
- The script loads with `afterInteractive`.
- If GTM is present, Plerdy still loads separately and does not depend on the GTM container.
