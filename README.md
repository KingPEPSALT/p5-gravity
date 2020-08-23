# p5-gravity
A gravity sandbox made in p5.js

## Explanation
Although I'm not too sure of the orthodox and expected when working with physics along computers, I did manage to create this using the little knowledge I have. Just with these few equations (if the image does not appear, the LaTex will so you can see these for yourself):
![$ F = ma $](https://i.imgur.com/ME1w383.png)
![$ F = G\frac{m_xm_y}{r} $](https://i.imgur.com/oeM8Ql9.png)
![$ a = \frac{\Delta v}{\Delta t} $](https://i.imgur.com/pGTVPOm.png)

These were then used to create a final equation where △v is only the magnitude of the velocity vector because acceleration in F=ma is not a vector. The vector however is simply the distance between the two bodies normalised.
![$\Delta V_x=\left(\Delta t\frac{G\frac{m_xm_y}{r}}{m_x}\right)\hat r}$](https://i.imgur.com/yjvIIYT.png)
This can simply be added onto the velocity of any of the bodies and the resulting velocity vector will be formed.

## [View on github pages](https://kingpepsalt.github.io/p5-gravity/gravity/)

## TODO
- Standardise units somehow; stop using pixels in the equations unless you use that everywhere
- Allow for user interaction; slinging bodies with the mouse to create an interactive effect
- Allow for user to change time and zoom; interactivity is the best.
