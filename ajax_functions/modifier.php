<?php

$mysqli = new mysqli("localhost", "root", "", "secyourdev");
if ($mysqli->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$table = $_GET['table'];
$champs = $_GET['champs'];
$data = $_GET['data'];
$nom = $_GET['nom'];

$sql = "UPDATE $table SET $champs = '$data' WHERE nom = '$nom'";

$stmt = $mysqli->query($sql);

$mysqli->close();

?>