<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$credentialsPath = getenv("TIEUP_CREDENTIALS_FILE") ?: dirname(__DIR__) . "/.db_credentials.txt";

if (!is_file($credentialsPath)) {
    $credentialsPath = "/var/www/facu_fx/.db_credentials.txt";
}

if (is_file($credentialsPath)) {
    $credentials = parse_ini_file($credentialsPath);
    $host = $credentials["Host"];
    $user = $credentials["Usuario"];
    $password = $credentials["Contraseña"];
    $database = $credentials["basesdedatos"];
} else {
    $host = "localhost";
    $user = "root";
    $password = "";
    $database = "tieup";
}

try {
    $conn = new mysqli($host, $user, $password, $database);
    $conn->set_charset("utf8mb4");
} catch (mysqli_sql_exception $error) {
    error_log($error->getMessage());
    http_response_code(500);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["ok" => false, "message" => "No se pudo conectar con la base de datos"]);
    exit();
}
