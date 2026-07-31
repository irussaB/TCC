    // ── TEMA CLARO / ESCURO ────────────────────
    let cliquesTema = 0, temporizadorTema = null;

    function alternarTema() {
      cliquesTema++;
      clearTimeout(temporizadorTema);
      temporizadorTema = setTimeout(() => cliquesTema = 0, 1500);

      if (cliquesTema >= 5) {
        cliquesTema = 0;
        const ativo = document.body.classList.toggle('tema-time');
        document.getElementById('icone-tema').className = ativo ? 'ti ti-flame'
          : (document.body.classList.contains('tema-claro') ? 'ti ti-sun' : 'ti ti-moon');
        localStorage.setItem('tema', ativo ? 'time' : (document.body.classList.contains('tema-claro') ? 'claro' : 'escuro'));
        return;
      }

      if (document.body.classList.contains('tema-time')) return;

      const claro = document.body.classList.toggle('tema-claro');
      document.getElementById('icone-tema').className = claro ? 'ti ti-sun' : 'ti ti-moon';
      localStorage.setItem('tema', claro ? 'claro' : 'escuro');
    }

    (function() {
      const salvo = localStorage.getItem('tema');
      if (salvo === 'time') {
        document.body.classList.add('tema-time');
      } else if (salvo === 'claro') {
        document.body.classList.add('tema-claro');
      }
      document.addEventListener('DOMContentLoaded', function() {
        const ic = document.getElementById('icone-tema');
        if (!ic) return;
        if (salvo === 'time') ic.className = 'ti ti-flame';
        else if (salvo === 'claro') ic.className = 'ti ti-sun';
      });
    })();