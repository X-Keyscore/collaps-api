const Channel = require('../models/channel-model')
const User = require('../models/user-model')

createChannel = async (req, res) => {
    const body = req.body
    if (!body) {
        return res
            .status(400)
            .json({ status: { success: false, msg: "Erreur requête" } })
    }

    // Recherche du pseudo dans la BBD
    await User.findOne({ id: body.client.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: { success: false, msg: "Erreur requête" }
            })
        }

        if (!user) {
            return res.status(404).json({
                status: { success: false, msg: "Utilisateur introuvable" }
            })
        }

        if (user.token !== body.client.token) {// test Token
            return res.status(401).json({
                status: { success: false, msg: "Token invalide" }
            })
        }
    }).catch(err => console.log(err))
    const channel = new Channel(body.channel)
    if (!channel) {
        return res
            .status(400)
            .json({ status: { success: false } })
    }

    channel
        .save()
        .then(() => {

            return res.status(201).json({
                status: { success: true },
                channel
            })
        })
        .catch(err => {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false } })
        })

    /*
    User.findOne({ id: body.recipient.id }, (err, recipient) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: { success: false, msg: "Erreur requête" }
            })
        }

        if (!recipient) {
            return res.status(404).json({
                status: { success: false, msg: "Utilisateur introuvable" }
            })
        }

        recipient
            .save()
            .then(() => {
                return res.status(200).json({
                    status: { success: true, msg: "" },
                    recipient
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({
                    status: { success: false, msg: "Erreur serveur" }
                })
            })
    })
    */


}
// Request { client, recipient, channel }
// Response { status: { success, idValide, tokenValide}, client }

updateChannel = async (req, res) => {
    const body = req.body

    if (!body) {
        return res
            .status(400)
            .json({ status: { success: false } })
    }

    Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false } })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ status: { success: false } })
        }

        channel.type = body.data.type ? body.data.type : channel.type;
        channel.recipients = body.data.recipients ? body.data.recipients : channel.recipients;
        channel.messages = body.data.messages ? body.data.messages : channel.messages;

        channel
            .save()
            .then(() => {
                return res
                    .status(200)
                    .json({
                        status: { success: true },
                        channel
                    })
            })
            .catch(err => {
                console.log(err)
                return res
                    .status(400)
                    .json({ status: { success: false } })
            })
    })
}

getChannelById = async (req, res) => {
    await Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false } })
        }

        if (!channel) {
            return res.status(200)
                .json({
                    status:
                        { success: true },
                    channel: null
                })
        }

        return res.status(200).json({
            status: { success: true },
            channel
        })
    }).catch(err => {
        console.log(err)
        return res
            .status(400)
            .json({ status: { success: false } })
    })
}

deleteChannel = async (req, res) => {
    await Channel.findOneAndDelete({ id: req.params.id }, (err, channel) => {
        if (err) {
            return res
                .status(400)
                .json({ status: { success: false } })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ status: { success: false } })
        }

        return res.status(200).json({
            status: { success: true },
        })
    }).catch(err => {
        console.log(err)
        return res
            .status(400)
            .json({ status: { success: false } })
    })
}

module.exports = {
    createChannel,

    updateChannel,

    getChannelById,

    deleteChannel
}
