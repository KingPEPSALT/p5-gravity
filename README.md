# p5-gravity
![p5-gravity-logo.png](https://media.discordapp.net/attachments/508553890191507475/747957618517213194/unknown.png?width=689&height=677)\
A gravity sandbox made in p5.js

## Explanation
Although I'm not too sure of the orthodox and expected when working with physics along computers, I did manage to create this using the little knowledge I have. Just with these few equations (if the image does not appear, the LaTex will so you can see these for yourself):

![$ F = ma $](https://latex.codecogs.com/png.latex?F%20%3D%20ma)\
![$ F = G\frac{m_xm_y}{r} $](https://latex.codecogs.com/png.latex?F%20%3D%20G%5Cfrac%7Bm_xm_y%7D%7Br%7D)\
![$ a = \frac{\Delta v}{\Delta t} $](https://latex.codecogs.com/png.latex?a%20%3D%20%5Cfrac%7B%5CDelta%20v%7D%7B%5CDelta%20t%7D)

These were then used to create a final equation where △v is only the magnitude of the velocity vector because acceleration in F=ma is not a vector. The vector however is simply the distance between the two bodies normalised.\
![$\Delta V_x=\left[\Delta t\frac{G\frac{m_xm_y}{r}}{m_x}\right]\hat r$](https://latex.codecogs.com/png.latex?%5CDelta%20V_x%3D%5Cleft%5B%5CDelta%20t%5Cfrac%7BG%5Cfrac%7Bm_xm_y%7D%7Br%7D%7D%7Bm_x%7D%5Cright%5D%5Chat%20r)\
This can simply be added onto the velocity of any of the bodies and the resulting velocity vector will be formed.

## [View on github pages](https://kingpepsalt.github.io/p5-gravity/gravity/)

If you create lots of small planets and press H you're likely to crash, do the same with T and it'll crash or slow down your computer. Be warned.
