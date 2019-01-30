import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Query} from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import {RESTAURANT_SEARCH_QUERY} from '../../graphql/queries';
import RestaurantCard from './RestaurantCard';
import RestaurantMap from './RestaurantMap';
import {darkBlue, lightBlue} from '../../utils/constants';
import SearchMapInput from '../UI/SearchMapInput';
import {desktop, DesktopOrAbove, Mobile, mobile} from '../../utils/styles';

const styles = {
  container: {
    backgroundColor: '#c5d1d7',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    padding: 5
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  restaurant: {
    height: '100%',
    overflowY: 'auto',
    marginTop: 20,
    [mobile]: {
      flex: 1
    }
  },
  map: {
    flex: 1,
    borderRadius: 5,
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#335977'
  },
  brandName: {
    flex: 1,
    color: darkBlue,
    fontSize: 32,
    fontWeight: 700,
    fontStyle: 'italic'
  },
  menuBar: {
    display: 'flex',
    marginLeft: 25,
    marginRight: 25,
    alignItems: 'center'
  },
  filter: {
    width: 130,
    height: 50,
    borderRadius: 30,
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: darkBlue,
    fontSize: '1.4rem',
    textTransform: 'none'
  },
  iconList: {
    color: lightBlue,
    fontSize: 42,
    marginRight: 10
  },
  iconStyle: {
    color: 'gray',
    fontSize: 42,
    marginRight: 20
  },
  actionBar: {
    color: 'white',
    marginLeft: 20,
    marginRight: 20,
    height: 70,
    display: 'flex',
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    [desktop]: {
      flexDirection: 'column',
      height: 100,
      justifyContent: 'space-around'
    }
  },
  logIn: {
    backgroundColor: 'rgba(255,255,255, 0.2)',
    color: 'white',
    textTransform: 'none',
    borderRadius: 30,
    width: 120
  },
  signUp: {
    marginLeft: 10,
    backgroundColor: 'white',
    color: darkBlue,
    textTransform: 'none',
    borderRadius: 30,
    width: 120
  },
  searchControls: {
    display: 'flex',
    justifyContent: 'center',
    [desktop]: {
      width: '100%',
      justifyContent: 'space-between'
    },
    [mobile]: {
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
      justifyContent: 'space-between'
    }
  },
  loginButtons: {
    [desktop]: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between'
    }
  },
  myLocation: {
    marginRight: 10,
    backgroundColor: 'orange',
    color: 'white',
    textTransform: 'none',
    borderRadius: 30,
    width: 160
  }
};

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: 'Chicago', // initiate address to chicago,
      searchText: 'Chicago',
      showMap: false,
      currentLocation: null
    };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({
        showMap: true
      });
    }, 1000);
  }

  onLocationChange = (event) => {
    this.setState({
      searchText: event.target.value
    });
  };

  onLocationKeyPress = (event) => {
    const {searchText} = this.state;
    if (event.key === 'Enter') {
      this.setState({
        address: searchText,
        showMap: false,
        currentLocation: null
      });

      setTimeout(() => {
        this.setState({
          showMap: true
        });
      }, 1000);
    }
  };

  onUseMyLocationClick = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const {coords: {latitude, longitude}} = position;
        this.setState({
          currentLocation: {
            lat: latitude,
            lng: longitude
          }
        });
        const url = 'http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + latitude + '&lng=' + longitude + '&username=yfet';
        const response = await fetch(url);
        const data = await response.json();
        if (data) {
          const {geonames} = data;
          if (geonames && geonames.length) {
            const address = geonames[0].toponymName;
            if (address) {
              this.setState({
                showMap: false,
                address,
                searchText: address
              });

              setTimeout(() => {
                this.setState({
                  showMap: true
                });
              }, 1000);
            }
          }
        }
      });
    }
  };

  render() {
    const {address, searchText, showMap, currentLocation} = this.state;

    return (
      // Variables can be either lat and lon OR address
      <Query
        query={RESTAURANT_SEARCH_QUERY}
        variables={{
          address
        }}
      >
        {({loading, error, data = {}}) => {
          if (loading) {
            return <CircularProgress />;
          }
          // Make sure we have data
          if (
            data.search_restaurants
            && data.search_restaurants.results
            && data.search_restaurants.results.length > 0
          ) {
            const {classes} = this.props;
            return (
              <div className={classes.container}>
                <div className={classes.restaurant}>
                  <div className={classes.menuBar}>
                    <Typography variant="h1" classes={{root: classes.brandName}}>Foodsy</Typography>
                    <Icon classes={{root: classes.iconList}}>list</Icon>
                    <Icon classes={{root: classes.iconStyle}}>style</Icon>
                    <Button
                      variant="outlined"
                      className={classes.filter}
                      classes={{label: classes.filterLabel}}
                    >
                      <span>Filter</span>
                      <Icon>filter_list</Icon>
                    </Button>
                  </div>
                  <Mobile>
                    <div className={classes.searchControls}>
                      <Button
                        className={classes.myLocation}
                        onClick={this.onUseMyLocationClick}
                      >
                        <Icon>place</Icon>
                        Use my location
                      </Button>
                      <SearchMapInput
                        onKeyPress={this.onLocationKeyPress}
                        onChange={this.onLocationChange}
                        value={searchText}
                      />
                    </div>
                  </Mobile>
                  {data.search_restaurants.results.map((r, index) => {
                    const {
                      id, images = [], references = [], title = '',
                      cuisine, open_closed: openClosed, rating,
                      distance
                    } = r;
                    const reference = references[0] && references[0].site_name;
                    const referencesCount = references.length;
                    const featuredImage = (images && images.length && images[0]) || null;
                    return (
                      <RestaurantCard
                        key={index}
                        id={id}
                        title={title}
                        cuisine={cuisine}
                        reference={reference}
                        referencesCount={referencesCount}
                        openClosed={openClosed}
                        featuredImage={featuredImage}
                        rating={rating}
                        distance={distance}
                      />
                    );
                  })}
                </div>
                <DesktopOrAbove>
                  <div className={classes.map}>
                    <div className={classes.actionBar}>
                      <div className={classes.searchControls}>
                        <Button
                          className={classes.myLocation}
                          onClick={this.onUseMyLocationClick}
                        >
                          <Icon>place</Icon>
                          Use my location
                        </Button>
                        <SearchMapInput
                          onKeyPress={this.onLocationKeyPress}
                          onChange={this.onLocationChange}
                          value={searchText}
                        />
                      </div>
                      <div className={classes.loginButtons}>
                        <Button
                          className={classes.logIn}
                        >
                          Log In
                        </Button>
                        <Button className={classes.signUp}>
                          Sign Up
                        </Button>
                      </div>
                    </div>
                    {showMap
                    && (
                      <RestaurantMap
                        data={data.search_restaurants.results}
                        location={address}
                        currentLocation={currentLocation}
                        isMarkerShown
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{height: '100%'}} />}
                        containerElement={<div style={{height: '100%'}} />}
                        mapElement={<div style={{height: '100%'}} />}
                      />
                    )
                    }
                  </div>
                </DesktopOrAbove>
              </div>
            );
          }

          // No Data Return
          return <div>No Results</div>;
        }}
      </Query>
    );
  }
}

const sSearchPage = withStyles(styles)(SearchPage);
export default sSearchPage;
