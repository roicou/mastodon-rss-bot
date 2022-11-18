import config from '@/config';
import mongoooseLoader from '@/loaders/mongoose.loader';
import inquirer from 'inquirer';
import rssService from '@/services/rss.service';

void(async () => {
    try {
        await mongoooseLoader();   
        console.log("Database connected");
    } catch(err) {
        console.error(err);
        process.exit(1);
    }

    // use inquirer to get rss title, hashtag and url
    const { title, hashtag, url } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'RSS title',
        },
        {
            type: 'input',
            name: 'hashtag',
            message: 'RSS hashtag',
        },
        {
            type: 'input',
            name: 'url',
            message: 'RSS url',
        },
    ]);
    await rssService.newRss(title, hashtag, url);
    console.log("RSS added");
    process.exit(0);
})();