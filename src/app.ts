import logger from './libs/logger';
import loaders from '@/loaders';
void (async function () {
    try {
        await loaders();
    } catch (err) {
        logger.error(err);
    }
})();
