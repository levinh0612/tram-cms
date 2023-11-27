import * as S from '../StepForm.styles';
import moment from 'moment';
interface Field {
  name?: string;
  value: string;
}

interface Step3Props {
  formValues: Field[];
}

export const Step3: React.FC<any> = ({ formValues, price, locationData,stageData, driverData }) => {
 console.log("🚀 ~ file: Step2.tsx:13 ~ formValues:", formValues)
 
  return (
    <S.Details key="4">
      {formValues
        .filter((item: { value: any; }) => !!item.value)
        .map((item: Field, index: number) => {
          const stageTarget = stageData.find((stage:any) => stage.key == item.value);
          const driverTarget = driverData.find((stage:any) => stage.id == item.value);
          if(item.name === 'Tuyến xe' && stageTarget){
            return (
              <S.DetailsRow key={index}>
                <S.DetailsTitle>{item.name}</S.DetailsTitle>
                <S.DetailsValue>{stageTarget.from_location_name} - {stageTarget.to_location_name}</S.DetailsValue>
              </S.DetailsRow>
            );
          } else if(item.name === 'Tài xế' && driverTarget) {
            
            return (
              <S.DetailsRow key={index}>
                <S.DetailsTitle>{item.name}</S.DetailsTitle>
                <S.DetailsValue>{driverTarget.first_name} {driverTarget.last_name}</S.DetailsValue>
              </S.DetailsRow>
            );
          } else if(item.name === 'Thời gian khởi hành') {
            return (
              <S.DetailsRow key={index}>
                <S.DetailsTitle>{item.name}</S.DetailsTitle>
                <S.DetailsValue>{moment(item.value).format('DD-MM-YYYY HH:mm:ss')}</S.DetailsValue>
              </S.DetailsRow>
            );
          } 
          else {
            return (
              <S.DetailsRow key={index}>
                <S.DetailsTitle>{item.name}</S.DetailsTitle>
                <S.DetailsValue>{item.value}</S.DetailsValue>
              </S.DetailsRow>
            );
          }
        })}
    </S.Details>
  );
};
