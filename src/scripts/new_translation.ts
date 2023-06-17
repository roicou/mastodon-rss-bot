import mongoooseLoader from '@/loaders/mongoose.loader';
import inquirer from 'inquirer';
import translationService from '@/services/translation.service';

void(async () => {
    try {
        await mongoooseLoader();   
        console.log("Database connected");
    } catch(err) {
        console.error(err);
        process.exit(1);
    }

    // use inquirer to get rss title, hashtag and url
    const { text, translation, translator } = await inquirer.prompt([
        {
            type: 'input',
            name: 'text',
            message: 'Original text',
        },
        {
            type: 'input',
            name: 'translation',
            message: 'Translated text',
        },
        {
            type: 'select',
            name: 'translator',
            message: 'Translator service',
            choices: ['cixug', 'google'],
            default: 'cixug'
        }
    ]);
    await translationService.newTranslation(text, translation, translator);
    console.log("Translation added");
    process.exit(0);
})();