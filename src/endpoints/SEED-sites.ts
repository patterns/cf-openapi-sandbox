import { ListEndpoint } from 'chanfana';
import { z } from 'zod';


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

export class SiteList extends ListEndpoint {
    _meta = siteMeta;
    filterFields = ['status'];
    orderByFields = ['name', 'status'];
    defaultOrderBy = 'name';

    async list(filters: any) {
        const options = filters.options;
        const filterConditions = filters.filters;
        console.log("Listing sites with params:", options, "and filters:", filterConditions);
        const sites = [ // simulate sites data
{ id: "site-1", name: "David-TCN", latitude: 47.23911, longitude: -122.44989, status:  "active", address: "2309 S L St, Tacoma, WA 98405"},
{ id: "site-2", name: "SURGEtacoma", latitude: 47.23854, longitude: -122.44094, status: "confirmed", address: "2367 Tacoma Ave S, Tacoma, WA 98402"},
{ id: "site-3", name: "Filipino Community Center", latitude: 47.5501, longitude: -122.2872, status: "confirmed", address: "5740 Martin Luther King Jr Way S, Seattle, WA 98118"},
{ id: "site-4", name: "Oareao OCC Masjid", latitude: 47.52391, longitude: -122.27636, status: "in-conversation", address: "8812 Renton Ave S, Seattle, WA 98118"},
{ id: "site-5", name: "ALTSpace", latitude: 47.60816, longitude: -122.30192, status: "in-conversation", address: "2318 E Cherry St, Seattle, WA 98122"},
{ id: "site-6", name: "Franklin High School", latitude: 47.576, longitude: -122.29307, status: "in-conversation", address: "3013 S Mt Baker Blvd, Seattle, WA 98144"},
{ id: "site-7", name: "Garfield High School", latitude: 47.60533, longitude: -122.3018, status: "in-conversation", address: "400 23rd Ave, Seattle, WA 98122"},
{ id: "site-8", name: "Skyway Library", latitude: 47.49049, longitude: -122.23853, status: "in-conversation", address: "12601 76th Ave S, Seattle, WA 98178"},
{ id: "site-9", name: "University Heights Center", latitude: 47.66613, longitude: -122.31374, status: "in-conversation", address: "5031 University Way NE, Seattle, WA 98105"},
{ id: "site-10", name: "Hillside Church Kent", latitude: 47.38639, longitude:  -122.22205, status: "in-conversation", address: "930 E James St, Kent, WA 98031"},

        ];
        return { result: sites };
    }
}
