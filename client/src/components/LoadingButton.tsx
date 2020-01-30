import React, { FC, useState, useEffect } from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { Theme, CircularProgress, Fade } from '@material-ui/core';
import { green } from '@material-ui/core/colors';

interface Props extends ButtonProps {
  isLoading: boolean;
  delay: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'relative'
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

const LoadingButton: FC<Props> = props => {
  const classes = useStyles();
  const timerRef = React.useRef<NodeJS.Timeout>();

  // The className and styling defined for LoadingButton will be used to style the root div
  const { isLoading, delay, disabled, children, className, style, ...rest } = props;

  const [disabledDueToLoading, setDisabledDueToLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      timerRef.current = setTimeout(() => {
        setDisabledDueToLoading(true);
      }, delay);
    } else {
      const test = timerRef.current!;
      clearTimeout(test);
      setDisabledDueToLoading(false);
    }

    return () => {
      const test = timerRef.current!;
      clearTimeout(test);
      setDisabledDueToLoading(false);
    };
  }, [isLoading, delay]);

  return (
    <div className={className} style={style}>
      <div className={classes.wrapper}>
        <Button disabled={disabled || disabledDueToLoading} {...rest}>
          {children}
        </Button>
        <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? `${delay}ms` : '0ms'
          }}
          unmountOnExit
        >
          <CircularProgress size={24} className={classes.buttonProgress} />
        </Fade>
      </div>
    </div>
  );
};

export default LoadingButton;
