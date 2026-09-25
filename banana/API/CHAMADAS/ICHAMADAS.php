<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

// Evita duplicar chamada da mesma matrícula/turma/data
$del = "delete from chamadas where matricula_id=? and turma_id=? and data=?;";
$pd = $pdo->prepare($del);
$pd->execute([$data['matid'] ?? null, $data['turid'] ?? null, $data['data'] ?? null]);

$sql = "insert into chamadas (matricula_id, turma_id, plano_diario_id, data, status) values (?,?,?,?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['matid'] ?? null,
    $data['turid'] ?? null,
    $data['plano_diario_id'] ?? null,
    $data['data'] ?? null,
    $data['status'] ?? 'presente',
]);

echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();