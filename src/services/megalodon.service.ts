import FeedInterface from "@/interfaces/feed.interface";
import logger from "@/libs/logger";
import { MegalodonInterface } from "megalodon";
import rssService from "@/services/rss.service";
import translateService from "./translate.service";
import fs from "fs";

class MegalodonService {
    public async sendFeed(client: MegalodonInterface, feed: FeedInterface) {
        try {
            let title = this.prepareTitle(feed.title);
            if (!title) {
                await rssService.updateRssSended(feed.rss, feed.link);
                return false;
            }
            title = await translateService.translate(title, feed.language)
            let message: string = title;
            // if (feed.description) {
            //   message += `\n${this.prepareEnd(feed.description)}`;
            // }
            message += `\n#RCCelta #Celta #${feed.hashtag}`;
            let link = feed.link;
            if(feed.www) {
                // substitute feed.link 'www' with feed.www
                link = link.replace('www', feed.www);
            }
            message += `\n${link}`;
            // console.log("\n\n" + message + "\n\n");
            logger.info('Sending message:\n' + message);
            await client.postStatus(message);
            await rssService.updateRssSended(feed.rss, feed.link);
            return true;
        } catch (err) {
            logger.error(err);
        }
    }

    private prepareTitle(text: string) {
        // if text is "Guía para seguir a todos los mundialistas de LaLiga", throw error
        let forbiddenTitles = [];
        try {
            forbiddenTitles = JSON.parse(fs.readFileSync(process.cwd() + '/forbiddenTitles.json', 'utf8'));
        } catch (err) {
            logger.error("Error reading forbiddenTitles.json");
            return null;
        }
        if (forbiddenTitles.includes(text)) {
            logger.error("Title forbidden: " + text);
            return null;
        }
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
}
export default new MegalodonService();