# Agent Guide

This repo is a Discord bot that bridges messages to Maestro agents via `maestro-cli`.

## Development workflow

- Install deps: `npm install`
- Run in dev: `npm run dev`
- Deploy slash commands: `npm run deploy-commands`
- Production: `npm run build` then `npm start`

## Project notes

- Source lives in `src/` and is TypeScript.
- Env vars are defined in `.env.example`. Keep it in sync with `.env` usage.
- Avoid adding new runtime dependencies unless necessary.
- If you add new slash commands, update the deploy script and README.

## Expectations for changes

- Follow existing patterns in `src/` before introducing new abstractions.
- Keep changes minimal and focused.
- Update docs when behavior or setup changes.
