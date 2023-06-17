import translationModel from "@/models/translation.model";
import config from "@/config";
import logger from "@/libs/logger";
import { v2 } from "@google-cloud/translate";
const { Translate } = v2;
import cuoteService from "./cuote.service";
import axios from "axios";
import qs from "qs";

class TranslationService {
    private gaioSession: string = null;
    /**
     * creates a new manual translation
     * @param text text original
     * @param translation translation of text
     * @param translator translator used
     * @returns 
     */
    public async newTranslation(text: string, translation: string, translator: string): Promise<any> {
        return translationModel.create({ text, translation, translator });
    }

    /** google api */
    private client: v2.Translate;
    /**
     * use google translate api
     * @param text 
     * @param source_language 
     * @param target_language 
     * @returns 
     */
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

    /**
     * use cixug translate post
     * @param text 
     * @returns 
     */
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
            const text = response.data.responseData.translatedText;
            const translations = await this.getTranslations('cixug');
            const texts = text.split(" ");
            const translation = texts.map((word) => {
                const translation = translations.find((translation) => translation.text === word);
                if (translation) {
                    logger.info("Found manual translation for word: \"" + word + "\" -> \"" + translation.translation + "\"");
                    return translation.translation;
                }
                return word;
            }).join(" ");
            return translation;
        }
        throw new Error("Error translating text:" + response?.data);
        // return translation;
    }

    private async getTranslations(translator: string): Promise<any> {
        return translationModel.find({ translator });
    }

    private async gaioTranslate(text: string, repited = false): Promise<string> {
        if (!this.gaioSession) {
            await axios.get("https://tradutorgaio.xunta.gal/TradutorPublico/", { maxRedirects: 0 })
                .catch(error => {
                    // Da erro por que trata de redirecionar ata que se poñan as cookies
                    logger.info('New cookie for GAIO: ', error.response.headers['set-cookie'][0].split(";")[0]);
                    this.gaioSession = error.response.headers['set-cookie'][0].split(";")[0];
                });
        }
        try {
            const response = await axios.post("https://tradutorgaio.xunta.gal/TradutorPublico/traducir/text", qs.stringify({
                "langpair": "es-gl",
                "dic_tematico": "cidadania",
                "q": text,
            }), {
                headers: {
                    "Cookie": this.gaioSession,
                }
            });
            if (response?.data?.text) {
                return response.data.text;
            }
            throw new Error("Error translating text: " + response?.data);
        } catch (err) {
            //logger.error(err);
            this.gaioSession = null;
            if (!repited) {
                logger.info("Cookie obsolete, removing cookie and trying again...");
                return this.gaioTranslate(text, true);
            } else {
                throw err;
            }
        }
    }

    /**
     * try to translate text. First try with cixug, then with google
     * @param text 
     * @param source_language 
     * @param target_language 
     * @returns 
     */
    public async translate(
        text: string,
        source_language: string,
        target_language: string = config.google.translate_to,
    ): Promise<string> {
        if (source_language === target_language) {
            return text;
        }
        try {
            logger.info("Translating with GAIO");
            const translation: string = await this.gaioTranslate(text);
            return translation;
        } catch (err) {
            logger.error(err);
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
export default new TranslationService();