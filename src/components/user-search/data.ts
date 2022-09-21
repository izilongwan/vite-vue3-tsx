export const data: Datas = [
  {
    id: 1,
    name: 'Lee',
    age: 20,
    children: [
      {
        id: 11,
        name: 'LeeBt',
        age: 2,
      }
    ]
  },
  {
    id: 2,
    name: 'Oo',
    age: 22,
    children: [
      {
        id: 21,
        name: 'Olre',
        age: 3,
        children: [
          {
            id: 31,
            name: 'Loewqoe',
            age: 1,
          }
        ]
      }
    ]
  }
]

export type GetData<T> = T extends (infer R)[]
  ? R
  : null

export type Datas = Data[]

export type Data = {
  id: number
  age: number
  name: string
  children?: Datas
}
