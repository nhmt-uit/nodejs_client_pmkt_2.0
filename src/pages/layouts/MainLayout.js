import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import { Header, MainNavigation, Footer } from 'my-pages/layouts/partials';
import RenderRoutes from 'my-routes/RenderRoutes';

class MainLayout extends Component {
    render() {
        return (
			<section>
				<Router>
					<div className="page-header-fixed page-sidebar-closed-hide-logo page-content-white">
						<div className="page-wrapper">
							<Header />
							<div className="page-container">
								<MainNavigation />
								<div className="page-content-wrapper">
									<div className="page-content">
										<RenderRoutes />
									</div>
								</div>
							</div>
							<Footer />
						</div>
					</div>
				</Router>
			</section>
        )
    }
}

export default MainLayout;
