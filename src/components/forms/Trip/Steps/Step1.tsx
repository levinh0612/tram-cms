import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput} from '@app/components/common/inputs/BaseInput/BaseInput';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseSelect, Option  } from '@app/components/common/selects/BaseSelect/BaseSelect';

import * as S from '../StepForm.styles';
import { useEffect, useState } from 'react';
import { BaseDatePicker } from '@app/components/common/pickers/BaseDatePicker';
import styled from 'styled-components';

const Picker = styled(BaseDatePicker)`
  width: 100%;
`;
export const Step1: React.FC<any> = (props) => {
  const {stageData, formValues, price, setPrice, driverData} = props;
  const { t } = useTranslation();
  const [errMess, setErrMess] = useState<string>('');
  const [mess, setMess] = useState<string>('');
  const numberRegex = /^-?\d+(\.\d+)?$/;

  return (
    <S.FormContent>
      <BaseForm.Item
        name="stageId"
        label={"Chọn tuyến đi"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }]}
      >
          <BaseSelect >
            {
              stageData.map((item: any) => {
                return (
                  <Option key={item.key} value={item.key}>{ "#" + item.key + "| "+ item.from_location_name + " - " + item.to_location_name }</Option>
                )
              })
            }
        </BaseSelect>
      </BaseForm.Item>

      <BaseForm.Item
        name="startTime"
        label={'Thời gian khởi hành'}
        rules={[{ required: true, message: 'Vui lòng nhập thời gian khởi hành!'}
        ]}
      >
        <Picker format="DD-MM-YYYY HH:mm:ss" />
      </BaseForm.Item>

      <BaseForm.Item
        name="driverId"
        label={"Chọn tài xế"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }]}
      >
          <BaseSelect >
            {
              driverData.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id} style={{color: item.gender ==='male' ? '#FF00FF' : '#00FFFF'}}>{`${item.first_name} ${item.last_name}`}</Option>
                )
              })
            }
        </BaseSelect>
      </BaseForm.Item>

      <BaseForm.Item
        name="countSlot"
        label={"Số lượng chỗ"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }, {
          pattern: numberRegex, message: 'Vui nhập SL hợp lệ!'
        }]}
      >
          <BaseInput />
      </BaseForm.Item>
      <p>{errMess || mess || ""}</p>
    </S.FormContent>
  );
};
