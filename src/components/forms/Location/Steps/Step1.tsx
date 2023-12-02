import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';

import * as S from '../StepForm.styles';

export const Step1: React.FC = () => {
  const { t } = useTranslation();
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  const coordinateRegex = /^-?\d+(\.\d+)?$/;

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
        rules={[{ required: true, message: "Vui là nhập giờ mở cửa!" }, { 
        pattern: timeRegex, message: 'Vui là nhập giờ mở cửa hợp lệ!' }]}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="closedAt"
        label={"Giờ đóng cửa"}
        rules={[{ required: true, message: "Vui là nhập giờ đóng cửa!" }, {
        pattern: timeRegex, message: 'Vui là nhập giờ đóng cửa hợp lệ!' }]}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="x"
        label={"Toạ độ x"}
        rules={[{ pattern: coordinateRegex, message: "Vui là nhap toa do x!" }]}
      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="y"
        label={"Toạ độ y"}
        rules={[{ pattern: coordinateRegex, message: "Vui là nhap toa do x!" }]}

      >
        <BaseInput />
      </BaseForm.Item>

      <BaseForm.Item
        name="z"
        label={"Toạ độ z"}
        rules={[{ pattern: coordinateRegex, message: "Vui là nhap toa do x!" }]}

      >
        <BaseInput />
      </BaseForm.Item>
      
    </S.FormContent>
  );
};
