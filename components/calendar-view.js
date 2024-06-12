import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';
import './day-entry.js';

class CalendarView extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
    }
    .day {
      border: 1px solid #ccc;
      padding: 10px;
      position: relative;
      font-size: 0.9em;
    }
    .day-header {
      font-weight: bold;
    }
    .add-button {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
    .nav-button {
      margin: 10px;
      padding: 5px 10px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Estilos responsivos */
    @media (max-width: 900px) {
      .calendar {
        grid-template-columns: repeat(5, 1fr);
        gap: 5px;
      }
      .day {
        padding: 5px;
        font-size: 0.8em;
      }
      .add-button {
        top: 2px;
        right: 2px;
        font-size: 0.8em;
      }
      .nav-button {
        margin: 5px;
        padding: 3px 5px;
        font-size: 0.8em;
      }
      .header h2 {
        font-size: 1em;
      }
    }

    @media (max-width: 600px) {
      .calendar {
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
      }
      .day {
        padding: 5px;
        font-size: 0.7em;
      }
      .add-button {
        top: 2px;
        right: 2px;
        font-size: 0.7em;
      }
      .nav-button {
        margin: 5px;
        padding: 3px 5px;
        font-size: 0.7em;
      }
      .header h2 {
        font-size: 0.9em;
      }
    }

    @media (max-width: 400px) {
      .calendar {
        grid-template-columns: repeat(2, 1fr);
        gap: 3px;
      }
      .day {
        padding: 3px;
        font-size: 0.6em;
      }
      .add-button {
        top: 1px;
        right: 1px;
        font-size: 0.6em;
      }
      .nav-button {
        margin: 3px;
        padding: 2px 4px;
        font-size: 0.6em;
      }
      .header h2 {
        font-size: 0.8em;
      }
    }
  `;

  static properties = {
    year: { type: Number },
    month: { type: Number },
    entries: { type: Object }
  };

  constructor() {
    super();
    this.entries = JSON.parse(localStorage.getItem('workEntries')) || {};
    this.handleEntriesUpdated = this.handleEntriesUpdated.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.saveEntries();
    window.addEventListener('entries-updated', this.handleEntriesUpdated);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('entries-updated', this.handleEntriesUpdated);
  }

  handleEntriesUpdated() {
    this.entries = JSON.parse(localStorage.getItem('workEntries')) || {};
    this.requestUpdate();
  }

  saveEntries() {
    localStorage.setItem('workEntries', JSON.stringify(this.entries));
  }

  addEntry(day) {
    const key = `${this.year}-${this.month + 1}-${day}`;
    if (!this.entries[key]) {
      this.entries[key] = [];
    }
    this.entries[key].push({ task: '', kilometers: 0, hours: 0 });
    this.saveEntries();
    this.requestUpdate();
  }

  changeMonth(offset) {
    this.month += offset;
    if (this.month < 0) {
      this.month = 11;
      this.year -= 1;
    } else if (this.month > 11) {
      this.month = 0;
      this.year += 1;
    }
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('month-changed', {
      detail: { year: this.year, month: this.month },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return html`
      <div class="header">
        <button class="nav-button" @click="${() => this.changeMonth(-1)}">&lt; Prev</button>
        <h2>${new Date(this.year, this.month).toLocaleString('default', { month: 'long' })} ${this.year}</h2>
        <button class="nav-button" @click="${() => this.changeMonth(1)}">Next &gt;</button>
      </div>
      <div class="calendar" style="grid-template-rows: repeat(${Math.ceil((daysInMonth + firstDay) / 7)}, 1fr);">
        ${days.map(
          (day) => html`
            <div class="day">
              <div class="day-header">${day}</div>
              <button class="add-button" @click="${() => this.addEntry(day)}">+</button>
              ${this.entries[`${this.year}-${this.month + 1}-${day}`]
                ? this.entries[`${this.year}-${this.month + 1}-${day}`].map(
                    (entry, index) =>
                      html`<day-entry
                        .entry="${entry}"
                        .date="${`${this.year}-${this.month + 1}-${day}`}"
                        .index="${index}"
                        @entry-deleted="${this.handleEntriesUpdated}"
                      ></day-entry>`
                  )
                : ''}
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('calendar-view', CalendarView);
