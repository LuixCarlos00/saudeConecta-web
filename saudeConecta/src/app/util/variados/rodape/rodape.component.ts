import { Component, OnInit } from '@angular/core';
import { ModelService } from 'src/app/service/Model_service/Model.service';



@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css']
})
export class RodapeComponent implements OnInit {

  constructor(public modelService: ModelService) { }

  ngOnInit() {
  }



  estaLogado(): Boolean {
    if (this.modelService.verificarLogin() ) {
      return true;
    }else{
      return false;
    }

  }
}
