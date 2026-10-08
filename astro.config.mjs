import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sadajuyar0.github.io',
  base: '/e-commerce-mercaconsciente',
  integrations: [react(), tailwind()],
  output: 'static',
});