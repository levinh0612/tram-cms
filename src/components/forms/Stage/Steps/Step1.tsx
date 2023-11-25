import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseInput} from '@app/components/common/inputs/BaseInput/BaseInput';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { BaseSelect, Option  } from '@app/components/common/selects/BaseSelect/BaseSelect';

import * as S from '../StepForm.styles';
import { useEffect, useState } from 'react';

export const Step1: React.FC<any> = (props) => {
  const {locationData, formValues, price, setPrice, newStage, modeUpdate} = props;
  const { t } = useTranslation();
  const [errMess, setErrMess] = useState<string>('');
  const [mess, setMess] = useState<string>('');

  function calculateDistance(valueA: any, valueB: any) {
      const  lat1= Number(valueA.x.trim());
      const  lon1= Number(valueA.y.trim());
       const lat2= Number(valueB.x.trim());
      const  lon2= Number(valueB.y.trim());

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance.toFixed(2);
  }
  useEffect(() => {
    console.log('locationData', locationData);
    
    const findItemFrom = (formValues.find((item: any) => item.field === 'fromLocation'));
    const findItemTo = (formValues.find((item: any) => item.field === 'toLocation'));
    const findItemPrice = (formValues.find((item: any) => item.field === 'price'));

    if(findItemFrom && findItemTo && findItemFrom.value  && findItemTo.value){
      if(findItemFrom.value === findItemTo.value) {
        setErrMess('Không được chọn nơi đến trùng với nơi đi!');
      } else {
        setErrMess("");
        const coordinatesFrom = locationData.find((item: any) => item.id == findItemFrom.value);
        const coordinatesTo = locationData.find((item: any) => item.id == findItemTo.value);
        const distance = calculateDistance(coordinatesFrom, coordinatesTo);
        setPrice(Number(distance) * 24000);
        setMess(`Khoảng cách: ${distance} km (24k/km) => Giá tiền: ${(Number(distance) * 24000).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`);
      }
    }
    return () => {
      setErrMess("")
      setMess("")
    }

  }, [formValues])
  console.log('newStage', newStage)
  return (
    <S.FormContent>
      <BaseForm.Item
        name="fromLocation"
        label={"Chọn nơi đi"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }]}
      >
          <BaseSelect defaultValue={13} value={13}>
            {
              locationData && locationData.length > 0 && locationData.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>{ "#" + item.id + "| "+ item.vi_name + " (" + item.en_name + ")"}</Option>
                )
              })
            }
        </BaseSelect>
      </BaseForm.Item>
            
      <BaseForm.Item
        name="toLocation"
        label={"Chọn nơi đến"}
        rules={[{ required: true, message: "Vui lòng điền vào!" }]}
      >
          <BaseSelect >
            {
              locationData.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>{ "#" + item.id + "| "+ item.vi_name + " (" + item.en_name + ")"}</Option>
                )
              })
            }
        </BaseSelect>
      </BaseForm.Item>
      <p>{errMess || mess || ""}</p>
    </S.FormContent>
  );
};
