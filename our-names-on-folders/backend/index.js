const express = require("express");
const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Server is running and listening on
http://localhost:${port}`);
});
