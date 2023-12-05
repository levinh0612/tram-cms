import React from 'react';
import { useTranslation } from 'react-i18next';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';

export const SexItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BaseButtonsForm.Item name="sex" label={"Giới tính"}>
      <BaseSelect disabled>
        <Option value="male">
          <BaseSpace align="center">
            <ManOutlined />
            Nữ
          </BaseSpace>
        </Option>
        <Option value="female">
          <BaseSpace align="center">
            <WomanOutlined />
           Nam
          </BaseSpace>
        </Option>
      </BaseSelect>
    </BaseButtonsForm.Item>
  );
};
