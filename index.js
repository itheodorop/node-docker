const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
const cors = require("cors");


const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP, 
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT, 
    SESSION_SECRET,
} = require("./config/config");

let redisClient = redis.createClient({
    legacyMode: false,
    host: REDIS_URL,
    port: REDIS_PORT
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

/*mongoose
    .connect("mongodb://sanjeev:mypassword@172.29.0.2:27017/?authSource=admin")
    .then(() => console.log("succesfully connected to MongoDB"))
    .catch((e) => console.log(e))
*/

/*
mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(() => console.log("succesfully connected to MongoDB"))
    .catch((e) => console.log(e))
*/

/*const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("succesfully connected to MongoDB"))
.catch((e) => console.log(e))
*/

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            //useFindAndModify: false
        })
        .then(() => console.log("succesfully connected to MongoDB"))
        .catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 5000);
        });
}

connectWithRetry();

// Middlewares

app.enable("trust proxy"); // for production environments with nginx 
app.use(
    cors({
        
    }));
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,            
      cookie: { 
        //path: '/', 
        //saveUninitialized: false,        
        //resave: false,
        httpOnly: true, 
        secure: false, 
        maxAge: 60000 }
    })
)

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi There and pare !!!</h2>");
    console.log("yeah it ran !!!");
})

//localhost:4000/api/v1/posts
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => 
    // console.log('listening on port: %d', port)
    console.log(`listening on port ${port}`)
);