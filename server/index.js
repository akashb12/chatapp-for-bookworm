const express = require("express");
const app = express();
const path = require("path");
const { Chat } = require("./models/Chat")
const { User } = require("./models/User")
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('database Connected...'))
  .catch(err => console.log(err));

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/chats', require('./routes/chats'));
io.on("connection", socket => {
  socket.on("Input Chat Message", data => {
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000 * +5.5));
    var ist = nd.toLocaleString();
    connect.then(db => {
      try {
        const datas = {
          messages: {
            message: data.chatMessage,
            type: data.type,
            nowTime: ist,
            sender: {}
          },
          sender: data.userId,
          ids: data.ids,
          chatWith:data.ids[1],
          chatStartedBy:data.ids[0]
        }

        User.findOne({ _id: datas.sender }, (err, user) => {
          if (err) return res.json({ success: false, err });
          datas.messages.sender = user
          Chat.findOneAndUpdate(
            { "ids": { "$all": datas.ids } },
            { $push: { messages: datas.messages } },
            { new: true },
          )
            .exec(function (err, chat) {
              if (err) {
                // ...
              } else if (chat) {
                return io.emit("Output Chat Message", chat)

              }
              else {
                let chat = new Chat({
                  messages: datas.messages,
                  ids: datas.ids,
                  chatWith:datas.chatWith,
                  chatStartedBy:datas.chatStartedBy
                })
                chat.save((err, doc) => {
                  if (err) return res.json({ status: false, error: err });
                  Chat.find({ _id: doc._id })
                  .populate('chatWith')
                    .exec((err, doc) => {
                      return io.emit("Output Chat Message", doc)
                    })
                })
              }
            });
        });
      } catch (error) {
        console.error(error)
      }
    })
  })

  socket.on('typing', data => {
    socket.broadcast.emit('typing', { userName: data.userName })
  })
})

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});