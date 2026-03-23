//  running server implementing logging and everything else to make server run properly

import app from './app.js';

const PORT = process.env.PORT || 5173;
const host = '0.0.0.0'; 

app.listen(PORT, host, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});