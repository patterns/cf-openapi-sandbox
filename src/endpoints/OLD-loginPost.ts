import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../types";

export class LoginPost extends OpenAPIRoute {
    schema = {
        tags: ["Login"],
        summary: "User Log in",
        request: {
            body: z.object({
                username: Str({ description: "username" }),
                password: Str({ description: "password" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns if the login was ",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    data: Str(),
                                }),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        // Get validated data
        const data = await this.getValidatedData<typeof this.schema>();

        // Retrieve the validated slug
        const { username, password } = data.body;

        // Implement your own object deletion here

        // Return the output for confirmation
        return {
            result: {
                data: "success",
            },
            success: true,
        };
    }
}
