module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: 'http://104.248.228.225:8000/',
    port: 3010
  }
}
