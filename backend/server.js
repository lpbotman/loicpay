const express = require('express');
const cors = require('cors');
const paymentBatchRoutes = require('./routes/paymentBatchRoutes');

const app = express();
const PORT = 3000;

// Autoriser les appels depuis le frontend Angular
app.use(cors());
app.use(express.json({ limit: '100mb' }));
// Init SQLite


app.use('/api', paymentBatchRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
