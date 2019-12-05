import MemoryGame from './memory.js'
import Chat from './chat.js'
import PostIT from './postIT.js'

let id = 0 // application id
/**
 * Add event to narvigation bar and waiting for user input. Then open the difference
 * app base on user input
 */
const main = function () {
  document.querySelector('nav').addEventListener('click', event => {
    switch (event.target.id) {
      case 'game2x2':
        newGame(new MemoryGame(id++, 2, 2))
        break
      case 'game2x4':
        newGame(new MemoryGame(id++, 2, 4))
        break
      case 'game4x4':
        newGame(new MemoryGame(id++, 4, 4))
        break
      case 'openChat':
        newApp(new Chat(id++))
        break
      case 'openNote':
        newApp(new PostIT(id++))
    }
  })
}
/**
 * Open the new memory game window
 * @param {*} app the app that need to be run
 * @param {*} rows rows of the memory game
 * @param {*} cols colums of the memory game
 */
const newGame = function (app, rows, cols) {
  app.run(id, rows, cols)
}
/**
 * Open new app window
 * @param {*} app the app that need to be run
 */
const newApp = function (app) {
  app.run(id)
}

main()
