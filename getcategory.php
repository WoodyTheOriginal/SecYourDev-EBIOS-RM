<?php

$mysqli = new mysqli("localhost", "root", "", "activesaip");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$category = $_GET['category'];

$sql = "SELECT id, nom, description FROM $category";

$stmt = $mysqli->prepare($sql);
$stmt->execute();
$stmt->bind_result($categoryId, $nom, $description);
$stmt->fetch();
$stmt->close();

echo "<table>";
echo "<tr>";
echo "<th>Category ID</th>";
echo "<th>Nom</th>";
echo "<th>Description</th>";
echo "</tr>";
echo "<tr>";
echo "<td>" . $categoryId . "</td>";
echo "<td>" . $nom . "</td>";
echo "<td>" . $description . "</td>";
echo "</tr>";
echo "</table>";

?>