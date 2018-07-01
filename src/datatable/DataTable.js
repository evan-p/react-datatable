import React, { Component } from 'react';
import pagination from './pagination';
import './datatable.css'

const page_sizes = [ 10, 20, 30, 50, 100 ];

// props:  getData, columns, fontSize, title, alignment, row_height, no_paging, no_page_sizing, disappear_on_load, disable_mount_init
// column: name, header, mergeable, groupA - groupD, 
class DataTable extends Component {

    constructor(props) {
        super()
        this.state = {
            data: [],
            total: 0,
            page: 1,
            pageSize: props.pageSize || 10,
            sort_by: null,
            loaded: false
        }
        this.renderRow = this.renderRow.bind(this);
        this.toggleShowPageSizes = this.toggleShowPageSizes.bind(this)
        this.batchId = 0;
    }

    async componentDidMount() {
        if(!this.props.disable_mount_init) this.getData()
    }

    shouldComponentUpdate (next_props, next_state) {
        const prop_changed = Object.keys(next_props).find(prop => {
            return next_props[prop] != this.props[prop];
        });
        if (prop_changed) return true;
        const state_changed = [ 'data', 'page', 'pageSize', 'showPageSizes'].find(key => {
            return next_state[key] != this.state[key];
        });
        if (state_changed) return true;
        return false;

    }

    async getData() {
        const {page, pageSize, sort_by} = this.state;
        const batchId = ++this.batchId
        const res = await this.props.getData({ page, pageSize, sort_by })
        if (batchId === this.batchId) {
            this.setState({ data: res.data, total: res.total, loaded: true })
        }
    }

    changePageSize() {
        return (event) => {
            event.preventDefault();
            const pageSize = event.target.value;
            const page = 1
            this.setState({page, pageSize, showPageSizes:false}, () => {
                this.getData()
            })
        }
    }

    toFirstPage() {
        this.gotoPage(1)();
    }

    gotoPage(page) {
        return () => {
            this.setState({ page: page }, () => { this.getData() })
        }
    }

    renderPaginatorIndex(page, indx) {
        const activeClass = page === this.state.page ? 'active' : ''
        const onClick = page == '...' ? null : this.gotoPage(page)
        if (page == '...') {
            page = '...'
        }
        return (
            <li  onClick={onClick} key={indx} className={"datatable_menu-item " + activeClass}>
                {page}
            </li>
        )
    }

    setOrder(name) {
        return () => {
            let  { sort_by } = this.state;
            if(sort_by && sort_by.name == name) {
                if (sort_by.order == 1) {
                    sort_by = { name, order: -1 }
                } else {
                    sort_by = null;
                }
            } else {
                sort_by = { name, order: 1 }
            }
            this.setState({sort_by}, () => {
                this.getData()
            });
        }
    }

    renderHeaders() {
        return this.props.columns.map( (col, i) => {
            const width = col.width || 80;
            const { sort_by } = this.state;
            let order_char;
            if(sort_by && sort_by.name == col.name) {
                order_char = sort_by.order === 1 ? '▼' : '▲';
            }
            
            return (
                <th onClick={col.orderable ? this.setOrder(col.name) : null} key={i} style={{ fontSize:this.props.fontSize}}>
                    <span style={{ width }}>
                        {col.header} {order_char}
                    </span>
                </th>
            )
            
        })
    }

    renderGroupHeaders(group_name) {
        const columns = this.props.columns;
        const has_group = columns.find(o => o[group_name]);
        if (!has_group) return;
        let last_group;
        let group_props = columns.map( o => {
            if (o[group_name]) {
                if (last_group && o[group_name] == last_group.text) {
                    last_group.colspan ++;
                    return {
                        ignore: true
                    }
                } else {
                    last_group = {
                        text: o[group_name],
                        colspan: 1
                    }
                    return last_group;
                }
            } else {
                last_group = null;
                return {
                    text: '',
                    colspan: 1
                }
            }
        });
        const group_views = group_props.map( (o, i) => {
            if (o.ignore) return null;
            return (
                <th key={i} colSpan={''+o.colspan} style={{ verticalAlign: 'top', fontSize:this.props.fontSize}}>
                    <span>
                        {o.text}
                    </span>
                </th>
            )
        });
        return <tr style={{ lineHeight: this.props.row_height }}>
                    {group_views}
                </tr>
    }

    findCellMerges () {
        this.cell_merges = {};
        this.props.columns.filter(o => o.mergeable).forEach(column => {
            let last_group = null;
            this.cell_merges[column.name] = this.state.data.map(o => {
                const text = o[column.name];
                if (last_group && text && text == last_group.text) {
                    last_group.rowspan ++;
                    return { ignore: true }
                } else {
                    last_group = {
                        text,
                        rowspan: 1
                    }
                    return last_group
                }
            });
        })
    }

    renderRow(row, i) {
        if (row.render_headers === true) {
            row = {};
            this.props.columns.forEach(o => {
                row[o.name] = <b style={{fontWeight: 600}}>{o.header}</b>;
            })
        }
        return (
            <tr key={i} style={{lineHeight: this.props.row_height}}>
                {this.props.columns.map((column, j) => {
                    const text = row[column.name];
                    let rowspan = 1;
                    const merges = this.cell_merges[column.name];
                    if (merges) {
                        if (merges[i].ignore) return;
                        rowspan = merges[i].rowspan;
                    }
                    return (
                        <td rowSpan={rowspan} key={j} style={{verticalAlign: 'text-bottom', fontSize:this.props.fontSize}}>
                            <span title={text} style={{ width: column.width }}>{column.render ? column.render(text, row) : text}</span>
                        </td>
                    )
                })}
            </tr>
        )
    }

    getLastPage() {
        return Math.ceil(this.state.total / this.state.pageSize)
    }

    renderPageSizes() {
        const pageSize = this.state.pageSize
        return(
            <select onChange={this.changePageSize()}>
            { page_sizes.map(o => {
                return (
                <option key={o} value={o}>
                    {o}
                </option>
                )
            }) }
        </select>
        )
    }

    hidePageSizes() {
        this.setState({showPageSizes: false})
    }

    toggleShowPageSizes(b) {
        this.setState({showPageSizes: !this.state.showPageSizes})
    }

    getAlignClass(){
        const valid=["right","center","left"];
        if( this.props.alignment && valid.indexOf(this.props.alignment)<0) console.error("Improper Alignment Value. Valid Values Are 'right','left','center'")
        else if(this.props.alignment) return `${this.props.alignment}-align`;
        return "center-align";
    }

    renderPaginators() {
        const lastPage = this.getLastPage()
        const paginationValues = pagination(this.state.page, lastPage)
        const paginators = paginationValues.map(this.renderPaginatorIndex.bind(this))
        return paginators
    }

    render() {
        if(this.props.disappear_on_load && !this.state.loaded) return null;
        this.findCellMerges();
        const page = this.state.page;
        const pageSize = this.state.pageSize;
        const headers = this.renderHeaders();
        const rows = this.state.data.map(this.renderRow)
        const lastPage = this.getLastPage()
        const paginators = this.renderPaginators()
        return (
            <div className='datatable_wrap'>
                <table className="datatable_table datatable_table-bordered">
                    <thead>
                        {this.renderGroupHeaders('groupA')}
                        {this.renderGroupHeaders('groupB')}
                        {this.renderGroupHeaders('groupC')}
                        {this.renderGroupHeaders('groupD')}
                        <tr style={{ lineHeight: this.props.row_height}}>
                            {headers}
                        </tr>
                    </thead>
                    <tbody >
                        {rows}
                    </tbody>
                </table>
                <br/>
                <div style={{...this.props.no_paging?{display: 'none'} : null}}>
                    <ul className="datatable_menu-list">
                        {paginators}
                    </ul>
                </div>
                <br/>
                <div>Displaying {(page - 1) * pageSize + 1} - {Math.min(page * (pageSize), this.state.total)} of {this.state.total} records</div>
                <br/>
                <div style={{...this.props.no_paging || this.props.no_page_sizing?{display: 'none'} : null}}>
                    Page size: {this.renderPageSizes()}
                </div>
            </div>
        );
    }
}

export default DataTable;
