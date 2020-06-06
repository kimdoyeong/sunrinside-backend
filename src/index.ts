import app from "./app";
import env from "./constants/env";
import connectDB from "./lib/connectDB";

connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server started on port ${env.PORT}`);
    });
  })
  .catch((e) => {
    console.error(e);
  });
