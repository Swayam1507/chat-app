const mongoose = require('mongoose');

const connect=()=>{
    mongoose.connect('mongodb://localhost:27017/my_database', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const db = mongoose.connection;
    
    db.on('error', (err) => {
      console.error(err.message);
    });
    
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });

}
module.exports=connect
