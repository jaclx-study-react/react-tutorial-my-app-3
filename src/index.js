import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
 
// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();


class MyAwesomeReactComponent extends React.Component {
    render() {
        return (<RaisedButton label="Default" />);
    }  
}

class ProductCategoryRow extends React.Component {
    render() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
    }
}

class ProductRow extends React.Component {
    render() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>{this.props.product.name}</span>;

        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach((product) => {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        });

        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleBoxChange = this.handleBoxChange.bind(this);
    }

    handleTextChange(event) {
        this.props.onChange({filterText: event.target.value});
    }

    handleBoxChange(event) {
        this.props.onChange({inStockOnly: event.target.checked});
    }

    render() {
        return (
            <form>
                <TextField id="search-text" hintText="Search..." value={this.props.filterText} onChange={this.handleTextChange} />
                <Checkbox label="Only show products in stock" checked={this.props.inStockOnly} onCheck={this.handleBoxChange}/>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            filterText: '',
            inStockOnly: false
        };
    }

    handleChange(values) {
        this.setState(values);
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <SearchBar
                        filterText={this.state.filterText}
                        inStockOnly={this.state.inStockOnly}
                        onChange={this.handleChange}
                    />
                    <ProductTable
                        products={this.props.products}
                        filterText={this.state.filterText}
                        inStockOnly={this.state.inStockOnly}
                    />
                    <MyAwesomeReactComponent />
                </div>
            </MuiThemeProvider>
        );
    }
}


var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('root')
);
