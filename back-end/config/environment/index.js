import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 5050;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

export { PORT, HOSTNAME };