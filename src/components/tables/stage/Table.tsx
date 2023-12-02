import React, { useEffect, useState, useCallback } from 'react';
import { CarTableRow, getBasicTableData, getLocationTableData, Pagination, Tag, lockUnlockLocation, StageTableRow, editLocation, getStageTableData } from 'api/table.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority, defineColorByStatus, urlDefaultImgDriver, vietsub } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseModal } from '@app/components/common/BaseModal/BaseModal';
import { BaseAvatar } from '@app/components/common/BaseAvatar/BaseAvatar';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { ManOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { StepForm } from '@app/components/forms/Stage/StepForm';
import { StepForm as TripStepForm } from '@app/components/forms/Trip/StepForm';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { SearchInput } from '@app/components/common/inputs/SearchInput/SearchInput.styles';
import styled from 'styled-components';
import Typography from 'antd/lib/typography/Typography';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { useNavigate } from 'react-router-dom';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const Table: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: StageTableRow[]; pagination: Pagination; loading: boolean, locationData: any }>({
    data: [],
    pagination: initialPagination,
    loading: false,
    locationData: []
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const { mobileOnly } = useResponsive();
  const [editingKey, setEditingKey] = useState(0);
  const [form] = BaseForm.useForm();
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [openDialogCreateTrip, setOpenDialogCreateTrip] = useState<boolean>(false);
  const [modeCreate, setModeCreate] = useState<boolean>(false);
  const [choosenRecord, setChoosenRecord] = useState<StageTableRow | undefined>();
  const [newLoc, setNewLoc] = useState<any>();
  const [stageChoose, setStageChoose] = useState<any>();
  const [newStage, setNewStage] = useState<any>();
  const [modeUpdate, setModeUpdate] = useState<boolean>();

  const navigate = useNavigate();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getStageTableData(pagination).then((res) => {
        const rs = res.data;
        if (isMounted.current) {
          setTableData({ data: rs.data, pagination: rs.pagination, loading: false, locationData: rs.locationData });
        }
      }).catch(err => {
        BaseModal.error({
          title: "Có lỗi xảy ra",
          content: err,
          onOk: () => {
            setTableData({ ...tableData, loading: false });
          }
        });
      })
    },
    [isMounted],
  );

  const CategoryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
  const Link = styled.a`
float: right;
`;

  const renderTitle = (title: string) => (
    <span>
      {title}
      <Link href="https://www.google.com/search?q=antd" target="_blank" rel="noopener noreferrer">
        more
      </Link>
    </span>
  );

  const renderItem = (title: string, count: number) => ({
    value: title,
    label: (
      <CategoryWrapper>
        {title}
        <span>
          <UserOutlined /> {count}
        </span>
      </CategoryWrapper>
    ),
  });

  const apiLockUnlock =
    () => {
      let action = "";
      const id = choosenRecord?.key;
      if (choosenRecord?.is_locked === 0) {
        action = 'lock';
      } else {
        action = 'unlock';
      }

      setTableData((tableData) => ({ ...tableData, loading: true }));
      lockUnlockLocation(action, id).then((res) => {
        const rs = res.data;
        if (isMounted.current) {

          setTableData({ ...tableData, loading: false });
          notificationController.success({
            message: 'Chúc mừng bạn',
            description: choosenRecord?.is_locked === 0 ? `Đã khoá thành công địa điểm ${rs}` : `Đã mở khoá thành công địa điểm ${rs}`,
          });
          fetch(tableData.pagination);
          setOpenDialogConfirm(false);

        }
      }).catch(err => {
        notificationController.error({ message: err.message });
        setTableData({ ...tableData, loading: false });
        setOpenDialogConfirm(false)

      })
    }


  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
  };

  const handleSuccessCreate = () => {
    setModeCreate(false)
    fetch(initialPagination);
  }

  const handleSuccessUpdate = () => {
    setModeUpdate(false)
    fetch(initialPagination);
  }

  const handleSuccessCreateTrip = () => {
    setOpenDialogCreateTrip(false)
    navigate('/trips')
  }

  const handleDeleteRow = (rowId: number) => {
    setTableData({
      ...tableData,
      data: tableData.data.filter((item) => item.key !== rowId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
  };

  const isEditing = (record: StageTableRow) => record.key === editingKey;

  const edit = (record: Partial<CarTableRow> & { key: React.Key }) => {
    // form.setFieldsValue({ name: '', number_plate: '', ...record });
    // setEditingKey(record.key);
    setNewStage(record)
    setModeUpdate(true)
  };

  const createTrip = (record: Partial<StageTableRow> & { key: React.Key }) => {
    setOpenDialogCreateTrip(true);
    setStageChoose(record)
  }

  const cancel = () => {
    setEditingKey(0);
  };
  
  const save = async (key: React.Key) => {
    try {
      
      await editLocation(newLoc)
        .then(res=> {
          const newData = [...tableData.data];
          const index = newData.findIndex((item) => res?.data === item.key);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...newLoc,
            });
            setTableData({ ...tableData, data: newData });
          }
          notificationController.success({
            message: 'Chúc mừng bạn',
            description: `Đã thay đổi thành công thông tin địa điểm`,
          });
        })
        .catch(err => {
          BaseModal.error({
            title: "Có lỗi xảy ra",
            content: err,
            onOk: () => {
              setTableData({ ...tableData, loading: false });
            }
          });
        })
      // setTableData({ ...tableData, data: newData });
      setEditingKey(0);
    } catch (errInfo) {
      BaseModal.error({
        title: "Có lỗi xảy ra",
        onOk: () => {
          setTableData({ ...tableData, loading: false });
        }
      });
    }
  };

  const columns: ColumnsType<StageTableRow> = [
    {
      title: 'Điểm đi',
      dataIndex: 'from_location_name',
      width: 200,
      render: (property: any, record: StageTableRow) => {
        const editable = isEditing(record);
        return (
            <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p>{record?.from_location_name} </p>
              </BaseCol>
            </BaseRow>
        )
      }
    },
    {
      title: 'Điểm đến',
      dataIndex: 'to_location_name',
      width: 200,
      render: (status: any, record: StageTableRow) => {
        return (
         
            <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p>
                  {
                    record?.to_location_name
                  }
                </p>
              </BaseCol>
            </BaseRow>
          )
      }
    },
    {
      title: 'Giá',
      dataIndex: 'x',
      width: 200,
      render: (status: any, record: StageTableRow) => {
        const editable = isEditing(record);

        return (
          

            <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p>
                  {
                    record.price ? (
                      `${Number(record.price).toLocaleString('it-IT', {style : 'currency', currency : 'VND'})} `
                    ) : (
                      'Chưa có'
                    )
                  }
                </p>
              </BaseCol>
            </BaseRow>
          )
      }
    },
    {
      title: t('common.status'),
      key: 'status',
      dataIndex: 'status',
      width: 200,
      render: (status: any, record: StageTableRow) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol >
            {
              record.is_locked === 1 ? (
                <Status color={"red"} text={"Bị khoá"} />
              ) : (
                <Status color={"green"} text={"Hoạt động"} />
              )
            }
          </BaseCol>

        </BaseRow>
      ),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: 250,
      render: (text: string, record: StageTableRow) => {
        const editable = isEditing(record);

        return (
          <BaseSpace>
            {
              editable ? (
                <>
                  <BaseButton type="primary" onClick={() => save(record.key)}>
                    Lưu
                  </BaseButton>
                  <BasePopconfirm title={'Huỷ'} onConfirm={cancel}>
                    <BaseButton type="ghost">Huỷ</BaseButton>
                  </BasePopconfirm>
                </>
              ) : (

                <>
                  {/* {
                    record.is_locked === 0 ? (
                      <BaseButton
                        type="ghost"
                        danger
                        onClick={() => {
                          setChoosenRecord(record)
                          setOpenDialogConfirm(true)
                        }}
                      >
                        Khoá
                      </BaseButton>
                    ) : (
                      <BaseButton
                        type="ghost"
                        onClick={() => {
                          setChoosenRecord(record)
                          setOpenDialogConfirm(true)
                        }}
                      >
                        Mở khoá
                      </BaseButton>
                    )
                  } */}
                   {/* <BaseButton type="ghost" disabled={editingKey !== 0} onClick={() => createTrip(record)}>
                    Tạo chuyến xe
                  </BaseButton> */}
                  <BaseButton type="ghost" disabled={editingKey !== 0} onClick={() => edit(record)}>
                    Cập nhật
                  </BaseButton>
                </>

              )
            }
            {/* <BaseButton type="default" danger onClick={() => handleDeleteRow(record.key)}>
              {t('tables.delete')}
            </BaseButton> */}
          </BaseSpace>
        );
      },
    },
  ];

  return (
    <>
      {
        openDialogConfirm && (
          <BaseModal
            size='small'
            style={{ color: choosenRecord?.is_locked === 0 ? 'red' : '' }}
            title={"Bạn có chắc"}
            centered
            open={openDialogConfirm}
            okText={"Đồng ý"}
            cancelText={"Hủy"}
            onOk={apiLockUnlock}
            onCancel={() => setOpenDialogConfirm(false)}
          >
            <p>{choosenRecord?.is_locked === 0 ? "Khoá" : "Mở khoá"} {choosenRecord?.key}</p>

          </BaseModal>
        )
      }
      {
        (modeCreate || modeUpdate) && (
          <BaseModal
            size='medium'
            title={modeUpdate ? 'Cập nhật tuyến xe' : 'Tạo tuyến xe'}
            centered
            open={modeCreate || modeUpdate}
            onCancel={() => {
              setModeCreate(false)
              setModeUpdate(false)}
            }
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          // onOk={() => handleCreateUser()}
          // onCancel={() => setModeCreate(false)}
          >
            <BaseCard id="car-form" title={'Điền thông tin tuyến xe'} padding="1.25rem">
              <StepForm handleSuccessCreate={handleSuccessCreate} locationData={tableData?.locationData} handleSuccessUpdate={handleSuccessUpdate} newStage = {newStage} modeUpdate = {modeUpdate}/>
            </BaseCard>
          </BaseModal>
        )
      }
      {/* {
        openDialogCreateTrip && (
          <BaseModal
            size='medium'
            title={`Tạo chuyến xe cho tuyến ${stageChoose.from_location_name} - ${stageChoose.to_location_name}`}
            centered
            open={openDialogCreateTrip}
            onCancel={() => setOpenDialogCreateTrip(false)}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          // onOk={() => handleCreateUser()}
          // onCancel={() => setModeCreate(false)}
          >
            <BaseCard id="car-form" title={`Điền thông tin chuyến xe cho tuyến ${stageChoose.from_location_name} - ${stageChoose.to_location_name}`} padding="1.25rem">
              <TripStepForm handleSuccessCreate={handleSuccessCreateTrip} stageData={stageChoose}/>
            </BaseCard>
          </BaseModal>
        )
      } */}

      <BaseSpace style={{ margin: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        <BaseButton type='primary' onClick={() => setModeCreate(true)}>Thêm</BaseButton>
      </BaseSpace>
      <BaseTable
        columns={columns}
        dataSource={tableData.data.length ? tableData.data : []}
        pagination={tableData.pagination}
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800, y: 600 }}
        bordered
      />
    </>
  );
};
