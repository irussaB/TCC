<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "update turmas set nome=?, professor_id=? where id=?;";
$prp = $pdo->prepare($sql);
$prp->execute([$data['nome'] ?? null, $data['professor_id'] ?? null, $data['id'] ?? null]);
echo json_encode(['ok' => true]);
Conexao::desconectar();