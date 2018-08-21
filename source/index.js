document.addEventListener('DOMContentLoaded', () => {

})

const usersUrl = "http://localhost:3000/api/v1/users"
const usersConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: "Jack"})}
// fetch(usersUrl, usersConfig).then(res => res.json()).then(console.log)

const scoresUrl = "http://localhost:3000/api/v1/scores"
const scoresConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({total: 500, user_id: 1})}
// fetch(scoresUrl, scoresConfig).then(res => res.json()).then(console.log)

const mainPlayArea = document.getElementById('main-play-area')
// console.log(mainPlayArea);
const keyBoxes = document.getElementsByClassName("key-box")
console.log(keyBoxes);
