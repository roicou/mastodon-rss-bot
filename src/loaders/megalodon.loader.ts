import megalodonService from "@/services/megalodon.service";
import config from '@/config';
import generator, { MegalodonInterface } from 'megalodon'

export default async () => {
    // service to send posts
    const client: MegalodonInterface = generator('mastodon', config.mastodon.api_url, config.mastodon.access_token)
    await megalodonService.sendPosts(client);
}

