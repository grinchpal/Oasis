import './LandingPage.css';
import Filters from './FiltersComponent/Filters';
import Map from './MapComponent/Map';

export default function LandingPage() {
    return (
        <>
            <div className="modal-body row">
                <div className="col-lg-3 col-md-3 col-sm-3">
                    <h3>I am looking for...</h3>
                    <Filters />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                    <Map />
                </div>
                <div className="col-lg-3 col-md-3 col-sm-3">
                    <h3 className="center">Results</h3>
                    <div id="panel"></div>
                </div>
            </div>
        </>
    );
}