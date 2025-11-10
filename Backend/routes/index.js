module.exports = app => {
  require('./participante.routes')(app)
  require('./sorteo.routes')(app)
  require('./usuario.routes')(app)
}
