import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name:'fake' })
export class FakePipe implements PipeTransform {

    private overwrite: string

    constructor(overwrite: string) {
        this.overwrite = overwrite
    }

    transform(input: string) {
        let result = this.overwrite.substring(0, input.length)
        console.log('"%s" -> "%s"', input, result)
        return result
    }

}
