import * as Mongoose from "mongoose";
import SeedSchema from "./analysis.schema";
import { IAnalysisDocument, IAnalysisModel } from "./analysis.types";

export const AnalysisModel = Mongoose.model<IAnalysisDocument>(
  "analysis",
  SeedSchema
) as IAnalysisModel;
