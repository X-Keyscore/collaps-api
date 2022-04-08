const path = require('path');
const fs = require('fs')
const multer = require('multer');

const dir = path.join(__dirname + '/../');

createFile_avatar = (req, res) => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir + `public/avatars/`)
        },
        filename: (req, file, cb) => {
            // Jsp, Name file
            cb(null, file.originalname)
        }
    });

    const upload = multer({ storage }).array('file');

    upload(req, res, (err) => {
        if (err) {
            return res
                .status(500)
                .json({ status: { success: false, message: "Une erreur est survenu" } })
        }
        // Le fichier a été upload avec succès
        return res.status(200)
            .send(req.files)
    })

}

getFileById_avatar = async (req, res) => {
    var options = {
        root: dir + 'public/avatars/'
    };

    // Chemin du fichier 'avatar' et lecture du fichier
    const files = fs.readdirSync(dir + 'public/avatars/')

    // Si "tofindAvatar" reste à zéro je renvoie l'avatar par défaut
    var tofindAvatar = 0

    // Je boucle les images
    for (const file of files) {
        // Je divise le nom de l'extension
        const fileId = file.split('.');

        // Je teste si l'id correspond a celle du nom
        if (req.params.id == fileId[0]) {
            return res.status(200).sendFile(file, options, function (err) {
                if (err) {
                    console.log("Une erreur est survenu")
                } else {
                    // Le fichier a été envoyer avec succès
                    console.log("Fichier envoyer avec succès")
                }
            });
        } else {
            tofindAvatar = tofindAvatar + 1
        }
    }
    if (files.length === tofindAvatar) {
        return res.status(200).sendFile('default_avatar.png', options, function (err) {
            if (err) {
                return console.log("Une erreur est survenu")
            } else {
                // Le fichier a été envoyer avec succès
                return console.log("Fichier envoyer avec succès")
            }
        });
    }
}

deleteFileById_avatar = (req, res) => {
    // Chemin du fichier 'avatar' et lecture du fichier
    const files = fs.readdirSync(dir + 'public/avatars/')

    // Extensions disponibles
    const extensionTable = ['.jpg', '.jpeg', '.png', '.gif']
    // Je boucle toutes les extensions
    var i = 0
    for (const extension of extensionTable) {
        if (files.find(element => element == `${req.params.id}${extension}`)) {
            // Suppression du fichier
            fs.unlink(`${dir}public/avatars/${req.params.id}${extension}`, function (err) {
                if (err) {
                    return res
                        .status(500)
                        .json({ status: { success: false, message: "Une erreur est survenu" } })
                } else {
                    // Le fichier a été supprimé avec succès
                    return res
                        .status(200)
                        .json({
                            status: {
                                success: true,
                                message: "Fichier supprimé avec succès"
                            }
                        })
                }
            });
        } else {
            i++
            console.log(i)
            if (extensionTable.length === i) {
                return res.status(200).json({
                    status: {
                        success: true,
                        message: "Aucune image n'a été trouvé"
                    }
                })
            }
        }
    }
}

module.exports = {
    createFile_avatar,

    getFileById_avatar,
    
    deleteFileById_avatar
}
