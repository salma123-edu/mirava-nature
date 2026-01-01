const app = require('./api/index');
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Serveur local démarré sur http://localhost:${port}`);
});
