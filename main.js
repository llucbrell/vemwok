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
    .header img {
      height: 50px; /* Ajustar el tamaño de la imagen */
      width: auto;
      float: right;
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
      <div class="header">
        <img src="./favicon.ico" alt="Logo de VemWok">
        <h1>VemWok</h1>
      </div>
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

// Registrar el service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
