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
    let boxToHighlight
    let keyBoxNumber = Math.ceil((Math.random() * keyBoxes.length) )
    boxToHighlight = document.getElementById(`key-box-${keyBoxNumber}`)
    // console.log(`key-box-${keyBoxNumber}`);
    boxToHighlight.classList.remove('key-box')
    boxToHighlight.classList.add('lit-up-box')
    // console.log(boxToHighlight.innerText);
    // checkKey(boxToHighlight)
    setTimeout(() => {
      boxToHighlight.classList.remove('lit-up-box')
      boxToHighlight.classList.add('key-box')
      setTimeout(() => {}, 50)
    }, 1950)
  }


  function playGame() {
    setInterval(() => {
      randomlyLightUpKey()
      checkKey()
    }, 2000)
  }

  playGame()
  let score = 0

  function checkKey() {
    window.addEventListener("keydown", (e) => {
      e.preventDefault()
      let highlightedBox = document.querySelector(".lit-up-box")
      // debugger
      if (e.key.toUpperCase() === highlightedBox.innerText[0]) {
        e.stopPropagation()
        score += 10
        console.log(score)
        // debugger
        // implement score here
      }
    })
  }

})
