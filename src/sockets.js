import { Server } from 'socket.io';
import Message from "../src/dao/models/chat.model.js"

const initSocket = (httpServer) => {
    let messages = [];
    
    const io = new Server(httpServer);

    io.on('connection', async client => {
        try{ 

            const messages = await Message.find().lean();
            client.emit('chatLog', messages);
            console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);
        } catch (error) {
            console.error('Error al recuperar los mensajes:', error);
        }
        
        
    
        client.on('newMessage', async (data) => {
            try {
                const newMessage = new Message(data);

                await newMessage.save();

                console.log(`Mensaje guardado en la base de datos: ${newMessage.user} ${newMessage.message}`);
            
    
            io.emit('messageArrived', newMessage);
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
        });

        client.on('disconnect', () => {
            console.log(`Cliente desconectado, id ${client.id}`);
        });
    });

    return io;
}

export default initSocket;