import 'dotenv/config';
import * as env from 'env-var';

export const envPlugin = {
    PORT: env.get('PORT').required().asPortNumber(),
    MONGO_URL: env.get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
}