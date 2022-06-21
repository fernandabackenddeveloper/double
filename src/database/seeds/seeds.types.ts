import { Document, Model } from "mongoose";

export interface ISeed {
  externalId: string;
  created_at: Date;
  color: number;
  roll: number;
  bets: {
    id: string;
    color: number;
    amount: number;
    win_amount: number;
    current_type: string;
    status: string;
  }[];
}

export interface ISeedDocument extends ISeed, Document {}

export interface ISeedModel extends Model<ISeedDocument> {}
