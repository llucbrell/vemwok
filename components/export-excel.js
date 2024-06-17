import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';

class ExportExcel extends LitElement {
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

  exportToExcel() {
    const entries = JSON.parse(localStorage.getItem('workEntries')) || {};
    const data = [];
    let totalKilometers = 0;
    let totalMinutes = 0;

    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };

    for (const [key, tasks] of Object.entries(entries)) {
      const [entryYear, entryMonth] = key.split('-').map(Number);
      if (entryYear === this.year && entryMonth === this.month + 1) {
        for (const task of tasks) {
          data.push({
            Día: formatDate(key),
            Tarea: task.task,
            Kilómetros: task.kilometers,
            'Hora de salida': task.horaSalida,
            'Hora de llegada': task.horaLlegada,
            Horas: task.hours
          });
          totalKilometers += Number(task.kilometers);

          // Convertir horas a minutos y sumar
          if (task.hours && task.hours.includes(':')) {
            const [hours, minutes] = task.hours.split(':').map(Number);
            if (!isNaN(hours) && !isNaN(minutes)) {
              totalMinutes += (hours * 60) + minutes;
            }
          }
        }
      }
    }

    // Convertir total de minutos a formato HH:mm
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const totalHoursFormatted = `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}`;

    data.push({
      Día: 'Total',
      Tarea: '',
      Kilómetros: totalKilometers,
      'Hora de salida': '',
      'Hora de llegada': '',
      Horas: totalHoursFormatted
    });

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Work Data');

    // Añadir nombre del usuario en la parte superior
    window.XLSX.utils.sheet_add_aoa(worksheet, [[`Trabajador: ${this.userName}`]], { origin: 'A1' });

    // Ajustar el tamaño de las celdas
    const wscols = [
      { wch: 15 }, // Día
      { wch: 20 }, // Tarea
      { wch: 12 }, // Kilómetros
      { wch: 15 }, // Hora de salida
      { wch: 15 }, // Hora de llegada
      { wch: 10 }  // Horas
    ];
    worksheet['!cols'] = wscols;

    window.XLSX.writeFile(workbook, `WorkData_${this.year}_${this.month + 1}.xlsx`);
  }

  render() {
    return html`
      <button @click="${this.exportToExcel}">Export to Excel</button>
    `;
  }
}

customElements.define('export-excel', ExportExcel);
