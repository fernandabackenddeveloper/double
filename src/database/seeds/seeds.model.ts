import * as Mongoose from "mongoose";
import SeedSchema from "./seeds.schema";
import { ISeedDocument, ISeedModel } from "./seeds.types";

export const SeedModel = Mongoose.model<ISeedDocument>(
  "seed",
  SeedSchema
) as ISeedModel;
