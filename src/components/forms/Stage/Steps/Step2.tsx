import * as S from '../StepForm.styles';

interface Field {
  name?: string;
  value: string;
}

interface Step3Props {
  formValues: Field[];
}

export const Step3: React.FC<any> = ({ formValues, price, locationData }) => {
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
          return (
            <S.DetailsRow key={index}>
              <S.DetailsTitle>{item.name}</S.DetailsTitle>
              <S.DetailsValue>{translateVi(Number(item.value)) || item.value}</S.DetailsValue>
            </S.DetailsRow>
          );
        })}
      <S.DetailsRow>
        <S.DetailsTitle>Giá</S.DetailsTitle>
        <S.DetailsTitle>{price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</S.DetailsTitle>
      </S.DetailsRow>
    </S.Details>
  );
};
