import React, { Component } from 'react';

export default class CommentContainer extends Component {
    render() {
        return (
            <div className="col-lg-6 col-xs-12 col-sm-12">
                <div className="portlet light bordered">
                    <div className="portlet-title tabbable-line">
                        <div className="caption">
                            <i className="icon-bubbles font-dark hide" />
                            <span className="caption-subject font-dark bold uppercase">Comments</span>
                        </div>
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a href="#portlet_comments_1" data-toggle="tab"> Pending </a>
                            </li>
                            <li>
                                <a href="#portlet_comments_2" data-toggle="tab"> Approved </a>
                            </li>
                        </ul>
                    </div>
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="portlet_comments_1">
                                {/* BEGIN: Comments */}
                                <div className="mt-comments">
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar1.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Michael Baker</span>
                                                <span className="mt-comment-date">26 Feb, 10:30AM</span>
                                            </div>
                                            <div className="mt-comment-text"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-pending">Pending</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar6.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Larisa Maskalyova</span>
                                                <span className="mt-comment-date">12 Feb, 08:30AM</span>
                                            </div>
                                            <div className="mt-comment-text"> It is a long established fact that a reader will be distracted. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-rejected">Rejected</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar8.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Natasha Kim</span>
                                                <span className="mt-comment-date">19 Dec,09:50 AM</span>
                                            </div>
                                            <div className="mt-comment-text"> The generated Lorem or non-characteristic Ipsum is therefore or non-characteristic. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-pending">Pending</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar4.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Sebastian Davidson</span>
                                                <span className="mt-comment-date">10 Dec, 09:20 AM</span>
                                            </div>
                                            <div className="mt-comment-text"> The standard chunk of Lorem or non-characteristic Ipsum used since the 1500s or non-characteristic. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-rejected">Rejected</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* END: Comments */}
                            </div>
                            <div className="tab-pane" id="portlet_comments_2">
                                {/* BEGIN: Comments */}
                                <div className="mt-comments">
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar4.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Michael Baker</span>
                                                <span className="mt-comment-date">26 Feb, 10:30AM</span>
                                            </div>
                                            <div className="mt-comment-text"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-approved">Approved</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar8.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Larisa Maskalyova</span>
                                                <span className="mt-comment-date">12 Feb, 08:30AM</span>
                                            </div>
                                            <div className="mt-comment-text"> It is a long established fact that a reader will be distracted by. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-approved">Approved</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar6.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Natasha Kim</span>
                                                <span className="mt-comment-date">19 Dec,09:50 AM</span>
                                            </div>
                                            <div className="mt-comment-text"> The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-approved">Approved</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-comment">
                                        <div className="mt-comment-img">
                                            <img alt="vw3" src="assets/pages/media/users/avatar1.jpg" /> </div>
                                        <div className="mt-comment-body">
                                            <div className="mt-comment-info">
                                                <span className="mt-comment-author">Sebastian Davidson</span>
                                                <span className="mt-comment-date">10 Dec, 09:20 AM</span>
                                            </div>
                                            <div className="mt-comment-text"> The standard chunk of Lorem Ipsum used since the 1500s </div>
                                            <div className="mt-comment-details">
                                                <span className="mt-comment-status mt-comment-status-approved">Approved</span>
                                                <ul className="mt-comment-actions">
                                                    <li>
                                                        <a href="index.html">Quick Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">View</a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* END: Comments */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
