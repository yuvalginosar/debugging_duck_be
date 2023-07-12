import express from "express";
import cors from "cors";
import chatRoutes from './src/routes/chatRouter.js'

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"] }));

app.use("/", chatRoutes);

app.listen(8000, () => {
    console.log("Listen on the port 8000...");
});