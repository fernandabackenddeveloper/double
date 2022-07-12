import path from 'path';
import { config as dotenv } from 'dotenv';

dotenv({
    path: path.join(__dirname, '..', '.env')
});

const {
    BLAZE_API_URL,
    MONGOOSE_URI,
    AMQP_URI
} = process.env as any;

export const config = {
    BLAZE_API_URL,
    MONGOOSE_URI,
    AMQP_URI
};
