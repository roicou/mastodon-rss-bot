import ForbiddenInterface from "@/interfaces/forbidden.interface";
import forbiddenModel from "@/models/forbidden.model";

class ForbiddenService {
    /**
     * get all forbidden titles
     * @returns ForbiddenInterface[]
     */
    public async getForbiddenTitles(): Promise<ForbiddenInterface[]> {
        return forbiddenModel.find();
    }

    /**
     * add new forbidden title
     * @param title 
     * @returns 
     */
    public async newForbidden(title: string): Promise<any> {
        return forbiddenModel.create({ text: title });
    }
}
export default new ForbiddenService();