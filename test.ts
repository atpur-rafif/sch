namespace Validation{
    type GetParam<T extends Config["_from"], P> = GetUnion<Config, { _from: T }> extends { _params: infer R } ? (P extends R ? P : never) : never
    type GetUnion<T, U> = T extends U ? T : never;


    type OmitProp<T, U extends keyof T> = {
        [K in keyof T as (K extends U ? never : K)]: T[K]
    }

    type ChangePropName<O, F extends string, T extends string> = {
        [K in keyof O as (K extends F ? T : K)]: O[K]
    }

    type CompressParam<T> = T extends { "_params": infer P } ? (
        OmitProp<T, "_params"> & P
    ) : T
    type ExtractParamFromSchema<T extends Schema> = OmitProp<T, "type">

    export type Config<P = any> = {
        _from: "Any",
        _to: any
    } | {
        _from: "Boolean",
        _to: boolean
    } | {
        _from: "Number",
        _to: number
    } | {
        _from: "String",
        _to: string
    } | {
        _from: "Array",
        _to: Type<GetParam<"Array", P>["element"]>[]
        _params: {
            element: Schema
        }
    }

    // Create schema from config
    export type Schema<C extends Config = Config> = CompressParam<ChangePropName<OmitProp<C, "_to">, "_from", "type">>

    // Create type from schema
    export type Type<T extends Schema> = T extends { type: infer R } ? GetUnion<Config<ExtractParamFromSchema<T>>, { _from: R }>["_to"] : never
}

const a = {
    type: "Array",
    element: {
        type: "String"
    }
} as const satisfies Validation.Schema

type ta = Validation.Type<typeof a>
