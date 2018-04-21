const stateElement = document.querySelector("#initial_state")
export default stateElement ? JSON.parse(stateElement.innerHTML) : {}