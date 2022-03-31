module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer:{
    proxy: 'http://147.182.226.155:8000/',
    port: 3000
  }
}
