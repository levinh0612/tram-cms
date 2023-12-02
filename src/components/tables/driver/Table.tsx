import React, { useEffect, useState, useCallback } from 'react';
import { DriverTableRow, getBasicTableData, Pagination, Tag, lockUnlockUser, listToAssign, Car, assignCar } from 'api/table.api';
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
import { StepForm } from '@app/components/forms/Driver/StepForm';
import { Select, StepsProps } from 'antd';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BasePopconfirm } from '@app/components/common/BasePopconfirm/BasePopconfirm';
import { BaseAutoComplete } from '@app/components/common/BaseAutoComplete/BaseAutoComplete';
import { SearchInput } from '@app/components/common/inputs/SearchInput/SearchInput.styles';
import styled from 'styled-components';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};



export const BasicTable: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: DriverTableRow[]; pagination: Pagination; loading: boolean }>({
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
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState<Array<Car>>([]);
  const [choosenRecord, setChoosenRecord] = useState<DriverTableRow | undefined>();
  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getBasicTableData(pagination).then((res) => {
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

  const fetchListCarAssign = useCallback(
    () => {
      listToAssign().then((res) => {
        const rs = res.data;
        if (rs.options) {
          setOptions(rs.options as Car[]); // Cast 'options' to Car[]
        } else {
          setOptions([]); // Set an empty array if 'options' is undefined
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
    [editingKey],
  );

  const CategoryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
  const Link = styled.a`
float: right;
`;

  const handleOptionChange = (value: React.SetStateAction<null>) => {
    setSelectedOption(value);
  };


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
      lockUnlockUser(action, id).then((res) => {
        const rs = res.data;
        if (isMounted.current) {

          setTableData({ ...tableData, loading: false });
          notificationController.success({
            message: 'Chúc mừng bạn',
            description: choosenRecord?.is_locked === 0 ? `Đã khoá thành công tài xế ${rs}` : `Đã mở khoá thành công tài xế ${rs}`,
          });
          fetch(tableData.pagination);
          setOpenDialogConfirm(false);

        }
      }).catch(err => {
        notificationController.error({ message: err.message || err});
        setTableData({ ...tableData, loading: false });
        setOpenDialogConfirm(false)

      })
    }
  const apiAssignCar =
    (car: Car, user: DriverTableRow) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      assignCar(car, user).then((res) => {
        const rs = res.data;
         console.log("🚀 ~ file: Table.tsx:143 ~ assignCar ~ rs:", rs)

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

  const isEditing = (record: DriverTableRow) => record.key === editingKey;

  const edit = (record: Partial<DriverTableRow> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    fetchListCarAssign();
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey(0);
    setSelectedOption(null);
  };

  const save = async (key: React.Key) => {
    const findItem = options.find(item => item.name === selectedOption || item.number_plate === selectedOption);
    const findUser = tableData.data.find(item => item.key === key);
    if (findItem && findUser) {
      apiAssignCar(findItem, findUser);
    }
    // try {
    //   const row = (await form.validateFields()) as DriverTableRow;

    //   const newData = [...tableData.data];
    //   const index = newData.findIndex((item) => key === item.key);
    //   if (index > -1) {
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //       ...item,
    //       ...row,
    //     });
    //   } else {
    //     newData.push(row);
    //   }
    //   setTableData({ ...tableData, data: newData });
    //   setEditingKey(0);
    // } catch (errInfo) {
    //   console.log('Validate Failed:', errInfo);
    // }
  };

  const columns: ColumnsType<DriverTableRow> = [
    {title: 'Mã', dataIndex: 'key', width: 100},
    {
      title: t('common.name'),
      dataIndex: 'Tên',
      width: 300,
      fixed: 'left',
      render: (text: string, record: DriverTableRow) => {
        return (
          <BaseRow style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column' }}>
            <BaseCol>
              <BaseAvatar src={record?.image || urlDefaultImgDriver} alt="user avatar" size={mobileOnly ? 49 : 67} />
            </BaseCol>
            <BaseCol>
              <p style={{ whiteSpace: 'nowrap' }}>{text}</p>
            </BaseCol>
          </BaseRow>
        )
      },
    },
    {
      title: t('common.age'),
      dataIndex: 'age',
      width: 100,
      sorter: (a: DriverTableRow, b: DriverTableRow) => a.age - b.age,
      showSorterTooltip: false,
      render(value, record, index) {
        return (
          <BaseRow style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <BaseCol>{value}</BaseCol>
            <BaseCol>
              {
                record?.gender === 'female' ? (
                  <ManOutlined style={{ color: 'blue' }} />
                ) : (
                  <WomanOutlined style={{ color: 'pink' }} />
                )
              }
            </BaseCol>
          </BaseRow>
        )
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: 'Xe',
      dataIndex: 'number_plate',
      width: 250,
      render: (text: string, record: DriverTableRow, index: number) => {
        const editable = isEditing(record);
        return (
          editable ? (
            <label style={{ width: 200 }}>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Chọn xe"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) =>
                  (optionA?.value ?? '').toLowerCase().localeCompare((optionB?.value ?? '').toLowerCase())
                }
                options={options.map((option) => ({
                  value: option.name,
                  label: (
                    <span>{option.name + " | " + option.number_plate} </span>
                  ),
                }))}
                value={selectedOption}
                onChange={handleOptionChange}
              />
            </label>
          ) : (
            <span style={{ whiteSpace: 'nowrap' }}>
              {
                record.name_car && text && `${record.name_car} | ${text}`
              }
            </span>
          )
        )
      },

    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      width: 300

    },
    {
      title: t('common.address'),
      dataIndex: 'address',
      width: 300
    },
    {
      title: t('common.status'),
      key: 'status',
      dataIndex: 'status',
      width: 200,
      render: (status: any, record: DriverTableRow) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol >
            {
              record.is_locked === 1 ? (
                <Status color={"red"} text={"Bị khoá"} />
              ) : (

                <Status color={defineColorByStatus(status)} text={t(`tables.status.${status}`)} />
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
      fixed: 'right',
      render: (text: string, record: DriverTableRow) => {
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
            <p>{choosenRecord?.is_locked === 0 ? "Khoá" : "Mở khoá"} {choosenRecord?.name}</p>

          </BaseModal>
        )
      }
      {
        modeCreate && (
          <BaseModal
            size='medium'
            title={'Tạo tài xế'}
            centered
            open={modeCreate}
            onCancel={() => setModeCreate(false)}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          // onOk={() => handleCreateUser()}
          // onCancel={() => setModeCreate(false)}
          >
            <BaseCard id="driver-form" title={'Điền thông tin tài xế'} padding="1.25rem">
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
        scroll={{ x: 1500, y: 600 }}
        bordered
      />
    </>
  );
};
