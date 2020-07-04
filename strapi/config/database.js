module.exports = ({ env }) => ({
  "defaultConnection": "default",
  "connections": {
    "default": {
      "connector": "mongoose",
      "settings": {
        "uri": "mongodb://shawnleske:wfSWvMcjYhUYW3k@svkarow-shard-00-00.bdyot.mongodb.net:27017,svkarow-shard-00-01.bdyot.mongodb.net:27017,svkarow-shard-00-02.bdyot.mongodb.net:27017/strapi?ssl=true&replicaSet=atlas-790n33-shard-0&authSource=admin&retryWrites=true&w=majority"
      },
      "options": {
        "ssl": true
      }
    }
  }
}
);
