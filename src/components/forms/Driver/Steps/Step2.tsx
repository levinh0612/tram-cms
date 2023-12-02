import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseRadio } from '@app/components/common/BaseRadio/BaseRadio';
import { BaseDatePicker } from '@app/components/common/pickers/BaseDatePicker';
import * as S from '../StepForm.styles';
import React from 'react';
import styled from 'styled-components';

const Picker = styled(BaseDatePicker)`
  width: 100%;
`;

export const Step2: React.FC = () => {
  const { t } = useTranslation();


  return (
    <S.FormContent>
      
      <BaseForm.Item
        name="gender"
        label={t('forms.stepFormLabels.gender')}
        rules={[{ required: true, message: t('common.requiredField') }]}
      >
        <BaseRadio.Group>
          <BaseRadio.Button value="female" defaultChecked>Nam</BaseRadio.Button>
          <BaseRadio.Button value="male">Nữ</BaseRadio.Button>
        </BaseRadio.Group>
        {/* <BaseSelect placeholder={t('forms.stepFormLabels.gender')}>
          <Option value="male">{t('forms.stepFormLabels.male')}</Option>
          <Option value="female">{t('forms.stepFormLabels.female')}</Option>
        </BaseSelect> */}
      </BaseForm.Item>
      <BaseForm.Item
        name="firstName"
        label={t('common.firstName')}
        rules={[{ required: true, message: 'Vui lòng nhập tên!' },{ max: 30, message: 'Tên tối đa là 30 ký tự!' }]}
      >
        <BaseInput />
      </BaseForm.Item>
      <BaseForm.Item
        name="lastName"
        label={t('common.lastName')}
        rules={[{ required: true, message: 'Vui lòng nhập họ!' },{ max: 20, message: 'họ tối đa là 20 ký tự!' }]}      >
        <BaseInput />
      </BaseForm.Item>
      <BaseForm.Item
        name="birthday"
        label={t('forms.stepFormLabels.birthday')}
        rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' },
        {type: 'date', message: 'Vui lòng nhập ngày sinh hợp lệ!' }
      ]}
      >
        <Picker format="DD-MM-YYYY" />
      </BaseForm.Item>
      <BaseForm.Item
        name="address"
        label={`${t('common.address')}`}
        rules={[{ required: true, message: t('forms.stepFormLabels.addressError') }]}
      >
        <BaseInput />
      </BaseForm.Item>
    </S.FormContent>
  );
};
