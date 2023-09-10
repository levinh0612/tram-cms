import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

import * as S from '../StepForm.styles';

export const Step1: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.FormContent>
      <BaseForm.Item
        name="name"
        label={"Tên"}
        rules={[{ required: true, message: t('forms.stepFormLabels.nameError') }]}
      >
        <BaseInput />
      </BaseForm.Item>
      <BaseForm.Item
        name="numberPlate"
        label={"Biển số xe"}
        rules={[{ required: true, message: t('forms.stepFormLabels.numberPlateError') }]}
      >
        <BaseInput />
      </BaseForm.Item>
    </S.FormContent>
  );
};
