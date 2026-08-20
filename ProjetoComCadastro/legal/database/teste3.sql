create database teste3;
use teste3;

CREATE TABLE alunos (
  aluid int PRIMARY KEY AUTO_INCREMENT,
  alusexo varchar(100),
  alunome varchar(100),
  aluemail varchar(100),
  alutelefone varchar(100),
  alucpf varchar(100),
  aludatanasc date,
  alualtura varchar(100),
  alupeso varchar(100),
  alucidade varchar(100),
  aluuf varchar(10),
  aluendereco varchar(150),
  alunumero varchar(20),
  alubairro varchar(100),
  alucep varchar(20),
  alurg varchar(50),
  alurespnome varchar(150),
  alurespcpf varchar(100),
  aluresptel varchar(100),
  alurespemail varchar(100),
  aludocautorizacao varchar(255),
  aludocmedico varchar(255),
  alupsf varchar(100),
  alusenha varchar(100)
);

CREATE TABLE professores (
  proid int PRIMARY KEY AUTO_INCREMENT,
  pronome varchar(100),
  proemail varchar(100),
  protelefone varchar(100),
  prosenha varchar(100)
);

CREATE TABLE turmas (
  turid int PRIMARY KEY AUTO_INCREMENT,
  turnome varchar(100),
  turproid int,
  FOREIGN KEY (turproid) REFERENCES professores(proid)
);

CREATE TABLE matriculas (
  matid int PRIMARY KEY AUTO_INCREMENT,
  mataluid int,
  matturid int NULL,
  matstatus varchar(100),
  matdata date,
  FOREIGN KEY (mataluid) REFERENCES alunos(aluid),
  FOREIGN KEY (matturid) REFERENCES turmas(turid)
);

-- Tabela adicional necessária para a Chamada. Ela não estava no script original
-- enviado, mas é indispensável pois a chamada é feita "por matrícula" (o aluno já
-- aprovado e vinculado a uma turma), conforme pedido.
CREATE TABLE chamadas (
  chaid int PRIMARY KEY AUTO_INCREMENT,
  chamatid int,
  chadata date,
  chastatus varchar(20), -- presente | falta | justificada
  FOREIGN KEY (chamatid) REFERENCES matriculas(matid)
);
