import FeedInterface from "@/interfaces/feed.interface";
import rssService from "@/services/rss.service";
import { read } from "feed-reader";
import { DateTime } from "luxon";
import logger from "@/libs/logger";

class FeedService {

    public async getNextFeed(): Promise<FeedInterface> {
        const length = await rssService.getNumberOfSubscriptions();
        for (let day = 0; day < 2; day++) {
            for (let i = 0; i < length; i++) {
                const rss = await rssService.getNextRss();
                if (!rss) {
                    logger.info("There are no rss to read. Review here!");
                    await rssService.updateRss(rss._id);
                    continue;
                }
                // logger.log('rss', rss)
                // order rss by 
                const feed: any = await read(rss.url);
                if (!feed || !feed.entries?.length) {
                    logger.info(`${rss.title}: there are no entries. Skipping...`);
                    await rssService.updateRss(rss._id);
                    continue;
                }
                const entries: FeedInterface[] = feed.entries.sort((a: FeedInterface, b: FeedInterface) => {
                    // sort by date desc with DateTime
                    return DateTime.fromISO(b.published).toMillis() - DateTime.fromISO(a.published).toMillis();
                }).filter((entry: FeedInterface) => {
                    day
                    // only today entries
                    return DateTime.fromISO(entry.published).toMillis() >= DateTime.local().minus({ day: day }).startOf('day').toMillis();
                });
                if (!entries.length) {
                    logger.info(`${rss.title}: there are no entries for today. Skipping...`);
                    await rssService.updateRss(rss._id);
                    continue;
                }
                // find entrie position of rss.lastUrl
                
                let lastUrlIndex = entries.findIndex((entrie: FeedInterface) => {
                    if(rss.www) {
                        // sustitute in to_send.link the "www" for the rss.www
                        entrie.link = entrie.link.replace('www', rss.www);
                    }
                    return entrie.link === rss.lastUrl
                });
                if (!lastUrlIndex || lastUrlIndex === 0) {
                    logger.info(`${rss.title}: there are all published. Skipping...`);
                    await rssService.updateRss(rss._id);
                    continue;
                }
                // if lastUrlIndex is -1, then the rss.lastUrl is not in the entries
                if (lastUrlIndex === -1) {
                    lastUrlIndex = entries.length;
                }
                lastUrlIndex--;
                const to_send = entries[lastUrlIndex];
                if(rss.www) {
                    // sustitute in to_send.link the "www" for the rss.www
                    to_send.link = to_send.link.replace('www', rss.www);
                }
                to_send.hashtag = rss.hashtag;
                to_send.rss = rss._id;
                to_send.language = rss.language;
                return to_send;
            }
            logger.info("There are no new feeds for today. Looking for on y esterday...");
        }
        logger.info("There are no new feeds to send");
        return null;
    }
}

export default new FeedService();