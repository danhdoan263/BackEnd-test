
import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

let instanceDb = null
// tạo kết nối api driver tới mongodb cluster
// serverAPI bắt buộc. trong trường hợp nâng cấp hoặc thay đổi cluster 
// hay thay đổi giữa các version không làm gián đoạn hay ngừng kết nối ứng dụng

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})


// connect DB
export const CONNECT_DB = async () => {
    await mongoClientInstance.connect()

    //sau khi kết nối tới cluster thì thực hiện lấy database cụ thể từ MONGODB_NAME
    instanceDb = mongoClientInstance.db(env.MONGODB_NAME)
}
// ngắt kết nối DB
export const CLOSE_DB = async () => {
    await mongoClientInstance.close()
}
export const GET_DB = () => {
    // nếu instanceDb chưa kết nối thành công thì return lỗi
    if (!instanceDb) throw new Error('database not connected! please check connection')
    return instanceDb
}