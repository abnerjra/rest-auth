import { envPlugin } from "./config/plugins/env.plugin";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
    main()
})()

function main() {
    const server = new Server({
        port: envPlugin.PORT,
        routes: AppRoutes.routes
    });

    server.start()
}