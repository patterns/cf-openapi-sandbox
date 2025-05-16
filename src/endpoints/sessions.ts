import { CreateEndpoint } from 'chanfana';
import { z } from 'zod';


// with create, we want to accept free form JSON for now
const CreateModel = z.object({
    uuid: z.string().optional(),
}).catchall(z.unknown());

const createMeta = {
    model: {
        schema: CreateModel,
////        tableName: 'in-memory',
    },
};

export class SessionCreate extends CreateEndpoint {
    _meta = createMeta;

    async create(data: z.infer<typeof CreateModel>) {
        //TODO save to database here
        console.log("Session :", data);
        return { result: 'success' };
    }
}
