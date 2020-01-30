import React, { FC, Fragment, useState } from 'react';
import useCurrentPageTitleUpdater from 'hooks/useCurrentPageTitleUpdater';
import CustomizedTabs from 'components/CustomizedTabs';
import SMSContent from './SMSContent';
import GeneralContent from './GeneralContent';
 

interface Props {
  isLoadingData: boolean;
  setOpen: boolean;
  open: boolean;
  setActiveStep: number;
  user: UserDetailsModel;
  updateUser: (updatedUserProperties: Partial<UserDetailsModel>) => void;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarVarient: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
  onEditUser: React.MouseEventHandler;
}

const NotificationPage: FC = () => {
  useCurrentPageTitleUpdater('Notification');

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isLoadingData] = useState<boolean>(false);
  const performActionAndRevertPage = (action: React.Dispatch<React.SetStateAction<any>>, actionParam: any) => {
    action(actionParam);
  };

  const SelectedContent: FC<{ page: number }> = props => {
    switch (props.page) {
      case 0:
        return (
        <SMSContent isLoadingData={isLoadingData} />);
        
      case 1:
        return <div>Email In Here</div>;
      case 2:
        return <GeneralContent isLoadingData={isLoadingData} />;

      default:
        return <div />;
    }
  };

  return (
    <Fragment>
      <CustomizedTabs
        tabs={[{ id: 0, name: 'SMS' }, { id: 1, name: 'E-Mail' }, { id: 2, name: 'General' }]}
        selectedTabId={selectedTab}
        onSelect={(tabId: number) => performActionAndRevertPage(setSelectedTab, tabId)}
      />
      <SelectedContent page={selectedTab} />

      
    </Fragment>
  );
};

export default NotificationPage;
