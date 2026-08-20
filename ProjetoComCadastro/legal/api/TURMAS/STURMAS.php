<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  t.turid as id,
  t.turnome as nome,
  t.turproid as proid,
  p.pronome as proNome,
  (select count(*) from matriculas m where m.matturid = t.turid and m.matstatus = 'aprovada') as totalAlunos
from turmas t
left join professores p on p.proid = t.turproid;
";
$prp = $pdo->prepare($sql);
$prp->execute();
$data = $prp->fetchall(PDO::FETCH_ASSOC);
echo json_encode($data);
Conexao::desconectar();
