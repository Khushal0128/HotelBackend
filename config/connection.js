const mongoose = require("mongoose");
const env = require("dotenv");
env.config();
console.log(process.env.URL);
const Db = mongoose.connect(process.env.URL
    // , {useNewUrlParser: true,useUnifiedTopology: true}
);
Db.then(() => {
    console.log(" ============== Connected =============");
}).catch((err) => {
    console.log(err.message);
});

module.exports = { Db };