export function initWaves(){
  const existing = document.getElementById('waves-canvas')
  if(existing) return
  const canvas = document.createElement('canvas')
  canvas.id = 'waves-canvas'
  canvas.style.position = 'fixed'
  canvas.style.left = 0
  canvas.style.top = 0
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.zIndex = '-2'
  canvas.style.pointerEvents = 'none'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight }
  resize()
  addEventListener('resize', resize)
  let t = 0
  function draw(){
    t += 0.01
    ctx.clearRect(0,0,canvas.width, canvas.height)
    // draw three gradient waves
    for(let i=0;i<3;i++){
      ctx.beginPath()
      const amplitude = 60 + i*30
      const yOffset = canvas.height*0.6 - i*40
      ctx.moveTo(0, canvas.height)
      for(let x=0;x<=canvas.width; x+=10){
        const y = yOffset + Math.sin((x*0.01) + t*(0.6+i*0.4)) * amplitude
        ctx.lineTo(x,y)
      }
      ctx.lineTo(canvas.width, canvas.height)
      const g = ctx.createLinearGradient(0,0,canvas.width,0)
      if(i===0){
        g.addColorStop(0, 'rgba(124,58,237,0.18)')
        g.addColorStop(1, 'rgba(6,182,212,0.08)')
      } else if(i===1){
        g.addColorStop(0, 'rgba(99,102,241,0.12)')
        g.addColorStop(1, 'rgba(236,72,153,0.06)')
      } else {
        g.addColorStop(0, 'rgba(14,165,233,0.08)')
        g.addColorStop(1, 'rgba(236,72,153,0.04)')
      }
      ctx.fillStyle = g
      ctx.fill()
      ctx.closePath()
    }
    requestAnimationFrame(draw)
  }
  draw()
}
