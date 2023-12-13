const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://balrampandey:CxT2K9kzeLJu9gWA@dashboard.blw2pzp.mongodb.net/Dashboard?retryWrites=true&w=majority')
.then(()=>{})
.catch(
    (err)=>{console.log(err)}
)