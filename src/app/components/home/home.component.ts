import { Component, OnInit } from '@angular/core';
import {RoomService} from '../../core/services/room/room.service';
import {RoomType} from '../../core/enums/room/room-type';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private roomService: RoomService, private router: Router) { }

  ngOnInit(): void {
  }

  onCreateKanbanBoard(): void {
    // add hotjar
    // tslint:disable-next-line:only-arrow-functions
    // (function(h,o,t,j,a,r){
    //   // tslint:disable-next-line:only-arrow-functions
    //   // @ts-ignore
    //   h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    //   // @ts-ignore
    //   h._hjSettings={hjid:3230629,hjsv:6};
    //   a=o.getElementsByTagName('head')[0];
    //   r=o.createElement('script');r.async=1;
    //   // @ts-ignore
    //   r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    //   a.appendChild(r);
    // })(window, document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

    // add clarity
    // tslint:disable-next-line:only-arrow-functions
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};

      const head=l.getElementsByTagName('head')[0];

      t=l.createElement(r);t.async=1;
      t.src="https://www.clarity.ms/tag/"+i;
      head.appendChild(t);
    })(window, document, "clarity", "script", "ef4rv2hxqo");


    this.roomService.createRoom(RoomType.KANBAN_BOARD).subscribe((uuid) => {
      this.router.navigate(['/kanban-board/' + uuid]);
    });
  }

  onCreateKanbanSystem(): void {
    this.roomService.createRoom(RoomType.KANBAN_SYSTEM).subscribe((uuid) => {
      this.router.navigate(['/kanban-system/' + uuid]);
    });
  }

}
