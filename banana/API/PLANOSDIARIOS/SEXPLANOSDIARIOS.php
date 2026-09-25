<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select ep.id, ep.plano_diario_id, ep.exercicio_id, e.nome as exercicioNome
from exercicios_plano_diario ep
inner join exercicios e on e.id = ep.exercicio_id;
";
$prp = $pdo->prepare($sql);
$prp->execute();
echo json_encode($prp->fetchall(PDO::FETCH_ASSOC));
Conexao::desconectar();