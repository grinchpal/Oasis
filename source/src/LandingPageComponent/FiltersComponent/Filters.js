import './Filters.css';

const locationTypes = ['Domestic Violence Shelters', 'Homeless Shelters', 'Public Restrooms'];
const filters = ['Allows Pets', 'Offers Education', 'Offers Meals'];
const overflow = 3;

function onCheckboxClick(i) {
    let checkbox = document.getElementById(i.toString());
    if (checkbox.checked) {
        console.log(checkbox.value + " has been checked");
    }
    else {
        console.log(checkbox.value + " has been unchecked");
    }
}

export default function Filters() {
    const locationTypeHTML = locationTypes.map((type, index) =>
        <li key={index}>
            <input id={index.toString()} type="checkbox" name="location" value={type} onClick={() => onCheckboxClick(index)} />
            <label htmlFor={index.toString()}>&nbsp;{type}</label>
        </li>
    );
    console.log(locationTypeHTML);

    const filtersHTML = filters.map((filter, index) => {
        let key = locationTypes.length - 1 + index;
        return (
            <li key={key}>
                <input id={key.toString()} type="checkbox" name="filter" value={filter} onClick={() => onCheckboxClick(key)} />
                <label htmlFor={key.toString()}>&nbsp;{filter}</label>
            </li>
        );
    });

    let locationClass = "checkboxContainer";
    let filterClass = "checkboxContainer";
    if (locationTypes.length > overflow) locationClass = " list";
    if (filters.length > overflow) filterClass = " list"; //There are spaces so css can detect multiple classes

    return (
        <>
            <div className={locationClass}>
                <ul>
                    {locationTypeHTML}
                </ul>
            </div>

            <br></br>

            <h4>Filters</h4>
            <div className={filterClass}>
                <ul>
                    {filtersHTML}
                </ul>
            </div>
        </>
    );
}