import rssModel from '@/models/rss.model';
import { read } from 'feed-reader'
import { ObjectId } from 'mongoose';
import { DateTime, Settings } from 'luxon';
import RssInterface from '@/interfaces/rss.interface';
Settings.defaultZone = "Europe/Madrid";

class RssService {
    public async getNumberOfSubscriptions() {
        return rssModel.countDocuments({});
    }
    /**
     * get rss by url
     * @param url 
     * @returns 
     */
    public async getRssByUrl(url: string): Promise<any> {
        return rssModel.findOne({ url });
    }

    /**
     * create rss
     * @param title 
     * @param hashtag without #
     * @param url 
     * @returns 
     */
    public async newRss(title: string, hashtag: string, url: string): Promise<any> {
        return rssModel.create({ title, hashtag, url, lastUrl: null });
    }

    /**
     * get the rss with older updatedAt
     */
    public async getNextRss(): Promise<RssInterface> {
        return rssModel.findOne({}).sort({ updatedAt: 1 });
    }

    /**
     * update updatedAt
     * @param _id
     */
    public async updateRss(_id: ObjectId) {
        return rssModel.updateOne({ _id }, { $set: {  } });
    }

    public async updateRssSended(_id: ObjectId, lastUrl: string) {
        return rssModel.updateOne({ _id }, { $set: { lastUrl } });
    }

}
export default new RssService();