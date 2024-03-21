import { Vector } from "./vector";

export class CaughtBall {
    public ball: Ball;
    private _startedMoving: Date;
    private _startedCenter: Vector;

    public constructor(ball: Ball) {
        this.ball = ball;
        this._startedCenter = this.ball.center.clone();
        this._startedMoving = new Date();
        this.ball.stop();
    }

    public releaseBall(): void {
        const delta = +new Date() - +this._startedMoving;
        const direction = this.ball.center.subtract(this._startedCenter);
        const length = direction.length();
        if (Math.abs(delta) > 0.01) {
            this.ball.velocity = length / delta;
            this.ball.direction = direction.normalize(length);
        }
    }

    public resetMove(): void {
        this._startedCenter = this.ball.center.clone();
        this._startedMoving = new Date();
    }
}

export class Ball {
    public static readonly Radius = 15;
    private static readonly _MomentumLoss = 0.8;

    public center: Vector;
    public fill: string = "green";
    public velocity: number = 0;
    public direction: Vector | null = null;

    public constructor(x: number, y: number) {
        this.center = new Vector(x, y);
    }

    public isInside(x: number, y: number): boolean {
        if ((x - this.center.x) ** 2 + (y - this.center.y) ** 2 < Ball.Radius ** 2) {
            return true;
        }
        return false;
    }

    public chechCollision(ball: Ball): boolean {
        if (ball.center.subtract(this.center).lengthSquared() < (2 * Ball.Radius) ** 2) {
            return true;
        }
        return false;
    }

    public stop() {
        this.direction = null;
        this.velocity = 0;
    }

    public gotHit(ball: Ball): void {
        if (!ball.direction) {
            return;
        }
        const toStopedNorm = this.center.subtract(ball.center).normalize();
        const cos = ball.direction.cos(toStopedNorm);
        const sin = Math.sqrt(1 - cos ** 2);

        if (cos > 0.001) {
            this.velocity = ball.velocity * cos * Ball._MomentumLoss;
            this.direction = toStopedNorm;
        }
        ball.velocity = ball.velocity * sin * Ball._MomentumLoss;
        ball.direction = ball.direction.subtract(toStopedNorm).normalize();

        ball.updateBall(20)
        this.updateBall(20)
    }

    public bounceOffX(): void {
        if (!this.direction) {
            return;
        }
        this.direction.x = -this.direction.x;
        this.center.x += this.direction.x * 10
        this.velocity *= Ball._MomentumLoss;
    }

    public bounceOffY(): void {
        if (!this.direction) {
            return;
        }
        this.direction.y = -this.direction.y;
        this.center.y += this.direction.y * 10
        this.velocity *= Ball._MomentumLoss;
    }

    public updateBall(deltaTime: number): void {
        if (!this.direction) {
            return;
        }

        const scaled = this.direction.scale(this.velocity * deltaTime);
        if (Number.isNaN(scaled.x) || Number.isNaN(scaled.y)) {
            console.warn("isNaN");
            console.log(`v: ${this.velocity} d: ${deltaTime}`);
            console.log(`x: ${scaled.x} y: ${scaled.y}`);
            this.direction = null;
            return;
        }
        this.center = this.center.add(scaled);
    }
}
