<template>
  <v-app>
    <v-container class="fill-height">
      <!-- <animatedText /> -->
      <v-row cols="12" class="baseContent">
        <v-col cols="3">
          <v-list>
            <v-list-item-title class="text-center"><h2>Mots</h2></v-list-item-title>
            <v-list-item
              class="itemList"
              v-for="(word, index) in wordListDisp"
              @click="word.visible = !word.visible"
              :key="index"
              :ripple="false"
            >
              {{ word.text }}
              <div class="wordDescription" v-if="word.visible" v-html="word.description"></div>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6" align-self="center">
          <div class="CaBFont text-center">
            <span v-for="(n, i) in wordPlayed" :id="'letterAnim' + i" :key="i">{{ n }}</span>
          </div>
        </v-col>
        <v-col cols="3">
          <v-list>
            <v-list-item-title class="text-center"><h2>Bonus</h2></v-list-item-title>
            <v-list-item class="justify-center"> </v-list-item>
            <v-list-item :class="['justify-center', superSuiteBonus > 0 ? 'font-weight-black' : '']"
              >Super Suite</v-list-item
            >
            <v-list-item class="justify-center ma-0" v-if="superSuiteBonus > 0"> {{ superSuiteBonus }}</v-list-item>
            <v-list-item :class="['justify-center', superShrinkBonus > 0 ? 'font-weight-black' : '']"
              >Super Shrink</v-list-item
            >
            <v-list-item :class="'justify-center'" v-if="superShrinkBonus > 0">{{ superShrinkBonus }}</v-list-item>
            <v-list-item
              :class="[
                'justify-center',
                isPalindrome(wordPlayed) > 5 && wordPlayed !== '' && !isTyping ? 'font-weight-black' : '',
              ]"
              >Palindrome</v-list-item
            >
            <v-list-item v-if="isPalindrome(wordPlayed) > 5 && wordPlayed !== '' && !isTyping" :class="'justify-center'"
              >10</v-list-item
            >
            <v-list-item :class="['justify-center', totalLetters(wordPlayed) && !isTyping ? 'font-weight-black' : '']"
              >Score</v-list-item
            >
            <v-list-item :class="'justify-center'">{{ totalLetters(wordPlayed) }}</v-list-item>
          </v-list>
          <v-list>
            <v-list-item :class="'justify-center'" v-for="(point, index) in pointsAdded" :key="index">
              + {{ point }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row cols="12">
        <v-col cols="3" class="text-center" align-self="center">
          <h2>Joueur</h2>
          <h3>{{ playerPoints }}</h3></v-col
        >
        <v-col cols="6">
          <v-text-field
            autocomplete="false"
            color="#ED531D"
            outlined
            v-model="wordInput"
            @keypress.enter="addWord(wordInput)"
            append-icon="mdi-send"
            @click:append="addWord(wordInput)"
          >
          </v-text-field>
        </v-col>
        <v-col cols="3" class="text-center" align-self="center">
          <h2>Ordinateur</h2>

          <h3>{{ comPoints }}</h3></v-col
        >
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
// import animate from 'animateplus'
import axios from 'axios'
// import animatedText from './components/animateText.vue'

export default {
  name: 'App',

  components: {
    // animatedText,
  },

  data: () => ({
    //Pattern de comptage
    letters: 'abcdefghijklmnopqrstuvwxyz',
    objectLetters: require('./assets/scrabble.json').letters,

    //Variables de jeu
    wordInput: '',
    wordList: [],
    wordListDisp: [],
    textTyping: '',
    rdmWord: '',
    refWord: '',
    isTyping: false,
    wordPlayed: '',
    computerTurn: true,
    index: 0,
    apiKey: 'IqzLv8qEfjZyEG1gXUiDw-X5oAgX5wWe',
    wordIndex: 0,

    //Points
    playerPoints: 0,
    comPoints: 0,
    calcPoints: 0,
    superSuiteBonus: 0,
    superShrinkBonus: 0,
    pointsAdded: [],

    //Audios
    keyStroke: require('./assets/audio/keyStroke.mp3'),
    pop: require('./assets/audio/pop.mp3'),
    // keyStroke: require('./assets/audio/BoomBoom.mp3'),
  }),
  watch: {},
  methods: {
    playAtDuring(audio, at, during) {
      // console.log('at = ' + at)
      // console.log('during = ' + during)

      let audioPlay = new Audio(audio)

      if (at !== undefined) {
        audioPlay.currentTime = at
      }
      audioPlay.play()

      if (during !== undefined) {
        setTimeout(() => {
          audioPlay.pause()
        }, during)
      }
    },
    isGreaterOrTinierWord(firstWord, secondWord) {
      if (this.wordList.length > 1) {
        if (firstWord.length === secondWord.length + 1 || firstWord.length === secondWord.length - 1) {
          if (this.superShrinkBonus === 0) {
            this.superShrinkBonus = 5
          } else {
            this.superShrinkBonus *= 2
            this.calcPoints += this.superShrinkBonus
          }
        } else {
          this.superShrinkBonus = 0
        }
      }
    },
    addPoint(currentLetter) {
      let letter = this.objectLetters[currentLetter]

      this.pointsAdded.push(letter.points)
      this.calcPoints += letter.points
      setTimeout(() => {
        this.pointsAdded.shift()
        // this.playAtDuring(this.pop)
      }, 3000)
    },
    isAdjacentLetter(firstWord, secondWord) {
      if (this.wordList.length > 2) {
        if (
          this.letters.indexOf(firstWord[0]) === this.letters.indexOf(secondWord[0]) + 1 ||
          this.letters.indexOf(firstWord[0]) === this.letters.indexOf(secondWord[0]) - 1
        ) {
          if (this.superSuiteBonus === 0) {
            this.superSuiteBonus = 5
          } else {
            this.superSuiteBonus *= 2
            this.calcPoints += this.superSuiteBonus
          }
        } else {
          this.superSuiteBonus = 0
        }
      }
    },
    isPalindrome(word) {
      if (word.split('').reverse().join('') === word) {
        return 10
      } else {
        return 0
      }
    },
    totalLetters(word) {
      let totalPoints = 0
      for (let i = 0; i < word.length; i++) {
        const element = word[i]
        this.objectLetters[element].points
        totalPoints += this.objectLetters[element].points
      }
      return totalPoints
    },
    howManyLettersBetween(firstWord, secondWord) {
      if (this.letters.indexOf(firstWord[0]) - this.letters.indexOf(secondWord[0]) > 1) {
        return this.letters.indexOf(firstWord[0]) - this.letters.indexOf(secondWord[0])
      } else {
        return this.letters.indexOf(secondWord[0]) - this.letters.indexOf(firstWord[0])
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
        // .get('https://api.dictionaryapi.dev/api/v2/entries/fr/' + word)
        // .get('https://fr.wiktionary.org/w/api.php?action=query&titles=' + word + '&format=json&origin=*')
        .get(
          'https://fr.wiktionary.org/w/api.php?action=query&list=search&srsearch=' +
            word +
            '&prop=info&inprop=url&utf8=&format=json&origin=*'
        )

        .then((response) => {
          console.log(response)
          if (response.data.query.searchinfo.totalhits === 0) {
            // Le mot est inconnu
            console.log("Ce mot n'existe pas... tête de fion.")
          } else {
            let wordObj = {
              index: this.wordList.length,
              text: word,
              description: response.data.query.search[0].snippet,
              visible: false,
            }

            // Le mot est reconnu on lance le script de typing
            this.textType(wordObj.text)
            this.wordList.push(this.removeAccents(wordObj.text))
            this.wordListDisp.push(wordObj)
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
      let stop = false

      if (this.isTyping === false && !stop) {
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
    pointsCount() {
      //On ajoute les points de l'écart entre les premières lettres de chaque mots.
      if (this.wordList.length > 1) {
        this.calcPoints += this.howManyLettersBetween(this.wordList[0], this.wordList[1])
        console.log('bonus hmlb + ' + this.calcPoints)
      }
      // Est-ce un palindrome ?
      this.calcPoints += this.isPalindrome(this.wordPlayed)

      //Ajout du nombre de points Scrabble
      // this.calcPoints += this.totalLetters(this.wordPlayed)

      //Est-ce que le mot est commence par une lettre qui suit la lettre du dernier mot
      this.isAdjacentLetter(this.wordList[0], this.wordList[1])

      //Est-ce que le mot est plus grand que le mot précédant
      this.isGreaterOrTinierWord(this.wordList[0], this.wordList[1])
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
        //Le mot se tape...
        this.isTyping = true

        // debugger
        this.wordPlayed = this.wordPlayed + this.removeAccents(this.refWord.charAt(this.index))
        this.addPoint(this.wordPlayed.charAt(this.index))
        this.index++
        this.playAtDuring(this.keyStroke)
        setTimeout(this.typeWriter, this.randomDelay(300))
      } else if (this.index === this.refWord.length) {
        // Le typing du mot est terminé

        // this.wordList.push(this.refWord)
        this.refWord = ''
        this.isTyping = false
        this.index = 0

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
        return str.join('')
      }
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

div.itemList
  position relative

  div.wordDescription
    position absolute
    width 30em
    padding 6px 5px
    background-color antiquewhite
    border-radius 10px
    left 10em
</style>
