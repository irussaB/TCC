    let cliquesTema = 0, temporizadorTema = null;

    function alternarTema() {
      cliquesTema++;
      clearTimeout(temporizadorTema);
      temporizadorTema = setTimeout(() => cliquesTema = 0, 1500);

      if (cliquesTema >= 5) {
        cliquesTema = 0;
        document.body.classList.add('tema-escuro');
        const ativo = document.body.classList.toggle('tema-time');
        document.getElementById('icone-tema').className = ativo ? 'ti ti-flame' : 'ti ti-sun';
        localStorage.setItem('tema', ativo ? 'time' : 'escuro');
        return;
      }

      if (document.body.classList.contains('tema-time')) return;

      const escuro = document.body.classList.toggle('tema-escuro');
      document.getElementById('icone-tema').className = escuro ? 'ti ti-sun' : 'ti ti-moon';
      localStorage.setItem('tema', escuro ? 'escuro' : 'claro');
    }
    (function() {
      const salvo = localStorage.getItem('tema');
      if (salvo === 'time') {
        document.body.classList.add('tema-escuro', 'tema-time');
      } else if (salvo === 'escuro') {
        document.body.classList.add('tema-escuro');
      }
      document.addEventListener('DOMContentLoaded', function() {
        const ic = document.getElementById('icone-tema');
        if (!ic) return;
        if (salvo === 'time') ic.className = 'ti ti-flame';
        else if (salvo === 'escuro') ic.className = 'ti ti-sun';
      });
    })();

    /* ═══════════════════════════════════
       EASTER EGG — ANIMAÇÃO DE CESTA
       Tocada pelo app.js antes de exibir
       a tela de confirmação da matrícula.
    ═══════════════════════════════════ */
    window.mostrarAnimacaoCesta = function(callback) {
      const overlay = document.getElementById('dunk-overlay');
      const cena = overlay ? overlay.querySelector('.dunk-cena') : null;
      if (!overlay || !cena) { callback(); return; }

      // confetes nas cores do time
      const cores = ['#E63946', '#FFC72C', '#4ade80', '#60a5fa'];
      for (let i = 0; i < 18; i++) {
        const c = document.createElement('div');
        c.className = 'confete';
        c.style.left = (Math.random() * 230) + 'px';
        c.style.background = cores[Math.floor(Math.random() * cores.length)];
        c.style.animationDuration = (0.9 + Math.random() * 0.6) + 's';
        c.style.animationDelay = (0.95 + Math.random() * 0.25) + 's';
        cena.appendChild(c);
      }

      overlay.classList.add('ativo');

      setTimeout(() => {
        overlay.classList.remove('ativo');
        cena.querySelectorAll('.confete').forEach(c => c.remove());
        callback();
      }, 1900);
    };