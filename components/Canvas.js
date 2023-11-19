import React from 'react';

function Canvas({...delegated}){
    const canvasRef = React.useRef(null);

    //CONSTANTES
    // shrink: reduccion en tamaño de cada cuadro cuando desaparece y aparecen otros dos
    // minSize : tamaño de lado minimo 
    // incrMin: incremento minimo en pixeles para desplazamiento de cuadros
    // incrMax: incremento maximo en pixeles para desplazamiento de cuadros
    const [iniX, iniY, iniSize, shrink, minSize, incrMin, incrMax] = [300, 150, 150, 0.65, 1, -4, 4]
    const COLORS = ['blue', 'green', 'pink', 'red', 'orange', 'yellow', 'purple', 'brown', 'black', 'gray', 'rebeccapurple', 'hotpink', 'cyan', 'magenta', 'lime', 'teal', 'navy', 'olive', 'maroon', 'fuchsia', 'silver'];

    const incrementos = React.useCallback(() => {
        const incrX = Math.random() * (incrMax - incrMin + 1) + incrMin; //Lo que se desplazara el cuadro en el eje X
        const incrY = Math.random() * (incrMax - incrMin + 1) + incrMin; //Lo que se desplazara el cuadro en el eje Y
        if(incrX===0 && incrY===0) return [-2, 2];
        if(incrX===-1 && incrY===-1) return [-2, 2];
        if(incrX===1 && incrY===1) return [-2, 2];

        return [incrX, incrY];

      },[]);
    

    const createSquare = React.useCallback((sideLength) => {
        const [vx, vy] = incrementos()
        return {
            id: crypto.randomUUID(),
            x: iniX - sideLength/2,
            y: iniY - sideLength/2,
            side: sideLength,
            vx,
            vy,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            drawRect(ctx){
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x,this.y,this.side,this.side);
            },
    
        }
    });


    const addSquares = (ctx, sideLength, duplicate = true ) => {
        if(duplicate) {
            squares.push(createSquare(sideLength), createSquare(sideLength));
        } else {
            squares.push(createSquare(sideLength));
        }
    }

    //State that keeps track of squares to be drawn
    //const [squares, setSquares] = React.useState([createSquare(100)]);
    const squares = [createSquare(iniSize)]
    
    const draw = React.useCallback((ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        squares.map(square => {
            square.drawRect(ctx);
            square.x += square.vx;
            square.y += square.vy
            if (square.y + square.side > canvasRef.current.height 
                || square.y + square.vy < 0 
                || square.x + square.side > canvasRef.current.width 
                || square.x + square.vx < 0
            ) {
                square.x = square.y = square.vx = square.vy = 0;
                square.color = 'rgb(0,0,0,0)'
               
               //addSquares(square.id, ctx, square.side*shrink)
               if(square.side*shrink < minSize){
                addSquares(ctx, minSize, false); 
               } else {
                addSquares(ctx, square.side*shrink);
               }
            }
        });
      },[squares]);

    React.useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        let animationFrameId;
        
        //Our draw came here
        const render = () => {
        draw(ctx)
        animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        
        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    },[draw]);

    return (
        <canvas ref={canvasRef} {...delegated} className="canvitas">
            Squares of different colors all over the place like a big burst of a color star in the universe
        </canvas>
    );
}

export default Canvas;