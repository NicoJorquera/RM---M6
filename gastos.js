const axios = require('axios')
const fs = require('fs')

const guardarGasto = (usuarioGasto) => {
  const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
  if(!gastosJSON.gastos) gastosJSON.gastos = [];

  gastosJSON.gastos.push(usuarioGasto)
  fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON, null, 2))
}

module.exports = { guardarGasto }