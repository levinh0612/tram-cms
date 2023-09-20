import React from 'react';
import { Table } from '../location/Table';
import { useTranslation } from 'react-i18next';
import * as S from './Tables.styles';

export const Tables: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={t('tables.locationsList')} padding="1.25rem 1.25rem 0">
          <Table />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};
