const userSchema = new mongoose.Schema({
    id: String,
    role: String,
    fullName: String,
    phoneNum_unique: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    address: String,
    balance: Number,
});