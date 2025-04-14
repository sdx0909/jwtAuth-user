// 1 : requiring the 'app' module from 'app.js
const app = require("./app");

// 2 : accessing the PORT number in .env file
const PORT = process.env.PORT;

// 3 : bind and listen for connections on a specified host and port.
app.listen(PORT, () => {
  console.log(`server is running at >   http:localhost:${PORT}`);
});
