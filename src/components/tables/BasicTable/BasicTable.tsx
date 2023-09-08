import React, { useEffect, useState, useCallback } from 'react';
import { BasicTableRow, getBasicTableData, Pagination, Tag, lockUnlockUser } from 'api/table.api';
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
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';
import { StepForm } from '@app/components/forms/Driver/StepForm';
import { StepsProps } from 'antd';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const BasicTable: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const { mobileOnly } = useResponsive();

  const [openDialogConfirm, setOpenDialogConfirm] = useState<boolean>(false);
  const [modeCreate, setModeCreate] = useState<boolean>(false);
  const [choosenRecord, setChoosenRecord] = useState<BasicTableRow | undefined>();
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

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      render: (text: string, record: BasicTableRow) => {
        return (
          <BaseRow style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <BaseCol>
              <BaseAvatar src={record?.image || urlDefaultImgDriver} alt="user avatar" size={mobileOnly ? 49 : 67} />
            </BaseCol>
            <BaseCol>
              <BaseTypography style={{ whiteSpace: 'nowrap' }}>{text}</BaseTypography>
            </BaseCol>
          </BaseRow>
        )
      },
    },
    {
      title: t('common.age'),
      dataIndex: 'age',
      sorter: (a: BasicTableRow, b: BasicTableRow) => a.age - b.age,
      showSorterTooltip: false,
      render(value, record, index) {
          return (
            <BaseRow style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <BaseCol>{value}</BaseCol>
              <BaseCol>
              {
                record?.gender === 'female' ? (
                  <ManOutlined style={{ color: 'blue'}}/>
                ) : (
                  <WomanOutlined style={{ color: 'pink'}}/>
                )
              }
              </BaseCol>
            </BaseRow>
          )
      },
    },
    {
      title: t('common.phone'),
      dataIndex: 'phone',
    },
    {
      title: t('common.numberPlate'),
      dataIndex: 'number_plate',
      render: (text: string) => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,

    },
    {
      title: t('common.email'),
      dataIndex: 'email',
    },
    {
      title: t('common.address'),
      dataIndex: 'address',
    },
    {
      title: t('common.status'),
      key: 'status',
      dataIndex: 'status',
      render: (status: any, record: BasicTableRow) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol >
            {
              record.is_locked === 1 ? (
                <Status color={"red"} text={"Bị khoá"} />
              ) : (

                <Status color={defineColorByStatus(status)} text={t(`tables.status.${status}`).toUpperCase()} />
              )
            }
          </BaseCol>

        </BaseRow>
      ),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: BasicTableRow) => {
        return (
          <BaseSpace>
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
                <StepForm handleSuccessCreate={handleSuccessCreate}/>
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
        scroll={{ x: 800 }}
        bordered
      />
    </>
  );
};
