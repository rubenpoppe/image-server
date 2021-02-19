const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(express.static('public'));
app.use(cors());

const upload = multer({
    storage: multer.diskStorage({
        destination: 'public/img/',
        filename: (req, file, cb) => cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.jpg`)
    })
});

app.post('/upload', upload.array('images'), (req, res) => {
    res.status(200).json(req.files.map(x => ({ [x.originalname]: `/img/${x.filename}` })));
});

app.listen(3001);