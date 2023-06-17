import postService from '@/services/post.service';
import rssService from '@/services/rss.service';

export default async () => {
    // each 10 minutes, get new posts and clean old posts
    await rssService.getNewPosts();
    await postService.cleanOldPosts();
    setInterval(async () => {
        await rssService.getNewPosts();
        await postService.cleanOldPosts();
    }, /** each 10 minutes */ 600000);
}