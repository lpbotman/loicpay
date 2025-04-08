const express = require('express');
const cors = require('cors');
const paymentBatchRoutes = require('./routes/paymentBatchRoutes');
const path = require('path');

const app = express();
const PORT = 3000;

// Autoriser les appels depuis le frontend Angular
app.use(cors());
app.use(express.json({ limit: '100mb' }));
// Init SQLite


app.use('/api', paymentBatchRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// Rediriger toutes les routes vers index.html
app.all('/{*any}', (req, res, next) => {
    const indexPath = path.join(__dirname, 'public/index.html');
    console.log('Trying to serve index from:', indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('File sent successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
