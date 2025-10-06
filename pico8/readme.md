new poco 8

```
def func __init__(){
    MSG ="hello world"
    X = 64,64
    y = 64,64

}

def func __draw__(){
    print(MSG)
}

def func __update__(){
    if x> 128
        print(dx = dx * -1)
    else if y >128
        print(dy = dy * -1)
}

```

```
 IF THE TEXT X POSITION IS ABOUT TO GO OFF THE SCREEN
 -- (WE CALCULATE THE RIGHT-SIDE BASED ON THE LENGTH OF "MSG")
 IF X<1 OR X>128-#MSG*4 THEN
  -- FLIP THE X DIRECTION
  DX*=-1
 -- ELSE IF TEXT Y POSITION IS ABOUT TO GO OFF THE SCREEN
 -- (WE -5 FOR THE BOTTOM CHECK AS TEXT IS 5PX HIGH)
 ELSEIF Y<1 OR Y>127-5 THEN
  -- FLIP THE Y DIRECTION
  DY*=-1
 END
END

-- THIS IS OUR DRAW FUNCTION, WHICH WILL BE CALLED EVERY FRAME
FUNCTION _DRAW()
 -- CLEAR THE SCREEN USING COL 1 (DARK BLUE)
 CLS(1)
```