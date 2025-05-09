import { fromHono } from "chanfana";
import { Hono } from "hono";

import { SiteList, SiteFetch, SiteCreate } from "./endpoints/sites";
import { UserList, UserFetch, UserCreate } from "./endpoints/users";
////import { LoginPost } from "./endpoints/loginPost";



// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/sites", SiteList);
openapi.post("/api/sites", SiteCreate);
openapi.get("/api/sites/:id", SiteFetch);
openapi.get("/api/users", UserList);
openapi.post("/api/users", UserCreate);
openapi.get("/api/users/:id", UserFetch);

////openapi.post("/secure/login", LoginPost);

// You may also register routes for non OpenAPI directly on Hono
app.get('/secure/login', (c) => c.json({ data: 'success' }))

// Export the Hono app
export default app;
