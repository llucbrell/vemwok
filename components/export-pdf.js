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
    const boxWidth = 40;
    const baseBoxHeight = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    let currentX = startX;
    let currentY = startY + 20;
    let maxHeightInRow = baseBoxHeight;

    const drawHeader = (doc, currentPage) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Valenciana de Emergencias (V.E.M.)", startX, startY - 10);
      doc.text("Trabajador: " + this.userName, startX, startY - 4);
      doc.text(`Página ${currentPage}`, pageWidth - margin - 20, startY - 10);
    };

    const drawDayBox = (doc, day, tasks, currentX, currentY) => {
      doc.setFontSize(14); // Tamaño más grande para el número del día
      doc.setFont('helvetica', 'bold');
      doc.text(day.toString(), currentX + 2, currentY + 8);
      doc.setFontSize(10);
      let boxHeight = baseBoxHeight;
      let taskY = currentY + 12;
      doc.setFontSize(8);

      tasks.forEach(task => {
        const taskLines = [
          `Tarea: ${task.task}`,
          `Salida: ${task.horaSalida}`,
          `Llegada: ${task.horaLlegada}`,
          `Horas: ${task.hours}`,
          `Km: ${task.kilometers}`
        ];

        taskLines.forEach(line => {
          if (taskY + 4 > currentY + boxHeight) {
            boxHeight += 10; // Aumentar la altura de la caja
          }
          taskY += 4;
        });

        taskY += 2; // Añadir un pequeño margen antes de la línea
        doc.setDrawColor(150); // Color gris para la línea
        doc.line(currentX + 2, taskY, currentX + boxWidth - 2, taskY); // Dibujar la línea continua
        taskY += 4; // Añadir espacio después de la línea
      });

      doc.rect(currentX, currentY, boxWidth, boxHeight);
      taskY = currentY + 12;
      tasks.forEach(task => {
        doc.setFont('helvetica', 'bold');
        doc.text(`Tarea: ${task.task}`, currentX + 2, taskY);
        taskY += 4;
        doc.setFont('helvetica', 'normal');
        const taskLines = [
          `Salida: ${task.horaSalida}`,
          `Llegada: ${task.horaLlegada}`,
          `Horas: ${task.hours}`,
          `Km: ${task.kilometers}`
        ];

        taskLines.forEach(line => {
          doc.text(line, currentX + 2, taskY);
          taskY += 4;
        });

        taskY += 2; // Añadir un pequeño margen antes de la línea
        doc.setDrawColor(150); // Color gris para la línea
        doc.line(currentX + 2, taskY, currentX + boxWidth - 2, taskY); // Dibujar la línea continua
        taskY += 4; // Añadir espacio después de la línea
      });

      return boxHeight;
    };

    let currentPage = 1;
    drawHeader(doc, currentPage);

    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const firstDay = new Date(this.year, this.month, 1).getDay();

    // Dibujar los días del calendario
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${this.year}-${this.month + 1}-${day}`;
      const tasks = entries[key] || [];
      const boxHeight = drawDayBox(doc, day, tasks, currentX, currentY);
      maxHeightInRow = Math.max(maxHeightInRow, boxHeight);

      currentX += boxWidth;
      if (currentX + boxWidth > pageWidth - margin) {
        currentX = startX;
        currentY += maxHeightInRow;
        maxHeightInRow = baseBoxHeight;
      }

      if (currentY + maxHeightInRow > pageHeight - margin) {
        doc.addPage();
        currentPage += 1;
        drawHeader(doc, currentPage);
        currentY = margin + 20;
        currentX = startX;
        maxHeightInRow = baseBoxHeight;
      }
    }

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
