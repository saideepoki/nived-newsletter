import mongoose from "mongoose";

type ConnectionObject  = {
    isConnected?: number
}

const connection: ConnectionObject = {};


export async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to Database");
        return;
    }
    try{
       const db = await mongoose.connect(process.env.MONGODB_URI ?? "",{}); // connecting db
       connection.isConnected = db.connections[0].readyState; // take connection from
       console.log("Database Connected Successfully");
    } catch(error) {
          console.log("Database connection failed",error);
          process.exit(1);
    }
}

