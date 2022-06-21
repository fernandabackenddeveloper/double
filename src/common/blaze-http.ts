import axios from 'axios';
import { config } from '../config';

export const blazeHttp = axios.create({
  baseURL: config.BLAZE_API_URL,
  responseType: 'json'
});

export type BlazeDoubleHistory = {
  records: {
    id: string,
    created_at: Date,
    color: number,
    roll: number,
    server_seed: string
  }[];
};

export type BlazeDoubleHistoryDetail = {
  id: string;
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
  totalBetPages: number;
};
