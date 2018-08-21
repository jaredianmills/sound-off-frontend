document.addEventListener('DOMContentLoaded', () => {

  const usersUrl = "http://localhost:3000/api/v1/users"
  const usersConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: "Jack"})}
  // fetch(usersUrl, usersConfig).then(res => res.json()).then(console.log)

  const scoresUrl = "http://localhost:3000/api/v1/scores"
  const scoresConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({total: 500, user_id: 1})}
  // fetch(scoresUrl, scoresConfig).then(res => res.json()).then(console.log)

  const mainPlayArea = document.getElementById('main-play-area')
  // console.log(mainPlayArea);
  const keyBoxes = document.getElementsByClassName("key-box")
  // console.log(keyBoxes);

  function randomlyLightUpKey() {
    let keyBoxNumber = Math.ceil((Math.random() * keyBoxes.length) )
    let boxToHighlight = document.getElementById(`key-box-${keyBoxNumber}`)
    // console.log(`key-box-${keyBoxNumber}`);
    boxToHighlight.classList.remove('key-box')
    boxToHighlight.classList.add('lit-up-box')
    // console.log(boxToHighlight.innerText);
    // checkKey(boxToHighlight)
    setTimeout(() => {
      boxToHighlight.classList.remove('lit-up-box')
      boxToHighlight.classList.add('key-box')
    }, 1950)
    setTimeout(() => {}, 50)
  }

  let continueGame = true

  function playGame() {
    let gameInterval = setInterval(() => {
      if (continueGame === true) {
        randomlyLightUpKey()
      } else {
        clearInterval(gameInterval)
        alert('game over man')
      }
    }, 2000)
    checkKey()
  }

  playGame()
  let score = 0

  function checkKey() {
    window.addEventListener("keydown", (e) => {
      e.preventDefault()
      let highlightedBox
      if (document.querySelector(".lit-up-box")) {
        highlightedBox = document.querySelector(".lit-up-box")
        if (e.key.toUpperCase() === highlightedBox.innerText[0]) {
          correctKeyPressed(highlightedBox)
        } else {
          wrongKeyPressed(highlightedBox)
          continueGame = false
        }
      }
    })
  }

  function correctKeyPressed(highlightedBox) {
    highlightedBox.classList.remove('lit-up-box')
    highlightedBox.classList.add('correct-key')
    setTimeout(() => {
      highlightedBox.classList.remove('correct-key')
      highlightedBox.classList.add('key-box')
    }, 100)
    score += 10
    console.log(score)
    // implement score here
  }


  function wrongKeyPressed(highlightedBox) {
    highlightedBox.classList.remove('lit-up-box')
    highlightedBox.classList.add('incorrect-key')
    setTimeout(() => {
      highlightedBox.classList.remove('incorrect-key')
      highlightedBox.classList.add('key-box')
    }, 100)
  }




})
