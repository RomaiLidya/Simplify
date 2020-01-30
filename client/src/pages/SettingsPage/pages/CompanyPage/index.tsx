import React, { FC, Fragment, useState, useEffect } from 'react';
import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import CustomizedTabs from 'components/CustomizedTabs';
import ProfileDetails from './components/ProfileDetails';
import { ENTITY_BASE_URL } from 'constants/url';
import ActionSnackbar from 'components/ActionSnackbar';
import BussinesDetails from './components/BussinesDetails';
import EntitiesContents from './components/EntitiesContents';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import axios, { CancelTokenSource } from 'axios';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import useRouter from 'hooks/useRouter';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingBottom: theme.spacing(4),
    paddingLeft: 0,
    paddingRight: 0
  },
  contentContainer: {
    '& > :nth-child(n+2)': {
      marginTop: theme.spacing(2)
    }
  },
  tableRoot: {
    width: '100%',
    overflowX: 'auto'
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  }
}));

const CompanyPage: FC = () => {
  useCurrentPageTitleUpdater('Employees');

  const { match } = useRouter();

  const params = match.params.id;
  const [count, setCount] = useState<number>(0);
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [entities, setEntities] = useState<EntitiesModel[]>([]);
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<number>(0);
  const [contactNumber, setContactNumber] = useState<string>('');
  const [openProfileDetails, setOpenProfileDetails] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentEditingEntityIndex, setCurrentEditingEntityIndex] = useState<number>(0);
  const [openEditEntityModal, setOpenEditEntityModal] = useState<boolean>(false);

  
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();
    const loadData = async () => {
      try {
        const url = `${ENTITY_BASE_URL}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setEntities(data.entities);
        console.log('MASUK SINI');
      } catch (err) {
        console.log('ERROR DISINI');
      }
    };

    loadData();
    return () => {
      cancelTokenSource.cancel();
    };
  }, [params]);

  console.log('datanya', entities);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const addNewEntity = (entity: EntitiesModel) => {
    entity.new = true;
    entities.unshift(entity);
    setEntities([...entities]);
  };
  console.log('Entitynya adalah ', entities);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };
  const handleOpenProfileDetails = () => {
    setOpenProfileDetails(true);
  };
  const handleCancelProfileDetails = () => {
    setOpenProfileDetails(false);
  };
  const handleSetMessageSuccess = (message: string) => {
    setMessageSuccess(message);
  };

  const handleSetMessageError = (message: string) => {
    setMessageError(message);
  };
  const deleteIndividualEntity = (entityIndex: number) => {
    entities.splice(entityIndex, 1);
    setEntities([...entities]);
    setCount(c => c - 1);
  };
  const handleOpenEditEntity = (entityIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingEntityIndex(entityIndex);
    setOpenEditEntityModal(true);
  };

  const SelectedContent: FC<{ page: number }> = props => {
    switch (props.page) {
      case 0:
        return (
          <ProfileDetails
            open={openProfileDetails}
            addNewEntity={addNewEntity}
            handleCancel={handleCancelProfileDetails}
            setOpenSnackbar={setOpenSnackbar}
            setSnackbarVarient={setSnackbarVarient}
          />
        );
      case 1:
        return <BussinesDetails isLoadingData={isLoadingData} />;
      case 2:
        return (
          <EntitiesContents
            isLoadingData={isLoadingData}
            entities={entities}
            name={name}
            address={address}
            contactNumber={contactNumber}
            id={id}
            setOpenSnackbar={setOpenSnackbar}
            setSnackbarVarient={setSnackbarVarient}
            handleSetMessageSuccess={handleSetMessageSuccess}
            handleSetMessageError={handleSetMessageError}
            deleteIndividualEntity={deleteIndividualEntity}
            handleOpenEditEntity={handleOpenEditEntity}
          
          />
        );
      case 3:
        return <div>Subscription content here</div>;
      default:
        return <div />;
    }
  };

  return (
    <Fragment>
      <CustomizedTabs
        tabs={[{ id: 0, name: 'Profile Details' }, { id: 1, name: 'Business Details' }, { id: 2, name: 'Entities' }, { id: 3, name: 'Subscription' }]}
        selectedTabId={selectedTab}
        onSelect={(tabId: number) => performActionAndRevertPage(setSelectedTab, tabId)}
      />
      <SelectedContent page={selectedTab} />
      <ActionSnackbar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? 'Operation is successful' : 'Operation failed'}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
    </Fragment>
  );
};

export default CompanyPage;
