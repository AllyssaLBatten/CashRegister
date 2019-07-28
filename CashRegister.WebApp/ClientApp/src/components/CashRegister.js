import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import './CashRegister.css';

export class CashRegister extends Component {
    displayName = CashRegister.name

    // Initialization

    constructor(props) {
        super(props);
        this.state = { layouts: [], denominations: [], transactions: [], loading: true };

        // Get values for layout dropdown
        fetch('api/CashRegister/LayoutOptions')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    layouts: data,
                    denominations: this.state.denominations,
                    transactions: this.state.transactions,
                    loading: true
                });
            });

        // Get denominations for default layout
        fetch('api/CashRegister/Denominations')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    layouts: this.state.layouts,
                    denominations: data,
                    transactions: this.state.transactions,
                    loading: true
                })
            });

        // Bind methods
        this.setLayout = this.setLayout.bind(this);
        this.openLoadDialog = this.openLoadDialog.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
        this.saveTransactions = this.saveTransactions.bind(this);
        this.clearTransactions = this.clearTransactions.bind(this);
    }

    // Layout dropdown logic

    setLayout() {
        // Clear transactions if layout is changing
        this.clearTransactions();

        // Update underlying Register's layout
        var layout = document.getElementById('layoutSelect').value;
        fetch('api/CashRegister/SetLayout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: layout })
        })
            .then(() => // Update denominations after layout is updated
                fetch('api/CashRegister/Denominations')
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            layouts: this.state.layouts,
                            denominations: data,
                            transactions: this.state.transactions,
                            loading: true
                        })
                    })
            );
    }

    // Load button logic

    openLoadDialog() {
        document.getElementById('inputFile').click();
    }

    loadTransactions() {
        var file = document.getElementById("inputFile").files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");

            reader.onload = function (evt) {

                // Load the transactions to Register
                fetch('api/CashRegister/Load', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value: evt.target.result })
                })
                    .then(() => // After calculated, get the transaction data
                        fetch('api/CashRegister/Transactions')
                        .then(response => response.json())
                        .then(data => {
                            this.setState({
                                layouts: this.state.layouts,
                                denominations: this.state.denominations,
                                transactions: data,
                                loading: false
                            });
                        }));

                // Clear inputFile value to allow for loading file multiple times
                document.getElementById("inputFile").value = null;
            }.bind(this);
        }
    }

    // Save button logic

    saveTransactions() {
        fetch('api/CashRegister/Save')
            .then(response => response.json())
            .then(data => {
                // Create link for downloading output, and immediately delete link
                const element = document.createElement("a");
                var text = data.value.replace(/\n/g, "\r\n");
                const file = new Blob([text], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = "transactions.txt";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            });
    }

    // Clear button logic

    clearTransactions() {
        fetch('api/CashRegister/Clear');

        this.setState({
            layouts: this.state.layouts,
            denominations: this.state.denominations,
            transactions: [],
            loading: true
        });
    }

    // Dynamic render logic

    static renderLayoutOptions(layouts) {
        return (
            <select id="layoutSelect" onChange={this.setLayout}>
                {layouts.map(layout =>
                    <option key={layout.value} value={layout.value}>{layout.value}</option>
            )}
            </select>
        );
    }

    static renderTransactionTable(denominations, transactions) {
        return (
            <Table variant='dark' className='table'>
                <thead>
                    <tr>
                        <th> Amount Owed </th>
                        <th> Amount Received </th>
                        {denominations.map(denom =>
                            <th key={denom.value}> {denom.value} </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction =>
                        <tr key={transaction.id} >
                            <td>$ {transaction.owed.toFixed(2)}</td>
                            <td>$ {transaction.received.toFixed(2)}</td>
                            {transaction.change.map((c, index) =>
                                <td key={transaction.id + "_" + index}>{c}</td>
                            )}
                        </tr>    
                    )}
                </tbody>
            </Table>
        );
    }

    render() {
        let layoutOptions = CashRegister.renderLayoutOptions(this.state.layouts);

        let contents = this.state.loading
            ? <p><em>Waiting for transactions to load...</em></p>
            : CashRegister.renderTransactionTable(this.state.denominations, this.state.transactions);

        return (
            <div>
                <div className="header">
                    <h1>
                        Cash Register    {layoutOptions}
                    </h1>
                </div>
                <div className="userOptions">
                    <input type="file" id="inputFile" accept=".txt" style={{ display: 'none' }} onChange={this.loadTransactions}></input>
                    <Button variant="primary" id="loadButton" onClick={this.openLoadDialog}>Load</Button>
                    <Button variant="primary" id="saveButton" onClick={this.saveTransactions}>Save</Button>
                    <Button variant="primary" id="clearButton" onClick={this.clearTransactions}>Clear</Button>
                </div>
                <div className="content">
                    {contents}
                </div>
            </div>
        );
    }
}