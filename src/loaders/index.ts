import megalodonLoader from "@/loaders/megalodon.loader";
import rssLoader from "@/loaders/rss.loader";
import mongooseLoader from "@/loaders/mongoose.loader";

export default async () => {
    /** Loading mongoose */
    await mongooseLoader();
    /** Loading rss */
    await rssLoader();
    /** Loading megalodon client */
    await megalodonLoader();
}