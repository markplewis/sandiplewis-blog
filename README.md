# Sandi Plewis' blog

This repository contains two separate applications:

1. A [Next.js](https://nextjs.org) application that serves as the front-end for [www.sandiplewis.com](https://www.sandiplewis.com).
2. A [Sanity](https://www.sanity.io)-powered CMS that provides content for the front-end application to consume, via the Sanity API.

This project uses [Vercel](https://vercel.com) for continuous integration and delivery (CI/CD).

### VSCode plugins

You'll want to install the following VSCode plugins:

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Installation

Duplicate the `.env.local.example` file and rename it to `.env.local`. Then, copy and paste the listed environment variables, tokens, IDs and secrets from your [Vercel project dashboard](https://vercel.com). See `.env.local.example` for more information.

Once the environment variables are ready, run the following command to install the project dependencies:

```bash
npm install
```

Because this project uses [Lerna](https://lerna.js.org/), running `npm install` in the root directory will subsequently trigger an `npm install` within the `studio` directory, so both applications' dependencies will be installed.

### Startup

You can fire up both the Next.js and Sanity Studio development servers via:

```bash
npm start
```

Or you can run each application separately via:

```bash
npm run next-start
npm run sanity-start
```

It's worth noting that, when running the applications locally, the `.env.local` file gets copied into the `studio` directory so that Sanity Studio share environment variables with the Next.js application.

The Next.js application will run at `http://localhost:3000` and Sanity Studio will run at `http://localhost:3333`.

### Production builds

Whenever a Vercel build is initiated, Vercel runs `npm run build`, which creates optimized production builds of both applications (see the script comments in `package.json` for more information). This generates a `.next` directory and a `public/studio` directory for the Next.js and Sanity Studio applications, respectively. Vercel then deploys these files to the production server.

If you run `npm run build` locally, you'll see the statically-built HTML files, etc. in the `.next/server/pages/` directory.

### Upgrading Sanity Studio

First, you'll need to globally install the [Sanity CLI](https://www.sanity.io/docs/cli):

```bash
# Install or upgrade Sanity CLI
npm install -g @sanity/cli
```

Then you'll be able to upgrade both of the projects as follows:

```bash
# Next.js project
sanity upgrade

# Sanity Studio project
cd studio
sanity upgrade
```

Unfortunately, [until this issue has been resolved](https://github.com/sanity-io/sanity/issues/1510), Sanity will generate a `yarn.lock` file, which will likely be out-of-sync with `package-lock.json`. So, after running `sanity upgrade`, you'll need to perform some cleanup:

```bash
# Remove superfluous yarn.lock files
rm yarn.lock
rm studio/yarn.lock

# Update package-lock.json to match package.json again
npm install
cd studio
npm install
```

Sanity release notes can be found here: https://github.com/sanity-io/sanity/releases

### Why use Lerna?

This repo contains two separate apps, both of which have dependencies that need to be installed during each Vercel build/deployment. One way to manage this would be to add the following script to the root-level `package.json` file:

```
"scripts": {
  "postinstall": "cd studio && npm install"
}
```

However, I've decided to manage this process via [Lerna](https://lerna.js.org/) instead. Lerna is often used for managing large monorepos, so it may be a bit overkill for this project, but its ability to manage and link cross-dependencies seems valuable enough to justify its use.

### CLI documentation

- Next.js: https://nextjs.org/docs/api-reference/cli
- Sanity: https://www.sanity.io/docs/cli
