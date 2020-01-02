import { Component, OnInit, Input } from '@angular/core';
import { StarSystem } from '../../../model/star-system';
import { Planet } from '../../../model/planet';
import { GalaxyMapService } from '../../../services/galaxy-map.service';
import { ColorService } from '../../../services/color.service';

@Component({
  selector: 'app-star-system-info',
  templateUrl: './star-system-info.component.html',
  styleUrls: ['./star-system-info.component.css']
})
export class StarSystemInfoComponent implements OnInit {

  @Input() starSystem: StarSystem;

  constructor(
    private map: GalaxyMapService,
    private colorService: ColorService
  ) { }

  ngOnInit() {
  }

  select(id: string) {
    this.map.select(id);
  }
  
}
