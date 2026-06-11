import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from the .env file in the current directory
  const env = loadEnv(mode, process.cwd(), '')
  const port = env.PORT ? parseInt(env.PORT, 10) : 5173

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: port,
    },
    define: {
      "import.meta.env.PORT": JSON.stringify(env.PORT),
      "import.meta.env.ENVIRONMENT": JSON.stringify(env.ENVIRONMENT),
      "import.meta.env.API_BASE_URL": JSON.stringify(env.BASE_URL),
      "import.meta.env.API_KEY": JSON.stringify(env.API_KEY),
      "import.meta.env.APPLICATION_KEY": JSON.stringify(env.APPLICATION_KEY),
    },
  };
})

