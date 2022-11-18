import config from '@/config';
import logger from './libs/logger';
import generator from 'megalodon'
import loaders from '@/loaders';
void (async function () {
    try {
        const client = generator('mastodon', config.mastodon.api_url, config.mastodon.access_token)
        logger.info('Bot started');
        await loaders(client);
        logger.info(`
        #####################################
        #            All loaders            #
        #####################################
    `);
    } catch (err) {
        logger.error(err);
    }
})();
