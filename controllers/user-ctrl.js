const User = require('../models/user-model')

createUser = (req, res) => {

    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: {
                success: false,
                message: "Vous devez fournir des données"
            }
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({
            status: {
                success: false,
                message: "Vous devez fournir des données valide"
            }
        })
    }

    user
        .save()
        .then(newUser => {
            return res.status(201).json({
                status: {
                    success: true,
                    message: "Utilisateur créé",
                },
                newUser
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({
                status: {
                    success: false,
                    message: "Une erreur est survenu"
                }
            })
        })
}

updateUser = async (req, res) => {

    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: {
                success: false,
                message: 'Vous devez fournir des données',
            }
        })
    }

    await User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: {
                    success: false,
                    message: "Une erreur est survenu"
                }
            })
        }

        if (!user) {
            return res.status(404).json({
                status: {
                    success: false,
                    message: "L'utilisateur n'a pas été trouvé"
                }
            })
        }

        user.pseudo = body.pseudo ? body.pseudo : user.pseudo;
        user.password = body.password ? body.password : user.password;
        user.activity = body.activity ? body.activity : user.activity;
        user.channels = body.channels ? body.channels : user.channels;

        user
            .save()
            .then(() => {
                return res.status(200).json({
                    status: {
                        success: true,
                        message: "Utilisateur mise à jour"
                    },
                    user
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: {
                        success: false,
                        message: "Une erreur est survenu"
                    }
                })
            })
    })
}

getUserById = async (req, res) => {
    await User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: {
                    success: false,
                    message: "Une erreur est survenu"
                }
            })
        }

        if (user === null) {
            return res.status(200).json({
                status: {
                    success: true,
                    message: "L'utilisateur n'a pas été trouvé"
                },
                user: null
            })
        }

        return res.status(200).json({
            status: {
                success: true,
                message: "Utilisateur trouvé"
            },
            user
        })
    }).catch(err => console.log(err))
}

getUserByPseudo = async (req, res) => {
    await User.findOne({ pseudo: req.params.pseudo }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: {
                    success: false,
                    message: "Une erreur est survenu"
                }
            })
        }

        if (!user) {
            return res.status(200).json({
                status: {
                    success: true,
                    message: "L'utilisateur n'a pas été trouvé"
                },
                user: null
            })
        }

        return res.status(200).json({
            status: {
                success: true,
                message: "Utilisateur trouvé"
            },
            user
        })
    }).catch(err => console.log(err))
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: {
                    success: false,
                    message: "Une erreur est survenu"
                }
            })
        }

        if (!user) {
            return res.status(404).json({
                status: {
                    success: false,
                    message: "L'utilisateur n'a pas été trouvé"
                }
            })
        }

        return res.status(200).json({
            status: {
                success: true,
                message: "Utilisateur supprimé"
            }
        })
    }).catch(err => console.log(err))
}


module.exports = {
    createUser,

    updateUser,

    getUserById,
    getUserByPseudo,

    deleteUser
}
