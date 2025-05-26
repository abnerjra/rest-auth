import 'dotenv/config';
import * as env from 'env-var';

export const envPlugin = {
    PORT: env.get('PORT').required().asPortNumber(),
    MONGO_URL: env.get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
    JWT_SECRET: env.get('JWT_SECRET').required().asString(),
    MAILER_SERVICE: env.get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').required().asString(),
    WEBSERVICE_URL: env.get('WEBSERVICE_URL').required().asString(),
    SEND_MAIL: env.get('SEND_MAIL').default('false').asBool(),
}