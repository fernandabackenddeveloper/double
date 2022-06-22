import * as Mongoose from "mongoose";

const SeedSchema = new Mongoose.Schema({
  externalId: String,
  created_at: Date,
  color: Number,
  roll: Number,
  server_seed: String,
});

export default SeedSchema;
