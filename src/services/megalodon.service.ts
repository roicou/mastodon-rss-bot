import config from "@/config";
import postService from "./post.service";
import { DateTime, Settings } from "luxon";
import feedService from "./feed.service";
import logger from "@/libs/logger";
import translationService from "./translation.service";
import forbiddenService from "./forbidden.service";
import { MegalodonInterface } from "megalodon";

Settings.defaultZone = "Europe/Madrid";

class MegalodonService {

    /**
     * prepares title to send to Mastodon with the correct length and translation
     * @param text 
     * @returns 
     */
    private prepareTitle(text: string) {
        // remove <span lang="gl"> and </span>
        text = text.replace(/<span lang="gl">/g, "");
        text = text.replace(/<\/span>/g, "");
        if (text.endsWith("&nbsp; Leer")) {
            text = text.replace("&nbsp; Leer", "");
        }
        if (text.endsWith('...')) {
            // search last dot before ...
            const lastDot = text.lastIndexOf('.', text.length - 4);
            // remove from lastDot to the end
            text = text.substring(0, lastDot);
        }
        if (text.endsWith('.')) {
            text = text.substring(0, text.length - 1);
        }
        if (text.length > 300) {
            text = text.substring(0, 300);
            const lastSpace = text.lastIndexOf(' ');
            text = text.substring(0, lastSpace);
            text += "...";
        }
        return text;
    }

    /**
     * send new post to Mastodon
     * @param client 
     * @returns 
     */
    private async sendPost(client: MegalodonInterface) {
        const posts = await postService.nextPost();
        if (!posts?.length) {
            logger.info("No posts to send");
            return false;
        }
        const post = posts[0];
        const forbidden_titles = await forbiddenService.getForbiddenTitles();
        if (forbidden_titles.some((title) => title.text === post.title)) {
            await postService.updatePostSended(post._id);
            // await feedService.updateFeedSended(post.feed._id);
            throw new Error("Title forbidden: " + post.title);
        }
        let title = this.prepareTitle(post.title);
        if (!title) {
            await postService.updatePostSended(post._id);
            throw new Error('No title found');
        }
        title = await translationService.translate(title, post.feed.language)
        let message: string = title;
        message += `\n#celta #rccelta #${post.feed.hashtags.join(' #')}`;
        let link = post.url;
        if (post.feed.www_replace) {
            // substitute feed.link 'www' with feed.www
            link = link.replace('www', post.feed.www_replace);
        }
        message += `\n${link}`;
        // console.log("\n\n" + message + "\n\n");
        logger.info("Original title: " + post.title);
        logger.info('Sending message:\n' + message);
        await client.postStatus(message);
        await postService.updatePostSended(post._id);
        await feedService.updateFeedSended(post.feed._id);
    }

    /**
     * prepare posts to send
     * @param client Megalodon client
     */
    public async sendPosts(client: MegalodonInterface) {
        await this.sendPostSecondStage(client);
        let minutes_to_wait = this.getNumber();
        logger.info("Next post in " + minutes_to_wait + " minutes. At " + DateTime.now().plus({ minutes: minutes_to_wait }).toFormat("HH:mm:ss"));
        setInterval(async () => {
            const now_hour = DateTime.now().hour;
            if (now_hour >= config.feed.hour_start && now_hour <= config.feed.hour_end) {
                if (minutes_to_wait <= 1) {
                    minutes_to_wait = await this.sendPostSecondStage(client);
                    logger.info("Next post in " + minutes_to_wait + " minutes. At " + DateTime.now().plus({ minutes: minutes_to_wait }).toFormat("HH:mm:ss"));
                }
                minutes_to_wait--;
            }
        }, /** each minute */ 60000);
    }

    /**
     * second stage of sendPosts()
     * @param client 
     * @returns 
     */
    private async sendPostSecondStage(client: MegalodonInterface) {
        const now_hour = DateTime.now().hour;
        if (now_hour >= config.feed.hour_start && now_hour <= config.feed.hour_end) {
            const post_per_hour = await this.calculePostsPerHour();
            logger.info('Sending posts...');
            let errors = 0;
            for (let i = 0; i < post_per_hour; i++) {
                try {
                    const res = await this.sendPost(client);
                    if (res === false) {
                        break;
                    }
                    errors = 0; // reset errors
                } catch (err) {
                    errors++;
                    logger.error(err);
                    if (errors > post_per_hour) {
                        logger.error('Too many errors, aborting');
                        break;
                    }
                    i--;
                }
            }
        }
        return this.getNumber();
    }


    private async calculePostsPerHour(): Promise<number> {
        const pending_posts = await postService.pendingPosts();
        //const posts_total = Math.floor(pending_posts / 2)
        let post_per_hour = 1;
        const hours_left = config.feed.hour_end - DateTime.now().hour;
        post_per_hour = Math.ceil(pending_posts / hours_left);
        if (post_per_hour < 1) {
            post_per_hour = 1;
        } else if (post_per_hour > 3) {
            post_per_hour = 3;
        }
        logger.info("There are " + pending_posts + " posts pending to send along " + hours_left + " hours. " + post_per_hour + " posts this time");
        return post_per_hour;
    }

    /** 
     * function getNumber() which returns a random number between 40 and 60
     * @returns {number} random number between min and max
     */
    private getNumber() {
        const max = config.feed.max_time;
        const min = config.feed.min_time;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
export default new MegalodonService();