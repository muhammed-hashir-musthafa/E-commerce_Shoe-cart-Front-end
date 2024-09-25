import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',  // Ensure this matches the output directory in vercel.json
  },
  // Optionally set the base if your app will be deployed at a subpath
  base: '/',  // Adjust if necessary
});
