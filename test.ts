type NegateProp<T, U> = {
    [K in keyof T as (K extends U ? never : K)]: T[K]
}

type ChangePropName<O, F extends string, T extends string> = {
    [K in keyof O as (K extends F ? T : K)]: O[K]
}

type BaseConfig<M = any> = {
    from: "Any",
    to: any
} | {
    from: "Boolean"
    to: boolean
} | {
    from: "Number"
    to: number
} | {
    from: "String"
    to: string
} | {
    from: "Array"
    member: ToSchema<BaseConfig>
    to: M[]
}

type ToSchema<T extends BaseConfig> = ChangePropName<NegateProp<T, "to">, "from", "type">
type _Schema = ToSchema<BaseConfig>

type _Type<T extends _Schema> = 
    T extends { type: infer R, member: infer M extends _Schema} ? Extract<BaseConfig<_Type<M>>, { from: R }>["to"] :
    T extends { type: infer R } ? Extract<BaseConfig, { from: R }>["to"] :
    never

const test = {
    type: "Array",
    member: {
        type: "Array",
        member: {
            type: "String"
        }
    }
} as const satisfies _Schema

type testType = _Type<typeof test>