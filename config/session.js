const mongodbStore = require("connect-mongodb-session");

let sessionStore;
function createSessionStore(session) {
    const MongoDBStore = mongodbStore(session);
    sessionStore = new MongoDBStore({
        uri: "mongodb://localhost:27017",
        databaseName: "auth-demo",
        collection: "sessions",
      });
    
    return sessionStore
}

function createSessionConfig() {
    return {
        secret: "super-secret",
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000,
        },
      }
}

module.exports = {
    createSessionStore: createSessionStore,
    createSessionConfig: createSessionConfig,
}
