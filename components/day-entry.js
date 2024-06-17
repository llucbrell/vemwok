import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';
import { parseISO, format, differenceInMinutes } from 'https://unpkg.com/date-fns@2.22.1/esm/index.js';

class DayEntry extends LitElement {
  static properties = {
    entry: { type: Object },
    date: { type: String },
    index: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 10px;
    }
    .entry {
      display: flex;
      flex-direction: column;
    }
    .entry input {
      margin-bottom: 5px;
    }
    .delete-button {
      background-color: red;
      color: white;
      border: none;
      padding: 5px;
      cursor: pointer;
    }

    /* Estilos responsivos */
    @media (max-width: 600px) {
      .entry {
        font-size: 0.8em;
      }
      .entry input {
        margin-bottom: 3px;
        padding: 3px;
      }
      .delete-button {
        padding: 3px;
        font-size: 0.8em;
      }
    }
  `;

  constructor() {
    super();
    this.entry = {};
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.entry[name] = value;
    if (name === 'horaSalida' || name === 'horaLlegada') {
      this.calculateHours();
    }
    this.saveEntry();
  }

  calculateHours() {
    if (this.entry.horaSalida && this.entry.horaLlegada) {
      const formatStr = 'HH:mm';
      const salida = parseISO(`1970-01-01T${this.entry.horaSalida}:00`);
      const llegada = parseISO(`1970-01-01T${this.entry.horaLlegada}:00`);
      let diff = differenceInMinutes(llegada, salida);
      if (diff < 0) diff += 1440; // Handle overnight shifts

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      this.entry.hours = `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  handleHoursChange(e) {
    const { name, value } = e.target;
    if (!this.entry.horaSalida && !this.entry.horaLlegada) {
      this.entry[name] = value;
      this.saveEntry();
    }
  }

  saveEntry() {
    const entries = JSON.parse(localStorage.getItem('workEntries')) || {};
    if (!entries[this.date]) {
      entries[this.date] = [];
    }
    entries[this.date][this.index] = this.entry;
    localStorage.setItem('workEntries', JSON.stringify(entries));
    this.dispatchEvent(new CustomEvent('entries-updated', { bubbles: true, composed: true }));
  }

  deleteEntry() {
    const entries = JSON.parse(localStorage.getItem('workEntries')) || {};
    if (entries[this.date]) {
      entries[this.date].splice(this.index, 1);
      if (entries[this.date].length === 0) {
        delete entries[this.date];
      }
      localStorage.setItem('workEntries', JSON.stringify(entries));
      this.dispatchEvent(new CustomEvent('entries-updated', { bubbles: true, composed: true }));
      this.dispatchEvent(new CustomEvent('entry-deleted', { bubbles: true, composed: true }));
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <div class="entry">
      Tarea:
        <input
          type="text"
          name="task"
          placeholder="Task"
          .value="${this.entry.task || ''}"
          @input="${this.handleInputChange}"
        /> 
        Salida:<input
          type="time"
          name="horaSalida"
          placeholder="Hora de salida"
          .value="${this.entry.horaSalida || ''}"
          @input="${this.handleInputChange}"
        />
        Llegada:<input
          type="time"
          name="horaLlegada"
          placeholder="Hora de llegada"
          .value="${this.entry.horaLlegada || ''}"
          @input="${this.handleInputChange}"
        />
        Hrs:<input
          type="text"
          name="hours"
          placeholder="Horas"
          .value="${this.entry.hours || '0:00'}"
          readonly
        />
        Kms:<input
          type="number"
          name="kilometers"
          placeholder="Kilometers"
          .value="${this.entry.kilometers || 0}"
          @input="${this.handleInputChange}"
        />
        <button class="delete-button" @click="${this.deleteEntry}">Borrar</button>
      </div>
    `;
  }
}

customElements.define('day-entry', DayEntry);
