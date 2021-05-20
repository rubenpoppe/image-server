const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { unlink } = require('fs/promises');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(
	express.static('public', {
		setHeaders: (res, path, status) => {
			res.set('Content-Disposition', 'attachment');
		},
	})
);
app.use(cors());
app.disable('x-powered-by');

const upload = multer({
	storage: multer.diskStorage({
		destination: 'public/img/',
		filename: (req, file, cb) => cb(null, `${nanoid(16)}.jpg`),
	}),
});

app.post('/upload', upload.array('images'), (req, res) => {
	res
		.status(200)
		.json(req.files.map((x) => ({ [x.originalname]: `/img/${x.filename}` })));
});

app.delete('/img/:path', async (req, res) => {
	try {
		await unlink(`public/img/${req.params.path}`);
		res.status(204).json(`${req.params.path} deleted`);
	} catch (err) {
		res.status(500).json('something went wrong');
	}
});

if (process.env.HTTPS) {
	const server = https.createServer(
		{
			cert: fs.readFileSync(process.env.CERT_PATH),
			key: fs.readFileSync(process.env.KEY_PATH),
			...(process.env.CA_CERT_PATH && {
				ca: fs.readFileSync(process.env.CA_CERT_PATH),
			}),
		},
		app
	);

	server.listen(process.env.PORT || 3001);
} else {
	app.listen(process.env.PORT || 3001);
}
