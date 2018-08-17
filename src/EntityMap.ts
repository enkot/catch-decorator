class EntityMap {
    public keys: any[] = []
    public values: any[] = []

    public set(key: any, value: any): void {
        const index = this.keys.indexOf(key)

        if (index >= 0) {
            return this.values[index] = value
        }

        this.keys.push(key)
        this.values.push(value)
    }

    public get(key: any): any {
        return this.values[this.keys.indexOf(key)]
    }
}

export default EntityMap
