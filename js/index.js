function showPaths() {
    //console.log('change : ' + str);
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("txtHint").innerHTML = this.responseText;
        var validerBoutons = document.getElementsByClassName('validerPath');
        for (const validerBouton of validerBoutons) {
            validerBouton.addEventListener('click', function() {
                console.log('index : ' + this.parentNode.parentNode.rowIndex);
                //Get full information of the selected row
                var row = this.parentNode.parentNode;
                var cells = row.getElementsByTagName('td');
                var id = cells[0].innerHTML;
                var nom = cells[1].innerHTML;
                var description = cells[2].innerHTML;
                console.log('id : ' + id + ', nom : ' + nom + ', description : ' + description);
                dessinerCarre();
            });
        }
      }
    };
    xhttp.open("GET", "../ajax_funtions/getpaths.php?", true);
    xhttp.send();
}

showPaths();