import * as Mongoose from "mongoose";

const SeedSchema = new Mongoose.Schema({
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
  firstName: String,
  lastName: String,
  age: Number,
});

export default SeedSchema;
