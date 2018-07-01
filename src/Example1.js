import React, { Component } from 'react';
import Datatable from './datatable'
import randomEntry from './randomEntry';

const greenRender = o => {
    return <span style={{color: '#27d200'}}>{o}</span>
}

const columns = [
    {name: 'index', header: '#', orderable: true},
    {name: 'name', header: 'Name', groupA:'Offer', mergeable: true},
    {name: 'campaign', header: 'Campaign', groupA: 'Offer'},
    {name: 'conversions', header: 'Convertions', groupA: 'Stats', width: 100},
    {name: 'clicks', header: 'Clicks', groupA: 'Stats', render: greenRender},
    {name: 'impressions', header: 'Impressions', groupA: 'Stats'},
]

const _data = [
    {name: 'Titans', campaign: 'Offerwall'},
    {name: 'Titans', campaign: 'Banner'},
    {name: 'Titans', campaign: 'Popup'},
    {name: 'Poker', campaign: 'Video'},
    {name: 'Poker', campaign: 'Banner'},
    {name: 'Puzzle', campaign: 'Popup'},
]

const getData = ({page, pageSize, sort_by}) => {
    const data = [];
    for(let i=(page-1)*pageSize +1 ; i<=page*pageSize && i<=200 ; i++){
        const index = sort_by && sort_by.order == -1 ? 200 - i + 1 : i;
        data.push({
            ...randomEntry(columns),
            ..._data[i%_data.length],
            index
        });
    }
    return {
        data,
        total: 200
    }
}

class Example1 extends Component {
  render() {
    return (
        <Datatable getData={getData} columns={columns}/>
    );
  }
}

export default Example1;