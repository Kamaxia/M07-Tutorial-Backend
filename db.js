const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://sdev255:sdev255@songdb.hw1e0cp.mongodb.net/?retryWrites=true&w=majority&appName=SongDB",
{useNewUrlParser: true})

module.exports = mongoose