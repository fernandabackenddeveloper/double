import { Document, Model } from "mongoose";

export interface ISeed {
  externalId: string;
  created_at: Date;
  color: number;
  roll: number;
  server_seed: string;
}

export interface ISeedDocument extends ISeed, Document {}

export interface ISeedModel extends Model<ISeedDocument> {}
