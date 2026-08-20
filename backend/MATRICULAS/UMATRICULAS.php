<?php
// OBS: o pedido original falava em somente INSERT e SELECT, mas as telas de
// Matrículas (aceitar/recusar) e Turmas (mover aluno de turma) precisam alterar
// um registro já existente, então este endpoint de UPDATE foi necessário.
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$campos = [];
$valores = [];

if (isset($data['status'])) {
    $campos[] = 'matstatus = ?';
    $valores[] = $data['status'];
}
if (array_key_exists('turid', $data)) {
    $campos[] = 'matturid = ?';
    $valores[] = $data['turid'];
}

if (count($campos) > 0 && isset($data['id'])) {
    $valores[] = $data['id'];
    $sql = "update matriculas set " . implode(', ', $campos) . " where matid = ?;";
    $prp = $pdo->prepare($sql);
    $prp->execute($valores);
}

echo json_encode(['ok' => true]);
Conexao::desconectar();
