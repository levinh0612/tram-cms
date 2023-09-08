import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseSelect, Option } from '@app/components/common/selects/BaseSelect/BaseSelect';

import * as S from '../StepForm.styles';

export const Step1: React.FC = () => {
  const { t } = useTranslation();

  const prefixSelector = (
    <BaseForm.Item name="prefix" noStyle>
      <S.Select>
        <Option value="+84">+84</Option>
      </S.Select>
    </BaseForm.Item>
  );

  return (
    <S.FormContent>
      <S.PhoneItem
        name="phone"
        label={t('common.phone')}
        rules={[{ required: true, message: t('forms.stepFormLabels.phoneError') }]}
      >
        <BaseInput addonBefore={prefixSelector} />
      </S.PhoneItem>
      <BaseForm.Item
        name="username"
        label={"Tên đăng nhập"}
        rules={[{ required: true, message: t('forms.stepFormLabels.loginError') }]}
      >
        <BaseInput />
      </BaseForm.Item>
      <BaseForm.Item
        name="email"
        label={t('common.email')}
        rules={[
          {
            type: 'email',
            message: t('common.notValidEmail'),
          },
        ]}
      >
        <BaseInput />
      </BaseForm.Item>
    </S.FormContent>
  );
};
