<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "select id, nome, email from alunos where email = ? and senha = ? limit 1;";
$prp = $pdo->prepare($sql);
$prp->execute([$data['email'] ?? '', $data['senha'] ?? '']);
$aluno = $prp->fetch(PDO::FETCH_ASSOC);

echo json_encode($aluno ?: null);
Conexao::desconectar();