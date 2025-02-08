const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./src/routes/routes");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require('path');
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
dotenv.config();

const server = http.createServer(app);
const io = socketIo(server)

// Middleware
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


global.adminSocketId = null;
//Socket IO connection event 
io.on("connection", async(socket) => {
    console.log("A user connected",socket.id);

    socket.on("adminConnected", () => {
        global.adminSocketId = socket.id;
        console.log("Admin connected:", global.adminSocketId);
      });

    socket.on("disconnect", ()=> {
        console.log("A user disconnected",socket.id);
        if (socket.id === global.adminSocketId) {
            global.adminSocketId = null;
          }
    });
})

app.use((req, res, next) => {
    req.io = io;
    next();
});

//routes
app.use('/getFiles', express.static(path.join(__dirname, '')));
app.use('/', routes);

app.get("/", (request, response) => {
    response.status(200).json({
        message: "Gaming backend is running 🏃‍♂️🏃‍♂️",
    });
});


//if routes not found 
app.get('*', function (req, res) {
    res.status(404).json({ 'message': "Route not found" });
});
app.post('*', function (req, res) {
    res.status(404).json({ 'message': "Route not found" });
});

// Handle shutdown gracefully by disconnecting from the database
process.on('SIGINT', async () => {
    process.exit(0);
});

// listen on PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🏃‍♂️`);
});