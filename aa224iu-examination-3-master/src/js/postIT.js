export default class PostIT {
  /**
   * a constructor for post-it application. include the id and the all event the user created
   * which are saved in local storeage
   * @param {*} id Application id
   */
  constructor (id) {
    this.id = 'noteid' + (id + 1)
    this.notes = JSON.parse(window.localStorage.note) === null ? '' : JSON.parse(window.localStorage.note)
  }

  /**
   * Open the application and add event to each component
   */
  run () {
    const noteApp = document.importNode(document.querySelector('#postIT').content, true)
    noteApp.getElementById('postITApp').id = this.id
    document.querySelector('desktop').appendChild(noteApp)
    this.displayCardList()
    document.querySelector('#' + this.id + ' #close').addEventListener('click', this.close.bind(this))
    document.querySelector('#' + this.id + ' #showAdd').addEventListener('click', this.showAddNewEvent.bind(this))
    document.querySelector('#' + this.id + ' #addNote').addEventListener('click', this.saveAndAddNote.bind(this))
    this.dragAndDrop()
  }

  /**
   * display add new event menu when user click on add new event
   */
  showAddNewEvent () {
    document.querySelector('#' + this.id + ' #form').classList.remove('ui', 'dimmer')
    document.querySelector('#' + this.id + ' #showAdd').classList.add('ui', 'dimmer')
  }

  /**
   * Delete the event card from the DOM and in the local storage
   * @param {*} event event card
   */
  deleteCard (event) {
    const index = event.target.id.replace('#deleteCard', '')
    const id = '#' + this.id + ' #cardId' + index
    const notes = JSON.parse(window.localStorage.note) // fetch the data
    if (notes[index].topic === document.querySelector(id + ' .header').textContent) {
      notes.splice(index, 1) // delete the event card base on the index
      window.localStorage.note = JSON.stringify(notes) // save it
    }
    document.querySelector(id).remove()
  }

  /**
   * save new event that user just added in local storage then show the event card on the app
   */
  saveAndAddNote () {
    const note = JSON.parse(window.localStorage.note) // fetch the data
    // get each input
    const topic = document.querySelector('#' + this.id + ' #topic').value
    const date = document.querySelector('#' + this.id + ' #date').value
    const description = document.querySelector('#' + this.id + ' #des').value
    note.push({ topic: topic, date: date, des: description }) // push the input
    window.localStorage.note = JSON.stringify(note) // save it

    // show it
    const todoCard = document.importNode(document.querySelector('#todoCard').content, true)
    todoCard.querySelector('.header').textContent = topic
    todoCard.querySelector('.meta').textContent = date
    todoCard.querySelector('.description').textContent = description
    document.querySelector('#' + this.id + ' #postITContent').appendChild(todoCard)

    document.querySelector('#' + this.id + ' #form').classList.add('ui', 'dimmer')
    document.querySelector('#' + this.id + ' #showAdd').classList.remove('ui', 'dimmer')
  }

  /**
   * Display all event cards that exits in local storage
   */
  displayCardList () {
    let cardId = 0
    this.notes.forEach(element => {
      const todoCard = document.importNode(document.querySelector('#todoCard').content, true)
      todoCard.querySelector('#eventCard').id = 'cardId' + cardId
      todoCard.querySelector('.header').textContent = element.topic
      todoCard.querySelector('.meta').textContent = element.date
      todoCard.querySelector('.description').textContent = element.des
      document.querySelector('#' + this.id + ' #postITContent').appendChild(todoCard)
      const deletButton = document.querySelector('#deleteCard')
      deletButton.id = '#deleteCard' + cardId
      deletButton.addEventListener('click', this.deleteCard.bind(this))
      cardId++
    })
  }

  /**
   * close the app windown
   */
  close () {
    document.querySelector('#' + this.id).remove()
  }

  /**
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
