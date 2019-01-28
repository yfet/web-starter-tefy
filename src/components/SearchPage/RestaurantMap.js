import React, { PureComponent } from 'react';
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';

class RestaurantMap extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const defaultCenter = data.length && data[0] && {lat: data[0].lat, lng: data[0].lon};
    return (
      <div>
        <GoogleMap
          defaultZoom={13}
          defaultCenter={defaultCenter}
        >
          {data.map((item, index) => {
            return <Marker key={index} position={{ lat: item.lat, lng: item.lon }} />;
          })}
        </GoogleMap>
      </div>
    );
  }
}

const sRestaurantMap = withScriptjs(withGoogleMap(RestaurantMap));

export default sRestaurantMap;
