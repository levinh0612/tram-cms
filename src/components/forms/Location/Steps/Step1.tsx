import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

import * as S from '../StepForm.styles';

export const Step1: React.FC = () => {
  const { t } = useTranslation();

  return (
    <S.FormContent>
      <BaseForm.Item
        name="viName"
        label={"Tên tiếng việt"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }]}
      >
        <BaseInput />
      </BaseForm.Item>
      <BaseForm.Item
        name="enName"
        label={"Tên tiếng anh"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }]}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="startedAt"
        label={"Giờ mở cửa"}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="closedAt"
        label={"Giờ đóng cửa"}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="x"
        label={"Toạ độ x"}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="y"
        label={"Toạ độ y"}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="z"
        label={"Toạ độ z"}
      >
        <BaseInput />
      </BaseForm.Item>
      
    </S.FormContent>
  );
};
