import * as Mongoose from "mongoose";
import SeedDetailedSchema from "./seeds-detailed.schema";
import { ISeedDetailedDocument, ISeedDetailedModel } from "./seeds-detailed.types";

export const SeedDetailedModel = Mongoose.model<ISeedDetailedDocument>(
  "seed_detailed",
  SeedDetailedSchema
) as ISeedDetailedModel;
