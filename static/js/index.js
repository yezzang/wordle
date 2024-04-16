const keyboardColumn = document.querySelectorAll(
  ".keyboard-column, .keyboard-column-wide"
);

let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const handleBackspace = () => {
    if (index !== 0) {
      index--;
      const formerBlock = document.querySelector(
        `.board-column[data-index="${attempts}${index}"]`
      );
      formerBlock.innerText = "";
    }
  };
  const displayGameOver = (flag) => {
    const div = document.createElement("div");
    if (flag === "found") div.innerText = "게임이 종료되었습니다.";
    else if (flag === "not_found") div.innerText = "실패!";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:40vw; width:200px; height:100px; background-color:white;";
    document.body.appendChild(div);
  };

  const gameOver = (flag) => {
    window.removeEventListener("keydown", handleKeyDown);
    displayGameOver(flag);
    clearInterval(timer);
  };
  const nextLine = () => {
    if (attempts === 5) {
      gameOver("not_found");
    }
    attempts++;
    index = 0;
  };

  const handleEnterkey = async () => {
    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index="${attempts}${i}"]`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      const keyElement = document.querySelector(
        `.keyboard-key[data-key="${입력한_글자}"], .keyboard-key-long[data-key="${입력한_글자}"]`
      );
      if (입력한_글자 === 정답_글자) {
        맞은_갯수++;
        block.style.background = "#67B360";
        if (keyElement) {
          keyElement.style.backgroundColor = "#67B360";
          keyElement.setAttribute("correct", "");
        }
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#D6BE4E";
        if (keyElement && !keyElement.hasAttribute("correct"))
          keyElement.style.backgroundColor = "#D6BE4E";
      } else block.style.background = "grey";
      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameOver("found");
    else nextLine();
  };

  const startTimer = () => {
    const start_time = new Date();
    function setTime() {
      const current_time = new Date();
      elapsed_time = new Date(current_time - start_time);
      const minute = elapsed_time.getMinutes().toString().padStart(2, "0");
      const second = elapsed_time.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${minute}:${second}`;
    }
    timer = setInterval(setTime, 1000);
  };

  const handleKeyDown = (event) => {
    const key = event.key;
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index="${attempts}${index}"]`
    );
    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterkey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key.toUpperCase();
      index++;
    }
  };

  const handleClick = (event) => {
    const key = event.target.getAttribute("data-key");

    if (key === "BACKSPACE") handleBackspace();
    else if (key === "ENTER") handleEnterkey();
    else {
      const tmpEvent = { key: key, keyCode: key.charCodeAt(0) };
      handleKeyDown(tmpEvent);
    }
  };
  startTimer();
  window.addEventListener("keydown", handleKeyDown);
  keyboardColumn.forEach((key) => {
    key.addEventListener("click", handleClick);
  });
}

appStart();
