import '../MapComponent/Map.css';

export default function Sidebar(placeResult) {
    if (!placeResult) return null;

    let photo = null, rating = null, website = null;

    // Add the primary photo, if there is one
    if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        photo = <img className='hero' alt='Shelter image' src={firstPhoto.getUrl()}></img>;
    }

    // place details
    let name = <h3 className='place'>{placeResult.name}</h3>;

    if (placeResult.rating) {
        rating = <p className='details'>{`Rating: ${placeResult.rating} \u272e`}</p>;
    }

    let address = <p className='details'>{placeResult.formatted_address}</p>;

    if (placeResult.website) {
        website = <a href={placeResult.website} target='_blank'>{placeResult.website}</a>;
    }

    return (
        <div className='open inline'>
            <div>
                {photo}
            </div>
            <div>
                {name}
            </div>
            <div>
                {rating}
            </div>
            <div>
                {address}
            </div>
            <div>
                {website}
            </div>
        </div>
    );
}