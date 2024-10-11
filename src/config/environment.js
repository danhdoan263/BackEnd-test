
import 'dotenv/config'
export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_NAME: process.env.MONGODB_NAME,

    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,

    AUTHOR: process.env.AUTHOR,
    NODE_ENV: process.env.NODE_ENV
}