type ODataResponse<T> = {
    count?: boolean,
    data: T
}

type ODataQuery = {
    count?: boolean,
    top?: number
}

type A<P extends keyof any> = {
    [K in P]: number
}


class Base {
    get foo() { return null; }
}

class Next extends Base {
    get foo() {
        super.foo;
        return null;
    }
}

type TypeA = 1
type TypeB = 2

type Reponse<T> =  
    T extends { count: true } ? TypeA : TypeB

function b() {
    throw TypeError('')
}


type Test = {
    foo: never
}

class Foo {
    static apiCall<Query extends Partial<ODataQuery>>(query: Query): Query extends { count: true } ? TypeA : TypeB
    static apiCall<Query extends Partial<ODataQuery>>(query: Query): 1 | 2
    {
        if(query.count) {
            return 1
        }
        else {
            return 2
        }
    }
}

let g = Foo.apiCall({ count: false })

const enum BB {
    A = 'A',
    B = 'B',
    C = 1
}

let p = [{name: '', id: 1}]

function add(number: number) {

}

function call<T extends unknown[], R>(f:(...args: T) => R, ...args: T): R {
    return f(...args);
}


function fill(length: number, value: string): string[] {
    return Array.from({length: 5}, () => value)
}
