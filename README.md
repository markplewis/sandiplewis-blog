# Next.js blog with comment section

This is a demo of how to add a simple comment section to blog post using [Next.js](https://nextjs.org), [Sanity.io](https://www.sanity.io), and [Vercel](https://vercel.com).

### Running the front-end

Rename the `.env.test` file to `.env` and store the environment variables that Next and Sanity will use to pull data from the Sanity API. You can get or create the tokens, ids, and secrets from [manage.sanity.io](https://manage.sanity.io).

Once those env variables are ready, you can run the following commands to get Next's development server up and running:

```bash
npm install

# Run the frontend
npm run dev

# Run the Studio
npm run start:sanity
```

The blog will be running at `http://localhost:3000`, the Studio will run at `http://localhost:3333`.

### Upgrading Sanity Studio

Sanity release notes can be found here: https://github.com/sanity-io/sanity/releases

You'll first need to globally install the [Sanity CLI](https://www.sanity.io/docs/cli) (you can also upgrade the CLI via the same command):

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

Unfortunately, [until this issue has been resolved](https://github.com/sanity-io/sanity/issues/1510), Sanity will generate a `yarn.lock` file, which will likely be out-of-sync with `package-lock.json`. So, after running `sanity upgrade`, you'll need to perform some cleanup, as follows:

```bash
rm yarn.lock
rm -rf node_modules
npm install
```

This should be done in any directory where `sanity upgrade` was run.

### CLI documentation

- Next.js: https://nextjs.org/docs/api-reference/cli
- Sanity: https://www.sanity.io/docs/cli

### Lerna

This repo contains two separate apps, both with dependencies that need to be installed during each Vercel build/deployment. One way to manage this would be to add the following script to the root-level `package.json` file:

```
"scripts": {
  "postinstall": "cd studio && npm install",
}
```

However, we've decided to manage this part of our build process via [Lerna](https://lerna.js.org/) instead. Lerna is often used for managing large monorepos, so it may be a bit overkill for this project, but its ability to manage and link cross-dependencies seems valuable enough to justify its use.