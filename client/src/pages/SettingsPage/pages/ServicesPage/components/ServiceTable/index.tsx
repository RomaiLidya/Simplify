import React, { FC, useState, useEffect, useCallback } from 'react';
import { createStyles, makeStyles, Table, TableBody, TableHead } from '@material-ui/core';
import axios, { CancelTokenSource } from 'axios';

import CreateEditServiceForm from './components/CreateEditServiceForm';

import HeaderRow from 'components/HeaderRow';
import BodyRow from './components/BodyRow';
import TablePagination from 'components/TablePagination';
import { SERVICE_ITEM_TEMPLATE_BASE_URL, GET_EDIT_SERVICE_ITEM_TEMPLATE_URL } from 'constants/url';

interface Props {
  isLoadingData: boolean;
  serviceItemTemplates: ServiceItemTemplatesModel[];
  count: number;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  handleSetMessageSuccess: (message: string) => void;
  handleSetMessageError: (message: string) => void;
  currentPage: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  openCreateServiceItemTemplate: boolean;
  handleCancelCreateServiceItemTemplate(): void;
  openEditServiceItemTemplate: boolean;
  serviceItemTemplate?: ServiceItemTemplatesModel;
  currentEditingServiceTemplateIndex: number;
  handleOpenEditServiceItemTemplate: (serviceItemTemplateIndex: number) => React.MouseEventHandler;
  handleCancelEditServiceItemTemplate(): void;
  addNewServiceItemTemplate(serviceItemTemplate: ServiceItemTemplatesModel): void;
  updateIndividualServiceItemTemplate: (updatedServiceItemTemplateProperties: Partial<ServiceItemTemplatesModel>) => void;
  deleteIndividualServiceItemTemplate: (serviceItemTemplateIndex: number) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    tableWrapper: {
      overflowX: 'auto'
    }
  })
);

const ServiceTable: FC<Props> = props => {
  const classes = useStyles();
  let cancelTokenSource: CancelTokenSource;

  const {
    isLoadingData,
    serviceItemTemplates,
    count,
    setOpenSnackbar,
    setSnackbarVarient,
    handleSetMessageSuccess,
    handleSetMessageError,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    openCreateServiceItemTemplate,
    handleCancelCreateServiceItemTemplate,
    openEditServiceItemTemplate,
    serviceItemTemplate,
    currentEditingServiceTemplateIndex,
    handleOpenEditServiceItemTemplate,
    handleCancelEditServiceItemTemplate,
    addNewServiceItemTemplate,
    updateIndividualServiceItemTemplate,
    deleteIndividualServiceItemTemplate
  } = props;

  const dummyService: ServiceItemTemplatesModel = {
    id: 0,
    name: '',
    description: '',
    unitPrice: 0
  };

  const [isLoading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<number>(0);

  const [nameError, setNameError] = useState<string>('');

  const resetInputFormValues = () => {
    setName('');
    setDescription('');
    setUnitPrice(0);
  };

  const resetEditFormValues = useCallback(() => {
    if (!serviceItemTemplate) {
      return;
    }

    const { name, description, unitPrice } = serviceItemTemplate;

    setName(name);
    setDescription(description === null ? '' : description);
    setUnitPrice(unitPrice);
  }, [serviceItemTemplate]);

  // The below logic introduces a 500ms delay for showing the skeleton
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  useEffect(() => {
    if (!openEditServiceItemTemplate) {
      let timeout: NodeJS.Timeout;

      if (isLoadingData) {
        timeout = setTimeout(() => {
          setShowSkeleton(true);
        }, 500);
      }

      setShowSkeleton(false);
      resetInputFormValues();
      clearFormErrors();

      return () => {
        clearTimeout(timeout);
      };
    } else {
      resetEditFormValues();
      clearFormErrors();
    }
  }, [openEditServiceItemTemplate, isLoadingData, resetEditFormValues]);

  const handleCloseCreateServiceItemTemplate = () => {
    handleCancelCreateServiceItemTemplate();
    resetInputFormValues();
    clearFormErrors();
  };

  const handleCloseEditServiceItemTemplate = () => {
    handleCancelEditServiceItemTemplate();
    resetInputFormValues();
    clearFormErrors();
  };

  const clearFormErrors = () => {
    setNameError('');
  };

  const validateForm = () => {
    let ret = true;
    clearFormErrors();

    if (!name || !name.trim()) {
      setNameError('Please enter task name');
      ret = false;
    }

    return ret;
  };

  const handleOnSubmit: React.FormEventHandler = async event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      cancelTokenSource = axios.CancelToken.source();
      if (!openEditServiceItemTemplate) {
        const response = await axios.post(
          `${SERVICE_ITEM_TEMPLATE_BASE_URL}`,
          {
            name,
            description,
            unitPrice
          },
          { cancelToken: cancelTokenSource.token }
        );
        addNewServiceItemTemplate(response.data);
        handleSetMessageSuccess('Successfully added new service item');
      } else {
        const response = await axios.put(
          `${GET_EDIT_SERVICE_ITEM_TEMPLATE_URL(serviceItemTemplate!.id)}`,
          {
            name,
            description,
            unitPrice
          },
          { cancelToken: cancelTokenSource.token }
        );
        updateIndividualServiceItemTemplate(response.data);
        handleSetMessageSuccess('Successfully edited a service item');
      }
      setSnackbarVarient('success');
      setOpenSnackbar(true);
      !openEditServiceItemTemplate ? handleCloseCreateServiceItemTemplate() : handleCloseEditServiceItemTemplate();
    } catch (err) {
      if (!openEditServiceItemTemplate) {
        handleSetMessageError('Failed to add a new service item');
      } else {
        handleSetMessageError('Failed to edit a service item');
      }
      setSnackbarVarient('error');
      setOpenSnackbar(true);
      console.log(`err:${err}`);
      const { errorCode } = err.data;

      console.log(`errorCode:${errorCode}`);
    }

    setLoading(false);
  };

  // headerNameWithPaddings['headerName:pL:pR:pT:pB']
  return (
    <div className={classes.tableWrapper}>
      <Table>
        <TableHead>
          <HeaderRow
            headers={[
              { label: 'Task Name' },
              { label: 'Description' },
              { label: 'Cost' },
              { label: 'Action', pL: '110px', pR: '0px', pT: '0px', pB: '0px' }
            ]}
          />
        </TableHead>
        <TableBody>
          {openCreateServiceItemTemplate && (
            <CreateEditServiceForm
              name={name}
              setName={setName}
              nameError={nameError}
              description={description}
              setDescription={setDescription}
              unitPrice={unitPrice}
              setUnitPrice={setUnitPrice}
              isSubmitting={isLoading}
              onSubmit={handleOnSubmit}
              onCancel={handleCloseCreateServiceItemTemplate}
              primaryButtonLabel={'Save'}  
            />
          )}
          {showSkeleton
            ? [1, 2, 3, 4, 5].map(index => (
                <BodyRow
                  index={index}
                  key={index}
                  serviceItemTemplate={dummyService}
                  setOpenSnackbar={setOpenSnackbar}
                  setSnackbarVarient={setSnackbarVarient}
                  handleSetMessageSuccess={handleSetMessageSuccess}
                  handleSetMessageError={handleSetMessageError}
                  deleteIndividualServiceItemTemplate={deleteIndividualServiceItemTemplate}
                  onEditServiceItemTemplate={handleOpenEditServiceItemTemplate(index)}
                  isLoadingData={isLoadingData}
                />
              ))
            : serviceItemTemplates.map((serviceItemTemplate, index) =>
                openEditServiceItemTemplate && currentEditingServiceTemplateIndex === index ? (
                  <CreateEditServiceForm
                    key={serviceItemTemplate.id}
                    name={name}
                    setName={setName}
                    nameError={nameError}
                    description={description}
                    setDescription={setDescription}
                    unitPrice={unitPrice}
                    setUnitPrice={setUnitPrice}
                    isSubmitting={isLoading}
                    onSubmit={handleOnSubmit}
                    onCancel={handleCloseEditServiceItemTemplate}
                    primaryButtonLabel={'Save'}
                    customBackground={'#F4F9FC'}
                  />
                ) : (
                  <BodyRow
                    index={index}
                    key={serviceItemTemplate.id}
                    serviceItemTemplate={serviceItemTemplate}
                    setOpenSnackbar={setOpenSnackbar}
                    setSnackbarVarient={setSnackbarVarient}
                    handleSetMessageSuccess={handleSetMessageSuccess}
                    handleSetMessageError={handleSetMessageError}
                    deleteIndividualServiceItemTemplate={deleteIndividualServiceItemTemplate}
                    onEditServiceItemTemplate={handleOpenEditServiceItemTemplate(index)}
                    isLoadingData={isLoadingData}
                  />
                )
              )}
        </TableBody>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Table>
    </div>
  );
};

export default ServiceTable;
