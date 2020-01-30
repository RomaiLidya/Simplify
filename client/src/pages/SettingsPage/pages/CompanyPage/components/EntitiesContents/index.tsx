import React, { FC, useState, useEffect, Fragment } from 'react';
import { Avatar, Badge, ButtonBase, createStyles, Grid, makeStyles, Paper, Theme, Tooltip, Typography } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CancelImageIcon from '@material-ui/icons/Close';
import useRouter from 'hooks/useRouter';
import axios, { CancelTokenSource } from 'axios';
import { ENTITY_BASE_URL } from 'constants/url';
import GridEntitiesContents from './components/GridEntitiesContents';

interface Props {
  isLoadingData: boolean;
  entities: EntitiesModel[];
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  deleteIndividualEntity: (entityIndex: number) => void;
  handleOpenEditEntity: (entityIndex: number) => React.MouseEventHandler;
  
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Paper: {
      padding: theme.spacing(8),
      textAlign: 'center',
      width: theme.spacing(128)
    },
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

const EntitiesContents: FC<Props> = props => {
  const {
    isLoadingData,
    entities,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    deleteIndividualEntity,
    handleOpenEditEntity
   
  } = props;

  const { match } = useRouter();

  const params = match.params.id;

  const dummyEntity: EntitiesModel = {
    id: 0,
    name: '',
    address: '',
    logo: '',
    contactNumber: ''
  };

  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [openEditEntityModal, setOpenEditEntityModal] = useState<boolean>(false);
  const [users, setUsers] = useState<UserDetailsModel[]>([]);
  const [currentEditingUserIndex, setCurrentEditingUserIndex] = useState<number>(0);
  const [openCreateUserModal, setOpenCreateUserModal] = useState<boolean>(false);
  const [openEditUserModal, setOpenEditUserModal] = useState<boolean>(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoadingData) {
      timeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);
    }

    setShowSkeleton(false);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoadingData]);

  const updateIndividualUser = (userIndex: number) => {
    return (updatedUserProperties: Partial<UserDetailsModel>) => {
      setUsers(
        users!.map((user, index) => {
          if (index !== userIndex) {
            return user;
          }

          return Object.assign({}, user, updatedUserProperties);
        })
      );
    };
  };

  const handleOpenCreateUser = () => {
    setOpenCreateUserModal(true);
  };

  const handleOpenEditUser = (userIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingUserIndex(userIndex);
    setOpenEditUserModal(true);
  };

  const handleCancelCreateUser = () => {
    setOpenCreateUserModal(false);
  };
  const handleCancelEditUser = () => {
    setOpenEditUserModal(false);
  };

  return (
    <Fragment>
      {showSkeleton
        ? [1, 2, 3, 4, 5].map((value, index) => (
            <GridEntitiesContents
              isLoadingData={isLoadingData}
              key={value}
              entity={dummyEntity}
              index={index}
              handleSetMessageSuccess={handleSetMessageSuccess}
              handleSetMessageError={handleSetMessageError}
              setOpenSnackbar={setOpenSnackbar}
              deleteIndividualEntity={deleteIndividualEntity}
              setSnackbarVarient={setSnackbarVarient}
              onEditEntity={handleOpenEditEntity(index)}
             />
          ))
        : entities.map((entity, index) => (
            <GridEntitiesContents
              isLoadingData={isLoadingData}
              key={entity.name}
              entity={entity}
              index={index}
              handleSetMessageSuccess={handleSetMessageSuccess}
              handleSetMessageError={handleSetMessageError}
              setOpenSnackbar={setOpenSnackbar}
              deleteIndividualEntity={deleteIndividualEntity}
              setSnackbarVarient={setSnackbarVarient}
              onEditEntity={handleOpenEditEntity(index)}
            
            />
          ))}

     </Fragment>
  );
};

export default EntitiesContents;
