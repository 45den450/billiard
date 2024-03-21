import { Ball, CaughtBall } from "./ball";

interface Size {
    width: number;
    height: number;
}

export class GameManager {
    private static readonly _BallsCount = 16;

    public readonly balls: Ball[];

    private _caughtBall: CaughtBall | null = null;
    private _lastUpdated: Date = new Date();

    private _size: Size;

    public constructor(size: Size) {
        this._size = size;
        this.balls = this._getInitBalls(size);
    }

    public releaseBall(): void {
        if (!this._caughtBall) {
            return;
        }
        this._caughtBall.releaseBall();
        this._caughtBall = null;
    }

    public grabBall(x: number, y: number): void {
        if (this._caughtBall) {
            return;
        }
        for (const ball of this.balls) {
            if (ball.isInside(x, y)) {
                this._caughtBall = new CaughtBall(ball);
                break;
            }
        }
    }

    public getBallAtPoint(x: number, y: number): Ball | null {
        for (const ball of this.balls) {
            if (ball.isInside(x, y)) {
                return ball;
            }
        }
        return null;
    }

    public moveCaughtBall(x: number, y: number): void {
        if (!this._caughtBall) {
            return;
        }
        this._caughtBall.ball.center.x = x;
        this._caughtBall.ball.center.y = y;
    }

    public moveStop(): void {
        if (!this._caughtBall) {
            return;
        }
        this._caughtBall.resetMove();
    }

    public render(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, context.canvas.width, context.canvas.width);
        this.updateCanvas(context);
        this.balls.forEach(ball => this._drawBall(ball, context));
        this._chechBallCollisions();
        this._chechWallCollisions();
        this._lastUpdated = new Date();
    }

    private _chechBallCollisions() {
        const epsilon = 0.001;
        for (let i = 0; i < this.balls.length; i++) {
            const ball1 = this.balls[i];
            for (let j = i + 1; j < this.balls.length; j++) {
                const ball2 = this.balls[j];
                if (ball1.chechCollision(ball2)) {
                    if (Math.abs(ball2.velocity) > epsilon) {
                        ball1.gotHit(ball2);
                    } else if (Math.abs(ball1.velocity) > epsilon) {
                        ball2.gotHit(ball1);
                    }
                    break;
                }
            }
        }
    }

    private _chechWallCollisions() {
        for (const ball of this.balls) {
            if (ball.center.x - Ball.Radius <= 0 || ball.center.x + Ball.Radius >= this._size.width) {
                ball.bounceOffX();
            }
            if (ball.center.y - Ball.Radius <= 0 || ball.center.y + Ball.Radius >= this._size.height) {
                ball.bounceOffY();
            }
        }
    }

    private _getInitBalls(size: Size): Ball[] {
        const balls = [];
        for (let i = 0; i < GameManager._BallsCount; i++) {
            balls.push(new Ball(this._getRandomInt(size.width), this._getRandomInt(size.height)));
        }
        return balls;
    }

    private _getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    private _drawBall(ball: Ball, context: CanvasRenderingContext2D) {
        ball.updateBall(+new Date() - +this._lastUpdated);
        context.beginPath();
        context.arc(ball.center.x, ball.center.y, Ball.Radius, 0, 2 * Math.PI, false);

        context.fillStyle = ball.fill;
        context.fill();

        context.lineWidth = 3;
        context.strokeStyle = "#000000";
        context.stroke();
        context.closePath();
    }

    public updateCanvas(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#eeeeee";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = "#000000";
        context.lineWidth = 3;
        context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
    }
}
