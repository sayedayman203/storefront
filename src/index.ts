import 'dotenv/config';
import app from './server';

const PORT = process.env.PORT || 3000;

// start the Express server
app.listen(PORT, () => {
  console.log(`server listen at http://localhost:${PORT}/`);
});
