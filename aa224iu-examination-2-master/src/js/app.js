import * as view from './view.js'

let serverResponse
let isOptionalQuestion = false
let interval
let countdown
let usedTime = 0
let username
const maxTime = 20

// https://developer.mozilla.org/en-US/docs/Web/API/Body/json
function getQuestion (url) {
  window.fetch(url)
    .then(response => response.json())
    .then(result => {
      serverResponse = result
      // show question
      view.displayQestion(serverResponse)
      if (serverResponse.alternatives) {
        isOptionalQuestion = true
        view.displayAlternatives(serverResponse.alternatives)
      } else {
        document.querySelector('#answer-choice').style.visibility = 'hidden'
        document.querySelector('#answer-input').style.visibility = 'visible'
      }
      // start the timer
      startTimer(maxTime, document.querySelector('#timer'))
    })
}
// https://stackoverflow.com/questions/29775797/fetch-post-json-data
function summitInput () {
  const button = document.querySelector('#question button')
  button.addEventListener('click', event => {
    let value
    stopTimer() // stop timer
    // handler question type
    if (isOptionalQuestion === true) {
      document.querySelectorAll('#radio').forEach(element => {
        if (element.checked) {
          value = element.value
          console.log(value)
        }
      })
      const divChoice = document.querySelector('#answer-choice')
      while (divChoice.firstChild) {
        divChoice.firstChild.remove()
      }
    } else {
      value = document.querySelector('.answer').value
    }

    // send html POST
    window.fetch(serverResponse.nextURL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answer: value })
    }).then(res => res.json())
      .then(res => {
        serverResponse = res
        if (serverResponse.message.includes('Correct')) {
          if (!serverResponse.nextURL) {
            win()
            return
          }
          console.log(serverResponse.nextURL)
          getQuestion(serverResponse.nextURL)
          isOptionalQuestion = false
        } else {
          gameOver()
        }
      })
  })
}

function startTimer (duration, display) {
  countdown = duration
  interval = setInterval(() => {
    display.textContent = countdown
    if (--countdown < 0) {
      gameOver()
    }
  }, 1000)
}

function stopTimer () {
  clearInterval(interval)
  usedTime += maxTime - countdown
  console.log('used time' + usedTime)
}

function gameOver () {
  view.displayGomeOver()
  const button = document.querySelector('#gameover button')
  button.addEventListener('click', event => {
    document.location.reload()
  })
}
function start () {
  getQuestion('http://vhost3.lnu.se:20080/question/1')
  summitInput()
  document.querySelector('#gameover').style.visibility = 'hidden'
}

function win () {
  // create json and save in window.localStorege
  let newHighscore
  if (!window.localStorage.highscore) { // if not exist
    console.log(username)
    newHighscore = [{ name: username, time: usedTime }]
  } else { // already exist
    newHighscore = JSON.parse(window.localStorage.highscore) // load it
    console.log(username)
    newHighscore.push({ name: username, time: usedTime }) // add new score
  }
  newHighscore = newHighscore.sort(function (n, m) { return n.time - m.time })
  window.localStorage.highscore = JSON.stringify(newHighscore)
  console.log(window.localStorage.highscore)
  view.displayHighscore(newHighscore)
  document.querySelector('#highscore button').addEventListener('click', event => {
    document.location.reload()
  })
}

console.log(window.localStorage.highscore)
view.displayStartGame()
const button = document.querySelector('#start button')
button.addEventListener('click', event => {
  username = button.previousElementSibling.value
  console.log(username)
  start()
})
