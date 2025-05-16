
import { D1CreateEndpoint, D1ReadEndpoint, D1ListEndpoint } from "chanfana";
import { z } from "zod";


// Define the User Model
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

// Define the Meta object for User
const userMeta = {
    model: {
        schema: UserModel.omit({id: true, created: true, rawdata: true}),
        primaryKeys: ['id'],
        tableName: 'users', // Table name in D1 database
    },
};

export class UserFetch extends D1ReadEndpoint { _meta = userMeta; dbName = "DB"; }
export class UserList extends D1ListEndpoint { _meta = userMeta; dbName = "DB"; }

// with create, we want to accept free form JSON for now (require "email" as only rule)
const CreateModel = z.object({
    email: z.string().email(),
}).catchall(z.unknown());
const createMeta = {
    model: {
        schema: CreateModel,
        tableName: 'users',
    },
};
export class UserCreate extends D1CreateEndpoint {
    _meta = createMeta;
    dbName = "DB";

    async create(data: z.infer<typeof CreateModel>) {
        let inserted;
        let serialized;
        try {
            serialized = JSON.stringify(data)
        } catch (e: any) {
            // capture exception when stringify encounters BigInt/circular
            serialized = JSON.stringify(e, Object.getOwnPropertyNames(e))
        }
        try {
          const result = await this.getDBBinding()
            .prepare(
              `INSERT INTO ${this.meta.model.tableName} (rawdata) VALUES (?) RETURNING *`,
            )
            .bind(serialized)
            .all();

          inserted = result.results[0] as O<typeof this.meta>;
        } catch (e: any) {
          if (e.message.includes("UNIQUE constraint failed")) {
            const constraintMessage = e.message.split("UNIQUE constraint failed:")[1].split(":")[0].trim();
            if (this.constraintsMessages[constraintMessage]) {
              throw this.constraintsMessages[constraintMessage];
            }
          }

          throw new ApiException(e.message);
        }
        return inserted;
    }
}

