import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Query} from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import {RESTAURANT_SEARCH_QUERY} from '../../graphql/queries';
import RestaurantCard from './RestaurantCard';


const styles = {
  container: {
    backgroundColor: '#c5d1d7',
    height: '100%',
    overflowY: 'auto'
  }
};

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: 'Chicago' // initiate address to chicago
    };
  }

  render() {
    const {address} = this.state;

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

          console.log('DO SOMETHING SMART WITH THIS DATA');
          console.log('data', data);
          console.log('error', error);

          // Make sure we have data
          if (
            data.search_restaurants
            && data.search_restaurants.results
            && data.search_restaurants.results.length > 0
          ) {
            const { classes } = this.props;
            return (
              <div className={classes.container}>
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
