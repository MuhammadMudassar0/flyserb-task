import { CreateUserDetailsDto } from './dto/save.dto';
import { SaveService } from './save.service';
export declare class SaveController {
    private readonly saveService;
    constructor(saveService: SaveService);
    saveData(body: CreateUserDetailsDto): Promise<{
        message: string;
        user: import("./entities/save.entity").UserEmails;
    }>;
}
