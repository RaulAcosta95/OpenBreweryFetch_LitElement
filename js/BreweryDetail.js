// nombre, el tipo y la ciudad

import { LitElement, html } from 'https://unpkg.com/lit-element?module';
export class BreweryDetail extends LitElement {
    static get properties() {
        return {
          name: { type: String },
          type: { type: String },
          city: { type: String },
          id:   { type: String},
          visitado: { type: Boolean}
        };
      }
      constructor(){
          super();
          this.visitado = false;

      }
    render (){
        return html`
                    <link rel="stylesheet" href="./css/BreweryDetail.css">
        <div class="brewery-detail">
            <h3>${this.name}</h3>
            <p>brewery type: ${this.type}</p>
            <p>city: ${this.city}</p>
            <p>${ this.visitado? html `Visitado`: html `No Visitado`}</p>
            <input id="checkbox" @click="${this._toggleVisitado}" type="checkbox">
            <button @click="${this._toggleVisitedStatus}">Mark as ${this.visited ? 'not-visited' : 'visited'}</button>
        </div>
      `;
    }
    _toggleVisitado(){
        this.visitado = this.shadowRoot.getElementById('checkbox').checked;
        let data = [this.visitado, this.id]
        this.dispatchEvent( new CustomEvent("ActualizaConteo", {
            detail: {data: data},
            bubbles:true,
            composed:true
        }));
    }

    _toggleVisitedStatus() {
        this.visitado = ! this.visitado;
        this.dispatchEvent( new CustomEvent("toggle-visited-status", {
            detail: {data: this.id},
            bubbles:true,
            composed:true
        }));
      }
}
customElements.define('brewery-detail', BreweryDetail);