import feedModel from '@/models/feed.model';
import { ObjectId } from 'mongoose';
import { DateTime, Settings } from 'luxon';
import FeedInterface from '@/interfaces/feed.interface';
Settings.defaultZone = "Europe/Madrid";

class FeedService {
    /**
     * create rss
     * @param title 
     * @param hashtag without #
     * @param url 
     * @returns 
     */
    public async newFeed(title: string, hashtags: string, url: string, language: string, www_replace: string): Promise<any> {
        const hashtags_array = hashtags.split(' ');
        return feedModel.create({ title, hashtags: hashtags_array, url, lastUrl: null, language, www_replace: www_replace || null, lastPost: null, posts: [], active: true });
    }

    /**
     * update lastPost date
     * @param _id 
     * @param lastUrl 
     * @returns 
     */
    public async updateFeedSended(_id: ObjectId) {
        return feedModel.updateOne({ _id }, { $set: { lastPost: DateTime.now().toJSDate() } });
    }

    /**
     * get all feeds with its posts
     * @returns 
     */
    public async getAllFeedsWithPosts(): Promise<FeedInterface[]> {
        return feedModel.aggregate([
            {
                $match: {
                    active: true
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'feed_id',
                    as: 'posts'
                }
            }
        ]);
    }

}
export default new FeedService();