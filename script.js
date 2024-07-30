document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entryForm');
    const entriesTableBody = document.querySelector('#entriesTable tbody');
    const searchResultsTableBody = document.querySelector('#searchResultsTable tbody');
    const searchResultsTableFoot = document.querySelector('#searchResultsTable tfoot');
    const chartCanvas = document.getElementById('chartCanvas').getContext('2d');

    let entries = [];

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const fecha = document.getElementById('fecha').value;
        const detalles = document.getElementById('detalles').value;
        const comprobante = document.getElementById('comprobante').value;
        const ingresoCaja = parseFloat(document.getElementById('ingreso_caja').value) || 0;
        const egresoCaja = parseFloat(document.getElementById('egreso_caja').value) || 0;
        const ingresoBanco = parseFloat(document.getElementById('ingreso_banco').value) || 0;
        const egresoBanco = parseFloat(document.getElementById('egreso_banco').value) || 0;
        const ivaIngreso = parseFloat(document.getElementById('iva_ingreso').value) || 0;
        const ivaEgreso = parseFloat(document.getElementById('iva_egreso').value) || 0;

        const saldoCaja = ingresoCaja - egresoCaja;
        const saldoBanco = ingresoBanco - egresoBanco;
        const totalIVAIngreso = (ingresoCaja + ingresoBanco) * (ivaIngreso / 100);
        const totalIVAegreso = (egresoCaja + egresoBanco) * (ivaEgreso / 100);

        entries.push({
            fecha,
            detalles,
            comprobante,
            ingresoCaja,
            egresoCaja,
            saldoCaja,
            ingresoBanco,
            egresoBanco,
            saldoBanco,
            ivaIngreso,
            ivaEgreso,
            totalIVAIngreso,
            totalIVAegreso
        });

        updateTables();
        updateChart();
    });

    document.getElementById('searchButton').addEventListener('click', () => {
        document.getElementById('searchContainer').style.display = 'block';
    });

    document.getElementById('searchData').addEventListener('click', () => {
        const searchDate = document.getElementById('searchDate').value;
        const filteredEntries = entries.filter(entry => entry.fecha === searchDate);

        searchResultsTableBody.innerHTML = '';
        searchResultsTableFoot.querySelector('#totalIngresoCaja').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalEgresoCaja').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalSaldoCaja').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalIngresoBanco').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalEgresoBanco').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalSaldoBanco').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalIVAIngreso').textContent = '0.00';
        searchResultsTableFoot.querySelector('#totalIVAegreso').textContent = '0.00';

        filteredEntries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.fecha}</td>
                <td>${entry.detalles}</td>
                <td>${entry.comprobante}</td>
                <td>${entry.ingresoCaja.toFixed(2)}</td>
                <td>${entry.egresoCaja.toFixed(2)}</td>
                <td>${entry.saldoCaja.toFixed(2)}</td>
                <td>${entry.ingresoBanco.toFixed(2)}</td>
                <td>${entry.egresoBanco.toFixed(2)}</td>
                <td>${entry.saldoBanco.toFixed(2)}</td>
                <td>${entry.ivaIngreso.toFixed(2)}</td>
                <td>${entry.ivaEgreso.toFixed(2)}</td>
                <td>${entry.totalIVAIngreso.toFixed(2)}</td>
                <td>${entry.totalIVAegreso.toFixed(2)}</td>
            `;
            searchResultsTableBody.appendChild(row);
        });

        updateSearchResultsTotals(filteredEntries);
    });

    function updateTables() {
        entriesTableBody.innerHTML = '';
        entries.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.fecha}</td>
                <td>${entry.detalles}</td>
                <td>${entry.comprobante}</td>
                <td>${entry.ingresoCaja.toFixed(2)}</td>
                <td>${entry.egresoCaja.toFixed(2)}</td>
                <td>${entry.saldoCaja.toFixed(2)}</td>
                <td>${entry.ingresoBanco.toFixed(2)}</td>
                <td>${entry.egresoBanco.toFixed(2)}</td>
                <td>${entry.saldoBanco.toFixed(2)}</td>
                <td>${entry.ivaIngreso.toFixed(2)}</td>
                <td>${entry.ivaEgreso.toFixed(2)}</td>
                <td>${entry.totalIVAIngreso.toFixed(2)}</td>
                <td>${entry.totalIVAegreso.toFixed(2)}</td>
            `;
            entriesTableBody.appendChild(row);
        });

        updateTotals();
    }

    function updateTotals() {
        const totalIngresoCaja = entries.reduce((acc, entry) => acc + entry.ingresoCaja, 0);
        const totalEgresoCaja = entries.reduce((acc, entry) => acc + entry.egresoCaja, 0);
        const totalSaldoCaja = totalIngresoCaja - totalEgresoCaja;
        const totalIngresoBanco = entries.reduce((acc, entry) => acc + entry.ingresoBanco, 0);
        const totalEgresoBanco = entries.reduce((acc, entry) => acc + entry.egresoBanco, 0);
        const totalSaldoBanco = totalIngresoBanco - totalEgresoBanco;
        const totalIVAIngreso = entries.reduce((acc, entry) => acc + entry.totalIVAIngreso, 0);
        const totalIVAegreso = entries.reduce((acc, entry) => acc + entry.totalIVAegreso, 0);

        document.getElementById('totalIngresoCaja').textContent = totalIngresoCaja.toFixed(2);
        document.getElementById('totalEgresoCaja').textContent = totalEgresoCaja.toFixed(2);
        document.getElementById('totalSaldoCaja').textContent = totalSaldoCaja.toFixed(2);
        document.getElementById('totalIngresoBanco').textContent = totalIngresoBanco.toFixed(2);
        document.getElementById('totalEgresoBanco').textContent = totalEgresoBanco.toFixed(2);
        document.getElementById('totalSaldoBanco').textContent = totalSaldoBanco.toFixed(2);
        document.getElementById('totalIVAIngreso').textContent = totalIVAIngreso.toFixed(2);
        document.getElementById('totalIVAegreso').textContent = totalIVAegreso.toFixed(2);
    }

    function updateSearchResultsTotals(filteredEntries) {
        const totalIngresoCaja = filteredEntries.reduce((acc, entry) => acc + entry.ingresoCaja, 0);
        const totalEgresoCaja = filteredEntries.reduce((acc, entry) => acc + entry.egresoCaja, 0);
        const totalSaldoCaja = totalIngresoCaja - totalEgresoCaja;
        const totalIngresoBanco = filteredEntries.reduce((acc, entry) => acc + entry.ingresoBanco, 0);
        const totalEgresoBanco = filteredEntries.reduce((acc, entry) => acc + entry.egresoBanco, 0);
        const totalSaldoBanco = totalIngresoBanco - totalEgresoBanco;
        const totalIVAIngreso = filteredEntries.reduce((acc, entry) => acc + entry.totalIVAIngreso, 0);
        const totalIVAegreso = filteredEntries.reduce((acc, entry) => acc + entry.totalIVAegreso, 0);

        searchResultsTableFoot.querySelector('#totalIngresoCaja').textContent = totalIngresoCaja.toFixed(2);
        searchResultsTableFoot.querySelector('#totalEgresoCaja').textContent = totalEgresoCaja.toFixed(2);
        searchResultsTableFoot.querySelector('#totalSaldoCaja').textContent = totalSaldoCaja.toFixed(2);
        searchResultsTableFoot.querySelector('#totalIngresoBanco').textContent = totalIngresoBanco.toFixed(2);
        searchResultsTableFoot.querySelector('#totalEgresoBanco').textContent = totalEgresoBanco.toFixed(2);
        searchResultsTableFoot.querySelector('#totalSaldoBanco').textContent = totalSaldoBanco.toFixed(2);
        searchResultsTableFoot.querySelector('#totalIVAIngreso').textContent = totalIVAIngreso.toFixed(2);
        searchResultsTableFoot.querySelector('#totalIVAegreso').textContent = totalIVAegreso.toFixed(2);
    }

    function updateChart() {
        const ingresos = entries.reduce((acc, entry) => acc + entry.ingresoCaja + entry.ingresoBanco, 0);
        const egresos = entries.reduce((acc, entry) => acc + entry.egresoCaja + entry.egresoBanco, 0);
        const saldo = ingresos - egresos;

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: ['Ingresos', 'Egresos', 'Saldo'],
                datasets: [{
                    label: 'Monto (USD)',
                    data: [ingresos, egresos, saldo],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    document.getElementById('saveData').addEventListener('click', () => {
        const dataStr = JSON.stringify(entries);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'entries.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('printResults').addEventListener('click', () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Resultados de Búsqueda</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(document.getElementById('searchResults').innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });

    document.getElementById('downloadPdf').addEventListener('click', () => {
        const element = document.getElementById('pdfContent');
        html2pdf().from(element).save('LibroDiario.pdf');
    });
});