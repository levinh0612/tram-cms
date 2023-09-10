import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tables } from '@app/components/tables/Tables/CarTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('common.cars')}</PageTitle>
      <Tables />
    </>
  );
};

export default Dashboard;
