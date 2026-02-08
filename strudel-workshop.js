setcpm(128/4)

$chords: note("[0,2,4,6,8](<5 >,16)")
  .scale("C:major")
  .s("supersaw*5")
  .late("[0 1]*5")
  .legato("1 2 1 1") // duration

$chords_2: note("[0 [2 4 [6 8]] 0 10](<4 >,16)")
  .fast("1 1 2")
  .scale("B:minor")
  .s("triangle*2")
  .detune("<.1 .2>")
  .late("[0 0.2]*0.5")
  .legato("1 2 0.5 1") // duration
  .room(5) // reverb

$a: note("<[e5 ~ c5 ~] [c5 ~ d5 ~] [e5 ~ g5 ~] [d5 ~ b4 ~]>")
    .sound("triangle")
    .lpf(3000)  // Static filter
    .resonance(2)
    .room(0.6)
    .delay(0.6)
    .gain("<0 0 0.4 0.45 0.5>".slow(16))
    .release(0.4)
    .attack(0.05)

$b: note("[~ ~ ~ ~] [~ ~ ~ ~] [~ ~ ~ ~]  <[a5 ~ ~ ~ ~ ~ ~ ~] [f5 ~ ~ ~ ~ ~ ~ ~] [g5 ~ ~ ~ ~ ~ ~ ~] [e5 ~ ~ ~ ~ ~ ~ ~]>".slow(4))
    .sound("sine")
    .lpf(3200)
    .resonance(2)
    .room(0.7)
    .delay(0.5)
    .gain("0 0 0 0  0 0 0.45 0.5".slow(16))
    .release(2.0)
    .attack(0.1)

$c: note("<[~ ~ a5 ~] [~ ~ f5 ~] [~ ~ g5 ~] [~ ~ d5 ~]>")
    .sound("supersaw")
    .lpf(3200)
    .room(0.6)
    .delay(0.6)
    .gain("0 0 0 0  0 0 0 0  0.5".slow(16))
    .release(0.5)
    .attack(0.03)

$kick: s("bd!4")
  .duck(8)
  .duckdepth(1)

$hat: s("hh!3")

$: note("[<-7 -3 -5 -3>/2 1 2 4]*2")
  .scale("F:major")
  .fm("3")
  .fmh("2")
  .spectrum()
