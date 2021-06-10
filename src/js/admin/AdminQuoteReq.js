import React, { Component } from 'react';

import Popup from "../common/Popup";
import QuoteReqUpdate from './QuoteReqUpdate';
import { validationMessages } from '../common/Constants';
import { statusColorClass } from '../common/Utils.js';
import AdminService from "../services/admin.service";

class AdminQuoteReq extends Component {

    state = {
        searchValue: "",
        selectedItem: [],
        listitems: [],
        updateQuotePage: false,
        popupConfig: {},
        isPopupOpen: false
    }
    constructor(props) {
        super(props);
        this.getAllQuoteCall();
    }
    render() {
        return (
            <React.Fragment>
                <Popup popupConfig = {this.state.popupConfig} openFlag = {this.state.isPopupOpen} parentCloseCallback={this.handleClose.bind(this)} parentConfirmCallback = {this.handleModalYes.bind(this)}></Popup>

                {this.state.updateQuotePage ? <QuoteReqUpdate selectedQuote= {this.state.selectedItem} parentCallback= {this.parentCallback}/> : this.renderQuoteList() }

            </React.Fragment>
        );
    }
    getAllQuoteCall() {
        AdminService.getAllQuotes().then(
            response => {
                this.setState({
                    listitems: response.data.quotes
                });
            },
            error => {
                console.log("Error");
            }
        );
    }
    handleSearchChange(e) {
        this.setState({
            searchValue: e.target.value.toLowerCase()
        });
    }
    onQuotereqSelected(selectedItem) {
        this.setState({
            selectedItem: selectedItem
        });
    }

    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
    };

    handleModalYes = () => {
        this.setState({
            isPopupOpen: false
        });
        AdminService.deleteQuote(this.state.selectedItem.id).then(
            response => {
                console.log("Succ");
            },
            error => {
              console.log("Error");
            }
          );

        var tempList = this.state.listitems.filter(item => item.id !== this.state.selectedItem.id);
        this.setState({
            listitems: tempList,
            selectedItem: []
        });
    };
    deleteQuote() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.setState({
                isPopupOpen: true,
                popupConfig : {
                    header: "Message",
                    body:"Select one item",
                    type: "message"
                }
            });
        } else {
            this.setState({
                isPopupOpen: true,
                popupConfig : {
                    header: "Confirm to Delete",
                    body:"Are you sure you want to delete "+this.state.selectedItem.title,
                    type: "confirmation"
                }
            });
        }
    }

    editQuote() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            alert(validationMessages.NO_Item);
        } else {
            this.setState({
                updateQuotePage: true
            });
        }
    }
    parentCallback = () => {
        this.setState({
            selectedItem: [],
            updateQuotePage: false
        });
    }

    renderQuoteList() {
        return (<div className="col admin-list-page">
            <div className="list-group-header section-header row">
                <div className="col-4">
                    <span className="mb-1 underline">Quote</span>
                    <span className="mb-1 blue-color pl-2">Requests</span>
                </div>
                <div className="col-8 text-right">
                    <div className="has-search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input type="text" className="form-control search-box" placeholder="Search quote requests..." onChange={this.handleSearchChange.bind(this)} />
                    </div>
                    <button className="btn delete-btn" onClick={() => this.deleteQuote()}></button>
                    <button className="btn edit-btn" onClick={() => this.editQuote()}></button>

                </div>
            </div>
            <div className="quote-req-list">
                <div className="row mt-1 quote-req-header">
                    <div className="col-4">
                        <label>Title</label>
                    </div>
                    <div className="col-sm">
                        <label>Submitted by</label>
                    </div>
                    <div className="col-sm">
                        <label>Received On</label>
                    </div>
                    <div className="col-sm">
                        <label>Modified On</label>
                    </div>
                    <div className="col-sm">
                        <label>Status</label>
                    </div>
                    <div className="col-sm text-right">
                        <label>Attachments</label>
                    </div>
                </div>
                <div className="quote-req-table">
                    {this.state.listitems.filter(item =>
                        item.title.toLowerCase().includes(this.state.searchValue)).map(item => (
                            <div className="row mt-1" key={item.id}>
                                <div className="col-4" >
                                    <label className="btn btn-default blue projectname-truncate text-truncate">
                                        <input type="radio" className="toggle"
                                            name="quoteItem" value={item.id}
                                            onChange={() => this.onQuotereqSelected(item)} />
                                        {item.title}
                                    </label>
                                </div>

                                <div className="col-sm">
                                    <label></label>
                                </div>
                                <div className="col-sm">
                                    <label>{(new Date(item.createdAt)).toLocaleDateString()}</label>

                                </div>
                                <div className="col-sm">
                                    <label>{(new Date(item.updatedAt)).toLocaleDateString()}</label>
                                </div>
                                <div className="col-sm">
                                    <span className={"badge " + statusColorClass(item.status)} >{item.status}</span>
                                </div>
                                <div className="col-sm text-right">
                                    <span className="badge attachment-badge">{item.attachments && item.attachments.length}</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>);
    }
    
}
export default AdminQuoteReq;