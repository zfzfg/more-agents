# More Agents documentation sources

The guides in this directory document the More Agents fork. The current plugin UI is still named **Copilot**, so guides retain actual settings labels, commands, and storage paths. Start at [index.md](index.md).

The inherited static-site package is separate from the plugin build, with its own dependencies and lockfile. It loads each guide's opening heading as its page title and rewrites relative guide links for publication. The Markdown sources are the canonical fork documentation.

## Local site checks

Use Node.js 22.12 or newer for the documentation site. From this directory:

```sh
npm ci
npm test
npm run build
npm run preview
```

The build emits `dist/`. This is separate from the companion runtime requirement of Node.js 20 or later.

## Hosting status

More Agents has no documentation domain configured by this change. `docs.obsidiancopilot.com` belongs to the upstream project and does not publish this fork's guides. The inherited Astro configuration, navigation, and deployment metadata still refer to upstream; a fork-specific hosted site needs a separate configuration review before deployment.

If publishing a fork site later, use `docs` as its root, Astro as its framework, `npm run build` as its build command, and `dist` as its output. Configure a domain controlled by the fork maintainer and review all repository, support, canonical URL, and privacy links first.

Analytics is optional. Keep analytics environment variables unset for local builds and previews. A later production deployment requires its own privacy and analytics review; upstream policies and accounts do not automatically cover the fork. No site deployment is part of this documentation update.
