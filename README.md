# Hitagi 🦀

A "modern" Vue 3 client for LANraragi

## Requirements
- Node.js 18+
- LANraragi Instances (v0.9.0+)

## Deploy

1. Run `npm install` to install dependencies
2. Run `npm run build` to create a production build with SSR.
3. Run `node .output/server/index.mjs` to run the server.

### Replacing built-in web UI

You can also replace the built-in WebUI of LRR by replacing every routing in LANraragi with single index route
and make a new Perl Modules that will render the index.html provided.

Instead of running `npm run build` you should run `npm run generate` for this.

## Acknowledgments

The crab logo is a modified version created originally by Sofia Maya: [Crab SVG Vector](https://www.svgrepo.com/svg/489684/crab)

🦀
