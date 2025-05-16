import { ReadEndpoint } from 'chanfana';
import { z } from 'zod';


// Define the Range Model
const RangeModel = z.object({
    center: z.array(z.number()),
    minLat: z.number(),
    minLon: z.number(),
    maxLat: z.number(),
    maxLon: z.number(),
});

// Define the Meta object for Range
const rangeMeta = {
    model: {
        schema: RangeModel,
        primaryKeys: [],
    },
};

export class RangeList extends ReadEndpoint {
    _meta = rangeMeta;

    async fetch() {
        const cents = [ // simulate  data
            47.23911, -122.44989,
        ];
        return { center: cents, minLat: 47.5001, minLon: -122.4382, maxLat: 47.734, maxLon: -122.2364};
    }
}
