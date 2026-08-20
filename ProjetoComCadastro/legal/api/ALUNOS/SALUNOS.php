<?php
header('Content-Type: application/json');
require '../../app/conexao.php';
$pdo = Conexao::conectar();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$sql = "
select
  aluid as id,
  alusexo as sexo,
  alunome as nome,
  aluemail as email,
  alutelefone as telefone,
  alucpf as cpf,
  aludatanasc as nascimento,
  alualtura as altura,
  alupeso as peso,
  alucidade as cidade,
  aluuf as uf,
  aluendereco as endereco,
  alunumero as numero,
  alubairro as bairro,
  alucep as cep,
  alurg as rg,
  alurespnome as respNome,
  alurespcpf as respCpf,
  aluresptel as respTelefone,
  alurespemail as respEmail,
  aludocautorizacao as docAutorizacao,
  aludocmedico as docMedico
from alunos;
";
$prp = $pdo->prepare($sql);
$prp->execute();
$data = $prp->fetchall(PDO::FETCH_ASSOC);
echo json_encode($data);
Conexao::desconectar();
