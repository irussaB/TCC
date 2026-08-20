<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$json = filter_input(INPUT_GET, 'jsn');
$data = json_decode($json, true);

$sql = "insert into alunos
    (alusexo, alunome, aluemail, alutelefone, alucpf, aludatanasc, alualtura, alupeso,
     alucidade, aluuf, aluendereco, alunumero, alubairro, alucep, alurg,
     alurespnome, alurespcpf, aluresptel, alurespemail,
     aludocautorizacao, aludocmedico, alupsf, alusenha)
    values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
$prp = $pdo->prepare($sql);
$prp->execute([
    $data['sexo'] ?? null,
    $data['nome'] ?? null,
    $data['email'] ?? null,
    $data['telefone'] ?? null,
    $data['cpf'] ?? null,
    $data['nascimento'] ?? null,
    $data['altura'] ?? null,
    $data['peso'] ?? null,
    $data['cidade'] ?? null,
    $data['uf'] ?? null,
    $data['endereco'] ?? null,
    $data['numero'] ?? null,
    $data['bairro'] ?? null,
    $data['cep'] ?? null,
    $data['rg'] ?? null,
    $data['respNome'] ?? null,
    $data['respCpf'] ?? null,
    $data['respTelefone'] ?? null,
    $data['respEmail'] ?? null,
    $data['docAutorizacao'] ?? null,
    $data['docMedico'] ?? null,
    $data['psf'] ?? null,
    $data['senha'] ?? null,
]);

echo json_encode(['id' => $pdo->lastInsertId()]);
Conexao::desconectar();
