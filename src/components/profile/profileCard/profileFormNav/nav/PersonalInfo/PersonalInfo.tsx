import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { FirstNameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/FirstNameItem/FirstNameItem';
import { LastNameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/LastNameItem/LastNameItem';
import { NicknameItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/NicknameItem/NicknameItem';
import { SexItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/SexItem/SexItem';
import { BirthdayItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/BirthdayItem/BirthdayItem';
import { LanguageItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/LanguageItem/LanguageItem';
import { PhoneItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/PhoneItem/PhoneItem';
import { EmailItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/EmailItem/EmailItem';
import { CountriesItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/CountriesItem/CountriesItem';
import { CitiesItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/CitiesItem/CitiesItem';
import { ZipcodeItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/ZipcodeItem/ZipcodeItem';
import { AddressItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/AddressItem/AddressItem';
import { WebsiteItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/WebsiteItem/WebsiteItem';
import { SocialLinksItem } from '@app/components/profile/profileCard/profileFormNav/nav/PersonalInfo/SocialLinksItem/SocialLinksItem';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Dates } from '@app/constants/Dates';
import { notificationController } from '@app/controllers/notificationController';
import { PaymentCard } from '@app/interfaces/interfaces';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

interface PersonalInfoFormValues {
  birthday?: string;
  last_name: string;
  country?: string;
  website: string;
  city?: string;
  address2: string;
  nickName: string;
  address1: string;
  address: string;
  sex?: string;
  facebook: string;
  language?: string;
  linkedin: string;
  zipcode: string;
  first_name: string;
  twitter: string;
  phone: string;
  email: string;
}

const initialPersonalInfoValues: PersonalInfoFormValues = {
  first_name: '',
  last_name: '',
  nickName: '',
  sex: undefined,
  birthday: undefined,
  language: undefined,
  phone: '',
  email: '',
  country: undefined,
  city: undefined,
  address: '',
  address1: '',
  address2: '',
  zipcode: '',
  website: '',
  twitter: '',
  linkedin: '',
  facebook: '',
};

export const PersonalInfo: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);

  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const userFormValues = useMemo(
    () =>
      user
        ? {
            fullname: user.fullname,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            nickname: user.username,
            sex: user.gender,
            birthday: Dates.getDate(user.birthday),
            language: user.lang,
            country: user.country,
            city: user.city,
            address1: user.address,
            address2: user?.address2,
            zipcode: user.zipcode,
            website: user?.website,
            twitter: user?.socials?.twitter,
            linkedin: user?.socials?.linkedin,
            facebook: user?.socials?.facebook,
          }
        : initialPersonalInfoValues,
    [user],
  );

  const [form] = BaseButtonsForm.useForm();

  const { t } = useTranslation();

  const onFinish = useCallback(
    (values: PaymentCard) => {
      // todo dispatch an action here
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setFieldsChanged(false);
        notificationController.success({ message: t('common.success') });
        console.log(values);
      }, 1000);
    },
    [t],
  );

  return (
    <BaseCard>
      <BaseButtonsForm
        form={form}
        name="info"
        loading={isLoading}
        initialValues={userFormValues}
        isFieldsChanged={isFieldsChanged}
        setFieldsChanged={setFieldsChanged}
        onFieldsChange={() => setFieldsChanged(true)}
        onFinish={onFinish}
      >
        <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>Thông tin</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <FirstNameItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <LastNameItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <NicknameItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <SexItem />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <BirthdayItem />
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>Thông tin liên lạc</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <PhoneItem  />
          </BaseCol>

          <BaseCol xs={24} md={12}>
            <EmailItem  />
          </BaseCol>

          <BaseCol span={24}>
            <BaseButtonsForm.Item>
              <BaseButtonsForm.Title>{t('common.address')}</BaseButtonsForm.Title>
            </BaseButtonsForm.Item>
          </BaseCol>

          <BaseCol xl={24} md={12}>
            <AddressItem number={1} />
          </BaseCol>


        </BaseRow>
      </BaseButtonsForm>
    </BaseCard>
  );
};
