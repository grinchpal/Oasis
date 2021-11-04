import React from 'react';
import PropTypes from 'prop-types';

export default function ResourceCard({ description, name, image, facility }) {
  return(
    <div className='card'>
        <img src={image}/>
        <div className='card-body'>
            <h3>{name}</h3>
            <p> </p>
            <p>{description}</p>
            <h5>By {facility}</h5>
        </div>
    </div>
  )
}

ResourceCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  facility: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired
}