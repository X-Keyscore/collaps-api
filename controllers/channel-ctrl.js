const Channel = require('../models/channel-model')

createChannel = (req, res) => {
    const body = req.body
    if (!body) {
        return res
            .status(400)
            .json({ status: { success: false, message: "Vous devez fournir des données" } })
    }

    const channel = new Channel(body)
    if (!channel) {
        return res
            .status(400)
            .json({ status: { success: false, message: "Vous devez fournir des données valide" } })
    }

    channel
        .save()
        .then(() => {
            return res.status(201).json({
                status: {
                    success: true,
                    message: "Le canal a été créée"
                },
                channel
            })
        })
        .catch(err => {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false, message: "Une erreur est survenue" } })
        })
}

updateChannel = async (req, res) => {
    const body = req.body

    if (!body) {
        return res
            .status(400)
            .json({ status: { success: false, message: "Vous devez fournir des données" } })
    }

    Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false, message: "Une erreur est survenu" } })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ status: { success: false, message: "Le canal n'a pas été trouvé" } })
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
                        status: {
                            success: true,
                            message: "Canal mise à jour"
                        },
                        channel
                    })
            })
            .catch(err => {
                console.log(err)
                return res
                    .status(400)
                    .json({ status: { success: false, message: "Une erreur est survenu" } })
            })
    })
}

getChannelById = async (req, res) => {
    await Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false, message: "Une erreur est survenu" } })
        }

        if (!channel) {
            return res.status(200)
                .json({
                    status:
                    {
                        success: true,
                        message: "Le canal n'a pas été trouvé"
                    },
                    channel: null
                })
        }

        return res.status(200).json({
            status: {
                success: true,
                message: "Canal trouvé"
            },
            channel
        })
    }).catch(err => {
        console.log(err)
        return res
            .status(400)
            .json({ status: { success: false, message: "Une erreur est survenu" } })
    })
}

deleteChannel = async (req, res) => {
    await Channel.findOneAndDelete({ id: req.params.id }, (err, channel) => {
        if (err) {
            return res
                .status(400)
                .json({ status: { success: false, message: "Une erreur est survenu" } })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ status: { success: false, message: "Le canal n'a pas été trouvé" } })
        }

        return res.status(200).json({
            status: {
                success: true,
                message: "Canal supprimé"
            },
        })
    }).catch(err => {
        console.log(err)
        return res
            .status(400)
            .json({ status: { success: false, message: "Une erreur est survenu" } })
    })
}

module.exports = {
    createChannel,

    updateChannel,

    getChannelById,

    deleteChannel
}
