<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  t.id, t.nome, t.professor_id,
  p.nome as professorNome,
  (select count(*) from matriculas_turmas mt
     inner join matriculas m on m.id = mt.matricula_id
     where mt.turma_id = t.id and m.status = 'aprovada') as totalAlunos
from turmas t
left join professores p on p.id = t.professor_id
order by t.nome;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();