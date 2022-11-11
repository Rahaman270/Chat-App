const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 4000;

const mangoose = require('mongoose')
const Schema = require('./model')
mangoose.connect('mongodb+srv://ChatApp:SARChatApp@cluster0.tugmcon.mongodb.net/?retryWrites=true&w=majority').then(
    () => console.log('connect')
).catch(err=>console.log(err))



const addMsg = async (name,message)=>{
    try{
        const data = new Schema({name:name,message:message})
      await data.save()
    }catch(err){
console.log(err.message);
    }
}



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/all',async (req,res)=>{
 try {
    const data =await Schema.find({})
    return res.json(data)
 } catch (error) {
    console.log(error.message);
 }
})

const users = {}



io.on('connection',async(socket)=>{
 
    socket.on('new user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user connected', name)
      })

    socket.on('chat message',msg=>{
        socket.broadcast.emit('chat message',{msg:msg,name:users[socket.id]})
        addMsg(users[socket.id],msg)
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('user disconnect',users[socket.id])
    })
})


http.listen(port,()=>{
    console.log(`Socket.IO server running at http://localhost:${port}/`);
})