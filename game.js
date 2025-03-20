function main(){
  let player = document.getElementById("player");
  let bd = document.getElementById("body");
  let p = bd.getBoundingClientRect();
  let pig = document.createElement('img');
  let game = document.getElementById("game");
  pig.className = "pig";
  pig.src = "Images/pork.png";
  //bd.style.background
  let st = document.getElementById("start");
  let dst = document.getElementById("dst");
  let scoreCt = document.getElementById("scoreCt");
  let ini = document.getElementById("ini");
  let got = document.getElementById("got");
  let flag = 0, cJump = 0, cFall = 0, iFall, iJump, iScore, createCol, gover = 0, score = 0, record = 0;
  
  function colissions(x1, y1, x2, y2, flag, hg){
    if(flag){
      if(x2 <= x1 + 50 && x1 <= x2 + 70 && y1 <= y2 + hg){
        return 1;
      }
    }
    else{
      if(x2 <= x1 + 50 && x1 <= x2 + 70 && y1 + 50 >= y2){
        return 1;
      }
    }
    return 0;
  }
  function porkCol(){
     if(gover){
       return;
     }
     pos = player.getBoundingClientRect();
     for (let i = 0; i < cols.length; i++) {
          let ft = document.getElementById(cols[i][0]);
          let sc = document.getElementById(cols[i][1]);
          let pf = ft.getBoundingClientRect();
          let pc = sc.getBoundingClientRect();
          if (cols[i][2] != 0 && !gover) {
            if (gp(pos.left, pos.top, pf.left, pf.top - 70)) {
            
              let point = document.createElement('img');
              let pork = document.getElementById(cols[i][2]);
              if(pork == null){
                return;
              }
              pork.style.display = "none";
              cols[i][2] = 0;
              point.className = "point";
              point.src = "Images/point.png";
              point.style.top = pf.top - 52 + "px";
              point.style.left = pf.left + "px";
              game.appendChild(point);
              score += 100;
              scoreCt.animate(scoreAnim, config2);
              setTimeout(function() {
                point.remove();
              }, 500);
            }
          }
      }
  }
  function setFall(){
     if(gover){
       return;
     }
     let pos = player.getBoundingClientRect();
     if(cols.length){
        let ft = document.getElementById(cols[0][0]);
        let sc = document.getElementById(cols[0][1]);
        let pf = ft.getBoundingClientRect();
        let pc = sc.getBoundingClientRect();
        if(pf.left < -70){
          cols.shift();
          ft.remove();
          sc.remove();
        }
        if(colissions(pos.left, pos.top, pc.left, pc.top, 1, sc.offsetHeight) || colissions(pos.left, pos.top, pf.left, pf.top, 0, sc.offsetHeight)) {
            stop();
            gover = 1;
            return;
          }
        }
    
     if (pos.top + 50 > bd.offsetHeight) {
       return;
     }
     player.style.top = pos.top + 1.2 + "px";
  }
  function stop() {
    clearInterval(iScore);
    cols = [];
    for(let i = 0; i < cols.length; i++){
      let col1 = document.getElementById(cols[i][0]);
      let col2 = document.getElementById(cols[i][1]);
      let pork = document.getElementById(cols[i][2]);
      //col1.style.display = col2.style.display = pork.style.display = "none";
      
    }
    clearInterval(createCol);
    game.style.display = "none";
    
    gameover();
  }
  function gameover(){
    clearInterval(porkCol);
    clearInterval(iJump);
    clearInterval(iFall);
    clearInterval(iScore);
    clearInterval(porkCol);
    document.removeEventListener("click", onJump);
    let curr = document.getElementById("currScore");
    let best = document.getElementById("bestScore");
    let rst = document.getElementById("rst");
    record = mx(record, score);
    curr.textContent = "Your score: "+ score;
    if(record == score){
      best.textContent = "🎉New Record!🎉"
    }
    else {
      best.textContent = "Your best: "+ record;
    }
    got.style.display = "block";
    rst.addEventListener("click", rGame);
  }
  function rGame(){
    got.style.display = "none";
    player.style.top = "50%";
    score = -1;
    gover = 0;
    start();
   
  }
  function onFall(){
     iFall = setInterval(setFall, 1);
  }
  function offFall(){
    clearInterval(iFall);
    cFall = 0;
  }
  function gp(x1, y1, x2, y2){
    if(x2 + 70 >= x1 + 50 && x1 + 50 >= x2 && y1 + 50 >= y2){
      return 1;
    }
    return 0;
  }
  function setJump(){
    if(gover){
      return;
    }
    if(cJump < 60){
      let pos = player.getBoundingClientRect();
     if(cols.length){
        let ft = document.getElementById(cols[0][0]);
        let sc = document.getElementById(cols[0][1]);
        let pf = ft.getBoundingClientRect();
        let pc = sc.getBoundingClientRect();
        
        if(pf.left < -70){
          cols.shift();
          ft.remove();
          sc.remove();
        }      
        if (colissions(pos.left, pos.top, pc.left, pc.top, 1, sc.offsetHeight) || colissions(pos.left, pos.top, pf.left, pf.top, 0, sc.offsetHeight)) {
            stop();
            gover = 1;
            return;
          }
        }
      
      if(pos.top - 2.5 < 0){
        offJump();
        return;
      }
      player.style.top = pos.top - 2.5 + "px";
      cJump++;
    }
    else{
      offJump();
    }
  }
  function animation(){
    let k = 0;
    let myinterval = setInterval(function rot(){
      if(k == 360){
        clearInterval(myinterval);
      }
      player.style.transform = "rotateY(-"+k+"deg)";
      k += 6;
    }, 2)
   
  }
  function onJump(){
    animation();
    if(cJump > 0){
      cJump = 0;
    }
    else{
      offFall();
      iJump = setInterval(setJump, 1);
    }
  }
  function offJump(){
    player.style.transform = "rotateY(0deg)";
    clearInterval(iJump);
    cJump = 0;
    onFall();
  }
  let sec = 0, colId = 0, cols = [];
  const mv = [{transform: "translateX(-"+(bd.offsetWidth+140)+"px)"},
  ];
  const config = {
    duration: (bd.offsetWidth / (25 + 0)) * 100,
    iterations: 1,
    fillmode: "Forwards",
    delay: 200
  }
  const scoreAnim = [
    {opacity: 0.5},
    {opacity: 0},
    {opacity: 0.5},
    {opacity: 1}
  ];
  const config2 = {
    duration: 1000,
    iterations: 1,
    
  };
  let maxSize = 45, op = 45, bfh = 0, diff = 10, ldf = 1;
  
  function difficulty(){
    setInterval(function (){
      if(maxSize < 60){
        maxSize++;
      }
      if(op > 30){
        op--;
      }
      if(diff <= 25){
        diff++;
      }
      if(ldf < 15 && diff > 25){
        ldf++;
      }
    }, 1000);
  }
  function updScore(){
    score++;
    scoreCt.textContent = score;
  }
  function rand(l, r){
    return Math.floor(Math.random() * (r - l + 1) + l);
  }
  function mx(a, b){
    if(a > b){
      return a;
    }
    return b;
  }
  function mi(a, b){
    if(a < b){
      return a;
    }
    return b;
  }
  function makeCol(){
    createCol = setInterval(function (){
      if(gover){
        return;
      }
      let col1 = document.createElement('div');
      let col2 = document.createElement('div');
      
      let k = p.width; 
      
      if(bfh){
        if(bfh - diff >= 5 && bfh + diff + op <= 95){
          if(rand(0, 1)){
            rd = bfh - rand(ldf, diff);
          }
          else{
            rd = bfh + rand(ldf, diff);
          }
        }
        else if(bfh - diff >= 5){
          rd = bfh - rand(ldf, diff);
        }
        else{
          rd = bfh + rand(1, diff);
        }
      }
      else{
        rd = rand(10, maxSize);
      }
     
      col1.className = "col"
      col2.className = "col2";
      col1.id = colId + "";
      col2.id = colId + 1;
      cols.push([colId + "", colId + 1 + "", colId + "p"]);
      colId+=2;
      colId%=100;
      col1.style.left = col2.style.left = p.width + "px";
      col1.style.height = rd + "%";
      col2.style.height = 100 - (rd + op) + "%";
      bfh = rd;
      game.appendChild(col1);
      game.appendChild(col2);
      col1.style.animationTimingFunction = "linear";
      let prob = rand(1, 5);
      if(prob == 1 || prob == 2){
         let pg = pig.cloneNode();
         pg.id = colId - 2 + "p";
         pg.style.top = (p.height * (100 - rd)) / 100 - 52 + "px";
         pg.style.left = p.width + "px";
         game.appendChild(pg);
         pg.animate(mv, config);
      }
      col1.animate(mv, config);
      col2.animate(mv, config);
      
    }, 1200);
    
  }
  function start(){
      game.style.display = "block";
      bd.style.backgroundImage = "url(Images/sky.jpg)";
      bd.style.backgroundSize = "initial";
      ini.style.display = "none";
      makeCol();
      onFall();
      difficulty();
      setInterval(porkCol, 20);
      iScore = setInterval(updScore, 50);
      document.addEventListener("click", onJump);
  }
  st.addEventListener("click", start);
  

}

window.addEventListener("load", main);
