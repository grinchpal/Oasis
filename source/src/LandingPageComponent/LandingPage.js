import './LandingPage.css';
import Filters from './FiltersComponent/Filters';
import Map from './MapComponent/Map';
import Sidebar from './SidebarComponent/Sidebar';

export default function LandingPage() {
    return (
        <>
            <div className="modal-body row">
                <div className="col-lg-3 col-md-3 col-sm-3">
                    <h3>I am looking for...</h3>
                    <Filters />
                </div>
                <div className="col-lg-9 col-md-9 col-sm-9">
                    <Map />
                </div>
            </div>
        </>
    );
}