import React, { Component } from 'react';
import Example1 from './Example1'
import Example2 from './Example2'

class App extends Component {
  render() {
    return (
      <div >
        <h1>React Datatable examples</h1>
        <h2>Example 1</h2>
        <Example1/>
        <h2>Example 2</h2>
        <Example2/>
      </div>
    );
  }
}

export default App;
