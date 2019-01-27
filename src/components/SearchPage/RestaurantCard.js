import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import {Link} from 'react-router-dom';
import Paper from '@material-ui/core/es/Paper/Paper';
import {walkDurationInMinutes} from "../../utils/utils";

const lightBlue = '#4981c2';
const darkBlue = '#1d1583';

const styles = {
  container: {
    margin: 20,
    marginBottom: 30,
    maxWidth: 600
  },
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flexStart',
    borderRadius: 15,
  },
  placeIcon: {
    color: lightBlue
  },
  darkBlue: {
    color: darkBlue
  },
  titleLink: {
    color: darkBlue,
    textDecoration: 'none'
  },
  place: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontStyle: 'normal'
  },
  info: {
    flex: 1,
    padding: 10,
    paddingRight: 0
  },
  description: {
    color: darkBlue
  },
  title: {
    color: lightBlue
  },
  featuredImage: {
    width: 150,
    height: 150,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15
  },
  flex1: {
    flex: 1
  },
  flexRowCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  featured: {
    composes: '$flexRowCenter',
    color: darkBlue
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10
  },
  rating: {
    display: 'inline-block',
    marginLeft: 10
  }
};

class RestaurantCard extends PureComponent {
  constructor(props) {
    super(props);
    this.featuredRef = React.createRef();
  }

  onFeaturedImageError = () => {
    this.featuredRef.current.src = 'images/featuredDefault.png';
  };

  render() {
    const {
      classes, id, title, cuisine, reference,
      referencesCount, openClosed, featuredImage,
      rating, distance
    } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.card} elevation={1}>
          <div className={classes.info}>
            <Typography component="address" variant="h6" classes={{root: classes.place}}>
              <Icon classes={{root: classes.placeIcon}}>place</Icon>
              <Link to={'/rest/' + id} className={classes.titleLink}>
                {title}
              </Link>
            </Typography>
            <Typography component="div" variant="subtitle1" classes={{root: classes.flexRowCenter}}>
              <Icon>restaurant</Icon><span>{` ${cuisine}` || ' Restaurant'}</span>
            </Typography>
            <Typography component="div" variant="subtitle1" classes={{root: classes.featured}}>
              <Icon>star</Icon>
              <span>
                {(reference && (` Featured in ${reference}`)) || ''}
                {referencesCount > 2 && ('... +' + (referencesCount - 1))}
              </span>
            </Typography>
          </div>
          {featuredImage
          && (
            <img
              className={classes.featuredImage}
              src={featuredImage}
              alt="Featuread"
              ref={this.featuredRef}
              onError={this.onFeaturedImageError}
            />
          )
          }
        </Paper>
        <div className={classes.footer}>
          <div className={classes.flex1}>
            {openClosed} &middot;
            <span> {Math.floor(distance * 10) / 10} miles away</span>
          </div>
          <div>
            <span><Icon>directions_walk</Icon>{walkDurationInMinutes(distance)} min</span>
            <span className={classes.rating}><Icon>star_rate</Icon>{rating ? `${rating}/5` : '0/5'}</span>
          </div>
        </div>
      </div>
    );
  }
}

RestaurantCard.defaultProps = {
  featuredImage: null,
  openClosed: '',
  cuisine: '',
  reference: '',
  rating: 0,
  distance: 0
};
RestaurantCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cuisine: PropTypes.string,
  reference: PropTypes.string,
  referencesCount: PropTypes.number.isRequired,
  openClosed: PropTypes.string,
  featuredImage: PropTypes.string,
  rating: PropTypes.number,
  distance: PropTypes.number
};
const sRestaurantCard = withStyles(styles)(RestaurantCard);
export default sRestaurantCard;
