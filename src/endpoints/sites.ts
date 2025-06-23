
import { D1CreateEndpoint, D1ReadEndpoint, D1ListEndpoint } from "chanfana";
import { z } from "zod";


// Define the Site Model
const SiteModel = z.object({
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    status: z.string(),
    address: z.string(),
    cell_id: z.array(z.string()).optional(),
});

// Define the Meta object for Site
const siteMeta = {
    model: {
        schema: SiteModel.omit({id: true, created: true, rawdata: true}),
        primaryKeys: ['id'],
        tableName: 'sites', // Table name in D1 database
    },
};

export class SiteFetch extends D1ReadEndpoint { _meta = siteMeta; dbName = "DB"; }
export class SiteList extends D1ListEndpoint { _meta = siteMeta; dbName = "DB"; }

// wondering always-replace? is better than two separate functions? a)create, b)update
// with create, we want to accept free form JSON for now 
const CreateModel = z.object({
    name: z.string().min(3),
}).catchall(z.unknown());
const createMeta = {
    model: {
        schema: CreateModel,
        tableName: 'sites',
    },
};
export class SiteCreate extends D1CreateEndpoint {
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

