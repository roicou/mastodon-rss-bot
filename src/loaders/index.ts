import { MegalodonInterface } from "megalodon";
import megalodonLoader from "@/loaders/megalodon.loader";
import rssLoader from "@/loaders/rss.loader";
import mongooseLoader from "@/loaders/mongoose.loader";

export default async (client: MegalodonInterface) => {
    await mongooseLoader();
    await megalodonLoader(client);
    await rssLoader();
}