import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';

class ExportExcel extends LitElement {
  static properties = {
    year: { type: Number },
    month: { type: Number }
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
    let totalHours = 0;

    for (const [key, tasks] of Object.entries(entries)) {
      const [entryYear, entryMonth] = key.split('-').map(Number);
      if (entryYear === this.year && entryMonth === this.month + 1) {
        for (const task of tasks) {
          data.push({
            Day: key,
            Task: task.task,
            Kilometers: task.kilometers,
            Hours: task.hours
          });
          totalKilometers += Number(task.kilometers);
          totalHours += Number(task.hours);
        }
      }
    }

    data.push({
      Day: 'Total',
      Task: '',
      Kilometers: totalKilometers,
      Hours: totalHours
    });

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Work Data');

    window.XLSX.writeFile(workbook, `WorkData_${this.year}_${this.month + 1}.xlsx`);
  }

  render() {
    return html`
      <button @click="${this.exportToExcel}">Export to Excel</button>
    `;
  }
}

customElements.define('export-excel', ExportExcel);
