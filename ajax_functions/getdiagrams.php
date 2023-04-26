<?php

$mysqli = new mysqli("localhost", "root", "", "secyourdev");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}


$sql = "SELECT id, path description FROM diagramme";

$stmt = $mysqli->query($sql);

echo "<table class='table'>";
echo "<tr>";
echo "<th scope='col'>ID</th>";
echo "<th scope='col'></th>";
echo "</tr>";
while ($row = $stmt->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td><button class='validerPath btn btn-primary click'>Valider</button></td>";
    echo "</tr>";
}
echo "</table>";

$stmt->close();

?>