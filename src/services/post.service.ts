import postModel from "@/models/post.model";
import { DateTime, Settings } from "luxon";
import { ObjectId } from "mongoose";

Settings.defaultZone = "Europe/Madrid";

class PostService {
    /**
     * remove old posts
     * @param days 
     */
    public async cleanOldPosts(days: number = 1) {
        const response = postModel.deleteMany({ published: { $lt: DateTime.local().startOf('day').minus({ days: days }).toJSDate() } });
        // console.log('response', response)
        return response;
    }

    /**
     * add new posts
     * @param posts 
     */
    public async addNewPosts(posts: any[]) {
        return postModel.insertMany(posts);
    }

    /**
     * get number of pending posts
     * @returns 
     */
    public async pendingPosts() {
        // return number of pending posts
        return postModel.countDocuments({ posted: false });
    }

    /**
     * get next post to send. It will be the oldest post of the feed with the oldest lastPost
     * @returns 
     */
    public async nextPost() {
        return postModel.aggregate([
            {
                $match: {
                    posted: false
                }
            }, {
                $lookup: {
                    from: 'feeds',
                    localField: 'feed_id',
                    foreignField: '_id',
                    as: 'feed'
                }
            }, {
                $unwind: {
                    path: '$feed',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $sort: {
                    'feed.lastPost': 1,
                    published: 1
                }
            }, {
                $limit: 1
            }, {
                $project: {
                    _id: 1,
                    feed_id: 1,
                    title: 1,
                    published: 1,
                    url: 1,
                    posted: 1,
                    feed: {
                        _id: 1,
                        title: 1,
                        hashtags: 1,
                        url: 1,
                        lastUrl: 1,
                        language: 1,
                        www_replace: 1,
                        lastPost: 1,
                        active: 1
                    }
                }
            }
        ]);
    }
    public async updatePostSended(_id: ObjectId) {
        return postModel.updateOne({
            _id
        }, {
            $set: {
                posted: true
            }
        });
    }
}

export default new PostService();