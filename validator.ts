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

type Type<T> = 
    T extends { type: "Boolean" } ? boolean : 
    T extends { type: "Number" } ? number :
    T extends { type: "String" } ? string :
    T extends { type: "Array", member: infer R } ? Type<R>[] : 
    T extends { type: "Object", member: infer R extends object } ? { -readonly [K in keyof R]: Type<R[K]> } :
    never

const schema = {
    type: "Object",
    member: {
        a: { type: "Number" },
        b: { type: "String" }
    }
} as const satisfies Schema

type schemaType = Type<typeof schema>