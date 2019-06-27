import { Component } from 'react';

class BaseComponent extends Component {
    currentPath = '';
    constructor(props) {
        super(props);
        
        //Interval check Valid
        this.checkInterval = setInterval( _ => {
            this.onChangePath();
        }, 3000);
    }

    /*
    |--------------------------------------------------------------------------
    | Handle on change path
    |--------------------------------------------------------------------------
    */
    onChangePath = () => {
        try {
            const path = this.props.location.pathname;
            this.currentPath = path;
            this.handleSession(path);
        } catch (error) { }
    }

    /*
    |--------------------------------------------------------------------------
    | Check Session Is Valid
    |--------------------------------------------------------------------------
    */
    handleSession = (path) => {

    }

    /*
    |--------------------------------------------------------------------------
    | Executed before rendering, on both the server and the client side
    |--------------------------------------------------------------------------
    */
    componentWillMount() {
        // console.log("=========================> componentWillMount");
    }

    /*
    |--------------------------------------------------------------------------
    | Executed after the first render only on the client side. This is where AJAX requests and DOM or state updates should occur
    |--------------------------------------------------------------------------
    */
    componentDidMount() {
        // console.log("=========================> componentDidMount");
    }

    /*
    |--------------------------------------------------------------------------
    | Invoked as soon as the props are updated before another render is called. We triggered it from setNewNumber when we updated the state
    |--------------------------------------------------------------------------
    */
    componentWillReceiveProps(newProps) {
        // console.log("=========================> componentWillReceiveProps", newProps);
    }

    /*
    |--------------------------------------------------------------------------
    | Should return true or false value. This will determine if the component will be updated or not
    |--------------------------------------------------------------------------
    */
    shouldComponentUpdate(newProps, newState) {
        // console.log("=========================> shouldComponentUpdate", newProps, newState);
        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | Called just before re-rendering
    |--------------------------------------------------------------------------
    */
    componentWillUpdate(nextProps, nextState) {
        // console.log("=========================> componentWillUpdate", nextProps, nextState);
    }

    /*
    |--------------------------------------------------------------------------
    | Called just after re-rendering
    |--------------------------------------------------------------------------
    */
    componentDidUpdate(prevProps, prevState) {
        // console.log("=========================> componentDidUpdate", prevProps, prevState);
    }

    /*
    |--------------------------------------------------------------------------
    | Called after the component is unmounted from the dom
    |--------------------------------------------------------------------------
    */
    componentWillUnmount() {
        // console.log("=========================> componentWillUnmount");
    }
}

export default BaseComponent;