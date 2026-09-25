<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select ep.id, ep.plano_mensal_id, ep.exercicio_id, ep.campo,
       e.nome as exercicioNome
from exercicios_planos_mensais ep
inner join exercicios e on e.id = ep.exercicio_id
order by ep.campo, e.nome;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();