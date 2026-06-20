import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initFirebase } from "./config/firebase.js";

const startServer = async () => {
  await connectDB();
  initFirebase();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });
};

startServer();
