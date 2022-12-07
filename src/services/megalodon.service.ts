import FeedInterface from "@/interfaces/feed.interface";
import logger from "@/libs/logger";
import { MegalodonInterface } from "megalodon";
import rssService from "@/services/rss.service";
import cuoteService from "./cuote.service";
import config from "@/config";
import translateService from "./translate.service";

class MegalodonService {
    public async sendFeed(client: MegalodonInterface, feed: FeedInterface) {
        try {
            let title = this.prepareEnd(feed.title);
            title = await translateService.translate(title, feed.language)
            let message: string = title;
            //if (feed.description) {

            //message += `\n${this.prepareEnd(feed.description)}`;
            //}
            message += `\n#RCCelta #Celta #${feed.hashtag}`;
            message += `\n${feed.link}`;
            // console.log("\n\n" + message + "\n\n");
            logger.info('Sending message:\n' + message);
            await client.postStatus(message);
            await rssService.updateRssSended(feed.rss, feed.link);
        } catch (err) {
            logger.error(err);
        }
    }

    private prepareEnd(text: string) {
        // remove <span lang="gl"> and </span>
        text = text.replace(/<span lang="gl">/g, "");
        text = text.replace(/<\/span>/g, "");
        if (text.endsWith("&nbsp; Leer")) {
            text = text.replace("&nbsp; Leer", "");
        }
        if (text.length > 300) {
            text = text.substring(0, 300);
            const lastSpace = text.lastIndexOf(' ');
            text = text.substring(0, lastSpace);
            text += "...";
        }
        if (text.endsWith('...')) {
            // search last dot before ...
            const lastDot = text.lastIndexOf('.', text.length - 4);
            // remove from lastDot to the end
            text = text.substring(0, lastDot);
        }
        if (text.endsWith(".")) {
            return text;
        }
        return text + ".";
    }
}
export default new MegalodonService();