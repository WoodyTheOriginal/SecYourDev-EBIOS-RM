<?php

$mysqli = new mysqli("localhost", "root", "", "activesaip");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$category = $_GET['category'];

$sql = "SELECT id, nom, description FROM $category";

$stmt = $mysqli->query($sql);

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

$stmt->close();

?>