const bodyParser = require('body-parser'),
https = require("https"),
path = require('path'),
fs = require('fs'),
express = require('express'),
cors = require('cors');

const io = require("socket.io")(8722, {
	cors: {
		origin: "https://optimistic-bohr-e15b9b.netlify.app" //http://localhost:8000
	}
});

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

const app = express()
const apiPort = 3000

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

const sslServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)

sslServer.listen(3443, () => console.log('Secure server on port 3443'))
//app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
