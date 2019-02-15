import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StackChart from './components/StackChart';
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
require('typeface-aleo');
require('typeface-graduate');

const lifeStyleThemes = [ "bmi", "smoking", "exercise", "alcohol" ];

const customTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'graduate',
    h1: {
      color: 'textPrimary',
      fontSize: 100
    },
    h2: {
      fontSize: 80
    },
    subtitle1: {
      fontFamily: 'graduate',
      fontSize: 30,
      color: 'textSecondary',
    },
    body1: {
      fontFamily: 'aleo',
      fontSize: 40
    }
  },
  palette: {
    primary: {
      main: '#337180',
    },
    secondary: {
      main: '#F7B034',
    },
    background: {
      main: "#337180",
      light: '#dbdbdb',
    },
    textPrimary: {
      main: "#44ff66"
    }
  },
});

const styles = () => ({
  root: {
    fontFamily: 'aleo',
    textAlign: 'center',
    background: customTheme.palette.background.main,
    borderRadius: 10,
    border: 5,
  },
  graphics: {
    height: 400,
    background: customTheme.palette.background.light,
    margin: 16,
    justify: "center"
  },
  paperPrimary: {
    background: "#dbdbdb",
    marginTop: 16,
    marginLeft: 16,
    marginRight: 8,
    height: 450,
  },
  paperSecondary: {
    background: "#F7B034",
    marginTop: 16,
    marginRight: 16,
    marginLeft: 8,
    height: 450,
  },
  tabContainer: {
    verticalAlign: 'bottom',
    height: 80,
    background: "#F7B034",
    margin: 16,
    color: customTheme.palette.primary.main
  },
  tabs: {
    
  },
  tabLabel: {
    fontFamily: 'graduate',
    fontSize: 35
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
          <Grid container spacing={8} >
            <Grid item xs={7} >
              <Paper className={classes.paperPrimary}>
              <img height={100} className={classes.img} src={"src/client/images/helmet.png"}/>
              <Typography color='primary' variant='h1' gutterBottom>
                  Beneath the helmet
                </Typography>
                
                  <Typography variant="subtitle1" gutterBottom>
                  A story about mental health in construction
                </Typography>
              </Paper>
            </Grid>


            <Grid item xs={5}>
              <Paper className={classes.paperSecondary}>
              <Typography variant="h2" color='primary' gutterBottom>
                  Lifestyle.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                Est nisi qui sit do nisi anim aliqua. Occaecat consecteturmagna ad  proident.Exercitation irure esse enim laborum. Pariatur voluptate enim irure cillum qui.
                </Typography>
              </Paper>
              </Grid>
              
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs>
              <Paper className={classes.tabContainer}>
                <Tabs className={classes.tabs}
                      value={lifeStyleTheme}
                      variant={'fullWidth'}
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
            <Grid item xs={5}>
              <Paper className={classes.graphics}>
                <StackChart
                  data={this.getStackData(this.state.data)}
                  theme={lifeStyleTheme}
                />
              </Paper>
            </Grid>
            <Grid item xs={7} >
              <Paper className={classes.graphics}>
              <StepperComponent
                style={{height: "132px"}}
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
