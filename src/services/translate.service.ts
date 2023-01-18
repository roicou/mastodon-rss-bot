import config from "@/config";
import logger from "@/libs/logger";
import { v2 } from "@google-cloud/translate";
const { Translate } = v2;
import cuoteService from "./cuote.service";
import axios from "axios";
import qs from "qs";
class TranslateService {
    private client: v2.Translate;
    private async googleTranslate(
        text: string,
        source_language: string,
        target_language: string = config.google.translate_to,
    ): Promise<string> {
        this.client = new Translate({
            projectId: config.google.project_id,
            key: config.google.api,
        });
        logger.info("Translating texto from '" + source_language + "' to '" + target_language + "'");
        const cuote = await cuoteService.getCuote();
        if (text.length + cuote > config.google.max_chars) {
            throw new Error("Monthly translation quota exceeded");
        }
        const [translation] = await this.client.translate(text, target_language);
        await cuoteService.updateCuote(text.length);
        return translation;
    }

    private async cixugTranslate(
        text: string,
    ): Promise<string> {

        const url = "https://trad20apy.cixug.gal/translate";
        const data = {
            langpair: "spa" + "|" + "glg",
            markUnknown: "no",
            prefs: "",
            q: text,
        };
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            //"Content-Length": 143,
            Origin: "https://tradutor.cixug.gal",
            Connection: "keep-alive",
            Referer: "https://tradutor.cixug.gal/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
            TE: "trailers",
        };
        const response = await axios.post(url, qs.stringify(data), { headers });
        if (response?.data?.responseData?.translatedText) {
            return response.data.responseData.translatedText;
        }
        throw new Error("Error translating text:" + response?.data);
        // return translation;
    }


    public async translate(
        text: string,
        source_language: string,
        target_language: string = config.google.translate_to,
    ): Promise<string> {
        if (source_language === target_language) {
            return text;
        }
        try {
            logger.info("Translating with CIXUG");
            const translation: string = await this.cixugTranslate(text);
            return translation;
        } catch (err) {
            logger.error(err);
        }
        try {
            logger.info("Translating with Google");
            const translation = await this.googleTranslate(text, source_language, target_language);
            return translation;
        } catch (err) {
            logger.error(err);
        }
        return text;

    }
}
export default new TranslateService();