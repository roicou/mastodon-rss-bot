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
        target_language: string = config.google.target_language,
        source_language: string = config.google.source_language
    ): Promise<string> {
        try {
            const cuote = await cuoteService.getCuote();
            if (text.length + cuote > config.google.max_chars) {
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