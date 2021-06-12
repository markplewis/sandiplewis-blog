# Sandi Plewis' blog

This repository contains two separate applications:

1. A [Next.js](https://nextjs.org) application that serves as the front-end for [www.sandiplewis.com](https://www.sandiplewis.com).
2. A [Sanity](https://www.sanity.io)-powered CMS that provides content for the front-end application to consume, via the Sanity API.

This project uses [Vercel](https://vercel.com) for continuous integration and delivery (CI/CD).

### Installation

Duplicate the `.env.local.example` file and rename it to `.env.local`. Then, copy and paste the listed environment variables, tokens, IDs and secrets from your [Sanity Studio dashboard](https://manage.sanity.io) and your [Vercel project dashboard](https://vercel.com).

Once those environment variables are ready, run the following commands to install each project's dependencies:

```bash
npm install

cd studio
npm install
```

### Startup

You can fire up both the Next.js and Sanity Studio development servers via:

```bash
npm start
```

Or you can run each application separately via:

```bash
npm run next-dev
npm run sanity-dev
```

The blog will run at `http://localhost:3000` and the Studio will run at `http://localhost:3333`.

### Upgrading Sanity Studio

First, you'll need to globally install the [Sanity CLI](https://www.sanity.io/docs/cli) (you can also upgrade the CLI via the same command):

```bash
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

Unfortunately, [until this issue has been resolved](https://github.com/sanity-io/sanity/issues/1510), Sanity will generate a `yarn.lock` file, which will likely be out-of-sync with `package-lock.json`. So, after running `sanity upgrade`, you'll need to perform some cleanup in each directory where `sanity upgrade` was run:

```bash
rm yarn.lock
rm -rf node_modules
npm install
```

Sanity release notes can be found here: https://github.com/sanity-io/sanity/releases

### Lerna

This repo contains two separate apps, both of which have dependencies that need to be installed during each Vercel build/deployment. One way to manage this would be to add the following script to the root-level `package.json` file:

```
"scripts": {
  "postinstall": "cd studio && npm install"
}
```

However, we've decided to manage the package installation portion of our build process via [Lerna](https://lerna.js.org/) instead. Lerna is often used for managing large monorepos, so it may be a bit overkill for this project, but its ability to manage and link cross-dependencies seems valuable enough to justify its use.

### CLI documentation

- Next.js: https://nextjs.org/docs/api-reference/cli
- Sanity: https://www.sanity.io/docs/cli