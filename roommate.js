const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')


const nuevoRoom = async () => {
  try{
    const {data} = await axios.get('https://randomuser.me/api')
    const usuarioRoom = data.results[0]
    const userNew = {
      id: uuidv4().slice(30),
      nombre:`${usuarioRoom.name.first} ${usuarioRoom.name.last}`,
      debe: 0,
      recibe: 0,
    };
    return userNew;
  }catch(e){
    throw e;
  }
};

const guardarRoom = (usuarioRoom) => {
  const roomJSON = JSON.parse(fs.readFileSync('usuarios.json', 'utf8'));
  roomJSON.roommates.push(usuarioRoom)
  fs.writeFileSync('usuarios.json', JSON.stringify(roomJSON, null, 2))
}

const obtenerRoommates = () => {
  const roomJSON = JSON.parse(fs.readFileSync('usuarios.json', 'utf8'));
  if (roomJSON && roomJSON.roommates) return roomJSON.roommates;
  return [];
}

const obtenerUsuarioPorId = (id) => {
  const users = obtenerRoommates();
  return users.find(el => el.id === id)
}


const otroGasto = ()=>{
  const gastoJSON = JSON.parse(fs.readFileSync("./usuarios.json", "utf8"));
  if (gastoJSON && gastoJSON.gastos) return gastoJSON.gastos;
  return [];
}
/*let gastosJSON = JSON.parse(fs.readFileSync('./usuarios.json','utf8'));
let gastos = gastosJSON.gastos; */

module.exports = { nuevoRoom, guardarRoom, obtenerRoommates, obtenerUsuarioPorId, otroGasto}