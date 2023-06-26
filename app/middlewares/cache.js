const redis = require("redis")
let client



const connectRedis = async () => {
    client = redis.createClient({
        socket: {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST
        }
    })
    await client.connect()
}

connectRedis()

module.exports = {
    getCached: (key) => {
      client.get(key, function(err, reply) {
        if (err) {
          res.status(500).json({
            message: "Something went wrong"
          })
        }
        if (reply == null) {
          next()
        } else {
          res.status(200).json({
            message: `Success Read ${redis_key}`,
            data: JSON.parse(reply)
          })
        }
      });
    },
    caching: (key, data) => {
      client.set(key, JSON.stringify(data) )
    },
    delCache: (key) => {
      client.del(key)
    }
  }