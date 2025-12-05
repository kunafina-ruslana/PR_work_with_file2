const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/upload', upload.single('filedata'), (req, res) => {
    res.redirect('/list');
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'files.html'));
});

app.get('/api/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) return res.status(500).json({ error: 'Ошибка при чтении файлов' });
        res.json({ files: files });
    });
});

app. listen(PORT, () => {
    console.log(`Cервер: http://localhost:${PORT}`);
    if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
});