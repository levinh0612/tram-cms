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
import { PayloadCreateUser, createTrip, editTrip } from '@app/api/table.api';
import { useMounted } from '@app/hooks/useMounted';
import moment from 'moment';
import dayjs from 'dayjs';
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
  stageData?: any;
  driverData?: any;
  handleSuccessEdit: () => void;
  modeEdit?: boolean;
  oldTrip?: any;
}

export const StepForm: React.FC<StepFormProps> = (props) => {
  const {handleSuccessCreate, stageData, driverData, handleSuccessEdit, modeEdit, oldTrip} = props;
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [price, setPrice] = useState<number>(0);
  const [fields, setFields] = useState<FieldData[]>([
    { name: 'stageId', value: oldTrip?.stage_id || ""},
    { name: 'startTime', value: oldTrip?.started_at ? dayjs(oldTrip?.started_at, 'DD/MM/YYYY HH:mm:ss') : dayjs().add(1, 'day') },
    { name: 'driverId', value: oldTrip?.driver_id ||'' },
    { name: 'countSlot', value: oldTrip?.total_slot_trip || '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { isMounted } = useMounted();

  const formLabels: FormValues = {
    stageId: 'Tuyến xe',
    startTime: "Thời gian khởi hành",
    driverId: 'Tài xế',
    countSlot: "Tổng số chỗ ngồi"
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
    if (!modeEdit) {
      createTrip(payload).then((res) => {
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
        notificationController.error({ message: err.message || err });
      })
    } else {
      editTrip({...payload, id: oldTrip?.key}).then((res) => {
        const rs = res.data;
        if (isMounted.current) {

          notificationController.success({
            message: 'Chúc mừng bạn',
            description: rs?.msg || "",
          });
          setIsLoading(false);
          handleSuccessEdit();
        }
      }).catch(err => {
        console.log('3')

        setIsLoading(false);
        notificationController.error({ message: err.message || err });
      })
    }
  };

  const steps = [
    {
      title: 'Thông tin chuyến xe',
    },
    {
      title: 'Xác nhận',
    },
  ];

  const formFieldsUi = [
    <Step1 key="1" stageData={stageData} formValues={formValues} driverData={driverData} oldTrip={oldTrip}/>,
    <Step3 key="2" stageData={stageData} formValues={formValues} driverData={driverData}/>,
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
