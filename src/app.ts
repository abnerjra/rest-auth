import { envPlugin } from "./config/plugins/env.plugin";
import { MongoDatabase } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
    main()
})()

async function main() {
    await MongoDatabase.connect({
        mongoUrl: envPlugin.MONGO_URL,
        dbName: envPlugin.MONGO_DB_NAME
    });

    const server = new Server({
        port: envPlugin.PORT,
        routes: AppRoutes.routes
    });

    server.start()
}