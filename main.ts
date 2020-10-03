radio.onReceivedNumber(function (receivedNumber) {
    a = receivedNumber
})
function LED制御 (LED: number) {
    if (LED == 1) {
        strip.showColor(neopixel.colors(RGBColors.Red))
    } else if (LED == 2) {
        strip.showColor(neopixel.colors(RGBColors.Green))
    } else if (LED == 3) {
        strip.showColor(neopixel.colors(RGBColors.Blue))
    } else if (LED == 4) {
        strip.showColor(neopixel.colors(RGBColors.Yellow))
    } else {
        strip.clear()
    }
}
function モーター制御 (X: number, Y: number) {
    if (Y == 0) {
        L = X * 2
        R = X * -2
    } else if (Math.abs(X) < Math.abs(Y)) {
        L = Math.constrain((Y + X) * 2, -1023, 1023)
        R = Math.constrain((Y - X) * 2, -1023, 1023)
    } else {
        L = Math.constrain((Y + X) * 2, -1023, 1023)
        R = Math.constrain((Y - X) * 2, -1023, 1023)
    }
    levelmeter.DispalyLevel(L / 100, R / 100)
    if (L >= 0) {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.analogWritePin(AnalogPin.P8, L)
    } else {
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.analogWritePin(AnalogPin.P12, 0 - L)
    }
    if (R >= 0) {
        pins.digitalWritePin(DigitalPin.P16, 0)
        pins.analogWritePin(AnalogPin.P14, R)
    } else {
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.analogWritePin(AnalogPin.P16, 0 - R)
    }
}
radio.onReceivedString(function (receivedString) {
    saveString = receivedString
})
let y = 0
let x = 0
let コマンド = ""
let R = 0
let L = 0
let saveString = ""
let radioGroup = 0
let a = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P0, 4)
strip.clear()
a = 0
let 無線チャンネル設定中 = true
getradiogroup.initRadioGroup()
basic.showIcon(IconNames.SmallHeart)
while (radioGroup == 0) {
    radioGroup = getradiogroup.getRadioGroup(saveString)
    if (radioGroup == 0) {
        basic.showIcon(IconNames.Sad)
    } else {
        watchfont.showNumber2(radioGroup)
        basic.pause(2000)
    }
}
saveString = ""
無線チャンネル設定中 = false
radio.setTransmitPower(7)
let 閾値 = 100
basic.forever(function () {
    if (saveString != "" && !(無線チャンネル設定中)) {
        コマンド = split.split(saveString)[0]
        x = parseFloat(split.split(saveString)[1])
        y = parseFloat(split.split(saveString)[2])
        if (Math.abs(x) < 閾値) {
            x = 0
        }
        if (Math.abs(y) < 閾値) {
            y = 0
        }
        モーター制御(x, y)
    }
    LED制御(a)
})
