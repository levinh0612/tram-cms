import React, { useEffect, useState, useCallback } from 'react';
import { CarTableRow, getBasicTableData, getLocationTableData, Pagination, Tag, lockUnlockLocation, LocationTableRow, editLocation } from 'api/table.api';
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
import { StepForm } from '@app/components/forms/Location/StepForm';
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
  const [tableData, setTableData] = useState<{ data: LocationTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const { mobileOnly } = useResponsive();
  const [editingKey, setEditingKey] = useState(0);
  const [form] = BaseForm.useForm();
  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [modeCreate, setModeCreate] = useState<boolean>(false);
  const [choosenRecord, setChoosenRecord] = useState<LocationTableRow | undefined>();
  const [newLoc, setNewLoc] = useState<any>();
  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getLocationTableData(pagination).then((res) => {
        const rs = res.data;
        if (isMounted.current) {
          setTableData({ data: rs.data, pagination: rs.pagination, loading: false });
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
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  const coordinateRegex = /^-?\d+(\.\d+)?$/;
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

  const isEditing = (record: LocationTableRow) => record.key === editingKey;

  const edit = (record: Partial<LocationTableRow> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
    setNewLoc(record)
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const check = (val: any, type: string) => {
    if(type === 'time') {
      return val ? timeRegex.test(val) : false
    } else {
      if(val) {
        return coordinateRegex.test(val)
      } else return true
    }
  }

  const checkValue = () => {
    const timeOpen = newLoc.started_at;
    const timeClose = newLoc.closed_at;
    const xValue = newLoc.x;
    const yValue = newLoc.y;
    const zValue = newLoc.z;
    let flag = true;
    if(!check(timeOpen, 'time')) {
      notificationController.error({
        message: "Giờ mở cửa không hợp lệ!",
      })
      flag = false;
    }
    if(!check(timeClose, 'time')) {
      notificationController.error({
        message: "Giờ đóng cửa không hợp lệ!",
      })
      flag = false;
    }
    if(!check(xValue, 'cordinate') || !check(yValue, 'cordinate') || !check(zValue, 'cordinate')) {
      notificationController.error({
        message: "Toạ độ không hợp lệ!",
      })
      flag = false;
    }
    return flag;
  }
  const save = async (key: React.Key) => {
    try {
      const bool = checkValue();
      console.log("🚀 ~ file: Table.tsx:207 ~ save ~ bool:", bool)
      if(bool) {
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
      }
    } catch (errInfo) {
      BaseModal.error({
        title: "Có lỗi xảy ra",
        onOk: () => {
          setTableData({ ...tableData, loading: false });
        }
      });
    }
  };

  const columns: ColumnsType<LocationTableRow> = [
    {
      title: 'Tên',
      dataIndex: 'vi_name',
      width: 200,
      render: (property: any, record: LocationTableRow) => {
        const editable = isEditing(record);
        return (
          editable ? (
            <>
              <BaseInput
                placeholder={'Nhập tên tiếng Việt'}
                value={newLoc?.vi_name}
                onChange={(val) => {
                  if (val.target.value) {
                    console.log('New Value:', val.target.value);
                    setNewLoc({ ...newLoc, vi_name: val.target.value });
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
                <p>{record.vi_name} (<span>{record.en_name}</span> )</p>
              </BaseCol>
            </BaseRow>
          )
        )
      }
    },
    {
      title: 'Thời gian mở - đóng',
      dataIndex: 'started_at',
      width: 200,
      render: (status: any, record: LocationTableRow) => {
        const editable = isEditing(record);
        return (
          editable ? (
            <>
              <BaseInput
                placeholder={'Nhập giờ mở cửa'}
                value={newLoc?.started_at}
                onChange={(val) => {
                  if (val.target.value) {
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
                    record.started_at && record.started_at ? (
                      `${record.started_at} - ${record.closed_at}`
                    ) : (
                      `Suốt cả ngày`
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
      title: 'Toạ độ',
      dataIndex: 'x',
      width: 200,
      render: (status: any, record: LocationTableRow) => {
        const editable = isEditing(record);

        return (
          editable ? (
            <>
              <BaseInput
                placeholder={'Nhập toạ độ X'}
                value={newLoc?.x}
                onChange={(val) => {
                  if (val.target.value) {
                    setNewLoc({ ...newLoc, x: val.target.value });
                  } else {
                    setNewLoc(record);
                  }
                }}
              />

              <BaseInput placeholder={'Nhập toạ độ Y'} value={newLoc?.y} onChange={(val => {
                if (val.target.value) {
                  setNewLoc({ ...newLoc, y: val.target.value })
                } else {
                  setNewLoc(record)
                }
              })} />

              <BaseInput placeholder={'Nhập toạ độ Z'} value={newLoc?.z} onChange={(val => {
                if (val.target.value) {
                  setNewLoc({ ...newLoc, z: val.target.value })
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
                    record.x && record.y || record.z ? (
                      `${record.x} ${record.y} ${record.z}`
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
      title: t('common.status'),
      key: 'status',
      dataIndex: 'status',
      width: 200,
      render: (status: any, record: LocationTableRow) => (
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
      render: (text: string, record: LocationTableRow) => {
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
                  {
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
                  }
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
            <p>{choosenRecord?.is_locked === 0 ? "Khoá" : "Mở khoá"} {choosenRecord?.vi_name}</p>

          </BaseModal>
        )
      }
      {
        modeCreate && (
          <BaseModal
            size='medium'
            title={'Tạo địa điểm'}
            centered
            open={modeCreate}
            onCancel={() => setModeCreate(false)}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          // onOk={() => handleCreateUser()}
          // onCancel={() => setModeCreate(false)}
          >
            <BaseCard id="car-form" title={'Điền thông tin địa điểm'} padding="1.25rem">
              <StepForm handleSuccessCreate={handleSuccessCreate} />
            </BaseCard>
          </BaseModal>
        )
      }

      <BaseSpace style={{ margin: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        <BaseButton type='primary' onClick={() => setModeCreate(true)}>Thêm</BaseButton>
      </BaseSpace>
      <BaseTable
        columns={columns}
        dataSource={tableData.data}
        pagination={tableData.pagination}
        loading={tableData.loading}
        onChange={handleTableChange}
        scroll={{ x: 800, y: 600 }}
        bordered
      />
    </>
  );
};
