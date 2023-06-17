import logger from '@/libs/logger';
import { DateTime, Settings } from 'luxon';
import { read } from "feed-reader";
import feedService from './feed.service';
import PostInterface from '@/interfaces/post.interface';
import postService from './post.service';

Settings.defaultZone = 'Europe/Madrid';
class RssService {
    /**
     * get posts
     * @returns 
     */
    public async getNewPosts() {
        const feeds = await feedService.getAllFeedsWithPosts();
        const to_add: PostInterface[] = [];
        for (const feed of feeds) {
            try {
                const cloud_feed = await read(feed.url);
                if (!cloud_feed?.entries?.length) {
                    continue;
                }
                const length = to_add.length;
                const entries = cloud_feed.entries.filter((entry: any) => DateTime.fromISO(entry.published).toMillis() >= DateTime.local().minus({ day: 1 }).startOf('day').toMillis()).sort((a: any, b: any) => DateTime.fromISO(a.published).toMillis() - DateTime.fromISO(b.published).toMillis());
                for (const entry of entries) {
                    if (!feed.posts.some((post: any) => post.url === entry.link)) {
                        to_add.push({
                            feed_id: feed._id,
                            title: entry.title,
                            published: entry.published,
                            url: entry.link,
                            posted: false
                        });
                    }
                }
                if (to_add.length - length > 0) {
                    logger.info("Added " + (to_add.length - length) + " posts from feed: " + feed.title);
                }
            } catch (error) {
                logger.error("Error reading", feed);
                logger.error(error);
            }
            // break;
        }
        postService.addNewPosts(to_add);
    }

}
export default new RssService();