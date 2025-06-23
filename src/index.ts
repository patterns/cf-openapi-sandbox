import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { fromHono } from "chanfana";
import { CatchallList, CatchallCreate } from './endpoints/catchall';
import { RegisterCreate, PendingRegisteredMash } from './endpoints/registration';
import { RangeList } from './endpoints/ranges';
import { SessionCreate } from './endpoints/sessions';
import { SiteList, SiteFetch, SiteCreate, SiteUpdate } from "./endpoints/sites";

/****import { UserList, UserFetch, UserCreate } from "./endpoints/users";
import { UserRegister } from "./endpoints/registration";
import { SignalCreate } from "./endpoints/signals";
****/


// Start a Hono app
const app = new Hono<{ Bindings: Env }>();
const loggingMiddleware = async (c, next) => {
    const startTime = Date.now()
    await next();
    const endTime = Date.now()
    const duration = endTime - startTime;
    const method = c.req.method;
    const url = c.req.url;
    const status = c.res.status;
    console.log(`${method} ${url} - ${status} - ${duration}ms`);
};

app.use(loggingMiddleware);
app.use('*', (c, next) => {
    const corsMiddlewareHandler = cors({
        origin: c.env.CORS_ORIGIN,
        allowHeaders: ['Content-Type'],
        maxAge: 86400,
        credentials: true,
    })
    return corsMiddlewareHandler(c, next)
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
    docs_url: "/",
});


openapi.get("/api/sites", SiteList);
openapi.post("/api/sites", SiteCreate);
openapi.get("/api/sites/:id", SiteFetch);
openapi.patch("/api/sites", SiteUpdate);
/****
openapi.get("/api/users", UserList);
openapi.post("/api/users", UserCreate);
openapi.get("/api/users/:id", UserFetch);
openapi.post("/api/report_signal", SignalCreate);
****/
openapi.get('/api/data', CatchallList);
openapi.get('/api/success', CatchallList);
openapi.get('/api/failure', CatchallList);
openapi.get('/api/sitesSummary', CatchallList);
openapi.get('/api/lineSummary', CatchallList);
openapi.get('/api/logout', CatchallList);
openapi.get('/api/markers', CatchallList);
openapi.get('/api/dataRange', RangeList);

openapi.post('/api/register', RegisterCreate);
openapi.post('/api/report_signal', CatchallCreate);
openapi.post('/api/report_measurement', CatchallCreate);
openapi.post('/secure/get_groups', CatchallCreate);
openapi.post('/secure/delete_group', CatchallCreate);
openapi.post('/secure/delete_manual', CatchallCreate);
openapi.post('/secure/upload_data', CatchallCreate);
openapi.post('/secure/get-users', PendingRegisteredMash);
openapi.post('/secure/toggle-users', CatchallCreate);
openapi.post('/secure/login', SessionCreate);
openapi.post('/secure/edit_sites', CatchallCreate);
openapi.post('/secure/new-user', CatchallCreate);

// Export the Hono app
export default app;
