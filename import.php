<?php

$mysqli = new mysqli("localhost", "root", "", "activesaip");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$sql = "SELECT squares, arrows, paths FROM diagramme";

$stmt = $mysqli->query($sql);

/*if ($stmt === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}*/
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