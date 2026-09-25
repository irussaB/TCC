<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  id, nome, email, cpf, sexo, datanasc, telefone, altura, peso,
  endereco, bairro, numero, cidade, uf, cep, psf,
  contatoemergencianome, contatoemergenciatelefone, contatoemergenciacpf,
  atestadomedico, autorizacaoresponsavel
from alunos
order by nome;
";
$prp = $pdo->prepare($sql);
$prp->execute();
$data = $prp->fetchall(PDO::FETCH_ASSOC);
echo json_encode($data);
Conexao::desconectar();