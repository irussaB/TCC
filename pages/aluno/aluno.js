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

    // Aplica o tema salvo ao carregar a página
    (function() {
      const salvo = localStorage.getItem('tema');
      if (salvo === 'time') {
        document.body.classList.add('tema-time');
        document.addEventListener('DOMContentLoaded', function() {
          document.getElementById('icone-tema').className = 'ti ti-flame';
        });
      } else if (salvo === 'claro') {
        document.body.classList.add('tema-claro');
        document.addEventListener('DOMContentLoaded', function() {
          document.getElementById('icone-tema').className = 'ti ti-sun';
        });
      }
    })();

    // ── TROCA DE ABAS ──────────────────────────
    function trocarAba(id, btn) {
      document.querySelectorAll('.painel').forEach(p => p.classList.remove('ativo'));
      document.querySelectorAll('.aba').forEach(b => b.classList.remove('ativa'));
      document.getElementById('painel-' + id).classList.add('ativo');
      btn.classList.add('ativa');
    }

    // ── CALENDÁRIO DE JUNHO 2026 ───────────────
    // 1 de junho de 2026 = segunda-feira (dia 1)
    const treinos = {
      // 1 = presente, 0 = falta, -1 = sem treino (cancelado), null = dia sem aula
      3: 1, 5: 1, 8: 1, 10: -1, 12: 1,
      15: 1, 17: 0, 19: 1, 22: 1, 24: 1, 26: 1
    };

    function gerarCalendario() {
      const grid = document.getElementById('cal-grid');
      const hoje = 11; // dia atual simulado

      // Junho 2026 começa na segunda (índice 1 no nosso grid dom-seg-ter...)
      // Domingo = 0, Segunda = 1 ... Sábado = 6
      // 1 de junho de 2026 é segunda-feira
      const primeiroDia = 1; // 0=dom, 1=seg...
      const totalDias   = 30;

      let html = '';

      // Células vazias antes do dia 1
      for (let i = 0; i < primeiroDia; i++) {
        html += '<div class="cal-dia dia-vazio"></div>';
      }

      for (let d = 1; d <= totalDias; d++) {
        let cls = 'dia-normal';
        let title = '';

        if (treinos[d] === 1)  { cls = 'dia-presente'; title = 'Presente'; }
        if (treinos[d] === 0)  { cls = 'dia-falta';    title = 'Falta'; }
        if (treinos[d] === -1) { cls = 'dia-treino-off'; title = 'Sem treino'; }

        if (d === hoje) cls += ' dia-hoje';

        html += `<div class="cal-dia ${cls}" title="${title}">${d}</div>`;
      }

      grid.innerHTML = html;
    }

    gerarCalendario();