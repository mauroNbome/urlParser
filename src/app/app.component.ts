import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  data: any;

  str1: string = '/:version/api/:collection/:id';
  str2: string = '/6/api/listings/3?sort=desc&limit=10';

  ngOnInit() {}

  parseUrl(str1: string, str2: string) {
    let obj = {};
    const keys = str1
      .split('/')
      .map((key, index) => [key.startsWith(':'), index, key.replace(':', '')])
      .filter(([still, ,]) => still);

    const values = str2
      .split('?')[0]
      .split('/')
      .map((value, index) => [value, index]);

    keys.forEach((k) => {
      values.forEach((v, idx) => {
        if (k[1] === v[1]) {
          obj[k[2].toString()] = v[0];
        }
      });
    });

    // If we have parameters then:
    if (str2.includes('?')) {
      let toBeZipped = [];
      str2
        .split('?')[1]
        .split('&')
        .forEach((param) => {
          toBeZipped.push(param.split('='));
        });

      return { ...obj, ..._.fromPairs(toBeZipped) };
    } else {
      return obj;
    }
  }

  submit() {
    if (this.isValid) {
      this.data = this.parseUrl(this.str1, this.str2);
    }
  }

  get isValid() {
    // Verifying that strings matches.
    if (this.str1.split('/').length === this.str2.split('/').length) {
      if (this.str2.includes('?')) {
        let lengthStr2 = this.str2.split('/').length;

        return (
          this.str2.split('/')[lengthStr2 - 1].includes('?') &&
          this.str2.split('/')[lengthStr2 - 1].includes('=')
        );
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
