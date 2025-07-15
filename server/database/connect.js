const mongoose = require ('mongoose');

const ConnectDB = (url) => {
    mongoose.set('strictQuery', true);

    mongoose.connect(url)
        .then(()=>console.log("Connected"))
        .catch((error)=>console.log(error));
}

module.exports = ConnectDB;