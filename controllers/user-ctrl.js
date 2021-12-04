const User = require('../models/user-model')

createUser = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
}

// functionName(id, data: { })
updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }

        user.id = body.data.id ? body.data.id : user.id;
        user.pseudo = body.data.pseudo ? body.data.pseudo : user.pseudo;
        user.password = body.data.password ? body.data.password : user.password;
        user.activity = body.data.activity ? body.data.activity : user.activity;
        user.channels = body.data.channels ? body.data.channels : user.channels;

        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (user === null) {
            return  res.status(200).json({ 
                successRequest: true,
                successGet: false,
                user
            })
        }

        return res.status(200).json({
            successRequest: true,
            successGet: true,
            user
        })

    }).catch(err => console.log(err))
}

getUserByPseudo = async (req, res) => {
    await User.findOne({ pseudo: req.params.pseudo }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}


module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByPseudo
}
