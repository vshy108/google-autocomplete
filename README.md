# React Web Application with Google Places Integration

This web application is built using React, TypeScript, and Material Design with Vite. It integrates with the Google Places service to retrieve search results and saves them as local records. Users can mark local records as favorites, at which point they are treated as remote records. Remote records can be updated with new favorite flags or deleted. Pagination and sorting functionality is enabled for managing records efficiently. Redux sagas are tested with redux-saga-test-plan.

## Getting Started

Follow these steps to set up and run the web application locally:

1. Create a `.env` file based on the provided `.env.sample`. Make sure to provide values for `VITE_GOOGLE_MAPS_API_KEY` for your Google Maps API key, `VITE_SERVER_URL` for the API server URL and `VITE_SERVER_API_KEY` for the API server API key.
2. Run `yarn` to install dependencies.
3. Start the development server by running `yarn dev`.
4. Open the web application locally by navigating to [http://localhost:5173/](http://localhost:5173/) in your web browser.

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


