<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "update alunos set nome=?, email=?, cpf=?, sexo=?, datanasc=?, telefone=?,
        altura=?, peso=?, endereco=?, bairro=?, numero=?, cidade=?, uf=?, cep=?, psf=?,
        contatoemergencianome=?, contatoemergenciatelefone=?, contatoemergenciacpf=?
        where id=?;";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['nome'] ?? null, $data['email'] ?? null, $data['cpf'] ?? null,
    $data['sexo'] ?? null, $data['datanasc'] ?? null, $data['telefone'] ?? null,
    $data['altura'] ?? null, $data['peso'] ?? null, $data['endereco'] ?? null,
    $data['bairro'] ?? null, $data['numero'] ?? null, $data['cidade'] ?? null,
    $data['uf'] ?? null, $data['cep'] ?? null, $data['psf'] ?? null,
    $data['contatoemergencianome'] ?? null,
    $data['contatoemergenciatelefone'] ?? null,
    $data['contatoemergenciacpf'] ?? null,
    $data['id'] ?? null,
]);
echo json_encode(['ok' => true]);
Conexao::desconectar();