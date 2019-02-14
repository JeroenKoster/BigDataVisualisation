
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Grid, Typography } from '@material-ui/core';
import { mentalProblems } from '../MentalIssues';

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: theme.palette.background.main,
  },
});

class MentalHealthComponent extends React.Component {
 
  themeToString(theme, issue) {
    let {data, step} = this.props;
    let average = Object.values(mentalProblems)[step].average;
    if (data.length > 0) {
      switch (theme) {
        case "exercise":
          let yes = data.filter(d => d.key == "Ja")[0].value[issue];
          let no = data.filter(d => d.key == "Nee")[0].value[issue];
          return <div>
            <p>
              Regular Exercise: {parseFloat(yes).toFixed(1)}%
              ({parseFloat((average - yes) / average * 100).toFixed(1)} %)<br/>
              No regular exercise: {parseFloat(no).toFixed(1)}%
              ({parseFloat((average - no) / average * 100).toFixed(1)} %)
            </p>
          </div>;
        case "bmi":
          let healthy = data.filter(d => d.key == "Tot 25")[0].value[issue];
          let high = data.filter(d => d.key == "25 tot 30")[0].value[issue];
          let obsese = data.filter(d => d.key == "30 en hoger")[0].value[issue];
          return <div>
            <p>The BMI has the following effect on this number:</p>
            <p>
              A healty bmi (25 or less) {parseFloat(healthy).toFixed(1)}%
              ({parseFloat((average - healthy) / average * 100).toFixed(1)} %)
              a bmi on the high side (25-30): {parseFloat(high).toFixed(1)}%
              ({parseFloat((average - high) / average * 100).toFixed(1)} %)
              and people with obesity(30+): {parseFloat(obsese).toFixed(1)}%
              ({parseFloat((average - obsese) / average * 100).toFixed(1)} %)
            </p>
          </div>
        case "alcohol":
          return <div>
            <p>For people that exercise regularly this is {parseFloat(yes).toFixed(1)}%
              ({parseFloat((average - yes) / average * 100).toFixed(1)} %)
            </p>
            <p>With exercise this risk changes to {parseFloat(no).toFixed(1)}%
              ({parseFloat((average - no) / average * 100).toFixed(1)} %)
            </p>
          </div>
        case "smoking":
          return <div>
            <p>
              {parseFloat(averages[issue]).toFixed(1)} % of the participants have issues with {issue}
            </p>
            <p>For people that exercise regularly this is <b>{parseFloat(yes).toFixed(1)}</b>%
              ({parseFloat((averages[issue] - yes) / averages[issue] * 100).toFixed(1)} %)
            </p>
            <p>With exercise this risk changes to {parseFloat(no).toFixed(1)}%
              ({parseFloat((averages[issue] - no) / averages[issue] * 100).toFixed(1)} %)
            </p>
          </div>
      }
    } else { return "No data"}
  }
  
  render() {
    const { lifeStyleTheme, step, averages } = this.props;
    let mentalIssueObject = Object.values(mentalProblems)[step];
    return (<div>
      <Typography variant="subtitle1" gutterBottom>
        <b>{parseFloat(Object.values(mentalProblems)[step].average).toFixed(1)}</b> % of the people in construction experience
      </Typography>
     <Typography variant="h3" gutterBottom>
        { Object.values(mentalProblems)[step].title }
      </Typography>
      
      <Grid container spacing={8}>
        <Grid item xs={4}>
        <img height={250} src={"src/client/images/"+mentalIssueObject.image}/>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" gutterBottom>
          these are the effects of {lifeStyleTheme}:
          { this.themeToString(lifeStyleTheme, Object.keys(mentalProblems)[step]) }
          </Typography>
        
        </Grid>
      </Grid>
      </div>
    );
  }
}

MentalHealthComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MentalHealthComponent);



  
