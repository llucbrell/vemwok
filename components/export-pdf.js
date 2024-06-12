import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';

class ExportPdf extends LitElement {
  static properties = {
    year: { type: Number },
    month: { type: Number },
    userName: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 20px;
    }
  `;

  generatePdf() {
    const entries = JSON.parse(localStorage.getItem('workEntries')) || {};
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margin = 10;
    const startX = margin;
    const startY = margin + 20;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;

    let currentY = startY;

    // Añadir nombre del usuario en la parte superior
    doc.text(`Trabajador: ${this.userName}`, startX, currentY);
    currentY += lineHeight;

    // Configuración de encabezados de la tabla
    const headers = ["Day", "Task", "Kilometers", "Hora de salida", "Hora de llegada", "Hours"];
    const headerXPositions = [startX, 40, 80, 110, 140, 170];

    // Dibujar encabezados
    headers.forEach((header, i) => {
      doc.text(header, headerXPositions[i], currentY);
    });
    currentY += lineHeight;

    let totalKilometers = 0;
    let totalHours = 0;

    // Añadir filas de datos
    for (const [key, tasks] of Object.entries(entries)) {
      const [entryYear, entryMonth] = key.split('-').map(Number);
      if (entryYear === this.year && entryMonth === this.month + 1) {
        tasks.forEach(task => {
          if (currentY + lineHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin + lineHeight;
          }
          const row = [
            key,
            task.task,
            task.kilometers.toString(),
            task.horaSalida || '',
            task.horaLlegada || '',
            task.hours.toString()
          ];
          row.forEach((text, i) => {
            doc.text(text, headerXPositions[i], currentY);
          });
          currentY += lineHeight;

          totalKilometers += Number(task.kilometers);
          totalHours += Number(task.hours);
        });
      }
    }

    // Añadir fila de totales
    if (currentY + lineHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin + lineHeight;
    }
    doc.text("Total", startX, currentY);
    doc.text(totalKilometers.toString(), headerXPositions[2], currentY);
    doc.text(totalHours.toString(), headerXPositions[5], currentY);

    // Descargar el PDF
    doc.save(`WorkData_${this.year}_${this.month + 1}.pdf`);
  }

  render() {
    return html`
      <button @click="${this.generatePdf}">Export to PDF</button>
    `;
  }
}

customElements.define('export-pdf', ExportPdf);
