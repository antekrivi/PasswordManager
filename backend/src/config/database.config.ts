import { connect, ConnectOptions } from "mongoose"

const MONGO_URI = "mongodb+srv://antekrivacic:H528TD-HaC.9rUi@zavrsni.5dvmgfs.mongodb.net/?retryWrites=true&w=majority&appName=zavrsni";


export const dbConnect = () => {
    connect(MONGO_URI, {} as ConnectOptions).then(
        () => console.log("Connected successfully!"),
        (erorr) => console.log(erorr)
    )
}