import React, { useEffect, useState, useCallback } from 'react';
import { CarTableRow, getBasicTableData, getLocationTableData, Pagination, Tag, lockUnlockLocation, TripTableRow, editLocation, getTripTableData, DriverTableRow, changeDriverOfTrip } from 'api/table.api';
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
import { StepForm } from '@app/components/forms/Trip/StepForm';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { SearchInput } from '@app/components/common/inputs/SearchInput/SearchInput.styles';
import styled from 'styled-components';
import Typography from 'antd/lib/typography/Typography';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { Select } from 'antd';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const Table: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: TripTableRow[]; pagination: Pagination; loading: boolean, locationData: any }>({
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
  const [modeCreate, setModeCreate] = useState<boolean>(false);
  const [modeEdit, setModeEdit] = useState<boolean>(false);
  const [stageData, setStageData] = useState<any>();
  const [driverData, setDriverData] = useState<any>();
  const [choosenRecord, setChoosenRecord] = useState<TripTableRow | undefined>();
  const [newLoc, setNewLoc] = useState<any>();
  const [selectedOption, setSelectedOption] = useState(null);

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getTripTableData(pagination).then((res) => {
        const rs = res.data;
        if (isMounted.current) {
          setTableData({ data: rs.data, pagination: rs.pagination, loading: false, locationData: rs.locationData });
          setStageData(rs.stageData);
          setDriverData(rs.driverData);
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

  // const apiLockUnlock =
  //   () => {
  //     let action = "";
  //     const id = choosenRecord?.key;
  //     if (choosenRecord?.is_locked === 0) {
  //       action = 'lock';
  //     } else {
  //       action = 'unlock';
  //     }

  //     setTableData((tableData) => ({ ...tableData, loading: true }));
  //     lockUnlockLocation(action, id).then((res) => {
  //       const rs = res.data;
  //       if (isMounted.current) {

  //         setTableData({ ...tableData, loading: false });
  //         notificationController.success({
  //           message: 'Chúc mừng bạn',
  //           description: choosenRecord?.is_locked === 0 ? `Đã khoá thành công địa điểm ${rs}` : `Đã mở khoá thành công địa điểm ${rs}`,
  //         });
  //         fetch(tableData.pagination);
  //         setOpenDialogConfirm(false);

  //       }
  //     }).catch(err => {
  //       notificationController.error({ message: err.message });
  //       setTableData({ ...tableData, loading: false });
  //       setOpenDialogConfirm(false)

  //     })
  //   }


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

  const handleSuccessEdit = () => {
    setModeEdit(false);
    cancel();
    setNewLoc(null)
    fetch(initialPagination);
  }

  const handleOptionChange = (value: React.SetStateAction<null>) => {
    setSelectedOption(value);
  };

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

  const handleStatus = (status: string) => {
    switch (status) {
      case 'new':
        return 'Mới'
        case 'in_progress':
          return 'Đang tiến hành'
        case 'finished':
          return 'Hoàn thành'
      default:
        return 'Trễ';
    }
  }

  const isEditing = (record: TripTableRow) => record.key === editingKey;

  const edit = (record: Partial<TripTableRow> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
    setNewLoc(record)
    setModeEdit(true)
  };

  const cancel = () => {
    setEditingKey(0);
    setSelectedOption(null);

  };
  
  const save = async (key: React.Key) => {
    const findItem = driverData.find((item: {
      id: null; driver_id: number; 
}) => item.id === selectedOption);
    console.log("🚀 ~ file: Table.tsx:197 ~ save ~ driverData:", driverData)
    const findTrip = tableData.data.find(item => item.key === key);
    if (findItem && findTrip) {
      apiChangeDriver(findItem, findTrip);
    }
  };

  const apiChangeDriver =
    (driver: DriverTableRow, trip: TripTableRow) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      changeDriverOfTrip(driver, trip).then((res) => {
        const rs = res.data;

          setTableData({ ...tableData, loading: false });

          notificationController.success({
            message: 'Chúc mừng bạn',
            description: rs + '',
          });
          setEditingKey(0);
          fetch(tableData.pagination);
          setOpenDialogConfirm(false);
          setSelectedOption(null);

      }).catch(err => {
        notificationController.error({ message: err.message || err });
        setTableData({ ...tableData, loading: false });
        setOpenDialogConfirm(false)

      })
    }

  const columns: ColumnsType<TripTableRow> = [
    {title: 'Mã', dataIndex: 'key', width: 100},
    {
      title: 'Điểm đi',
      dataIndex: 'from_location_name',
      width: 200,
      render: (property: any, record: TripTableRow) => {
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
      render: (status: any, record: TripTableRow) => {
        const editable = isEditing(record);
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
      dataIndex: 'price',
      width: 200,
      render: (status: any, record: TripTableRow) => {
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
      title: 'Tài xế',
      dataIndex: 'driver_name',
      width: 300,
      render: (driver_name: any, record: TripTableRow) => {
        const editable = isEditing(record);

        return (
          editable ? (
            <label style={{ width: 200 }}>
              <Select
                showSearch
                style={{ width: 250 }}
                placeholder="Chọn tài xế"
                optionFilterProp="children"
                filterOption={(input, option) => String(option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) =>
                  String(optionA?.value ?? '').toLowerCase().localeCompare(String(optionB?.value ?? '').toLowerCase())
                }
                options={driverData.filter((d: any) => d.id != record.driver_id).map((driver: { id: any; first_name: string; last_name: string; car_name: string; }) => ({
                  value: driver.id,
                  label: (
                    <span>{driver.first_name + " " + driver.last_name + " | " + driver.car_name} </span>
                  ),
                }))}
                value={selectedOption}
                onChange={handleOptionChange}
              />
            </label>
          ) : (

            <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p> Tên: 
                  {
                    " " +driver_name
                  }
                </p>
                <p> Xe: 
                {
                  " " +record.car_name + " | " + record.number_plate 
                }
                </p>
              </BaseCol>
            </BaseRow>
          )
        )
      }
    },
  
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      width: 200,
      render: (created_at: any, record: TripTableRow) => {
        return (
          <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p> Ngày tạo: {record.created_at || "Chưa có"} </p>
                <p> Ngày khởi hành: {record.started_at || "Chưa có"} </p>
                <p> Ngày lăn bánh: {record.moved_at || "Chưa có"} </p>
                <p> Ngày hoàn thành: {record.finished_at || "Chưa có"} </p>
              </BaseCol>
            </BaseRow>
        )
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'slot_left',
      width: 200,
      render: (slot_left: any, record: TripTableRow) => {
        return (
          <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p> Chỗ: {record.total_ticket_slot} / {record.total_slot_trip}</p>
                <p> Vé: {record.total_ticket}</p>
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
      render: (status: any, record: TripTableRow) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol >
            <Status color='red' text={handleStatus(status)} />
          </BaseCol>

        </BaseRow>
      ),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: 250,
      render: (text: string, record: TripTableRow) => {
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
        modeCreate && (
          <BaseModal
            size='medium'
            title={'Tạo chuyến xe'}
            centered
            open={modeCreate}
            onCancel={() => setModeCreate(false)}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          // onOk={() => handleCreateUser()}
          // onCancel={() => setModeCreate(false)}
          >
            <BaseCard id="car-form" title={'Điền thông tin chuyến xe'} padding="1.25rem">
              <StepForm handleSuccessCreate={handleSuccessCreate} stageData={stageData} driverData={driverData} handleSuccessEdit={handleSuccessEdit}/>
            </BaseCard>
          </BaseModal>
        )
      }
      {
        modeEdit && (
          <BaseModal
            size='medium'
            title={`Cập nhật chuyến xe #${newLoc?.key}`}
            centered
            open={modeEdit}
            onCancel={() => {
              setModeEdit(false)
              cancel()
            }}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          // onOk={() => handleCreateUser()}
          // onCancel={() => setModeCreate(false)}
          >
            <BaseCard id="car-form" title={'Sửa thông tin chuyến xe'} padding="1.25rem">
              <StepForm modeEdit={modeEdit} handleSuccessEdit={handleSuccessEdit} stageData={stageData} driverData={driverData} handleSuccessCreate={handleSuccessCreate} oldTrip = {newLoc}/>
            </BaseCard>
          </BaseModal>
        )
      }

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
