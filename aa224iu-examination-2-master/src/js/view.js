export const displayQestion = function (serverResponse) {
  document.querySelector('header').style.visibility = 'visible'
  document.querySelector('#start').style.visibility = 'hidden'
  document.querySelector('#start').style.display = 'none'

  document.querySelector('#question').style.visibility = 'visible'
  document.querySelector('#question').style.display = 'block'
  document.querySelector('#answer-input').style.visibility = 'visible'

  const question = document.querySelector('#question h1')
  question.textContent = serverResponse.question
}

export const displayAlternatives = function (alternatives) {
  document.querySelector('#answer-input').style.visibility = 'hidden'

  document.querySelector('#answer-choice').style.visibility = 'visible'

  const divChoice = document.querySelector('#answer-choice')
  for (let index = 0; index < Object.keys(alternatives).length; index++) {
    const radio = document.createElement('input')
    radio.setAttribute('type', 'radio')
    radio.name = 'choices'
    radio.value = 'alt' + (index + 1)
    radio.id = 'radio'
    divChoice.appendChild(radio)
    // const alt = document.querySelector('#label' + (index + 1))
    const label = document.createElement('label')
    label.id = 'label' + (index + 1)
    label.textContent = alternatives['alt' + (index + 1)]
    divChoice.appendChild(label)
  }
}

export const displayGomeOver = function () {
  document.querySelector('header').style.visibility = 'hidden'
  document.querySelector('#gameover').style.visibility = 'visible'
  document.querySelector('#gameover').style.display = 'block'

  document.querySelector('#answer-choice').style.visibility = 'hidden'
  document.querySelector('#question').style.visibility = 'hidden'

  document.querySelector('#answer-input').style.visibility = 'hidden'
  document.querySelector('#question').style.display = 'none'
}

export const displayStartGame = function () {
  document.querySelector('header').style.visibility = 'hidden'

  document.querySelector('#answer-choice').style.visibility = 'hidden'
  document.querySelector('#question').style.visibility = 'hidden'

  document.querySelector('#answer-input').style.visibility = 'hidden'
  document.querySelector('#question').style.display = 'none'

  document.querySelector('#gameover').style.visibility = 'hidden'
  document.querySelector('#gameover').style.display = 'none'

  document.querySelector('#highscore').style.visibility = 'hidden'
}

export const displayHighscore = function (newHighscore) {
  document.querySelector('#highscore').style.visibility = ''
  document.querySelector('#highscore').style.display = 'visible'

  // hide everything
  document.querySelector('header').style.visibility = 'hidden'
  document.querySelector('#answer-choice').style.visibility = 'hidden'
  document.querySelector('#question').style.visibility = 'hidden'

  document.querySelector('#answer-input').style.visibility = 'hidden'
  document.querySelector('#question').style.display = 'none'

  document.querySelector('#gameover').style.visibility = 'hidden'
  document.querySelector('#gameover').style.display = 'none'

  document.querySelector('#start').style.visibility = 'hidden'
  document.querySelector('#start').style.display = 'none'

  let listPlayer = 5 // list only 5 player
  if (newHighscore.length < 5) { // incase there are less than 5 player
    listPlayer = newHighscore.length
  }

  for (let i = 0; i < listPlayer; i++) {
    const li = document.createElement('li')
    li.textContent = 'Player name:' + newHighscore[i].name + '______________:' + newHighscore[i].time + ' sec'
    document.querySelector('#highscore').appendChild(li)
  }
  const button = document.createElement('button')
  button.textContent = 'try again'
  document.querySelector('#highscore').appendChild(button)
}
