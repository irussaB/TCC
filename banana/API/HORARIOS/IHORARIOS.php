<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "insert into horarios_treino (turma_id, dia_semana, horario_inicio, horario_fim) values (?,?,?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['turma_id'] ?? null, $data['dia_semana'] ?? null,
    $data['horario_inicio'] ?? null, $data['horario_fim'] ?? null,
]);
echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();