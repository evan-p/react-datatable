import React, { Component } from 'react';
import Datatable from './datatable'
import randomEntry from './randomEntry';

const impressionRender = (o, row) => {
    if(o<3000 && row.stat_type=='Impressions') {
        return <span style={{color: 'red'}}>{o}</span>
    }
    if(o>7000 && row.stat_type=='Impressions') {
        return <span style={{color: '#27d200'}}>{o}</span>
    }
    return o;
}

const columns = [
    {groupA:'Stat', name: 'offer', header: 'Offer',mergeable: true},
    {groupA:'Stat', name: 'campaign', header: 'Campaign',mergeable: true},
    {groupA:'Stat', name: 'stat_type', header: ''},
    {name: '00', header: '00', groupA:'Hour', render: impressionRender},
    {name: '04', header: '04', groupA:'Hour', render: impressionRender},
    {name: '08', header: '08', groupA:'Hour', render: impressionRender},
    {name: '12', header: '12', groupA:'Hour', render: impressionRender},
    {name: '16', header: '16', groupA:'Hour', render: impressionRender},
    {name: '20', header: '20', groupA:'Hour', render: impressionRender},
    {name: '24', header: '24', groupA:'Hour', render: impressionRender}
]

const _data = [
    {offer: 'Titans', campaign: 'Offerwall', stat_type:'Clicks'},
    {offer: 'Titans', campaign: 'Offerwall', stat_type:'Impressions'},
    {offer: 'Titans', campaign: 'Banner', stat_type:'Clicks'},
    {offer: 'Titans', campaign: 'Banner', stat_type:'Impressions'},
    {offer: 'Poker', campaign: 'Offerwall', stat_type:'Clicks'},
    {offer: 'Poker', campaign: 'Offerwall', stat_type:'Impressions'},
    {offer: 'Poker', campaign: 'Banner', stat_type:'Clicks'},
    {offer: 'Poker', campaign: 'Banner', stat_type:'Impressions'},
    {offer: 'Maze', campaign: 'Offerwall', stat_type:'Clicks'},
    {offer: 'Maze', campaign: 'Offerwall', stat_type:'Impressions'},
    {offer: 'Maze', campaign: 'Banner', stat_type:'Clicks'},
    {offer: 'Maze', campaign: 'Banner', stat_type:'Impressions'},
]

const getData = ({page, pageSize, sort_by}) => {
    const data = [];
    _data.forEach( (o) => {
        data.push({
            ...randomEntry(columns),
            ...o
        })
    })
    return {
        data,
        total: 120
    }
}

class Example1 extends Component {
  render() {
    return (
        <Datatable pageSize={3} no_page_sizing getData={getData} columns={columns}/>
    );
  }
}

export default Example1;