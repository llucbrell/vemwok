import { LitElement, html, css } from 'https://unpkg.com/lit@2.0.0?module';
import './components/calendar-view.js';
import './components/day-entry.js';
import './components/export-excel.js';

class WorkTrackerApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      font-family: Arial, sans-serif;
    }
  `;

  static properties = {
    year: { type: Number },
    month: { type: Number }
  };

  constructor() {
    super();
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();
  }

  handleMonthChange(event) {
    this.year = event.detail.year;
    this.month = event.detail.month;
  }

  render() {
    return html`
      <h1>Work Tracker</h1>
      <calendar-view .year="${this.year}" .month="${this.month}" @month-changed="${this.handleMonthChange}"></calendar-view>
      <export-excel .year="${this.year}" .month="${this.month}"></export-excel>
    `;
  }
}

customElements.define('work-tracker-app', WorkTrackerApp);
