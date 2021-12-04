const Channel = require('../models/channel-model')

createChannel = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: err,
            message: "Toutes les informations ne sont pas fournies"
        })
    }

    const channel = new Channel(body)

    if (!channel) {
        return res.status(400).json({ success: false, error: err, message: "Toutes les informations ne sont pas fournies" })
    }

    channel
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: channel._id,
                message: "Le canal a été créée",
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: "Une erreur est survenue",
            })
        })
}

// functionName(id, data: { })
updateChannel = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }

        channel.id = body.data.id ? body.data.id : channel.id;
        channel.type = body.data.type ? body.data.type : channel.type;
        channel.recipients = body.data.recipients ? body.data.recipients : channel.recipients;
        channel.messages = body.data.messages ? body.data.messages : channel.messages;

        channel
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'Channel updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Channel not updated!',
                })
            })
    })
}

deleteChannel = async (req, res) => {
    await Channel.findOneAndDelete({ id: req.params.id }, (err, channel) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ success: false, error: `Channel not found` })
        }

        return res.status(200).json({ success: true, data: channel })
    }).catch(err => console.log(err))
}

getChannelById = async (req, res) => {
    await Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, data: channel })
    }).catch(err => console.log(err))
}

module.exports = {
    createChannel,
    updateChannel,
    deleteChannel,
    getChannelById
}
