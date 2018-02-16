const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = "myproject";
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  //read json data from files
var fs = require('fs');

 var contents = fs.readFileSync("m3-customer-data.json");
 var custData = JSON.parse(contents);

 var contents1 = fs.readFileSync("m3-customer-address-data.json");
 var custDataAddr = JSON.parse(contents1);
 
const db = client.db(dbName);

//display merged json content
var mergedData;
for(var i=0;i<custData.length;i++){
var output = Object.assign(custData[i],custDataAddr[i],null);
	//console.log("merged obj::"+JSON.stringify(output));
	mergedData+=JSON.stringify(output);
}

//inserting docs parallelly using async library

var async = require('async');

async.parallel(function(callback) {
	//insert logic
	console.log("inserting data:::");
	const collection = db.collection("documents");
  // Insert some documents
  collection.insertOne(
    mergedData
  , function(err, result) {
    console.log("Inserted documents into the collection");
    db.close();
  });    
}, function done(err, results) {
	if (err) {
		throw err;
	}
	console.log("done");
});
client.close();
});