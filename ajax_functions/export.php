<?php

$mysqli = new mysqli("localhost", "root", "", "activesaip");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$squares = $_POST['data'];
$arrows = $_POST['data2'];
$paths = $_POST['data3'];

$sql = "INSERT INTO diagramme (squares, arrows, paths) VALUES ('$squares', '$arrows', '$paths')";

$stmt = $mysqli->query($sql);

if ($stmt === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}

/*
echo "<table>";
echo "<tr>";
echo "<th>Category ID</th>";
echo "<th>Nom</th>";
echo "<th>Description</th>";
echo "<th></th>";
echo "</tr>";
while ($row = $stmt->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['nom'] . "</td>";
    echo "<td>" . $row['description'] . "</td>";
    echo "<td><button class='validerTable'>Valider</button></td>";
    echo "</tr>";
}
echo "</table>";
*/

$mysqli->close();

?>