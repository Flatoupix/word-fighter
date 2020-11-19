<template>
  <v-app>
    <v-container class="fill-height">
      <v-row cols="12" class="baseContent">
        <v-col cols="3">
          <v-list>
            <v-list-item v-for="word in wordList" :key="word.id">
              {{ word }}
            </v-list-item>
          </v-list></v-col
        >

        <v-col cols="6" align-self="center">
          <div class="CaBFont text-center">{{ wordPlayed }}</div>
        </v-col>
        <v-col cols="3"></v-col>
      </v-row>
      <v-row cols="12">
        <v-col cols="3" class="text-center text--accent-2" align-self="center">
          <h2>Joueur</h2>
          <h3>{{ playerPoints }}</h3></v-col
        >
        <v-col cols="6">
          <v-text-field
            color="#ED531D"
            outlined
            v-model="wordInput"
            @keypress.enter="addWord(wordInput)"
            append-icon="mdi-send"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3" class="text-center text--accent-1" align-self="center">
          <h2>Ordinateur</h2>

          <h3>{{ comPoints }}</h3></v-col
        >
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',

  components: {},

  data: () => ({
    //Pattern de comptage
    letters: 'abcdefghijklmnopqrstuvwxyz',
    objectLetters: require('./assets/scrabble.json').letters,

    //Variables de jeu
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
  watch: {
    calcPoints() {
      console.log('calc points = ' + this.calcPoints)
    },
  },
  methods: {
    totalLetters(word) {
      let totalPoints = 0
      for (let i = 0; i < word.length; i++) {
        const element = word[i]
        this.objectLetters[element].points
        totalPoints += this.objectLetters[element].points
      }
      return totalPoints
    },
    howManyLettersBetween(word1, word2) {
      if (this.letters.indexOf(word1[0]) - this.letters.indexOf(word2[0]) > 1) {
        return this.letters.indexOf(word1[0]) - this.letters.indexOf(word2[0])
      } else {
        return this.letters.indexOf(word2[0]) - this.letters.indexOf(word1[0])
      }
    },
    getWord() {
      axios
        .get(
          'https://api.dicolink.com/v1/mots/motauhasard?avecdef=false&minlong=4&maxlong=-1&verbeconjugue=false&api_key=' +
            this.apiKey
        )
        .then((response) => {
          this.isValidWord(response.data[0].mot)
          console.log(response.data[0].mot)
          // let word = response.data[0].mot
          // this.textType(word)
        })
    },
    isValidWord(word) {
      // debugger
      axios
        // .get('https://api.dicolink.com/v1/mot/' + word + '/definitions?limite=200&api_key=' + this.apiKey)
        // .get('https://api.dictionaryapi.dev/api/v2/entries/fr/' + word)
        .get('https://fr.wiktionary.org/w/api.php?action=query&titles=' + word + '&format=json&origin=*')

        .then((response) => {
          console.log(response)
          if (response.data.query.pages.hasOwnProperty('-1')) {
            // Le mot est inconnu
            console.log("Ce mot n'existe pas... tête de fion.")
          } else {
            // Le mot est reconnu on lance le script de typing
            this.textType(word)
            console.log(response.data)
            // this.calcPoints += response.data.score
            // console.log(this.calcPoints)
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
        // this.refWord = this.removeAccents(this.refWord)
      }
      this.wordInput = ''

      if (this.index < this.refWord.length) {
        this.isTyping = true
        console.log(this.index)
        this.wordPlayed = this.wordPlayed + this.removeAccents(this.refWord.charAt(this.index))
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

        //On ajoute les points de l'écart entre les premières lettres de chaque mots.
        if (this.wordList.length > 1) {
          this.calcPoints += this.howManyLettersBetween(this.wordList[0], this.wordList[1])
          console.log('bonus hmlb + ' + this.calcPoints)
        }

        //Ajout du nombre de points scrabble
        this.calcPoints += this.totalLetters(this.wordPlayed)
        console.log(this.calcPoints)

        console.log('points Scrabble = ' + this.totalLetters(this.wordPlayed))

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

  div.baseContent
    height 80%
</style>
