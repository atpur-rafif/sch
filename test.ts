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
    to: M extends _Schema ? _Type<M>[] : never
} | {
    from: "Object"
    member: Record<string | number, ToSchema<BaseConfig>>
    to: M extends Record<string | number, _Schema> ? { -readonly [K in keyof M]: M[K] extends _Schema ? _Type<M[K]> : never } : never
}

type ToSchema<T extends BaseConfig> = ChangePropName<NegateProp<T, "to">, "from", "type">
type _Schema = ToSchema<BaseConfig>

type _Type<T extends _Schema> = 
    T extends { type: infer R, member: infer M} ? Extract<BaseConfig<M>, { from: R }>["to"] :
    T extends { type: infer R } ? Extract<BaseConfig, { from: R }>["to"] :
    never

const test = {
    type: "Object",
    member: {
        a: {
            type: "Object",
            member: {
                a: {
                    type: "Array",
                    member: { type: "String" }
                },
                b: { type: "String" }
            }
        },
        b: { type: "Number" }
    }
} as const satisfies _Schema

type testType = _Type<typeof test>