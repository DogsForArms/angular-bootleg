import { Component, ViewChild, Input, ElementRef } from '@angular/core'

@Component({
    moduleId: module.id,
    selector: 'bl-video',
    template: '' +
`<video controls #player>
    <source src="{{videoSource}}" type="video/mp4" />
    Browser not supported
</video>`
})

export class VideoComponent {

    @ViewChild('player') 
    player: any;
    
    @Input()
    controls: boolean;

    @Input() 
    loop: boolean;

    @Input()
    muted: boolean;

    @Input()
    videoSource: string;

    constructor() {}

    ngAfterViewInit() {
        var playerElement: HTMLVideoElement = this.player.nativeElement
        playerElement.loop = this.loop
        playerElement.muted = this.muted
        playerElement.controls = this.controls
        playerElement.autoplay = true
    }
}