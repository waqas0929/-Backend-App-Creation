import "dotenv/config"

import express from "express"
import userRouter from "./routes/userRoutes.js"
import { connectDB } from "./db/config.js"
import syncDb from "./db/init.js"




const app = express();

app.use(express.json());

app.use(userRouter)
connectDB()
syncDb()

app.listen(3000, () => {
    console.log("Server Started")
})