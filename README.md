# Setup

- Rename your `.npmrc.template` file to `.npmrc`. Replace `${TIPTAP_PRO_TOKEN}` with your **Tiptap Pro Token** in `.npmrc` file.
- Run `npm install` and install the dependencies.
- Rename `.env.template` to `.env.local` and replace the values with your own.
- Start `Postgres` service ([Start With Docker](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)).
- Create a new database in Postgres and update the connection string in `.env.local` file.
- Run `npm run generate` and `npm run migrate` to create the database tables and seed the initial data.
- Run `npm run dev` to start the development server.
- Open your browser and navigate to `http://localhost:3000` to see the app in action.