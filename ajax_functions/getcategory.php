<?php

$mysqli = new mysqli("localhost", "root", "", "secyourdev");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$category = $_GET['category'];

$sql = "SELECT id, nom FROM $category";

$stmt = $mysqli->query($sql);

echo "<table class='table'>";
echo "<tr>";
echo "<th scope='col'>ID</th>";
echo "<th scope='col'>Nom</th>";
echo "<th scope='col'></th>";
echo "</tr>";
while ($row = $stmt->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['nom'] . "</td>";
    echo "<td><button class='validerTableContextMenu'>Valider</button></td>";
    echo "</tr>";
}
echo "</table>";

$stmt->close();

?>