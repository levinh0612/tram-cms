import React, { useEffect, useState, useCallback } from 'react';
import { CarTableRow, getBasicTableData, getLocationTableData, Pagination, Tag, lockUnlockLocation, TripTableRow, editLocation, getTripTableData } from 'api/table.api';
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
  const [stageData, setStageData] = useState<any>();
  const [driverData, setDriverData] = useState<any>();
  const [choosenRecord, setChoosenRecord] = useState<TripTableRow | undefined>();
  const [newLoc, setNewLoc] = useState<any>();
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
  };

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

  const columns: ColumnsType<TripTableRow> = [
    {
      title: 'Điểm đi',
      dataIndex: 'from_location_name',
      width: 200,
      render: (property: any, record: TripTableRow) => {
        const editable = isEditing(record);
        return (
          editable ? (
            <>
              <BaseInput
                placeholder={'Nhập tên tiếng Việt'}
                value={newLoc?.from_location_name}
                onChange={(val) => {
                  if (val.target.value) {
                    console.log('New Value:', val.target.value);
                    setNewLoc({ ...newLoc, from_location_name: val.target.value });
                  } else {
                    console.log('Resetting to original value');
                    setNewLoc(record);
                  }
                }}
              />

              <BaseInput placeholder={'Nhập tên tiếng Anh'} value={newLoc?.en_name} onChange={(val => {
                if (val.target.value) {
                  setNewLoc({ ...newLoc, en_name: val.target.value })
                } else {
                  setNewLoc(record)
                }
              })} />
            </>
          ) : (
            <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p>{record?.from_location_name} </p>
              </BaseCol>
            </BaseRow>
          )
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
          editable ? (
            <>
              <BaseInput
                placeholder={'Nhập giờ mở cửa'}
                value={newLoc?.started_at}
                onChange={(val) => {
                  if (val.target.value) {
                    console.log('New Value:', val.target.value);
                    setNewLoc({ ...newLoc, started_at: val.target.value });
                  } else {
                    console.log('Resetting to original value');
                    setNewLoc(record);
                  }
                }}
              />

              <BaseInput placeholder={'Nhập giờ đóng cửa'} value={newLoc?.closed_at} onChange={(val => {
                if (val.target.value) {
                  setNewLoc({ ...newLoc, closed_at: val.target.value })
                } else {
                  setNewLoc(record)
                }
              })} />
            </>
          ) : (
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
          editable ? (
            <>
              <BaseInput
                placeholder={'Giá'}
                value={newLoc?.price}
                onChange={(val) => {
                  if (val.target.value) {
                    setNewLoc({ ...newLoc, price: val.target.value });
                  } else {
                    setNewLoc(record);
                  }
                }}
              />

            </>
          ) : (

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
        )
      }
    },
    {
      title: 'Tài xế',
      dataIndex: 'driver_name',
      width: 200,
      render: (driver_name: any, record: TripTableRow) => {
        const editable = isEditing(record);

        return (
          editable ? (
            <>
              <BaseInput
                placeholder={'Giá'}
                value={newLoc?.price}
                onChange={(val) => {
                  if (val.target.value) {
                    setNewLoc({ ...newLoc, price: val.target.value });
                  } else {
                    setNewLoc(record);
                  }
                }}
              />

            </>
          ) : (

            <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p>
                  {
                    driver_name
                  }
                </p>
              </BaseCol>
            </BaseRow>
          )
        )
      }
    },
    {
      title: 'Xe',
      dataIndex: 'car_name',
      width: 200,
      render: (car_name: any, record: TripTableRow) => {
        return (
          <BaseRow gutter={[10, 10]}>
              <BaseCol >
                <p>
                  {
                    record.car_name + " | " + record.number_plate 
                  }
                </p>
              </BaseCol>
            </BaseRow>
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
                <p> Ngày bắt đầu: {record.started_at || "Chưa có"} </p>
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
            <BaseCard id="car-form" title={'Điền thông tin chặng xe'} padding="1.25rem">
              <StepForm handleSuccessCreate={handleSuccessCreate} stageData={stageData} driverData={driverData} />
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
