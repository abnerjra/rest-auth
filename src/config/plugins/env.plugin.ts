import 'dotenv/config';
import * as env from 'env-var';

export const envPlugin = {
    PORT: env.get('PORT').required().asPortNumber(),
}