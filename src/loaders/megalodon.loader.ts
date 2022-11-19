import logger from '@/libs/logger';
import feedService from '@/services/feed.service';
import rssService from '@/services/rss.service';
import { MegalodonInterface, Response } from 'megalodon';
import megalodonService from "@/services/megalodon.service";
import { DateTime, Settings } from 'luxon';
import config from '@/config';
Settings.defaultZone = 'Europe/Madrid';

export default async (client: MegalodonInterface) => {

    let minutes = getNumber();
    logger.info(`Next feed in ${minutes} minutes`);
    let elapsed_minutes = 0;
    setInterval(async () => {
        try {
            const now = DateTime.local();
            // if now is between 9:00 and 23:00
            if (now.hour >= config.feed.hour_start && now.hour <= config.feed.hour_end) {
                elapsed_minutes++;
                if (elapsed_minutes >= minutes) {
                    elapsed_minutes = 0;
                    minutes = getNumber();
                    for (let j = 0; j < config.feed.max_feeds; j++) {
                        const feed = await feedService.getNextFeed();
                        if (feed) {
                            // logger.info(`Sending feed #${feed.hashtag}: ${feed.title}`);
                            await megalodonService.sendFeed(client, feed);
                        } else {
                            logger.info("There are no new feeds to send");
                        }
                    }
                    logger.info(`Next feed in ${minutes} minutes`);
                }
            }
        } catch (err) {
            logger.error(err);
        }
    }, /* each minute */ 60000);
    //}, 1000);
    // /* 43 minutes */ 43 * 60 * 1000); //124

    // client.postStatus("Ola mundo!")
    //     .then((res: Response<Entity.Status>) => {
    //         logger.info(res)
    //     })
    //     .catch((err: Error) => {
    //         logger.error(err)
    //     });
}

/** 
 * function getNumber() which returns a random number between 40 and 60
 * @returns {number} random number between 40 and 60
 */
function getNumber() {
    const max = config.feed.max_time;
    const min = config.feed.min_time;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

