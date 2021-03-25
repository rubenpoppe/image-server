const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.static('public', {
    setHeaders: (res, path, status) => {
        res.set('Content-Disposition', 'attachment');
    }
}));
app.use(cors());
app.disable('x-powered-by');

const upload = multer({
    storage: multer.diskStorage({
        destination: 'public/img/',
        filename: (req, file, cb) => cb(null, `${nanoid(16)}.jpg`)
    })
});

app.post('/upload', upload.array('images'), (req, res) => {
    res.status(200).json(req.files.map(x => ({ [x.originalname]: `/img/${x.filename}` })));
});

app.listen(3001);