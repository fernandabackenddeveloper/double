import { connect, connection } from "mongoose";
import { config } from '../config';

export async function run() {
  await connect(config.MONGOOSE_URI);

  connection.on("open", () => {
    console.log("Connected to mongo database");
  });

  connection.on("error", () => {
    console.error("Error on connecting to mongo database");
  });
};
