import { Document, Model } from "mongoose";

export interface ISeedDetailed {
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

export interface ISeedDetailedDocument extends ISeedDetailed, Document {}

export interface ISeedDetailedModel extends Model<ISeedDetailedDocument> {}
