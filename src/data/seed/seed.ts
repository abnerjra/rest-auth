import { envPlugin } from "../../config"
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";

(async () => {
    await MongoDatabase.connect({
        dbName: envPlugin.MONGO_DB_NAME,
        mongoUrl: envPlugin.MONGO_URL
    });

    await main();

    await MongoDatabase.disconnect();
})()

const randomBetween0AndX = (x: number) => {
    return Math.floor(Math.random() * x)
}

async function main() {
    // 1.- Empty database
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ])

    // 2.- Create users
    const users = await UserModel.insertMany(seedData.users);

    // 3.- Create products
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => {
            return {
                ...category,
                user: users[0]._id
            }
        })
    )

    // 4.- Create products
    const products = await ProductModel.insertMany(
        seedData.products.map(product => {
            return {
                ...product,
                user: users[randomBetween0AndX(seedData.users.length - 1)]._id,
                category: categories[randomBetween0AndX(seedData.categories.length - 1)]._id,
            }
        })
    )

    console.log('Seeder completed successfully')
}