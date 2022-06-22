import { Document, Model } from "mongoose";
import { ISeed } from "../seeds/seeds.types";

export interface IAnalysis {
  seeds: ISeed[];
  created_at: Date;
}

export interface IAnalysisDocument extends IAnalysis, Document {}

export interface IAnalysisModel extends Model<IAnalysisDocument> {}
