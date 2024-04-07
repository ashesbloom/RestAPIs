const fs = require('fs');
const path = require('path');

function logappend(file_name){
    return (req,res,next) => {
        const date = new Date().toLocaleDateString(); //getting the date
        const time = new Date().toLocaleTimeString(); //getting the time
        const log =  `Request made at: ${date}|${time}||${req.method}-${req.url}`;  //creating the log
        const filePath = path.join(__dirname, '..', 'server_files', file_name); //creating the file path
        
        fs.appendFile(filePath, log + '\n', (err) => {  //appending the log to the file
            if (err) {
                console.log(err);
            } else {
                console.log('log added at ' + date + ' ' + time + ' in ' + file_name);
                next();
            }
        });
    }
}

//exporting the function
module.exports = {
    logappend
}
