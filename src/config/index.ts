import dotenv from 'dotenv';
const envFound = dotenv.config();
if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * logs config
     */
    logs: {
        log_path: process.env.LOG_PATH || "logs",
        compress_before_days: process.env.COMPRESS_BEFORE_DAYS || 3,
        cron_hour: process.env.CRON_HOUR || 3
    },
    /**
     * mastodon config
     */
    mastodon: {
        client_key: process.env.MASTODON_CLIENT_KEY,
        client_secret: process.env.MASTODON_CLIENT_SECRET,
        access_token: process.env.MASTODON_ACCESS_TOKEN,
        api_url: process.env.MASTODON_API_URL,
    },
    /**
     * feed
     */
    feed: {
        max_feeds: process.env.MAX_FEEDS || 1,
        min_time: parseInt(process.env.MIN_TIME) || 35,
        max_time: parseInt(process.env.MAX_TIME) || 60,
        hour_start: parseInt(process.env.HOUR_START) || 8,
        hour_end: parseInt(process.env.HOUR_END) || 23,
    },
    /**
     * database config
     */
    db: {
        uri: process.env.DB_URI || null,
        user: process.env.DB_USER || null,
        password: process.env.DB_PASSWORD || null
        // db: process.env.DB_NAME,
        // options: {
        //     // poolSize: 25,
        //     connectTimeoutMS: 60000,
        //     socketTimeoutMS: 600000,
        //     useUnifiedTopology: true
        // }
    },
    /**
     * google
     */
    google: {
        api: process.env.GOOGLE_API,
        project_id: process.env.GOOGLE_PROJECT_ID,
        max_chars: process.env.GOOGLE_MAX_CHARS || 500000,
        translate_to: process.env.GOOGLE_TRANSLATE_TO || "gl",
    }
}