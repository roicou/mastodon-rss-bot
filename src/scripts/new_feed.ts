import mongoooseLoader from '@/loaders/mongoose.loader';
import inquirer from 'inquirer';
import feedService from '@/services/feed.service';

void(async () => {
    try {
        await mongoooseLoader();   
        console.log("Database connected");
    } catch(err) {
        console.error(err);
        process.exit(1);
    }

    // use inquirer to get rss title, hashtag and url
    const { title, hashtags, url, language, www_replace } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Feed title',
        },
        {
            type: 'input',
            name: 'hashtags',
            message: 'Feed hashtags',
        },
        {
            type: 'input',
            name: 'url',
            message: 'Feed url',
        },
        {
            type: 'input',
            name: 'language',
            message: 'Feed language',
            default: 'es'
        },
        {
            type: 'input',
            name: 'www_replace',
            message: 'Feed www_replace',
            default: ''
        },

    ]);
    await feedService.newFeed(title, hashtags, url, language, www_replace);
    console.log("Feed added");
    process.exit(0);
})();