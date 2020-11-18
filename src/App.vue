<template>
  <v-app>
    <v-container grid-list-md class="center">
      <v-list class="text-center">
        <v-list-item v-for="word in wordList" :key="word.id">
          {{ word }}
        </v-list-item>
      </v-list>
      <div class="CaBFont">{{ wordPlayed }}</div>
      <v-spacer></v-spacer>
      <v-text-field class="w-80" v-model="wordInput" @keypress.enter="addWord(wordInput)"> </v-text-field>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',

  components: {},

  data: () => ({
    wordInput: '',
    wordList: [],
    textTyping: '',
    rdmWord: '',
    refWord: '',
    isTyping: false,
    wordPlayed: '',
    computerTurn: true,
    index: 0,
    apiKey: 'IqzLv8qEfjZyEG1gXUiDw-X5oAgX5wWe',

    //Points
    playerPoints: 0,
    comPoints: 0,
    calcPoints: 0,

    //Audios
    keyStroke: new Audio(require('./assets/keyStroke.mp3')),
  }),
  methods: {
    getWord() {
      axios
        .get(
          'https://api.dicolink.com/v1/mots/motauhasard?avecdef=false&minlong=4&maxlong=-1&verbeconjugue=false&api_key=' +
            this.apiKey
        )
        .then((response) => {
          this.isValidWord(response.data[0].mot)
          // let word = response.data[0].mot
          // this.textType(word)
        })
    },
    isValidWord(word) {
      axios
        .get('https://api.dicolink.com/v1/mot/' + word + '/scorescrabble?api_key=' + this.apiKey)
        // .get('https://api.dictionaryapi.dev/api/v2/entries/fr/' + word)
        .then((response) => {
          if (response.data.error !== undefined) {
            // Le mot est inconnu
            console.log("Ce mot n'existe pas... tête de fion.")
          } else {
            // Le mot est reconnu
            this.textType(word)
            console.log(response.data.score)
            this.calcPoints = response.data.score

            console.log(word)
            // addWord(wordInput)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    comPlay() {
      if (this.isTyping === false) {
        setTimeout(this.getWord(), 4000)
      }
    },
    addWord(word) {
      console.log(word)
      this.computerTurn = false
      this.isValidWord(word)
    },
    randomDelay(max) {
      return Math.floor(max * Math.random())
    },

    // Fonction du dispay de l"écriture
    typeWriter(word) {
      if (this.wordInput === '') {
        this.wordInput = word
      }

      if (this.index === 0) {
        this.refWord = this.wordInput
        this.refWord = this.removeAccents(this.refWord)
      }
      this.wordInput = ''

      if (this.index < this.refWord.length) {
        this.isTyping = true
        console.log(this.index)
        this.wordPlayed = this.wordPlayed + this.refWord.charAt(this.index)
        this.index++
        this.keyStroke.play()
        this.isTyping = true
        setTimeout(this.typeWriter, this.randomDelay(300))
      } else if (this.index === this.refWord.length) {
        // Le typing du mot est terminé

        this.wordList.push(this.refWord)
        this.refWord = ''
        this.isTyping = false
        this.index = 0
        this.isTyping = false

        if (this.computerTurn === true) {
          this.computerTurn = false
          this.comPoints += this.calcPoints
        } else {
          this.playerPoints += this.calcPoints
          this.computerTurn = true
          this.comPlay()
        }
        console.log('terminé')
        this.calcPoints = 0
        // this.comPlay()
      }
    },
    textType(word) {
      // axios
      //   .get('https://api.dicolink.com/v1/mot/' + word + '/scorescrabble?api_key=' + this.apiKey)
      //   .then((response) => {
      //     console.log(response.)
      //   })
      this.wordPlayed = ''
      this.typeWriter(word)
    },
    removeAccents(str) {
      var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž'
      var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz'
      str = str.split('')
      var strLen = str.length
      var i, x
      for (i = 0; i < strLen; i++) {
        if ((x = accents.indexOf(str[i])) != -1) {
          str[i] = accentsOut[x]
        }
      }
      return str.join('')
    },
  },
  created() {
    this.comPlay()
  },
}
</script>
<style lang="stylus">
// @import url('./assets/doctor punk.otf')
@import url('//db.onlinewebfonts.com/c/0541dc5e4a0066762f6473dbe1c28092?family=JD + Scarabeo')

@font-face
  font-family 'JD Scarabeo' // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.eot"); src: url("//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.eot?#iefix") format("embedded-opentype"), url("//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff2") format("woff2"), url("//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff") format("woff"), url("//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf") format("truetype"), url("//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo") format("svg"); }
  src url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg') // db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.woff') format('woff'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.ttf') format('truetype'), url('//db.onlinewebfonts.com/t/0541dc5e4a0066762f6473dbe1c28092.svg#JD Scarabeo') format('svg')

html
  .CaBFont
    font-family 'JD Scarabeo'
    font-size 60px
</style>
