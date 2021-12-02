const bodyParser = require('body-parser'),
express = require('express'),
app = express(),
http = require("http").createServer(app),
cors = require('cors');

const io = require('socket.io')(http)
/*
const io = require("socket.io")(7254, {
	cors: {
		origin: "https://optimistic-bohr-e15b9b.netlify.app" //http://localhost:8000
	}
});*/

io.on('connection', socket => {
	const id = socket.handshake.query.id
	socket.join(id)

	 // recipients, channelId, sender, date, text
	socket.on('send-message', ({ recipients, channelId, sender, date, text }) => {
		recipients.forEach(recipient => {
			socket.broadcast.to(recipient.id).emit('receive-message', {
				channelId, sender, date, text
			})
		})
	})

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', id)
	})
})

const db = require('./db')
const userRouter = require('./routes/user-router')
const channelRouter = require('./routes/channel-router')
const fileRouter = require('./routes/file-router')

const apiPort = 7252

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.use('/api', userRouter)
app.use('/api', channelRouter)
app.use('/api', fileRouter)

http.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
