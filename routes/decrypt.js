const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
const router = express.Router();
var encryptor = require('file-encryptor');


const upload = multer({
    dest: path.join(__dirname, "./tmp")
});

/* GET decrypt page. */
router.get('/decrypt', function (req, res, next) {
    res.render('decrypt');
});

router.post('/decrypt', upload.single("toDecrypt" /* name attribute of <file> element in your form */),
    function (req, res) {
        console.log(req.body);
        const tempPath = req.file.path;
        const decryptedPath = req.file.destination + "\\" + req.body.filename;
        const options = { algorithm: req.body.encryptionType };
        const key = req.body.key;
        console.log('Uploaded!');
        try {
            encryptor.decryptFile(tempPath, decryptedPath, key, options, function (err) {
                if (err) {
                    console.log(err);
                    try {
                        fs.unlinkSync(tempPath);
                        fs.unlinkSync(decryptedPath);
                    } catch (e) {

                    }
                    return res.status(503).json({
                        message: "Key seems to be not correct!"
                    });
                }
                res.download(decryptedPath, req.body.filename, function (err) {
                    console.log("Downloaded");
                    if (err) {
                        console.log(err);
                        try {
                            fs.unlinkSync(tempPath);
                            fs.unlinkSync(decryptedPath);
                        } catch (e) {

                        }
                        res.status(503).json({
                            message: err.message
                        });
                    }
                    try {
                        fs.unlinkSync(decryptedPath);
                    } catch (e) {
                        console.log(e.message);
                    }
                });
                console.log("Decrypted");
                try {
                    fs.unlinkSync(tempPath);
                } catch (e) {
                    console.log(e.message);
                }
            });
        } catch (e) {
            console.log(e.message);
        }

    });
module.exports = router;

