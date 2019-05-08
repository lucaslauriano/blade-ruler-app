import { Component, OnInit } from '@angular/core';
import {
  Categories,
  CategoriesService
} from 'src/app/services/categories.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public categories: Categories[];
  public pageTitle: any;

  constructor(private categoriesService: CategoriesService) {
    this.pageTitle = 'Categoria';
  }

  ngOnInit() {
    this.categoriesService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  remove(item) {
    this.categoriesService.removeCategorie(item.id);
  }

}
