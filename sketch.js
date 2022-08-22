function startGame(dropdown) {
  let level = parseInt(dropdown.selectedOptions[0].value, 10);
  changeGrid(level);
}

const container = document.getElementById("gameboard");

function removeBlocks() {
  container.innerHTML = "";
}

function shuffle(array) {
    const length = array == null ? 0 : array.length
    if (!length) {
      return []
    }
    let index = -1
    const lastIndex = length - 1
    const result = (array).map(x=>x);
    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
      const value = result[rand]
      result[rand] = result[index]
      result[index] = value
    }
    return result
}

function getRandomNumbers(level) {
  const pairNumbers = (level * level) / 2;
  const numbersCheckingSet = new Set();
  const generatedNumbersList = [];
  while (numbersCheckingSet.size < pairNumbers) {
    const randomNumber = Math.floor(Math.random() * 100);
    if (numbersCheckingSet.has(randomNumber) === false) {
      numbersCheckingSet.add(randomNumber);
      generatedNumbersList.push(randomNumber);
    }
  }
  const randomNumberWithPairs = [];
  generatedNumbersList.forEach((number) => {
    randomNumberWithPairs.push(number);
    randomNumberWithPairs.push(number);
  });
  return shuffle(randomNumberWithPairs);
}

let score = 0;

function updateScore(newscore,timestamp=false){
    score = newscore;
    document.getElementById('score').innerText='Current Score: '+score;
    if (timestamp){
        document.getElementById("score").innerText+=" YOU HAVE WON, you took: "+(Date.now()-timestamp)/1000+" seconds"
    }
}

function changeGrid(level) {
  /**
   * Remove existing blocks
   */
  removeBlocks();
  let openedBlock = null;
  updateScore(0);
  let correctBlocks = 0;
  let startTime = Date.now();
  const randomNumbersList = getRandomNumbers(level);
  for (let rowNumber = 1; rowNumber <= level; rowNumber++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("game-row");
    for (let columnNumber = 1; columnNumber <= level; columnNumber++) {
      const currentBlock = document.createElement("div");
      currentBlock.classList.add("game-block");
      const currentBlockNumber = randomNumbersList.pop();
      currentBlock.setAttribute("number", currentBlockNumber);
      currentBlock.addEventListener("click", () => {
        if (currentBlock.hasAttribute("solved")) {
          return;
        }
        if (openedBlock === currentBlock) {
          return;
        }
        if (openedBlock === null) {
          // no other block is opened, open this block
          openedBlock = currentBlock;
          currentBlock.innerText = currentBlockNumber.toString();
          currentBlock.style.backgroundColor = "yellow";
        } else {
          const anotherOpenedNumber = parseInt(
            openedBlock.getAttribute("number"),
            10
          );
          if (anotherOpenedNumber === currentBlockNumber) {
            // CORRECT PAIRING
            correctBlocks+=2;
            updateScore(score+1);
            openedBlock.style.backgroundColor = "green";
            currentBlock.style.backgroundColor = "green";
            currentBlock.style.color = "white";
            openedBlock.style.color = "white";
            openedBlock.setAttribute("solved", "solved");
            currentBlock.setAttribute("solved", "solved");
            currentBlock.innerText = currentBlockNumber.toString();
            if (correctBlocks == level*level) {
                updateScore(score,startTime);
            }
            openedBlock = null;
          } else {
            // WRONG PAIRING
            updateScore(score-0.3);
            openedBlock.style.backgroundColor='red';
            currentBlock.style.backgroundColor='red';
            currentBlock.innerText = currentBlockNumber.toString();
            let tempCurrentBlock =  openedBlock;
            setTimeout(()=>{
                tempCurrentBlock.innerText = "";
                tempCurrentBlock.style.backgroundColor = "white";
                currentBlock.innerText = "";
                currentBlock.style.backgroundColor = "white";
            },500);
            openedBlock = null;
          }
        }
      });
      rowDiv.appendChild(currentBlock);
    }
    container.appendChild(rowDiv);
  }
}
