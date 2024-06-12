import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';

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
      const [salidaHoras, salidaMinutos] = this.entry.horaSalida.split(':').map(Number);
      const [llegadaHoras, llegadaMinutos] = this.entry.horaLlegada.split(':').map(Number);
      const salida = new Date(0, 0, 0, salidaHoras, salidaMinutos);
      const llegada = new Date(0, 0, 0, llegadaHoras, llegadaMinutos);
      let diff = (llegada - salida) / 1000 / 60 / 60;
      if (diff < 0) diff += 24;
      this.entry.hours = diff.toFixed(2);
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
        <input
          type="text"
          name="task"
          placeholder="Task"
          .value="${this.entry.task || ''}"
          @input="${this.handleInputChange}"
        />
        <input
          type="number"
          name="kilometers"
          placeholder="Kilometers"
          .value="${this.entry.kilometers || 0}"
          @input="${this.handleInputChange}"
        />
        <input
          type="time"
          name="horaSalida"
          placeholder="Hora de salida"
          .value="${this.entry.horaSalida || ''}"
          @input="${this.handleInputChange}"
        />
        <input
          type="time"
          name="horaLlegada"
          placeholder="Hora de llegada"
          .value="${this.entry.horaLlegada || ''}"
          @input="${this.handleInputChange}"
        />
        <input
          type="number"
          name="hours"
          placeholder="Hours"
          .value="${this.entry.hours || 0}"
          @input="${this.handleHoursChange}"
        />
        <button class="delete-button" @click="${this.deleteEntry}">Delete</button>
      </div>
    `;
  }
}

customElements.define('day-entry', DayEntry);
