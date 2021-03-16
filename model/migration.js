const MongoDriver = require(`./driver.js`)
const ZSchema = require("z-schema");
const validator = new ZSchema({});

class MongoMigration {

    async getCurrentVersion() {
        try {
            const getVersion = await this.mongoRequest('dbversion', {})
            return getVersion
        } catch (error) {
            console.error(error)
            return error
        }
    }

    testSchema(json, schema) {
        const schemaValid = validator.validate(json, schema)
        var schemaErrors = validator.getLastErrors() // this will return an array of validation errors encountered
        if (schemaValid) {
            return {
                valid: schemaValid,
                errors: null
            }
        } else {
            return {
                valid: schemaValid,
                errors: schemaErrors
            }
        }
    }

    // DATABASE
    async listCollections() {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.listCollections().toArray((err, res) => {
                    if (err) {
                        console.error(err)
                        reject(err)
                    }
                    resolve(res)
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    //COLLECTIONS
    async mongoRequest(collection, query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).find(query).toArray((error, result) => {
                    if (error) {
                        reject(error)
                    }
                    resolve(result)
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }
    async mongoInsert(collection, payload) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).insertOne(payload, function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve('success')
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }
    async mongoInsertMany(collection, payload) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).insertMany(payload, function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve('success')
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    async mongoUpdate(collection, query, values) {
        if (values._id) {
            delete values._id
        }
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).updateOne(query, {
                    $set: values
                }, function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve('success')
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    async mongoUpdateMany(collection, query, values) {
        if (values._id) {
            delete values._id
        }
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).updateMany(query, {
                    $set: values
                }, function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve('success')
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }

    async mongoDelete(collection, query) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).deleteOne(query, function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve("success")
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }
    async mongoDrop(collection) {
        return new Promise((resolve, reject) => {
            try {
                MongoDriver.constructor.db.collection(collection).drop(function(error, result) {
                    if (error) {
                        reject(error)
                    }
                    resolve("success")
                })
            } catch (error) {
                console.error(error)
                reject(error)
            }
        })
    }
}

module.exports = MongoMigration