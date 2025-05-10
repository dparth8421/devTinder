const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://parthd8421:LMzaan2mlLsJLQmv@devtinder.toj7tss.mongodb.net/";
const client = new MongoClient(url);

const dbName = "HellloWorld";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("User");

  // the following code examples can be pasted here...
  const insertResult = await collection.insertMany([
    {
      firstName: "Parth",
      lastName: "Deshapande",
      age: "26",
    },
  ]);
  console.log("Inserted documents =>", insertResult);
  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
