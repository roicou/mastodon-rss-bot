import config from '@/config';
import CuoteInterface from '@/interfaces/cuote.interface';
import cuoteModel from '@/models/cuote.model';
import { DateTime, Settings } from 'luxon';
Settings.defaultZone = "Europe/Madrid";
class CuoteService {

    /**
     * gets cuote from database for Google API this month
     * @returns Cuote in chars
     */
    public async getCuote(): Promise<number> {
        const cuote = await cuoteModel.findOne({ api: config.google.api });
        if (!cuote) {
            await this.createCuote();
            return this.getCuote();
        }
        if (DateTime.fromJSDate(cuote.date).month !== DateTime.local().month) {
            await this.updateMonth();
            return this.getCuote();
        }
        return cuote.chars;
    }

    /**
     * creates cuote for Google API this month
     * @returns CuoteInterface
     */
    private async createCuote() {
        return cuoteModel.create({ api: config.google.api, date: DateTime.local().startOf('month').toJSDate(), chars: 0 });
    }

    /**
     * updates cuote for Google API this month
     * @returns CuoteInterface
     */
    private async updateMonth() {
        return cuoteModel.updateOne({ api: config.google.api }, { $set: { date: DateTime.local().startOf('month').toJSDate(), chars: 0 } });
    }

    /**
     * updates cuote for Google API this month
     * @param chars 
     * @returns 
     */
    public async updateCuote(chars: number) {
        return cuoteModel.updateOne({ api: config.google.api }, { $inc: { chars: chars } });
    }
}
export default new CuoteService();