<?php

$mysqli = new mysqli("localhost", "root", "", "activesaip");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$id = $_GET['id'];

$sql = "SELECT squares, arrows, paths FROM diagramme WHERE id = $id";

$stmt = $mysqli->query($sql);

while ($row = $stmt->fetch_assoc()) {
    $squares = $row['squares'];
    $arrows = $row['arrows'];
    $paths = $row['paths'];
}

$squaresJSON = json_decode($squares);
$arrowsJSON = json_decode($arrows);
$pathsJSON = json_decode($paths);

echo json_encode(array('squares' => $squaresJSON, 'arrows' => $arrowsJSON, 'paths' => $pathsJSON));

$mysqli->close();

?>