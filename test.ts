type OmitProp<T, U extends keyof T> = {
    [K in keyof T as (K extends U ? never : K)]: T[K]
}

type GetUnion<T, U> = T extends U ? T : never;

type ChangePropName<O, F extends string, T extends string> = {
    [K in keyof O as (K extends F ? T : K)]: O[K]
}

type ExtractParam<T extends { type: any }> = {
    [K in keyof OmitProp<T, "type">]: T[K]
}

type CompressParam<T> = T extends { _param: Record<string, any> } ? ({
    [K in keyof T["_param"]]: T["_param"][K]
} & {
    [K in keyof OmitProp<T, "_param">]: T[K]
}) : T

type GetParam<T extends BaseConfig["_from"], P> = GetUnion<BaseConfig, { _from: T }> extends { _param: infer R } ? (P extends R ? P : never) : never

type BaseConfig<P = any> = {
    _from: "Any",
    _to: any
} | {
    _from: "Boolean"
    _to: boolean
} | {
    _from: "Number"
    _to: number
} | {
    _from: "String"
    _to: string
} | {
    _from: "Array"
    _param: {
        element: _Schema,
        min?: number,
        max?: number
    },
    _to: _Type<GetParam<"Array", P>["element"]>[]
} 

/*
| {
    from: "Object"
    member: Record<string | number, ToSchema<BaseConfig>>
    to: M extends Record<string | number, _Schema> ? { -readonly [K in keyof M]: M[K] extends _Schema ? _Type<M[K]> : never } : never
}
*/

type _Schema<T extends BaseConfig = BaseConfig> = CompressParam<ChangePropName<OmitProp<T, "_to">, "_from", "type">>
type _Type<T extends _Schema> = 
    T extends { type: infer R } ? GetUnion<BaseConfig<ExtractParam<T>>, { _from: R }>["_to"] :
    never

const test = {
    type: "Array",
    element: {
        type: "Array",
        element: {
            type: "Number"
        }
    }
} as const satisfies _Schema

type testType = _Type<typeof test>