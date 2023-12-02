import { Priority } from '../constants/enums/priorities';
import { httpApi } from '@app/api/http.api';
export interface Tag {
  value: string;
  priority: Priority;
}

export interface Car {
  id: number;
  name: string;
  number_plate: string;
  created_at: string;
  is_locked: number;
  updated_at: string | null;
}

export interface DriverTableRow {
  key: number;
  name: string;
  age: number;
  address: string;
  tags?: Tag[];
  number_plate?: string;
  name_car?: string;
  status?: string;
  is_locked?: number;
  image?: string;
  gender?: string;
}

export interface StageTableRow {
  key: number;
  from_location_id?: number;
  from_location_name?: string;
  to_location_id?: number;
  to_location_name?: string;
  price?: number;
  is_locked?: number;
  locationData?: any;
}

export interface TripTableRow {
  moved_at: string;
  driver_id: number;
  total_ticket: number;
  total_ticket_slot: number;
  finished_at: number;
  key: number;
  status: string;
  started_at: string;
  total_slot_trip: string;
  created_at: string;
  price: string;
  stage_created_at: string;
  driver_name: string;
  from_location_name: string;
  to_location_name: string;
  car_name: string;
  number_plate: string;
}

export interface CarTableRow {
  key: number;
  name: string;
  number_plate?: string;
  is_locked?: number;
}

export interface LocationTableRow {
  key: number;
  vi_name: string;
  en_name: string;
  is_locked?: number;
  x?: string;
  y?: string;
  z?: string;
  started_at?: string;
  closed_at?: string;
}

export interface PayloadCreateUser {
  lastname?: string;
  firstname?: string;
  username?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  [key: string]: string | undefined; // Add an index signature

}

export interface PayloadCreateCar {
  name?: string;
  numberPlate?: string;
  [key: string]: string | undefined; // Add an index signature

}

export interface PayloadCreateLocation {
  viName?: string;
  enName?: string;
  startedAt?: string;
  closedAt?: string;
  x?: string;
  y?: string;
  z?: string;
  [key: string]: string | undefined; // Add an index signature

}



export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface BasicTableData {
  data: DriverTableRow[] | CarTableRow[] | LocationTableRow[] | StageTableRow[] | TripTableRow[];
  options?: [];
  pagination: Pagination;
  msg?: string;
  locationData?: any;
}

export interface TreeTableRow extends DriverTableRow {
  children?: TreeTableRow[];
}

export interface TreeTableData extends BasicTableData {
  data: TreeTableRow[];
}

export interface EditableTableData extends BasicTableData {
  data: DriverTableRow[] | CarTableRow[] | LocationTableRow[];
}

export interface Response {
  success: boolean;
  data: any;
}

export const getBasicTableData = (pagination: Pagination): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/user', { ...pagination }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const getCarTableData = (pagination: Pagination): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/car', { ...pagination }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const getLocationTableData = (pagination: Pagination): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/location', { ...pagination }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const getStageTableData = (pagination: Pagination): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/stage', { ...pagination }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const getTripTableData = (pagination: Pagination): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/trip', { ...pagination }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const listToAssign = (): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/car/listToAssign', {  }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const assignCar = (car: Car, user: DriverTableRow): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/car/assignCar', { car, user }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const changeDriverOfTrip = (driver: DriverTableRow, trip: TripTableRow): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/trip/changeDriver', { driver, trip }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const lockUnlockUser = (action: string, id: number | undefined): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/user/lockUnlock', { action, id }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const lockUnlockCar = (action: string, id: number | undefined): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/car/lockUnlock', { action, id }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const lockUnlockLocation = (action: string, id: number | undefined): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/location/lockUnlock', { action, id }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const createUser = (payload : PayloadCreateUser): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/user/create', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const createCar = (payload : PayloadCreateCar): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/car/create', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const createLocation = (payload : PayloadCreateLocation): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/location/create', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const createStage = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/stage/create', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const createTrip = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/trip/create', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const editTrip = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/trip/edit', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const editStage = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/stage/edit', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const topDriver = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/user/top', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const topStage = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/stage/top', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const getBalance = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/trip/balance', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};
export const editLocation = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/location/edit', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const editCar = (payload : any): Promise<Response> => {
  return new Promise((res, rej) => {
    httpApi.post<Response>('api/car/edit', { ...payload }).then(({ data }) => {
      return res(data);
    }).catch(err => {
      return rej(err);
    })
  });
};

export const getTreeTableData = (pagination: Pagination): Promise<TreeTableData> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: [
          {
            key: 1,
            name: 'John Brown sr.',
            age: 60,
            address: 'New York No. 1 Lake Park',
            children: [
              {
                key: 11,
                name: 'John Brown',
                age: 42,
                address: 'New York No. 2 Lake Park',
              },
              {
                key: 12,
                name: 'John Brown jr.',
                age: 30,
                address: 'New York No. 3 Lake Park',
                children: [
                  {
                    key: 121,
                    name: 'Jimmy Brown',
                    age: 16,
                    address: 'New York No. 3 Lake Park',
                  },
                ],
              },
              {
                key: 13,
                name: 'Jim Green sr.',
                age: 72,
                address: 'London No. 1 Lake Park',
                children: [
                  {
                    key: 131,
                    name: 'Jim Green',
                    age: 42,
                    address: 'London No. 2 Lake Park',
                    children: [
                      {
                        key: 1311,
                        name: 'Jim Green jr.',
                        age: 25,
                        address: 'London No. 3 Lake Park',
                      },
                      {
                        key: 1312,
                        name: 'Jimmy Green sr.',
                        age: 18,
                        address: 'London No. 4 Lake Park',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            key: 200,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            children: [
              {
                key: 201,
                name: 'Joe Green',
                age: 42,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 202,
                    name: 'Joe Green jr.',
                    age: 25,
                    address: 'London No. 3 Lake Park',
                  },
                  {
                    key: 203,
                    name: 'Joe Green sr.',
                    age: 18,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
          {
            key: 300,
            name: 'Jaime Black',
            age: 22,
            address: 'Sidney No. 1 Lake Park',
            children: [
              {
                key: 301,
                name: 'Jaime Green',
                age: 52,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 302,
                    name: 'Jaime Green jr.',
                    age: 21,
                    address: 'London No. 3 Lake Park',
                  },
                  {
                    key: 303,
                    name: 'Jaime Green sr.',
                    age: 18,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
          {
            key: 400,
            name: 'Pavel Brown',
            age: 26,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 401,
                name: 'Pavel Brown',
                age: 22,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 402,
                    name: 'Pavel Brown jr.',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                  },
                  {
                    key: 403,
                    name: 'Pavel Brown sr.',
                    age: 19,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
          {
            key: 500,
            name: 'Alex Nickls',
            age: 45,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 501,
                name: 'Marta Nickls',
                age: 25,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 502,
                    name: 'Pavel Nickls jr.',
                    age: 12,
                    address: 'London No. 1 Lake Park',
                  },
                  {
                    key: 503,
                    name: 'Alina Nickls sr.',
                    age: 19,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
          {
            key: 600,
            name: 'Nick Donald',
            age: 45,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 601,
                name: 'Alexsa Donald',
                age: 34,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 602,
                    name: 'Marta Donald jr.',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                  },
                  {
                    key: 603,
                    name: 'Alex Donald sr.',
                    age: 19,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
          {
            key: 700,
            name: 'Jo Snider',
            age: 26,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 701,
                name: 'Jo Snider',
                age: 22,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 702,
                    name: 'Jaems Snider jr.',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                  },
                  {
                    key: 703,
                    name: 'Jin Snider sr.',
                    age: 19,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
          {
            key: 800,
            name: 'Jon Brown',
            age: 26,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 801,
                name: 'Kitana Brown',
                age: 22,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 802,
                    name: 'Cris Brown jr.',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                  },
                  {
                    key: 803,
                    name: 'Jon Brown sr.',
                    age: 19,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
        ],
        pagination: { ...pagination, total: 8 },
      });
    }, 1000);
  });
};

export const getEditableTableData = (pagination: Pagination): Promise<EditableTableData> => {
  return new Promise((res) => {
    setTimeout(() => {
      res({
        data: [
          {
            key: 1,
            name: `Edward`,
            age: 32,
            address: `London Park no.1`,
          },
          {
            key: 2,
            name: `Alex`,
            age: 45,
            address: `London Park no.2`,
          },
          {
            key: 3,
            name: `Niko`,
            age: 21,
            address: `London Park no.3`,
          },
          {
            key: 4,
            name: `Josh`,
            age: 18,
            address: `London Park no.4`,
          },
          {
            key: 5,
            name: `Jo`,
            age: 15,
            address: `Minsk Park no.1`,
          },
          {
            key: 6,
            name: `Jaimi`,
            age: 18,
            address: `London Park no.2`,
          },
          {
            key: 7,
            name: `Alexa`,
            age: 24,
            address: `London Park no.6`,
          },
          {
            key: 8,
            name: `Donald`,
            age: 27,
            address: `London Park no.7`,
          },
          {
            key: 9,
            name: `Pavel`,
            age: 17,
            address: `London Park no.9`,
          },
          {
            key: 10,
            name: `Nick`,
            age: 18,
            address: `London Park no.1`,
          },
          {
            key: 11,
            name: `Dasha`,
            age: 25,
            address: `London Park no.2`,
          },
          {
            key: 12,
            name: `Alex`,
            age: 27,
            address: `London Park no.3`,
          },
          {
            key: 13,
            name: `Vic`,
            age: 29,
            address: `London Park no.2`,
          },
          {
            key: 14,
            name: `Natalia`,
            age: 25,
            address: `London Park no.4`,
          },
          {
            key: 15,
            name: `Zack`,
            age: 27,
            address: `London Park no.1`,
          },
          {
            key: 16,
            name: `Jack`,
            age: 31,
            address: `London Park no.4`,
          },
        ],
        pagination: { ...pagination, total: 16 },
      });
    }, 1000);
  });
};
