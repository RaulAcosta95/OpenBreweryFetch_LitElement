import { LitElement, html } from 'https://unpkg.com/lit-element?module';
import { BreweryDetail } from './BreweryDetail.js';

class BreweryApp extends LitElement {
    static get properties(){
        return {
            url : {type: String},
            breweries: {type: Array},
            brewerieFilter: {type: Array},
            totalBreweries: {type: Number},
            noVisitados: {type: Number},
            visitados: {type: Number},
            filter: {type: Boolean}
        }
    }
    constructor(){
        super();
        this.url = 'https://api.openbrewerydb.org/breweries';
        this.breweries = "";
        this.brewerieFilter = "";
        this.totalBreweries = 0;
        this.noVisitados = 0;
        this.visitados = 0;
        this.filter = null;
        this.addEventListener("ActualizaConteo", (data) =>{
            this._actualizaConteo(data.detail.data[0]);
            this._asignaStatus(data.detail.data[0],data.detail.data[1]);
        });
        this.addEventListener("toggle-visited-status", (data) =>{
            this.toggleVisitedStatus(data.detail.data);
        });
    }

    connectedCallback(){
        super.connectedCallback();
        if (!this.breweries) {
            this._fetchBreweries();
        }
    }
    render() {
        if (this.breweries) {
            return html `
                <link rel="stylesheet" href="./css/BreweryApp.css">
                <div class="brewery-app">
                    <h1>My brewery app </h1>
                    <div class="ContadorVisitados">
                        <p>Total: ${this.totalBreweries} </p>
                        <p>Visitados: ${this.visitados}</p>
                        <p>No Visitados: ${this.noVisitados}</p>
                    </div>
                    <div class="filtro">
                        <button @click=${this._filterVisitados}>Visitados</button>
                        <button @click=${this._filterNoVisitados}>No Visitados</button>
                        <button @click=${this._filterNull}>Todos</button>
                    </div>
                    <ul id="listaDetail">
                        ${
                            this.brewerieFilter.map(
                                brewery => {
                                return html`
                                    <li >
                                        <brewery-detail
                                        .name=${brewery.name}
                                        .type=${brewery.brewery_type}
                                        .city=${brewery.city}
                                        id=${brewery.id}
                                        ></brewery-detail>
                                    </li>
                            `;
                        }
                            ,
                        )}
                    </ul>
                </div>
                `
        } else {
            return html`
                <link rel="stylesheet" href="./css/BreweryApp.css">
                <div class="brewery-app">
                    <h1>My brewery app </h1>
                    <p>Loading...</p>
                </div>
                `;
        }
    }

    async _fetchBreweries(){
        const response = await fetch(this.url);
        const jsonResponse = await response.json();
        this.breweries = jsonResponse;

        //Asignar no visitados a todos los breweries
        this.breweries.forEach(element => {
            element.visited = false;
        });
        this.brewerieFilter = this.breweries;
        this.totalBreweries = this.breweries.length;
        this.noVisitados = this.breweries.length;
        console.log(this.breweries);
    }

    _CreaBreweryDetail(){
        this.totalBreweries++;
        this.noVisitados++; //Porque siempre vienen como no visitados
    }

    _actualizaConteo(visitado){
        if (visitado) {
            this.noVisitados--;
            this.visitados++;
        } else {
            this.noVisitados++;
            this.visitados--;
        }
    }

    _asignaStatus(visitado, idBrewery) {
        for (let i = 0; i < this.breweries.length; i++) {
            if (this.breweries[i].id == idBrewery) {
                this.breweries[i].visited = visitado;
                break;
            }
        }
    }

    //Filtros

    _filterNull(){
        this.filter = false;
        this.brewerieFilter = this.breweries;
    }

    _filterNoVisitados(){
        this.filter = 'filtraNoVisitados';
        this.brewerieFilter = this.breweries.filter(elemento => elemento.visited == false);
        console.log(this.brewerieFilter);
    }

    _filterVisitados(){
        this.filter = 'filtraVisitados';
        this.brewerieFilter = this.breweries.filter(elemento => elemento.visited == true);
        console.log(this.brewerieFilter);
    }

    toggleVisitedStatus(breweryToUpdate) {
        for (let i = 0; i < this.breweries.length; i++) {
            if (this.breweries[i].id == breweryToUpdate) {
                this.breweries[i].visited = !this.breweries[i].visited;
                console.log(this.breweries[i].visited);
                break;
            }
        }
      }
}

customElements.define('brewery-app', BreweryApp);