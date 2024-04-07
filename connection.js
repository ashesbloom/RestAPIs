const mongo = require('mongoose');

async function connect_database(url){
    return mongo.connect(url)
        .catch(error => console.error(error));
};
module.exports = {
    connect_database
}