export class Vector {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    public subtract(vector: Vector): Vector {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    public scale(value: number): Vector {
        return new Vector(this.x * value, this.y * value);
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared(): number {
        return this.x ** 2 + this.y ** 2;
    }

    public normalize(length = this.length()): Vector {
        if (length === 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / length, this.y / length);
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public dot(vector: Vector): number {
        return vector.x * this.x + vector.y * this.y;
    }

    public cos(vector: Vector): number {
        const cos = this.dot(vector);
        if (cos < -1) {
            return -1;
        }
        if (cos > 1) {
            return 1;
        }
        return cos;
    }
}
