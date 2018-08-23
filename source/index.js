// document.addEventListener('DOMContentLoaded', () => {

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
  const startScreen = document.getElementById("start-screen")
  const scoreTracker = document.querySelector("#score-tracker span")
  const logOutButton = document.getElementById("log-out-user")
  const userInfo = document.getElementById("display-user-info")

  let continueGame = true
  let loggedInUser
  let gameInterval
  let litUpInterval
  let totalInterval
  let highlightedBoxTimeout

  const usersUrl = "http://localhost:3000/api/v1/users"
  const scoresUrl = "http://localhost:3000/api/v1/scores"

  userLogin.addEventListener("submit", event => {
    event.preventDefault()
    logInUser(event)
  })
  createNewUser.addEventListener("submit", event => createUser(event))
  logOutButton.addEventListener("click", event => {
    event.preventDefault()
    logUserOut()
  })


  fetch(usersUrl).then(res => res.json()).then(createUserDropdown)
  fetch(scoresUrl).then(res => res.json()).then(displayHighScores)

  function startGameEventListener() {
    window.addEventListener("keydown", event => {
      event.preventDefault()
      if (startScreen.style.display === 'block') {
        playGame()
      }
    })
  }

  function createUserDropdown(data) {
    data.forEach(user => {
      userLoginInput.innerHTML += `<option value="${user.id}">${user.name}</option>`
    })
  }

  function logInUser(event) {
    fetch(usersUrl + "/" + userLoginInput.value).then(res => res.json()).then(displayLoggedInUser)
  }

  function displayLoggedInUser(user) {
    userInfo.style.display = "block"
    loggedInUser = user.id
    userLogin.style.display = 'none'
    createNewUser.style.display = 'none'
    startScreen.style.display = 'block'
    logOutButton.style.display = 'block'
    loggedInUserInfo.innerHTML = `<h3>Player: ${user.name}</h3>`
    startGameEventListener()
    getUserHighScore(user)
    if (user.scores.length > 0) {
      let highScore = getUserHighScore(user)
      loggedInUserInfo.innerHTML += `<h4>High Score: <span>${highScore}</span></h4>`
    } else {
      loggedInUserInfo.innerHTML += `<h4>High Score: <span>0<span></h4>`
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
    leaderboardList.innerHTML = "<tr><th>User</th><th>Score</th></tr>"
    scores = scores.sort((a,b) => b.total - a.total)
    scores = scores.slice(0,10)
    scores.forEach(score => {
      leaderboardList.innerHTML += `<tr><td>${score.user.name}</td><td>${score.total}</td></tr>`
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
    highlightedBoxTimeout = setTimeout(() => {
      // boxToHighlight.classList.remove('lit-up-box')
      // boxToHighlight.classList.add('key-box')
      if (Array.from(boxToHighlight.classList).includes("lit-up-box")) {
        continueGame = false;
      }
    }, litUpInterval)
    setTimeout(() => {}, 50)
  }


  function playGame() {
    startScreen.style.display = 'none'
    keyBoxContainer.style.display = 'block'
    litUpInterval = 1950
    totalInterval = 2000
    gameInterval = setInterval(() => {
      if (continueGame === true) {
        randomlyLightUpKey()
      } else {
        gameOver()
      }
    }, totalInterval)
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

  function changeInterval() {
    if (parseInt(scoreTracker.innerText) % 500 === 0 && totalInterval > 500) {
      litUpInterval -= 100
      totalInterval -= 100
      clearInterval(gameInterval)
      gameInterval = setInterval(() => {
        if (continueGame === true) {
          randomlyLightUpKey()
        } else {
          gameOver()
        }
      }, totalInterval)

      highlightedBoxTimeout = setTimeout(() => {
        // boxToHighlight.classList.remove('lit-up-box')
        // boxToHighlight.classList.add('key-box')
        if (document.querySelectorAll(".lit-up-box").length > 0) {
          continueGame = false;
        }
      }, litUpInterval)

    }
    console.log(litUpInterval)
  }

  function correctKeyPressed(highlightedBox) {
    highlightedBox.classList.remove('lit-up-box')
    highlightedBox.classList.add('correct-key')
    setTimeout(() => {
      highlightedBox.classList.remove('correct-key')
      highlightedBox.classList.add('key-box')
    }, 100)
    scoreTracker.innerText = parseInt(scoreTracker.innerText) + 100
    changeInterval()
  }

  function wrongKeyPressed(highlightedBox) {
    highlightedBox.classList.remove('lit-up-box')
    highlightedBox.classList.add('incorrect-key')
    setTimeout(() => {
      highlightedBox.classList.remove('incorrect-key')
      highlightedBox.classList.add('key-box')
    }, 100)
  }

  function gameOver() {
    clearInterval(gameInterval)
    alert(`Game over! Your score is ${scoreTracker.innerText}`)
    let gameScore = parseInt(scoreTracker.innerText)
    let userHighScore = document.querySelector("#display-user-info span")
    debugger
    if (gameScore > parseInt(userHighScore.innerText)) {
      userHighScore.innerText = gameScore
    }
    postScore(gameScore)
    continueGame = true
    keyBoxContainer.style.display = 'none'
    startScreen.style.display = 'block'
    scoreTracker.innerText = "0"
  }

  function postScore(scoreTotal) {
    const scoresConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({total: scoreTotal, user_id: loggedInUser})}
    fetch(scoresUrl, scoresConfig).then(data => fetch(scoresUrl)).then(res => res.json()).then(displayHighScores)
  }

  function logUserOut() {
    loggedInUser = null
    keyBoxContainer.style.display = "none"
    startScreen.style.display = "none"
    userLogin.style.display = "block"
    createNewUser.style.display = "block"
    logOutButton.style.display = "none"
    userInfo.style.display = "none"
  }


// })
