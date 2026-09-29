import 'dotenv/config';
import app from './app.js';
import connectToDatabase from './config/db.js';

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Task Planner API listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Unable to start the Task Planner API: ${error.message}`);
    process.exitCode = 1;
  }
}

startServer();
