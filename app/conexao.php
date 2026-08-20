<?php
class Conexao
{
    private static $dbname = "teste6";
    private static $host = "127.0.0.1";
    private static $user = "root";
    private static $pass = "";
    private static $con = null;

    public function __construct()
    {
        throw new \Exception('Not implemented');
    }

    public static function conectar()
    {
        if (null === self::$con) {
            try {
                self::$con = new PDO(
                    "mysql:host=" . self::$host . ";dbname=" . self::$dbname,
                    self::$user,
                    self::$pass,
                    array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
                );
                self::$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (Exception $erro) {
                die($erro->getMessage());
            }
        }
        return self::$con;
    }

    public static function desconectar()
    {
        self::$con = null;
    }
}
