export default class MemoryGame {
  constructor (id, inputrows, inputcols) {
    this.id = id
    this.matrix = { rows: inputrows, cols: inputcols }
    this.boxes = []
    this.interval = null
    this.timer = null
    this.a = null
  }

  /**
   * start the application, coppy the template -> render it -> add event to all component
   */
  run () {
    const template = document.importNode(document.querySelector('#memoryGame').content, true)
    template.getElementById('memoryApp').id = 'memoryAppId' + this.id
    document.querySelector('desktop').appendChild(template)
    const memoryApp = document.querySelector('#memoryAppId' + this.id)
    this.id = memoryApp.id

    this.boxes = this.createArr(this.matrix.rows, this.matrix.cols)
    document.querySelector('#' + this.id + ' #close').addEventListener('click', this.close.bind(this))
    this.showBrick()
    this.startTimer()
    this.addTurnBrickEvent(document.querySelector('#' + this.id + ' #bricks'), this.boxes)
    this.dragAndDrop()
  }

  /**
   * assign time the timer depend on rows and colums then display it on the app window
   */
  startTimer () {
    let time = 0
    if (this.matrix.rows === 2 && this.matrix.cols === 2) {
      time = 15
    } else if (this.matrix.rows === 2 && this.matrix.cols === 4) {
      time = 30
    } else {
      time = 60
    }
    this.interval = setInterval(() => {
      if (--time < 0) {
        this.stopTimer()
        document.querySelector('#' + this.id + ' #gameOver').classList.add('visible')
        document.querySelector('#' + this.id + ' #bricks').classList.add('hide')
      } else {
        document.querySelector('#' + this.id + ' #timer').textContent = time
      }
    }, 1000)
  }

  /**
   * stop the timer
   */
  stopTimer () {
    clearInterval(this.interval)
    this.interval = null
  }

  /**
   * close the app window
   */
  close () {
    if (this.interval !== null) {
      this.stopTimer()
    }
    document.querySelector('#' + this.id).remove()
  }

  /**
   * Handler game component suchs as, display the hidden brick, counting turn,
   * check if there is a pair, check if user win/lose the game and hiding the paired bicks.
   * @param {*} brickDiv div tag which all bricks allocated
   * @param {*} boxes array which tell which pictures posotion
   */
  addTurnBrickEvent (brickDiv, boxes) {
    let turn1
    let turn2
    let lastTile
    let pairs = 0
    let tries = 0
    let interval = this.interval
    const id = this.id
    const rows = this.matrix.rows
    const cols = this.matrix.cols
    brickDiv.addEventListener('click', function (event) {
      event.preventDefault()
      const img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
      const index = parseInt(img.getAttribute('data-brickNum'))
      turnBrick(boxes[index], img)
    })

    function turnBrick (tile, img) {
      if (turn2) {
        return
      }
      img.src = 'image/' + tile + '.png'
      // first brick is clicked
      if (!turn1) {
        turn1 = img
        lastTile = tile
      } else { // 2nd brick is cliecked
        if (img === turn1) { // if user dubble click on the same image
          return
        }
        tries += 1
        document.querySelector('#' + id + ' #tries').textContent = tries + ' attempt'
        turn2 = img

        if (tile === lastTile) { // found pair
          pairs += 1

          if (pairs === (rows * cols) / 2) {
            document.querySelector('#' + id + ' #win').firstElementChild.textContent = 'You won on ' + tries + ' number of tires'
            document.querySelector('#' + id + ' #win').classList.add('visible')
            clearInterval(interval)
            interval = null
          }

          setTimeout(function () { // remove the tile from the game
            turn1.parentNode.classList.add('hide')
            turn2.parentNode.classList.add('hide')

            // reset turn1&2
            turn1 = null
            turn2 = null
          }, 300)
        } else {
          window.setTimeout(function () {
            turn1.src = 'image/0.png'
            turn2.src = 'image/0.png'
            turn1 = null
            turn2 = null
          }, 500)
        }
      }
    }
  }

  /**
   * display ? picture on the memory game table.
   */
  showBrick () {
    const cols = this.matrix.cols
    let index = 0
    const id = this.id
    this.boxes.forEach(function () {
      const a = document.importNode(document.querySelector('#cards').content.firstElementChild, true)
      a.firstElementChild.setAttribute('data-brickNum', index)
      document.querySelector('#' + id + ' #bricks').appendChild(a)
      index++
      if ((index) % cols === 0) {
        document.querySelector('#' + id + ' #bricks').appendChild(document.createElement('br'))
      }
    })
  }

  /**
   * create and shuffer the a array that will be use as a game table
   * @param {*} rows rows that need to be create in memory game
   * @param {*} cols colums that need to be create in memory game
   */
  createArr (rows, cols) {
    const arr = []
    for (let index = 1; index <= (rows * cols) / 2; index++) {
      arr.push(index)
      arr.push(index)
    }
    // shuffle
    for (let index = arr.length - 1; index > 0; index--) {
      const j = Math.floor(Math.random() * (index + 1))
      const temp = arr[index]
      arr[index] = arr[j]
      arr[j] = temp
    }
    return arr
  }

  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
   * allow user to move the application around on the desktop
   */
  dragAndDrop () {
    const app = document.querySelector('#' + this.id)

    document.body.addEventListener('dragover', function (event) {
      // prevent default to allow drop
      event.preventDefault()
    }, false)

    app.addEventListener('dragstart', function (event) {
      const style = window.getComputedStyle(event.target, null)
      event.dataTransfer.setData('text/plain', (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY))
      event.dataTransfer.setData('id', event.target.id)
      event.target.remove()
      document.querySelector('desktop').appendChild(event.target)
    })

    document.body.addEventListener('drop', function (event) {
      const offset = event.dataTransfer.getData('text/plain').split(',')
      const div = document.querySelector('#' + event.dataTransfer.getData('id'))
      div.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
      div.style.top = (event.clientY + parseInt(offset[0], 10)) + 'px'
      event.preventDefault()
    })
  }
}
