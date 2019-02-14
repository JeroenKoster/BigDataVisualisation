import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StackChart from './StackChart';
import StepperComponent from './components/StepperComponent'
import MentalHealthComponent from './components/MentalHealthComponent'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {MuiThemeProvider, createMuiTheme, withStyles} from '@material-ui/core/styles';
import NextButton from '@material-ui/icons/NavigateNext';
import PreviousButton from '@material-ui/icons/NavigateBefore';
import {mentalProblems} from './MentalIssues'
require('typeface-graduate');

const lifeStyleThemes = [ "bmi", "smoking", "exercise", "alcohol" ];

const customTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'graduate',
  },
  palette: {
    primary: {
      light: '#dbdbdb',
      main: '#337180',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#79ff61',
      main: '#F7B034',
      dark: '#00ba0d',
      contrastText: '#000',
    },
    background: {
      main: "#337180",
      light: '#dbdbdb',
    }
  },
});

const styles = () => ({
  root: {
    fontFamily: 'graduate',
    textAlign: 'center',
    background: customTheme.palette.background.main,
    borderRadius: 10,
    border: 5,
  },
  secondaryText: {
    textColor: "#F7B034"
  },
  graphics: {
    height: 400,
    background: customTheme.palette.primary.light,
    margin: 10,
    padding: 10,
    justify: "center"
  },
  paperPrimary: {
    background: "#dbdbdb",
    margin: 10,
    padding: 10,
  },
  paperSecondary: {
    background: "#F7B034",
    margin: 10,
    padding: 10,
  },
  tabLabel: {
    fontFamily: 'graduate',
    fontSize: 20
  },
  img: {
    margin:20,
  },
  footer: {
    textColor: "#ff44f4"
  },
  stepper: {
    justifySelf: "center"
  }
});

class App extends Component {
  state = {
    activeStep: 0,
    data: [],
    mentalData: [],
    averages: {key: "default"},
    lifeStyleTheme: "exercise",
    filter: ""
  };

  next = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  back = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
    console.log(this.state.activeStep);
  };

  getStackData(data) {
    let result = {};
    Object.keys(data).forEach(key => {
      let d = data[key];
      result[d.key] = [];
      result[d.key] = d.values.map(age => {
        return {
          key: Number(age.key),
          percentage: age.percentage,
          amount: age.value
        }
      });
    });
    return result;
  }

  componentDidMount() {
    fetch(`/api/averages/`)
      .then(res => res.json())
      .then(data => {
        this.setState({averages: data})
      });
    this.fetchData(this.state.lifeStyleTheme);
    console.log(mentalProblems);
  }

  fetchData = async (theme) => {
    const ageData = await fetch(`/api/theme/${theme}`)
      .then(res => res.json())
      .then(data => {
        return data;
      });
    const mentalData = await fetch(`/api/mental/${theme}`)
      .then(res => res.json())
      .then(data => {
        console.log("mental data: received");
        console.log(data);
        return data;
      });
    this.setState({data: ageData, lifeStyleTheme: theme, mentalData: mentalData});
  }

  handleChange = (event, value) => {
    console.log("Value: " + value);
    this.fetchData(value);
  };


  render() {
    const {lifeStyleTheme, averages, activeStep, mentalData} = this.state;
    const {classes} = this.props;
    return (
      <MuiThemeProvider theme={customTheme}>
        <Paper
          className={classes.root}
        >
          <Grid container spacing={8}>
            <Grid item xs={4} >
              <Paper className={classes.paperPrimary}>
                <h3>
                  Below the helmet
                </h3>
                <img height={100} className={classes.img} src={"src/client/images/helmet.png"}/>
                <p>
                  A story about mental health in construction
                </p>
              </Paper>
            </Grid>


            <Grid item xs={4}>
              <Paper className={classes.paperSecondary}>
                <h3>
                  Most people are aware that lifestyle choices affect their physical health.
                </h3>
                <p>But what about mental health?</p>
              </Paper>
              </Grid>
              <Grid item xs={4}>
              <Paper className={classes.paperPrimary}>
                <h4>
                  Stress, tiredness or overall sadness might just seem a part of life. But the below graphs will show that there are steps that you can take to minimize the risk. 
                </h4>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs>
              <Paper className={classes.paperSecondary}>
                <Tabs className={classes.tabs}
                      value={lifeStyleTheme}
                      centered
                      onChange={this.handleChange}
                      indicatorColor="primary"
                >
                  <Tab value="alcohol" label={<span className={classes.tabLabel}>Alcohol</span>}/>
                  <Tab value="bmi" label={<span className={classes.tabLabel}>bmi</span>}/>
                  <Tab value="smoking" label={<span className={classes.tabLabel}>smoking</span>}/>
                  <Tab value="exercise" label={<span className={classes.tabLabel}>exercise</span>}/>

                </Tabs>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Paper className={classes.graphics}>
                <StackChart
                  data={this.getStackData(this.state.data)}
                  theme={lifeStyleTheme}
                />
              </Paper>
            </Grid>
            <Grid item xs={6} >
              <Paper className={classes.graphics}>
              <StepperComponent
                className={classes.stepper}
                next={this.next}
                back={this.back}
              />
              <MentalHealthComponent
                lifeStyleTheme={lifeStyleTheme}
                step={activeStep}
                averages={averages}
                data={mentalData}
              />
              </Paper>
              <Typography className={classes.footer}>
                Created by Jeroen Koster @ Saxion Hogeschool - 2019
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </MuiThemeProvider>
    )
      ;
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);
