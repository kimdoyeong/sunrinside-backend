import app from "./app";
import env from "./constants/env";

app.listen(env.PORT, () => {
  console.log(`Server started on port ${env.PORT}`);
});
