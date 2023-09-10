import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Step1 } from './Steps/Step1';
import { Step3 } from './Steps/Step2';
import { notificationController } from '@app/controllers/notificationController';
import { Dates } from '@app/constants/Dates';
import { mergeBy } from '@app/utils/utils';
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { PayloadCreateUser, createCar } from '@app/api/table.api';
import { useMounted } from '@app/hooks/useMounted';
interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}
interface StepFormProps {
  handleSuccessCreate: () => void; // Replace with the actual prop type
}

export const StepForm: React.FC<StepFormProps> = (props) => {
  const {handleSuccessCreate} = props;
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [fields, setFields] = useState<FieldData[]>([
    { name: 'name', value: 'xe ...' },
    { name: 'numberPlate', value: 'V3-000.03' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const formLabels: FormValues = {
    name: "Tên",
    numberPlate: 'Biển số xe',
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      field: item.name,
      value: String(item.name === 'birthday' && item.value ? item.value.format('YYYY-MM-DD') : item.value),
    }));

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = () => {
    setIsLoading(true);

   // Create an empty payload object
const payload: PayloadCreateUser = {};

// Iterate through formValues and populate the payload object
formValues.forEach((item) => {
  // Check if the field in the item matches one of the fields in PayloadCreateUser
  if (item.field) {
    payload[item.field] = item.value;
  }
});
  console.log('payload', payload)
      createCar(payload).then((res) => {
        console.log("🚀 ~ file: StepForm.tsx:77 ~ createCar ~ res:", res)
        const rs = res.data;
        if (isMounted.current) {
          notificationController.success({
            message: 'Chúc mừng bạn',
            description: rs?.msg || "",
          });
          setIsLoading(false);
          handleSuccessCreate()
        }
      }).catch(err => {
        console.log("🚀 ~ file: StepForm.tsx:87 ~ createCar ~ err:", err)
        setIsLoading(false);
        notificationController.error({ message: err.message || err});
      })
    

    // setTimeout(() => {
    //   notificationController.success({ message: t('common.success') });
    //   setIsLoading(false);
    //   setCurrent(0);
    // }, 1500);
  };

  const steps = [
    {
      title: 'Thông tin xe',
    },
    {
      title: 'Xác nhận',
    },
  ];

  const formFieldsUi = [
    <Step1 key="1" />,
    <Step3 key="2" formValues={formValues} />,
  ];

  return (
    <BaseForm
      name="stepForm"
      form={form}
      fields={fields}
      onFieldsChange={(_, allFields) => {
        const currentFields = allFields.map((item) => ({
          name: Array.isArray(item.name) ? item.name[0] : '',
          value: item.value,
        }));
        const uniqueData = mergeBy(fields, currentFields, 'name');
        setFields(uniqueData);
      }}
    >
      <Steps size="small" current={current} items={steps} />

      <div>{formFieldsUi[current]}</div>
      <S.Row>
        {current > 0 && (
          <S.PrevButton type="default" onClick={() => prev()}>
            {"Quay lại"}
          </S.PrevButton>
        )}
        {current < steps.length - 1 && (
          <BaseButton type="primary" onClick={() => next()}>
            Kế tiếp
          </BaseButton>
        )}
        {current === steps.length - 1 && (
          <BaseButton type="primary" onClick={onFinish} loading={isLoading}>
            Tiến hành
          </BaseButton>
        )}
      </S.Row>
    </BaseForm>
  );
};
