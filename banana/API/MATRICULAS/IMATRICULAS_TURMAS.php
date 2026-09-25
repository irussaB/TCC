<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$check = "select id from matriculas_turmas where matricula_id=? and turma_id=?;";
$p = $pdo->prepare($check);
$p->execute([$data['matriculaId'] ?? null, $data['turmaId'] ?? null]);
$existe = $p->fetch(PDO::FETCH_ASSOC);
if ($existe) { echo json_encode(['id' => $existe['id']]); Conexao::desconectar(); exit; }

$sql = "insert into matriculas_turmas (matricula_id, turma_id) values (?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([$data['matriculaId'] ?? null, $data['turmaId'] ?? null]);
echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();