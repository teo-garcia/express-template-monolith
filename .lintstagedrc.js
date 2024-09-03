module.exports = {
  '**/*.{js,ts}': ['npx prettier --write', 'npm run lint --fix'],
}
