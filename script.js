const fs = require('fs');
const http = require('http');
const url = require("url");
const { nuevoRoom, guardarRoom, obtenerUsuarioPorId, otroGasto} = require('./roommate')
const { guardarGasto} = require('./gastos')

const PORT = 3000

fs.writeFileSync('usuarios.json', JSON.stringify({ roommates: [] }, null, 2))
fs.writeFileSync('gastos.json', JSON.stringify({ gastos: [] }, null, 2))


http.createServer(async (req, res) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000);

  if(req.url == '/' && req.method == 'GET'){
    res.setHeader('Content-type', 'text/html');
    return res.end(fs.readFileSync('./index.html', 'utf8'));
  }

  if(req.url == '/style.css' && req.method == 'GET'){
    return res.end(fs.readFileSync('./style.css', 'utf8'));
  }

  if(req.url.startsWith('/roommate') && req.method == 'POST'){
    const usuarioRoom = await nuevoRoom().catch(e => { return; })
    if (!usuarioRoom) {
      console.log('Error en agregar un Roommate nuevo', e)
      res.statusCode = 500;
      return res.end();
    }
    guardarRoom(usuarioRoom);
    return res.end(JSON.stringify(usuarioRoom, null, 2))
  }
  if(req.url.startsWith('/roommates') && req.method == 'GET'){
    res.setHeader('Content-type', 'application/json');
    return res.end(fs.readFileSync('./usuarios.json', 'utf8'))
  }

  if(req.url.startsWith('/gastos') && req.method == 'GET'){
    res.setHeader('Content-type', 'application/json');
    return res.end(fs.readFileSync('./gastos.json', 'utf8'))
  }

  if(req.url.startsWith('/gasto') && req.method == 'POST') {
    req.on("data", (payload) => {
      const body = JSON.parse(payload);

      const user = obtenerUsuarioPorId(body.roommate)
      if (!user) {
        res.write(`El usuario ${body.roommate} no existe`)
        return res.end();
      }

      guardarGasto({
        userId: user.id,
        nombre: user.nombre,
        descripcion: body.descripcion,
        monto: body.monto
      })
      res.end()
    });
  }

  if(req.url.startsWith("/gasto") && req.method == "PUT"){
    let body;

// Traer el id a través de query strings
const { id } = url.parse(req.url, true).query;

req.on('data',(payload) => {
    const body = JSON.parse(payload);
    body.id = id;
});

req.on('end', () => {
    otroGasto() = gastos.map((g) => {
        if ( g.id == body.id){
            return body;
        }
        return g;
    });

    fs.writeFileSync('./gastos.json',JSON.stringify(gastosJSON, null,2));
    res.end()
})
}

/*if(req.url.startsWith("/gasto") && req.method == "DELETE"){
    const {id} = url.parse(req.url,true).query;
    gastosJSON.gastos = gastos.filter((costo) => costo.id !== id);
    fs.writeFileSync("./gastos.json", JSON.stringify(gastosJSON, null,2));
    res.end();
  }
  res.statusCode = 404;
  res.end();*/ 

}).listen(PORT, ()=> console.log(`escuchando puerto ${PORT}`))

/*---------------------------------------------------------- */



/*let body;

// Traer el id a través de query strings
const { id } = url.parse(req.url,true).query;

req.on('data',(payload) => {
    body = JSON.parse(payload);
    body.id = id;
});

req.on('end', () => {
    gastosJSON.gastos = gastos.map((g) => {
        if ( g.id == body.id){
            return body;
        }
        return g;
    });

    fs.writeFileSync('./archivos/gastos.json',JSON.stringify(gastosJSON,null,1));
    res.end()
}) */