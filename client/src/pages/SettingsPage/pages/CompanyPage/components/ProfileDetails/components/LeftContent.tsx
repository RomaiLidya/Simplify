import React, { FC, Fragment } from 'react';
import { Avatar, Badge, ButtonBase, createStyles, Grid, makeStyles, Paper, Theme, Tooltip, Typography } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CancelImageIcon from '@material-ui/icons/Close';

interface Props {
  logo: string;
  setLogo: React.Dispatch<React.SetStateAction<string>>;
  logoView: string;
  setLogoView: React.Dispatch<React.SetStateAction<string>>;
  logoError: string;
  isSubmitting: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    leftPaper: {
      padding: theme.spacing(2),
      textAlign: 'center'
    },
    bigAvatar: (props: Props) => ({
      width: 80,
      height: 80,
      color: `${props.logoError !== '' ? '#f44336' : '#C4C4C4'}`,
      backgroundColor: '#FFFFFF',
      boxShadow: `0px 1px 1px 1px ${props.logoError !== '' ? '#f44336' : ''}`
    }),
    spacingNewLine: {
      marginBottom: theme.spacing(1.5)
    },
    buttonBaseStyle: {
      position: 'relative',
      [theme.breakpoints.down('xs')]: {
        width: '100% !important'
      }
    },
    inputImageStyle: {
      display: 'none'
    },
    cancelImage: {
      fontSize: '12px',
      cursor: 'pointer'
    }
  })
);

const LeftContent: FC<Props> = props => {
  const classes = useStyles(props);

  const { logo, setLogo } = props;
  const { logoView, setLogoView } = props;

  const renderImageComponent = () => {
    if (logoView === '') {
      return (
        <Fragment>
          <input
            accept='image/*'
            className={classes.inputImageStyle}
            id='outlined-button-file'
            type='file'
            onChange={event => handleChooseImage(event)}
          />
          <label htmlFor='outlined-button-file'>
            <ButtonBase focusRipple key={'Upload'} component='span' disableRipple>
              <Tooltip title='Choose an image' placement='top'>
                <Avatar className={classes.bigAvatar}>
                  <UploadIcon fontSize='large' />
                </Avatar>
              </Tooltip>
            </ButtonBase>
          </label>
        </Fragment>
      );
    } else {
      return (
        <Badge badgeContent={<CancelImageIcon className={classes.cancelImage} onClick={event => cancelImage()} />} color='primary'>
          <input
            accept='image/*'
            className={classes.inputImageStyle}
            id='outlined-button-file'
            type='file'
            onChange={event => handleChooseImage(event)}
          />
          <label htmlFor='outlined-button-file'>
            <ButtonBase focusRipple key={'Upload'} className={classes.buttonBaseStyle} component='span' disableRipple>
              <Tooltip title='Choose an image' placement='top'>
                <Avatar alt='Entity logo' src={logoView} className={classes.bigAvatar} />
              </Tooltip>
            </ButtonBase>
          </label>
        </Badge>
      );
    }
  };

  const handleChooseImage = (event: any) => {
    let image;
    let imageView;
    if (event.target.files[0] === undefined) {
      image = '';
      imageView = '';
    } else {
      image = event.target.files[0];
      imageView = URL.createObjectURL(event.target.files[0]);
    }
    setLogo(image);
    setLogoView(imageView);
  };

  const cancelImage = () => {
    setLogo('');
    setLogoView('');
  };

  return (
    <Paper className={classes.leftPaper}>
      <Grid container direction='row' justify='center' alignItems='center'>
        <div className={classes.spacingNewLine}>{renderImageComponent()}</div>
        <div className={classes.spacingNewLine}>
          <Typography color='textSecondary' variant='caption' display='block' gutterBottom>
            For best results, use an image
          </Typography>
          <Typography color='textSecondary' variant='caption' display='block' gutterBottom>
            at least 128px by 128px in .jpg format
          </Typography>
        </div>
        <div className={classes.spacingNewLine}>
          <Typography color='primary' variant='body2' display='block' gutterBottom>
            Company Name
          </Typography>
          <Typography color='textSecondary' variant='body2' display='block' gutterBottom>
            Company Address
          </Typography>
        </div>
      </Grid>
    </Paper>
  );
};

export default LeftContent;
