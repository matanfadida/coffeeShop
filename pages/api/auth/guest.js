import { MongoClient, ObjectId } from "mongodb";

async function handlerGuests(req, res) {
  const data = req.body;
  console.log(data.id);

  const client = await MongoClient.connect(
    "mongodb://matan:matanfadida@cluster0-shard-00-00.u8zmn.mongodb.net:27017,cluster0-shard-00-01.u8zmn.mongodb.net:27017,cluster0-shard-00-02.u8zmn.mongodb.net:27017/coffe-database?ssl=true&replicaSet=atlas-lrttc1-shard-0&authSource=admin&retryWrites=true&w=majority"
  );
  
  const db = client.db();

  if (req.method === "POST") {
    const result = await db.collection("guests").insertOne(data);
  }
  if(req.method === "PUT"){
    const result = await db.collection('guests').updateOne(
      { _id:ObjectId(data.id)},
      {
        $set: { guests: data.guest },
        $currentDate: { lastModified: true }
      }
    );
  }

  res.status(201).json({ message: "table successfully !" });
  client.close();
}

export default handlerGuests;
