/**
 * Functions are mapped to blocks using various macros
 * in comments starting with %. The most important macro
 * is "block", and it specifies that a block should be
 * generated for an **exported** function.
 */

//% color="#AA278D" weight=100
namespace ADC {
    //% block
    export function setup(): void {
        pins.spiFormat(8, 0); // 8-bit, mode 0
        pins.spiFrequency(1000000); // 1 MHz
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13); // MOSI, MISO, SCK
        pins.digitalWritePin(DigitalPin.P16, 1); // Set CS HIGH
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
    }


    //% block
    export function read_adc(channel: number): number {
        if (channel != 0 && channel != 1) {
            basic.showNumber(channel)
            return 0
        }

        let command = (channel == 0) ? 0b11000000 : 0b11010000

        let writeBuf = pins.createBuffer(1)
        let readBuf = pins.createBuffer(1)

        // Send command
        writeBuf[0] = command
        pins.digitalWritePin(DigitalPin.P16, 0) // CS LOW
        pins.spiTransfer(writeBuf, readBuf)
        let high = readBuf[0]

        // Send dummy byte
        writeBuf[0] = 0x00
        pins.spiTransfer(writeBuf, readBuf)
        let low = readBuf[0]
        pins.digitalWritePin(DigitalPin.P16, 1) // CS HIGH

        let result = ((high & 0x0F) << 8) | low
        return result
    }

}