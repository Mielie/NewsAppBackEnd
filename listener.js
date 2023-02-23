const app = require("./app");

const { PORT = 10000 } = process.env;

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
