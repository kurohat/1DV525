export default class Chat {
  constructor (id) {
    this.id = 'chatid' + (id + 1)
    // extra feature : adding emojis to chat borrowed from unicode.org
    this.emojis = ['😃', '😄', '😁', '😆', '😅', '😂', '😉', '😊', '😇', '😍', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '😝', '😑', '😶', '😏', '😒', '😬', '😌', '😔', '😪', '😴', '😷', '😵', '😎', '😕', '😟', '😲', '😳', '😦', '😧', '😨', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '😤', '😡', '😠', '😈', '👿', '💩']
    this.message = null
    this.socket = null
    this.username = window.localStorage.getItem('username') === null ? '' : window.localStorage.getItem('username')
  }

  /**
   * start the chat application, coppy the template -> render it -> add event to all component
   */
  run () {
    const chatApp = document.importNode(document.querySelector('#chat').content, true)
    chatApp.getElementById('chatApp').id = this.id
    if (this.username === '') {
      chatApp.querySelector('#' + this.id + ' #chatFooter').classList.add('hide')
      chatApp.querySelector('#' + this.id + ' #addUser').addEventListener('click', this.addUser.bind(this))
    } else {
      chatApp.querySelector('#' + this.id + ' #chatSetting').classList.add('hide')
      chatApp.querySelector('#' + this.id + ' #textArea').addEventListener('keypress', this.pressedEnter.bind(this))
    }
    document.querySelector('desktop').appendChild(chatApp)
    document.querySelector('#' + this.id + ' #close').addEventListener('click', this.close.bind(this))
    this.dragAndDrop()
    this.createEmojis()
  }

  /**
   * create a emoji box
   */
  createEmojis () {
    const emojidiv = document.querySelector('#' + this.id + ' #showEmoji')
    for (const emoji of this.emojis) {
      const div = document.createElement('div')
      div.setAttribute('class', 'item')
      div.innerHTML = emoji
      emojidiv.appendChild(div)
      div.addEventListener('click', this.chooseEmoji.bind(this))
    }
  }

  /**
   * select the emoji that user click on and display it on the text area
   * @param {*} event the emoji
   */
  chooseEmoji (event) {
    const inputField = document.querySelector('#textArea')
    inputField.value += event.target.innerHTML
  }

  /**
   * add user to the local storage
   */
  addUser () {
    this.username = document.querySelector('#' + this.id + ' #userToAdd').value
    window.localStorage.setItem('username', this.username)
    document.querySelector('#' + this.id + ' #chatFooter').classList.add('visible')
    document.querySelector('#' + this.id + ' #chatSetting').classList.add('hide')
    document.querySelector('#' + this.id + ' #textArea').addEventListener('keypress', this.pressedEnter.bind(this))
  }

  /**
   * when user pressed enter -> save the message in a varible
   * @param {*} event user input
   */
  pressedEnter (event) {
    if (event.keyCode === 13) {
      this.sendMessage(event.target.value)
      event.target.value = ''
      event.preventDefault()
    }
  }

  /**
   * close the application
   */
  close () {
    document.querySelector('#' + this.id).remove()
  }

  /**
   * esatablish a connection with the server
   */
  connect () {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.readyState === 1) { // check if connection is already open
        resolve(this.socket) // then return it direcly
        return
      }
      // else create a new connection.
      this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
      this.socket.onopen = () => resolve(this.socket)
      this.socket.onerror = () => reject(this.socket)
      this.socket.onmessage = (event) => this.printMessage(JSON.parse(event.data)) // display messages when server get a message
    })
  }

  /**
   * send messgae to the server
   * @param {*} text message
   */
  sendMessage (text) {
    const data = { // message json
      type: 'message',
      data: text,
      username: this.username,
      channel: '',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.connect().then(function (socket) { // esatablish a connection ->
      socket.send(JSON.stringify(data)) // then send the message
    }).catch(function (error) {
      console.log('Something went wrong', error)
    })
  }

  /**
   * display messages on the app window
   * @param {*} message message to display
   */
  printMessage (message) {
    if (message.type === 'message') {
      const template = document.importNode(document.querySelector('#message').content, true)
      const messageDiv = template.querySelector('#messageBox')
      messageDiv.querySelector('#userName').textContent = message.username + ': '
      messageDiv.querySelector('#textMessage').textContent = message.data
      document.querySelector('#' + this.id + ' #chatContent').appendChild(messageDiv)
    }
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
