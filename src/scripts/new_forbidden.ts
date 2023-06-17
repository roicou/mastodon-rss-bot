import mongoooseLoader from '@/loaders/mongoose.loader';
import inquirer from 'inquirer';
import forbiddenService from '@/services/forbidden.service';

void(async () => {
    try {
        await mongoooseLoader();   
        console.log("Database connected");
    } catch(err) {
        console.error(err);
        process.exit(1);
    }

    // use inquirer to get rss title, hashtag and url
    const { text } = await inquirer.prompt([
        {
            type: 'input',
            name: 'text',
            message: 'Forbidden text',
        },
       ]);
    await forbiddenService.newForbidden(text);
    console.log("Forbidden added");
    process.exit(0);
})();