enum RadioMessage {
    message1 = 49434,
    ready = 31336,
    ok = 31318,
    A = 18289,
    B = 9031,
    A_B = 5036
}
radio.onReceivedNumber(function (receivedNumber) {
    coin_X = receivedNumber
})
radio.onReceivedMessage(RadioMessage.A, function () {
    X += -1
    screen()
})
function screen () {
    basic.clearScreen()
    if (admin == 1) {
        if (X > -1 && X < 5) {
            led.plot(X, 4)
            led.plotBrightness(coin_X, 0, 123)
        }
    } else {
        if (X > 4 && X < 11) {
            led.plot(X - 5, 4)
            led.plotBrightness(coin_X - 5, 0, 123)
        }
    }
}
input.onButtonPressed(Button.A, function () {
    if (start == 1) {
        X += -1
        radio.sendMessage(RadioMessage.A)
        screen()
    }
})
radio.onReceivedMessage(RadioMessage.ok, function () {
    if (start == 0) {
        admin = 2
    }
})
radio.onReceivedMessage(RadioMessage.ready, function () {
    if (start == 0) {
        if (ready) {
            radio.sendMessage(RadioMessage.ok)
            _2_ready = true
        } else {
            _2_ready = true
            admin = 2
        }
    }
})
input.onButtonPressed(Button.AB, function () {
    if (start == 1) {
        if (X == coin_X) {
            radio.sendMessage(RadioMessage.A_B)
            coin_X = randint(0, 10)
            radio.sendNumber(coin_X)
            screen()
        }
    }
})
input.onButtonPressed(Button.B, function () {
    if (start == 1) {
        X += 1
        radio.sendMessage(RadioMessage.B)
        screen()
    }
})
radio.onReceivedMessage(RadioMessage.B, function () {
    X += 1
    screen()
})
radio.onReceivedMessage(RadioMessage.A_B, function () {
    screen()
})
let start = 0
let admin = 0
let X = 0
let coin_X = 0
let _2_ready = false
let ready = false
basic.showLeds(`
    # . . . .
    . # . . .
    . . # . .
    . . . # .
    . . . . #
    `)
radio.sendMessage(RadioMessage.message1)
ready = false
_2_ready = false
basic.forever(function () {
    if (start == 0) {
        if (input.buttonIsPressed(Button.AB)) {
            if (ready == false) {
                radio.sendMessage(RadioMessage.ready)
                ready = true
                if (admin == 0) {
                    admin = 1
                }
            }
        }
    }
})
basic.forever(function () {
    if (start == 0) {
        if (ready && !(_2_ready)) {
            basic.showLeds(`
                # . . . .
                # # . . .
                # # # . .
                # # # # .
                # # # # #
                `)
        }
        if (_2_ready && !(ready)) {
            basic.showLeds(`
                # # # # #
                . # # # #
                . . # # #
                . . . # #
                . . . . #
                `)
        }
        if (_2_ready && ready) {
            basic.showLeds(`
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                # # # # #
                `)
            basic.pause(1000)
            if (admin == 1) {
                basic.showLeds(`
                    . . # . .
                    . # . . .
                    # # # # #
                    . # . . .
                    . . # . .
                    `)
            } else {
                basic.showLeds(`
                    . . # . .
                    . . . # .
                    # # # # #
                    . . . # .
                    . . # . .
                    `)
            }
            basic.pause(1000)
            start = 1
            if (admin == 1) {
                coin_X = randint(0, 10)
                radio.sendNumber(coin_X)
            }
            screen()
        }
    }
})
