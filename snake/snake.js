function Snake(options) {
    this.options = options;
    this.element = this.options.element;
    this.snake = [];
    this.food = [];
    this.init();
}

Snake.prototype.init = function() {
    this.initField();
    this.initSnake();
    this.generateFood(this.options.food.itemsCount);
    this.stepFunction();
    this.listen();
}

Snake.prototype.initField = function() {
    this.element.style.width = (this.options.field.sizeX*this.options.cellSize)+'px';
    this.element.style.height = (this.options.field.sizeY*this.options.cellSize)+'px';
}

Snake.prototype.initSnake = function() {
    for (var i = 0, len = this.options.snake.minSize; i < len; i++) {
        var snakeItem = document.createElement('div');

        snakeItem.className = 'snake__item';
        snakeItem.style.width = this.options.cellSize+'px';
            snakeItem.style.height = this.options.cellSize+'px';

        snakeItem.style.top = 0;
        snakeItem.style.left = (i*this.options.cellSize)+'px';

        this.snake.push({
            element: snakeItem,
            posX: i,
            posY: 0,
            direction: 'right',
        });

        this.element.appendChild(snakeItem);
    }
}

Snake.prototype.move = function() {
    for (var i = 0, len = this.snake.length; i < len; i++) {
        var snakeItem = this.snake[i];
        if (snakeItem.in_stomach) {
            if (snakeItem.posX === this.snake[i+1].posX && snakeItem.posY === this.snake[i+1].posY) {
                snakeItem.in_stomach = false;
                snakeItem.element.className = 'snake__item';
            }

            continue;
        }

        switch (snakeItem.direction) {
            case 'left':
                snakeItem.posX--;
                snakeItem.element.style.left = (snakeItem.posX*this.options.cellSize)+'px';
                break;
            case 'right':
                snakeItem.posX++;
                snakeItem.element.style.left = (snakeItem.posX*this.options.cellSize)+'px';
                break;
            case 'top':
                snakeItem.posY--;
                snakeItem.element.style.top = (snakeItem.posY*this.options.cellSize)+'px';
                break;
            case 'bottom':
                snakeItem.posY++;
                snakeItem.element.style.top = (snakeItem.posY*this.options.cellSize)+'px';
                break;
        }
    }

    for (var i = 0; i < len-1; i++) {
        this.snake[i].direction = this.snake[i+1].direction;
    }

    var head = this.snake[this.snake.length-1];
    for (var i = 0, len = this.food.length; i < len; i++) {
        var food = this.food[i];
        if (food.posX === head.posX && food.posY === head.posY) {
            var snakeItem = food;
            snakeItem.element.className = 'snake__item snake__item_in-stomach';
            snakeItem.in_stomach = true;
            this.snake.unshift(snakeItem);
            this.food.splice(i, 1);

            this.generateFood(1);


        }
    }
}


Snake.prototype.changeDirection = function(direction) {
    var head = this.snake[this.snake.length-1];

    head.direction = direction;
}

Snake.prototype.generateFood = function(itemsRemain) {
    var x = Math.ceil(Math.random()*this.options.field.sizeX)-1,
        y = Math.ceil(Math.random()*this.options.field.sizeY)-1;

    for (var i = 0, len = this.snake.length; i < len; i++) {
        var snakeItem = this.snake[i];
        if (snakeItem.posX === x && snakeItem.posY === y) {
            return this.generateFood(itemsRemain);
        }
    }

    var food = document.createElement('div');

    food.className = 'snake__food';
    food.style.width = this.options.cellSize+'px';
        food.style.height = this.options.cellSize+'px';

    food.style.top = (y*this.options.cellSize)+'px';
    food.style.left = (x*this.options.cellSize)+'px';

    this.food.push({
        element: food,
        posX: x,
        posY: y
    });
    this.element.appendChild(food);
    var scoreCount = document.getElementById('count');
    scoreCount.value = i-4;

    if (itemsRemain > 1) {
        this.generateFood(itemsRemain-1);
    }
}

Snake.prototype.listen = function() {
    var _this = this,
        directions = {
            38: 'top',
            40: 'bottom',
            37: 'left',
            39: 'right'
        }
    window.addEventListener('keydown', function( e ) {

        if (e.keyCode in directions) {
            _this.changeDirection(directions[e.keyCode]);
        }
    })
}

Snake.prototype.checkGameOver = function() {
    var head = this.snake[this.snake.length-1];

    if (head.posX == this.options.field.sizeX) {
        return true;
    }
    else if (head.posY == this.options.field.sizeY) {
        return true;
    }
    else if (head.posX < 0) {
        return true;
    }
    else if (head.posY < 0) {
        return true;
    }

    for (var i = 0, len = this.snake.length-1; i < len; i++) {
        var snakeItem = this.snake[i];
        if (head.posX === snakeItem.posX && head.posY === snakeItem.posY && !snakeItem.in_stomach) {
            return true;
        }
    }

    return false;
}

Snake.prototype.stepFunction = function() {
    var _this = this;
    if (!this.checkGameOver()) {
        return setTimeout(function () {
            _this.move();
            _this.stepFunction();
        }, this.options.snake.speed);
    }

    this.die();
}

Snake.prototype.die = function() {
    var _this = this;
    for (var i = 0, len = this.snake.length; i < len; i++) {
        setTimeout(function() {
            var snakeItem = _this.snake.shift();
            snakeItem.element.className = 'snake__item snake__item_die';

            }, i*200);

    }


    for (var i = 0, len = this.food.length; i <= len; i++) {
        setTimeout(function() {
            var food = _this.food.shift();
            food.element.className = 'snake__food snake__food_die';

        }, i*200);
        if (i == len){
                // alert("Game over! Your score: " + document.getElementById('count').value);
            }
    }


}
new Snake({
    element: document.getElementById('snake'),
    cellSize: 20,
    field: {
        sizeX: 25,
        sizeY: 25
    },
    snake: {
        minSize: 4,
        speed: 100,
    },
    food: {
        itemsCount: 1,
    }
});