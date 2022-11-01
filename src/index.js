import {LitElement, html, css} from 'lit';

/**
* A reactive table.
*/
export class ReactiveTable extends LitElement {
    static get styles() {
        return css`
        :host {
            --lightgrey: #f8f8f8;
            --grey: #ddd;
            --gridtemplate: repeat(1, 1fr);
        }          

        table {
            border-collapse: collapse;
            width: 100%;
        }

        thead {
            text-align: left;
        }

        tfoot {
            text-align: right;
        }

        tfoot tr {
            display: grid;
            grid-template-columns: 1fr
        }

        tbody {
            border-top: 1px solid var(--grey);
            border-bottom: 1px solid var(--grey);
        }

        td, th {
            padding: 0.5rem;
            overflow: scroll;
        }

        td.nodata {
            grid-template-columns: 1fr;
            color: var(--grey);
            font-style: italic;
        }

        td.hidden {
            display: none;
        }

        td.expander {
            background:
                url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAQklEQVQoz9XQsQ2AMBQD0RdgSCYkm7AHe0R8WjeIggbcnXWSJZMZStmymjzkC0IzgmZQzhTq5cSiB60aDvud/tcnL/z9Df9LvZhoAAAAAElFTkSuQmCC)
                no-repeat
                center 1rem;
            background-size: 0.5rem;
            cursor: pointer;
        }
        
        td.expander.expanded {
            background:
                url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAHklEQVQoz2NgGA6AkeEPIQX/8StgImQFC8NyhhEAAAh4AqsZsKhxAAAAAElFTkSuQmCC)
                no-repeat
                center 1rem;
            background-size: 0.5rem;
        }

        tr:nth-child(even) {
            background-color: var(--lightgrey);
        }

        tr {
            display: grid;
            grid-template-columns: var(--gridtemplate);
        }
        `;
    }
    
    static get properties() {
        return {
            /**
            * The data to show.
            * @type {string}
            */
            data: {type: String},
            
            /**
            * The schema of the data.
            * @type {string}
            */
            schema: {type: String},
            
        };
    }
    
    constructor() {
        super();
        this.data = "[]";
        this.schema = "[]";
        this._data = [];
        this._schema = [];
        this.hasHiddenRows = false
    }
    
    willUpdate(changed) {
        if (changed.has('data') && this.data) {
            this._data = JSON.parse(this.data);
        }
        if (changed.has('schema') && this.schema) {
            this._schema = JSON.parse(this.schema);
        }
    }
    
    render() {
        this.hasHiddenRows = this._data.some((row) => Array.isArray(row))
        if (this.hasHiddenRows) {
            this.style.setProperty('--gridtemplate', `1rem repeat(${this._schema.length}, 1fr)`)
        } else {
            this.style.setProperty('--gridtemplate', `repeat(${this._schema.length}, 1fr)`)
        }

        return html`
        <table>
            <thead>
                <tr>
                    ${this._getHeaders()}
                </tr>
            </thead>
            <tbody>
                ${this._getRows()}
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <small>${this._data.length} records</small>
                    </td>
                </tr>
            </tfoot>
        </table>
        `;
    }

    _getHeaders() {
        let headers = html`
            ${this.hasHiddenRows ? html`<th></th>` : null}
            ${this._schema.map((h) => html`<th>${h.name}</th>`)}
        `
        return headers
    }

    _getRows() {
        if (this._data.length === 0) {
            return html`
                <tr>
                    <td class="nodata">
                        There is no data to show
                    </td>
                </tr>
            `
        }

        return html`
            ${this._data.map((row) => {
                if (Array.isArray(row)) {
                    // when a row is an array, it means that there are hidden subrows
                    // whose visibility can be toggled by clicking on the expander symbol "+"
                    return html`<tr>
                        ${
                            row.map((subrow, index) => {
                                // when a row has hidden subrows, we add a first column with an expander
                                // symbol; this symbol is only added to the first subrow; the expander
                                // symbol is given by the css class "expander"
                                return html`
                                    <td 
                                        class="${index !== 0 ? 'subrow hidden' : 'expander'}"
                                        @click="${this._handleToggleExpandClick}"
                                    >
                                    </td>
                                    ${this._schema.map((h) =>
                                        html`<td class="${index !== 0 ? 'subrow hidden' : ''}">${subrow[h.key] ?? h.default}</td>`
                                    )}
                                `
                                }
                            )
                        }
                    </tr>`
                } else {
                    // when the row is not an array, it means that we are just dealing
                    // with a standard table row
                    return html`<tr>
                        ${
                            // we add an initial empty column when *some other row* has hidden subrows
                            this.hasHiddenRows ? html`<td></td>` : null
                        }
                        ${
                            this._schema.map((h) =>
                                html`<td>${row[h.key] ?? h.default}</td>`
                            )
                        }
                    </tr>`
                }
            })}
        `
    }

    /**
     * When an expander symbol is clicked, we toggle it from "+" to "-"
     * and then we toggle the "hidden" class to all of its siblings DOM nodes
     */
    _handleToggleExpandClick(e) {
        const expander = e.target
        const row = expander.parentNode
        const subrows = row.querySelectorAll('.subrow')
        subrows.forEach((cell) => {
            cell.classList.toggle('hidden')
        })
        expander.classList.toggle('expanded')
    }
}

window.customElements.define('reactive-table', ReactiveTable);