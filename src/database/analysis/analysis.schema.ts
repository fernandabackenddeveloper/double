import * as Mongoose from "mongoose";

const AnalysisSchema = new Mongoose.Schema({
  seeds: [{
    externalId: String,
    created_at: Date,
    color: Number,
    roll: Number,
    server_seed: String,
  }],
  created_at: {
    type: Date,
    default: new Date(),
  },
});

export default AnalysisSchema;
