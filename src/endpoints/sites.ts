
import { D1CreateEndpoint, D1UpdateEndpoint, D1ReadEndpoint, D1ListEndpoint } from "chanfana";
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
        const recordId = filters.filters[0].value;
        const updatedData = filters.updatedData;
        return updatedData;

        /*************
        const data = this.getValidatedData();
        const jsonrequest = data.body;
        const sid = jsonrequest.id;
        let serialized;
        try {
            serialized = JSON.stringify(jsonrequest)
        } catch (e: any) {
            // capture exception when stringify encounters BigInt/circular
            serialized = JSON.stringify(e, Object.getOwnPropertyNames(e))
        }
        // call json_patch to merge the json that will be saved in the next step
        // also pass the row key on to the next step which we use instead of another json-extract
        try {
          const result = await this.getDBBinding()
            .prepare(
              `SELECT id AS pk, json_patch(rawdata, ?2) AS mergedjson FROM ${this.meta.model.tableName} WHERE ?1 = json_extract(rawdata, '$.id')`,
            )
            .bind(sid, serialized)
            .all();

          mergedSite = result.results[0];
        } catch (e: any) {
          throw new ApiException(e.message);
        }
        return mergedSite;
******************/
    }
    async update(mergedObj: any, filters: any) {
        let updated;
        updated = mergedObj;
        /********************
        let serialized;
        const rowkey = mergedObj.pk;
        try {
            serialized = JSON.stringify(mergedObj.mergedjson)
        } catch (e: any) {
            // capture exception when stringify encounters BigInt/circular
            serialized = JSON.stringify(e, Object.getOwnPropertyNames(e))
        }
        try {
          const result = await this.getDBBinding()
            .prepare(
              `UPDATE ${this.meta.model.tableName} SET rawdata = ?2 WHERE id = ?1 RETURNING *`,
            )
            .bind(rowkey,serialized)
            .all();

          updated = result.results[0] as O<typeof this.meta>;
        } catch (e: any) {
          throw new ApiException(e.message);
        }
        ***********************/
        return updated;
    }
}

