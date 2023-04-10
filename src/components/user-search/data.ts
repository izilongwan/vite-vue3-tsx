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

export function findData(data: Datas, value: string) {
  return data.reduce((p, c) => {
    const { id, name } = c

    if (String(id).includes(value) || name.includes(value)) {
      p.push(c)
    } else if (c.children) {
      p.push(...findData(c.children, value))
    }

    return p
  }, [] as Datas)
}
