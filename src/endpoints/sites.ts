
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

//TODO "safer replace", check for existing record and move/mark as expired status (to be log/audit table).
//                  Then insert the new record into table.
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
// with update, we want to accept free form JSON for now 
export class SiteUpdate extends D1UpdateEndpoint {
    _meta = createMeta;
    dbName = "DB";

    async getObject(filters: any) {
        const siteId = filters.filters[0].value;
        // TODO may want to construct a concatenated key to use in the patch step instead of relying on the auto-number

        try {
          const result = await this.getDBBinding()
            .prepare(
              `SELECT rawdata FROM ${this.meta.model.tableName} WHERE (?) = json_extract(rawdata, '$.id')`,
            )
            .bind(siteId)
            .all();

          existingSite = result.results[0];
        } catch (e: any) {
          throw new ApiException(e.message);
        }
        return existingSite;
    }
    async update(oldObj: any, filters: any) {
        let updated;
        let serialized;
        const siteId = filters.filters[0].value;
        try {
            serialized = JSON.stringify(filters.updatedData)
        } catch (e: any) {
            // capture exception when stringify encounters BigInt/circular
            serialized = JSON.stringify(e, Object.getOwnPropertyNames(e))
        }
        try {
          const result = await this.getDBBinding()
            .prepare(
              `UPDATE ${this.meta.model.tableName} SET rawdata = json_patch(oldObj, ?1) WHERE ?2 = json_extract(rawdata, '$.id')`,
            )
            .bind(serialized, siteId)
            .all();

          updated = result.success;
        } catch (e: any) {
          throw new ApiException(e.message);
        }
        return updated;
    }
}

