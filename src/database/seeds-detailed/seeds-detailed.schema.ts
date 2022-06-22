import * as Mongoose from "mongoose";

const SeedDetailedSchema = new Mongoose.Schema({
  externalId: String,
  created_at: Date,
  color: Number,
  roll: Number,
  bets: [{
    id: String,
    color: Number,
    amount: Number,
    win_amount: Number,
    current_type: String,
    status: String,
  }],
});

export default SeedDetailedSchema;
