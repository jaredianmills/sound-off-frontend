document.addEventListener('DOMContentLoaded', () => {

  const mainPlayArea = document.getElementById('main-play-area')
  const keyBoxContainer = document.getElementById('key-box-container')
  const keyBoxes = document.getElementsByClassName("key-box")
  const userLogin = document.getElementById("user-login")
  const userLoginInput = document.getElementById("user-login-input")
  const createNewUser = document.getElementById("create-new-user")
  const createNewUserInput = document.getElementById("create-new-user-input")
  const loggedInUserInfo = document.getElementById("display-user-info")
  const leaderboard = document.getElementById("leaderboard")
  const leaderboardList = document.getElementById("leaderboard-list")

  let loggedInUser

  const usersUrl = "http://localhost:3000/api/v1/users"

  const scoresUrl = "http://localhost:3000/api/v1/scores"
  const scoresConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({total: 500, user_id: 1})}

  userLogin.addEventListener("submit", event => {
    event.preventDefault()
    logInUser(event)
  })
  createNewUser.addEventListener("submit", event => createUser(event))

  fetch(usersUrl).then(res => res.json()).then(createUserDropdown)
  fetch(scoresUrl).then(res => res.json()).then(displayHighScores)


  function createUserDropdown(data) {
    data.forEach(user => {
      userLoginInput.innerHTML += `<option value="${user.id}">${user.name}</option>`
    })
  }

  function logInUser(event) {
    fetch(usersUrl + "/" + userLoginInput.value).then(res => res.json()).then(displayLoggedInUser)
  }

  function displayLoggedInUser(user) {
    loggedInUser = user.id
    userLogin.style.display = 'none'
    createNewUser.style.display = 'none'
    keyBoxContainer.style.display = 'block'
    loggedInUserInfo.innerHTML = `<h3>Player: ${user.name}</h3>`
    getUserHighScore(user)
    if (user.scores.length > 0) {
      let highScore = getUserHighScore(user)
      loggedInUserInfo.innerHTML += `<h4>High Score: ${highScore}</h4>`
    }
  }

  function getUserHighScore(user) {
    let scores = user.scores.map(score => score.total)
    return scores.sort((a, b) => b - a)[0]
  }

  function createUser(event) {
    event.preventDefault()
    let createUserConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: createNewUserInput.value})}
    fetch(usersUrl, createUserConfig).then(res => res.json()).then(displayLoggedInUser)
  }

  function displayHighScores(scores) {
    leaderboardList.innerHTML = ""
    scores = scores.sort((a,b) => b.total - a.total)
    scores = scores.slice(0,10)
    scores.forEach(score => {
      let scoreList = document.createElement("li")
      scoreList.innerHTML = `<h4>${score.user.name}: ${score.total}</h4>`
      leaderboardList.appendChild(scoreList)
    })
  }

  function randomlyLightUpKey() {
    let keyBoxNumber = Math.ceil((Math.random() * keyBoxes.length) )
    let boxToHighlight = document.getElementById(`key-box-${keyBoxNumber}`)
    // console.log(`key-box-${keyBoxNumber}`);
    boxToHighlight.classList.remove('key-box')
    boxToHighlight.classList.add('lit-up-box')
    // console.log(boxToHighlight.innerText);
    // checkKey(boxToHighlight)
    setTimeout(() => {
      // boxToHighlight.classList.remove('lit-up-box')
      // boxToHighlight.classList.add('key-box')
      if (Array.from(boxToHighlight.classList).includes("lit-up-box")) {
        continueGame = false;
      }
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



  // playGame()

})
