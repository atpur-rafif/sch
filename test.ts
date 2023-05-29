namespace Schema{
    type GetUnion<T, U> = T extends U ? T : never;

    type OmitProp<T, U extends keyof T> = {
        [K in keyof T as (K extends U ? never : K)]: T[K]
    }

    type ChangePropName<O, F extends string, T extends string> = {
        [K in keyof O as (K extends F ? T : K)]: O[K]
    }

    type CompressParam<T> = T extends { "_params": infer P } ? (OmitProp<T, "_params"> & P) : T
    type ExtractParamFromSchema<T extends Schema> = OmitProp<T, "type">
    type GetParamType<T extends Config["_from"]> = GetUnion<Config, { _from: T }> extends { _params: infer R } ? R : never 
    type GetParam<T extends Config["_from"], P> = P extends GetParamType<T> ? P : never

    type UnwrapTuple<T extends ReadonlyArray<Schema>> = {
        -readonly [K in keyof T]: Type<T[K]> extends infer K ? K : never
    }

    export type Config<P = any> = {
        _from: "Any"
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
        _to: Type<GetParam<"Array", P>["element"]>[]
        _params: {
            element: Schema
        }
    } | {
        _from: "Object"
        _to: P extends GetParamType<"Object"> ? 
            (P["optionalProperties"] extends object ? Partial<
                { -readonly [K in keyof (OmitProp<P["optionalProperties"], keyof P["properties"]>)]: Type<P["optionalProperties"][K]>}
            > : {}) &
            { -readonly [K in keyof P["properties"]]: Type<P["properties"][K]> }
            : never
        _params: {
            properties: Record<string | number, Schema>
            optionalProperties?: Record<string | number, Schema>
        }
    } | {
        _from: "Tuple"
        _to: UnwrapTuple<GetParam<"Tuple", P>["element"]>
        _params: {
            element: readonly Schema[]
        }
    }

    // Create schema from config
    export type Schema<C extends Config = Config> = CompressParam<ChangePropName<OmitProp<C, "_to">, "_from", "type">>

    // Create type from schema
    export type Type<T extends Schema> = T extends { type: infer R } ? GetUnion<Config<ExtractParamFromSchema<T>>, { _from: R }>["_to"] : never
}

const a = {
    type: "Tuple",
    element: [
        { type: "String" },
        {
            type: "Tuple",
            element: [
                { type: "Number" },
                { type: "Number" }
            ]
        }
    ]
} as const satisfies Schema.Schema

type ta = Schema.Type<typeof a>


