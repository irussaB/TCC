// ── CRONÔMETRO POSSE ──
let posseSeg = 24;
let posseTimer = null;
let posseRodando = false;

function atualizarDisplayPosse() {
  document.getElementById('crono-posse').textContent = posseSeg;
  document.getElementById('btn-posse-14').disabled = posseSeg >= 14;
}

function togglePosse() {
  const btn = document.getElementById('btn-posse-start');
  if (posseRodando) {
    clearInterval(posseTimer);
    posseRodando = false;
    btn.innerHTML = '<i class="ti ti-player-play"></i> Start';
  } else {
    posseRodando = true;
    btn.innerHTML = '<i class="ti ti-player-pause"></i> Pause';
    posseTimer = setInterval(() => {
      posseSeg--;
      if (posseSeg <= 0) { posseSeg = 0; clearInterval(posseTimer); posseRodando = false; btn.innerHTML = '<i class="ti ti-player-play"></i> Start'; }
      atualizarDisplayPosse();
    }, 1000);
  }
}

function resetPosse(valor, iniciar) {
  clearInterval(posseTimer);
  posseSeg = valor;
  atualizarDisplayPosse();
  if (iniciar) {
    posseRodando = true;
    document.getElementById('btn-posse-start').innerHTML = '<i class="ti ti-player-pause"></i> Pause';
    posseTimer = setInterval(() => {
      posseSeg--;
      if (posseSeg <= 0) { posseSeg = 0; clearInterval(posseTimer); posseRodando = false; document.getElementById('btn-posse-start').innerHTML = '<i class="ti ti-player-play"></i> Start'; }
      atualizarDisplayPosse();
    }, 1000);
  } else {
    posseRodando = false;
    document.getElementById('btn-posse-start').innerHTML = '<i class="ti ti-player-play"></i> Start';
  }
}

// ── CRONÔMETRO JOGO ──
let jogoSeg = 600;
let jogoTimer = null;
let jogoRodando = false;

function atualizarDisplayJogo() {
  const m = Math.floor(jogoSeg / 60).toString().padStart(2, '0');
  const s = (jogoSeg % 60).toString().padStart(2, '0');
  document.getElementById('crono-jogo').textContent = `${m}:${s}`;
}

function toggleJogo() {
  const btn = document.getElementById('btn-jogo-start');
  if (jogoRodando) {
    clearInterval(jogoTimer); jogoRodando = false;
    btn.innerHTML = '<i class="ti ti-player-play"></i> Start';
  } else {
    jogoRodando = true;
    btn.innerHTML = '<i class="ti ti-player-pause"></i> Pause';
    jogoTimer = setInterval(() => {
      jogoSeg--;
      if (jogoSeg <= 0) { jogoSeg = 0; clearInterval(jogoTimer); jogoRodando = false; btn.innerHTML = '<i class="ti ti-player-play"></i> Start'; }
      atualizarDisplayJogo();
    }, 1000);
  }
}

function resetJogo() {
  clearInterval(jogoTimer);
  jogoRodando = false;
  document.getElementById('btn-jogo-start').innerHTML = '<i class="ti ti-player-play"></i> Start';
  const min = parseInt(document.getElementById('jogo-minutos').value);
  jogoSeg = min * 60;
  atualizarDisplayJogo();
}

function alterarMinutosJogo() {
  if (!jogoRodando) resetJogo();
}

// ── PLACAR ──
let pontos = { 1: 0, 2: 0 };

function alterarPontos(time, delta) {
  pontos[time] = Math.max(0, pontos[time] + delta);
  document.getElementById(`time-${time}-pontos`).textContent = pontos[time];
}

function atualizarNomeTime(t) {
  // só visual
}

// ── TELA CHEIA ──
function alternarTelaCheia() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.getElementById('icone-fullscreen').className = 'ti ti-minimize';
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
  } else {
    document.exitFullscreen();
    document.getElementById('icone-fullscreen').className = 'ti ti-maximize';
  }
}

atualizarDisplayPosse();
atualizarDisplayJogo();