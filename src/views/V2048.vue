<script>
    import Square2048 from '../components/2048/Square2048.vue';

    export const MIN = 0; /* Minimum x or column index */
    export const MAX = 3; /* Maximum x or column index */
    export const EMPTY_VALUE = 0;
    export const FIRST_VALUE = 1;
    export const LAST_VALUE = 2048;

    export const INCREASING = {
        onset: MIN,
        end: MAX,
        step: 1
    }

    export const DECREASING = {
        onset: MAX,
        end: MIN,
        step: -1
    }

    export const UP = {
        x: -1,
        y: 0
    }
    export const DOWN = {
        x: 1,
        y: 0
    }
    export const LEFT = {
        x: 0,
        y: -1
    }
    export const RIGHT = {
        x: 0,
        y: 1
    }

    export default {
        components: { Square2048 },
        data() {
            return {
                grid: [],
                score: 1
            }
        },
        created() {
            window.addEventListener('keydown', (e) => {
                switch (e.key)
                {
                    case 'ArrowLeft':
                        this.move(LEFT);
                        break;
                    case 'ArrowUp':
                        this.move(UP);
                        break;
                    case 'ArrowRight':
                        this.move(RIGHT);
                        break;
                    case 'ArrowDown':
                        this.move(DOWN);
                        break;
                }
            });

            for (let x = MIN; x <= MAX; x++)
            {
                this.grid[x] = [];
                for (let y = MIN; y <= MAX; y++)
                {
                    this.grid[x][y] = this.square(0);
                }
            }

            this.insertSquare();
        },
        methods: {
            square(value) {
                return {
                    value: value,
                    moving: false,
                    merged: false
                }
            },
            insertSquare()
            {
                if (!this.isFullGrid())
                {
                    let emptySquares = [];
                    for (let x = MIN; x <= MAX; x++)
                    {
                        for (let y = MIN; y <= MAX; y++)
                        {
                            if (this.isEmpty(x, y))
                            {
                                emptySquares.push({
                                    x: x,
                                    y: y
                                });
                            }
                        }
                    }

                    let randomIndex = emptySquares[Math.floor((Math.random() * emptySquares.length))];
                    
                    this.grid[randomIndex.x][randomIndex.y].value = FIRST_VALUE;
                }
            },
            calculateScore() {
                this.score = 0;
                for (let x = MIN; x <= MAX; x++)
                {
                    for (let y = MIN; y <= MAX; y++)
                    {
                        this.score += this.grid[x][y].value;
                    }
                }
            },

            isOutOfGrid(x, y)
            {
                return x < MIN || x > MAX || y < MIN || y > MAX;
            },

            getSquare(x, y)
            {
                return this.grid[x][y];
            },

            isEmpty(x, y)
            {
                return this.grid[x][y].value === 0;
            },

            isMovingOver()
            {
                for (let x = MIN; x <= MAX; x++)
                {
                    for (let y = MIN; y <= MAX; y++)
                    {
                        if (this.grid[x][y].moving)
                        {
                            return false;
                        }
                    }
                }

                return true;
            },

            isFullGrid()
            {
                for (let x = MIN; x <= MAX; x++)
                {
                    for (let y = MIN; y <= MAX; y++)
                    {
                        if (this.isEmpty(x, y))
                        {
                            return false;
                        }
                    }
                }

                return true;
            },

            moveSquare(x, y, direction)
            {
                this.grid[x + direction.x][y + direction.y] = this.grid[x][y];
                this.grid[x][y] = this.square(EMPTY_VALUE);
            },

            mergeSquare(x, y, direction)
            {
                this.grid[x + direction.x][y + direction.y].value *= 2;
                this.grid[x + direction.x][y + direction.y].merged = true;
                this.grid[x][y] = this.square(EMPTY_VALUE);
            },

            move(direction)
            {          
                // Set all the involved square parameter moving to true
                for (let x = MIN; x <= MAX; x++)
                {
                    for (let y = MIN; y <= MAX; y++)
                    {
                        this.grid[x][y].moving = true;
                        this.grid[x][y].merged = false;
                    }
                }

                let x_order = direction.x === 1 ? DECREASING : INCREASING;
                let y_order = direction.y === 1 ? DECREASING : INCREASING;

                this.moveOnce(direction, x_order, y_order);

                while (!this.isMovingOver())
                {
                    this.moveOnce(direction, x_order, y_order);
                }

                this.insertSquare();

                this.calculateScore();
            },

            moveOnce(direction, x_order, y_order)
            {       
                for (let x = x_order.onset; x != x_order.end + x_order.step; x += x_order.step)
                {
                    for (let y = y_order.onset; y != y_order.end + y_order.step; y += y_order.step)
                    {
                        if (this.getSquare(x, y).moving)
                        {
                            /* If the square is empty or at the grid edge */
                            if (this.isEmpty(x, y) || this.isOutOfGrid(x + direction.x, y + direction.y))
                            {
                                /* Set the square moving to false */
                                this.grid[x][y].moving = false;
                            }
                            else
                            {
                                if (this.isEmpty(x + direction.x, y + direction.y))
                                {
                                    this.moveSquare(x, y, direction);
                                }
                                else
                                {
                                    if (this.getSquare(x, y).value === this.getSquare(x + direction.x, y + direction.y).value &&
                                        !this.getSquare(x + direction.x, y + direction.y).merged)
                                    {
                                        this.mergeSquare(x, y, direction);
                                    }
                                    else
                                    {
                                        this.grid[x][y].moving = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<template>
    <div class="v2048">
        <div class="score">
            Score : {{ score }}
        </div>
        <div class="grid">
            <template v-for="(_,x) in grid">
                <template v-for="(_,y) in grid[x]" :key="4*x+y">
                    <Square2048 :value="grid[x][y].value" />
                </template>
            </template> 
        </div>

    </div>
</template>

<style scoped>

    .v2048
    {
        background-color: hsl(0,0%,10%);

        min-height: 100vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    .score
    {
        color: #fff;
        font-size: 35px;
    }

    .grid
    {
        background-color: hsl(0, 0%, 70%);

        padding: 10px;

        border-radius: 15px;

        display: grid;
        gap: 10px;
        grid-template-columns: repeat(4, 100px);
        grid-template-rows: repeat(4, 100px);
    }

</style>
