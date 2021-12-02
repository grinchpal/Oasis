import App from '../App';
import React from 'react';
import './Resources.css';
import resources from './data';
import ResourceCard from './ResourceCard';

function Resources() {
    return (
      
        <div className="wrapper">
          {resources.map(resource =>
            <ResourceCard
              key={resource.name}
              name={resource.name}
              description={resource.description}
              image={resource.image}
              facility={resource.facility}
              website= {resource.website}
            />
          )}
        </div>
      );
}

export default Resources;