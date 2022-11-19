import config from "@/config";
import logger from "@/libs/logger";
import { v2 } from "@google-cloud/translate";
const { Translate } = v2;
import cuoteService from "./cuote.service";
class TranslateService {
    private client: v2.Translate;
    constructor() {
        this.client = new Translate({
            projectId: config.google.project_id,
            key: config.google.api,
        });
    }

    public async translate(
        text: string,
        source_language: string,
        target_language: string = config.google.translate_to,
    ): Promise<string> {
        try {
            if(source_language === target_language) {
                return text;
            }
            logger.info("Translating texto from '" + source_language + "' to '" + target_language + "'");
            const cuote = await cuoteService.getCuote();
            if (text.length + cuote > config.google.max_chars) {
                logger.info("Monthly translation quota exceeded");
                return text;
            }
            const [translation] = await this.client.translate(text, target_language);
            await cuoteService.updateCuote(text.length);
            return translation;
        } catch (err) {
            logger.error(err);
            return text;
        }

    }
}
export default new TranslateService();