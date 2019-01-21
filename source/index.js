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
  const startScreen = document.getElementById("start-screen")
  const scoreTracker = document.querySelector("#score-tracker span")
  const logOutButton = document.getElementById("log-out-user")
  const userInfo = document.getElementById("display-user-info")
  const selectInstrument = document.getElementById("select-instrument")
  const selectInstrumentInput = document.getElementById("select-instrument-input")


  let continueGame = true
  let loggedInUser
  let gameInterval
  let litUpInterval
  let totalInterval
  let highlightedBoxTimeout
  let loser = new Audio("assets/audio/loser.wav")

  let selectedSFX

  let pianoSFX = ["assets/audio/piano-ff-023.wav", "assets/audio/piano-ff-027.wav", "assets/audio/piano-ff-030.wav", "assets/audio/piano-ff-032.wav", "assets/audio/piano-ff-039.wav", "assets/audio/piano-ff-042.wav", "assets/audio/piano-ff-044.wav", "assets/audio/piano-ff-047.wav"]

  let glocSFX = ["assets/audio/gloc__g1.wav", "assets/audio/gloc__f1.wav", "assets/audio/gloc__f-1.wav", "assets/audio/gloc__e1.wav", "assets/audio/gloc__d1.wav", "assets/audio/gloc__c1.wav", "assets/audio/gloc__b2.wav", "assets/audio/gloc__a2.wav",]

  let synthSFX = ["assets/audio/synth-1.wav", "assets/audio/synth-2.wav", "assets/audio/synth-3.wav", "assets/audio/synth-4.wav", "assets/audio/synth-5.wav", "assets/audio/synth-6.wav", "assets/audio/synth-7.wav", "assets/audio/synth-8.wav"]

  let guitarSFX = ["assets/audio/guitar-1.wav", "assets/audio/guitar-2.wav", "assets/audio/guitar-3.wav", "assets/audio/guitar-4.wav", "assets/audio/guitar-5.wav", "assets/audio/guitar-6.wav", "assets/audio/guitar-7.wav", "assets/audio/guitar-8.wav"]

  let stringsSFX = ["assets/audio/strings-bow-1.wav", "assets/audio/strings-bow-2.wav", "assets/audio/strings-bow-3.wav", "assets/audio/strings-bow-4.wav", "assets/audio/strings-bow-5.wav", "assets/audio/strings-bow-6.wav", "assets/audio/strings-bow-7.wav", "assets/audio/strings-bow-8.wav"]

  let chorusSFX = ["assets/audio/chorus-1.wav", "assets/audio/chorus-2.wav", "assets/audio/chorus-3.wav", "assets/audio/chorus-4.wav", "assets/audio/chorus-5.wav", "assets/audio/chorus-6.wav", "assets/audio/chorus-7.wav", "assets/audio/chorus-8.mp3"]

  let instrumentOptions = [pianoSFX, glocSFX, synthSFX, guitarSFX, stringsSFX, chorusSFX]

  // selectedSFX = pianoSFX





  const usersUrl = "https://soundoff-api.herokuapp.com/api/v1/users"
  const scoresUrl = "https://soundoff-api.herokuapp.com/api/v1/scores"

  userLogin.addEventListener("submit", event => {
    event.preventDefault()
    logInUser(event)
  })
  createNewUser.addEventListener("submit", event => {
    event.preventDefault()
    if (createNewUserInput.value != "") {
      createUser(event)
    } else {
      alert("User name cannot be empty")
    }
  })

  logOutButton.addEventListener("click", event => {
    event.preventDefault()
    logUserOut()
  })


  fetch(usersUrl).then(res => res.json()).then(createUserDropdown)
  fetch(scoresUrl).then(res => res.json()).then(displayHighScores)

  function startGameEventListener() {
    window.addEventListener("keydown", event => {
      // event.preventDefault()
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
    // startScreen.style.display = 'block'
    selectInstrument.style.display = "block"
    logOutButton.style.display = 'block'
    loggedInUserInfo.innerHTML = `<h3>Player: ${user.name}</h3>`
    selectInstrumentEventListener()
    // startGameEventListener()
    getUserHighScore(user)
    if (user.scores.length > 0) {
      let highScore = getUserHighScore(user)
      loggedInUserInfo.innerHTML += `<h4>High Score: <span>${highScore}</span></h4>`
    } else {
      loggedInUserInfo.innerHTML += `<h4>High Score: <span>0<span></h4>`
    }
  }

  function selectInstrumentEventListener() {
    selectInstrument.addEventListener("submit", (event) => {
      event.preventDefault()
      let index = parseInt(selectInstrumentInput.value)
      selectedSFX = instrumentOptions[index]
      console.log(selectedSFX)
      selectInstrument.style.display = 'none'
      startScreen.style.display = 'block'
      startGameEventListener()
    })
  }

  function getUserHighScore(user) {
    let scores = user.scores.map(score => score.total)
    return scores.sort((a, b) => b - a)[0]
  }

  function createUser(event) {
    let createUserConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: createNewUserInput.value})}
    fetch(usersUrl, createUserConfig).then(res => res.json()).then(displayLoggedInUser)
    createNewUserInput.value = ""
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
        loser.play()
        gameOver()
      }
    }, totalInterval)
    checkKey()
  }

  let score = 0

  function checkKey() {
    window.addEventListener("keydown", (e) => {
      // e.preventDefault()
      let highlightedBox
      if (document.querySelector(".lit-up-box")) {
        highlightedBox = document.querySelector(".lit-up-box")
        if (e.key.toUpperCase() === highlightedBox.innerText[0]) {
          playNote(e.key)
          correctKeyPressed(highlightedBox)
        } else {
          loser.play()
          wrongKeyPressed(highlightedBox)
          continueGame = false
        }
      }
    })
  }


  function playNote(key) {
    let aKey = new Audio(selectedSFX[0])
    let sKey = new Audio(selectedSFX[1])
    let dKey = new Audio(selectedSFX[2])
    let fKey = new Audio(selectedSFX[3])
    let jKey = new Audio(selectedSFX[4])
    let kKey = new Audio(selectedSFX[5])
    let lKey = new Audio(selectedSFX[6])
    let semKey = new Audio(selectedSFX[7])

    if (key.toLowerCase() === "a") {
      aKey.play()
    } else if (key.toLowerCase() === "s") {
      sKey.play()
    } else if (key.toLowerCase() === "d") {
      dKey.play()
    } else if (key.toLowerCase() === "f") {
      fKey.play()
    } else if (key.toLowerCase() === "j") {
      jKey.play()
    } else if (key.toLowerCase() === "k") {
      kKey.play()
    } else if (key.toLowerCase() === "l") {
      lKey.play()
    } else if (key.toLowerCase() === ";") {
      semKey.play()
    }
  }

  function changeInterval() {
    if (parseInt(scoreTracker.innerText) % 500 === 0 && totalInterval > 400) {
      litUpInterval -= 100
      totalInterval -= 100
      clearInterval(gameInterval)
      gameInterval = setInterval(() => {
        if (continueGame === true) {
          randomlyLightUpKey()
        } else {
          loser.play()
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
    let gameScore = parseInt(scoreTracker.innerText)
    let userHighScore = document.querySelector("#display-user-info span")
    if (gameScore > parseInt(userHighScore.innerText)) {
      let celebrationSFX = new Audio("assets/audio/yeah.mp3")
      celebrationSFX.play()
      userHighScore.innerText = gameScore
      alert(`New High Score: ${scoreTracker.innerText}!`)
    } else {
      alert(`Game over! Your score is ${scoreTracker.innerText}`)
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
    fetch(usersUrl).then(res => res.json()).then(createUserDropdown)
    loggedInUser = null
    keyBoxContainer.style.display = "none"
    startScreen.style.display = "none"
    userLogin.style.display = "block"
    createNewUser.style.display = "block"
    logOutButton.style.display = "none"
    userInfo.style.display = "none"
  }


})
