import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: theme.palette.background.light,
  },
});

class StepperComponent extends React.Component {
  state = {
    activeStep: 0,
  };

  handleNext = () => {
    console.log("next");
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
    this.props.next();
  };

  handleBack = () => {
    console.log("back");
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
    this.props.back();
  };

  render() {
    const { classes } = this.props;

    return (
      <MobileStepper
        variant="dots"
        steps={4}
        position="static"
        activeStep={this.state.activeStep}
        nextButton={
          <Button size="small" onClick={() => this.handleNext()} disabled={this.state.activeStep === 3}>
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={() => this.handleBack()} disabled={this.state.activeStep === 0}>
            <KeyboardArrowLeft />
          </Button>
        }
      />
    );
  }
}

StepperComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default StepperComponent;