module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    disableHostCheck: true
    // proxy: {
    //   "/services": {
    //     target:
    //       "http://pno-pc.levallois.eudoweb.com" +
    //       "/Specif/EUDO_EXTENSION_ENQUETE/root/SectionORM/modules/enquete"
    //   }
    // }
  }
}