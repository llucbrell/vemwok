import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';
import './components/calendar-view.js';
import './components/day-entry.js';
import './components/export-excel.js';
import './components/export-pdf.js';

class WorkTrackerApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      font-family: Arial, sans-serif;
    }
    .user-input {
      margin-bottom: 16px;
    }
    .export-buttons {
      display: flex;
      gap: 10px; /* Espacio entre los botones */
      margin-bottom: 16px; /* Espacio debajo de los botones */
    }
    .export-buttons button {
      flex: 1; /* Hacer que los botones ocupen el mismo espacio */
      padding: 10px;
      font-size: 16px;
    }
  `;

  static properties = {
    year: { type: Number },
    month: { type: Number },
    userName: { type: String }
  };

  constructor() {
    super();
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();
    this.userName = localStorage.getItem('userName') || 'Trabajador';
  }

  handleMonthChange(event) {
    this.year = event.detail.year;
    this.month = event.detail.month;
  }

  handleUserNameChange(event) {
    this.userName = event.target.value;
    localStorage.setItem('userName', this.userName);
  }

  render() {
    return html`
      <h1>Work Tracker</h1>
      <div class="user-input">
        <label for="userName">Trabajador: </label>
        <input type="text" id="userName" .value="${this.userName}" @input="${this.handleUserNameChange}" />
      </div>
      <div class="export-buttons">
        <export-excel .year="${this.year}" .month="${this.month}" .userName="${this.userName}"></export-excel>
        <export-pdf .year="${this.year}" .month="${this.month}" .userName="${this.userName}"></export-pdf>
      </div>
      <calendar-view .year="${this.year}" .month="${this.month}" @month-changed="${this.handleMonthChange}"></calendar-view>
    `;
  }
}

customElements.define('work-tracker-app', WorkTrackerApp);
