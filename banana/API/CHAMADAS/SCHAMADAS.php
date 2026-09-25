<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  c.id, c.matricula_id as matid, c.turma_id as turid, c.data, c.status,
  c.plano_diario_id,
  t.nome as turmaNome,
  a.nome as alunoNome, a.datanasc,
  pd.data as planoData,
  pm.nome as planoNome
from chamadas c
inner join matriculas m on m.id = c.matricula_id
inner join alunos a on a.id = m.aluno_id
left join turmas t on t.id = c.turma_id
left join planos_diarios pd on pd.id = c.plano_diario_id
left join planos_mensais pm on pm.id = pd.plano_mensal_id
order by c.data desc, t.nome, a.nome;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();