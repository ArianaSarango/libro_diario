document.getElementById("entryForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const entry = Object.fromEntries(formData.entries());

    // Convertir valores a números con decimales
    entry.comprobante = parseInt(entry.comprobante, 10);
    entry.ingreso_caja = parseFloat(entry.ingreso_caja);
    entry.egreso_caja = parseFloat(entry.egreso_caja);
    entry.ingreso_banco = parseFloat(entry.ingreso_banco);
    entry.egreso_banco = parseFloat(entry.egreso_banco);
    entry.iva_ingreso = parseFloat(entry.iva_ingreso);
    entry.iva_egreso = parseFloat(entry.iva_egreso);

    // Calcular saldos
    entry.saldo_caja = (entry.ingreso_caja - entry.egreso_caja).toFixed(2);
    entry.saldo_banco = (entry.ingreso_banco - entry.egreso_banco).toFixed(2);

    // Insertar en la tabla principal
    const table = document.getElementById("entriesTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const fields = ["fecha", "detalles", "comprobante", "ingreso_caja", "egreso_caja", "saldo_caja", "ingreso_banco", "egreso_banco", "saldo_banco", "iva_ingreso", "iva_egreso"];

    fields.forEach(field => {
        const newCell = newRow.insertCell();
        const newText = document.createTextNode(entry[field]);
        newCell.appendChild(newText);
    });

    // Actualizar la tabla PDF
    const tablePdf = document.getElementById("entriesTablePdf").getElementsByTagName('tbody')[0];
    const newRowPdf = tablePdf.insertRow();

    fields.forEach(field => {
        const newCellPdf = newRowPdf.insertCell();
        const newTextPdf = document.createTextNode(entry[field]);
        newCellPdf.appendChild(newTextPdf);
    });

    // Actualizar totales
    updateTotals();

    event.target.reset();
});

function updateTotals() {
    const table = document.getElementById("entriesTable").getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    
    let totalIngresoCaja = 0, totalEgresoCaja = 0, totalSaldoCaja = 0;
    let totalIngresoBanco = 0, totalEgresoBanco = 0, totalSaldoBanco = 0;
    let totalIVAIngreso = 0, totalIVAegreso = 0;
    
    Array.from(rows).forEach(row => {
        totalIngresoCaja += parseFloat(row.cells[3].textContent || 0);
        totalEgresoCaja += parseFloat(row.cells[4].textContent || 0);
        totalSaldoCaja += parseFloat(row.cells[5].textContent || 0);
        totalIngresoBanco += parseFloat(row.cells[6].textContent || 0);
        totalEgresoBanco += parseFloat(row.cells[7].textContent || 0);
        totalSaldoBanco += parseFloat(row.cells[8].textContent || 0);
        totalIVAIngreso += parseFloat(row.cells[9].textContent || 0);
        totalIVAegreso += parseFloat(row.cells[10].textContent || 0);
    });

    document.getElementById("totalIngresoCaja").textContent = totalIngresoCaja.toFixed(2);
    document.getElementById("totalEgresoCaja").textContent = totalEgresoCaja.toFixed(2);
    document.getElementById("totalSaldoCaja").textContent = totalSaldoCaja.toFixed(2);
    document.getElementById("totalIngresoBanco").textContent = totalIngresoBanco.toFixed(2);
    document.getElementById("totalEgresoBanco").textContent = totalEgresoBanco.toFixed(2);
    document.getElementById("totalSaldoBanco").textContent = totalSaldoBanco.toFixed(2);
    document.getElementById("totalIVAIngreso").textContent = (totalIngresoCaja * totalIVAIngreso / 100).toFixed(2);
    document.getElementById("totalIVAegreso").textContent = (totalEgresoCaja * totalIVAegreso / 100).toFixed(2);

    // Actualizar la tabla de resultados de búsqueda
    document.getElementById("totalIngresoCajaPdf").textContent = totalIngresoCaja.toFixed(2);
    document.getElementById("totalEgresoCajaPdf").textContent = totalEgresoCaja.toFixed(2);
    document.getElementById("totalSaldoCajaPdf").textContent = totalSaldoCaja.toFixed(2);
    document.getElementById("totalIngresoBancoPdf").textContent = totalIngresoBanco.toFixed(2);
    document.getElementById("totalEgresoBancoPdf").textContent = totalEgresoBanco.toFixed(2);
    document.getElementById("totalSaldoBancoPdf").textContent = totalSaldoBanco.toFixed(2);
    document.getElementById("totalIVAIngresoPdf").textContent = (totalIngresoCaja * totalIVAIngreso / 100).toFixed(2);
    document.getElementById("totalIVAegresoPdf").textContent = (totalEgresoCaja * totalIVAegreso / 100).toFixed(2);
}

document.getElementById('saveData').addEventListener('click', () => {
    // Guardar datos en el localStorage
    const table = document.getElementById("entriesTable").getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    const data = Array.from(rows).map(row => {
        return Array.from(row.getElementsByTagName('td')).map(td => td.textContent);
    });
    localStorage.setItem('entries', JSON.stringify(data));
});

document.getElementById('searchButton').addEventListener('click', () => {
    document.getElementById('searchContainer').style.display = 'block';
});

document.getElementById('searchData').addEventListener('click', () => {
    const searchDate = document.getElementById('searchDate').value;
    const data = JSON.parse(localStorage.getItem('entries') || '[]');
    const filteredData = data.filter(row => row[0] === searchDate);

    const searchResultsTable = document.getElementById('searchResultsTable').getElementsByTagName('tbody')[0];
    searchResultsTable.innerHTML = ''; // Limpiar resultados anteriores

    filteredData.forEach(row => {
        const newRow = searchResultsTable.insertRow();
        row.forEach(cell => {
            const newCell = newRow.insertCell();
            const newText = document.createTextNode(cell);
            newCell.appendChild(newText);
        });
    });

    // Actualizar totales en resultados de búsqueda
    updateTotals();

    document.getElementById('searchResults').style.display = 'block';
});

document.getElementById('printResults').addEventListener('click', () => {
    const printContent = document.getElementById('searchResults').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Resultados de la Búsqueda</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});

document.getElementById('downloadPdf').addEventListener('click', () => {
    const element = document.getElementById('pdfContent');
    element.style.display = 'block';
    var opt = {
        margin:       [0.5, 0.5, 0.5, 0.5],
        filename:     'LibroDiario.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a3', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save().then(() => {
        element.style.display = 'none';
    });
});
