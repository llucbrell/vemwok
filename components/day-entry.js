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
    this.saveEntry();
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
        Kms:<input
          type="number"
          name="kilometers"
          placeholder="Kilometers"
          .value="${this.entry.kilometers || 0}"
          @input="${this.handleInputChange}"
        />
        Hrs:<input
          type="number"
          name="hours"
          placeholder="Hours"
          .value="${this.entry.hours || 0}"
          @input="${this.handleInputChange}"
        />
        <button class="delete-button" @click="${this.deleteEntry}">Delete</button>
      </div>
    `;
  }
}

customElements.define('day-entry', DayEntry);
