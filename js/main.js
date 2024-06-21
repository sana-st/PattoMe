/* リストに追加 */
function addAC() {
    let ACData = document.getElementById('new_ACData');
    let ACtable = document.getElementById('ACtable');
    
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');

    var name = document.createElement('td');
    var a = document.createElement('a');
    a.setAttribute('href', ACData.url.value);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noreferrer noopener')
    a.setAttribute('style', 'text-decoration: none;');
    a.textContent = ACData.name.value;
    name.appendChild(a);
    tr.appendChild(name);

    var url = document.createElement('td');
    url.textContent = ACData.url.value;
    tr.appendChild(url);
    var ID = document.createElement('td');
    ID.textContent = ACData.myID.value + ACData.mail.value;
    tr.appendChild(ID);
    var num = document.createElement('td');
    num.textContent = ACData.min.value + "～" + ACData.max.value;
    tr.appendChild(num);
    var pass = document.createElement('td');
    let checkbox = "";
    for (let i=0; i<ACData.pass.length; i++) {
        if (ACData.pass[i].checked) {
            if (checkbox != "") {
                checkbox += "・";
            }
            checkbox += ACData.pass[i].value;
        }
    }
    pass.textContent = checkbox;
    tr.appendChild(pass);

    var btn = document.createElement('td');
    var del_btn = document.createElement('button');
    del_btn.setAttribute('class', 'delbtn');
    del_btn.setAttribute('onclick', 'delAC(this)');
    del_btn.textContent = "✖";
    btn.appendChild(del_btn);
    tr.appendChild(btn);
    
    tbody.appendChild(tr);
    ACtable.appendChild(tbody);

    ACData.reset();
}

/* リストの行を削除 */
function delAC(button) {
    const tr = button.parentNode.parentNode;
    tr.parentNode.deleteRow(tr.sectionRowIndex);
}

/* リストをダウンロード */
function exportACtable() {
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    var table = document.getElementById('ACtable');
    var data_csv = "";

    for (var i=0; i<table.rows.length; i++) {
        if (i == 1) {
            data_csv += ",,,";
            data_csv += table.rows[i].cells[0].innerText;
            data_csv += ",";
            data_csv += table.rows[i].cells[2].innerText;
            data_csv += "\n";
        }
        else {
            for (var j=0; j<table.rows[i].cells.length-1; j++) {
                data_csv += table.rows[i].cells[j].innerText;
                if (j == table.rows[i].cells.length-2) {
                    data_csv += "\n";
                }
                else {
                    data_csv += ",";
                }
            }
        }
    }

    const blob = new Blob([bom, data_csv], {type:"text/csv"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'MyAccountList.csv'
    link.click();
    delete data_csv;
}

/* ファイルを読み込む */
window.addEventListener('load', () => {
    const importAC = document.getElementById('importAC');
    const impbtn = document.getElementById('impbtn');

    impbtn.addEventListener('click',(e)=> {
        if (importAC) {
            importAC.click();
        }
    }, false);

    importAC.addEventListener('change', evt => {
        const input = evt.target;
        if (input.files.length == 0) {
            console.log('No file selected');
            return;
        }
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result.split("\n");
            result.shift();
            result.shift();

            let table = document.getElementById('ACtable');

            for (let i=0; i<result.length-1; i++) {
                var tbody = document.createElement('tbody');
                var tr = document.createElement('tr');
                var data = result[i].split(",");
                for (let j=0; j<data.length; j++) {
                    if (j == 0) {
                        var td = document.createElement('td');
                        var a = document.createElement('a');
                        a.setAttribute('href', data[j+1]);
                        a.setAttribute('target', '_blank');
                        a.setAttribute('rel', 'noreferrer noopener');
                        a.setAttribute('style', 'text-decoration: none;');
                        a.textContent = data[j];
                        td.appendChild(a);
                        tr.appendChild(td);
                    }
                    else {
                        var td = document.createElement('td');
                        td.textContent = data[j];
                        tr.appendChild(td);
                    }
                }
                var btn = document.createElement('td');
                var del_btn = document.createElement('button');
                del_btn.setAttribute('class', 'delbtn');
                del_btn.setAttribute('onclick', 'delAC(this)');
                del_btn.textContent = "✖";
                btn.appendChild(del_btn);
                tr.appendChild(btn);
                tbody.appendChild(tr);
                table.appendChild(tbody);
            }
        };
        reader.readAsText(file);
    });
});