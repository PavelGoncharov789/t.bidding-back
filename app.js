const express = require('express');
const cors = require('cors');
const events = require('events')
const PORT = 5000;

const emitter = new events.EventEmitter();

const app = express()

app.use(cors())
app.use(express.json())

let counter = 120000;
let userCounter = 0;
const users = ["user1", "user2", "user3"];

const countdown = () => {
    counter = counter-1000;
    if (counter === 0) {
        userCounter++;
        if (userCounter >= users.length) {
            userCounter = 0;
        }
        counter = 120000;
        emitter.emit('newMessage');
    }
}

setInterval(countdown, 1000);

app.get('/connect', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    })
    emitter.on('newMessage', () => {
        res.write(`data: ${JSON.stringify({user: users[userCounter], time: counter})} \n\n`)
    })
})


app.get('/get-time', ((req, res) => {
    res.status(200).json({user: users[userCounter], time: counter});
}))


app.listen(PORT, () => console.log(`server started on port ${PORT}`))
