import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { notificationController } from '@app/controllers/notificationController';
import { Dates } from '@app/constants/Dates';
import { mergeBy } from '@app/utils/utils';
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { PayloadCreateUser, createUser } from '@app/api/table.api';
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
    { name: 'username', value: 'usertest2' },
    { name: 'gender', value: 'female' },
    { name: 'firstName', value: 'User 2' },
    { name: 'lastName', value: 'Test' },
    { name: 'birthday', value: Dates.getDate(new Date("2000-12-06").toISOString()) },
    { name: 'phone', value: '0396556780' },
    { name: 'email', value: 'usertest@gmail.com' },
    { name: 'address', value: 'SG' },
    { name: 'prefix', value: '+84' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const formLabels: FormValues = {
    username: "Tên đăng nhập",
    gender: t('forms.stepFormLabels.gender'),
    firstName: t('common.firstName'),
    lastName: t('common.lastName'),
    birthday: t('forms.stepFormLabels.birthday'),
    phone: t('common.phone'),
    email: t('common.email'),
    address: `${t('common.address')}`,
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
      createUser(payload).then((res) => {
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
      title: t('common.country'),
    },
    {
      title: t('forms.stepFormLabels.info'),
    },
    {
      title: t('forms.stepFormLabels.confirm'),
    },
  ];

  const formFieldsUi = [
    <Step1 key="1" />,
    <Step2 key="2" />,
    <Step3 key="3" formValues={formValues} />,
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
