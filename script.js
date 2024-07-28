document.getElementById("entryForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const entry = Object.fromEntries(formData.entries());

    // Convertir valores a números
    entry.comprobante = parseInt(entry.comprobante, 10);
    entry.ingreso_caja = parseInt(entry.ingreso_caja, 10);
    entry.egreso_caja = parseInt(entry.egreso_caja, 10);
    entry.ingreso_banco = parseInt(entry.ingreso_banco, 10);
    entry.egreso_banco = parseInt(entry.egreso_banco, 10);
    entry.iva_ingreso = parseFloat(entry.iva_ingreso);
    entry.iva_egreso = parseFloat(entry.iva_egreso);

    // Calcular saldos
    entry.saldo_caja = entry.ingreso_caja - entry.egreso_caja;
    entry.saldo_banco = entry.ingreso_banco - entry.egreso_banco;

    const table = document.getElementById("entriesTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const fields = ["fecha", "detalles", "comprobante", "ingreso_caja", "egreso_caja", "saldo_caja", "ingreso_banco", "egreso_banco", "saldo_banco", "iva_ingreso", "iva_egreso"];

    fields.forEach(field => {
        const newCell = newRow.insertCell();
        const newText = document.createTextNode(entry[field]);
        newCell.appendChild(newText);
    });

    event.target.reset();
});