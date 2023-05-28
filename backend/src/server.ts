import mongoose from "mongoose";
import app from "./app";
import env from "./util/validateEnv";

const port = env.PORT;

mongoose.connect(env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose successfully connected!");
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch(console.error);

