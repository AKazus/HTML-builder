const path = require('node:path');
let fs = require('fs');

let currentFile = path.resolve(__dirname, 'text.txt');

let stream = new fs.ReadStream(currentFile, {encoding: 'UTF-8'});
stream.on('readable', function(){
   let data = stream.read();
   if(data != null) {
      console.log(data);
   }
});

stream.on('error', function(err){
   if(err.code == 'ENOENT'){
       console.log("Файл не найден");
   }else{
       console.error(err);
   }
});


