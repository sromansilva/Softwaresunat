
# Intelligent Audit Dashboard

  This is a code bundle for Intelligent Audit Dashboard. The original project is available at https://www.figma.com/design/g42lvDcLhz2g1qsIzTwmuR/Intelligent-Audit-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  ## Deployment

### Vercel
This project is configured for easy deployment on [Vercel](https://vercel.com).

1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the Vite configuration.
3. Ensure the **Output Directory** is set to `dist`.
4. The included `vercel.json` handles SPA routing.

For manual deployment:
```bash
npm run build
vercel deploy --prod
```