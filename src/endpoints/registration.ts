import { OpenAPIRoute, CreateEndpoint } from 'chanfana';
import { z } from 'zod';
import { type Context } from 'hono';

const RegisterModel = z.object({
    publicKey: z.string(),
    message: z.string(),
    sigMessage: z.string(),
});
const registerMeta = {
    model: {
        schema: RegisterModel,
        primaryKeys: ['publicKey'],
        tableName: 'registration',
    },
};
// we "mash" the user list together
const UserModel = z.object({
    identity: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    registered: z.boolean(),
    issueDate: z.string().datetime(),
    isEnabled: z.boolean(),
    publicKey: z.string(),
    qrCode: z.string(),
    lastOnline: z.string(),
});
const MashModel = z.object({
    pending: z.array(UserModel),
    registered: z.array(UserModel),
});
const mashMeta = {
    model: {
        schema: MashModel,

    },
};

export class RegisterCreate extends CreateEndpoint {
    _meta = registerMeta;

    async create(data: z.infer<typeof RegisterModel>) {
        //TODO save to database here
        console.log("Creating registration:", data);
        return data;
    }
}

export class PendingRegisteredMash extends OpenAPIRoute {
    schema = {
        responses: MashModel,
    };

    async handle(c: Context) {
        // simulate records
        const pends = [{ identity: 'id-1', email: 'kermit@sesame.street', firstName: 'Kermit', lastName: 'The-Frog', registered: false, issueDate: '', isEnabled: true, publicKey: 'abcxyz', qrCode: '', lastOnline: '' }];
        const regs = [{ identity: 'id-9', email: 'misspiggy@sesame.street', firstName: 'Miss', lastName: 'Piggy', registered: true, issueDate: '', isEnabled: true, publicKey: 'xyz123', qrCode: '', lastOnline: '' }];

        return { pending: pends, registered: regs };

    }
}
