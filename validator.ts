type Schema = {
    type: "Boolean"
} | {
    type: "Number"
} | {
    type: "String"
} | {
    type: "Array"
    member: Schema
} | {
    type: "Object"
    member: Record<any, Schema>
}

type Type<T extends Schema> = 
    T extends { type: "Boolean" } ? boolean : 
    T extends { type: "Number" } ? number :
    T extends { type: "String" } ? string :
    T extends { type: "Array", member: infer R extends Schema } ? Type<R>[] : 
    T extends { type: "Object", member: infer R extends object } ? { -readonly [K in keyof R]: R[K] extends Schema ? Type<R[K]> : never } :
    never

const schema = {
    type: "Object",
    member: {
        a: { type: "Number" },
        b: {
            type: "Array",
            member: { type: "String" }
        }
    }
} as const satisfies Schema

type schemaType = Type<typeof schema>