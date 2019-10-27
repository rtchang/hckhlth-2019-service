module.exports = class Dao {
	constructor(client, url, collection) {
		this.client = client
		this.url = url
		this.collection = collection
	}

	getClient(onSuccess) {
		MongoClient.connect(this.url, (err, client) => {
		  assert.equal(null, err);
		  console.log("Connected successfully to server");
		 
		  const db = client.db(dbName);
		  onSuccess(db)
		 
		  client.close();
		})
	}

	insertMany(models) {
		return new Promise((resolve, reject) => {
			this.getClient((db) => {
				const collection = db.collection(this.collection)
				collection.insertMany(models, (err, result) => {
					if (err) {
						reject(err)
						return
					}

					resolve(result)
				})
			})
		})
	}

	findAll() {
		return new Promise((resolve, reject) => {
			this.getClient((db) => {
				const collection = db.collection(this.collection)
				collection.find({}).toArray((err, docs) => {
					if (err) {
						reject(err)
						return
					}

					resolve(docs)
				})
			})
		})
	}

	get(id) {
		return new Promise((resolve, reject) => {
			this.collection.find({'id': id}).toArray(function(err, docs) {
				if (err) {
					reject(err)
					return
				}

			    resolve(docs)
		 	 })
		})
	}
}