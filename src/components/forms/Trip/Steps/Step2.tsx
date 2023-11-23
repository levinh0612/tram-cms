import * as S from '../StepForm.styles';

interface Field {
  name?: string;
  value: string;
}

interface Step3Props {
  formValues: Field[];
}

export const Step3: React.FC<any> = ({ formValues, price, locationData,stageData, driverData }) => {
  const translateVi = (id: number) => {
    const findItem = locationData.find((item: any) => item.id == id);
    if (findItem) {
      return `${findItem.vi_name} - (${findItem.en_name})`;
    }
    return '';
  }
  return (
    <S.Details key="4">
      {formValues
        .filter((item: { value: any; }) => !!item.value)
        .map((item: Field, index: number) => {
          const stageTarget = stageData.find((stage:any) => stage.key == item.value);
          console.log("🚀 ~ file: Step2.tsx:26 ~ stageData:", stageData)
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
          } else {
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
