import React, { FC, Fragment, useState, useEffect } from 'react';
import { Button, Grid, makeStyles, Theme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import axios, { CancelTokenSource } from 'axios';

import SearchInput from 'components/SearchInput';
import useDebounce from 'hooks/useDebounce';
import ServiceTable from './components/ServiceTable';
import ActionSnackbar from 'components/ActionSnackbar';

import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import { SERVICE_ITEM_TEMPLATE_BASE_URL } from 'constants/url';

const useStyles = makeStyles((theme: Theme) => ({
  addButton: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  extendedIcon: {
    paddingRight: theme.spacing(1)
  }
}));

const ServicesPage: FC = () => {
  useCurrentPageTitleUpdater('Services');

  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarVarient, setSnackbarVarient] = useState<'success' | 'error'>('success');
  const [messageSuccess, setMessageSuccess] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [query, setQuery] = useState<string>('');
  const [queryString, setQueryString] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isSearchingServiceItemTemplate, setSearchingServiceItemTemplate] = useState<boolean>(false);
  const [isSearchServiceItemTemplateError, setSearchServiceItemTemplateError] = useState<boolean>(false);
  const [serviceItemTemplates, setServiceItemTemplates] = useState<ServiceItemTemplatesModel[]>([]);
  const [count, setCount] = useState<number>(0);

  const [openCreateServiceItemTemplate, setOpenCreateServiceItemTemplate] = useState<boolean>(false);
  const [openEditServiceItemTemplate, setOpenEditServiceItemTemplate] = useState<boolean>(false);
  const [currentEditingServiceTemplateIndex, setCurrentEditingServiceTemplateIndex] = useState<number>(0);

  // Search Service whenever rowsPerPage, currentPage, queryString changes
  useEffect(() => {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source();

    const getQueryParams = () => {
      const params = new URLSearchParams();
      if (queryString) {
        params.append('q', queryString);
      }

      params.append('s', (currentPage * rowsPerPage).toString());
      params.append('l', rowsPerPage.toString());

      return params.toString();
    };

    const searchServiceItemTemplate = async () => {
      setSearchingServiceItemTemplate(true);
      setSearchServiceItemTemplateError(false);

      try {
        const url = `${SERVICE_ITEM_TEMPLATE_BASE_URL}?${getQueryParams()}`;
        const { data } = await axios.get(url, { cancelToken: cancelTokenSource.token });
        setCount(data.count);
        setServiceItemTemplates(data.serviceItemTemplates);
      } catch (err) {
        setSearchServiceItemTemplateError(true);
      }

      setSearchingServiceItemTemplate(false);
    };

    searchServiceItemTemplate();

    return () => {
      cancelTokenSource.cancel();
    };
  }, [rowsPerPage, currentPage, queryString]);

  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    setCurrentPage(0);
    action(actionParam);
  };

  const handleSearch = (searchQuery: string) => {
    performActionAndRevertPage(setQueryString, searchQuery);
  };

  const debouncedSearchTerm = useDebounce(query, 500);
  // Load client data to populate on search list
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      handleSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleOpenCreateServiceItemTemplate = () => {
    setOpenEditServiceItemTemplate(false);
    setOpenCreateServiceItemTemplate(true);
  };

  const handleCancelCreateServiceItemTemplate = () => {
    setOpenCreateServiceItemTemplate(false);
  };

  const handleOpenEditServiceItemTemplate = (serviceItemTemplateIndex: number): React.MouseEventHandler => () => {
    setCurrentEditingServiceTemplateIndex(serviceItemTemplateIndex);
    setOpenCreateServiceItemTemplate(false);
    setOpenEditServiceItemTemplate(true);
  };

  const handleCancelEditServiceItemTemplate = () => {
    setOpenEditServiceItemTemplate(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSetMessageSuccess = (message: string) => {
    setMessageSuccess(message);
  };

  const handleSetMessageError = (message: string) => {
    setMessageError(message);
  };

  const addNewServiceItemTemplate = (serviceItemTemplate: ServiceItemTemplatesModel) => {
    serviceItemTemplate.new = true;
    serviceItemTemplates.unshift(serviceItemTemplate);
    setServiceItemTemplates([...serviceItemTemplates]);
    setCount(c => c + 1);
  };

  const updateIndividualServiceItemTemplate = (updatedServiceItemTemplateProperties: Partial<ServiceItemTemplatesModel>) => {
    setServiceItemTemplates(
      serviceItemTemplates!.map((serviceItemTemplate, index) => {
        if (index !== currentEditingServiceTemplateIndex) {
          return serviceItemTemplate;
        }

        return Object.assign({}, serviceItemTemplate, updatedServiceItemTemplateProperties);
      })
    );
  };

  const deleteIndividualServiceItemTemplate = (serviceItemTemplateIndex: number) => {
    serviceItemTemplates.splice(serviceItemTemplateIndex, 1);
    setServiceItemTemplates([...serviceItemTemplates]);
    setCount(c => c - 1);
  };

  return (
    <Fragment>
      <Grid container justify='space-between'>
        <SearchInput
          withBorder
          withTransition={false}
          width={150}
          placeHolder='Search Service...'
          iconColor='#989898'
          tableSearchValue={query}
          setTableSearchValue={setQuery}
        />
        <Button
          color='primary'
          size='medium'
          variant='outlined'
          className={classes.addButton}
          onClick={() => {
            handleOpenCreateServiceItemTemplate();
          }}
        >
          <AddIcon className={classes.extendedIcon} />
          New Task
        </Button>
      </Grid>
      <ServiceTable
        isLoadingData={isSearchingServiceItemTemplate}
        serviceItemTemplates={serviceItemTemplates}
        count={count}
        setOpenSnackbar={setOpenSnackbar}
        setSnackbarVarient={setSnackbarVarient}
        handleSetMessageSuccess={handleSetMessageSuccess}
        handleSetMessageError={handleSetMessageError}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, page) => setCurrentPage(page)}
        handleChangeRowsPerPage={event => performActionAndRevertPage(setRowsPerPage, +event.target.value)}
        openCreateServiceItemTemplate={openCreateServiceItemTemplate}
        handleCancelCreateServiceItemTemplate={handleCancelCreateServiceItemTemplate}
        addNewServiceItemTemplate={addNewServiceItemTemplate}
        deleteIndividualServiceItemTemplate={deleteIndividualServiceItemTemplate}
        openEditServiceItemTemplate={openEditServiceItemTemplate}
        serviceItemTemplate={serviceItemTemplates[currentEditingServiceTemplateIndex]}
        currentEditingServiceTemplateIndex={currentEditingServiceTemplateIndex}
        handleOpenEditServiceItemTemplate={handleOpenEditServiceItemTemplate}
        handleCancelEditServiceItemTemplate={handleCancelEditServiceItemTemplate}
        updateIndividualServiceItemTemplate={updateIndividualServiceItemTemplate}
      />
      <ActionSnackbar
        variant={snackbarVarient}
        message={snackbarVarient === 'success' ? messageSuccess : messageError}
        open={openSnackbar}
        handleClose={handleCloseSnackbar}
        Icon={snackbarVarient === 'success' ? CheckCircleIcon : ErrorIcon}
      />
    </Fragment>
  );
};

export default ServicesPage;
