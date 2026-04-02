import app from "./src/app.js";
import { port } from "./src/config/env.js";
import DBconnect from "./src/config/db.js";

const startServer = async () => {
  try {
    await DBconnect.authenticate();
    console.log("DB connected ✅");

    await DBconnect.sync({ force: true });
    console.log("Database & tables created ✔");

    app.listen(port, () => console.log(`Server running on port: ${port}`));
  } catch (error) {
    console.error(error);
  }
};

startServer();
