<?php

declare(strict_types=1);

session_start();

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
$allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Vary: Origin");
}

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/db_connect.php";

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function requestData(): array
{
    $contentType = $_SERVER["CONTENT_TYPE"] ?? "";

    if (str_contains($contentType, "application/json")) {
        $decoded = json_decode(file_get_contents("php://input"), true);
        return is_array($decoded) ? $decoded : [];
    }

    return $_POST;
}

function requirePost(): void
{
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        respond(["ok" => false, "message" => "Método no permitido"], 405);
    }
}

function currentUser(): ?array
{
    if (!isset($_SESSION["user_id"])) {
        return null;
    }

    return [
        "id" => (int) $_SESSION["user_id"],
        "name" => (string) $_SESSION["user_name"],
        "email" => (string) $_SESSION["user_email"],
        "role" => (string) ($_SESSION["user_role"] ?? "user"),
    ];
}

function requireUser(): array
{
    $user = currentUser();

    if ($user === null) {
        respond(["ok" => false, "message" => "Debes iniciar sesión"], 401);
    }

    return $user;
}

function requireAdmin(): array
{
    $user = requireUser();

    if ($user["role"] !== "admin") {
        respond(["ok" => false, "message" => "Acceso exclusivo para administradores"], 403);
    }

    return $user;
}

function csrfToken(): string
{
    if (empty($_SESSION["react_csrf_token"])) {
        $_SESSION["react_csrf_token"] = bin2hex(random_bytes(32));
    }

    return $_SESSION["react_csrf_token"];
}

function verifyCsrf(array $data): void
{
    $received = (string) ($data["csrf_token"] ?? "");
    $stored = (string) ($_SESSION["react_csrf_token"] ?? "");

    if ($stored === "" || !hash_equals($stored, $received)) {
        respond(["ok" => false, "message" => "La sesión del formulario venció. Recarga la página"], 403);
    }
}

$action = $_GET["action"] ?? "bootstrap";

try {
    switch ($action) {
        case "bootstrap":
            respond([
                "ok" => true,
                "user" => currentUser(),
                "csrf_token" => csrfToken(),
            ]);

        case "services":
            $result = $conn->query(
                "SELECT servicios.id_service AS id, servicios.title, servicios.category,
                        servicios.specialty, servicios.description, servicios.price,
                        servicios.delivery_time, servicios.created_at,
                        usuarios.name AS professional_name
                 FROM servicios
                 INNER JOIN usuarios ON usuarios.id_user = servicios.user_id
                 WHERE servicios.status = 'active'
                 ORDER BY servicios.created_at DESC"
            );

            respond(["ok" => true, "services" => $result->fetch_all(MYSQLI_ASSOC)]);

        case "login":
            requirePost();
            $data = requestData();
            $email = trim((string) ($data["email"] ?? ""));
            $password = (string) ($data["password"] ?? "");

            if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === "") {
                respond(["ok" => false, "message" => "Ingresa un correo y una contraseña válidos"], 422);
            }

            $stmt = $conn->prepare(
                "SELECT id_user, name, email, password, role FROM usuarios WHERE email = ?"
            );
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $user = $stmt->get_result()->fetch_assoc();

            if (!$user || !password_verify($password, $user["password"])) {
                respond(["ok" => false, "message" => "Correo o contraseña incorrectos"], 401);
            }

            session_regenerate_id(true);
            $_SESSION["user_id"] = (int) $user["id_user"];
            $_SESSION["user_name"] = $user["name"];
            $_SESSION["user_email"] = $user["email"];
            $_SESSION["user_role"] = $user["role"];

            respond(["ok" => true, "user" => currentUser(), "csrf_token" => csrfToken()]);

        case "register":
            requirePost();
            $data = requestData();
            $name = trim((string) ($data["name"] ?? ""));
            $email = trim((string) ($data["email"] ?? ""));
            $password = (string) ($data["password"] ?? "");

            if ($name === "" || strlen($name) > 80) {
                respond(["ok" => false, "message" => "Ingresa un nombre válido"], 422);
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                respond(["ok" => false, "message" => "El correo electrónico no es válido"], 422);
            }

            if (
                strlen($password) < 8 || strlen($password) > 12 ||
                !preg_match("/[A-Z]/", $password) ||
                !preg_match("/[a-z]/", $password) ||
                !preg_match("/[0-9]/", $password) ||
                !preg_match('/[^a-zA-Z0-9]/', $password)
            ) {
                respond([
                    "ok" => false,
                    "message" => "La contraseña debe tener 8 a 12 caracteres, mayúscula, minúscula, número y símbolo",
                ], 422);
            }

            $check = $conn->prepare("SELECT id_user FROM usuarios WHERE email = ?");
            $check->bind_param("s", $email);
            $check->execute();

            if ($check->get_result()->num_rows > 0) {
                respond(["ok" => false, "message" => "Ya existe una cuenta con ese correo"], 409);
            }

            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO usuarios (name, email, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $email, $hash);
            $stmt->execute();

            session_regenerate_id(true);
            $_SESSION["user_id"] = $stmt->insert_id;
            $_SESSION["user_name"] = $name;
            $_SESSION["user_email"] = $email;
            $_SESSION["user_role"] = "user";

            respond(["ok" => true, "user" => currentUser(), "csrf_token" => csrfToken()], 201);

        case "logout":
            requirePost();
            $_SESSION = [];
            session_destroy();
            respond(["ok" => true]);

        case "contact":
            requirePost();
            $data = requestData();
            verifyCsrf($data);
            $topic = trim((string) ($data["topic"] ?? ""));
            $message = trim((string) ($data["message"] ?? ""));
            $email = trim((string) ($data["email"] ?? ""));

            if ($topic === "" || strlen($topic) > 150 || $message === "" || strlen($message) > 5000) {
                respond(["ok" => false, "message" => "Completa el asunto y el mensaje"], 422);
            }

            if (strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                respond(["ok" => false, "message" => "Ingresa un correo electrónico válido"], 422);
            }

            $userId = isset($_SESSION["user_id"]) ? (int) $_SESSION["user_id"] : null;
            $stmt = $conn->prepare(
                "INSERT INTO contact_messages (user_id, topic, message, email) VALUES (?, ?, ?, ?)"
            );
            $stmt->bind_param("isss", $userId, $topic, $message, $email);
            $stmt->execute();
            respond(["ok" => true, "message" => "Tu mensaje fue enviado correctamente"], 201);

        case "my-services":
            $user = requireUser();
            $userId = (int) $user["id"];
            $stmt = $conn->prepare(
                "SELECT id_service AS id, title, category, specialty, description, price,
                        delivery_time, status, created_at
                 FROM servicios WHERE user_id = ? ORDER BY created_at DESC"
            );
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            respond(["ok" => true, "services" => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);

        case "create-service":
            requirePost();
            $user = requireUser();
            $userId = (int) $user["id"];
            $data = requestData();
            verifyCsrf($data);
            $title = trim((string) ($data["title"] ?? ""));
            $category = trim((string) ($data["category"] ?? ""));
            $specialty = trim((string) ($data["specialty"] ?? ""));
            $description = trim((string) ($data["description"] ?? ""));
            $delivery = trim((string) ($data["delivery_time"] ?? ""));
            $price = filter_var($data["price"] ?? null, FILTER_VALIDATE_FLOAT);

            if ($title === "" || strlen($title) > 120 || $category === "" || strlen($category) > 80) {
                respond(["ok" => false, "message" => "Completa un título y una categoría válidos"], 422);
            }

            if ($specialty === "" || strlen($specialty) > 100 || $description === "" || strlen($description) > 2000) {
                respond(["ok" => false, "message" => "Completa la especialidad y la descripción"], 422);
            }

            if ($price === false || $price <= 0 || $delivery === "" || strlen($delivery) > 80) {
                respond(["ok" => false, "message" => "Ingresa un precio y plazo de entrega válidos"], 422);
            }

            $stmt = $conn->prepare(
                "INSERT INTO servicios
                    (user_id, title, category, specialty, description, price, delivery_time)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->bind_param(
                "issssds",
                $userId,
                $title,
                $category,
                $specialty,
                $description,
                $price,
                $delivery
            );
            $stmt->execute();
            respond(["ok" => true, "message" => "El servicio fue publicado correctamente"], 201);

        case "admin":
            requireAdmin();
            $counts = [
                "users" => (int) $conn->query("SELECT COUNT(*) AS total FROM usuarios")->fetch_assoc()["total"],
                "services" => (int) $conn->query("SELECT COUNT(*) AS total FROM servicios")->fetch_assoc()["total"],
                "pending" => (int) $conn->query(
                    "SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'pending'"
                )->fetch_assoc()["total"],
            ];
            $messages = $conn->query(
                "SELECT contact_messages.id_message AS id, contact_messages.topic,
                        contact_messages.message, contact_messages.email,
                        contact_messages.status, contact_messages.created_at,
                        COALESCE(usuarios.name, 'Visitante') AS user_name
                 FROM contact_messages
                 LEFT JOIN usuarios ON contact_messages.user_id = usuarios.id_user
                 ORDER BY contact_messages.created_at DESC"
            )->fetch_all(MYSQLI_ASSOC);
            $services = $conn->query(
                "SELECT servicios.id_service AS id, servicios.title, servicios.category,
                        servicios.price, servicios.status, servicios.created_at,
                        usuarios.name AS professional_name
                 FROM servicios
                 INNER JOIN usuarios ON servicios.user_id = usuarios.id_user
                 ORDER BY servicios.created_at DESC"
            )->fetch_all(MYSQLI_ASSOC);
            respond(["ok" => true, "counts" => $counts, "messages" => $messages, "services" => $services]);

        case "update-contact":
            requirePost();
            requireAdmin();
            $data = requestData();
            verifyCsrf($data);
            $id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);
            $status = (string) ($data["status"] ?? "");

            if (!$id || !in_array($status, ["pending", "read", "answered"], true)) {
                respond(["ok" => false, "message" => "Datos inválidos"], 422);
            }

            $stmt = $conn->prepare("UPDATE contact_messages SET status = ? WHERE id_message = ?");
            $stmt->bind_param("si", $status, $id);
            $stmt->execute();
            respond(["ok" => true]);

        case "update-service":
            requirePost();
            requireAdmin();
            $data = requestData();
            verifyCsrf($data);
            $id = filter_var($data["id"] ?? null, FILTER_VALIDATE_INT);
            $status = (string) ($data["status"] ?? "");

            if (!$id || !in_array($status, ["active", "inactive"], true)) {
                respond(["ok" => false, "message" => "Datos inválidos"], 422);
            }

            $stmt = $conn->prepare("UPDATE servicios SET status = ? WHERE id_service = ?");
            $stmt->bind_param("si", $status, $id);
            $stmt->execute();
            respond(["ok" => true]);

        default:
            respond(["ok" => false, "message" => "Acción desconocida"], 404);
    }
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(["ok" => false, "message" => "Ocurrió un error en el servidor"], 500);
}
